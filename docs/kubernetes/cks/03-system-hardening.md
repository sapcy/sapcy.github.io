---
title: "[CKS] 03. System Hardening"
description: "Linux Capabilities 개념 및 Kubernetes 적용, AppArmor 모드·프로파일 설정, Seccomp·gVisor·RuntimeClass 컨테이너 샌드박싱 정리"
tags:
  - kubernetes
  - cks
  - security
  - linux
  - apparmor
sidebar_position: 4
---

# [CKS] 03. System Hardening

> **도메인**: System Hardening
> **주요 주제**: Linux Capabilities, AppArmor, Seccomp (컨테이너 샌드박싱)

---

## 1. Linux Capabilities

### 배경: 기존 유닉스 권한 모델의 문제

- Unix-like 시스템의 프로세스는 일반 사용자 권한 또는 root 권한으로 실행
- **문제**: root = 무제한 권한, 일반 사용자 = 제한된 권한 (이분법적)
- 특권 작업이 필요한 경우 대부분 `sudo`로 전체 root 권한 부여 → 보안 위험

### Linux Capabilities 개요

- **Linux Capabilities**: 일반 사용자가 실행하는 바이너리에 특정 특권 작업만 허용하는 메커니즘
- root로 시작된 프로세스도 제한된 권한만 갖도록 설정 가능

```
root (before Linux 2.2) → 완전한 권한
root (with capabilities) → 전체 capability 보유
root (limited capabilities) → 일부 capability만 활성화
```

### 주요 Capabilities 목록

| Capability | 설명 |
|-----------|------|
| CAP_NET_BIND_SERVICE | 1024 미만 포트에 바인딩 |
| CAP_NET_RAW | raw 소켓 사용 (ping 등) |
| CAP_SYS_TIME | 시스템 시계 수정 |
| CAP_SYS_ADMIN | 다양한 관리 작업 수행 |
| CAP_DAC_OVERRIDE | 파일 권한 우회 |

### 실제 예시: ping 명령

- ping은 ICMP 패킷 전송을 위해 raw 소켓 필요
- 임의 네트워크 패킷 생성은 보안 위험
- **해결**: `CAP_NET_RAW` capability만 부여 → 비특권 사용자도 ping 실행 가능

```bash
# 바이너리에 capability 확인
getcap /usr/bin/ping
# /usr/bin/ping = cap_net_raw+ep

# 바이너리에 capability 설정
setcap cap_net_bind_service+ep ./my_program
```

### Kubernetes에서 Capabilities 설정

```yaml
spec:
  containers:
  - name: my-container
    securityContext:
      capabilities:
        add: ["NET_BIND_SERVICE"]   # capability 추가
        drop: ["ALL"]               # 모든 capability 제거 후 필요한 것만 추가
```

> **Best Practice**: `drop: ["ALL"]`을 먼저 적용 후 필요한 capability만 `add`에 명시

---

## 2. AppArmor

### 배경: DAC의 한계

- **DAC (Discretionary Access Control)**: 주체의 신원과 그룹에 따라 객체 접근 제한
- **문제**: 프로그램이 실행 사용자의 전체 권한을 상속
  - 악성코드도 사용자가 접근 가능한 민감한 파일에 접근 가능

**예시**: 서버 로그 정리 바이너리가 갑자기 인터넷으로 데이터 전송

### MAC (Mandatory Access Control)

- **MAC**: 중앙 권한이 미리 정의된 보안 정책에 따라 리소스 접근을 엄격하게 규제
- **Confined (제한됨)**: 프로세스가 수행할 수 있는 모든 작업이 프로파일에 명시되어야 함
- **Unconfined (비제한)**: AppArmor 제한 없이 실행

### AppArmor 모드

| 모드 | 설명 |
|------|------|
| Enforce | AppArmor 보안 프로파일 활성화하여 위반 시 차단 |
| Complain | 위반 사항을 로그에 기록하지만 애플리케이션은 정상 실행 |
| Unconfined | AppArmor 제한 없이 실행 |

### Confined 프로세스

```
프로세스 X (Confined)
├── Allow read from /etc
├── Allow write to /tmp
└── Allow restart of nginx

→ 위 목록에 없는 작업은 모두 차단
```

### Kubernetes에서 AppArmor 적용

```yaml
spec:
  containers:
  - name: my-container
    securityContext:
      appArmorProfile:
        type: RuntimeDefault    # 런타임 기본 프로파일
        # type: Localhost       # 노드 파일시스템의 커스텀 프로파일
        # type: Unconfined      # AppArmor 비활성화
```

**프로파일 유형**:

| 타입 | 설명 |
|------|------|
| RuntimeDefault | 컨테이너 런타임의 기본 프로파일 사용 |
| Localhost | 노드 파일시스템에 저장된 커스텀 보안 프로파일 |
| Unconfined | AppArmor 없이 실행 |

---

## 3. Seccomp (Container Sandboxing)

### 기본 컨테이너 아키텍처의 문제

- 전통적인 Linux 컨테이너의 애플리케이션은 호스트 커널에 **직접 시스템 호출**
- 커널 레벨 버그 존재 시 애플리케이션이 이를 악용하여 권한 상승 등 가능

### Seccomp

- **Seccomp**: 애플리케이션과 호스트 커널 사이에 더 나은 격리를 제공하는 커널 기능
- 미리 허용된 시스템 호출 화이트리스트 필요
- **한계**: 애플리케이션이 필요로 하는 시스템 호출을 사전에 파악하기 어려움

### Container Sandbox

- **샌드박싱**: 소프트웨어와 운영체제 사이에 격리 수준을 강제하는 접근법

### gVisor

- **gVisor**: 일반적인 비특권 프로세스로 실행되는 커널
- 애플리케이션의 모든 시스템 호출을 가로채어 처리 → 강력한 격리 경계 제공
- runc(기본 런타임)를 대체하는 OCI 런타임 `runsc` 제공

```
일반 컨테이너:
Application → Host Kernel (직접 접근)

gVisor 컨테이너:
Application → gVisor Kernel (runsc) → Host Kernel (제한된 접근)
```

**gVisor 적용 확인**:
```bash
# dmesg 출력 비교
# gVisor Pod: gVisor 커널 메시지 표시
# 일반 Pod: 호스트 커널 메시지 표시
```

**장단점**:
- 장점: 신뢰하지 않는 애플리케이션(GitHub에서 클론한 코드 등)에 적합
- 단점: 성능 저하 가능성

### RuntimeClass

- **RuntimeClass**: 다른 컨테이너 런타임 구성을 선택하는 기능
- Pod별로 다른 RuntimeClass 설정 → 성능과 보안의 균형

```yaml
# RuntimeClass 정의
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc

---
# Pod에서 RuntimeClass 사용
spec:
  runtimeClassName: gvisor
  containers:
  - name: my-container
```

| Pod | Runtime |
|-----|---------|
| pod1 | default (runc) |
| pod2 | gvisor (runsc) |
