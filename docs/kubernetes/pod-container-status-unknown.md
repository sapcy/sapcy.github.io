---
format: md
title: "노드 장애 시 ContainerStatusUnknown·NodeStatusUnknown — kubectl 증상과 소스 코드"
description: "kubelet·노드 라이프사이클 컨트롤러가 갱신하는 API 필드와 upstream 코드 위치"
tags:
  - kubernetes
  - kubelet
---

운영 중 특정 노드가 응답하지 않거나 네트워크가 단절된 뒤, `kubectl describe pod`에서 컨테이너 `Reason`이 **`ContainerStatusUnknown`** 으로 보이거나 `describe node`에는 **`NodeStatusUnknown`** 이 찍히는 사례가 있었다. 
두 문자열이 비슷해 “노드 컨트롤러가 Pod 컨테이너 상태를 Unknown으로 바꾼다”고 오해하기 쉬운데, 실제로는 **어느 컴포넌트가 어떤 API 필드를 갱신하는지**를 코드로 확인할 필요가 있었다. kubelet이 런타임 상태를 주기적으로 맞추는 맥락은 [Kubelet PLEG](./kubelet-pleg)에서 정리해 두었다. 
아래 본문은 **Kubernetes upstream 소스 트리**를 기준으로 하며, 팀 클러스터는 **v1.xx.y**(실제 버전으로 교체)에 맞춰 diff만 확인하면 된다. 배포본에서 **kubelet `--sync-frequency`**, **Evented PLEG** 여부 등 설정이 다르면 관측 주기·증상 타이밍만 달라질 수 있다.

**노드 장애와 `ContainerStatusUnknown`은 같은 시각에 붙는 현상이 아니다.** 노드가 즉시 죽으면 해당 노드의 kubelet은 API에 PATCH를 못 올리므로, **etcd에 남은 마지막 Pod status**가 그대로일 수 있다. 반면 `ContainerStatusUnknown`은 kubelet이 **다시 CRI/PLEG 캐시와 맞추거나**, Pod **종료·삭제** 흐름에서 “이전에는 Running인데 지금은 상태를 확정할 수 없다”고 판단할 때 주로 나타난다. 관측·반영에 쓰이는 대략적인 주기는 다음과 같다(기본값·트리거 기준).

| 구분                          | 대략적 주기 / 트리거                                               |
| --------------------------- | ---------------------------------------------------------- |
| PLEG relist (Generic)       | 기본 **1초** (CRI가 느리면 한 사이클이 더 길어질 수 있음)                     |
| Evented PLEG 사용 시 폴백 relist | **300초**                                                   |
| Pod worker 다음 sync 예약       | **`SyncFrequency`** — KubeletConfiguration 기본 **60초** + 지터 |
| status manager → API        | **10초** 주기 풀 sync + 변경 시 배치                                |
| syncLoop 내부 tick            | **1초** (큐를 깨우는 용도에 가깝고, 모든 Pod를 매초 CRI에 묻는 주기는 아님)         |

:::tip 
PLEG(Pod Lifecycle Event Generator)는 kubelet 내부 컴포넌트로, 노드에서 실제로 실행 중인 Pod/Container 상태 변화를 감지해서 kubelet의 sync loop에 이벤트로 전달하는 역할을 한다.
쉽게 말하면 kubelet 안에서 **“컨테이너 런타임 상태를 주기적으로 확인해서, Pod 상태가 바뀌었는지 감시하는 감시자”** 라고 보면 된다.
:::
## 1. 운영에서 보이는 증상 (kubectl 예시)
노드가 응답하지 않거나 Kubelet이 더 이상 노드 상태를 올리지 않으면, 먼저 **Node** 쪽에서 아래와 비슷한 그림이 나옵니다.

```text
$ kubectl describe node worker-01
...
Conditions:
  Type             Status    Reason               Message
  ----             ------    ------               -------
  Ready            Unknown   NodeStatusUnknown    Kubelet stopped posting node status.
...
```

같은 시점에 **Pod**는 아직 이전 스냅샷이 남아 `Running`으로 보이다가, kubelet이 다시 동기화하거나 종료·삭제 흐름을 타면 컨테이너가 **Terminated**로 바뀌고 reason이 **`ContainerStatusUnknown`** 인 경우가 있습니다.

```text
$ kubectl describe pod my-app-7d4f8c9-xk2hj -n prod
...
Containers:
  app:
    Container ID:   containerd://...
    State:          Terminated
      Reason:       ContainerStatusUnknown
      Message:      The container could not be located when the pod was terminated
      Exit Code:    137
...
Conditions:
  Type              Status
  ----              ------
  Ready             False
  PodScheduled      True
...
```

또는 **삭제 직후** 등에 `LastTerminationState`에 비슷한 메시지가 붙는 형태도 나올 수 있습니다.

```text
    Last State:     Terminated
      Reason:       ContainerStatusUnknown
      Message:      The container could not be located when the pod was deleted.  The container used to be Running
      Exit Code:    137
```



---

## 2. 한눈에 보는 구분

| 관측 위치 | 대표 Reason | 누가 갱신하는가 |
|-----------|-------------|-----------------|
| `Node.status.conditions` (예: `Ready`) | `NodeStatusUnknown` | **kube-controller-manager** 내 노드 라이프사이클 컨트롤러 |
| `Pod.status.containerStatuses[].state` | `ContainerStatusUnknown` | **kubelet** (API로 올리는 Pod status의 일부) |

---

## 3. 실제 소스: `ContainerStatusUnknown` 문자열과 설정 위치

### 3.1 상수 정의

API에 노출되는 reason 문자열은 kubelet 쪽 `container` 패키지에 정의되어 있습니다.

*307:308:kubernetes/kubernetes/pkg/kubelet/container/runtime.go*
```go
// ContainerReasonStatusUnknown indicates a container the status of the container cannot be determined.
const ContainerReasonStatusUnknown string = "ContainerStatusUnknown"
```

바로 위에 CRI에서 쓰는 내부 상태 `ContainerStateUnknown`(`"unknown"`)도 같이 정의되어 있습니다.

*303:304:kubernetes/kubernetes/pkg/kubelet/container/runtime.go*
```go
// ContainerStateUnknown encompasses all the states that we currently don't care about (like restarting, paused, dead).
    ContainerStateUnknown State = "unknown"
```


### 3.2 CRI가 unknown이고, 직전 API 상태는 Running인 경우
`kubelet_pods.go`의 `convertToAPIContainerStatuses` 계열 로직에서, **내부 상태가 unknown**이면서 **이전에 API에 Running으로 잡혀 있던** 경우 `Terminated`로 올리고 reason을 `ContainerReasonStatusUnknown`으로 둡니다. 주석에 적힌 것처럼 run-once Pod가 두 번 도는 것을 막기 위한 구분(“한 번도 안 돌았다” vs “돌았는데 결과를 못 봤다”)도 여기서 갈립니다.

*2368:2389:kubernetes/kubernetes/pkg/kubelet/kubelet_pods.go*
```go
case cs.State == kubecontainer.ContainerStateUnknown &&
    oldStatus != nil && // we have an old status
    oldStatus.State.Running != nil: // our previous status was running
    
    reason := kubecontainer.ContainerReasonStatusUnknown
    // If the pod is restarting, the reason should be RestartingAllContainers
    if utilfeature.DefaultFeatureGate.Enabled(features.RestartAllContainersOnContainerExits) && podRestarting {
        reason = RestartingAllContainers
    }
    // if this happens, then we know that this container was previously running and isn't anymore (assuming the CRI isn't failing to return running containers).
    // you can imagine this happening in cases where a container failed and the kubelet didn't ask about it in time to see the result.
    // in this case, the container should not to into waiting state immediately because that can make cases like runonce pods actually run
    // twice. "container never ran" is different than "container ran and failed".  This is handled differently in the kubelet
    // and it is handled differently in higher order logic like crashloop detection and handling
    status.State.Terminated = &v1.ContainerStateTerminated{
        Reason:   reason,
        Message:  "The container could not be located when the pod was terminated",
        ExitCode: 137, // this code indicates an error
    }
    // the restart count normally comes from the CRI (see near the top of this method), but since this is being added explicitly
    // for the case where the CRI did not return a status, we need to manually increment the restart count to be accurate.
    status.RestartCount = oldStatus.RestartCount + 1
```


### 3.3 Pod 삭제 등으로 “기본 Waiting”만 남는 경우의 보정 (`LastTerminationState`)

이전에 Running이었는데 지금 쓰려는 status가 기본 `ContainerCreating` / `PodInitializing` Waiting에 가려지면 Pod phase가 Pending 쪽으로 잘못 보일 수 있어, **`LastTerminationState`**에 동일 reason을 넣는 경로가 있습니다.

*`kubernetes/kubernetes/pkg/kubelet/kubelet_pods.go` (대략 2618–2630행)*

```go
// setting this value ensures that we show as stopped here, not as waiting:
// https://github.com/kubernetes/kubernetes/blob/90c9f7b3e198e82a756a68ffeac978a00d606e55/pkg/kubelet/kubelet_pods.go#L1440-L1445
// This prevents the pod from becoming pending
status.LastTerminationState.Terminated = &v1.ContainerStateTerminated{
    Reason:   kubecontainer.ContainerReasonStatusUnknown,
    Message:  "The container could not be located when the pod was deleted.  The container used to be Running",
    ExitCode: 137,
}
// If the pod was not deleted, then it's been restarted. Increment restart count.
if pod.DeletionTimestamp == nil {
    status.RestartCount += 1
}
```


### 3.4 Pod 종료 시 누락된 컨테이너 상태를 실패로 메우기 — `TerminatePod`
GC, 관리자 조작, kubelet 재시작 등으로 **컨테이너 상태를 못 가져온 슬롯**을 성공으로 두지 않기 위해, 초기화가 끝난 Pod는 비어 있는 슬롯을 `ContainerStatusUnknown` + exit 137로 채웁니다.

*627:686:kubernetes/kubernetes/pkg/kubelet/status/status_manager.go*
```go
// TerminatePod ensures that the status of containers is properly defaulted at the end of the pod
// lifecycle. As the Kubelet must reconcile with the container runtime to observe container status
// there is always the possibility we are unable to retrieve one or more container statuses due to
// garbage collection, admin action, or loss of temporary data on a restart. This method ensures
// that any absent container status is treated as a failure so that we do not incorrectly describe
// the pod as successful. If we have not yet initialized the pod in the presence of init containers,
// the init container failure status is sufficient to describe the pod as failing, and we do not need
// to override waiting containers (unless there is evidence the pod previously started those containers).
// It also makes sure that pods are transitioned to a terminal phase (Failed or Succeeded) before
// their deletion.
func (m *manager) TerminatePod(logger klog.Logger, pod *v1.Pod) {
...
    // once a pod has initialized, any missing status is treated as a failure
    if hasPodInitialized(logger, pod) {
        for i := range status.ContainerStatuses {
            if status.ContainerStatuses[i].State.Terminated != nil {
                continue
            }
            status.ContainerStatuses[i].State = v1.ContainerState{
                Terminated: &v1.ContainerStateTerminated{
                    Reason:   kubecontainer.ContainerReasonStatusUnknown,
                    Message:  "The container could not be located when the pod was terminated",
                    ExitCode: 137,
                },
            }
        }
    }
    
    // all but the final suffix of init containers which have no evidence of a container start are
    // marked as failed containers
    for i := range initializedContainers(status.InitContainerStatuses) {
        if status.InitContainerStatuses[i].State.Terminated != nil {
            continue
        }
        status.InitContainerStatuses[i].State = v1.ContainerState{
            Terminated: &v1.ContainerStateTerminated{
                Reason:   kubecontainer.ContainerReasonStatusUnknown,
                Message:  "The container could not be located when the pod was terminated",
                ExitCode: 137,
            },
        }
    }
```


---

## 4. 실제 소스: 노드 하트비트 단절 시 `NodeStatusUnknown`

Pod 컨테이너 reason이 아니라 **Node 조건**을 바꾸는 쪽입니다. 마지막 probe/lease 갱신이 `gracePeriod`를 넘으면 `Ready` 등을 `Unknown`으로 두고 reason을 `NodeStatusUnknown`으로 둡니다.

*921:955:kubernetes/kubernetes/pkg/controller/nodelifecycle/node_lifecycle_controller.go*
```go
    if nc.now().After(nodeHealth.probeTimestamp.Add(gracePeriod)) {
        // NodeReady condition or lease was last set longer ago than gracePeriod, so
        // update it to Unknown (regardless of its current value) in the master.

        nodeConditionTypes := []v1.NodeConditionType{
            v1.NodeReady,
            v1.NodeMemoryPressure,
            v1.NodeDiskPressure,
            v1.NodePIDPressure,
            // We don't change 'NodeNetworkUnavailable' condition, as it's managed on a control plane level.
            // v1.NodeNetworkUnavailable,
        }

        nowTimestamp := nc.now()
        for _, nodeConditionType := range nodeConditionTypes {
            _, currentCondition := controllerutil.GetNodeCondition(&node.Status, nodeConditionType)
            if currentCondition == nil {
                logger.V(2).Info("Condition of node was never updated by kubelet", "nodeConditionType", nodeConditionType, "node", klog.KObj(node))
                node.Status.Conditions = append(node.Status.Conditions, v1.NodeCondition{
                    Type:               nodeConditionType,
                    Status:             v1.ConditionUnknown,
                    Reason:             "NodeStatusNeverUpdated",
                    Message:            "Kubelet never posted node status.",
                    LastHeartbeatTime:  node.CreationTimestamp,
                    LastTransitionTime: nowTimestamp,
                })
            } else {
                logger.V(2).Info("Node hasn't been updated",
                    "node", klog.KObj(node), "duration", nc.now().Time.Sub(nodeHealth.probeTimestamp.Time), "nodeConditionType", nodeConditionType, "currentCondition", currentCondition)
                if currentCondition.Status != v1.ConditionUnknown {
                    currentCondition.Status = v1.ConditionUnknown
                    currentCondition.Reason = "NodeStatusUnknown"
                    currentCondition.Message = "Kubelet stopped posting node status."
                    currentCondition.LastTransitionTime = nowTimestamp
                }
            }
        }
```

---

## 5. 요약
- **`describe node`의 `NodeStatusUnknown`** 은 **`node_lifecycle_controller`** 가 Node `Conditions`를 갱신한 결과이고,  
- **`describe pod`의 `ContainerStatusUnknown`** 은 **`kubelet`** 이 Pod status를 만들 때 **`kubelet_pods.go` / `status_manager.go`** 에서 넣는 값이다.  
- 노드가 즉시 죽은 직후에는 **kubelet이 API에 못 올리는 동안** Pod 컨테이너 필드가 바로 바뀌지 않을 수 있고, **복구·동기화·삭제·TerminatePod** 같은 이벤트와 맞물려 위 코드 경로가 실행될 때 `ContainerStatusUnknown`이 보이는 경우가 많다.