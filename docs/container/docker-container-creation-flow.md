---
format: md
title: "Docker 컨테이너 생성 흐름"
description: "docker run 이후 클라이언트·데몬·이미지·runc·커널·네트워크·쓰기 레이어까지 단계별 정리"
tags:
  - container
  - cs
---

## 1. Docker Client 명령
   - 명령을 받아서 적절한 포맷으로 변환하여 docker daemon으로 전달

***

## 2. Docker Daemon에서 Local image 체크
만약 이미지를 찾지 못하면
- Dockerhub 혹은 설정된 레지스트리에 연결
- 이미지를 다운로드 후 로컬에 보관하며 이것을 사용

***

## 3. OCI Runtime에서 컨테이너 생성
Docker daemon은 컨테이너 자체 생성이 불가능. 대신 OCI(Open Container Initiative) runtime인 runc를 이용해 생성함.
- 이미지를 가져와서 컨테이너 스펙을 생성
- 리눅스 커널을 위한 모든 사항을 준비


***

## 4. 커널이 Namespaces & Cgroups를 생성
- **Namespaces**: 컨테이너가 자체 리소스 복제본을 가지고 있다고 생각하게하여 격리를 제공 (network interfaces, process IDs, etc.)
- **Cgroups(Control Groups)**: 컨테이너가 사용 가능한 리소스를 제한 (CPU, memory, etc.)

이는 Namespaces는 컨테이너에게 프리이빗한 집을 제공하지만, cgroups는 집의 전기나 물을 얼마나 사용할 수 있는지에 대한 규칙을 설정하는 것과 같다.


***

## 5. Virtual network 할당
Docker는 컨테이너의 커뮤니케이션을 할 수 있게끔 네트워킹을 세팅해준다.
- Virtual network interface 생성 (veth pair)
- 컨테이너에서 Docker bridge로 연결
- 컨테이너에 IP 주소 할당
- DNS resolution 세팅: 컨테이너가 다른 서비스를 이름으로 찾을 수 있음

이는 새로운 폰에 연락처의 번호 목록을 세팅하는 것과 같다.


***

## 6. 쓰기 가능한 레이어 추가
Docker 이미지는 읽기전용 레이어로 구성되지만, 컨테이너는 데이터를 쓸 공간이 필요함.

Docker는
- 모든 읽기 전용 이미지 레이어를 마운트
- 최상위에 새로운 쓰기 가능 레이어(모든 변경점이 저장되는)를 추가
- 이 레이어들을 합치기 위해 통합 파일시스템을 사용하여 레이어들이 하나의 파일시스템으로 보여지게 함

이는 누군가에게 레퍼런스 책(읽기-전용)과 공책(쓰기-가능)을 주면, 책을 통해 읽을 수 있지만 공책의 노트에 쓰는 것과 같다.


***

## 7. 명령 실행
모든 것이 준비되면, Docker는 즉시 컨테이너의 default 명령을 실행한다. (주로 이미지의 Dockerfile 에 정의된 CMD 또는 ENTRYPOINT 명령어를 실행)


***

## 8. Output 스트리밍
마지막으로 컨테이너로부터 어떠한 output(logs, error messages, etc.)이든 Docker에 의해 캡쳐되며 호스트의 터미널로 스트리밍 된다.


만약 컨테이너 ID가 `abcdefg` 라면, 아래와 같이 로그가 저장된다. 
/var/lib/docker/containers/abcdefg/
├── abc123-json.log
├── abc123-json.log.1
├── abc123-json.log.2

***

## 정리

:::tip 한 줄로 보는 흐름

**Client → Daemon → Image → Runtime → Kernel → Network → Filesystem → Execute → Output**

:::

