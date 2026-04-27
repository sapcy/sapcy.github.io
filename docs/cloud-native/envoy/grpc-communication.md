---
format: md
title: "gRPC 통신 방식 (Unary·스트리밍)"
description: "HTTP/2·Unary 벤치 표 — Obsidian 노트 이전, 나머지 RPC 유형은 공식 문서 참고"
tags:
  - cloud-native
  - kubernetes
---

## 1. gRPC 통신 방법
gRPC는 HTTP 2.0 기반이므로 Multiplexing 연결 구성이 가능함.
따라서 단일 Connection으로 순서의 상관없이 여러 응답을 전달받을 수 있는 Streaming 처리 가능.
총 4가지의 통신 방법을 지원하며, 그 중 3가지 방식은 Streaming 처리 방식.

## 2. Unary
![](https://blog.kakaocdn.net/dn/bl2gts/btrvuP8651f/KSEcpGmKroJDisljKgxPl0/img.png)

- 가장 단순한 서비스 형태로서 클라이언트가 단일 요청 메세지를 보내고 서버는 이에 단일 응답을 보내준다.
- 일반적으로 REST API를 통해 주고 받는 Stateless 방식과 동일함.

![](https://blog.kakaocdn.net/dn/q1Rnc/btrvvC2Bdae/lR0IBQfYXt4JZtw8zRkdM0/img.png)

1. 사용자를 등록하는 서비스가 있다고 가정한다.  
2. 10, 100 등 10만까지 10의 거듭 제곱 형태로 delay없이 요청 횟수를 늘리면서 REST와 gRPC의 응답 총 시간을 구한다.  
3. 테스트 시작전 warm up을 위해 50회의 요청 수행 후 테스트를 진행한다.

|   |   |   |   |
|---|---|---|---|
|횟수|REST|gRPC(Unary)|성능|
|10|23 ms|14 ms|1.64배|
|100|165 ms|101 ms|1.63배|
|1,000|1,000 ms|694 ms|1.44배|
|10,000|4,109 ms|2,132 ms|1.92배|
|100,000|41,491 ms|13,768 ms|3.01배|

결과를 살펴보면, Iteration 횟수가 증가할 수록 그 차이가 벌어지는 것을 확인할 수 있습니다. 격차가 벌어진 이유는 다양한 이유가 있지만 Protobuf의 Serialization & Deserialization이 가장 큰 영향을 미치지 않았을까 생각합니다.

|   |   |   |   |
|---|---|---|---|
|횟수|REST|gRPC(Unary)|gRPC(Client Stream)|
|10|23 ms|14 ms|9 ms|
|100|165 ms|101 ms|20 ms|
|1,000|1,000 ms|694 ms|106 ms|
|10,000|4,109 ms|2,132 ms|468 ms|
|100,000|41,491 ms|13,768 ms|2,880 ms|

:::tip gRPC 스트리밍 참고

gRPC는 **Server streaming**, **Client streaming**, **Bidirectional streaming** RPC도 지원합니다. Envoy xDS는 주로 **양방향 스트리밍**을 사용합니다. 자세한 설명은 [gRPC.io — Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/) 를 참고하세요.

:::
