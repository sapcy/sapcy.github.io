---
title: "[CKS] 07. 시험 핵심 포인트 및 빠른 참조"
description: "CKS 시험 직전 복습용 요약. CIS Benchmarks, ImagePolicyWebhook, Auditing, Docker Security, Network Policy, PSS, Security Context, Falco, Deployment 매니페스트, 빠른 참조 명령어 모음"
tags:
  - kubernetes
  - cks
  - security
  - exam
sidebar_position: 8
---

# CKS - 시험 준비 핵심 포인트

> **이 문서는 시험 직전 복습용 요약입니다. 실제 학습은 각 도메인별 상세 문서를 참고하세요.**

---

## 시험 기본 사항

- **전제 조건**: CKA 자격증 필요 (만료 CKA도 인정)
- **형식**: 실습 기반 랩 시험 (여러 시나리오 해결)
- **주의**: 이 요약은 전체 강의를 대체하지 않음

---

## 1. CIS Benchmarks

**핵심 포인트**:
- 컨트롤 플레인 + 워커 노드 구성을 CIS Benchmark 기준으로 설정하는 방법 숙지
- kubeadm 구조 및 트러블슈팅 포인트 숙지

**자주 나오는 설정**:
```bash
# API Server - Authorization Mode 설정
--authorization-mode=RBAC,Node   # (AlwaysAllow 금지)

# Kubelet - Anonymous Authentication 비활성화
--anonymous-auth=false
--authorization-mode=Webhook

# ETCD - auto-tls 비활성화
--auto-tls=false
```

---

## 2. ImagePolicyWebHook

**엔드 투 엔드 설정 단계**:

```
Step 1: 설정 파일(Configuration File) 생성
Step 2: KubeConfig 파일 생성
Step 3: 볼륨 마운트 설정 (kube-apiserver manifest에)
Step 4: Admission Controller 활성화
```

**핵심 파라미터**: `defaultAllow` 파라미터 (웹훅 연결 불가 시 기본 동작 결정)

```yaml
# 설정 파일 예시
imagePolicy:
  kubeConfigFile: /etc/kubernetes/image-policy-webhook.conf
  allowTTL: 50
  denyTTL: 50
  retryBackoff: 500
  defaultAllow: false   # 웹훅 불가 시 기본 거부
```

---

## 3. Auditing (감사)

**필수 플래그 기억**:

| 플래그 | 설명 |
|--------|------|
| `--audit-log-path` | 감사 로그 파일 경로 |
| `--audit-log-maxage` | 오래된 로그 파일 최대 보존 일수 |
| `--audit-log-maxbackup` | 보존할 최대 감사 로그 파일 수 |
| `--audit-log-maxsize` | 로테이션 전 최대 크기(MB) |

**예제 시험 문제**:
```
1. 로그 저장 위치: /var/log/demo-audit.log
2. 로그 보존 기간: 30일
3. 최대 크기: 500MB
4. 최대 파일 수: 10개

→ --audit-log-path=/var/log/demo-audit.log
→ --audit-log-maxage=30
→ --audit-log-maxsize=500
→ --audit-log-maxbackup=10
```

**Audit Policy 레벨**: None → Metadata → Request → RequestResponse

---

## 4. Docker Security

**자주 나오는 시나리오**:

1. Dockerfile 보안 취약점 5가지 찾아 수정
2. Docker Daemon이 2375 포트에서 수신하지 않도록 설정
3. Docker Daemon 보안 강화 (TLS 인증서 기반 인증)
4. 사용자를 docker 그룹에서 제거

**Dockerfile 체크리스트**:
- [ ] 최신 베이스 이미지 사용
- [ ] 최소한의 이미지 (alpine 등)
- [ ] RUN 명령어 통합 (레이어 최소화)
- [ ] root 사용자 대신 비특권 사용자 사용
- [ ] 민감 정보 하드코딩 없음

---

## 5. Static Analysis (정적 분석)

- 주어진 Kubernetes 매니페스트 파일 읽고 보안 관련 문제 수정
- 주의할 항목:
  - `privileged: true` 제거
  - `runAsUser: 0` 수정
  - `hostPath` 볼륨 제거
  - `hostNetwork: true` 제거
  - `imagePullPolicy: Never` → `Always`로 변경

---

## 6. Network Policies + Cilium Network Policies

**Network Policy 작성 시 주의**:
- `from` (ingress), `to` (egress) 방향 혼동 주의
- 빈 `podSelector: {}` = 네임스페이스 내 모든 Pod
- policyTypes 명시 없이 ingress/egress 규칙만 있으면 해당 방향만 적용

**Cilium Network Policy 특이사항**:
- `ingressDeny` / `egressDeny` 블록 숙지
- **Entities** 종류 숙지: `world`, `host`, `cluster`, `remote-node`, `all`

```yaml
# Cilium - 클러스터 내부 통신만 허용, 외부 차단
spec:
  egress:
  - toEntities:
    - cluster   # 클러스터 내부만 허용

# Cilium - 외부 인터넷 허용
spec:
  egress:
  - toEntities:
    - world
```

---

## 7. Pod Security Standards (PSS)

| 정책 | 설명 | 허용 항목 |
|------|------|---------|
| Privileged | 완전 비제한 | 모든 것 |
| Baseline | 알려진 권한 상승 방지 | 일반 워크로드 |
| Restricted | 강력한 하드닝 | 보안 크리티컬 |

**레이블 형식**:
```
pod-security.kubernetes.io/<MODE>: <profile>
pod-security.kubernetes.io/<MODE>-version: <version>
```

**모드**: enforce (거부) / audit (감사 기록) / warn (경고)

**핵심**: PSS 설정 및 조정 방법을 Pod와 Deployment 매니페스트 모두에서 이해

---

## 8. Security Context

**자주 나오는 항목**:

```yaml
securityContext:
  runAsUser: 1000           # 특정 UID로 실행
  runAsNonRoot: true        # 비 root 강제
  readOnlyRootFilesystem: true  # 루트 파일시스템 읽기 전용
  privileged: false         # Privileged Pod 비활성화
  capabilities:
    add: ["NET_ADMIN"]
    drop: ["ALL"]
  allowPrivilegeEscalation: false  # 권한 상승 금지
```

---

## 9. Kubernetes Secrets

**Secret 유형**:
- Opaque Secrets (일반 사용자 정의 데이터)
- TLS Secrets (TLS 인증서/키)
- Docker config Secrets (레지스트리 인증)

```bash
# Secret 생성 명령어
kubectl create secret generic my-secret --from-literal=key=value
kubectl create secret tls my-tls --cert=cert.pem --key=key.pem
kubectl create secret docker-registry my-reg \
  --docker-server=registry.example.com \
  --docker-username=user \
  --docker-password=pass
```

---

## 10. BOM and SBOM

**시나리오 예시**:
- 특정 패키지(xyz 1.3.2)가 포함된 이미지 찾기 → SBOM 생성

```bash
# bom 도구로 SBOM 생성
bom generate -o sbom.spdx nginx:latest

# Trivy로 SBOM 생성
trivy image --format spdx nginx:latest
```

---

## 11. 클러스터 업그레이드

- 컨트롤 플레인 노드와 워커 노드 업그레이드 단계가 **다름** (혼동 주의!)
- **마이너 버전은 순차적으로** (건너뛰기 불가)

```
컨트롤 플레인:
kubeadm upgrade plan → kubeadm upgrade apply → kubelet 수동 업그레이드

워커 노드:
kubectl drain → kubeadm upgrade node → kubelet 업그레이드 → kubectl uncordon
```

---

## 12. Ingress with TLS

**설정 단계**:
1. TLS 인증서/키로 Secret 생성
2. Ingress 리소스에 TLS 섹션 추가
3. HTTP → HTTPS 리다이렉트: `nginx.ingress.kubernetes.io/ssl-redirect` 어노테이션

---

## 13. Service Account + Projected Volumes

- automounting 비활성화 SA 생성 방법 숙지
- `automountServiceAccountToken: false` (SA 레벨 또는 Pod 레벨)
- **Pod 레벨 설정이 SA 레벨보다 우선**
- Projected Volumes으로 SA 토큰 마운트하는 방법 숙지

---

## 14. Falco (시험에서 마지막으로 남겨두길 권장)

**규칙 작성 방법 숙지**:

```yaml
- rule: My Custom Rule
  desc: 설명
  condition: spawned_process and container and proc.name = "curl"
  output: "Alert: %proc.name executed in %container.name"
  priority: WARNING
```

**Falco 로그 문제 발생 시**:
1. syslog에 debug priority 활성화 확인
2. systemd 우회하여 직접 CLI로 Falco 실행:
   ```bash
   falco -r /etc/falco/falco_rules.yaml -o json_output=true
   ```

---

## 15. Deployment 매니페스트 우선 숙지

> **시험에서는 Pod 매니페스트보다 Deployment 매니페스트를 더 자주 사용!**

```yaml
# Deployment 기본 구조
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      serviceAccountName: my-sa
      securityContext:
        runAsUser: 1000
      containers:
      - name: my-container
        image: nginx:1.25
        securityContext:
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
```

---

## 빠른 참조 명령어 모음

```bash
# RBAC
kubectl create role <name> --verb=get,list --resource=pods -n <ns>
kubectl create rolebinding <name> --role=<role> --user=<user> -n <ns>
kubectl create clusterrole <name> --verb=get --resource=pods
kubectl create clusterrolebinding <name> --clusterrole=<cr> --user=<user>
kubectl auth can-i get pods --as=alice -n default

# Network Policy 테스트
kubectl exec <pod> -- curl <target-ip>:<port>

# Secret
kubectl create secret generic <name> --from-literal=<key>=<value>
kubectl get secret <name> -o jsonpath='{.data.<key>}' | base64 -d

# Audit Log 확인
tail -f /var/log/audit.log | jq .

# Falco 상태 확인
systemctl status falco
journalctl -u falco -f

# kube-bench 실행
kube-bench run --targets master
kube-bench run --targets node

# Trivy 스캔
trivy image <image-name>
```
