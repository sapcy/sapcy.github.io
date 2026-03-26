---
format: md
title: "14888. 연산자 끼워넣기 (Java)"
description: "문제 N개의 수로 이루어진 수열 A1, A2, ..., AN이 주어진다. 또, 수와 수 사이에 끼워넣을 수 있는 N-1개의 연산자가 주어진다. 연산자는 덧셈(+), 뺄셈(-), 곱셈(×), 나눗셈(÷)으로만 이루어져 있다. 우리는 수와 수 사이에 연산자를 하나씩 넣어서, 수식을 하나 만들 수 있다. 이때, 주어진 수의 순서를 바꾸면 안 된다. 예를 들어, "
tags:
  - backend
  - algorithm

---

### 문제

N개의 수로 이루어진 수열 A1, A2, ..., AN이 주어진다. 또, 수와 수 사이에 끼워넣을 수 있는 N-1개의 연산자가 주어진다. 연산자는 덧셈(+), 뺄셈(-), 곱셈(×), 나눗셈(÷)으로만 이루어져 있다.

우리는 수와 수 사이에 연산자를 하나씩 넣어서, 수식을 하나 만들 수 있다. 이때, 주어진 수의 순서를 바꾸면 안 된다.

예를 들어, 6개의 수로 이루어진 수열이 1, 2, 3, 4, 5, 6이고, 주어진 연산자가 덧셈(+) 2개, 뺄셈(-) 1개, 곱셈(×) 1개, 나눗셈(÷) 1개인 경우에는 총 60가지의 식을 만들 수 있다. 예를 들어, 아래와 같은 식을 만들 수 있다.

*   1+2+3-4×5÷6
*   1÷2+3+4-5×6
*   1+2÷3×4-5+6
*   1÷2×3-4+5+6

식의 계산은 연산자 우선 순위를 무시하고 앞에서부터 진행해야 한다. 또, 나눗셈은 정수 나눗셈으로 몫만 취한다. 음수를 양수로 나눌 때는 C++14의 기준을 따른다. 즉, 양수로 바꾼 뒤 몫을 취하고, 그 몫을 음수로 바꾼 것과 같다. 이에 따라서, 위의 식 4개의 결과를 계산해보면 아래와 같다.

*   1+2+3-4×5÷6 = 1
*   1÷2+3+4-5×6 = 12
*   1+2÷3×4-5+6 = 5
*   1÷2×3-4+5+6 = 7

N개의 수와 N-1개의 연산자가 주어졌을 때, 만들 수 있는 식의 결과가 최대인 것과 최소인 것을 구하는 프로그램을 작성하시오.

### 문제 접근

DFS로 완전탐색을 통해 답을 도출한다.

연산자 배열의 값을 통해 연산자를 쓸 수 있는 횟수를 측정하고, 넣을 때 감소시키고 다썼으면 다시 증가시키며 모든 경우의 최댓값, 최솟값을 탐색한다.

### 코드

```java
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static FastReader scan = new FastReader();
    static StringBuilder sb = new StringBuilder();

    static int N, maxValue, minValue;
    static int[] operators, numbers;

    static int calc(int op1, int operator, int op2) {
        if (operator == 0) return op1 + op2;
        else if (operator == 1) return op1 - op2;
        else if (operator == 2) return op1 * op2;
        else if (operator == 3) return op1 / op2;
        return 0;
    }

    static void rec_func(int index, int value) {
        if (index == N-1) {
            maxValue = Math.max(maxValue, value);
            minValue = Math.min(minValue, value);
        } else {
            for (int i=0; i<4; i++) {
                if (operators[i] > 0) {
                    operators[i]--;
                    rec_func(index+1, calc(value, i, numbers[index+1]));
                    operators[i]++;
                }
            }
        }
    }

    static void input() {
        N = scan.nextInt();

        operators = new int[4];
        numbers = new int[N];

        for (int i=0; i<N; i++) {
            numbers[i] = scan.nextInt();
        }

        for (int i=0; i<4; i++) {
            operators[i] = scan.nextInt();
        }

        maxValue = Integer.MIN_VALUE;
        minValue = Integer.MAX_VALUE;
    }

    public static void main(String[] args) {
        input();
        rec_func(0, numbers[0]);
        sb.append(maxValue).append("\n").append(minValue);
        System.out.println(sb.toString());
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

[https://www.acmicpc.net/problem/14888](https://www.acmicpc.net/problem/14888)

 [14888번: 연산자 끼워넣기

첫째 줄에 수의 개수 N(2 ≤ N ≤ 11)가 주어진다. 둘째 줄에는 A1, A2, ..., AN이 주어진다. (1 ≤ Ai ≤ 100) 셋째 줄에는 합이 N-1인 4개의 정수가 주어지는데, 차례대로 덧셈(+)의 개수, 뺄셈(-)의 개수, 

www.acmicpc.net](https://www.acmicpc.net/problem/14888)
