---
format: md
title: "#1 - 외톨이 알파벳"
description: "문제 접근 이 문제는 외톨이 알파벳을 찾는 기준을 생각하는 것이 핵심이다. 문자 배열을 순회하며 이전에 한번 나왔던 알파벳이 다른 알파벳 뒤에 한번 더 나올 때를 체크해서 외톨이 알파벳으로 등록해준다. 정리하자면 알파벳이 이전에 나온 적이 있다. 직전의 알파벳과 다른 알파벳이다. 외톨이 알파벳으로 등록된 적이 없는 알파벳이다. 이 3가지 요건을 충족하는 경"
tags:
  - backend
  - algorithm

---

### 문제 접근

이 문제는 외톨이 알파벳을 찾는 기준을 생각하는 것이 핵심이다.

문자 배열을 순회하며 **이전에 한번 나왔던 알파벳** 이 **다른 알파벳 뒤** 에 **한번 더 나올 때** 를 체크해서 외톨이 알파벳으로 등록해준다.

정리하자면

1.  알파벳이 이전에 나온 적이 있다. 
2.  직전의 알파벳과 다른 알파벳이다.
3.  외톨이 알파벳으로 등록된 적이 없는 알파벳이다.

이 3가지 요건을 충족하는 경우에 외톨이 알파벳 대상이 된다.

### 코드

```java
import java.util.*;

class Solution {
    public String solution(String input_string) {
        String[] inputArr = input_string.split("");
        String prevAlp = inputArr[0];
        // 외톨이 알파벳 검증 Set
        Set<String> alpSet = new HashSet<>();
        // 외톨이 알파벳 등록여부 체크 Set
        Set<String> checkSet = new HashSet<>();
        // 외톨이 알파벳 Set
        List<String> lonelyList = new ArrayList<>();
        
        for (int i=0; i<inputArr.length; i++) {
            String target = inputArr[i];
            // 1. 현재 인덱스의 타겟 알파벳이 이전에 나왔었다면 OK
            // 2. 직전 타겟 알파벳이 현재 타겟과 다르면 OK
            // 3. 외톨이 알파벳으로 등록된 적이 없으면 OK
            if (alpSet.contains(target) && !prevAlp.equals(target) && !checkSet.contains(target)) {
                lonelyList.add(target);
                checkSet.add(target);
            } else {
                alpSet.add(target);
            }
            // 직전 타겟을 현재 타겟으로 변경
            prevAlp = target;
        }
        
        // 알파벳 오름차순으로 정렬
        Collections.sort(lonelyList);
        
        // 하나의 문자열로 합치기
        StringBuilder sb = new StringBuilder();
        for (int i=0; i<lonelyList.size(); i++) {
            sb.append(lonelyList.get(i));
        }
        if (sb.length() == 0) sb.append("N");
        
        return sb.toString();
    }
}
```

### 보완할 점

1.  위의 코드에서 외톨이 알파벳 배열을 만든 후 처리 과정이 마음에 들지 않는다. 정렬을 하고 StringBuilder로 원래 문자열 파라미터였던 것을 배열로 변환하고 다시 문자로 돌린격이 되는데, 더 좋은 방법이 있지 않을까?
2.  Java로 문제를 풀 때, Collection 프레임워크에서 제공되는 자료구조 라이브러리를 많이 사용하고 있는데 결과적으로 리턴할 때는 array로 변환하거나 새로 배열을 만들어서 답으로 리턴하는 경우가 많다. 이 때 발생하는 비용이 적지 않아서 이에 대한 고민이 필요하다. 

### 문제 링크

[https://school.programmers.co.kr/learn/courses/15008/lessons/121683](https://school.programmers.co.kr/learn/courses/15008/lessons/121683)

 [프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr](https://school.programmers.co.kr/learn/courses/15008/lessons/121683)
