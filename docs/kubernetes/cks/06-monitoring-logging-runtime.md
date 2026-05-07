---
title: "[CKS] 06. Monitoring, Logging and Runtime Security"
description: "Falco 규칙 작성·매크로·/dev/mem 감지, Sysdig 시스템 호출 모니터링, Kubernetes Audit Policy 레벨·단계·플래그 설정 정리"
tags:
  - kubernetes
  - cks
  - security
  - falco
  - sysdig
  - audit
sidebar_position: 7
---

# [CKS] 06. Monitoring, Logging and Runtime Security

> **도메인**: Monitoring, Logging and Runtime Security
> **주요 주제**: Falco, Sysdig, Audit Logging

---

## 1. Falco

### 감지(Detection)와 예방(Prevention)

- Kubernetes의 Network Policy, RBAC 등은 주로 **예방** 기능
- **감지**도 동등하게 중요: 환경에서 진행 중인 활동을 모니터링하고 가시성 확보

### Falco 개요

- **Falco**: 오픈소스 런타임 보안 도구
- 조건이 충족될 때 알림을 트리거하는 규칙 세트 정의
- 호스트 기반 및 컨테이너 기반 이벤트 캡처

**감지 예시 규칙**:
- 컨테이너 내 셸(shell) 실행
- `/etc/shadow` 같은 민감한 파일 읽기
- `curl` / `wget` 명령 사용
- 새 패키지 설치

### Falco 설치 및 설정

**설정 파일**: `/etc/falco/falco.yaml` (YAML 형식의 key-value 쌍)

### Falco 규칙 구조

```yaml
- rule: Detect curl in Container
  desc: Detects the execution of curl command inside a Kubernetes pod
  condition: spawned_process and container and proc.name = "curl"
  output: "curl executed in container (user=%user.name container=%container.name)"
  priority: WARNING
```

**규칙 필드 설명**:

| 필드 | 설명 |
|------|------|
| rule | 규칙 이름 (고유하고 설명적이어야 함) |
| desc | 규칙의 사람이 읽을 수 있는 설명 |
| condition | 규칙 트리거 조건 (논리 표현식) |
| output | 규칙 조건 충족 시 생성되는 알림 메시지 |
| priority | 규칙의 심각도 수준 (EMERGENCY, ALERT, CRITICAL, ERROR, WARNING 등) |

### Macros (매크로)

- 미리 정의된 규칙 조건 (재사용 가능한 조건 표현식)
- 동일한 복잡한 표현식을 반복 작성하지 않도록 방지

```yaml
# 매크로 정의
- macro: spawned_process
  condition: evt.type = execve and evt.dir = <

- macro: container
  condition: container.id != host

# 매크로 사용
- rule: Detect Shell in Container
  condition: spawned_process and container and proc.name in (shell_binaries)
```

### /dev/mem 접근 모니터링

- `/dev/mem`: 시스템의 물리적 메모리에 접근하는 특수 장치 파일
- 미인가 접근 시 → 권한 상승, 커널 익스플로잇 등 위험
- 컨테이너는 기본적으로 `/dev/mem`에 접근 불가
  - 접근 가능: privileged Pod 또는 특별 권한이 명시적으로 부여된 경우

```yaml
# /dev/mem 접근 감지 Falco 규칙
- rule: Detect /dev/mem Access
  desc: Detect any access to /dev/mem device
  condition: open_read and fd.name = /dev/mem
  output: "/dev/mem was opened (user=%user.name command=%proc.cmdline)"
  priority: CRITICAL
```

### Falco 트러블슈팅

```bash
# systemd로 실행 시 로그 확인
journalctl -u falco

# 직접 CLI로 실행 (systemd 우회)
falco -r /etc/falco/falco_rules.yaml

# syslog를 통한 로그 확인 (debug priority 활성화 필요)
grep falco /var/log/syslog
```

---

## 2. Sysdig

### 개요

- **Sysdig**: 시스템 호출을 모니터링하는 강력한 도구
- 기존 여러 도구의 기능을 하나로 통합

| 기존 도구 | 기능 | Sysdig |
|---------|------|--------|
| strace | 시스템 호출 탐색 | 통합 지원 |
| tcpdump | 네트워크 트래픽 모니터링 | 통합 지원 |
| lsof | 프로세스가 열린 파일 확인 | 통합 지원 |
| netstat | 네트워크 연결 모니터링 | 통합 지원 |
| htop | 프로세스 모니터링 | 통합 지원 |
| iftop | 네트워크 대역폭 모니터링 | 통합 지원 |

### 인터페이스

| 도구 | 설명 |
|------|------|
| sysdig | 명령줄 옵션 |
| csysdig | 인터랙티브 UI |

### Sysdig 기본 사용

```bash
# 모든 시스템 호출 모니터링 (매우 많은 데이터)
sysdig

# 특정 프로세스 필터링
sysdig proc.name=nginx

# 특정 컨테이너 필터링
sysdig container.name=my-container

# 네트워크 연결 모니터링
sysdig -p "%proc.name %fd.name" "evt.type=connect"
```

### Sysdig Chisels

- **Chisels**: sysdig 이벤트 스트림을 분석하여 유용한 작업을 수행하는 스크립트

```bash
# 사용 가능한 Chisel 목록
sysdig -cl

# 특정 Chisel 실행
sysdig -c topprocs_cpu  # CPU 사용량 상위 프로세스
sysdig -c netstat       # 네트워크 연결 상태
```

---

## 3. Audit Logging (감사 로깅)

### Auditing 개요

감사는 클러스터에서 발생하는 다음 사항을 기록:

```
- what happened?    (무슨 일이?)
- when?             (언제?)
- who initiated it? (누가?)
- on what?          (무엇에?)
- from where?       (어디서?)
- to where?         (어디로?)
```

### Audit Policy 레벨

| 레벨 | 설명 |
|------|------|
| **None** | 이 규칙에 매칭되는 이벤트를 기록하지 않음 |
| **Metadata** | 요청 메타데이터만 기록 (사용자, 타임스탬프, 리소스, 동사 등) |
| **Request** | 메타데이터 + 요청 본문 기록 (응답 본문 제외) |
| **RequestResponse** | 메타데이터 + 요청/응답 본문 모두 기록 |

### Audit Stages

| 단계 | 설명 |
|------|------|
| RequestReceived | 요청 수신 직후, 핸들러 체인 위임 전 |
| ResponseStarted | 응답 헤더 전송 후, 응답 본문 전송 전 (장기 실행 요청에만 생성) |
| ResponseComplete | 응답 본문 완성, 더 이상 바이트 전송 없음 |
| Panic | 패닉 발생 시 생성 |

### Audit Policy 작성

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # 특정 리소스는 Metadata 레벨로 기록
  - level: Metadata
    resources:
    - group: ""
      resources: ["secrets", "configmaps"]

  # 특정 namespace는 Request 레벨로 기록
  - level: Request
    namespaces: ["production"]

  # 시스템 컴포넌트 요청은 로깅 제외
  - level: None
    users: ["system:kube-proxy"]
    verbs: ["watch"]
    resources:
    - group: ""
      resources: ["endpoints", "services"]

  # 기본값: Metadata
  - level: Metadata
```

### kube-apiserver Audit 설정 플래그

| 플래그 | 설명 |
|--------|------|
| `--audit-policy-file` | 감사 정책 파일 경로 |
| `--audit-log-path` | 감사 로그 파일 경로 (예: `/var/log/audit.log`) |
| `--audit-log-maxage` | 오래된 감사 로그 파일 최대 보존 일수 |
| `--audit-log-maxbackup` | 보존할 최대 감사 로그 파일 수 |
| `--audit-log-maxsize` | 로테이션 전 감사 로그 파일 최대 크기(MB) |

### 실전 설정 예시

**요구사항**:
1. 로그 저장 위치: `/var/log/demo-audit.log`
2. 로그 보존 기간: 30일
3. 로테이션 전 최대 크기: 500MB
4. 최대 감사 로그 파일 수: 10개

```yaml
# kube-apiserver 설정에 추가 (Static Pod manifest)
spec:
  containers:
  - command:
    - kube-apiserver
    - --audit-policy-file=/etc/kubernetes/audit-policy.yaml
    - --audit-log-path=/var/log/demo-audit.log
    - --audit-log-maxage=30
    - --audit-log-maxsize=500
    - --audit-log-maxbackup=10
```

> **주의**: Static Pod 매니페스트 수정 후 `/etc/kubernetes/manifests/kube-apiserver.yaml`을 편집하면 kubelet이 자동으로 재시작

---

## 4. 런타임 보안 요약

### 방어 계층 구조

```
예방 (Prevention)
├── RBAC (Role-Based Access Control)
├── Network Policies
├── Pod Security Standards
├── Admission Controllers
└── SecurityContext

감지 (Detection)
├── Falco (런타임 이상 행위 탐지)
├── Audit Logging (API 접근 감사)
└── Sysdig (시스템 호출 모니터링)
```

### 주요 감지 도구 비교

| 도구 | 목적 | 감지 방식 |
|------|------|---------|
| **Falco** | 런타임 이상 행위 감지 | 시스템 호출 기반 규칙 |
| **Audit Logging** | K8s API 접근 감사 | API Server 이벤트 기록 |
| **Sysdig** | 시스템 호출 모니터링/분석 | 실시간 시스템 호출 캡처 |
