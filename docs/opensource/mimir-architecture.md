---
format: md
title: "Grafana Mimir 아키텍처"
description: "쓰기·읽기 경로, Ingester·Querier, Prometheus 원격 쓰기, 장기 보관"
tags:
  - opensource
---

Grafana Mimir는 마이크로서비스 기반 아키텍처를 가지고 있습니다. 이 시스템은 개별적으로 그리고 병렬로 실행될 수 있는 여러 개의 수평 확장 가능한 마이크로서비스를 가지고 있습니다. Grafana Mimir 마이크로서비스를 컴포넌트라고 합니다.

Grafana Mimir의 디자인은 모든 구성 요소의 코드를 단일 바이너리로 컴파일합니다. 
`-target` 매개변수는 단일 바이너리가 어떤 구성 요소로 동작할지 제어합니다.

쉽게 시작하려면 모든 구성 요소를 하나의 프로세스에서 동시에 실행하는 [모노리식 모드](https://grafana.com/docs/mimir/latest/references/architecture/deployment-modes/#monolithic-mode) 로 Grafana Mimir을 실행하거나 구성 요소를 _읽기_ , _쓰기_ 및 _백엔드 경로로 그룹화하는_ [읽기-쓰기 모드](https://grafana.com/docs/mimir/latest/references/architecture/deployment-modes/#read-write-mode) 로 실행하세요 .
## Components
대부분 구성 요소는 상태 비저장이며 프로세스 재시작 사이에 데이터가 지속될 필요가 없습니다. 일부 구성 요소는 상태 저장이며 프로세스 재시작 사이에 데이터 손실을 방지하기 위해 비휘발성 저장소에 의존합니다. 각 구성 요소에 대한 자세한 내용은 [구성 요소](https://grafana.com/docs/mimir/latest/references/architecture/components/) 에서 해당 페이지를 참조하세요.

### Write path
![Grafana Mimir의 쓰기 경로 아키텍처](https://grafana.com/docs/mimir/latest/get-started/about-grafana-mimir-architecture/write-path.svg)

1. Ingester는 배포자로부터 들어오는 샘플을 수신합니다. 각 푸시 요청은 테넌트에 속하며, Ingester는 수신된 샘플을 로컬 디스크에 저장된 특정 테넌트별 TSDB에 추가합니다. 수신된 샘플은 메모리에 보관되고 WAL(write-ahead log)에 기록됩니다. Ingester가 갑자기 종료되면 WAL은 메모리 내 시리즈를 복구하는 데 도움이 될 수 있습니다. 테넌트별 TSDB는 해당 테넌트에 대한 첫 번째 샘플을 수신하자마자 각 Ingester에서 지연 생성됩니다.

2. 메모리 내 샘플은 주기적으로 디스크로 플러시되고, 새로운 TSDB 블록이 생성되면 WAL이 잘립니다. 기본적으로 이는 2시간마다 발생합니다. 새로 생성된 각 블록은 장기 저장소에 업로드되고 구성된 만료일까지 수집기에 보관됩니다 . 이를 통해 [쿼리어와](https://grafana.com/docs/mimir/latest/references/architecture/components/querier/) 스토어 [게이트웨이는](https://grafana.com/docs/mimir/latest/references/architecture/components/store-gateway/) `-blocks-storage.tsdb.retention-period` 저장소에서 새 블록을 발견하고 인덱스 헤더를 다운로드할 수 있는 충분한 시간을 얻습니다 .[](https://grafana.com/docs/mimir/latest/references/architecture/components/querier/)[](https://grafana.com/docs/mimir/latest/references/architecture/components/store-gateway/)

1. WAL을 효과적으로 사용하고 ingester가 갑자기 종료될 경우 메모리 내 시리즈를 복구할 수 있도록 ingester 실패를 견뎌낼 수 있는 영구 디스크에 WAL을 저장합니다. 예를 들어 클라우드에서 실행하는 경우 AWS EBS 볼륨 또는 GCP 영구 디스크를 포함합니다. Kubernetes에서 Grafana Mimir 클러스터를 실행하는 경우 ingester에 대한 영구 볼륨 클레임이 있는 StatefulSet을 사용할 수 있습니다. WAL이 저장된 파일 시스템의 위치는 로컬 TSDB 블록(head에서 압축됨)이 저장된 위치와 동일합니다. WAL과 로컬 TSDB 블록의 위치는 분리할 수 없습니다.

#### Series 샤딩 및 복제
기본적으로 각 시계열은 3개의 ingester에 복제되고, 각 ingester는 자체 블록을 장기 저장소에 씁니다. [Compactor는](https://grafana.com/docs/mimir/latest/references/architecture/components/compactor/) 여러 ingester의 블록을 단일 블록으로 병합하고 중복 샘플을 제거합니다. 블록 압축은 저장소 활용도를 크게 줄입니다. 자세한 내용은 [Compactor](https://grafana.com/docs/mimir/latest/references/architecture/components/compactor/) 및 [프로덕션 팁](https://grafana.com/docs/mimir/latest/manage/run-production-environment/production-tips/) 을 참조하세요 .


### Read path
![Grafana Mimir의 읽기 경로 아키텍처](https://grafana.com/docs/mimir/latest/get-started/about-grafana-mimir-architecture/read-path.svg)

1. Grafana Mimir에 들어오는 쿼리는 [Query Frontend](https://grafana.com/docs/mimir/latest/references/architecture/components/query-frontend/)에 도착합니다 . 그런 다음 Query Frontend는 더 긴 시간 범위에 걸친 쿼리를 여러 개의 더 작은 쿼리로 분할합니다.
2. Query Frontend는 다음으로 결과 캐시를 확인합니다. 쿼리 결과가 캐시된 경우 Query Frontend는 캐시된 결과를 반환합니다. 결과 캐시에서 답변할 수 없는 쿼리는 Query Frontend 내의 메모리 내 대기열에 배치됩니다.
   > [선택적 Query Scheduler](https://grafana.com/docs/mimir/latest/references/architecture/components/query-scheduler/) 구성 요소를 실행하면 Query Scheduler이 Query Frontend 대신 대기열을 유지 관리합니다.
3. Querier는 대기열에서 쿼리를 끌어오는 작업자 역할을 합니다.
4. Querier는 Store Gateway와 Ingester에 연결하여 쿼리를 실행하는 데 필요한 모든 데이터를 가져옵니다. 쿼리가 실행되는 방법에 대한 자세한 내용은 [querier](https://grafana.com/docs/mimir/latest/references/architecture/components/querier/)를 참조하세요.
5. Querier가 쿼리를 실행한 후, Querier는 집계를 위해 Query Frontend로 결과를 반환합니다. 그런 다음 Query Frontend는 집계된 결과를 클라이언트로 반환합니다.


#### 프로메테우스의 역할
[Prometheus 인스턴스는 다양한 대상에서 샘플을 스크래핑하여 Prometheus의 원격 쓰기 API를](https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations) 사용하여 Grafana Mimir에 푸시합니다. 
원격 쓰기 API는 HTTP 요청 본문 내부에 일괄 처리된 [Snappy](https://google.github.io/snappy/) 압축 [프로토콜 버퍼](https://protobuf.dev/)`PUT` 메시지를 내보냅니다 .

Mimir는 각 HTTP 요청에 요청에 대한 테넌트 ID를 지정하는 헤더가 있어야 합니다. 요청 [인증 및 권한 부여](https://grafana.com/docs/mimir/latest/manage/secure/authentication-and-authorization/) 는 외부 역방향 프록시에서 처리합니다.
[들어오는 샘플(Prometheus에서 쓰는 것)은 Distributor](https://grafana.com/docs/mimir/latest/references/architecture/components/distributor/) 가 처리하고 , 들어오는 읽기(PromQL 쿼리)는 [쿼리 프런트엔드](https://grafana.com/docs/mimir/latest/references/architecture/components/query-frontend/) 가 처리합니다 .

#### 장기 보관
[Grafana Mimir 스토리지 형식은 Prometheus TSDB 스토리지를](https://prometheus.io/docs/prometheus/latest/storage/) 기반으로 합니다 . Grafana Mimir 스토리지 형식은 각 테넌트의 시계열을 자체 TSDB에 저장하며, 이는 시리즈를 디스크상 블록에 유지합니다. 기본적으로 각 블록은 2시간 범위를 갖습니다. 각 디스크상 블록 디렉토리에는 인덱스 파일, 메타데이터가 포함된 파일 및 시계열 청크가 포함됩니다.

TSDB 블록 파일에는 여러 시리즈의 샘플이 들어 있습니다. 블록 내부의 시리즈는 블록당 인덱스로 인덱싱되며, 이는 블록 파일의 시계열에 대한 메트릭 이름과 레이블을 모두 인덱싱합니다. 각 시리즈는 청크로 구성된 샘플을 가지고 있으며, 이는 저장된 샘플의 특정 시간 범위를 나타냅니다. 청크는 특정 구성 옵션과 수집 속도에 따라 길이가 다를 수 있으며, 일반적으로 청크당 약 120개의 샘플을 저장합니다.

Grafana Mimir는 블록 파일에 대해 다음 개체 저장소 중 하나가 필요합니다.

- [아마존 S3](https://aws.amazon.com/s3)
- [구글 클라우드 스토리지](https://cloud.google.com/storage/)
- [마이크로소프트 애저 저장소](https://azure.microsoft.com/en-us/services/storage/)
- [오픈스택 스위프트](https://wiki.openstack.org/wiki/Swift)
- 로컬 파일 시스템(단일 노드만 해당)

## 참조
[https://grafana.com/docs/mimir/latest/get-started/about-grafana-mimir-architecture/about-classic-architecture/](https://grafana.com/docs/mimir/latest/get-started/about-grafana-mimir-architecture/about-classic-architecture/)