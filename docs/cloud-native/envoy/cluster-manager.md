---
format: md
title: "Envoy Cluster Manager·Subscription"
description: "Listener/Cluster Manager·Subscription Factory·gRPC Multiplexer·콜백 흐름 — Obsidian 노트 이전"
tags:
  - cloud-native
  - kubernetes
---

## 1. Envoy 구조
![](https://blog.kakaocdn.net/dn/EDpkn/btrXHBQEYkd/wKTDpN21ujQMWx8J7ULsu1/img.png)

- Listener Manager와 Cluster Manager가 각각의 Listener와 Cluster를 관리

![](https://blog.kakaocdn.net/dn/bXfbq5/btrXIoQAaQO/fIAhaC8rkaCyuNshXPOfa1/img.png)

- envoy 기동 코드를 살펴보면 config.yaml을 읽어서 envoy 기동에 필요한 사용자 정의 설정을 파싱하는 작업을 선행. 그 후 주요 컴포넌트 기동에 필요한 항목 등을 생성
- Factory들이 Listener와 Cluster를 생성한다.

## 2. Subscription Factory 관리
- Dynamic Cluster Update 과정에 대해 이해하려면 Subscription과 gRPC Multiplexer에 대한 이해가 선행되어야 함.
- Cluster Manager의 주요 역할 중 하나는 Subscription Factory를 관리하는 것.

![](https://blog.kakaocdn.net/dn/B7fpG/btrXIiCRWXP/Xd4Ku0dJIijQkSvpqdxQok/img.png)

xDS API에는 gRPC, Rest API, 파일 동기화 방법이 있지만, 여기서는 gRPC 방식을 사용한다고 가정.

이 때, gRPC 통신을 위해서 내부적으로 Multiplexer를 사용하는데, 자원 동기화 요청이 Envoy로 전달되면, 이를 수신받아 해당 Resource를 처리하는 모듈(CDS, LDS, EDS 등)에게 전달해줘야 한다.

처리하는 모듈 쪽에서는 사전에 Callback을 등록하여 응답이 전달되면 해당 Callback을 실행할 수 있도록 한다.

![](https://blog.kakaocdn.net/dn/nCG6M/btr41IIqMC6/wKpMkKSrOFkzi6M8oE4u3k/img.png)

- 이 과정에서 중간 매개체 역할을 하는 것이 Subscription이다. 
- Resource를 처리하는 모듈에서 Config 대상 오브젝트 타입과 Callback을 Subscription 객체로 생성하여 등록한다.
- Subscription은 Subscription Factory에서 생성하고, 추후 gRPC Multiplexer에 등록.
- gRPC Multiplexer로부터 Resource 동기화 요청이 수신되면, 해당 요청의 Subscription Callback이 호출되어 데이터 동기화 처리 수행

## 참조

- [https://cla9.tistory.com/216](https://cla9.tistory.com/216)