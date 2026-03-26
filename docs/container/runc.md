---
format: md
title: "runc - OCI 저수준 런타임"
description: "containerd와 runc의 관계, cgroup·namespace·chroot 후 exec로 프로세스 기동"
tags:
  - container
  - docker
---

### **runc: 컨테이너 생성기 (한 번 쓰고 사라지는 실행기)**

- OCI 스펙에 따라 **컨테이너를 실제로 생성하는 도구**
- containerd가 runc를 호출하면:    
    1. cgroup, namespace 등 설정
    2. chroot해서 루트 파일시스템 바꾸고
    3. exec를 통해 실제 컨테이너 프로세스를 실행함
- 실행이 끝나면 runc는 종료됨 (컨테이너를 “낳고 사라지는” 구조)

