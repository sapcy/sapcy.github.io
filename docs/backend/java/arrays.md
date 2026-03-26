---
format: md
title: "배열"
description: "▶ 배열이란? 배열은 같은 타입의 여러 변수를 하나의 묶음으로 다루는 것 여기서 중요한 것은 같은 타입이어야 한다는 것이다. 예를 들면, int 배열을 선언하려면 다음과 같이 사용할 수 있다. int[] score = new int[5]; // 5개의 int 값을 저장할 수 있는 배열 생성 위의 코드가 실행되면 아래의 그림과 같이 배열이 생성된다. (0x1"
tags:
  - backend
  - java

---

### ▶ 배열이란?

> 배열은 같은 타입의 여러 변수를 하나의 묶음으로 다루는 것

여기서 중요한 것은 같은 타입이어야 한다는 것이다.

예를 들면,

int 배열을 선언하려면 다음과 같이 사용할 수 있다.

```java
int[] score = new int[5]; // 5개의 int 값을 저장할 수 있는 배열 생성
```

위의 코드가 실행되면 아래의 그림과 같이 배열이 생성된다. (0x100 값은 실제 객체의 메모리 주소가 아닌 예시로 적은 주소 값)

![](https://blog.kakaocdn.net/dna/sBpSd/btrE9RbNZOW/AAAAAAAAAAAAAAAAAAAAALGcxBTZcghbePBZ5gUGK82Ri-8GAUR9IWDw9D5dQkl0/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=xcm5CBLyuB94nnzbHCsU1z4w1tM%3D)

메모리에 생성된 변수들

배열의 선언과 생성과정을 단계별로 보자.

1\. int\[\] score;

int형 배열 참조변수 score를 선언한다. 데이터를 저장할 수 있는 공간은 아직 없다.

![](https://blog.kakaocdn.net/dna/DC4D1/btrE7C7wwMx/AAAAAAAAAAAAAAAAAAAAAP-rvH0NmjFDGKBDVAKNsLzz93PtBDOjx20-8_rotFEy/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=l%2BRTIp1lc7OuwTRU%2BoB3GZPWIDU%3D)

배열 참조변수 score

2\. score = new int\[5\];

2-1. 연산자 'new'에 의해서 메모리의 빈 공간에 5개의 int형 데이터를 저장할 수 있는 공간이 생성된다.

0x100은 이 공간의 메모리 주소이다.

![](https://blog.kakaocdn.net/dna/m4AsA/btrE5R49Uce/AAAAAAAAAAAAAAAAAAAAAMdEL5aKTwUKn-gyN8lb0x2PZNyQrzVwCkzdxCKF5mhl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=OHMt0ERoMH4k93X8bBVVqOqsw2Q%3D)

배열 공간 생성

2-2. 각 배열요소는 자동적으로 int의 기본값(default)인 0으로 초기화된다.

![](https://blog.kakaocdn.net/dna/o94cV/btrE7DehYoN/AAAAAAAAAAAAAAAAAAAAADRjr7WelzOwvetFjJnmh9-b8eEIJAroKpYI6rX0Wc1Q/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=Ecl0zYylmBzs2Q7wr3deUUsQ9lo%3D)

배열요소 초기화

2-3. 대입 연산자 '='에 의해 배열의 주소가 int형 배열 참조변수 score에 저장된다.

![](https://blog.kakaocdn.net/dna/bO8icR/btrE9RiBiox/AAAAAAAAAAAAAAAAAAAAAOUz7EM3Brbm0lGy_zSD--jdyNHyTsUT9TuPelaNI3N_/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=eKlmc4cgxIq9%2FMCYopPNL9Rj4bo%3D)

배열 참조변수 저장

### ▶ 배열의 길이

**배열의 길이는 int범위의 양의 정수(0도 포함)이어야 한다.**

배열의 길이는 반드시 양의 정수이며, 최대값은 int타입의 최대값인 약 20억이다. 실제로는 이렇게 큰 배열을 생성하는 경우가 없어 사실상 길이에 제약이 없다고 할 수 있다.

자바에서는 JVM이 모든 배열의 길이를 별도로 관리한다. 

배열의 길이는 '배열참조변수이름.length'를 통해서 얻을 수 있다.

한번 생성된 배열의 길이는 변하지 않기 때문에 배열참조변수이름.length는 상수다.

만약 배열의 길이보다 더 큰 인덱스의 값을 사용하려 하면 ArrayIndexOutOfBoundsException 예외가 발생한다.

**배열의 길이 변경**

선언한 배열의 길이는 변경할 수 없으므로 더 큰 길이의 새로운 배열을 생성하고, 기존 배열의 값을 복사하는 방법을 사용할 수 있다.

1.  더 큰 배열 새로 생성
2.  기존 배열 내용을 새로운 배열에 복사

이러한 작업 자체가 비용이 꽤 들기 때문에, 처음부터 넉넉하게 기존 길이의 2배 정도로 생성하는 것이 좋다.

배열의 길이 중 0이 포함되어 있는데, 길이가 0인 배열이 필요한 상황이 있으며 나름 유용하다. 

예를 들면, ZeroLengthEx.java 파일을 실행하는 예제가 있다.

```java
class ZeroLengthEx { 
    public static void main(String[] args) {
    	for (int i=0; i<args.length; i++) {
            System.out.println("args[" + i + "] = \"" + args[i] + "\"");
        }
    }
}
```

위  java 파일을 실행하게 되면,

1.  매개변수 넣고 실행  
    \> java ZeroLengthEx test text args  
    args\[0\] = "test"  
    args\[1\] = "text"  
    args\[2\] = "args"
2.  매개변수 없이 실행  
    \> java ZeroLengthEx

2번과 같이 매개변수 없이 실행했을 때, JVM은 null대신 크기가 0인 배열을 생성해서 args에 전달하도록 구현되어 있다.

이를 통해 길이가 0인 배열이 필요한 상황이 있는 것을 확인하였다.

### ▶ 배열의 출력

배열을 출력할 때는 Arrays.toString() 이라는 자바에서 제공하는 유틸 메서드를 사용하는 것이 좋다.

Arrays 클래스 사용을 위해서는 import java.util.Arrays; 를 추가하면 된다. 

```java
int[] iArr = { 100, 90, 80, 70, 60 };
```

위 배열에서 참조변수 iArr을 출력하게 되면 '배열의 주소'가 아닌 '\[I@14318bb'와 같은 형식의 문자열이 출력된다.

**'타입@주소'의 형식인데, \[I는 1차원 int배열이라는 의미이며, '@' 뒤에 나오는 16진수는 배열의 메모리 주소인데, 실제 주소가 아닌 내부 주소이다.**

### ▶ 배열의 초기화

변수의 타입에 따른 기본값은 다음과 같다.

<table border="1"><tbody><tr><td><b>자료형</b></td><td><b>기본값</b></td></tr><tr><td>char</td><td>false</td></tr><tr><td>boolean</td><td>'\u0000'</td></tr><tr><td>byte, short, int</td><td>0</td></tr><tr><td>long</td><td>0L</td></tr><tr><td>float</td><td>0.0f</td></tr><tr><td>double</td><td>0.0d 또는 0.0</td></tr><tr><td><b>참조형 변수</b></td><td><b>null</b></td></tr></tbody></table>

### ▶ 다차원 배열

2차원 배열의 선언과 인덱스

<table border="1"><tbody><tr><td><b>선언 방법</b></td><td><b>선언 예</b></td></tr><tr><td>타입[][] 변수이름</td><td>int[][] score;</td></tr><tr><td>타입 변수이름[][];</td><td>int score[][];</td></tr><tr><td>타입[] 변수이름[];</td><td>int[] score[];</td></tr></tbody></table>

예제를 통해 다차원 배열의 생성을 살펴보자면,

```java
int[][] score = {
                    {100, 100, 100}
                  , {30, 40, 50}
                  , {1, 2}
                  , {23}
                };
```

위와 같이 배열을 생성하게 되면 2차원 배열 score는 아래의 그림과 같이 메모리에 생성된다.

![](https://blog.kakaocdn.net/dna/blZ7vn/btrE8SIbyqe/AAAAAAAAAAAAAAAAAAAAANuS7hxudoy4A8U56Z3p9FkWf-I999b5s9xTgqEESxRV/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=zu6f7L5aUI%2FAyjY6l%2B7Dy%2B7FSqo%3D)

2차원 배열의 생성
