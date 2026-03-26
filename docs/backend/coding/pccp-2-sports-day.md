---
format: md
title: "#2 - 체육대회"
description: "문제 접근 이 문제는 모든 케이스를 확인해서 결과를 도출해야하는 완전 탐색 문제이다. 테니스 탁구 수영 석환 40 10 10 영재 20 5 0 인용 30 30 30 정현 70 0 70 준모 100 100 100 재귀함수를 통해 DFS로 최대값을 비교해가며 마지막 케이스까지 검증 후 결과를 리턴한다. 코드 import java.lang.Math; class "
tags:
  - backend
  - algorithm

---

### 문제 접근

이 문제는 모든 케이스를 확인해서 결과를 도출해야하는 완전 탐색 문제이다.

<table border="1"><tbody><tr><td>&nbsp;</td><td>테니스</td><td>탁구</td><td>수영</td></tr><tr><td>석환</td><td>40</td><td>10</td><td>10</td></tr><tr><td>영재</td><td>20</td><td>5</td><td>0</td></tr><tr><td>인용</td><td>30</td><td>30</td><td>30</td></tr><tr><td>정현</td><td>70</td><td>0</td><td>70</td></tr><tr><td>준모</td><td>100</td><td>100</td><td>100</td></tr></tbody></table>

재귀함수를 통해 DFS로 최대값을 비교해가며 마지막 케이스까지 검증 후 결과를 리턴한다.

### 코드

```java
import java.lang.Math;

class Solution {
    int maxValue = Integer.MIN_VALUE;
    int sum = 0;
    boolean[] visited;
    
    public int solution(int[][] ability) {
        visited = new boolean[ability.length];
        process(ability, 0);
        
        return maxValue;
    }
    
    private void process(int[][] ability, int abilityIndex) {
        // 종목 수만큼 다 조회했을 때 최대값과 비교
        if (abilityIndex == ability[0].length) {
            maxValue = Math.max(maxValue, sum);
        } else {
            for (int i=0; i<ability.length; i++) {
                // 아직 종목 후보로 이름을 넣지 않은 경우 실행
                if (!visited[i]) {
                    visited[i] = true;
                    sum += ability[i][abilityIndex];
                    process(ability, abilityIndex+1);
                    sum -= ability[i][abilityIndex];
                    visited[i] = false;
                }
            }
        }
    }
}
```

process 메서드에서 for문이 진행될 때 변수 값들을 표로 정리하면,

<table border="1"><tbody><tr><td>&nbsp;</td><td>테니스(0)</td><td>탁구(1)</td><td>수영(2)</td><td>종목 후보 배열(visited)</td><td>총합</td></tr><tr><td>i=0</td><td>석환</td><td>&nbsp;</td><td>&nbsp;</td><td>[true, false, false, false, false]</td><td>40</td></tr><tr><td>i=1</td><td>석환</td><td>영재</td><td>&nbsp;</td><td><span>[true, true, false,<span>&nbsp;</span></span><span>false,<span>&nbsp;</span></span>false]</td><td>40 + 5</td></tr><tr><td>i=2</td><td>석환</td><td>영재</td><td>인용</td><td><span>[true, true, true,<span>&nbsp;</span></span><span>false,<span>&nbsp;</span></span>false]</td><td>40 + 5 + 30 (최대값 비교)</td></tr><tr><td>i=1</td><td>석환</td><td>영재</td><td>&nbsp;</td><td><span>[true,<span>&nbsp;</span>true, false,<span>&nbsp;</span></span><span>false,<span>&nbsp;</span></span>false]</td><td>40 + 5 + 30 - 30</td></tr><tr><td>i=2</td><td>석환</td><td>영재</td><td>정현</td><td><span>[true, true, false, true, false]</span></td><td>40 + 5 + 70 (최대값 비교)</td></tr><tr><td>...</td><td>...</td><td>...</td><td>...</td><td><span>...</span></td><td>...</td></tr></tbody></table>

종목 index 값인 abilityIndex가 3일 때마다 최대값을 비교 후 교체하는 식으로 진행된다.

### 보완할 점

1.  완전 탐색을 통해야만 값을 구할 수 있는지?  순회없이 답을 구할 수 있는 방법이 없는지 다음에 다시 한번 풀어보자.

### 문제 링크

[https://school.programmers.co.kr/learn/courses/15008/lessons/121684](https://school.programmers.co.kr/learn/courses/15008/lessons/121684)

 [프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr](https://school.programmers.co.kr/learn/courses/15008/lessons/121684)
