---
format: md
title: Calico CNI 동작 원리
description: "Calico 구성 요소(Felix·BIRD·confd), BGP, 동일/다른 노드·외부 통신, IPIP·VXLAN·Direct·WireGuard 모드 요약"
tags:
  - cloud
  - kubernetes
---

이 글은 **Kubernetes Advanced Networking Study(KANS)** 3주차 학습을 바탕으로, [Jade 님의 Velog 글 「Kubernetes Calico CNI 동작원리 이해하기」](https://velog.io/@200ok/Kubernetes-Calico-CNI-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)(2022)의 **구조·실습 흐름**을 참고해 재정리했습니다. 원문의 스크린샷·상세 캡처는 저작권상 생략했으며, 개념 확인은 아래 **공식 문서**와 원글을 함께 보시면 좋습니다.

---

## Calico란?

[Calico](https://docs.tigera.io/calico/latest/about/)는 컨테이너·VM·베어메탈 워크로드용 **오픈소스 네트워킹·네트워크 보안** 솔루션입니다. Kubernetes, OpenShift, OpenStack 등 여러 플랫폼을 지원하고, **Linux 네이티브 데이터 플레인** 또는 **eBPF** 등을 선택해 쓸 수 있습니다. 클러스터 규모와 배포 형태에 관계없이 비슷한 운영 경험을 목표로 합니다.

---

## 구성 요소 아키텍처

Calico에는 여러 컴포넌트가 있으나, 흐름을 이해할 때는 **데이터스토어**와 **각 노드의 Calico Pod**를 먼저 보면 됩니다.

| 구성 요소 | 역할 |
|-----------|------|
| **Felix** | 인터페이스·라우팅·ACL(정책) 관리, 상태 점검 |
| **BIRD** | BGP 피어와 라우팅 정보 송수신, Route Reflector 등 |
| **confd** | Calico 전역/BGP 설정 변경 시 BIRD 설정에 반영(트리거) |
| **Datastore plugin** | 설정 저장 - Kubernetes API(**kdd**) 또는 **etcd** |
| **Calico IPAM** | 클러스터 내 Pod에 할당할 IP 대역 |
| **calico-kube-controllers** | Calico 관련 리소스 감시(watch) |
| **calicoctl** | Calico 오브젝트 CRUD, 데이터스토어 접근용 CLI |

### BGP·AS (배경)

- **BGP(Border Gateway Protocol)**: 자율 시스템(AS) 간에 쓰이는 라우팅 프로토콜로, 대규모 경로 수를 다루도록 설계되었습니다.
- **AS(Autonomous System)**: 하나의 정책 아래 관리되는 네트워크(자율 시스템). ISP·기업망 등이 예이며, 인터넷은 AS들의 집합으로 볼 수 있습니다.

### 노드에서의 동작 개요

- **DaemonSet**으로 노드마다 `calico-node` 파드가 떠 있고, 그 안에서 **BIRD**, **Felix**, **confd** 등이 동작합니다.
- **컨트롤러**는 Deployment 등으로 클러스터에 소수 배치됩니다.
- Calico의 특징 중 하나는 **BGP로 각 노드의 Pod CIDR 정보를 전파**한다는 점입니다. 쿠버네티스 노드뿐 아니라 **물리 라우터와 연동**하는 구성도 가능합니다(Flannel만으로는 어려운 패턴).
- **BIRD**가 노드 간 라우팅 정보를 교환하고, **Felix**가 호스트 **라우팅 테이블·iptables(또는 nftables 등)** 에 정책·경로를 반영합니다. **confd**는 설정 변경을 BIRD에 맞게 계속 반영합니다.

공식 아키텍처: [Calico architecture](https://docs.tigera.io/calico/latest/reference/architecture/overview/)

---

## CLI·클러스터 상태 확인 (요지)

원문에서는 **calicoctl** 설치 후 다음을 통해 상태를 확인합니다.

- `calicoctl get ipam show` 등으로 **클러스터 Pod CIDR**(예: `172.16.0.0/16`) 확인
- 노드별 블록(`Block`) = 노드에 할당된 Pod 대역
- `calicoctl get workloadEndpoint`로 **워크로드 엔드포인트·veth** 변화 관찰

**IPAM**: IP 주소의 계획·할당·추적을 통합 관리하는 개념으로, Calico IPAM이 노드별 블록을 나눠 줍니다.

---

## 실습 흐름 1: 동일 노드 내 Pod 간 통신

**결론**: 같은 노드 위 Pod끼리는 **호스트 네임스페이스 라우팅·FORWARD 체인**을 통해 직접 이어지는 형태로 통신합니다.

원문 실습 요지:

1. 워커 노드에 Pod 2개 생성 전후로 `watch calicoctl get workloadEndpoint` 등으로 엔드포인트 증가 확인
2. 호스트에서 `cali*` 계열 veth 인터페이스 추가 확인, **netns**는 pause 컨테이너와 대응
3. **라우팅 테이블**에 Pod IP `/32` 호스트 라우트가 잡히는지 확인
4. 한 Pod에서 다른 Pod로 ping, **iptables FORWARD**의 `cali-FORWARD` 계열 규칙이 카운트되는지 확인

즉, **L2 브리지만**이 아니라 **라우팅 + 정책(iptables)** 조합으로 동일 노드 트래픽이 처리됩니다.

---

## Pod → 인터넷(외부) 통신

**결론**: 기본적으로 **노드의 SNAT(MASQUERADE)** 로 출발지 IP가 노드 IP로 바뀌어 나갑니다.

- IPPool 등 설정에서 **`natOutgoing: true`**(기본에 가깝게 쓰는 경우가 많음)이면, 클러스터 내부 주소가 외부로 그대로 나가지 않도록 NAT합니다.
- 워커 노드 **iptables NAT 테이블**에 MASQUERADE 규칙이 있고, 외부 ping 등 시 **패킷 카운터**가 증가하는지로 동작을 확인할 수 있습니다.

---

## 다른 노드 간 Pod 통신 (기본 IPIP)

**결론**: 노드 간 구간은 기본 설정에서 **IPIP 터널**(`tunl0`)로 캡슐화되는 경우가 많습니다.

흐름 요약:

1. **BIRD(BGP)** 가 다른 노드의 Pod 대역을 **광고**하고, **Felix**가 호스트 **라우팅 테이블**에 “해당 대역은 `tunl0`로” 같은 경로를 심습니다.
2. Pod→Pod 패킷이 다른 노드로 갈 때 **`tunl0`** 에서 **외부 IP 헤더 + 내부 Pod IP** 구조로 encapsulation됩니다.
3. 상대 노드 `tunl0`에서 outer 헤더를 벗겨 내부 Pod로 전달합니다.
4. `tcpdump` 등으로 **outer/inner IP 헤더**가 겹쳐 보이는지 확인하면 오버레이 여부를 검증할 수 있습니다.

**MTU**: IPIP 사용 시 `tunl0`·Pod 인터페이스 **MTU 1480** 등으로 맞추는 설명이 원문에 있습니다(IPv4 IPIP 오버헤드 반영).

---

## Calico 네트워크 모드 요약

| 모드 | 요약 |
|------|------|
| **IPIP** | 노드 간 구간을 **IPIP**으로 캡슐화. Azure 등 일부 환경에서는 IPIP이 막힐 수 있어 **VXLAN**을 쓰는 사례가 있습니다. |
| **Direct(라우팅)** | 가능한 경우 **원본 패킷 그대로** 다음 홉으로 보냅니다. 클라우드에서는 **소스/데스트 체크** 등으로 드롭될 수 있어, NIC/서브넷 설정 조정이 필요할 수 있습니다. ([AWS VPC 관련 문서](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#EIP_Disable_SrcDestCheck) 참고) |
| **BGP 연동** | 클러스터와 **IDC/온프레망** 등과 **BGP 피어링**해 Pod 대역을 직접 라우팅하는 구성. |
| **VXLAN** | 노드 간 **UDP/VXLAN** 캡슐화. BGP 없이 **L3 라우팅 + VXLAN**으로 동작하는 옵션. Azure 등에서도 사용하기 쉬운 편입니다. |
| **WireGuard** | Calico 위에 **WireGuard 터널**을 두어 **노드 간 Pod 트래픽을 암호화**. 매니페스트 옵션으로 켤 수 있습니다. [WireGuard](https://www.wireguard.com/)는 Linux 커널에 메인라인으로 포함된 경량 VPN 구현입니다. |

원문 **실습 2**에서는 노드에 WireGuard 설치·활성화 후 `wireguard.cali`, `wg` 명령으로 피어·키를 보고, **UDP 51820** 등으로 암호화 트래픽을 덤프로 확인합니다. (댓글에서 「마스터 노드」→「모든 노드」 표현 정정이 언급되어 있으니, 재현 시에는 **클러스터 전 노드**에 맞춰 적용하는 것이 맞습니다.)

---

## 정리

- Calico는 **BGP + 노드 에이전트(Felix/BIRD/confd)** 로 **Pod 대역 가시성**을 만들고, **호스트 라우팅·iptables·(선택) 터널**로 패킷을 이어 줍니다.
- **동일 노드**는 주로 **직접 라우팅 + FORWARD 정책**, **외부**는 **NAT(MASQUERADE)**, **다른 노드**는 **IPIP(기본 예시)·VXLAN·Direct** 등 선택한 **데이터 플레인**에 따릅니다.
- 운영·버전별 기본값은 달라질 수 있으므로, 반드시 **배포한 Calico 버전의 공식 문서**와 `calicoctl`, `kubectl` 출력을 기준으로 확인하세요.

---

## 참고 링크

- [Velog 원문 - Kubernetes Calico CNI 동작원리 이해하기 (@200ok)](https://velog.io/@200ok/Kubernetes-Calico-CNI-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)
- [KANS 시리즈 소개 (Notion)](https://gasidaseo.notion.site/c9cd413265ea4ea1b1ae38eb36dfda94)
- [Calico - About](https://docs.tigera.io/calico/latest/about/about-calico)
- [Calico - Architecture](https://docs.tigera.io/calico/latest/reference/architecture/overview/)
- 이전 글(같은 시리즈): [Flannel CNI & PAUSE 컨테이너](https://velog.io/@200ok/Kubernetes-K8S-Flannel-CNI-PAUSE-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EB%8F%99%EC%9E%91%EC%9B%90%EB%A6%AC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)
- 다음 글(같은 시리즈): [Service (ClusterIP & NodePort)](https://velog.io/@200ok/Kubernetes-Service-ClusterIP-NodePort-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)
