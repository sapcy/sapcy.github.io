---
title: "[CKS] 01. Cluster Setup"
description: "ETCD TLS/mTLS, Certificate Authority, API Server 암호화·감사, kubeadm 구조, Ingress TLS, Network Policies 구조 및 예제 정리"
tags:
  - kubernetes
  - cks
  - security
  - etcd
  - network-policy
sidebar_position: 2
---

# [CKS] 01. Cluster Setup

> **도메인**: Cluster Setup
> **주요 주제**: ETCD 보안, Certificate Authority, API Server 보안, kubeadm, Ingress, Network Policies

---

## 1. ETCD 보안

### ETCD 보안의 3가지 핵심 영역

| 영역 | 문제 | 해결책 |
|------|------|--------|
| Plain Text 데이터 저장 | etcd에 Secret이 평문으로 저장됨 | API Server 레벨 암호화 (Encryption Provider) |
| TLS 암호화 | API Server ↔ ETCD 간 트래픽 도청 가능 | HTTPS 통신 설정 |
| 인증 | 인증 없이 누구든 etcd에 연결 가능 | 인증서 기반 인증(mTLS) |

### 1-1. ETCD TLS 설정 (HTTPS)

```bash
# etcd 주요 플래그
--cert-file=<path>           # 서버 SSL/TLS 인증서 파일 경로
--key-file=<path>            # 인증서에 대응하는 개인 키 파일 경로
--advertise-client-urls      # 클라이언트에 광고할 URL (예: https://<IP>:2379)
--listen-client-urls         # 클라이언트 요청 수신 URL (예: https://0.0.0.0:2379)
```

**설정 단계**:
1. etcd용 인증서 생성
2. HTTPS로 etcd 시작 (위 플래그 적용)

### 1-2. Mutual TLS (mTLS)

- **mTLS**: 클라이언트와 서버가 서로의 신원을 검증하는 보안 프로토콜
- 양쪽 모두 신뢰할 수 있는 CA에서 발급한 디지털 인증서 보유 필요

**핸드셰이크 과정**:
1. 클라이언트가 서버에 연결
2. 서버가 자신의 인증서를 클라이언트에 제시
3. 클라이언트가 서버 인증서 검증
4. 클라이언트가 자신의 인증서를 서버에 제시
5. 서버가 클라이언트 인증서 검증
6. 양쪽 검증 통과 시 암호화된 연결 수립

**etcd 서버 플래그 (mTLS)**:

| 플래그 | 설명 |
|--------|------|
| `--cert-file`, `--key-file` | HTTPS로 etcd 시작 |
| `--client-cert-auth` | 클라이언트 인증서 인증 활성화 |
| `--trusted-ca-file` | 클라이언트 인증서 검증용 CA 인증서 경로 |

**etcdctl 클라이언트 플래그**:

| 플래그 | 설명 |
|--------|------|
| `--cacert` | CA 인증서 경로 (서버 인증서 검증용) |
| `--cert-file`, `--key-file` | 클라이언트 인증서로 etcd 인증 |

### 1-3. 인증 유형 비교

| 특징 | Username/Password | 인증서 |
|------|------------------|--------|
| 보안 수준 | 낮음 | 높음 (위조 어려움) |
| 사용 편의성 | 쉬움 | 복잡함 |
| 권장 환경 | 개발/단순 설정 | 프로덕션/고보안 |

---

## 2. Certificate Authority (CA)

### 개요

- **CA**: 디지털 인증서를 발급하는 주체
- 수신자와 발신자 모두 CA를 신뢰

### 두 가지 주요 사용 사례

1. TLS 통신을 위한 인증서 생성
2. 클라이언트/컴포넌트 인증용 인증서 생성

### 인증서 발급 워크플로우

```
1단계: CA 인증서 및 키 생성
2단계: 컴포넌트/클라이언트용 CSR(인증서 서명 요청) 생성
3단계: CA 자격증명으로 CSR 서명 → 최종 인증서 획득
```

```bash
# CSR 생성 예시 (alice 사용자, admins 그룹)
openssl req -new -key alice.key -subj "/CN=alice/O=admins" -out alice.csr

# CN: Common Name (사용자명)
# O: Organization (그룹명)
```

### etcd를 Systemd로 관리

- 프로덕션에서는 수동 CLI 실행 대신 systemd로 etcd 관리
- systemd: 시작, 중지, 재시작 등 프로세스 관리 + 서버 재부팅 시 자동 시작

---

## 3. API Server 보안

### API Server 역할

- Kubernetes 클러스터 관리 및 상호작용의 게이트웨이
- `kubectl` 명령은 API Server로 전달됨

### API Server ↔ ETCD 연결

etcd가 인증서 기반 인증과 HTTPS를 요구하도록 설정된 경우:
1. API Server용 인증서를 신뢰할 수 있는 CA에서 생성
2. API Server가 HTTPS 엔드포인트로 etcd에 연결

### API Server 주요 보안 구성

| 구성 | 설명 |
|------|------|
| Encryption Provider | Secret 등 민감 데이터를 etcd 저장 전 암호화 |
| TLS Encryption | HTTPS로 통신 (클라이언트↔API Server) |
| Auditing | 클러스터 내 행위 감사 로그 |
| Admission Control | 요청 가로채어 검증/수정 |
| Authorization Mode | 인가 방식 설정 |
| Authentication | 인증 방식 설정 |

### Encryption Provider Config

**문제**: Kubernetes Secret이 etcd에 평문으로 저장됨

**해결**: `--encryption-provider-config` 플래그로 암호화 설정

| 암호화 제공자 | 암호화 방식 | 강도 | 속도 |
|-------------|-----------|------|------|
| Identity | 없음 (기본값) | N/A | N/A |
| aescbc | AES-CBC with PKCS#7 | 최강 | 빠름 |
| secretbox | XSalsa20 and Poly1305 | 강함 | 더 빠름 |
| kms | 봉투 암호화 방식 | 최강 | 빠름 |

> **주의**: 기본적으로 identity provider 사용 (암호화 없음). 기존 Secret은 여전히 미암호화 상태.

---

## 4. Auditing (감사)

### 감사 개요

감사는 클러스터 내 다음 질문에 답하는 보안 관련 시간순 기록:
- **what happened?** (무슨 일이?)
- **when did it happen?** (언제?)
- **who initiated it?** (누가?)
- **on what did it happen?** (무엇에?)
- **from where was it initiated?** (어디서?)
- **to where was it going?** (어디로?)

### Audit Policy 레벨

| 레벨 | 설명 |
|------|------|
| None | 이 규칙에 매칭되는 이벤트를 기록하지 않음 |
| Metadata | 요청 메타데이터만 기록 (사용자, 타임스탬프, 리소스, 동사 등) |
| Request | 메타데이터 + 요청 본문 기록 |
| RequestResponse | 메타데이터 + 요청/응답 본문 모두 기록 |

### Audit 주요 플래그

| 플래그 | 설명 |
|--------|------|
| `--audit-policy-file` | 감사 정책 파일 경로 |
| `--audit-log-path` | 감사 로그 파일 경로 |
| `--audit-log-maxage` | 오래된 감사 로그 파일 최대 보존 일수 |
| `--audit-log-maxbackup` | 보존할 최대 감사 로그 파일 수 |
| `--audit-log-maxsize` | 로테이션 전 감사 로그 파일 최대 크기(MB) |

### Audit 단계 (Stages)

| 단계 | 설명 |
|------|------|
| RequestReceived | 요청 수신 직후, 핸들러 체인 위임 전 |
| ResponseStarted | 응답 헤더 전송 후, 응답 본문 전송 전 (장기 실행 요청에만) |
| ResponseComplete | 응답 본문 완성, 더 이상 바이트 전송 없음 |
| Panic | 패닉 발생 시 생성 |

---

## 5. kubeadm

### kubeadm 개요

- 안전한 Kubernetes 클러스터를 빠르게 프로비저닝
- 두 가지 주요 구성요소: Master Node, Worker Node

### kubeadm 디렉터리 구조

| 경로 | 내용 |
|------|------|
| `/etc/kubernetes` | 필수 매니페스트 파일 및 인증서 |
| `/etc/kubernetes/pki` | 인증서 및 키 페어 (기본 저장 위치) |
| `/etc/kubernetes/manifests` | 컨트롤 플레인 컴포넌트용 Static Pod 매니페스트 |
| `/etc/kubernetes/admin.conf` | 관리자용 kubeconfig (클러스터 전체 제어 권한) |
| `/etc/kubernetes/kubelet.conf` | kubelet용 kubeconfig |
| `/etc/kubernetes/controller-manager.conf` | Controller Manager용 kubeconfig |
| `/etc/kubernetes/scheduler.conf` | Scheduler용 kubeconfig |
| `/var/lib/kubelet` | kubelet 설정 파일 경로 |

### kubeconfig 인증서 정보

| 파일 | CN 값 |
|------|-------|
| kubelet.conf | `system:node:<hostname>` (Organization: `system:nodes`) |
| controller-manager.conf | `system:kube-controller-manager` |
| scheduler.conf | `system:kube-scheduler` |

### 컨트롤 플레인 컴포넌트 특성

- 모든 Static Pod는 `kube-system` 네임스페이스에 배포
- 레이블: `tier:control-plane`, `component:{component-name}`
- 컨트롤 플레인 노드에 taint 적용: `node-role.kubernetes.io/control-plane:NoSchedule`

### Taints and Tolerations

**Taint**: 특정 Pod를 밀어내는 노드 속성
**Toleration**: Taint가 있는 노드에 스케줄링되기 위한 Pod의 특별 허가증

**Taint 효과**:

| 효과 | 설명 |
|------|------|
| NoSchedule | Taint를 허용(tolerate)하지 않는 새 Pod 스케줄링 차단 |
| PreferNoSchedule | 가능하면 스케줄링 피하지만 강제하지 않음 |
| NoExecute | 기존 Pod 축출 + 새 Pod 스케줄링 차단 |

### kubeadm 트러블슈팅

```bash
# kubelet 로그 확인
journalctl -u kubelet

# Pod별 로그 확인
/var/log/pods/
/var/log/containers/  # 최신 로그 파일로의 심링크
```

---

## 6. Ingress

### 배경

- `LoadBalancer` 서비스 타입은 단일 서비스에만 트래픽을 포워딩
- 여러 서비스를 위해 다수의 로드밸런서를 생성하면 비용 과다

### Ingress 개요

- **Ingress**: 정의된 규칙에 따라 특정 서비스로 트래픽을 라우팅하는 진입점
- 단일 로드밸런서로 여러 서비스의 요청 처리 가능

### Ingress 구성요소

| 구성요소 | 설명 |
|---------|------|
| Ingress Controller | Ingress 리소스에 정의된 규칙을 구현하는 실행 중인 애플리케이션 |
| Ingress Resource | 라우팅 규칙을 정의하는 API 오브젝트 |

### Ingress with TLS

- HTTP 연결은 보안에 취약
- Ingress 레벨에서 TLS 설정으로 클라이언트↔서버 간 암호화 통신
- 인증서는 Kubernetes Secret으로 저장, Ingress 리소스에서 참조

```yaml
# Ingress TLS 설정 예시
spec:
  tls:
  - hosts:
    - example.com
    secretName: example-tls-secret
```

### Nginx Ingress SSL Redirect

- TLS 설정 시 기본적으로 HTTP → HTTPS(443) 리다이렉트
- 이 동작을 수정하려면 어노테이션 추가:

```yaml
nginx.ingress.kubernetes.io/ssl-redirect: "false"
```

---

## 7. Network Policies

### 배경

- 기본적으로 Kubernetes는 클러스터 내 Pod 간 모든 트래픽 허용
- 특정 Pod가 침해되면 공격자가 다른 모든 Pod와 통신 가능

### Network Policy 개요

- 클러스터 내 네트워크 트래픽 흐름을 제어하는 메커니즘
- 트래픽 규칙 유형:
  - **Ingress Rules**: 인바운드 규칙
  - **Egress Rules**: 아웃바운드 규칙

### 필터링 대상 엔티티

1. 다른 Pod (podSelector)
2. 네임스페이스 (namespaceSelector)
3. IP 블록 (ipBlock)

### Network Policy 구조

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: example-policy
spec:
  podSelector:          # 정책 적용 대상 Pod 선택 (빈 {} = 모든 Pod)
    matchLabels:
      env: production
  policyTypes:
  - Ingress
  - Egress
  ingress:              # from: 인바운드 트래픽 허용 소스
  - from:
    - podSelector:
        matchLabels:
          env: security
  egress:               # to: 아웃바운드 트래픽 허용 목적지
  - to:
    - ipBlock:
        cidr: 8.8.8.8/32
```

### 주요 예제

| 예제 | 설명 |
|------|------|
| Block All | policyTypes에 Ingress/Egress 명시, 규칙 없음 → 모든 트래픽 차단 |
| Allow All Ingress | `ingress: [{}]` (빈 규칙 = 모든 소스 허용) |
| Pod Selector | `role=app` Pod가 `role=database` Pod에 연결 허용 |
| Namespace Selector | Security 네임스페이스에서 Prod 네임스페이스로 연결 허용 |
| ipBlock | 특정 IP(8.8.8.8)로만 아웃바운드 허용 |
| except | CIDR 범위 내 특정 범위 제외 (`except` 필드 사용) |

### CNI 지원 여부

| CNI 플러그인 | Network Policy 지원 |
|-------------|-------------------|
| Calico, Cilium | **지원** |
| Flannel, kubenet | **미지원** |
| AKS, EKS, GKE (관리형) | 기본적으로 지원 (확인 권장) |

> NetworkPolicy는 CNI 플러그인이 구현해야 하므로 CNI 선택이 중요

### Ports and Protocol 지정

```yaml
ingress:
- ports:
  - protocol: TCP
    port: 80
```

### except 사용 (CIDR 예외)

```yaml
ingress:
- from:
  - ipBlock:
      cidr: 172.17.0.0/16
      except:
      - 172.17.1.0/24
```
