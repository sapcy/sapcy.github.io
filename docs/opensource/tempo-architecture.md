---
format: md
title: "Grafana Tempo 아키텍처"
description: "Distributor·Ingester·Query Frontend·Querier·Compactor·Metrics generator"
tags:
  - opensource
---

이 주제에서는 Tempo의 주요 구성 요소에 대한 개요를 제공합니다. 배포에 대한 도움말은 [예제 설정](https://grafana.com/docs/tempo/latest/getting-started/example-demo-app/) 또는 [배포 옵션](https://grafana.com/docs/tempo/latest/setup/deployment/) 을 참조하세요 .

![템포 아키텍처](https://grafana.com/media/docs/tempo/tempo_arch.png)

Tempo는 다음과 같은 최상위 구성 요소로 구성됩니다.

## Distributor
배포자는 Jaeger, OpenTelemetry, Zipkin을 포함한 여러 형식의 스팬을 허용합니다. 배포자는 해싱 하고 [분산된 일관된 해시 링을](https://grafana.com/docs/tempo/latest/operations/consistent_hash_ring/) `traceID`를사용하여 스팬을 수집자로 라우팅합니다. 배포자는 [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector)의 수신자 계층을 사용합니다 . 최상의 성능을 위해 [OTel Proto를](https://github.com/open-telemetry/opentelemetry-proto) 수집하는 것이 좋습니다 . 이러한 이유로 [Grafana Agent는](https://github.com/grafana/agent) otlp 내보내기/수신기를 사용하여 스팬을 Tempo로 보냅니다.

## Ingester
Ingester 배치는 추적을 블록으로 나누고, 블룸 필터와 인덱스를 생성한 다음, 이를 모두 백엔드로 플러시합니다. 백엔드의 블록은 다음 레이아웃으로 생성됩니다.

```shell
<bucketname> / <tenantID> / <blockID> / <meta.json>
                                      / <index>
                                      / <data>
                                      / <bloom_0>
                                      / <bloom_1>
                                        ...
                                      / <bloom_n>
```

## Query Frontend
쿼리 프런트엔드는 들어오는 쿼리에 대한 검색 공간을 분할하는 역할을 합니다.

추적은 간단한 HTTP 엔드포인트를 통해 노출됩니다. `GET /api/traces/<traceID>`

내부적으로 쿼리 프런트엔드는 blockID 공간을 구성 가능한 수의 샤드로 분할하고 이러한 요청을 큐에 넣습니다. 쿼리어는 스트리밍 gRPC 연결을 통해 쿼리 프런트엔드에 연결하여 이러한 샤딩된 쿼리를 처리합니다.

## Querier
쿼리어는 요청된 추적 ID를 Ingester 또는 백엔드 스토리지에서 찾는 일을 담당합니다. 매개변수에 따라 Ingester를 모두 쿼리하고 백엔드에서 블룸/인덱스를 가져와 개체 스토리지의 블록을 검색합니다.

쿼리어는 HTTP 엔드포인트를 다음 위치에 노출 `GET /querier/api/traces/<traceID>`하지만 직접 사용되는 것은 예상되지 않습니다.

질의는 쿼리 프런트엔드로 보내는 것이 일반적입니다.

## Compactor
압축기는 백엔드 저장소에서 블록을 스트리밍하여 총 블록 수를 줄입니다.

## Metrics generator
이것은 수집된 추적에서 메트릭을 파생하고 메트릭 저장소에 쓰는 **선택적** 구성 요소입니다. 자세한 내용은 [metrics-generator 설명서 를 참조하세요.](https://grafana.com/docs/tempo/latest/metrics-generator/)

## 참조
[https://grafana.com/docs/tempo/latest/introduction/architecture/](https://grafana.com/docs/tempo/latest/introduction/architecture/)