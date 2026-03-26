---
format: md
title: "Docker vs containerd - 데몬 종료 시 동작"
description: "dockerd 종료 시와 containerd만 종료될 때 shim·컨테이너 수명 차이"
tags:
  - container
  - docker
---

## 데몬 종료 시 이벤트
### Docker
- docker daemon이 죽으면 containerd 및 containerd-shim도 같이 종료되게끔 설계되어있어 컨테이너 종료됨

### Containerd
- containerd daemon이 죽어도 containerd-shim은 종료 안됨