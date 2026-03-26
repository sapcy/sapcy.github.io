---
format: md
title: "OCI(Open Container Initiative) 개요"
description: "번들·설정·런타임 라이프사이클·표준 원칙·주요 구현체까지 OCI 런타임 스펙 요약"
tags:
  - container
  - docker
---

### 🎯 **OCI란 무엇인가?**
OCI(Open Container Initiative)는 운영체제 프로세스와 애플리케이션 컨테이너에 대한 표준을 개발하는 조직입니다. 이 프로젝트는 컨테이너의 **설정**, **실행 환경**, **라이프사이클**을 명세하는 **Runtime Specification**을 제공합니다.

### **핵심 구성 요소**
#### 1. **Bundle (파일시스템 번들)**
- 컨테이너를 인코딩하는 표준 형식
- 다음 두 가지 필수 아티팩트 포함:
	  - `config.json`: 설정 데이터
	  - 컨테이너의 루트 파일시스템

#### 2. **Configuration (설정)**
- `config.json` 파일에 정의
- 프로세스 실행 정보, 환경 변수, 샌드박싱 기능 등 포함
- 플랫폼별 특화 설정 지원 (Linux, Windows, Solaris, VM, z/OS)

#### 3. **Runtime & Lifecycle (런타임 및 라이프사이클)**
- 컨테이너의 상태 관리
- 표준화된 라이프사이클
	- create → start → stop → delete
- Hook 시스템을 통한 확장성 제공

### 🏗️ **지원 플랫폼**
- **Linux**: 가장 완전한 지원
- **Windows**: Windows Server Containers, Hyper-V Containers
- **Solaris**: Solaris Zones 기반
- **VM**: 가상머신 환경
- **z/OS**: IBM 메인프레임 환경

### 🔧 **표준 컨테이너의 5가지 원칙**
1. **표준 작업 (Standard Operations)**: 생성, 시작, 중지, 복사, 스냅샷 등
2. **콘텐츠 무관성 (Content-agnostic)**: 내용에 관계없이 동일한 효과
3. **인프라 무관성 (Infrastructure-agnostic)**: 모든 OCI 지원 인프라에서 실행 가능
4. **자동화 설계 (Designed for Automation)**: 자동화에 최적화
5. **산업급 배포 (Industrial-grade Delivery)**: 대규모 소프트웨어 배포 파이프라인 지원

### 🔄 **컨테이너 라이프사이클**
```
1. create → 2. prestart hooks → 3. createRuntime hooks → 4. createContainer hooks
2. start → 6. startContainer hooks → 7. 실행 → 8. poststart hooks
3. 프로세스 종료 → 10. delete → 11. poststop hooks
```

### 🎯 **주요 사용 사례**
1. **애플리케이션 번들 빌더**: 컨테이너 실행에 필요한 모든 파일을 포함한 번들 생성
2. **Hook 개발자**: 컨테이너 라이프사이클에 외부 애플리케이션 연동
3. **런타임 개발자**: OCI 호환 런타임 구현

### **Features 구조**
- 런타임이 구현한 기능들을 JSON 구조로 제공
- 호스트 OS의 실제 기능 가용성과는 무관
- 컴파일 타임에 결정되는 기능 목록

### **실제 구현체들**
- **runc**: 가장 널리 사용되는 OCI 런타임
- **containerd**: 컨테이너 런타임 관리
- **CRI-O**: Kubernetes 전용 컨테이너 런타임
- **Podman**: Docker 호환 컨테이너 엔진

이 스펙은 컨테이너 기술의 표준화를 통해 **호환성**, **이식성**, **자동화**를 보장하며, 현대적인 클라우드 네이티브 애플리케이션 개발의 기반이 되고 있습니다.