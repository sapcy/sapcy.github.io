---
title: Kube Controller Manager
description: 컨트롤 루프, Informer, Reflector·Delta FIFO·Work Queue를 통한 상태 조정
tags:
  - cloud
  - kubernetes
---

# Kube Controller Manager

- **Control Loop의 개념**: Controller는 집의 난방 시스템처럼 원하는 상태와 실제 상태를 지속적으로 비교하여 원하는 상태를 유지합니다.

- **Controller Manager**: 여러 Kubernetes Controller의 집합체로, 각 Controller는 특정 리소스 타입을 추적합니다. 예를 들어, ReplicaSet Controller는 Pod를 추적합니다.

- **Controller의 종류**:
  - 내장 Controller: API 서버를 통해 리소스를 관리하며, 클러스터 내부에서 모든 작업이 이루어집니다. 예: Job Controller.
  - 외부 Controller: 외부 리소스를 관리하며, Node Controller처럼 클라우드 제공자나 물리적 인프라와 상호 작용할 수 있습니다.

- **Informer**:
  - 역할: 원하는 상태와 실제 상태를 관찰하고, 로컬 캐시에 정보를 저장하여 API 서버에 대한 부하를 줄입니다.
  - Shared Informer: 여러 Controller가 동일한 리소스를 관리할 때 발생할 수 있는 충돌을 방지하기 위해 공유 캐시를 사용합니다.

- **Informer’s 구성 요소**:
  - Reflector: API 서버를 폴링하여 새로운 이벤트를 가져옵니다.
  - Delta FIFO Queue: 이벤트를 큐에 저장합니다.
  - Indexer: 로컬 캐시로서의 역할을 합니다.

- **이벤트 처리 함수**:
  - onAdd: 새로운 리소스가 추가될 때 실행됩니다.
  - onUpdate: 리소스가 업데이트될 때 실행됩니다.
  - onDelete: 리소스가 삭제될 때 실행됩니다.
  - 각 함수는 Work Queue에 전달되어 Worker Thread에 의해 실행되며, API 서버와의 통신을 통해 상태 조정을 수행합니다.

- **전체 흐름 요약**:

1. Reflector가 API 서버에서 이벤트를 가져옵니다.
2. 이벤트가 Delta FIFO Queue와 Indexer에 저장됩니다.
3. 해당 이벤트에 맞는 함수가 실행되어 Work Queue에 추가됩니다.
4. Worker Thread가 Work Queue에서 함수를 가져와 실행하고, 필요한 경우 API 서버와 상호 작용하여 상태를 조정합니다.

이러한 방식으로 Controller는 클러스터의 원하는 상태를 유지하기 위해 지속적으로 동작합니다.
