---
format: md
title: "13458. 시험감독 (Java)"
description: "문제 접근 해당 문제는 총감독관이 감독하는 응시자를 제외하고 나머지 응시자 중에서 부감독관의 수로 나눴을 때 나머지 값에 따라 정답을 결정해주면 해결되는 문제이다. 그리고 최악의 케이스일 경우 정답이 int 범위를 벗어날 수 있으므로 long 타입을 써야한다. 코드 import java.io.*; import java.util.StringTokenizer;"
tags:
  - backend
  - algorithm

---

### 문제 접근

해당 문제는 총감독관이 감독하는 응시자를 제외하고 나머지 응시자 중에서 부감독관의 수로 나눴을 때 나머지 값에 따라 정답을 결정해주면 해결되는 문제이다.

그리고 최악의 케이스일 경우 정답이 int 범위를 벗어날 수 있으므로 long 타입을 써야한다.

### 코드

```java
import java.io.*;
import java.util.StringTokenizer;

// https://www.acmicpc.net/problem/3190

public class Main {
    static StringBuilder sb = new StringBuilder();
    
    static int N, B, C;
    static int[] testRooms;

    
    public static void main(String[] args) {
        input();
        process();
        System.out.println(sb.toString());
    }

    static void process() {
        long monitorNum = N;
        for (int i=0; i<N; i++) {
            int requiredMonitor = testRooms[i] - B;

            if (requiredMonitor > 0) {
                // 한번에 감독할 수 있는 횟수로 나눈 값의 나머지가 있을 때 부감독 한명 더 추가
                if (requiredMonitor/C == 0 && requiredMonitor%C > 0 || requiredMonitor/C != 0 && requiredMonitor%C > 0) {
                    monitorNum += requiredMonitor/C + 1;
                } else if (requiredMonitor/C != 0 && requiredMonitor%C == 0){
                    monitorNum += requiredMonitor/C;
                }
            }

        }

        sb.append(monitorNum);
    }
        

    static void input() {
        FastReader scan = new FastReader();
        N = scan.nextInt();
        testRooms = new int[N];
        String[] testRoomInfo = scan.nextLine().split(" ");
        for (int i=0; i<N; i++) {
            testRooms[i] = Integer.parseInt(testRoomInfo[i]);
        }
        String BC = scan.nextLine();
        B = Integer.parseInt(BC.split(" ")[0]);
        C = Integer.parseInt(BC.split(" ")[1]);
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

[https://www.acmicpc.net/problem/13458](https://www.acmicpc.net/problem/13458)

 [13458번: 시험 감독

첫째 줄에 시험장의 개수 N(1 ≤ N ≤ 1,000,000)이 주어진다. 둘째 줄에는 각 시험장에 있는 응시자의 수 Ai (1 ≤ Ai ≤ 1,000,000)가 주어진다. 셋째 줄에는 B와 C가 주어진다. (1 ≤ B, C ≤ 1,000,000)

www.acmicpc.net](https://www.acmicpc.net/problem/13458)
