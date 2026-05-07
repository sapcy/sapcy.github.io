---
title: "[CKS] 04. Minimize Microservice Vulnerabilities"
description: "Security Context, Pod Security Standards 3단계, Admission Controllers, Kubernetes Secrets, Cilium Network Policy, Service Mesh·Istio mTLS 정리"
tags:
  - kubernetes
  - cks
  - security
  - cilium
  - istio
  - pod-security
sidebar_position: 5
---

# [CKS] 04. Minimize Microservice Vulnerabilities

> **도메인**: Minimize Microservice Vulnerabilities
> **주요 주제**: Security Context, Pod Security Standards, Admission Controllers, Kubernetes Secrets, Cilium, Service Mesh/Istio

---

## 1. Security Context

### 배경

- 컨테이너는 기본적으로 root 사용자 권한으로 실행되는 경우가 많음
- 컨테이너 탈출 시 공격자가 호스트 시스템에 전체 접근 가능
- 비 root 사용자로 실행 시 → 호스트 핵심 파일 수정 불가, 호스트 접근 제한

### Security Context 개요

- Pod 또는 컨테이너의 권한 및 접근 제어 설정을 정의
- Pod 레벨 또는 컨테이너 레벨에서 적용 가능

### 주요 필드

| 필드 | 설명 | 사용 사례 |
|------|------|---------|
| `runAsUser` | 컨테이너 프로세스가 실행될 UID 지정 | 특정 사용자로 실행 (root 대신) |
| `runAsGroup` | 컨테이너 프로세스의 기본 GID 지정 | 특정 그룹으로 실행 |
| `fsGroup` | 볼륨 마운트 파일의 GID 지정 | 공유 볼륨의 파일 권한 제어 |
| `runAsNonRoot` | root로 실행 시 컨테이너 시작 거부 | 비 root 실행 강제 |
| `readOnlyRootFilesystem` | 컨테이너 루트 파일시스템을 읽기 전용으로 마운트 | 런타임 파일 변경 방지 |

```yaml
spec:
  securityContext:         # Pod 레벨 (모든 컨테이너에 적용)
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: my-container
    securityContext:       # 컨테이너 레벨 (개별 적용)
      runAsNonRoot: true
      readOnlyRootFilesystem: true
      capabilities:
        add: ["NET_ADMIN"]
        drop: ["ALL"]
```

### Privileged Pods

- 특정 워크로드는 호스트 시스템 리소스나 커널 기능에 직접 접근 필요
- `privileged: true` 설정 시 모든 Linux capability 부여 (필요하지 않은 것 포함)

```yaml
securityContext:
  privileged: true   # 모든 capability 부여 (보안 위험)
```

> **권장**: Privileged Pod 사용 자제. 대신 `capabilities` 필드로 필요한 capability만 명시

**Privileged Pod가 필요한 경우**:
- 커널 모듈 로딩
- 커스텀 네트워크 인터페이스 생성
- 특정 디바이스 파일 접근

### readOnlyRootFilesystem (불변성)

```yaml
securityContext:
  readOnlyRootFilesystem: true
```

- 루트 파일시스템을 읽기 전용으로 마운트
- 컨테이너 내 중요 파일에 대한 무단 변경 방지
- 임시 저장소 필요 시 emptyDir 볼륨 사용:

```yaml
volumes:
- name: tmp-dir
  emptyDir: {}
containers:
- volumeMounts:
  - mountPath: /tmp
    name: tmp-dir
```

---

## 2. Pod Security Standards (PSS)

### 배경

- 프로덕션 네임스페이스에서 불필요한 Privileged Pod가 자주 실행됨
- 보안팀의 기준을 자동으로 강제하는 메커니즘 필요

### 3가지 정책 레벨

| 정책 | 설명 | 대상 |
|------|------|------|
| **Privileged** | 완전히 비제한적 (제한 없음, 권한 상승 허용) | 신뢰할 수 있는 시스템 컴포넌트 |
| **Baseline** | 알려진 권한 상승 방지 (최소한의 제한) | 일반 컨테이너화된 워크로드 |
| **Restricted** | 현재 Pod 하드닝 모범 사례를 따르는 엄격한 제한 | 보안 크리티컬 애플리케이션 |

#### Baseline Policy - 허용하지 않는 항목

- 호스트 네임스페이스 공유 (hostPID, hostIPC, hostNetwork)
- Privileged Pod
- HostPath 볼륨 및 HostPort

#### Restricted Policy - Baseline 이상의 추가 제한

- 컨테이너는 반드시 비 root 사용자로 실행
- `runAsUser: 0` 설정 불가
- Seccomp 프로파일 명시적 설정 필요

### Pod Security Admission (PSA)

- PSS를 강제하는 Kubernetes 내장 어드미션 컨트롤러
- **네임스페이스 레벨**에서 레이블로 정책 정의:

```
pod-security.kubernetes.io/<MODE>: <profile>
```

#### 3가지 모드

| 모드 | 설명 |
|------|------|
| **enforce** | 정책 위반 Pod 거부 |
| **audit** | 정책 위반 Pod 허용하지만 감사 로그에 어노테이션 추가 |
| **warn** | 정책 위반 Pod 허용하지만 사용자에게 경고 |

```bash
# 네임스페이스에 레이블 적용 예시
kubectl label namespace production \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/warn=restricted

# Dry-run으로 기존 Pod 영향 확인
kubectl label namespace production \
  pod-security.kubernetes.io/enforce=restricted --dry-run=server
```

### PSS 주요 포인트

- **버전 지정 권장**: 버전 미지정 시 Kubernetes 업그레이드 후 예상치 못한 정책 변경 가능
  ```
  pod-security.kubernetes.io/enforce: restricted
  pod-security.kubernetes.io/enforce-version: v1.30
  ```

- **enforce 모드와 워크로드 리소스**: Deployment 자체는 생성 가능, 실제 Pod 생성 시 차단

- **기존 Pod**: 레이블 추가/변경 시 기존 실행 중인 Pod에는 영향 없음

- **Exemptions**: 특정 사용자, RuntimeClass, 네임스페이스를 정책 예외로 설정 가능

---

## 3. Admission Controllers

### 개요

- 인증/인가 후, etcd 저장 전에 API Server 요청을 가로채어 수정/거부
- 두 가지 타입:
  - **Validating**: 허용 또는 거부만 가능
  - **Mutating**: 요청 수정 후 허용/거부 가능

### 주요 Admission Controllers

#### NamespaceAutoProvision

- 존재하지 않는 네임스페이스에 리소스 생성 요청 시 네임스페이스 자동 생성

#### PodSecurity

- Pod Security Standards를 강제하는 Admission Controller

#### AlwaysPullImages

**배경 문제**:
- 유효한 자격증명으로 다운로드된 프라이빗 이미지가 노드에 캐시됨
- 다른 사용자가 `imagePullPolicy: Never`로 해당 이미지 재사용 가능 (자격증명 우회)

**해결**: `AlwaysPullImages` 어드미션 컨트롤러
- 모든 새 Pod의 이미지 풀 정책을 `Always`로 강제 수정
- 멀티테넌트 클러스터에서 유용

#### ImagePolicyWebhook

- 외부 서비스를 통해 컨테이너 이미지 허용 여부 검사
- 설정 단계:
  1. 설정 파일 생성
  2. KubeConfig 파일 생성
  3. 볼륨 마운트 설정
  4. Admission Controller 활성화

```yaml
# ImagePolicyWebhook 설정 파일 예시
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig
  allowTTL: 50
  denyTTL: 50
  retryBackoff: 500
  defaultAllow: true   # 웹훅 접근 불가 시 기본 동작
```

### ImagePullPolicy

| 값 | 설명 |
|----|------|
| Always | 항상 레지스트리에서 최신 이미지 풀 |
| IfNotPresent | 노드에 없는 경우에만 풀 |
| Never | 절대 풀하지 않음 (노드에 이미 있다고 가정) |

**기본 동작**:
- 태그 미지정 또는 `:latest` 태그: `Always`
- 특정 태그 지정 (latest 제외): `IfNotPresent`

> **Best Practice**: 프로덕션에서 `:latest` 태그 사용 자제. `v1.42.0` 같은 구체적인 태그 사용 권장

---

## 4. Kubernetes Secrets

### 배경

- 컨테이너 이미지에 패스워드/토큰 하드코딩은 보안 위험
- Kubernetes Secrets: 민감한 데이터를 저장하는 기능

### Secret 접근 방식

| 방식 | 설명 |
|------|------|
| 환경 변수 | Secret 값을 환경 변수로 컨테이너에 노출 |
| Volume Mount | Secret을 파일로 컨테이너 내 마운트 |

```yaml
# 환경 변수로 Secret 마운트
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: my-secret
      key: password

# Volume으로 Secret 마운트
volumes:
- name: secret-volume
  secret:
    secretName: my-secret
volumeMounts:
- mountPath: /etc/secrets
  name: secret-volume
```

### Secret 유형

| 타입 | 설명 |
|------|------|
| Opaque | 임의 사용자 정의 데이터 (기본값) |
| TLS | TLS 인증서 및 개인 키 |
| docker-config | Docker 레지스트리 인증 정보 |

```bash
# Secret 생성
kubectl create secret generic my-secret --from-literal=password=secret123
kubectl create secret tls my-tls-secret --cert=path/to/cert --key=path/to/key
```

### Secret 보안 주의사항

1. 기본적으로 etcd에 **평문으로 저장** → Encryption Provider 설정 필요
2. `kubectl`은 Secret을 **base64 인코딩**으로 출력 (암호화 아님)
3. RBAC으로 Secret 접근 제어 추가 권장

---

## 5. Cilium (고급 CNI)

### Cilium 개요

- iptables/IP 라우팅 대신 **eBPF**를 사용하는 고성능 CNI 플러그인
- L3, L4, L7 레이어에서 세밀한 네트워크 정책 제공

| 기능 | K8s Network Policy | Cilium Network Policy |
|------|-------------------|----------------------|
| L3/L4 기본 격리 | 지원 | 지원 |
| L7 (HTTP, DNS, Kafka) | **미지원** | **지원** |
| 고급 관찰성 | 미지원 | Hubble로 지원 |

### Hubble

- Cilium의 관찰성 레이어
- Kubernetes 클러스터 네트워크에 대한 심층 인사이트 제공
- 트래픽 흐름 실시간 모니터링

### CiliumNetworkPolicy 구조

```yaml
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: example-policy
spec:
  endpointSelector:
    matchLabels:
      app: backend
  ingress:
  - fromEndpoints:
    - matchLabels:
        app: frontend
  egress:
  - toEndpoints:
    - matchLabels:
        app: database
```

### Layer 3 정책 유형

| 유형 | 설명 |
|------|------|
| Endpoints Based | Pod 레이블 기반 |
| Services Based | Kubernetes Service 기반 |
| Entities Based | 사전 정의된 그룹 (world, host, cluster 등) |
| Node Based | 노드 기반 |
| IP/CIDR Based | 특정 IP/CIDR 기반 |
| DNS Based | DNS 도메인 기반 |

**Entities 종류**:

| Entity | 설명 |
|--------|------|
| world | 클러스터 외부 모든 트래픽 (인터넷) |
| host | 로컬 Kubernetes 노드 |
| remote-node | 클러스터의 다른 노드 |
| cluster | 클러스터 내 모든 워크로드 (전체 Pod) |
| all | 클러스터 내외부 모든 엔드포인트 |

### Cilium Deny Policies

- **ingressDeny** / **egressDeny**: 특정 트래픽 패턴 명시적 차단
- Deny 정책이 Allow 정책보다 **우선순위 높음**

```yaml
spec:
  endpointSelector:
    matchLabels:
      app: server
  ingress:
  - fromEntities:
    - all
  ingressDeny:          # 특정 Pod만 차단
  - fromEndpoints:
    - matchLabels:
        app: random-pod
```

### Cilium Transparent Encryption

- Pod 간 네트워크 트래픽 암호화 지원
- **IPsec** 또는 **WireGuard** 사용
- 기본적으로 Kubernetes는 Pod 간 암호화 미지원

---

## 6. 마이크로서비스와 Service Mesh

### 모놀리식 vs 마이크로서비스

| 특성 | 모놀리식 | 마이크로서비스 |
|------|---------|-------------|
| 배포 | 전체 애플리케이션 재배포 | 개별 서비스 독립 배포 |
| 스케일링 | 전체 스케일 | 개별 서비스 스케일 |
| 기술 스택 | 단일 언어/프레임워크 | 서비스별 최적 기술 선택 |
| 장애 격리 | 어려움 | 용이 |

### 마이크로서비스 보안 과제

| 과제 | 설명 |
|------|------|
| 보안 통신 | 서비스 간 암호화 및 신원 검증 필요 |
| 네트워크 격리 | 필요한 서비스 간만 통신 허용 |
| 서비스 디스커버리 | 동적 IP 변화에 대응하는 서비스 위치 파악 |
| 모니터링 | 수십~수백 서비스 간 트래픽 모니터링 |

### Service Mesh

- 마이크로서비스 간 통신 관리, 관찰성, 신뢰성, 보안을 제공
- 핵심: **사이드카 프록시** (Envoy 등)
  - 각 Pod에 사이드카 프록시 자동 주입
  - 모든 네트워크 트래픽을 프록시를 통해 처리

```
[Application] ↔ [Envoy Sidecar] -mTLS- [Envoy Sidecar] ↔ [Application]
```

**인기 있는 Service Mesh 솔루션**: Istio, Consul, Linkerd

### Istio

**주요 특징**:

| 기능 | 설명 |
|------|------|
| Secure by default | mTLS 기반 제로 트러스트 보안 |
| 관찰성 향상 | Grafana/Prometheus와 통합, 서비스 메트릭 제공 |
| 트래픽 관리 | A/B 테스트, 카나리 배포, 퍼센트 기반 트래픽 분할 |

**아키텍처**:
- **Data Plane**: Envoy 사이드카 프록시 집합 (트래픽 처리 + 텔레메트리)
- **Control Plane (Istiod)**: 프록시 설정 및 관리, **CA 역할** (mTLS 인증서 발급)

**Envoy 기능**: 동적 서비스 디스커버리, 로드밸런싱, TLS 종료, 상태 확인, 장애 주입, 메트릭

#### Istio 사이드카 주입

```bash
# 자동 주입 (네임스페이스 레이블)
kubectl label namespace my-namespace istio-injection=enabled

# 수동 주입
istioctl kube-inject -f deployment.yaml | kubectl apply -f -
```

#### Mutual TLS (mTLS) with Istio

- Istiod가 CA 역할 → 사이드카 프록시에 인증서 발급
- 자동으로 mTLS 설정 (코드 수정 불필요)

```yaml
# Namespace 레벨 mTLS 강제
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: prod
spec:
  mtls:
    mode: STRICT  # STRICT: mTLS 필수, PERMISSIVE: HTTP도 허용
```
