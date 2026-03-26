---
format: md
title: "14501. 퇴사 (Java)"
description: "문제 상담원으로 일하고 있는 백준이는 퇴사를 하려고 한다. 오늘부터 N+1일째 되는 날 퇴사를 하기 위해서, 남은 N일 동안 최대한 많은 상담을 하려고 한다. 백준이는 비서에게 최대한 많은 상담을 잡으라고 부탁을 했고, 비서는 하루에 하나씩 서로 다른 사람의 상담을 잡아놓았다. 각각의 상담은 상담을 완료하는 데 걸리는 기간 Ti와 상담을 했을 때 받을 수 "
tags:
  - backend
  - algorithm

---

### 문제

상담원으로 일하고 있는 백준이는 퇴사를 하려고 한다.

오늘부터 N+1일째 되는 날 퇴사를 하기 위해서, 남은 N일 동안 최대한 많은 상담을 하려고 한다.

백준이는 비서에게 최대한 많은 상담을 잡으라고 부탁을 했고, 비서는 하루에 하나씩 서로 다른 사람의 상담을 잡아놓았다.

각각의 상담은 상담을 완료하는 데 걸리는 기간 Ti와 상담을 했을 때 받을 수 있는 금액 Pi로 이루어져 있다.

N = 7인 경우에 다음과 같은 상담 일정표를 보자.

<table border="1"><tbody><tr><td>&nbsp;</td><td>1일</td><td>2일</td><td>3일</td><td>4일</td><td>5일</td><td>6일</td><td>7일</td></tr><tr><td><span>T</span>i</td><td>3</td><td>5</td><td>1</td><td>1</td><td>2</td><td>4</td><td>2</td></tr><tr><td><span>P</span>i</td><td>10</td><td>20</td><td>10</td><td>20</td><td>15</td><td>40</td><td>200</td></tr></tbody></table>

1일에 잡혀있는 상담은 총 3일이 걸리며, 상담했을 때 받을 수 있는 금액은 10이다. 5일에 잡혀있는 상담은 총 2일이 걸리며, 받을 수 있는 금액은 15이다.

상담을 하는데 필요한 기간은 1일보다 클 수 있기 때문에, 모든 상담을 할 수는 없다. 예를 들어서 1일에 상담을 하게 되면, 2일, 3일에 있는 상담은 할 수 없게 된다. 2일에 있는 상담을 하게 되면, 3, 4, 5, 6일에 잡혀있는 상담은 할 수 없다.

또한, N+1일째에는 회사에 없기 때문에, 6, 7일에 있는 상담을 할 수 없다.

퇴사 전에 할 수 있는 상담의 최대 이익은 1일, 4일, 5일에 있는 상담을 하는 것이며, 이때의 이익은 10+20+15=45이다.

상담을 적절히 했을 때, 백준이가 얻을 수 있는 최대 수익을 구하는 프로그램을 작성하시오.

### 문제 접근

완전탐색을 통해 답을 도출한다. 

DFS를 사용했으며, 일자 순서(왼쪽에서 오른쪽)로만 조합이 되므로 start 변수를 기준으로 계속 늘려가며 탐색을 한다.

start는 대상 상담일자의 상담일만큼 더했을 때 N+1일을 넘지 않을 경우에 이익계산 조합으로 해당 일자를 넣는다.

모든 케이스를 위해 start에 1을 더하며 인덱스를 올린다

### 코드

```java
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

// https://www.acmicpc.net/problem/3190

public class Main {

    static int N;
    static int answer = Integer.MIN_VALUE;

    static int[] processTimeList;
    static int[] moneyList;

    public static void main(String[] args) {
        input();
        process(0, 0);
        System.out.println(answer);
    }

    static void process(int start, int sum) {
        if (start >= N) {
            answer = Math.max(sum, answer);
        } else {
            if (start + processTimeList[start] <= N) {
                process(start + processTimeList[start], sum + moneyList[start]);
            }
            process(start + 1, sum);
        }
    }

    static void input() {
        FastReader scan = new FastReader();
        N = scan.nextInt();
        processTimeList = new int[N];
        moneyList = new int[N];

        for (int i=0; i<N; i++) {
            String[] next = scan.nextLine().split(" ");
            processTimeList[i] = Integer.parseInt(next[0]);
            moneyList[i] = Integer.parseInt(next[1]);
        }
    }

    static class FastReader {
        BufferedReader br;
        StringTokenizer st;

        public FastReader() {
            br = new BufferedReader(new InputStreamReader(System.in));
        }

        public FastReader(String s) throws FileNotFoundException {
            br = new BufferedReader(new FileReader(new File(s)));
        }

        String next() {
            while (st == null || !st.hasMoreElements()) {
                try {
                    st = new StringTokenizer(br.readLine());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return st.nextToken();
        }

        int nextInt() {
            return Integer.parseInt(next());
        }

        long nextLong() {
            return Long.parseLong(next());
        }

        double nextDouble() {
            return Double.parseDouble(next());
        }

        String nextLine() {
            String str = "";
            try {
                str = br.readLine();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return str;
        }
    }
}
```

### 문제 링크

[https://www.acmicpc.net/problem/14501](https://www.acmicpc.net/problem/14501)

 [14501번: 퇴사

첫째 줄에 백준이가 얻을 수 있는 최대 이익을 출력한다.

www.acmicpc.net](https://www.acmicpc.net/problem/14501)
