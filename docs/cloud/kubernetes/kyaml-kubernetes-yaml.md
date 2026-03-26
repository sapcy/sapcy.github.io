---
format: md
title: "KYAML"
description: "Kubernetes YAMLKubernetes에서는 리소스(Deployment, Service, ConfigMap 등)를 정의할 때 YAML을 사용합니다.YAML은 사람이 읽고 쓰기 쉬운 형식이지만, Kubernetes 환경에서는 다음과 같은 문제점이 자주 발생합니다: YAML의 대표적인 문제들여쓰기 민감 → 공백 하나만 틀려도 구조가 깨짐암묵적 타입 변환"
tags:
  - cloud
  - kubernetes
  - yaml
  - kyaml

---

## **Kubernetes YAML**

Kubernetes에서는 리소스(Deployment, Service, ConfigMap 등)를 정의할 때 **YAML** 을 사용합니다.

YAML은 사람이 읽고 쓰기 쉬운 형식이지만, Kubernetes 환경에서는 다음과 같은 **문제점** 이 자주 발생합니다:

### **YAML의 대표적인 문제**

*   **들여쓰기 민감** → 공백 하나만 틀려도 구조가 깨짐
*   **암묵적 타입 변환** → "NO"가 불리언 false로 파싱되는 _Norway Bug_ 같은 오류 발생
*   **문법 애매함** → 키나 값에 따옴표가 빠져도 동작하지만 의미가 달라질 수 있음
*   **도구 간 차이** → Helm, CI/CD, linter 툴마다 해석이 조금씩 달라질 수 있음 

이러한 실수들은 특히 대규모 팀/파이프라인에서 **버그, 불필요한 디버깅, 불명확한 Git diff** 의 원인이 됩니다.

## **KYAML이란?**

**KYAML (Kubernetes YAML)** 은 Kubernetes용으로 설계된 **YAML의 엄격한 하위 집합** 입니다. 즉:

✔ 모든 KYAML은 **정상적인 YAML** 로도 유효하며

✔ 기존 툴(kubectl, Helm 등)과 호환됩니다

✔ 대신 **모호한 YAML 기능을 제거** 하여 오류 가능성을 줄입니다 

Kubernetes v1.34에서 **alpha 기능** 으로 도입되었고, 그 이후 버전에서는 점차 안정화되고 있습니다. 

## **KYAML이 해결하려는 요점**

<table border="1"><tbody><tr><td><b><span>문제</span></b></td><td><span><b><b>KYAML 해법</b></b></span></td></tr><tr><td><span>들여쓰기/공백 오류</span></td><td><span>공백 무</span><span>시, 흐름(flow) 스타일 사용</span></td></tr><tr><td><span>모호한 값 → 잘못된 타입으로 해석</span></td><td><span>모든 값은 명시적으로 " "로 표현</span></td></tr><tr><td><span>JSON과 달리 <span>주석 필요</span></span></td><td><span>KYAML은 <span>주석 지원</span></span></td></tr><tr><td><span>타입 및 구조의 혼란</span></td><td><span>JSON과 비슷한 구조 <span>{}</span>와 <span>[]</span> 사용</span></td></tr></tbody></table>

## **KYAML 기본 문법**

기존 YAML과 가장 큰 차이점은 **흐름(Flow) 스타일** 과 **명시적 문자열** 입니다.

### **KYAML 기본 규칙**

✔ 모든 문자열 값은 **Double Quotes " "**

✔ \*\*Mapping(객체)\*\*는 {}

✔ \*\*List(배열)\*\*는 \[\]

✔ 들여쓰기에 덜 민감하며 구조가 명확 

## **KYAML  예시**

```bash
$ kubectl get -o kyaml svc hostnames
---
{
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    creationTimestamp: "2025-05-09T21:14:40Z",
    labels: {
      app: "hostnames",
    },
    name: "hostnames",
    namespace: "default",
    resourceVersion: "37697",
    uid: "7aad616c-1686-4231-b32e-5ec68a738bba",
  },
  spec: {
    clusterIP: "10.0.162.160",
    clusterIPs: [
      "10.0.162.160",
    ],
    internalTrafficPolicy: "Cluster",
    ipFamilies: [
      "IPv4",
    ],
    ipFamilyPolicy: "SingleStack",
    ports: [{
      port: 80,
      protocol: "TCP",
      targetPort: 9376,
    }],
    selector: {
      app: "hostnames",
    },
    sessionAffinity: "None",
    type: "ClusterIP",
  },
  status: {
    loadBalancer: {},
  },
}
```

## **KYAML 장단점**

### **장점**

*   실수 감소 - 들여쓰기·타입 파싱 오류 줄임
*   Git diff가 깔끔 → 리뷰 쉬움
*   기존 도구와 호환 가능
*   주석 지원으로 가독성 유지 

### **단점**

*   JSON처럼 {}/\[\]를 많이 쓰는 것은 가독성에서 호불호
*   익숙하지 않은 사용자에게는 초기 진입장벽 설명 필요
*   워크플로우가 YAML-centric이라 적응 필요

## Refer

[https://thenewstack.io/kubernetes-is-getting-a-better-yaml](https://thenewstack.io/kubernetes-is-getting-a-better-yaml/?fbclid=IwY2xjawMRXKlleHRuA2FlbQIxMQABHkPRHXTGGIl_Qq_Ozv0cc9gBrYKyCNMjG6h2bCe4y7hsq8SXHRVbBufGzCOv_aem_Zzudq0F5AIokS0P2FLirhw)