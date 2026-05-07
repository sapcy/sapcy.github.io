---
title: "[CKS] 05. Supply Chain Security"
description: "OCI 스펙, CRI, 컨테이너 런타임, Trivy·kube-bench 취약점 스캐닝, Docker 데몬 보안, Dockerfile 모범사례, SBOM(SPDX·CycloneDX), 정적 분석 정리"
tags:
  - kubernetes
  - cks
  - security
  - docker
  - trivy
  - sbom
sidebar_position: 6
---

# [CKS] 05. Supply Chain Security

> **도메인**: Supply Chain Security
> **주요 주제**: OCI, 컨테이너 런타임(CRI), 취약점 스캐닝, Docker 보안, SBOM, 정적 분석, Dockerfile 모범 사례

---

## 1. Open Container Initiative (OCI)

### 표준화의 중요성

- 이미지 표준화가 없으면 개발자마다 다른 이미지 사용 → 트러블슈팅 및 보안 취약점

### OCI 개요

- **OCI (Open Container Initiative)**: Linux Foundation 프로젝트로 컨테이너 표준 설계
- 두 가지 핵심 스펙:

| 스펙 | 설명 |
|------|------|
| Image Specification | OCI 이미지 생성 방법 정의 (이미지 매니페스트, 파일시스템 레이어, 이미지 설정) |
| Runtime Specification | OCI 이미지 번들을 컨테이너로 실행하는 방법 정의 |

### 컨테이너 런타임 유형

**High-Level Runtime** (containerd, docker 등):
- 레지스트리에서 이미지 풀
- 이미지를 컨테이너 루트 파일시스템으로 언팩
- OCI 런타임 스펙 JSON 생성
- OCI 호환 런타임 (runc) 실행

**Low-Level Runtime** (runc, runsc/gVisor 등):
- 컨테이너 프로세스 실제 실행

### 주요 컨테이너 런타임

| 런타임 | 설명 |
|--------|------|
| Docker | 가장 널리 알려진 런타임 |
| containerd | K8s 기본 런타임, Docker에서 분리됨 |
| CRI-O | Kubernetes 특화 런타임 |
| Podman | 데몬 없는 컨테이너 런타임 |

### CRI (Container Runtime Interface)

- **CRI**: kubelet이 다양한 컨테이너 런타임을 재컴파일 없이 사용하게 하는 플러그인 인터페이스
- 각 컨테이너 런타임은 고유한 강점 보유
- CRI를 통해 kubelet은 런타임 구현에 독립적

```
kubelet → CRI → containerd → OCI → runc → Container
kubelet → CRI → cri-o     → OCI → runc → Container
kubelet → CRI → containerd → OCI → runsc(gVisor) → Container
```

---

## 2. 취약점 스캐닝

### 취약점, 익스플로잇, 페이로드

| 개념 | 설명 | 집 비유 |
|------|------|--------|
| Vulnerability (취약점) | 소프트웨어 코드의 결함 | 집 옆의 구멍 |
| Exploit (익스플로잇) | 취약점을 악용하는 프로그램 | 강도 |
| Payload (페이로드) | 익스플로잇 성공 후 수행되는 작업 | 강도가 집에서 하는 일 |

예시 페이로드: 데이터 탈취, 랜섬웨어 등

### 컨테이너 이미지 취약점 위험

- Docker 컨테이너는 보안 취약점을 내포할 수 있음
- 검증 없이 풀하여 프로덕션에 배포 시 침해 사고 위험

### Trivy

- **Trivy**: 컨테이너용 오픈소스 취약점 스캐너
- 이미지, 파일시스템, 설정 파일 등 스캔 가능

```bash
# 이미지 스캔
trivy image nginx:latest

# 파일시스템 스캔
trivy fs /path/to/project

# SBOM 생성
trivy image --format spdx nginx:latest -o nginx.spdx
```

### kube-bench

- **kube-bench**: CIS Kubernetes Benchmark 기반으로 Kubernetes 배포 보안 검사
- Go로 작성된 애플리케이션

```bash
# Control Plane 노드 검사
kube-bench run --targets master

# Worker 노드 검사
kube-bench run --targets node
```

---

## 3. Docker 보안

### Docker Daemon 보안

**문제**: Docker 데몬은 root 권한으로 실행 → 데몬에 접근하면 호스트 시스템의 상승된 권한 획득 가능

#### 1. Docker 그룹에서 사용자 제거

- Docker 그룹 사용자는 사실상 호스트 시스템의 root 권한 보유
- 민감한 호스트 디렉터리를 마운트하는 컨테이너 생성 가능

```bash
# 사용자를 docker 그룹에서 제거
sudo gpasswd -d username docker
```

#### 2. Docker Daemon TCP 노출 차단

- `tcp://0.0.0.0:2375` 또는 `tcp://0.0.0.0:2376` 노출 시 원격 공격 대상
  - 2375: TLS 없는 일반 HTTP (매우 위험)
  - 2376: TLS 보호 (안전)

```bash
# Docker 데몬 설정 확인
cat /etc/docker/daemon.json
```

#### 3. Docker Daemon Socket 보호 (TLS)

- HTTP로 Docker 데몬 접근 필요 시 TLS(HTTPS) 활성화 + 인증서 기반 인증 사용

### Docker 데몬 설정

두 가지 설정 방법:
1. JSON 설정 파일 (권장)
2. dockerd 시작 시 플래그

```json
// /etc/docker/daemon.json 위치
{
  "tls": true,
  "tlscert": "/path/to/cert.pem",
  "tlskey": "/path/to/key.pem",
  "tlscacert": "/path/to/ca.pem",
  "hosts": ["tcp://0.0.0.0:2376", "unix:///var/run/docker.sock"]
}
```

| OS 및 설정 | 위치 |
|-----------|------|
| Linux 기본 | `/etc/docker/daemon.json` |
| Windows | `C:\ProgramData\docker\config\daemon.json` |

---

## 4. Dockerfile 보안 모범 사례

### 1. 업데이트된 베이스 이미지 사용

```dockerfile
# 나쁜 예: 오래된 이미지
FROM ubuntu:18.04

# 좋은 예: 최신 LTS 이미지
FROM ubuntu:24.10
```

### 2. 최소한의 이미지 선호

```dockerfile
# 더 나은 예: Ubuntu 불필요 시 최소 이미지 사용
FROM alpine
```

### 3. 레이어 수 줄이기

```dockerfile
# 나쁜 예: 여러 RUN 명령어
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim

# 좋은 예: 단일 RUN으로 결합
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*
```

### 4. root로 실행 금지

```dockerfile
# 나쁜 예: root 사용자 (모든 권한)
USER root

# 좋은 예: 제한된 권한의 사용자
RUN useradd -r -u 1001 -g appgroup appuser
USER appuser
```

### 5. 민감 정보 하드코딩 금지

```dockerfile
# 나쁜 예
ENV DB_PASSWORD=secret123

# 좋은 예: 런타임에 Kubernetes Secret으로 주입
```

---

## 5. 정적 분석 (Static Analysis)

### 개요

- **정적 코드 분석**: 프로그램 실행 전 소스 코드를 검사하여 보안 문제 발견
- K8s 매니페스트 파일 및 Dockerfile 대상

### 검사 항목 예시

```
규칙 예시:
- root로 실행 금지
- HostPath 볼륨 마운트 금지
- HostNetwork 사용 금지
- ImagePullPolicy != Always
```

### 정적 분석 도구

- **Checkov**: K8s 매니페스트, Terraform, Dockerfile 등 정적 분석 도구

```bash
# Checkov 실행
checkov -f deployment.yaml
checkov -d /path/to/k8s/manifests
```

---

## 6. SBOM (Software Bill of Materials)

### BOM (Bill of Materials) 개념

- **BOM**: 제품 제조에 필요한 모든 구성요소, 수량, 재료 목록 (레시피와 유사)

### SBOM

- **SBOM**: 소프트웨어 애플리케이션을 구성하는 모든 컴포넌트의 상세 목록

```
NGINX
├── OpenSSL 1.2.1
├── PCRE 8.44
├── zLib 1.2.10
├── Curl 7.88
└── Bash 5.2
```

### SBOM 생성 도구

| 도구 | 설명 |
|------|------|
| Trivy | 이미지 스캔 + SBOM 생성 |
| Syft | Anchore의 SBOM 생성 도구 |
| bom | Linux Foundation 프로젝트 |

```bash
# Trivy로 SBOM 생성
trivy image --format spdx nginx:latest -o nginx.spdx
trivy image --format cyclonedx nginx:latest -o nginx-cyclonedx.json

# Syft로 SBOM 생성
syft nginx:latest -o spdx-json
```

### SBOM 형식

| 형식 | 개발 기관 | 주요 용도 |
|------|---------|---------|
| **SPDX** | Linux Foundation | 라이선스 컴플라이언스, IP, 보안 |
| **CycloneDX** | OWASP | 보안, 소프트웨어 공급망 위험 관리 |

| 특성 | SPDX | CycloneDX |
|------|------|-----------|
| 복잡도 | 복잡, 상세한 라이선스 메타데이터 | 단순, 보안 중심, 경량 |
| 주요 용도 | 오픈소스 컴플라이언스, 법적 감사 | 보안, 취약점 관리, 위험 평가 |
