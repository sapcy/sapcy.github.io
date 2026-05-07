---
title: "[Ch-03] Linux Namespace 완전 정복 — 컨테이너 격리의 핵심 기술"
description: "플레이 빌더 강의 Ch-03 요약. Linux Namespace 8종, unshare·pause·CRI, 파드 네트워크·IPC·PID 격리 실습."
tags:
  - cloud
  - kubernetes
---

# [Ch-03] Linux Namespace 완전 정복 — 컨테이너 격리의 핵심 기술

> 영상: [플레이 빌더 — Ch-03 (YouTube)](https://www.youtube.com/watch?v=oMKB93KuPsk)  
> 실습 저장소: [play-builder/kubeadm-cluster](https://github.com/play-builder/kubeadm-cluster)

컨테이너는 **네임스페이스(격리)** + **cgroup(자원 제한)** + **오버레이 파일 시스템(이미지 레이어 조립)** 세 기둥의 조합이다. 이번 챕터는 그중 **리눅스 네임스페이스**를 개념과 터미널 실습으로 파고든다.

**주의:** 여기서 말하는 **Linux Namespace**는 `kubectl`로 다루는 **쿠버네티스 Namespace**(리소스를 묶는 논리적 폴더: `default`, `kube-system` 등)와 **이름만 같을 뿐 완전히 다른 개념**이다. 이번 글은 **커널이 프로세스 격리에 쓰는 메커니즘**을 뜻한다.

:::tip
- **쿠버네티스 Namespace**: 클러스터 안에서 파드·서비스·시크릿 등 객체를 **이름과 권한 단위로 나누는** API 리소스.
- **Linux Namespace**: 같은 커널을 공유하면서도 프로세스마다 **PID·네트워크·마운트 등 “보이는 세계”를 나누는** 커널 기능.
:::

---

## 1. 다섯 가지 질문 — 답은 전부 네임스페이스

강의에서 던지는 질문:

1. 파드 안에 컨테이너가 둘일 때, 왜 **로컬호스트**로 사이드카에 접근할 수 있는가?  
2. 컨테이너끼리 왜 **서로의 프로세스**가 `ps`로 보이지 않는가?  
3. 파드 안에서 컨테이너가 죽고 **재생성**되어도 왜 **IP가 안 바뀌는** 것처럼 보일 수 있는가? (pause와 네트워크 네임스페이스 유지)  
4. 컨테이너 안에서 `ps`를 치면 왜 **내 프로세스가 PID 1**로 보이는가?  
5. `hostname`을 치면 왜 **노드 이름이 아니라 파드 이름**이 나오는가?

이 다섯 가지는 **네임스페이스 조합**으로 설명된다.

:::tip
- **사이드카(Sidecar)**: 같은 파드에 붙어 메인 앱을 보조하는 컨테이너(로그 수집, 프록시 등).
- **로컬호스트(localhost, 127.0.0.1)**: 자기 네트워크 네임스페이스 안의 루프백 인터페이스. 같은 파드는 네트워크 네임스페이스를 공유하면 **서로 localhost로 통신**할 수 있다.
:::

---

## 2. 네임스페이스의 정의

**네임스페이스**는 같은 커널을 공유하면서도, 각 프로세스에게 **자신만의 독립된 시야**를 주는 커널 기능이다. 프로세스 A는 “이 서버엔 나만 있다”고 느끼고, B도 마찬가지 — 실제로는 같은 커널 위에서 동시에 돌아가도 **서로 존재를 모른다**.

**커널에는 `struct container`가 없다.** 커널이 아는 것은 **프로세스**뿐이다. nginx 컨테이너도 결국 **프로세스 하나**다. 우리가 “컨테이너”라 부르는 것은 **네임스페이스 + cgroup + 오버레이**의 논리적 조합이다. Docker·containerd·CRI-O는 그 조합을 편하게 만드는 **도구**일 뿐이며, 도구가 바뀌어도 **커널 메커니즘은 같다**.

:::tip
- **프로세스**: 실행 중인 프로그램 인스턴스. 커널은 스케줄링·메모리·파일 디스크립터 등을 **태스크(프로세스/스레드)** 단위로 관리한다.
:::

---

## 3. Lab: 호스트 초기 PID 네임스페이스(Init namespace)

`/proc/1/ns/pid`는 **PID 1(systemd)** 가 속한 **PID 네임스페이스**를 가리키는 심볼릭 링크다. 읽으면 `4026531836` 같은 **inode 번호**가 나온다. 이 번호는 커널이 네임스페이스를 구분하기 위해 붙인 **고유 식별자**다. systemd, kubelet, containerd, **호스트에 직접 설치한 nginx**까지 **같은 번호**를 공유하면 “**같은 방(같은 PID 네임스페이스)**”에 있다.

같은 방이면 `ps`로 서로 보이고, 권한이 되면 **`kill`로 상대 프로세스를 종료**할 수 있다 — **격리 없음**의 실체다.

:::tip
- **`/proc`**: 커널이 프로세스·시스템 정보를 파일처럼 노출하는 가상 파일시스템.
- **심볼릭 링크**: 다른 경로를 가리키는 파일 시스템의 바로가기.
- **Init PID namespace**: 부팅 시 만들어지는 **호스트 루트** PID 네임스페이스. 대부분의 시스템 데몬이 여기에 속한다.
:::

---

## 4. `hostPID: true` vs 기본 격리(nginx 예제)

강의에서는 두 매니페스트를 비교한다.

- **hostPID: true**: 컨테이너가 **호스트의 PID 네임스페이스**에 합류 → `/proc/<container>/ns/pid`가 systemd·kubelet과 **동일 inode**.  
- **기본(생략 시 false)**: **새 PID 네임스페이스** → inode가 **다름**. 이것이 쿠버네티스의 **정상적인 격리**다.

`hostPID: true`이면 컨테이너 안에서 **호스트 전체 프로세스**가 보이고, 공격자가 들어오면 **kubelet·containerd까지 kill**할 수 있는 **심각한 보안 위험**이다. **PSA(Pod Security Admission)** 등 최신 파드 보안 표준에서는 이 옵션을 **강하게 제한**하고, <strong>프로덕션에서는 사용 금지</strong>라고 강조한다.

:::tip
- **`hostPID`**: 파드 스펙 필드. `true`면 컨테이너가 호스트 PID 네임스페이스를 공유한다.
- **PSA(Pod Security Admission)**: 파드가 클러스터 정책( privileged, baseline, restricted 등)을 위반하지 않는지 **입장 시 검사**하는 기능.
:::

---

## 5. 네임스페이스는 어떻게 만들어지나 — `clone`과 `unshare`

커널에 **`clone` 시스템 콜**에 **`CLONE_NEW*`** 플래그를 넘기면 새 네임스페이스가 생긴다. Kubernetes 경로에서는 **kubelet → containerd → runc**이 최종적으로 **`clone`(CLONE_NEWPID, CLONE_NEWNET, CLONE_NEWNS, CLONE_NEWUTS, CLONE_NEWIPC 등)** 을 호출하고, 커널이 네임스페이스를 만든 **뒤** 그 안에서 nginx가 뜬다. **새 PID 네임스페이스의 첫 프로세스는 PID 1**이 된다 — 컨테이너에서 PID 1이 보이는 이유다.

**경로는 달라도 커널 도착점은 같다:** `kubectl run ...` 은 API 서버·스케줄러·kubelet·CRI·runc를 거쳐 `clone`에 이르고, **`unshare` 한 줄**은 훨씬 짧게 같은 **시스템 콜 경계**를 넘어간다.

커널 내부 개략(강의 흐름): `clone` 진입 → **`copy_process`** 등으로 태스크 생성 → **`copy_namespaces`** 에서 `CLONE_NEW*` 플래그 확인 → 필요 시 **`create_new_namespaces`** 등으로 실제 네임스페이스 구조체 할당. **도구가 달라도 커널에서 만나는 지점은 같다** — 그래서 리눅스를 먼저 배운다는 메시지다.

:::tip
- **`clone`**: 기존 프로세스에서 자식을 만들 때, **한 번에** 네임스페이스·플래그를 지정할 수 있는 시스템 콜(포크의 확장에 가깝게 이해해도 된다).
- **`unshare`**: 셸에서 새 네임스페이스를 분리해 실험할 때 쓰는 CLI. 내부적으로 관련 시스템 콜을 호출한다.
- **OCI 런타임**: `runc` 등, 이미지와 설정에 따라 컨테이너 프로세스를 만들고 커널에 넘기는 표준 준수 런타임.
:::

---

## 6. Lab: 호스트에서 격리 없음 확인 — `lsns`, `readlink`, kubelet kill

- **`readlink /proc/$$/ns/*`**: 현재 셸이 속한 **각종 네임스페이스 inode**를 한꺼번에 볼 수 있다.  
- **`lsns -t pid`**: PID 네임스페이스별로 묶인 프로세스 수 등을 본다. pause 컨테이너 등 **별도 PID 네임스페이스**가 이미 있는 것도 확인할 수 있다.  
- **PID 1**: `/sbin/init`은 관례적 이름이고, 실제는 **systemd**가 PID 1인 경우가 많다.

**kube-api-server**는 **static pod** 등으로 떠 있으면 **호스트와 다른 네임스페이스 inode**를 가질 수 있다 — “컨테이너로 격리”된 경우다.

한 터미널에서 `systemctl status kubelet`을 `watch`하고, 다른 터미널에서 `kill`하면 kubelet이 죽었다가 **systemd의 restart 정책**으로 다시 올라온다. **같은 PID 네임스페이스**에 있으면 서로 보이고 **시그널로 종료**할 수 있다는 실습이다. (다른 프로세스에 시그널을내려면 **권한**이 필요하다는 점도 언급된다.)

:::tip
- **`lsns`**: 시스템에 있는 네임스페이스 목록을 보여 주는 유틸리티.
- **Static Pod**: kubelet이 지정 디렉터리의 매니페스트를 직접 읽어 띄우는 파드. API 서버 없이도 노드에 구성요소를 올릴 때 쓴다.
- **`systemctl`**: systemd 관리 유닛(서비스) 상태 조회·제어.
:::

---

## 7. 새 PID 네임스페이스의 구조 — 이중 매핑·일방통행·PID 1의 생명줄

**이중 매핑:** 같은 bash 프로세스가 호스트에서는 PID 301, 새 PID 네임스페이스 안에서는 **PID 1**로 보인다. 커널의 **태스크/`pid` 구조**가 **네임스페이스별로 PID를 별도 관리**하기 때문이다.

**일방통행:** 호스트에서는 내부 네임스페이스 프로세스를 보고 `kill`할 수 있지만, **내부에서 호스트 PID를 kill**하려 하면 **No such process** — 내부는 바깥을 모른다.

**PID 1이 죽으면:** 그 네임스페이스 안의 프로세스에 **SIGKILL 등으로 일괄 정리**되는 커널 동작(강의에서는 `kill_pid_ns_processes` 같은 함수 이름으로 소개)이 언급된다. 그래서 **컨테이너의 메인 프로세스가 죽으면 컨테이너 전체가 죽는** 것과 연결된다. 커널 코드에서 **“잡다(junk)”** 표현이 쓰이기도 한다고 부연한다.

:::tip
- **좀비 프로세스(Zombie)**: `wait`로 거두지 않은 채 종료만 보고된 자식. PID 1(init)이 **reap** 해 주는 역할이 중요하다.
- **SIGKILL**: 무시 불가능한 강제 종료 시그널.
:::

---

## 8. Lab: `unshare`로 PID·Mount·fork 격리 — `proc` 마운트

`unshare --pid --mount --fork bash` 류의 명령으로:

- **`--pid`**: 새 PID 네임스페이스(1번부터 번호 체계).  
- **`--mount`**: 새 마운트 네임스페이스(호스트 마운트 테이블과 분리).  
- **`--fork`**: 현재 셸을 덮어쓰지 않고 **자식 bash**를 새 방의 PID 1로 둔다.

**PID만 분리**하면 `/proc`은 여전히 **호스트 프로세스**를 비칠 수 있어, **`mount -t proc proc /proc`** 으로 **이 네임스페이스용 proc**을 덮어씌운다. 격리된 셸에서 `ps`를 치면 **bash와 ps만** 보이고 bash가 **PID 1**이다. 호스트의 containerd PID에 `kill -0`을 쳐도 **존재 자체를 모름** → **일방통행** 재확인.

`exit`하면 PID 1(bash)이 종료되며 **네임스페이스도 함께 사라진다**.

:::tip
- **`kill -0`**: 프로세스가 존재하는지 **시그널 없이** 확인만 하는 테스트.
- **`mount -t proc`**: proc 가상 파일시스템을 특정 디렉터리에 붙인다.
:::

---

## 9. 여덟 가지 네임스페이스와 `CLONE_NEW*`

`clone`에 넘기는 **격리 플래그**가 곧 네임스페이스 종류와 대응된다. **컨테이너는 마법이 아니라 이 플래그 조합**이다.

| 구분 | 플래그(예) | 역할(요지) |
|------|------------|------------|
| PID | `CLONE_NEWPID` | PID 번호 체계 격리. 내부 PID 1 가능. |
| Network | `CLONE_NEWNET` | 인터페이스·라우팅·포트 공간 분리. 파드별 IP의 기반. |
| Mount | `CLONE_NEWNS` | 마운트 테이블 격리. **역사적 이유로 NEWNS가 마운트**(2002년 첫 네임스페이스였음). |
| UTS | `CLONE_NEWUTS` | hostname 등 **호스트명** 격리. 파드 안 `hostname`이 파드 이름처럼 보이는 이유. |
| IPC | `CLONE_NEWIPC` | 공유 메모리·세마포어 등 IPC 객체 격리. **같은 파드 컨테이너는 IPC 공유**로 고속 통신. |
| User | `CLONE_NEWUSER` | UID/GID 매핑 격리. 컨테이너 root가 호스트에서는 **비특권 유저**로 보이게 하는 방어. |
| Cgroup | `CLONE_NEWCGROUP` | **cgroup 계층 “시야”** 격리. **cgroup 자체(CPU/메모리 한도)** 와는 다른 개념이다. |
| Time | `CLONE_NEWTIME` | 시간 네임스페이스(2020년대 추가). 강의에서는 **쿠버네티스에서 쓰지 않는다**고 한다. |

즉 K8s에서 실질적으로 다루는 것은 **Time 제외 7종** 정도로 기억하면 된다.

:::tip
- **cgroup vs cgroup namespace**: **cgroup**은 CPU·메모리 **한도**. **cgroup namespace**는 컨테이너가 **호스트의 cgroup 전체 트리를 못 보게** 루트만 보이게 하는 **시야 격리**.
:::

---

## 10. “2 · 3 · 2”로 외우는 K8s 네임스페이스 구조

강의에서는 **호스트(노드) · 파드 · 컨테이너** 세 레벨에 어떤 네임스페이스가 걸리는지 **2 + 3 + 2**로 묶는다.

### 바깥 **2** — 노드(호스트) 레벨: 보안·노드 통제

- **User namespace**: 컨테이너 안에서는 root처럼 보여도 호스트에서는 **일반 유저로 매핑** → 탈출해도 호스트 root를 못 얻게 하는 방어선.  
- **Cgroup namespace**: cgroup **디렉터리 시야** 격리(자기 cgroup이 루트처럼 보이게).

### 중간 **3** — 파드 레벨: “한 머신처럼” 공유

- **Network**: 같은 파드 컨테이너는 **같은 IP**, **localhost로 서로 접근** 가능.  
- **IPC**: 공유 메모리 등 **제로 카피**에 가까운 통신.  
- **UTS**: **같은 hostname**(파드 이름 등).

### 안쪽 **2** — 컨테이너마다 독립

- **PID**: 컨테이너마다 **다른 PID 1**(nginx vs sidecar의 1번). 서로 `ps`/`kill` 불가.  
- **Mount**: **각자의 루트 파일시스템**. `/etc/nginx`를 고쳐도 옆 컨테이너 `/etc`에는 영향 없음. 오버레이 이미지도 **마운트 네임스페이스** 덕에 격리된다.

:::tip
- **제로 카피(Zero-copy)**: 여기서는 “커널을 왕복하며 데이터를 여러 번 복사하지 않고, 같은 메모리 영역을 두 프로세스가 직접 공유”하는 통신을 비유적으로 가리킨다.
:::

---

## 11. IPC: 공유 메모리와 세마포어

기본 원칙은 **격리**지만, 대용량 데이터를 주고받을 때 소켓/파이프만 쓰면 **커널 버퍼로 복사**가 반복되어 느려진다. **공유 메모리**는 RAM의 한 구역을 A·B가 **직접 읽고 쓰게** 열어 **복사 비용을 줄인다**.

대신 둘이 **동시에 같은 위치에 쓰면** 데이터가 깨진다(**레이스 컨디션**). 그래서 **세마포어**로 “한 번에 한 주체”만 들어가게 **잠금·대기·해제** 순서를 통제한다.

:::tip
- **공유 메모리(Shared memory)**: `shm` 등으로 여러 프로세스가 동일 물리 페이지를 매핑해 고속 통신.  
- **세마포어(Semaphore)**: 정수 카운트로 **임계 구역** 진입을 조율하는 동기화 도구.
- **레이스 컨디션(Race condition)**: 실행 순서에 따라 결과가 달라지는 버그 성격의 경쟁 상태.
:::

---

## 12. Network namespace와 CNI — veth, 브릿지

새 **network namespace**만 만들면 **밖으로 나가는 길이 막힌 집**과 같다. 처음엔 **lo(127.0.0.1)** 만 있고 비활성인 경우도 설명된다. **CNI(Calico 등)** 가 **veth pair**(가상 랜선 한 쌍)를 만들어 **한쪽은 파드(eth0), 한쪽은 호스트(vethxxx)** 에 붙이고, 호스트 쪽을 **가상 브릿지**에 연결해 **클러스터·인터넷으로 패킷이 나갈 경로**를 연다.

패킷 경로(요지): 파드 내부 → **veth** → 호스트 veth → **브릿지(가상 라우터 역할)** → 물리 NIC → 외부.

Lab: `unshare --net bash` 후 `ping 8.8.8.8` → **Network unreachable**. `readlink /proc/self/ns/net`으로 호스트와 **다른 inode** 확인. `exit` 후 다시 호스트 netns로 복귀.

:::tip
- **veth(virtual ethernet pair)**: 항상 쌍으로 존재하는 가상 인터페이스. 한쪽으로 넣은 프레임이 반대쪽으로 나온다.
- **CNI(Container Network Interface)**: 파드에 네트워크를 붙일 때 **플러그인이 준수하는 플러그인 API/규격**.
:::

---

## 13. UTS & Mount namespace Lab — `unshare`, `hostname`, tmpfs

`unshare --pid --uts --mount --fork bash` 등으로 UTS·마운트까지 분리한 뒤, 처음엔 hostname이 **호스트와 동일하게 상속**될 수 있다. **`hostname` 명령으로 변경**하면 **그 UTS 네임스페이스 안에서만** 유효하다. 프롬프트가 바로 안 바뀌면 **`exec bash`** 로 새 셸을 띄워 반영한다 — **`kubectl exec`으로 파드에 들어갔을 때 프롬프트가 파드 이름처럼 보이는 것**과 같은 메커니즘으로 연결된다.

**tmpfs**를 `mount -t tmpfs tmpfs /mnt` 로 붙이면 **현재 마운트 네임스페이스 안에서만** 보인다. 비밀 파일을 만들고 `exit`하면 호스트의 `/mnt/secret.txt`에는 **아무것도 없음** — <strong>마운트 격리가 보안의 핵심이라는 메시지</strong>다.

:::tip
- **UTS(Unix Timesharing System) 네임스페이스**: `hostname`, `domainname` 등 <strong>식별자를 네임스페이스마다 다르게 둔다</strong>(이름은 역사적 유래).
- **tmpfs**: RAM 기반 임시 파일시스템. 재부팅·네임스페이스 종료 시 내용이 사라질 수 있다.
- **`exec bash`**: 현재 셸 프로세스를 **새 bash로 교체** 실행(환경·프롬프트 갱신에 자주 쓴다).
:::

---

## 14. 네 가지를 한 번에 — `unshare` + `mount -t proc`

PID·NET·UTS·MOUNT를 한 번에 켠 뒤 `mount -t proc proc /proc` 으로 **새 netns용 proc 마운트 테이블**을 맞춘다. `readlink /proc/self/ns/{net,uts,pid,mnt}` 로 **서로 다른 inode**가 빠르게 생성된 것을 확인한다. `exit`로 빠져나오면 호스트 값으로 복귀.

**유지가 필요한 네트워크 네임스페이스**는 `unshare`만이 아니라 **`ip netns add ethereum-network`** 처럼 **이름 붙은 netns**를 만들 수 있다. `ip netns exec ...` 로 들어가 확인하고, **`ip netns delete`** 로 명시적으로 지운다 — `unshare`와 달리 **프로세스가 없어도 남을 수 있어** 수동 삭제가 필요하다는 대비 설명이다.

:::tip
- **`ip netns`**: 네트워크 네임스페이스를 **이름으로 생성·삭제·실행**하는 `iproute2` 명령군.
:::

---

## 15. 쿠버네티스 파드: CRI 경로와 **Pod sandbox** · **pause**

워커 **kubelet**이 API 서버를 watch하다 할당된 파드를 보면 **CRI(gRPC)** 로 **containerd**에 “컨테이너 만들어 줘”를 보낸다. containerd는 **containerd-shim** 등으로 **각 컨테이너 생명주기를 독립 관리**하고, **OCI 런타임(runc)** 이 `clone`으로 네임스페이스를 만든다.

**커널은 “파드”를 모른다.** K8s는 여러 컨테이너가 **IP·IPC 등을 공유**할 **논리적 안전 공간**이 필요한데, CRI 스펙에서 이를 **Pod sandbox**라 부른다. 그 공간을 **물리적으로 붙잡아 주는 것이 pause 컨테이너**(인프라 컨테이너·**앵커** 비유)다.

**실행 순서:** 사용자가 nginx만 적어도, 실제로는 **pause가 먼저** 뜬다. kubelet이 **RunPodSandbox** 요청 → containerd가 **runc로 네트워크·IPC·UTS·마운트·(필요 시)PID 등**을 만들고 **pause 실행** → 이어서 **CNI를 호출**해 veth 붙이고 IP 할당.

**중요:** **Kubernetes 1.24부터** kubelet은 **CNI를 직접 호출하지 않는다**고 강의에서 정리한다. **RunPodSandbox와 CNI 호출은 containerd(샌드박스 관리 쪽)가 담당**한다는 흐름이다.

:::tip
- **CRI(Container Runtime Interface)**: kubelet과 containerd/CRI-O 사이의 **gRPC API**.
- **containerd-shim**: containerd 메인 프로세스와 분리되어 **컨테이너별 부모** 역할을 해 재시작 영향을 줄인다.
- **Pause 이미지**: 보통 아주 작은 바이너리로, **네임스페이스와 네트워크 엔드포인트를 유지**하고 **SIGCHLD로 자식을 reap** 하며 대기한다.
:::

---

## 16. Lab: 멀티 컨테이너 파드 — 같은 IP, localhost, 다른 PID 1

`Chapter 03` 등 매니페스트로 **nginx + log collector(sidecar)** 파드를 띄운다. 두 컨테이너 모두 **`hostname -i` 동일 IP** → **network namespace 공유**(pause가 잡아 둔 네트워크에 조인). 로그 컨테이너에서 `wget localhost:80` 으로 nginx HTML 수신 → **“왜 localhost로 사이드카에 접근되나”** 질문에 답한다.

`cat /proc/1/cmdline` 으로 **로그 컬렉터의 PID 1은 셸 스크립트**, **nginx의 PID 1은 nginx master** — **같은 파드여도 PID namespace는 컨테이너별로 분리**된다. 그래서 서로의 프로세스 목록은 못 본다.

**다른 파드**(예: MySQL)에서는 `ps | grep mysql` 이 **비어 있음** — PID ns 분리. 대신 **ping / nc로 L3·L4 통신**은 CNI 라우팅으로 된다 — **“프로세스는 안 보이지만 네트워크는 된다”**.

:::tip
- **ICMP ping**: IP 계층에서 도달성을 확인하는 메시지(방화벽에 막힐 수 있음).
- **`nc`(netcat)**: TCP/UDP 포트 연결·데이터 전송 테스트에 쓰는 CLI.
:::

---

## 17. pause가 죽으면 IP가 바뀌는 이유

리눅스는 **네임스페이스 안에 살아 있는 프로세스가 하나도 없으면** 네임스페이스를 **자동 삭제**한다. **pause가 죽으면** 공유 netns를 쓰는 프로세스가 사라지고, 커널이 **네트워크 네임스페이스를 지우면서 파드 IP도 사라진다**. 그래서 **컨테이너만 재시작**되는 것과 달리, **pause/샌드박스가 바뀌는 재배치**에서는 IP가 **새로** 잡힐 수 있다는 설명과 맞닿는다.

pause 소스에서 **SIGCHLD**를 받으면 **reap** 으로 좀비를 치우고 계속 **pause(대기)** 한다 — CPU를 거의 쓰지 않는 이유다.

:::tip
- **SIGCHLD**: 자식 프로세스가 종료·중단됐을 때 부모에게 보내지는 시그널.
- **reap**: 종료된 자식을 `wait` 계열로 거둬 **좀비를 제거**하는 것.
:::

---

## 18. 아키텍처 한 장으로 정리

- **pause(소유·유지, Own & Hold)**: 파드 수명 동안 **네트워크·IPC·UTS** 등 **공유 영역**을 만들고 유지.  
- **앱 컨테이너(합류, Join)**: **새 netns/uts/ipc를 만들지 않고** pause가 만든 **공유 영역에 붙는다**.  
- **격리(노란 영역)**: **PID·Mount**는 **컨테이너마다** nginx는 nginx의 PID 1과 루트 FS, sidecar는 자기 PID 1과 루트 FS.

**정리:** 인프라급(ns)은 pause 경유 **공유**, 실행 환경급(ns)은 **컨테이너별 격리**.

---

## 19. 실습 종료 후 정리

항상 **`terraform destroy`** 등으로 클러스터·노드를 정리해 **AWS 과금**을 막는다.

:::tip
- **`terraform destroy`**: Terraform이 생성한 인프라를 코드 기준으로 제거한다.
:::

---

## 20. 마무리

이번 챕터는 **Linux Namespace가 컨테이너·파드 격리의 본체**임을, **호스트 PID 공유 실험**, **`unshare`/`readlink`/`lsns`**, **8종 네임스페이스와 2·3·2 구조**, **CNI·veth**, **pause·Pod sandbox·CRI 경로**로 증명했다. Ch-01·Ch-02의 “**커널이 집행자**”라는 말이, 파드 안에서 어떤 **파일 하나(`hostname`)·포트 하나(localhost)** 에까지 어떻게 닿는지 구체화된다.

:::tip
- **격리(Isolation)**: 보이는 자원과 접근 가능 범위를 나누어 **장애·보안 경계**를 만든다.
- **조인(Join)**: 이미 존재하는 네임스페이스에 새 프로세스·컨테이너를 <strong>같은 방으로 붙이는 것</strong>.
:::
