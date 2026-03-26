---
format: md
title: "JVM"
description: "들어가기 전에 Java로 프로그래밍을 함에 있어서 좋은 개발자가 되기 위해서는 고수준 영역뿐만 아니라 메모리가 관리되는 방식, 클래스 파일이 생성되는 방식, JVM의 내부 구조, 동작 원리 등을 알고 있어야 한다고 생각이 들었다. 그래서 오늘은 JVM에 대해서 공부해보겠다. JVM이란? JVM은 Java Virtual Machine의 약자이다. 말 그대로 "
tags:
  - backend
  - java

---

### 들어가기 전에

Java로 프로그래밍을 함에 있어서 좋은 개발자가 되기 위해서는 고수준 영역뿐만 아니라 메모리가 관리되는 방식, 클래스 파일이 생성되는 방식, JVM의 내부 구조, 동작 원리 등을 알고 있어야 한다고 생각이 들었다. 그래서 오늘은 JVM에 대해서 공부해보겠다.

* * *

### JVM이란?

JVM은 Java Virtual Machine의 약자이다. 말 그대로 자바를 실행하기 위한 가상 기계이다. 자바로 작성된 애플리케이션은 바이트 코드로 컴파일되어 JVM에서 이를 해석(interpret)하여 실행한다.

위와 같은 특성 때문에 자바 애플리케이션은 운영체제 및 플랫폼에 독립적이지만, JVM은 종속적이다. 그래서 윈도우 운영체제면 윈도우용 JVM, 리눅스 운영체제면 리눅스용 JVM을 이용한다.

![](https://blog.kakaocdn.net/dna/bAPU5C/btrAPOrdGDk/AAAAAAAAAAAAAAAAAAAAANJ8usaiSuQaB3eAnae-oNxbacWn9-n0JPLPzmF3zyne/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=6AF5yGx0Tr9c3sjWNHM4fS2baXE%3D)

OS별로 다른 JVM

* * *

### JVM 특징

*   **스택 기반**  
    대부분의 하드웨어가 레지스터 기반으로 동작하지만 JVM은 스택 기반으로 동작한다.   
    하드웨어마다 레지스터 수가 다르므로 레지스터로 하는 순간 구현에 관여하게되므로 계산 과정이 좀 더 복잡해지더라도 추상화하여 하드웨어의 스펙에 최소한의 관여를 하고자 스택을 사용한 것으로 생각됨.  
      
    
*   **심볼릭 레퍼런스**  
    기본 자료형을 제외한 모든 타입(클래스, 인터페이스)을 명시적인 메모리 주소 기반 레퍼런스가 아니라 참조 대상의 이름만으로 지칭한다. 클래스 파일이 JVM에 올라가면 심볼릭 레퍼런스는 이름에 맞는 객체의 메모리 주소를 찾아서 연결한다.  
      
    
*   **가비지 컬렉터**  
    가비지 컬렉터는 인스턴스가 사용된 후 더는 사용되지 않을 때 메모리를 자동으로 회수한다. 개발자가 따로 메모리 관리를 하지 않아도 되므로, 프로그래밍에 더 집중할 수 있음.  
      
    
*   **네트워크 바이트 오더**  
    자바 클래스 파일은 네트워크 바이트 오더(빅 엔디안)를 사용한다. 각 플랫폼마다 리틀 엔디안, 빅 엔디안 중 선택하여 사용하는데, 만약 다른 플랫폼끼리 네트워크 데이터 전송을 하려면 바이트 오더를 빅 엔디안에 맞춰서 전송해야 한다. 자바는 이로부터 독립성을 유지하기 위해 고정된 바이트 오더인 네트워크 바이트 오더를 사용한다.

<table border="1"><tbody><tr><td><b>Type</b></td><td><b>Memory</b></td></tr><tr><td>리틀 엔디안</td><td><span>0x78 0x56 0x34 0x12</span></td></tr><tr><td><span>빅엔디안</span></td><td><span>0x12 0x34 0x56 0x78</span></td></tr></tbody></table>

* * *

### Java 동작 원리

![](https://blog.kakaocdn.net/dna/cNDbXN/btrBr5ZGalD/AAAAAAAAAAAAAAAAAAAAABgEpE5qWRdWOsfAbfbXBmTPVh5GjXeHf4G_QgIDpIwc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=CYtKJ7A2MfE4IaYkfdLJ5CzNIDA%3D)

자바 동작 원리

#### Compiletime 환경

*   **Java Source**  
    개발자가 작성한 코드는 .java 파일로 저장되며 이를 Java Source라고 한다. 
*   **Java Compiler**  
    자바 소스를 바이트 코드(. class)로 컴파일한다.  
    바이트 코드는 JVM이 해석할 수 있는 반 기계어이며, 자바 바이트 코드의 각 명령어는 1바이트 크기의 Opcode와 추가 연산자로 이루어져 있음.

#### Runtime 환경

*   **Class Loader**  
    1.  로드: 자바 컴파일러에서 컴파일한 결과물인 바이트 코드를 가져와 동적 로딩(Dynamic Loading)을 통해 필요한 클래스들을 로딩 및 링크하여 **런타임 데이터 영역** 인 JVM 메모리에 로드한다.
    2.  검증: 자바 언어 명세(Java Language Specification) 및 JVM 명세대로 구성되어 있는지 검사한다.
    3.  준비: 클래스가 필요로 하는 메모리를 할당한다. (필드, 메서드, 인터페이스 등)
    4.  분석: 클래스의 상수 풀 내 모든 심볼릭 레퍼런스를 다이렉트 레퍼런스로 변경한다.
    5.  초기화: 클래스 변수들을 적절한 값으로 초기화한다. (static 필드)
*   **JVM 실행 엔진**  
    JVM 메모리에 올라온 바이트 코드들을 명령어 단위로 하나씩 가져와서 실행한다.
*   **Java Interpreter**  
    바이트 코드 명령어를 하나씩 해석하여 실행한다. 하나하나의 실행은 빠르지만 전체적인 실행 속도는 느림.
*   **JIT Compiler (Just-In-Time Compiler)**  
    인터프리터의 단점을 보완하기 위해 도입된 방식. 바이트 코드 전체를 컴파일하여 바이너리 코드로 변경하고 이후에는 해당 메서드를 더 이상 인터프리팅 하지 않고, 바이너리 코드로 직접 실행하는 방식이므로 속도가 더 빠르다.  
    

#### Runtime Data Area

클래스 로더에서 바이트코드를 JVM 메모리에 올리는 과정에 대해 좀 더 자세히 알아보자.

![](https://blog.kakaocdn.net/dna/bM12ZV/btrBwtLvt69/AAAAAAAAAAAAAAAAAAAAAHa6yHl49sjAErry_dIPEIxLWwWT7kYo1Oaoz8Irqh2V/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=67O4g6ykCPiGuErGI5Q8RCL7Dkc%3D)

런타임 데이터 영역 구조

런타임 데이터 영역은 JVM 프로그램이 운영체제에서 실행되면서 할당받는 메모리 영역이다.

크게 6개의 영역으로 나뉘는데. 이 중 PC 레지스터, JVM 스택, 네이티브 메서드 스택은 스레드마다 시작될 때 하나씩 생성된다.

힙, 메서드 영역, 런타임 상수 풀은 공유 자원으로써 모든 스레드가 사용한다. 각각 JVM이 시작될 때 생성된다.

*   **PC 레지스터**  
    현재 수행 중인 JVM 명령의 주소를 갖는다.
*   **JVM 스택**  
    스택 프레임이라는 구조체를 저장하는 스택으로, JVM은 오직 이 스택에 스택 프레임을 추가(push), 제거(pop)하는 동작만 수행한다.   
    예외 발생 시 printStackTrace() 등의 메서드로 보여주는 Stack Trace의 각 라인은 하나의 스택 프레임을 표현한다.  
      
    

![](https://blog.kakaocdn.net/dna/2h90V/btrBsYMyDXD/AAAAAAAAAAAAAAAAAAAAAABKniUoXErmpwD2Ht_7oJ0jmHfGzLCabu3OwYXyCbli/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=N5p1qYCbTDDokOf8rjPwQf5PNzo%3D)

JVM 스택 구조

*   **스택 프레임**  
    JVM 내에서 메서드가 수행될 때마다 하나의 스택 프레임이 생성되어 해당 스레드의 JVM 스택에 추가되고, 메서드가 종료되면 스택 프레임이 제거된다. (1 메서드 = 1 스택 프레임)  
    각 스택 프레임은 지역 변수 배열, 피연산자 스택, 현재 실행 중인 메서드가 속한 클래스의 런타임 상수 풀에 대한 레퍼런스를 갖는다.
    1.  지역 변수 배열: 0부터 시작하는 인덱스를 가진 배열이다. 0은 메서드가 속한 클래스 인스턴스의 this 레퍼런스이고, 1부터는 메서드에 전달된 파라미터들이 저장되며, 메서드 파라미터 이후에는 메서드의 지역 변수들이 저장된다.
    2.  피연산자 스택: 메서드의 실제 작업 공간. 각 메서드는 피연산자 스택과 지역 변수 배열 사이에서 데이터를 교환하고, 다른 메서드 호출 결과를 추가(push)하거나 꺼낸다(pop). 피연산자 스택의 크기는 컴파일 시에 결정된다.
    3.  네이티브 메서드 스택: 자바 외 언어로 작성된 네이티브 코드를 위한 스택.  
        즉, JNI(Java Native Interface)를 통해 호출하는 C/C++ 등의 코드를 수행하기 위한 스택이다. 언어에 맞게 C 혹은 C++ 스택이 생성된다.
*   **메서드 영역**  
    JVM이 읽어 들인 각각의 클래스와 인터페이스에 대한 런타임 상수 풀, 필드와 메서드 정보, Static 변수, 메서드의 바이트코드 등을 보관한다. 메서드 영역은 JVM 벤더마다 다양하게 구현 가능하며, 오라클 핫스팟 JVM에서는 흔히 Permanent Area, 혹은 Permanent Generation(PermGen)이라고 불린다. 
*   **런타임 상수 풀**  
    클래스 파일 포맷에서 constant\_pool 테이블에 해당하는 영역이다. 메서드 영역에 포함되는 영역이긴 하지만, JVM 동작에서 가장 핵심적인 역할을 수행하는 곳이기 때문에 JVM 명세에서도 따로 중요하게 기술한다. 이 상수 풀에 대해서는 다음에 집중적으로 포스팅할 예정이다.
*   **힙**  
    인스턴스 또는 객체를 저장하는 공간으로 가비지 컬렉션(Garbage Collection) 대상이다. JVM 성능 등의 이슈에서 가장 많이 언급되는 공간이다. 힙 구성 방식이나 가비지 컬렉션 방법 등은 JVM 벤더들의 재량이다.

### 참조

[https://d2.naver.com/helloworld/1230](https://d2.naver.com/helloworld/1230)

[https://swk3169.tistory.com/181](https://swk3169.tistory.com/181)
