---
format: md
title: "containerd-shim 역할"
description: "부모 프로세스·runc 분리·상태·로그·시그널·exit code - shim이 하는 일"
tags:
  - container
  - docker
---

### **✅ 역할 요약**

|**기능**|**설명**|
|---|---|
|부모 역할|컨테이너 프로세스의 **부모 프로세스(PPID)**가 되어줌|
|runc 분리|runc가 종료돼도 컨테이너가 계속 살아 있도록 만듦|
|상태 관리|containerd에 컨테이너 상태 정보 보고|
|로그 처리|stdout/stderr 수집 (containerd에 넘김)|
|signal 처리|SIGTERM, SIGKILL 등 전달해서 graceful shutdown 처리|
|exit code 수집|종료된 컨테이너의 exit code 전달|