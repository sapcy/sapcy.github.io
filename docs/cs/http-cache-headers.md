---
format: md
title: "HTTP Cache 뽀개기"
description: "Cache가 왜 필요한가? 네트워크 요청을 통해 리소스를 받는 것은 느리며 불필요한 요청은 비용을 증가시킵니다. 큰 리소스의 경우 비용은 그에 비례하게 됩니다. 이를 해결해줄 수 있는 방법 중 하나는 Cache를 구현하는 것입니다. Cache에 데이터를 미리 복사해놓으면 불필요한 요청 없이 바로 데이터에 접근할 수 있습니다. 그리고 HTTP Cache는 모"
tags:
  - cs
  - http

---

### Cache가 왜 필요한가?

네트워크 요청을 통해 리소스를 받는 것은 느리며 불필요한 요청은 비용을 증가시킵니다. 큰 리소스의 경우 비용은 그에 비례하게 됩니다.

이를 해결해줄 수 있는 방법 중 하나는 Cache를 구현하는 것입니다.

Cache에 데이터를 미리 복사해놓으면 불필요한 요청 없이 바로 데이터에 접근할 수 있습니다.

그리고 HTTP Cache는 모든 브라우저에서 지원되며 많은 작업이 필요없습니다.

이제부터 효과적인 HTTP Cache 구현에 대해 알아보겠습니다.

### HTTP Cache 작동 방식

1.  HTTP 요청이 먼저 브라우저 캐시로 라우팅
2.  유효한 캐시 응답이 있는지 확인
3.  일치하는 항목이 있으면 캐시에서 응답을 읽어 네트워크 대기시간과 전송 데이터 비용을 모두 제거

HTTP Cache는 Request header와 Response header의 조합에 의해 제어됩니다.

#### Response header: 웹서버 구성

HTTP 캐싱에서 가장 중요한 부분은 웹서버가 response에 추가하는 header입니다. 

아래는 캐시에 사용되는 헤더들입니다.

*   **Cache-Control** : 요청과 응답 내의 캐싱 메커니즘을 위한 directive를 정하기 위해 사용
*   **ETag** : 브라우저가 만료된 응답에 대해 해시 값을 서버로 보내 리소스 변경 여부 확인
*   **Last-Modified** : ETag 기반 전략과 반대로 시간 기반 전략을 통해 리소스 변경 여부 확인

### Cache-Control

Cache-Control 헤더는 응답을 누가, 어떤 조건에서, 얼마나 캐시할 수 있는지를 정의(지시)합니다.

![](https://blog.kakaocdn.net/dna/b51CEW/btr53HNvpEC/AAAAAAAAAAAAAAAAAAAAAHgA1CuS3wOhmCGY1MlxIP3IHLONW120EMhbHvlcQ_jv/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=hQL8HMYpwqCzW4w4ZnpoCcUDDMI%3D)

다음의 값들은 URL이 캐시되는 위치와 방법을 조정하는데 도움이 됩니다.

#### no-cache

캐시된 URL 버전을 사용하기 전에 매번 서버에서 유효성을 다시 확인하라고 브라우저에 지시

#### no-store

브라우저와 다른 중간 캐시(예를 들어 CDN)가 파일의 어떤 버전도 저장하지 않도록 지시

#### private

브라우저는 파일을 캐시할 수 있지만 중간 캐시는 캐시할 수 없음

#### public

응답은 모든 캐시에 의해 저장될 수 있음

#### Cache-Control 값 설정 프로세스

![](https://blog.kakaocdn.net/dna/bM3sx9/btr5RRKg2Qh/AAAAAAAAAAAAAAAAAAAAABqA3X0ZNCaJcQZE51UALhsrZFBwrHS6aGZ1QJyr_7Lp/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=OMOLPE18LRQADyOruccDSd%2FVzS0%3D)

Cache-Control Flow chart

1.  재사용 가능한 응답인가?  
    아니오 → no-store
2.  매번 검증을 해야 하는가?  
    예 → no-cache
3.  중간 매개체가 캐시 해도 되는가?  
    아니오 → private  
    예 → public
4.  캐시의 유효기간 설정 → max age → ETag 헤더 추가 등등

#### Cache-Control 값 예시

<table border="1"><tbody><tr><td><b>Cache-Control 값</b></td><td><b>설명</b></td></tr><tr><td>max-age=86400</td><td>응답은 최대 1일(60초 x 60분 x 24시간) 동안 브라우저 및 중간 캐시가 캐싱할 수 있습니다.</td></tr><tr><td>private, max-age=600</td><td>응답은 최대 10분(60초 x 10분) 동안 (중간 캐시가 아닌) 브라우저가 캐싱할 수 있습니다.</td></tr><tr><td>public, max-age=31536000</td><td>응답은 1년 동안 모든 캐시가 저장할 수 있습니다.</td></tr><tr><td>no-store</td><td>응답은 캐시할 수 없으며 모든 요청에서 전체를 가져와야 합니다.</td></tr></tbody></table>

### ETag

특정 버전의 리소스를 식별하는 식별자입니다. 이 값이 변하지 않았으면 캐시를 요청하지 않게 되어 불 필요한 리소스 다운로드를 하지 않게 할 수 있습니다. 

만약 특정 URL의 리소스가 변경된다면 새로운 ETag가 생성됩니다.

![](https://blog.kakaocdn.net/dna/b2NmMD/btr53Fvo261/AAAAAAAAAAAAAAAAAAAAAP_2wMhP_QroMu-OzSkcdRdvQ8h5DmsSgKEeJTWKSRnH/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=4dqvTGcQXpNYUQP%2BTsEMTQLVylU%3D)

위 그림은 브라우저와 서버간 요청과 응답에서 ETag를 확인하는 그림입니다.

브라우저는 ETag 토큰을 요청 헤더의 If-None-Match의 값으로 넣어 요청합니다. 서버는 요청에서 받은 ETag 토큰을 서버의 값과 비교하여 변경되지 않았다면 "304 Not Modified" 를 리턴합니다. 리턴에는 Cache-Control 값을 통해 토큰 수명을 120초로 재할당하라는 내용도 있습니다.

#### 문법

```text
ETag: W/"<etag_value>"
ETag: "<etag_value>"
```

**W/ Optional**

'W/' (대/소문자를 구분합니다.) weak validator 가 사용되었음을 나타냅니다.

Weak validators 는 만들기는 쉽지만 비교하기에는 효율성이 떨어집니다.

Strong validators 는 비교하기에는 이상적이지만 효율적으로 만들기가 어렵습니다.

동일한 자원의 두 가지 Weak Etag 값은 동일할 수 있지만, 바이트 단위까지 동일하진 않습니다.

**`"<etag_value>"`**

Entity tags 는 요청된 값을 ASCII 코드와 같이 고유한 형태로 나타냅니다.

(예 : "675af34563dc-tr34") ETag 의 값을 생성하는 방법(Method)은 단순히 한가지로 정해져있진 않습니다.

때때로, 콘텐츠의 해시, 마지막으로 수정된 타임스탬프의 해시, 혹은 그냥 개정번호를 이용합니다. 예를들어, MDN 는 wiki(콘텐츠)의 16진수 해시를 사용합니다.

### Reference

[https://web.dev/http-cache/#browser-compatibility](https://web.dev/http-cache/#browser-compatibility)

[https://pjh3749.tistory.com/264](https://pjh3749.tistory.com/264)

[https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control)

[https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/ETag](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/ETag)
