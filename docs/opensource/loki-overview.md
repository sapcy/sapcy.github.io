---
format: md
title: "Grafana Loki 개요 - 읽기·쓰기 경로"
description: "컴포넌트·레이블·Write/Read path - Grafana 공식 다이어그램 링크 포함"
tags:
  - opensource
---

Loki는 Components(querier, ingester, query-frontend, distributor 등)로 구성이 됩니다. 각 Components 간 통신은 gRPC 통신을 하고 외부 API 요청은 HTTP/1 으로 통신을 합니다. 
Loki 실행할 때 -target 설정(all, querier, ingester, query-frontend 또는 distributor)을 통해서 *single process mode* 또는 *MicroServices 모드*로 실행이 됩니다.


![로키 구성 요소](https://grafana.com/docs/loki/latest/get-started/loki_architecture_components.svg)
Grafana Loki Components

## Loki의 특징
- Scalability read와 write를 분리해 스케일 할 수 있다.
- Multi-tenancy
- 효율적인 Storage
- 압축된 로그 데이터
- 메타데이터(레이블)만 인덱싱하기 때문에 더 작은 인덱스
- S3 등 object-storage의 사용
- Alerting
### Labels
key value pair 형태로 된 모든 데이터. Loki에서는 log stream의 메타데이터를 지칭할 때 사용하는 단어이다.


## Write path
높은 수준에서 Loki의 쓰기 경로는 다음과 같이 작동합니다.

1. Distributor는 스트림과 로그 줄이 포함된 HTTP POST 요청을 받습니다.
2. Distributor는 요청에 포함된 각 스트림을 해시하여 일관된 해시 링의 정보를 기반으로 해당 스트림을 전송해야 하는 Ingester 인스턴스를 결정합니다.
3. Distributor는 각 스트림을 적절한 Ingester와 해당 복제본(구성된 복제 요소에 따라)으로 전송합니다.
4. Ingester는 로그 라인이 있는 스트림을 수신하고 스트림의 데이터에 대한 chunk를 생성하거나 기존 chunk에 추가합니다. Chunk는 테넌트 및 레이블 세트마다 고유합니다.
5. Ingester가 쓰기를 인식합니다.
6. Distributor는 Ingester의 과반수(정족수)가 쓰기를 승인할 때까지 기다립니다.
7. Distributor는 최소한 승인된 쓰기 작업의 쿼럼을 수신한 경우 성공(2xx 상태 코드)으로 응답하고, 쓰기 작업이 실패한 경우 오류(4xx 또는 5xx 상태 코드)로 응답합니다.

## Read path
높은 수준에서 Loki의 읽기 경로는 다음과 같이 작동합니다.

1. Query Frontend는 LogQL 쿼리와 함께 HTTP GET 요청을 받습니다.
2. Query Frontend는 쿼리를 하위 쿼리로 분할하여 query scheduler에 전달합니다.
3. Querier는 스케줄러로부터 하위 쿼리를 가져옵니다.
4. Querier는 메모리 내 데이터에 대한 쿼리를 모든 Ingester에게 전달합니다.
5. Ingester는 쿼리와 일치하는 메모리 내 데이터가 있으면 이를 반환합니다.
6. Querier는 백업 저장소에서 데이터를 느리게 로드하고, Ingester가 데이터를 반환하지 않거나 불충분한 경우 해당 데이터에 대해 쿼리를 실행합니다.
7. Querier는 수신된 모든 데이터를 반복하여 중복을 제거하고, 하위 쿼리의 결과를 Query Frontend로 반환합니다.
8. Query Frontend는 쿼리의 모든 하위 쿼리가 완료되어 Querier로부터 반환될 때까지 기다립니다.
9. Query Frontend는 개별 결과를 최종 결과로 병합하여 클라이언트로 반환합니다.

## 참조
[https://grafana.com/docs/loki/latest/get-started/architecture/](https://grafana.com/docs/loki/latest/get-started/architecture/)