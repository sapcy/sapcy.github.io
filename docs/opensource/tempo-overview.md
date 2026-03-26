---
format: md
title: "Grafana Tempo 개요"
description: "분산 추적·객체 스토리지·Grafana·Loki·Prometheus 연동"
tags:
  - opensource
---

Grafana Tempo는 오픈소스, 사용하기 쉬운, 대규모 분산 추적 백엔드입니다. Tempo를 사용하면 추적을 검색하고, span에서 메트릭을 생성하고, 추적 데이터를 로그 및 메트릭과 연결할 수 있습니다.

## 개요
분산 추적은 요청이 여러 애플리케이션을 거치면서 발생하는 수명 주기를 시각화합니다.

Tempo는 비용 효율적이며 작동하려면 개체 저장소만 필요합니다. Tempo는 Grafana, Mimir, Prometheus 및 Loki와 긴밀하게 통합되어 있습니다. Jaeger, Zipkin 또는 OpenTelemetry를 포함한 오픈 소스 추적 프로토콜과 함께 Tempo를 사용할 수 있습니다.


![Grafana에서의 추적 시각화](https://grafana.com/docs/tempo/latest/getting-started/assets/trace_custom_metrics_dash.png)


Tempo는 다양한 오픈 소스 도구와 잘 통합됩니다.

- **Grafana는** 내장된 [Tempo 데이터 소스를](https://grafana.com/docs/grafana/latest/datasources/tempo/) 사용하여 기본 지원을 제공합니다 .
- **Grafana Loki는** 강력한 쿼리 언어인 LogQL v2를 사용하여 관심 있는 요청을 필터링하고 [Grafana의 파생 필드 지원을](https://grafana.com/docs/grafana/latest/datasources/loki/#derived-fields) 사용하여 추적으로 이동할 수 있습니다 .
- **Prometheus 예제를** 사용하면 기록된 예제를 클릭하여 Prometheus 메트릭에서 Tempo 추적으로 바로 이동할 수 있습니다.

