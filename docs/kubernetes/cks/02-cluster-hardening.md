---
title: "[CKS] 02. Cluster Hardening"
description: "X509 인증, Static Token, RBAC Role/RoleBinding/ClusterRole, Service Account 보안, Kubelet 보안 설정, Version Skew, kubeadm 클러스터 업그레이드 정리"
tags:
  - kubernetes
  - cks
  - security
  - rbac
  - kubelet
sidebar_position: 3
---

# [CKS] 02. Cluster Hardening

> **도메인**: Cluster Hardening
> **주요 주제**: 인증(Authentication), 인가/RBAC, Kubelet 보안, Service Account, Version Skew, 클러스터 업그레이드, Platform Binary 검증

---

## 1. Authentication (인증)

### 개요

- **인증**: 사용자가 시스템 또는 리소스에 접근하기 전 신원을 확인하는 과정
- Kubernetes는 사용자 계정을 **네이티브로 관리하지 않음** (API 호출로 사용자 추가 불가)

### 사용자 유형

| 유형 | 설명 |
|------|------|
| Normal Users (일반 사용자) | 사람용 계정 |
| Service Accounts | 애플리케이션/Pod용 계정 |

### 인증 방식

#### 1-1. Static Token Authentication

- API Server가 `--token-auth-file=SOMEFILE` 옵션으로 실행 시, 파일에서 베어러 토큰 읽음
- CSV 형식: `token, user name, user uid`

```
A342GHS3,alice,1001
BPRQRMS,bob,1002
```

- 클라이언트 사용:
```
Authorization: Bearer A342GHS3
```

**단점**:
- 토큰이 파일에 평문으로 저장
- 토큰 폐기/교체 시 API Server 재시작 필요
- **사용 권장하지 않음**

#### 1-2. X509 Client Certificates

- CA로 서명된 클라이언트 인증서로 인증
- API Server에 구성된 CA 중 하나로 서명된 경우 인증 성공

```bash
# 인증서 CSR 생성 예시
openssl req -new -key alice.key -subj "/CN=alice/O=admins" -out alice.csr
# CN = Common Name (사용자명)
# O = Organization (그룹명)
```

**단점**:
- 개인 키가 로컬 디스크(비보안 미디어)에 저장
- 인증서는 장기 유효 (Kubernetes는 인증서 폐기 지원 없음)
- 그룹 변경 시 새 인증서 발급 필요

### system:masters 그룹

- `system:masters` 그룹의 사용자는 Kubernetes API Server에 **무제한 접근 권한** 보유
- 모든 ClusterRole/Role이 삭제되어도 이 그룹 멤버는 전체 접근 유지
- **X509 인증서 기반 인증에서 특히 위험**: 인증서 폐기 메커니즘 없음

---

## 2. Authorization / RBAC

### Authorization (인가) 개요

- 인증된 사용자가 **무엇을 할 수 있는지** 결정하는 과정
- 인증 후 인가 단계 진행

### 인가 모드

| 모드 | 설명 |
|------|------|
| AlwaysAllow | 모든 요청 허용 (보안 위험, 테스트용) |
| AlwaysDeny | 모든 요청 차단 (테스트용) |
| RBAC | 권한 기반 접근 제어 (프로덕션 **권장**) |
| Node | kubelet에 권한 부여용 특수 모드 |

> **주의**: 인가 모드를 명시하지 않으면 기본값은 `AlwaysAllow`

### RBAC (Role-Based Access Control)

#### 핵심 개념 3가지

```
Role → 권한 집합 정의
Subjects → 사용자, 그룹, Service Account
RoleBinding → Role을 Subjects에 연결
```

#### Role (네임스페이스 범위)

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]          # 1. API 그룹
  resources: ["pods"]      # 2. 리소스
  verbs: ["get", "list"]   # 3. 동사(허용 작업)
```

**API 그룹 예시**:

| API Groups | 설명 |
|-----------|------|
| `""` (빈 문자열) | 코어 API 그룹 (pods, services, configmaps 등) |
| `apps` | apps 그룹 (deployments, daemonsets, replicasets) |
| `batch` | Jobs, CronJobs |
| `networking.k8s.io` | Ingress, Network Policies |

**동사(Verbs)**:

| Verb | 설명 |
|------|------|
| get | 특정 리소스 읽기 |
| list | 해당 타입 리소스 목록 조회 |
| create | 새 리소스 생성 |
| update | 기존 리소스 수정 |
| delete | 리소스 삭제 |
| watch | 리소스 변경사항 관찰 |

#### RoleBinding

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: alice
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

#### ClusterRole / ClusterRoleBinding

- Role/RoleBinding과 유사하지만 **모든 네임스페이스**에 걸쳐 권한 적용

```bash
# 명령어로 생성
kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
kubectl create clusterrolebinding pod-reader-binding --clusterrole=pod-reader --user=alice
```

---

## 3. Service Accounts

### 개요

| 계정 유형 | 사용 주체 |
|---------|---------|
| User Accounts | 사람 |
| Service Accounts | 애플리케이션/Pod |

### Service Account 동작 방식

- Pod가 Service Account를 사용해 Kubernetes 클러스터에 연결하여 작업 수행
- 각 네임스페이스에는 **default** Service Account가 자동 생성
- Pod에 Service Account를 명시하지 않으면 해당 네임스페이스의 default SA가 자동 할당

### 토큰 마운트

- Service Account Token은 Pod 내 `/var/run` 경로에 마운트
- 동일한 SA를 사용하는 2개의 Pod도 각각 **다른 토큰**을 받음

### Service Account 보안 위험

- default SA가 과도한 권한을 가지면, 그것을 사용하는 모든 Pod가 해당 권한을 상속

### Auto-Mounting 비활성화

**SA 레벨에서 비활성화**:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-sa
automountServiceAccountToken: false
```

**Pod 레벨에서 비활성화**:
```yaml
spec:
  automountServiceAccountToken: false
```

**우선순위**: Pod 레벨 설정이 SA 레벨 설정보다 **우선** 적용

---

## 4. Kubelet 보안

### Kubelet API

- 각 노드의 `https://<node-ip>:10250/`에서 API 제공
- 잘못 구성된 경우 인증 없이 인터넷에 노출될 수 있음

### Anonymous Authentication

- 미인증 요청을 Kubelet API에 허용하는 폴백 메커니즘
- 보안상 **비활성화 권장**

### Authorization Mode

| 모드 | 설명 | 프로덕션 권장 |
|------|------|-------------|
| AlwaysAllow | 인가 없이 모든 요청 허용 | **아니요** |
| Webhook | 외부 웹훅으로 세밀한 접근 제어 | **예** |

### 주요 Kubelet 보안 설정

```yaml
# kubelet 설정 파일 (/var/lib/kubelet/config.yaml)
authentication:
  anonymous:
    enabled: false              # 익명 인증 비활성화
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt  # 클라이언트 CA 파일
authorization:
  mode: Webhook                 # Webhook 인가 모드
```

```bash
# TLS 설정 플래그
--tls-cert-file      # HTTPS 서빙용 인증서 파일 경로
--tls-private-key-file  # HTTPS 서빙용 개인 키 파일 경로
# 미설정 시 자체 서명 인증서 자동 생성
```

---

## 5. Platform Binary 검증

### 해시(Hashing) 기반 무결성 검증

- **해싱**: 임의 크기의 데이터를 고정 크기 비트 배열로 매핑하는 단방향 함수

```bash
# kubernetes 아카이브 무결성 검증
sha512sum kubernetes.tar.gz
# 출력 해시값을 공식 웹사이트에 게시된 해시값과 비교
```

---

## 6. Version Skew Policy

### 개요

- 다양한 Kubernetes 컴포넌트 간의 버전 차이 허용 범위 정책
- 버전 형식: `<MAJOR>.<MINOR>.<PATCH>` (예: v1.32.2)

### 컴포넌트별 Version Skew 허용 범위

| 컴포넌트 | 허용 범위 |
|---------|---------|
| kube-apiserver (HA) | 인스턴스 간 최대 **1 minor** 버전 차이 |
| kubelet | apiserver보다 **최대 3 minor** 버전 이하 (newer 불가) |
| kube-proxy | apiserver보다 **최대 3 minor** 버전 이하 (newer 불가) |
| kube-controller-manager | apiserver와 동일 또는 **최대 1 minor** 이하 |
| kube-scheduler | apiserver와 동일 또는 **최대 1 minor** 이하 |
| cloud-controller-manager | apiserver와 동일 또는 **최대 1 minor** 이하 |
| kubectl | apiserver 기준 **±1 minor** 버전 |

**예시** (kube-apiserver v1.32 기준):
- kubelet: v1.32, 1.31, 1.30, 1.29 지원
- kubectl: v1.33, 1.32, 1.31 지원

---

## 7. 클러스터 업그레이드 (kubeadm)

### 핵심 원칙

- **마이너 버전은 순차적으로** 업그레이드 (1.31 → 1.32 → 1.33, 건너뛰기 불가)

### 업그레이드 순서

```
1. Control Plane Node 업그레이드
2. Worker Node 업그레이드
```

### 업그레이드 절차 (Control Plane)

```bash
# 1. 업그레이드 가능한 버전 확인
kubeadm upgrade plan

# 2. 업그레이드 적용
kubeadm upgrade apply v1.32.0

# 3. kubelet은 별도로 수동 업그레이드 필요
# (kubeadm upgrade apply는 kubelet을 업그레이드하지 않음)
apt-get upgrade -y kubelet=1.32.0-00
systemctl restart kubelet
```

### 업그레이드 절차 (Worker Node)

```bash
# Worker Node 업그레이드는 Control Plane과 다른 단계 필요
# 1. 노드 드레인
kubectl drain <node-name> --ignore-daemonsets

# 2. kubeadm 업그레이드
kubeadm upgrade node

# 3. kubelet 업그레이드 및 재시작
apt-get upgrade -y kubelet=1.32.0-00
systemctl restart kubelet

# 4. 노드 uncordon
kubectl uncordon <node-name>
```

### Projected Volumes

- 여러 볼륨 소스를 Pod의 단일 볼륨 마운트에 결합하는 기능

```yaml
# 지원 볼륨 소스
- Secret
- ConfigMap
- ServiceAccountToken
- DownwardAPI
- ClusterTrustBundle
```
