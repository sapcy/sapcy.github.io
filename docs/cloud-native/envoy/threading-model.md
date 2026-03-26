---
format: md
title: "Envoy 쓰레딩 모델과 데이터 공유"
description: "워커 스레드·메인 스레드·락 최소화·Eventually consistent — 원문 링크·공식 문서"
tags:
  - cloud-native
  - kubernetes
---

## 1. Threading Model

Envoy 프로세스는 일반적으로 **메인 스레드**와 여러 **워커 스레드**로 구성됩니다. 워커는 각각 독립적으로 연결을 처리하고, 설정 갱신(xDS 등)은 **락을 최소화**하는 방향으로 설계되어 있습니다. 구성·리소스 동기화는 **Eventually consistent** 를 전제로 하므로, 모든 워커에 설정이 동시에 반영된다고 가정하면 안 됩니다(ADS가 이 일관성 이슈를 완화하는 맥락과 연결됩니다).

상세 코드·다이어그램은 아래를 참고하세요.

- [Envoy — Threading model](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/threading)

## 참조

- [참고 글 (Tistory)](https://cla9.tistory.com/212)