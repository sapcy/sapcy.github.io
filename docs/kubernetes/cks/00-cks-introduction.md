---
title: "[CKS] 00. 개요 - 시험 소개, CIS Benchmarks, 접근 제어"
description: "CKS 자격증 소개, CIS Benchmarks 개념, Kubernetes 접근 제어(인증·인가·어드미션 컨트롤러) 흐름 정리"
tags:
  - kubernetes
  - cks
  - security
sidebar_position: 1
---

# [CKS] 00. 개요 - 시험 소개, CIS Benchmarks, 접근 제어

## 1. CKS란?

- **Certified Kubernetes Security Specialist (CKS)**: Kubernetes 플랫폼 보안 모범 사례에 대한 역량을 증명하는 자격증
- **전제 조건**: CKA(Certified Kubernetes Administrator) 취득 필요 (만료된 CKA도 인정)
- **시험 형식**: 실습 기반 랩 시험 (Lab-based exam) — 여러 시나리오를 직접 해결
- **커버 도메인**:
  1. Cluster Setup
  2. Cluster Hardening
  3. System Hardening
  4. Minimize Microservice Vulnerabilities
  5. Supply Chain Security
  6. Monitoring, Logging and Runtime Security

### 보안이 중요한 이유

- 보안을 소홀히 하면 침해 사고 발생
- 예시: Security Group이 "Allow ALL from ALL"로 열린 EC2는 전 세계로부터 무차별 대입 공격 수신
  - 96% 실패율, 616번 이상의 실패 시도 기록
- 대부분의 조직이 Kubernetes 클러스터 배포 시 보안 측면을 무시함
- K8s 보안 전문가에 대한 수요가 높음

---

## 2. CIS Benchmarks

### 개요

- **CIS Benchmarks**: Center for Internet Security(CIS)에서 개발한 모범 사례 보안 지침
- 시스템을 보안하는 방법에 대한 단계별 지침 제공
- 대상: AWS, Azure, GCP, Docker, Kubernetes, Linux, Windows, macOS, Nginx, Apache 등

### 특징 및 한계

- CIS Benchmarks는 100%의 요구사항을 커버하지 않을 수 있음
- 새로운 기술과 위협에 따라 지속적으로 업데이트
- 일부 권고사항은 비즈니스 요구사항과 충돌 가능
  - 예: CIS는 로컬 Linux 패스워드 복잡도를 요구하지만, 조직에서는 AD/IPA를 사용하는 경우

### Kubernetes CIS Benchmark

| 영역 | 하위 구성요소 |
|------|-------------|
| Control Plane Node | API Server, Controller Manager, Scheduler, ETCD |
| Worker Node | Kubelet, Kube-Proxy |
| 기타 | Pod Security Standards, CNI, Secrets, General |

- **관리형 K8s 클러스터 사용 시**: 고객 책임 범위에 맞는 별도 CIS Benchmark 적용
- **분석 도구**: `kube-bench` — CIS Kubernetes Benchmark 기반으로 배포 보안 여부 검사

```bash
# kube-bench 실행 예시
kube-bench run --targets master
kube-bench run --targets node
```

### 공유 책임 모델

- 관리형 Kubernetes(EKS, GKE, AKS 등) 사용 시 보안 책임이 공급자와 고객 간에 분담
- 고객은 워크로드, 접근 제어, 네트워크 정책 등에 대한 책임 보유

---

## 3. 랩 환경 설정

| 항목 | 내용 |
|------|------|
| 운영체제 | Ubuntu 24 LTS |
| 클라우드 제공자 | Digital Ocean (권장) |

### Digital Ocean을 권장하는 이유

1. 합리적인 가격 (시간당 과금)
2. 신규 사용자에게 $100~$200 크레딧 제공
3. 간단한 설정 방식

> **권고**: 실습과 동일한 OS 버전(Ubuntu LTS) 사용 권장

---

## 4. 접근 제어 (Access Control) 개요

Kubernetes API에 요청이 들어오면 다음 단계를 거침:

```
요청 → Authentication(인증) → Authorization(인가) → Admission Controllers → K8s Object 저장
```

### Stage 1: Authentication (인증)

| 인증 방식 | 설명 |
|----------|------|
| X509 Client Certificates | 신뢰할 수 있는 CA로 서명된 클라이언트 인증서 |
| Static Token File | 파일에 명시된 베어러 토큰 세트 |
| Service Account Tokens | 애플리케이션용 토큰 |

### Stage 2: Authorization (인가)

| 인가 모드 | 설명 |
|----------|------|
| AlwaysDeny | 모든 요청 차단 (테스트 용도) |
| AlwaysAllow | 모든 요청 허용 (인가 불필요 시) |
| RBAC | Kubernetes API를 통한 정책 생성/저장 |
| Node | kubelet에 권한 부여용 특수 모드 |

### Stage 3: Admission Controllers

- Kubernetes API 서버로의 요청을 인증/인가 후, etcd 저장 전에 가로채어 수정하거나 거부하는 코드 조각
- 두 가지 타입:
  - **Validating**: 요청 허용 또는 거부만 가능
  - **Mutating**: 요청 수정 후 허용/거부 가능
