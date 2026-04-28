---
format: md
title: "Kubelet PLEG (Pod Lifecycle Event Generator)"
description: "PLEG 동작·relist·sync loop 관계, PLEG is not healthy 원인과 운영 점검"
tags:
  - kubernetes
  - kubelet
---

## PLEG란?

**PLEG(Pod Lifecycle Event Generator)** 는 kubelet 내부 컴포넌트로, **노드에서 실제로 실행 중인 Pod/Container 상태 변화를 감지해서 kubelet의 sync loop에 이벤트로 전달하는 역할**을 한다.

쉽게 말하면 kubelet 안에서:
“컨테이너 런타임 상태를 주기적으로 확인해서, Pod 상태가 바뀌었는지 감시하는 감시자”
라고 보면 된다.

---

## kubelet이 왜 PLEG를 쓰나?

kubelet은 Pod를 관리해야 한다.
예를 들어 다음과 같은 상태 변화를 알아야 한다.

- 컨테이너가 새로 생성됨
- 컨테이너가 시작됨
- 컨테이너가 종료됨
- 컨테이너가 죽고 재시작 필요함
- Pod sandbox가 사라짐
- runtime 상태와 kubelet이 알고 있는 상태가 달라짐

그런데 kubelet은 containerd, CRI-O 같은 **container runtime의 내부 상태를 실시간 push 방식으로 받는 구조가 아니다.**

그래서 kubelet은 주기적으로 runtime을 조회해서 현재 상태를 확인한다.
이 역할을 하는 핵심 컴포넌트가 **PLEG**다.

---

## 동작 방식

PLEG는 대략 이런 흐름으로 동작한다.

```text
kubelet
  └─ PLEG
      ├─ container runtime에 Pod/Container 상태 조회
      ├─ 이전 상태와 현재 상태 비교
      ├─ 변화가 있으면 PodLifecycleEvent 생성
      └─ kubelet sync loop에 전달
```

예를 들면 이전 상태가 이렇다고 하자.

```text
Pod A
  container nginx: Running
```

그런데 다음 조회에서 이렇게 바뀌었다.

```text
Pod A
  container nginx: Exited
```

그러면 PLEG는 “container died”에 해당하는 이벤트를 만들고 kubelet에 전달한다.

그 후 kubelet은 해당 Pod의 spec과 restartPolicy를 보고 컨테이너를 다시 띄울지, Pod 상태를 Failed로 볼지 등을 판단한다.

---

## PLEG가 감지하는 대표 이벤트

PLEG는 Pod lifecycle 관련 이벤트를 생성한다.

대표적으로는 다음과 같다.

```text
ContainerStarted
ContainerDied
ContainerRemoved
PodSync
ContainerChanged
```

정확한 이벤트 이름은 Kubernetes 버전과 내부 구현에 따라 조금씩 다를 수 있지만, 핵심은 **runtime 상태 변화 → kubelet sync trigger**다.

---

## kubelet sync loop와의 관계

kubelet의 핵심 루프는 Pod를 원하는 상태로 맞추는 것이다.

```text
API Server에서 받은 desired state
        +
노드 runtime의 actual state
        ↓
kubelet syncPod()
```

PLEG는 여기서 **actual state가 바뀌었다는 신호**를 kubelet에게 알려준다.
예를 들어:

```text
1. 컨테이너가 비정상 종료됨
2. PLEG가 runtime 조회 중 종료 상태 발견
3. PLEG가 ContainerDied 이벤트 생성
4. kubelet sync loop가 해당 Pod를 다시 sync
5. restartPolicy에 따라 컨테이너 재시작
```

즉, PLEG가 없다면 kubelet은 runtime 쪽에서 발생한 변화에 둔감해진다.

---

## PLEG is not healthy 에러

운영 중 자주 보는 메시지가 있다.

```text
PLEG is not healthy
```

또는

```text
pleg was last seen active ...
```

이건 kubelet이 판단하기에 **PLEG가 너무 오랫동안 정상적으로 relist를 못 했다**는 뜻이다.

PLEG는 주기적으로 runtime에서 Pod/Container 목록을 다시 조회한다.  
이 작업을 보통 **relist**라고 한다.

그런데 relist가 오래 걸리거나 멈추면 kubelet은 이렇게 본다.

```text
PLEG가 runtime 상태를 제대로 못 보고 있다
→ Pod 상태 판단이 늦어진다
→ kubelet이 unhealthy 상태로 간주할 수 있다
```

---

## PLEG가 unhealthy해지는 주요 원인

대표 원인은 대부분 **container runtime 응답 지연**이다.

```text
kubelet → CRI → containerd / CRI-O
```

이 경로에서 runtime이 느리면 PLEG relist도 느려진다.

주요 원인은 다음과 같다.
- containerd 과부하
- 컨테이너 수가 너무 많음
- Pod churn이 심함
- 디스크 I/O 지연
- `/var/lib/containerd` 또는 `/var/log/pods` 쪽 I/O 병목
- image GC / container GC 지연
- runtime shim 프로세스 문제
- cgroup 조회 지연
- 노드 CPU starvation
- inode / file descriptor 부족
- containerd CRI plugin 응답 지연

특히 노드에 Pod가 많거나, 컨테이너 생성/삭제가 자주 발생하면 PLEG relist 시간이 길어질 수 있다.

---

## PLEG 문제 시 나타나는 증상

PLEG가 unhealthy하면 kubelet이 Pod 상태 변화를 제때 반영하지 못한다.
증상은 다음처럼 보일 수 있다.

```text
Pod가 죽었는데 상태 반영이 늦음
Container 재시작이 늦음
kubectl get pod 상태가 실제와 다름
Pod가 Terminating에서 오래 멈춤
새 Pod 생성/삭제 처리가 느림
Node NotReady 또는 kubelet unhealthy
kubelet 로그에 PLEG 관련 에러 반복
```

특히 kubelet 로그에서 이런 메시지를 볼 수 있다.

```text
skipping pod synchronization - PLEG is not healthy
```

이 경우 kubelet이 Pod sync 자체를 건너뛸 수 있어서, 노드 전체의 Pod 관리가 지연된다.

---

## PLEG relist란?

PLEG의 핵심 작업은 **relist**다.
relist는 runtime에 현재 Pod/Container 목록을 다시 물어보고, 이전 snapshot과 비교하는 작업이다.
흐름은 다음과 같다.

```text
1. runtime에서 현재 Pod/Container 상태 조회
2. kubelet 내부 cache에 저장된 이전 상태와 비교
3. 차이가 있으면 lifecycle event 생성
4. relist 완료 시간 기록
5. 다음 주기에 반복
```

그래서 relist가 오래 걸리면 kubelet 입장에서는 runtime 상태를 최신으로 파악하지 못한다.

---

## PLEG와 containerd의 관계

kubelet은 직접 containerd 내부 DB를 읽는 게 아니라 CRI를 통해 조회한다.

```text
kubelet PLEG
   ↓
CRI RuntimeService
   ↓
containerd CRI plugin
   ↓
containerd / shim / snapshotter / cgroup / filesystem
```

따라서 containerd가 느려지거나, containerd가 관리하는 shim/container metadata 조회가 느려지면 PLEG도 영향을 받는다.
즉, `PLEG is not healthy`는 PLEG 자체 버그라기보다 보통은:
kubelet이 container runtime 상태를 제때 조회하지 못하는 상황으로 보는 게 맞다.

---

## 운영 관점에서 확인할 것

PLEG 문제가 의심되면 다음을 같이 봐야 한다.

```bash
journalctl -u kubelet -f
journalctl -u containerd -f

crictl ps -a
crictl pods
crictl info

systemctl status containerd
systemctl status kubelet
```

디스크 I/O도 확인한다.

```bash
iostat -x 1
```

파일 디스크립터도 확인한다.

```bash
cat /proc/$(pidof containerd)/limits | grep "open files"
ls /proc/$(pidof containerd)/fd | wc -l
```

노드 리소스도 본다.

```bash
top
free -h
df -h
df -i
```

컨테이너 수가 너무 많은지도 확인한다.

```bash
crictl ps -a | wc -l
crictl pods | wc -l
```

---

## 한 줄 요약

PLEG는 kubelet이 container runtime의 실제 Pod/Container 상태 변화를 감지하기 위해 주기적으로 relist하고, 변화가 있으면 kubelet sync loop에 이벤트를 전달하는 내부 컴포넌트다.

운영 관점에서는 `PLEG is not healthy`가 보이면 PLEG 자체보다 먼저 containerd 응답 지연, 디스크 I/O, 컨테이너 수, 노드 리소스 부족, FD/inode 부족을 의심하는 게 좋다.