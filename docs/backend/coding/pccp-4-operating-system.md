---
format: md
title: "#4 - 운영체제"
description: "문제 접근 이 문제는 우선순위 큐와 같은 자료구조를 사용하여 특정 기준을 적용한 정렬을 구현해야 한다. 코드 import java.util.*; class Solution { public long[] solution(int[][] program) { long[] answer = new long[11]; int curTime = 0; int restRunni"
tags:
  - backend
  - algorithm

---

### 문제 접근

이 문제는 우선순위 큐와 같은 자료구조를 사용하여 특정 기준을 적용한 정렬을 구현해야 한다.

### 코드

```java
import java.util.*;

class Solution {
    public long[] solution(int[][] program) {
        long[] answer = new long[11];
        int curTime = 0;
        int restRunningTime = 0; // 실행 중인 프로그램이 남은 시간
        
        // 전체 프로그램 우선순위 큐
        PriorityQueue<Program> programQueue = new PriorityQueue<>();
        // 대기 중 우선순위 큐
        PriorityQueue<Program> waitingQueue = new PriorityQueue<>();
        
        for (int i=0; i<program.length; i++) {
            programQueue.add(new Program(program[i][0], program[i][1], program[i][2]));
        }
        
        while (true) {
            if (programQueue.isEmpty() && waitingQueue.isEmpty() && restRunningTime == 0) {
                break;
            }
            
            curTime++;
            if (restRunningTime > 0) restRunningTime--;
            
            // 1. 전체 프로그램 큐에 아직 하나라도 들어있고
            // 2. 다음 대상 프로그램의 호출시간이 현재 시간과 일치할 경우 -> flag 변경 후 대기 큐에 넣음
            while (!programQueue.isEmpty() && programQueue.peek().callTime == curTime) {
                Program waitProgram = programQueue.poll();
                waitProgram.flag = true;
                waitingQueue.add(waitProgram);
            }
            
            if (restRunningTime == 0 && !waitingQueue.isEmpty()) {
                Program target = waitingQueue.poll();
                // 대기 큐에서 꺼낸 대상 프로그램의 점수가 인덱스인 배열 값에 호출시간 더해주기
                answer[target.priority] += curTime - target.callTime;
                // 남은 실행시간을 대상 프로그램의 처리 시간으로 세팅
                restRunningTime = target.processTime;
            }
            
        }
        // 마지막 프로그램이 종료된 시간 넣기
        answer[0] = curTime;
        
        return answer;
    }
} 

class Program implements Comparable<Program> {
    int callTime;
    int processTime;
    int priority;
    boolean flag;
    
    public Program(int priority, int callTime, int processTime) {
        this.callTime = callTime;
        this.processTime = processTime;
        this.priority = priority;
    }
    
    @Override
    public int compareTo(Program program) {
        // waitingQueue 정렬 기준 (우선순위 -> 호출시간)
        if (flag) {
            if (this.priority != program.priority) {
                return this.priority - program.priority;
            } else {
                return this.callTime - program.callTime;
            }
        } 
        
        // programQueue 정렬 기준 (호출시간 -> 우선순위)
        if (this.callTime != program.callTime) {
            return this.callTime - program.callTime;
        } else {
            return this.priority - program.priority;
        }
        
    }
}
```

### 보완할 점

1.  코드가 너무 길어졌고, 테스트 속도가 느리므로 개선할 필요가 있음.

### 문제 링크

[https://school.programmers.co.kr/learn/courses/15008/lessons/121686](https://school.programmers.co.kr/learn/courses/15008/lessons/121686)

 [프로그래머스

코드 중심의 개발자 채용. 스택 기반의 포지션 매칭. 프로그래머스의 개발자 맞춤형 프로필을 등록하고, 나와 기술 궁합이 잘 맞는 기업들을 매칭 받으세요.

programmers.co.kr](https://school.programmers.co.kr/learn/courses/15008/lessons/121686)
