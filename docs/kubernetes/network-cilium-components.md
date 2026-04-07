---
title: Cilium 구성요소와 트래픽 플로우
description: Cilium Agent·BPF Datapath·IPCache·Endpoint·K8s API 연동
tags:
  - cloud
  - kubernetes
---

## 🧠 구성요소
- **Cilium Agent**: 정책 처리, ipcache 관리, eBPF 프로그램 삽입
- **BPF Datapath**: 패킷 필터링, NAT, Load Balancing 등
- **IPCache**: IP → Identity 매핑 저장
- **Endpoint (Pod)**: Cilium이 관리하는 실제 네트워크 단위
- **Kubernetes API**: 메타데이터 제공

## 플로우 다이어그램

```mermaid
flowchart TD
    subgraph Node
        A[Pod A]
        B[Pod B]
    end

    subgraph Cilium_Agent
        Policy[Policy Engine]
        IPCache[IPCache]
        EP[Endpoint Info]
    end

    A -- 1. 트래픽 발생 --> IngressBPF[BPF Datapath Ingress Hook]
    IngressBPF -- 2. IP -> Identity 조회 --> IPCache
    IPCache -- 3. Identity 반환 --> IngressBPF
    IngressBPF -- 4. 정책 검증 요청 --> Policy
    Policy -- 5. 허용/차단 결과 반환 --> IngressBPF
    IngressBPF -- 6. 패킷 전달 --> EgressBPF[BPF Datapath Egress Hook]
    EgressBPF -- 7. 최종 전달 --> B

    Cilium_Agent -- 8. 메타데이터 동기화 --> K8s[Kubernetes API]
    K8s -- 9. Pod/Service 정보 제공 --> Cilium_Agent
    Cilium_Agent -- 10. Endpoint 및 IPCache 갱신 --> IPCache
```

1. Pod A에서 트래픽 발생
2. BPF Ingress Hook에서 트래픽 감지
3. IPCache를 조회해 IP → Identity 확인(Security ID)
4. Endpoint metadata도 확인
5. Policy Engine에서 허용/차단 판단
6. (동기화) Kubernetes API에서 메타데이터 가져오기
7. (동기화) Endpoint/Policy/IPCache 업데이트
8. Egress Hook을 통해 다음 목적지로 전달
9. Pod B에서 트래픽 수신