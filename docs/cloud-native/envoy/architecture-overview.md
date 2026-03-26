---
format: md
title: "Envoy 아키텍처 Overview"
description: "Listener·Cluster·Endpoint·필터 체인·HCM·Static/Dynamic·xDS·ADS·SotW/Delta — Obsidian 노트 이전"
tags:
  - cloud-native
  - kubernetes
---

## 1. Envoy Component
![](https://blog.kakaocdn.net/dn/pDFg7/btrJBGDUgRc/jXLWIujejdKQKFaGr9PURk/img.png)
- Envoy는 프록시이며 사용자와 서비스간 proxy 역할을 수행.
- 다운스트림: Client로부터 전달받는 트래픽
- 업스트림: 전달받은 요청을 상위 서비스로 전달하는 트래픽

![](https://blog.kakaocdn.net/dn/4JAvu/btrJCoXygSw/jH5dgxlabp2LZ72Hzd5QFk/img.png)
- 클라이언트로부터의 요청은 Listener를 통해 받음.
- 받은 요청은 라우트 설정에 의해 라우트되어 클러스터에 전달.
- 클러스터에서 로드밸런싱 정책에 따라 자신의 보유 엔드포인트 중 하나를 선정 후 트래픽 전달.


## 2-1. Endpoint
![](https://blog.kakaocdn.net/dn/cEkF8D/btrJCnjLyk2/xCgq7lzXYkj5Zx5top7fM0/img.png)

- Endpoint: 프록시를 통해 연결해야하는 최종 목적지 주소와 포트 번호 (Address: IP or Domain)
- health check를 위한 설정, Loadbalancing 정책 설정 가능.
- 참고: https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/endpoint/v3/endpoint_components.proto

## 2-2. Cluster
![](https://blog.kakaocdn.net/dn/bc3xoD/btrJCmSHpFD/NkRk6OBwRQfoFgqoRAjZd1/img.png)

- 가용성 혹은 성능 향상의 목적으로 여러 서버에 동일한 Service를 배포. 단일 Endpoint를 통해 여러개의 Service를 관리할 수 있는 논리적 집합 단위가 필요.
- Cluster 컴포넌트를 통해 여러 엔드포인트를 그룹핑. 
- 어떤 엔드포인트로 트래픽을 보낼지 결정하는 로드밸런싱 설정 가능.

```yaml
clusters:
- name: some_service
  connect_timeout: 0.25s 
  type: STATIC 
  lb_policy: ROUND_ROBIN 
  load_assignment: 
    cluster_name: some_service 
    endpoints: 
    - lb_endpoints: 
      - endpoint: 
          address: 
            socket_address: 
              address: 127.0.0.1 
              port_value: 1234
```

- 위의 Yaml 을 보면 클러스터 하위에 엔드포인트 목록 설정이 있는 것을 확인할 수 있으며, 이는 의존성이 존재한다고 볼 수 있음.
- 참고: https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-field-config-cluster-v3-cluster-cluster-type


## 2-3. Listener
![](https://blog.kakaocdn.net/dn/bqYXnh/btrJCmd8dIq/YD2rB12LGzAf2GBxMIdYf0/img.png)

- Listener는 Envoy proxy가 어떤 address의 어떤 port로 접속하는 요청에 대해 proxy 처리를 어떻게 할지를 설정한다.
- Envoy proxy 문지기 역할

![](https://blog.kakaocdn.net/dn/1jWZy/btrJC4rvkDt/ZxJJ8kDdxNfKHwK1t9zKg0/img.png)

- Listener를 통해 트래픽이 클러스터에 전달되기 위해서는 여러 내부과정을 거쳐야 함.
- Listener에는 Listener filters 및 Filter chains(Network filters)가 있음.
- Listener filters: Connection에 대한 Metadata를 조작하거나 추가하는데 사용. 변경된 정보를 토대로 Filter chains의 필터 중 해당 요청을 처리하는데 적합한 필터를 선정하는데 사용.Filter chains의 필터가 요청을 처리하는 메인 필터이며, Listener filter는 메인 필터를 선정하기 위한 보조 필터라 보면됨.
  
|   |   |
|---|---|
|Filter|역할|
|HTTP Inspector|Application에서 전달한 Traffic을 분석하여 해당 네트워크 요청이 HTTP인지 확인합니다. 또한 HTTP 요청이 맞다면, HTTP 1.1 요청인지 혹은 HTTP 2 요청인지를 분석합니다.  <br>  <br>이를 토대로 추후 네트워크 요청에 적합한 Filter Chain을  찾는데 사용됩니다.|
|Original Destination|IpTable에 의해서 redirect된 소켓의 원래 목적지 값 주소를 알기 위해 SO_ORIGINAL_DST 값을 읽는 역할을 수행합니다.  해당 값은 Envoy 처리 이후 Connection Local address로 설정하는데 사용됩니다.|
|Original Source|Client가 Envoy의 주소로 Downstream 연결을 시도하면,  Envoy는 Upstream과 통신을 위해서는  Source IP를 Envoy의 주소로 변경이 필요합니다. 따라서 해당 과정을 통해 연결의 목적지 주소를 Source 주소로 복제하는데 사용합니다.|
|Proxy Protocol|해당 Listener Filter는 HA Proxy Protocol을 지원하기 위한 역할을 수행합니다.|
|TLS Inspector|HTTP Inspector와 유사하게 해당 요청이 TLS 요청인지를 확인합니다. 이를 토대로 추후 네트워크 요청에 적합한 Filter Chain을 찾는데 사용됩니다.|

- Listener Filter를 통한 뒤에 Filter Chains(Network Filters)에 위치한 Filter들을 통과하면서 사용자의 요청에 적합한 Filter를 찾아서 수행한다.

![](https://blog.kakaocdn.net/dn/KFUDg/btrP3mrRKeC/O024EecN0Vfd8VSSrKDRxk/img.png)

- 기본적으로 제공하는 Filter chains 목록이다.
- 해당 항목들은 L3/L4 Filter 기능을 담당
- 위 필터들 중 요청을 처리할만 한 경우가 없으면 Default chain이 사용됨. (Default 설정이 없으면 Connection 종료됨.)
- 개별 필터 기능 설명: https://www.envoyproxy.io/docs/envoy/latest/configuration/listeners/network_filters/network_filters


### 2-3-1. HTTP Connection manager
- Envoy에서 HTTP를 담당하는 Network level의 filter로써 Filter chain의 가장 마지막에 위치.
- 해당 필터의 주요 기능은 raw byte를 HTTP 메시지 convert를 담당. 
- 내부적으로 HTTP L7 sub filters를 적용하여 부가작업 수행

**1) HTTP header 조작**
 - 여러가지 Security 이유로 인해 Envoy를 통해서 특정 header를 삭제하거나 값을 변경할 수 있습니다. 가령 use_remote_address 옵션을 true로 변경했을 경우 connection manager는 실제 전달되는 remote address를 x-forwarded-for http header에 사용합니다. 그밖에 다양한 header에 대해서 조작이 가능합니다. 

**2) Retry 설정**
- HTTP 요청에 대해서 내부적으로 연결이 실패했을 때 얼만큼 Retry할 것인지를 설정할 수 있습니다.

**3) Redirect**
- 요청 서비스에서 Redirect 응답이 왔을 때 Proxy 내부에서 해당 3xx 응답을 기반으로 Redirect를 수행할 수 있습니다.

**4) Timeout**
- HTTP 요청에 대해서 응답이 지정 시간동안 없을 경우 요청을 취소할 수 있습니다.

위와 같은 기능 외 HTTP Connection manager에는 L7 Filters들이 있어서 해당 Filters를 통해 부가적인 작업을 수행할 수 있다고 말했습니다. 여기에는 다음과 같은 Filter들이 해당됩니다.

![](https://blog.kakaocdn.net/dn/ekYHWU/btrJB3tkzWk/nBvMgKxSeGKbrnxdYFrBxk/img.png)

- 공식문서 참고: https://www.envoyproxy.io/docs/envoy/v1.23.0/configuration/http/http_filters/http_filters
- 위 Filter 중에 Router Filter의 경우는 사용자가 지정한 router 규칙에 일치하는 URL로 접근하였을 경우 지정된 Cluster로 Forwarding을 담당하는 Filter입니다.

![](https://blog.kakaocdn.net/dn/dn5Ln6/btrJBeaqnvT/wHiPmqgFq7R6oon37TkCzK/img.png)

**네트워크 흐름 요약**
1) *Listener*에 구성된 address, port에 상응하는 요청이 들어오면 *Listener Filters*로 전달.
2) *Listener Filters* 를 순회하면서 Connection Metadata를 조작한 뒤, *Network Filters*로 전달.
3) *Filter Chains(Network Filters)* 를 순회하면서 사용자 요청을 처리하는데 적합한 Filter를 찾고 해당 Filter로 요청을 처리. (위의 예제에서는 HTTP 요청이 들어왔음을 가정하므로 HTTP Connection Manager가 처리)
4) *HTTP Connection Manager* 내부에 있는 Sub Filters를 순회.
5) L7 필터 마지막에 위치한 *Router filter*는 사용자의 Routing Path 요청과 적합한 Cluster를 찾아 트래픽을 포워딩하는 역할 수행.
6) *Cluster*는 내부에 설정된 로드밸런싱 정책 등을 고려하여 적합한 *Endpoint*를 선정. 해당 Endpoint에 매칭되는 *Service*로 트래픽 전달.


## 2-4. Envoy 컴포넌트 등록 방법
- Cluster, Listener, Endpoint 등록 방법에 대해 알아보자.
- 2가지 방식으로 등록 및 수정이 가능.
	- Static
	- Dynamic

### 2-4-1. Static 등록 방식
- Envoy 기동 시점에 사용자가 지정한 Config 파일 정보를 기반으로 내부 컴포넌트를 등록
- YAML 형태로 지정

```yaml
static_resources:
  listeners:
  - name: listener_0
    address:
      socket_address: { address: 127.0.0.1, port_value: 10000 }
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: ingress_http
          codec_type: AUTO
          route_config:
            name: local_route
            virtual_hosts:
            - name: local_service
              domains: ["*"]
              routes:
              - match: { prefix: "/" }
                route: { cluster: some_service }
          http_filters:
          - name: envoy.filters.http.router
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
  clusters:
  - name: some_service
    connect_timeout: 0.25s
    type: STATIC
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: some_service
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              socket_address:
                address: 127.0.0.1
                port_value: 1234
```

- Listener를 보면 listener_0의 이름으로 Listener가 1개 등록되어있고, 내부에는 filter_chains 항목을 통해 HTTP Connection Manager를 등록하는 것을 확인할 수 있다.
- Routes 설정을 통해 /으로 들어오는 모든 prefix에 대해서 some_service라는 Cluster로 전달하도록 지정했음을 알 수 있다.
- 이를 통해 Listener로 들어오는 모든 HTTP 트래픽에 대해 prefix조건을 만족하면 some_service Cluster로 전달되도록 Router Filter가 지정된다.
- Clusters 항목을 보면, 이전에 Route에서 지정한 some_service 이름으로 선언이 되어있고, 내부적으로 endpoint 정보를 등록하였다. 추가적으로 ROUND_ROBIN 정책을 적용하여 트래픽 부하를 고르게 분산하도록 지정되었다.


### 2-4-2. Dynamic 등록 방식
- Static은 Listener, Endpoint와 Cluster 정보가 수시로 바뀌는 상황에서는 적합하지 않음.
- envoy 기동 중에도 Config 설정이 가능하도록 인터페이스를 제공 => *xDS API*
- xDS API는 File 동기화, REST 혹은 gRPC 방식이 존재함.
- istio에서는 *gRPC 통신*을 이용하여 envoy proxy의 정보를 동적으로 변경.

  
![](https://blog.kakaocdn.net/dn/ccjw6r/btrJ7NQQGqW/XtcPySDAJU4wD9i1uVX4L0/img.png)

- 주요 컴포넌트(Static은 Listener, Endpoint)를 갱신할 수 있는 *Discovery Service*가 제공됨.
- envoy proxy에서 요구하는 spec에 맞게 gRPC 혹은 REST 호출을 보내면 개별 컴포넌트에 해당하는 *Discovery Service*를 통해서 내부 컴포넌트 설정을 변경.

![](https://blog.kakaocdn.net/dn/TN223/btrJ7mTBpmM/Gqrrz3q2U4YLFoXv8bK9Jk/img.png)

- istio에서는 중앙에 Management Server가 있으며, Envoy의 xDS를 통해서 Config 등록과 수정을 자유롭게 할 수 있음.
- 위의 Discovery Service(LDS, RDS, CDS, EDS) 외에도 VHDS, SRDS, LDS, SDS, RTDS, ECDS 등 다양한 Discovery Service가 존재. (참고: https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/operations/dynamic_configuration)

#### **ADS**
- ADS(Aggregated xDS)
- Envoy의 내부 쓰레딩 모델은 기본적으로 Lock 없이 데이터 교환, 데이터 동기화는 Eventually Consistency를 전제로 설계. => *이는 데이터를 전달한다고 해서 바로 반영은 안되며, 완벽한 동기화가 일시에 이루어지지 않음을 의미*.

![](https://blog.kakaocdn.net/dn/bEcsOG/btrKhlFb1Bi/EemgYnlkHnvG2wdHuFSazK/img.png)

- Cluster는 Endpoint의 논리적 집합임.
- 위의 그림과 같이 Endpoint와 Cluster가 추가되어 이를 갱신하는 상황이 발생한다고 가정하면, EDS를 통한 갱신이 CDS보다 먼저 이루어지게 된다면?
  => Envoy 입장에서는 EDS를 통해 전달된 Endpoint의 대상이 Cluster-A라고 전달받았지만, 아직 CDS를 통해 Cluster 정보를 전달받지 못한 상황이므로 일정 기간 동안에는 동기화가 진행되지 않는 이상현상 발생.
- 이러한 이슈를 해결하고자 등장한 것이 *ADS*

![](https://blog.kakaocdn.net/dn/b5fSVr/btrKkhpdhAZ/h85kSPGXWFiySvkT6kiF8k/img.png)
- ADS는 Single gRPC 스트림으로 구성된 서비스.
- envoy에 전달되는 resource의 순서를 적용하려는 사용자를 위해 집계된 xDS를 단일 gRPC 스트림으로 전달할 수 있음.
- ADS와 CDS의 의존 관계에 있을 때도 이를 집계한 결과를 단일 스트림 형태로 envoy에 전달하기 때문에 일관성을 가짐.

```yaml
"dynamic_resources": {
    "lds_config": {
        "ads": {},
        "initial_fetch_timeout": "0s",
        "resource_api_version": "V3"
    },
    "cds_config": {
        "ads": {},
        "initial_fetch_timeout": "0s",
        "resource_api_version": "V3"
    },
    "ads_config": {
        "api_type": "GRPC",
        "set_node_on_first_message_only": true,
        "transport_api_version": "V3",
        "grpc_services": [
            {
                "envoy_grpc": {
                    "cluster_name": "xds-grpc"
                }
            }
        ]
    }
},
```

- dynamic_resources는 위와 같이 설정할 수 있음.
- 내용을 살펴보면, lds와 cds는 ads를 통해 해당 내용을 전달받고, ads는 xds-grpc 클러스터를 통해서 해당 정보를 가져오도록 지정되어 있음.


## 3. xDS API
- xDS API는 istio와 연계하여 Service Discovery를 수행하는데 있어 주요하게 사용
- xDS 지원 방식은 총 3가지(*File 동기화, HTTP, gRPC*)
![](https://blog.kakaocdn.net/dn/bMStnV/btrODheWTX9/DKMiKqeoMhhupoZ7A014O0/img.png)
- File 동기화: envoy에서 File의 상태를 관찰하고 설정이 적용된 File에서 변경이 일어났을 경우 envoy에서 인지하여 내부 컴포넌트 설정 동기화하는 방식.
- gRPC, HTTP: config 정보를 전달하는 Management Server가 중앙에 존재하여 config 정보를 요청하여 전달받고 내부 컴포넌트 설정을 동기화하는 방식.
- HTTP 방식은 주기적인 polling을 통해 Management Server로부터 변경된 항목을 전달받아 갱신.
- gRPC는 bidirectional streaming 통신을 통해 데이터를 주고 받음. (참고: [https://cla9.tistory.com/177?category=993774](https://cla9.tistory.com/177?category=993774))
- envoy에서 널리 사용하는 방식은 gRPC([gRPC 통신 방식](./grpc-communication.md))이며, istio 또한 gRPC 방식을 통해 xDS정보를 전달받는다.

### 3-1. xDS gRPC
![](https://blog.kakaocdn.net/dn/dVXVHz/btrOSbk7YHN/CCspzzwKuvYJjyJ8fvKMh0/img.png)
- gRPC를 활용한 xDS 방식은 envoy와 Management Server 사이에 bidirectional streaming 통신을 사용. => Connection이 끊기지 않고 지속 연결된 상태
- 처음 Management Server에 envoy가 연결되면, Discovery Request를 Management Server에 전달.
- Management Server 에서는 envoy가 요청하는 Config에 대해서 전체 목록을 전달하게 되고, envoy는 해당 설정을 전달받아 Config 업데이트 수행.

![](https://blog.kakaocdn.net/dn/cCbUd1/btrOCq40dK8/Z374fBionLeEW5ca3zTUG0/img.png)

- 이후 Config 업데이트가 완료되면, envoy는 이전에 전달받은 Config 항목에 대한 응답을 전달.
- 정상적으로 업데이트를 수행했으면 *ACK*를 응답, 그렇지 않으면 *NACK*를 응답. (※  ACK와 NACK의 구조와 동작방식은 [envoy 공식 문서](https://www.envoyproxy.io/docs/envoy/latest/api-docs/xds_protocol#ack) 참고)
- 이때 응답 메세지는 별개의 포맷을 활용하지 않고 다음 Discovery Request를 전달할 때, 응답을 포함하여 전달함.
- Discovery Request 메세지는 Config 업데이트 완료 후 Management Server에 Config가 변경되었을 때, 동기화된 Config 내역을 다시 전달받기 위해 요청하는 메세지.
- Management Server에 Config가 변경되거나 새로운 Resource가 추가되면 envoy에게 Discovery Response를 전달.


### 3-2. SotW(State of the world), Delta xDS
![](https://blog.kakaocdn.net/dn/cTSiF3/btrORYtiBWn/xtkXk8stzfPdfKFOZKftgk/img.png)

- Management Server에서 변경사항에 대해 Discovery Response를 전달하는데 2가지 방식이 있음.

#### **SotW(State of the world)**
![](https://blog.kakaocdn.net/dn/ZbazL/btrOCZTq8Cd/3fsv4nhoh5OaatDWL9N3nk/img.png)

- 상황 가정: envoy가 Cluster 정보를 동기화하기 위해 xDS로 연결되어 이미 한차례 동기화 된 상태.
- SotW 방식은 Cluster 정보 중 하나가 변경된 경우 전체 Cluster 정보를 전달하는 방식.
- 구현이 간단하지만 일부가 변경되어도 전체 데이터를 전달하기 때문에 네트워크 오버헤드 발생할 수 있음.
- 리턴 데이터 예시 (resources에 전체 데이터가 들어감.)
  ![](https://blog.kakaocdn.net/dn/beTVxu/btrORQvtIEE/zrbGE7WbeB8Bd2yQm8mJxk/img.png)

#### **Delta**
![](https://blog.kakaocdn.net/dn/75LDd/btrOUM5UrCQ/nddZvwV5oKwwYGaHPyuy70/img.png)

- Delta 방식은 변경된 Config 정보만을 전달하는 방식 (Delta 혹은 incremental)
- 리턴 데이터 예시 (resources에 변경된 데이터가 들어감. removed_resources에 삭제된 데이터가 들어감.)
  ![](https://blog.kakaocdn.net/dn/p9fZy/btrOR7wu1Ar/hmzBtH0BIzE0mcXQWsWW91/img.png)

![](https://blog.kakaocdn.net/dn/c9P2g6/btrOS2OLtIM/zqz51BzZWRslyfUNcIhUbK/img.png)
- Discovery response 방식을 지정하는 방법은 위 그림과 같다.
- Istio 에서는 기본 SotW 방식 사용.
- 사이드카 컨테이너를 주입할 때 사용자가 지정한 ISTIO_DELTA_XDS 값을 통해 Delta 방식으로 변경 가능. 하지만 현재는 값을 변경하여도 실제 데이터를 전달할 때 Delta 값만을 전달하지 않는다. (버전이슈?)


## 참조
- [https://cla9.tistory.com/191](https://cla9.tistory.com/191)