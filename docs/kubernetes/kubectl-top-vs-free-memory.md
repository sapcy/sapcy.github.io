---
format: md
title: "왜 kubectl top node와 free -m의 결과가 다를까요?"
description: "같은 노드에서 kubectl top node와 free -m으로 본 메모리 사용량이 다른 이유를, Kubernetes Metrics API·working set·/proc/meminfo 관점에서 정리합니다."
tags:
  - cloud
  - kubernetes
---

같은 리눅스 노드에 SSH로 들어가 `free -m`으로 보면 여유가 꽤 있는데, `kubectl top node`만 보면 메모리가 훨씬 많이 쓰인 것처럼 보이는 경우가 있습니다. **둘 다 “메모리”를 보여 주지만, 측정 대상과 정의가 다릅니다.** 스케줄링·HPA 같은 쿠버네티스 관점에선 전자가 맞고, OS 관점의 여유 RAM을 보고 싶다면 후자와 `MemAvailable`을 함께 보는 편이 낫습니다.

---

### kubectl top node는 어디서 숫자를 가져올까?

`kubectl top`은 노드에 직접 들어가 명령을 치는 것이 아니라, **클러스터에 등록된 Metrics API**(`metrics.k8s.io`)를 조회합니다. 이 값은 보통 **metrics-server**가 각 노드의 **kubelet**에 물어서 모은 뒤 API로 노출합니다. kubelet은 **cAdvisor** 등을 통해 컨테이너/노드 리소스 통계를 수집합니다.

공식 문서의 **리소스 메트릭 파이프라인**에서는 이 구조를 kubelet → metrics-server → Metrics API → `kubectl top` 순으로 설명합니다.

- [Resource metrics pipeline](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/) - 아키텍처, Metrics API 예시 응답

metrics-server **FAQ**에도, **메트릭 숫자 자체를 metrics-server가 “계산”하는 것이 아니라 kubelet이 노출한 값을 집계한다**고 명시되어 있습니다. 값에 대한 이슈는 **SIG-Node** 쪽 논의와 맞물린다고 안내합니다.

- [metrics-server FAQ - How memory usage is calculated?](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)

---

### Metrics API에서 “메모리”의 정의: Working set

Kubernetes 문서는 Metrics API의 **메모리**를 다음과 같이 정의합니다.

:::tip Working set (공식 문서 정의)

Memory is reported as the **working set**, measured in bytes, at the instant the metric was collected.  
In an ideal world, the "working set" is the amount of memory **in-use that cannot be freed under memory pressure**. However, **calculation of the working set varies by host OS**, and generally makes heavy use of **heuristics** to produce an estimate.

:::

즉,

- **이상적인 의미**: 메모리 압박이 와도 당장 회수하기 어려운 “실사용에 가까운” 양  
- **실제**: OS마다 다르고, **휴리스틱 추정**에 의존  
- **포함되는 것**: 익명 메모리(anonymous, 파일에 매핑되지 않은 RAM)는 포함하고, **일부 페이지 캐시(파일 백 캐시)** 도 “호스트가 항상 즉시 회수할 수 없다”는 이유로 **working set에 포함되는 경우가 있다**고 설명합니다.

또한 리눅스 워크로드에서는 **스왑을 쓰지 않는 것**이 전제에 가깝다는 설명도 이어집니다(일반적인 컨테이너 메모리 모델).

- [Resource metrics pipeline - Memory](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#memory)  
- [Resource Management for Pods and Containers - meaning of memory](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

정리하면, **`kubectl top node`에 나오는 메모리는 “free가 말하는 사용량”이 아니라, 스케줄링·오토스케일링에 쓰기 위한 **working set 추정**입니다.

---

### free -m은 무엇을 볼까?

`free`는 **`/proc/meminfo`**에 있는 커널이 보고하는 전역 메모리 통계를 사람이 읽기 쉽게 보여 줍니다. `free -m`의 **used** 계열은 버전/옵션에 따라 다르지만, 공통적으로 **페이지 캐시·슬랩 등 “필요하면 줄일 수 있는” 메모리**를 “완전히 다른 앱이 쓰는 RAM”과 구분해서 표현하려는 경향이 있습니다.

리눅스 커널 문서에서는 **`MemAvailable`**이 “새 할당을 위해 대략 얼마나 쓸 수 있는지”를 추정한 값이라고 설명합니다(실제 환경에서는 `free` 출력의 **available** 열과 연관).

- [/proc/meminfo - MemAvailable](https://docs.kernel.org/filesystems/proc.html#memavailable) (커널 문서)

그래서 **디스크 캐시가 큰 노드**에서는:

- **`free` / `MemAvailable` 관점**: “캐시는 대부분 비우면 앱에 줄 수 있음” → **여유가 있다**고 보기 쉬움  
- **working set 관점**: “그 캐시도 당장 전부 회수 가능하다고 보장할 수 없음” → **더 크게 잡힐 수 있음**

이 간극이 **`kubectl top`이 더 “빡빡해 보이는”** 대표적인 이유입니다.

---

### 그래서 숫자가 어긋나는 게 정상인가?

**네.** 서로 다른 층에서 다른 정의를 쓰기 때문입니다.

| 구분 | `kubectl top node` (Metrics API) | `free -m` 등 |
|------|----------------------------------|--------------|
| 출처 | kubelet → Metrics API (working set) | `/proc/meminfo` |
| 의도 | 워크로드·노드 **리소스 사용량**(스케일링 등) | OS 전체 **RAM 점유·가용** 개요 |
| 캐시 | working set 정의에 따라 **일부 포함 가능** | `available` 등으로 **회수 가능 분**을 따로 표현 |

커뮤니티에서도 “`kubectl top`과 `free`가 안 맞는다”는 질문이 반복되며, **cgroup 통계 vs `/proc` 관점 차이**가 원인으로 설명되는 경우가 많습니다(예: [ServerFault](https://serverfault.com/questions/985501/kubectl-top-command-output-does-not-match-linux-free-command), [Stack Overflow](https://stackoverflow.com/questions/61839318/kubectl-top-nodes-reporting-more-memory-utilisation-than-linux-system-commands)).

또한 **cgroup v1 / v2**, 커널 버전에 따라 노드 루트 cgroup에서 읽는 방식이 달라지면서 **같은 하드웨어에서도 수치가 달라질 수 있다**는 이슈도 upstream에서 논의된 바 있습니다(예: [kubernetes/kubernetes#118916](https://github.com/kubernetes/kubernetes/issues/118916)).

---

### 실무에서 어떻게 보면 좋을까?

1. **스케줄링·용량·HPA 관점**  
   - 노드/파드가 “얼마나 쓰는지”는 **`kubectl top` / Metrics API** 기준이 쿠버네티스와 맞습니다.

2. **OS가 OOM 나기 직전인지, 디스크 캐시 때문인지**  
   - SSH로 **`free -h`**, **`cat /proc/meminfo`의 `MemAvailable`**, 필요 시 **`/proc/pressure/memory`** 등을 함께 보는 것이 좋습니다.

3. **의심스러울 때**  
   - `kubectl get --raw "/apis/metrics.k8s.io/v1beta1/nodes/<노드이름>" | jq .` 로 **Metrics API 원본**을 확인해 보세요. ([문서 예시](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-api))

---

### 참고 링크

- [Resource metrics pipeline (Kubernetes)](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)  
- [meaning of memory (Kubernetes)](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)  
- [metrics-server FAQ - memory](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)  
- [Linux `/proc/meminfo` - MemAvailable](https://docs.kernel.org/filesystems/proc.html#memavailable)

---

*이 글은 공식 문서와 커뮤니티 논의를 바탕으로 정리했으며, 커널·배포판·metrics-server 버전에 따라 수치와 동작은 달라질 수 있습니다.*
