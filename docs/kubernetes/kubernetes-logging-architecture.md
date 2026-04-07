---
format: md
title: Kubernetes Logging Architecture
description: kubectl logs 흐름을 5계층 다이어그램으로 정리하고, 커널·런타임·kubelet·클라이언트 관점에서 로그가 저장·전달되는 원리를 설명합니다.
tags:
  - cloud
  - kubernetes
  - container
  - logging
---

## Overview

Kubernetes에서 클라이언트가 Pod 로그를 볼 때 `kubectl logs <pod_name>`을 입력하게 된다.
아래는 그와 같은 상황에서 일어나는 이벤트와 로깅 아키텍처를 **5가지 레이어**로 나누어 한눈에 볼 수 있게 정리한 그림이다.

![Kubernetes 로깅 아키텍처(5계층)](kubernetes-logging-architecture-diagram.png)

컨테이너 로그가 저장·출력되는 원리를 저수준부터 고수준까지의 관점에서 하나씩 살펴보자.

---

## 1. Kernel Level (Low-Level)

### FD(파일 디스크립터) 세팅

컨테이너 프로세스가 시작될 때 아래와 같이 fd 세팅

```text
fd 0 → stdin
fd 1 → stdout
fd 2 → stderr
```

👉 이 fd들이 **container runtime이 만든 pipe로 연결됨**

### pipe 생성 (커널 내부 구조)

컨테이너 실행 전에 runtime이 pipe2 호출

> pipe: 프로세스간 통신을 할때 사용하는 커뮤니케이션의 한 방법.
> pipe2(): 두 개의 파일 디스크립터를 생성하는 리눅스 시스템 콜. 하나는 read end, 하나는 write end를 제공

```c
pipe2(pipefd, O_CLOEXEC);
```

구조:

```c
pipefd[0] → read end
pipefd[1] → write end
```

### pipe의 양쪽 끝 찾기

실제 노드에서 컨테이너와 컨테이너 런타임 간 통신을 위해 생성된 pipe를 살펴보면,

1) File로 조회

```bash
# container의 pid: 562475 인 경우
root@ubuntu:~# ls -al /proc/562475/fd/
total 0
dr-x------ 2 ubuntu 2000 104 Mar 20 06:05 .
dr-xr-xr-x 9 ubuntu 2000   0 Mar 20 06:05 ..
lrwx------ 1 ubuntu 2000  64 Mar 20 06:05 0 -> /dev/null
l-wx------ 1 ubuntu 2000  64 Mar 20 06:05 1 -> 'pipe:[347358099]'
...

# 출력 결과를 보면,
# fd 0 -> stdin
# fd 1 -> stdout (pipe:[347358099])
# 347358099가 inode 이고, 이를 공유하는 pipe를 찾기 위해 아래처럼 grep

root@ubuntu:~# ls -al /proc/*/fd/* | grep 347358099
lr-x------ 1 root root 64 Mar 20 06:05 /proc/561951/fd/13 -> pipe:[347358099]
l-wx------ 1 ubuntu 2000 64 Mar 20 06:05 /proc/562475/fd/1 -> pipe:[347358099]

# 출력 결과를 보면,
# /proc/562475/fd/1 : 컨테이너의 stdout
# /proc/561951/fd/13 : 컨테이너 런타임에서 컨테이너의 stdout을 pipe로부터 read (561951 -> containerd-shim pid)
```

2) lsof로 조회

```bash
# container의 pid: 562475 인 경우
root@ubuntu:~# lsof -p 562475 | grep pipe
COMMAND    PID    USER   FD  TYPE   DEVICE   SIZE/OFF NODE      NAME
prometheus 562475 ubuntu 1w  FIFO   0,14     0t0      347358099 pipe
prometheus 562475 ubuntu 2w  FIFO   0,14     0t0      347358100 pipe

# 1w -> fd 1 (write) -> stdout을 pipe에 write 하며 inode는 347358099
# 2w -> fd 2 (write) -> stderr을 pipe에 write 하며 inode는 347358100
# inode를 이용해 find를 하게되면

root@ubuntu:~# find /proc/*/fd -lname '*347358099*'
/proc/561951/fd/13
/proc/562475/fd/1

# pid 561951이 read 프로세스의 fd로 보여지므로, lsof를 통해 fd 13을 찾는다면

root@ubuntu:~# lsof -p 561951 | grep pipe
COMMAND   PID    USER  FD    TYPE   DEVICE   SIZE/OFF NODE      NAME
container 561951 root  13r   FIFO   0,14     0t0      347358099 pipe
container 561951 root  15r   FIFO   0,14     0t0      347358100 pipe

# 13r -> fd 13 (read), inode 347358099 -> stdout을 read
# 15r -> fd 15 (read), inode 347358100 -> stderr을 read

# COMMAND: 프로세스 실행 이름.
# PID: 프로세스 ID.
# USER: 프로세스를 실행한 사용자.
# FD: 프로세스가 사용 중인 파일 디스크립터 번호 및 접근 모드(r/w 등).
# TYPE: 파일 또는 리소스의 종류(REG, DIR, PIPE, IPv4 등).
# DEVICE: 파일이 위치한 디바이스의 major/minor 번호.
# SIZE/OFF: 파일 크기 또는 현재 오프셋(리소스에 따라 의미 다름).
# NODE: 파일의 inode 번호 또는 pipe/socket 식별자.
# NAME: 파일 경로, pipe, 소켓 등 실제 대상 이름 또는 연결 정보.
```

### dup2

컨테이너의 fd 1, 2는 원래라면 터미널(TTY)로 향하게 되는데 **runtime이 dup2()로 fd를 pipe로 전환**해준다.

> dup2(): dup2는 fd를 복제하고, 이를 통해 출력을 다른 위치로 전환하는 데 사용

내부적으로 보면 아래와 같이 동작한다.

```c
pipe(pipefd);        // pipe 생성
dup2(pipefd[1], 1);  // stdout을 pipe write로 변경
dup2(pipefd[1], 2);  // stderr도 pipe로 변경
```

- 컨테이너 내부 관점: 프로세스 → fd 1(stdout)
- 실제 시스템 관점: 프로세스 → fd1 → (pipe write end) → (pipe read end) → container runtime → 로그 수집

---

## 2. Container Runtime Level

### Runtime → 로그 파일 write

container runtime의 shim 프로세스가 pipe에서 읽은 stdout/stderr 데이터를 로그 파일에 기록한다.
runtime은 pipe raw 데이터를 그대로 쓰지 않고, 구조화된 텍스트로 가공해서 파일에 저장한다

- 단순 write가 아니라 **CRI 로그 포맷으로 변환**
- 한 줄 단위로 처리 (line buffering)

로그 포맷 구조:

```text
<timestamp> <stream> <flag> <log>
예) 2026-04-01T12:00:00.000000000Z stdout F hello world
```

### 필드 의미

- timestamp → 로그 발생 시간
- stream → stdout / stderr
- flag → F(Full) / P(Partial)
- log → 실제 메시지

로그 저장 위치:

```bash
# 실제 파일
/var/log/pods/<namespace>_<pod>_<uid>/<container>/0.log
```

- pod 단위 디렉토리
- container별 파일
- rotation 시 1.log, 2.log 등으로 증가

---

## 3. kubelet Level

### 로그 심볼링 링크 생성

```bash
/var/log/containers/<pod>_<namespace>_<container>-<container_id>.log
```

심볼링 링크를 생성하는 이유

- 실제 파일 경로가 깊음
- 사람이 보기 쉬움

| 경로                | 용도               |
| ------------------- | ------------------ |
| /var/log/pods       | kubelet 관리       |
| /var/log/containers | logging agent 접근 |

---

## 4. Client level

### 1️⃣ kubectl logs 실행

사용자가 `kubectl logs <pod>`를 실행하면 해당 요청은 kube API 서버로 전달된다.

### 2️⃣ apiserver → kubelet으로 프록시

apiserver는 로그를 직접 읽지 않는다.  
apiserver는 Pod가 실행 중인 노드의 kubelet으로 요청을 넘긴다.

### 3️⃣ kubelet 처리

kubelet이 실제 로그 처리를 담당한다.

#### kubelet이 하는 일

1. pod → container → log file 경로 찾기 (`/var/log/pods/.../0.log`)
2. 파일 open
3. 요청 옵션 적용
4. 로그를 읽어 stream으로 전달 — kubelet → apiserver → kubectl → 사용자 터미널

#### 전체 흐름 정리

```text
[User]
  ↓ kubectl logs
[kubectl CLI]
  ↓ HTTP request
[kube-apiserver]
  ↓ proxy
[kubelet]
  ↓ read file
[/var/log/pods/.../0.log]
  ↓
[kubelet → apiserver → kubectl]
  ↓
[User terminal 출력]
```
