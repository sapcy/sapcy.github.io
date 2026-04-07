---
title: Pod와 컨테이너 격리
description: chroot, Linux namespaces, cgroup, OverlayFS 등 컨테이너 격리 원리
tags:
  - cloud
  - kubernetes
---

# Pod와 컨테이너 격리

> 컨테이너는 **격리된 환경**에서 실행되는 **프로세스**

## 컨테이너가 격리된 환경을 구현하는 주요 원리

- 루트 디렉토리 격리(chroot)
- Linux namespaces
  - Mount (mnt)
  - Process ID (pid)
  - Network (net)
  - Interprocess Communication (ipc)
  - Unix Time-Sharing (uts)
  - User ID (user)
- Control group (cgroup)
- OverlayFS
  …등등

### 1) 루트 디렉토리 격리

*chroot*
: 입력된 경로 (New root path)가 루트 디렉토리로 격리된 프로세스(command)를 실행하기 위한 명령어

```bash
$ chroot <NewRoot> <Command>
```

### 2) Linux Namespaces

#### Linux Namespace

→ 프로세스 간 시스템 자원들을 격리하기 위한 Linux 커널의 기능

리눅스에서 지원하는 네임스페이스는 크게 보면 다음과 같다.

- cgroup: Cgroup(단일 또는 태스크 단위의 프로세스 그룹에 대한 자원 할당을 제어하는 커널 모듈) 네임스페이스.
- ipc: IPC(inter-process communication, 프로세스 간 통신) 네임스페이스
- net: 네트워크 네임스페이스
- mnt: 마운트 네임스페이스
- pid: PID 네임스페이스
- uts: UTS(유닉스 시분할 시스템) 네임스페이스
- user: 사용자 네임스페이스
- time: 시간 네임스페이스

*unshare*
: 특정 namespace를 격리한 프로세스를 실행할 수 있는 명령어

```bash
# mount namespace 격리(-m)한 /bin/bash 프로세스 실행
$ unshare -m /bin/bash
# mount namespace(-m)와 ipc namespace를 격리(-i)한 /bin/bash 프로세스 실행
$ unshare -m -i /bin/bash
```
