---
title: Kubernetes Scheduler
description: kube-scheduler의 역할, nodeName, 필터링·스코어링·바인딩, 스케줄링 확장 단계
tags:
  - cloud
  - kubernetes
---

# Kubernetes Scheduler

## Scheduler의 역할

- 클러스터 내에서 Pod가 실행될 최적의 Node를 결정합니다.
- 알고리즘을 적용하여 Pod를 실행하기에 가장 적합한 Node를 선택합니다.
- 고려 사항에는 리소스 가용성, Node의 상태, 개발자 지정 사항 등이 포함됩니다.

## nodeName 속성

- Pod 스펙에서 일반적으로 보이지 않는 속성으로, Scheduler가 Node를 선택한 후 업데이트됩니다.
- 수동으로 지정할 수 있지만, 일반적으로 Scheduler에 의해 자동으로 처리됩니다.
- **nodeName**이 비어 있는 Pod를 식별하여 스케줄링 알고리즘을 실행합니다.
- 이 단계가 없으면 Pod는 **Pending** 상태로 남아 있습니다.

## 스케줄링 알고리즘의 주요 단계

1. **Filtering**
   **Feasible Nodes**를 찾는 단계로, Pod를 배포할 수 있는 Node를 식별합니다.
   리소스 요구 사항 등을 기준으로 하드 제약 조건을 적용합니다.
   여러 가용 영역에 걸쳐 있는 클러스터에서는 가용 영역을 번갈아 가며 선택하여 고가용성을 보장합니다.

2. **Scoring**
   보다 세부적인 기준을 적용하여 가장 적합한 Node를 선택합니다.
   큰 클러스터에서는 percentage of nodes to score를 설정하여 계산 오버헤드를 줄일 수 있습니다
   이는 최적의 Node를 찾는 것과 스케줄링 속도 간의 균형을 유지하기 위함입니다.

3. **Binding**
   Scheduler가 API 서버에 선택된 Node 정보를 알려주는 과정입니다.
   Binding 객체를 생성하여 Pod를 특정 Node에 바인딩합니다.

## 스케줄링 알고리즘의 확장 가능한 단계

- Sort (큐 정렬)
  - 스케줄링 대기 중인 Pod의 순서를 결정합니다.

- Pre-Filter
  - Pod와 클러스터의 특정 조건을 사전에 평가합니다.
  - 오류 발생 시 스케줄링 프로세스를 중단합니다.

- Filter
  - 여러 플러그인을 사용하여 Node의 적합성을 판단합니다.
  - 모든 플러그인의 조건을 만족해야 Feasible Node로 간주됩니다.

- Post-Filter
  - 적합한 Node가 없을 경우 추가 조치를 취합니다.
    예: 우선순위가 높은 Pod를 위해 낮은 우선순위의 Pod를 제거할 수 있습니다.

- Pre-Score
  - Scoring 전에 필요한 데이터를 준비합니다.

- Score
  - 각 플러그인이 Node에 대한 점수를 계산합니다.

- Normalize Score
  - 계산된 점수를 중요도 등에 따라 조정합니다.

- Reserve
  - 선택된 **Node**를 예약하여 경쟁 상태를 방지합니다.

- Permit
  - 추가 로직을 통해 스케줄링을 승인, 거부 또는 지연시킬 수 있습니다.

- Pre-Bind
  - Binding 전에 필요한 작업을 수행합니다 (예: 네트워크 볼륨 마운트).

- Bind
  - Binding 객체를 생성하여 Pod를 Node에 바인딩합니다.
  - kubelet이 이를 감지하여 Pod를 실행합니다.

- Post-Bind
  - Binding 후 남은 리소스를 정리합니다.

## 스케줄링 규칙 지정 방법

- **NodeSelector**
  - Pod 스펙의 nodeSelector를 사용하여 특정 라벨을 가진 Node에 Pod를 배포합니다.

- **Node Affinity/Anti-Affinity**
  - Node에 대한 더 유연한 조건을 설정하여 Pod 배포를 제어합니다.
  - 하드 또는 소프트 규칙을 만들 수 있으며, 예를 들어 SSD가 있는 Node를 선호하도록 설정할 수 있습니다.

- **Pod Topology Constraints**
  - 여러 가용 영역에 분산된 클러스터에서 Pod가 어떻게 분포될지 정의합니다.
  - 고가용성을 위해 Pod를 다양한 위치에 배포합니다.

- **Pod Priority와 Preemption**
  - Pod에 우선순위를 할당하여, 높은 우선순위의 Pod를 위해 낮은 우선순위의 Pod를 제거할 수 있습니다.
  - 이는 **Preemption**이라고 하며, 클러스터의 중요한 작업을 보장합니다.

이러한 기능을 통해 Kubernetes Scheduler는 클러스터의 효율적인 자원 활용과 안정적인 애플리케이션 실행을 지원합니다.
