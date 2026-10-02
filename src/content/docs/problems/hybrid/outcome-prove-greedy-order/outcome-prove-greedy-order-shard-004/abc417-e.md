---
title: "ABC417-E — A Path in A Dictionary"
draft: true
authoringUnit: {"problemId":"abc417-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-004/abc417-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-state-graph-search"],"sourceRevisionIds":["source-abc417-e-problem-cea5c0f901c5869c9617734403c1605b07cb4daae4cb08d44ffe2e96ab5de334","source-abc417-editorial-13571-65acaa3021e80a01a0a423f7d4d2a04e3d780b47e6fb306f13a62da489869e7f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"無向graphではx→YとY→xの到達性が同じなので、候補neighborごとに探索せずYから一回探索して全候補を同時判定できる。 usedを禁止すれば新しい頂点は重複せず、各stepでcontinuationを保つため候補枯渇も起きない。最大N-1回で必ずYへ着く。 reachabilityがsimple path continuationのexistence oracleになり、選択後も必ずYへのcontinuationを保つ。path長≤NなのでO(N(N+M))。","sourceRevisionIds":["source-abc417-e-problem-cea5c0f901c5869c9617734403c1605b07cb4daae4cb08d44ffe2e96ab5de334","source-abc417-editorial-13571-65acaa3021e80a01a0a423f7d4d2a04e3d780b47e6fb306f13a62da489869e7f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 対称操作による状態の正規化。

## 考察

現在までのpath頂点集合をusedとすると、neighbor xを次に選べる必要十分条件は、usedを除いたgraphでxからYへ到達可能なことである。walkがあればcycle除去でsimple continuationにできる。

辞書順では既決定prefixの次の頂点番号が最優先なので、条件を満たすneighborの最小番号を選ぶ貪欲をY到着まで繰り返せる。

採用する候補: 各stepでused頂点を除いてYからDFS/BFSし、reachableな現在neighborの最小を次頂点にする

reachabilityがsimple path continuationのexistence oracleになり、選択後も必ずYへのcontinuationを保つ。path長≤NなのでO(N(N+M))。

棄却する候補: 全simple X-Y pathをDFSで列挙して列同士を辞書順比較する

simple path数は指数的になり得て、各prefixで必要なのは残りpathの存在判定だけである。

無向graphではx→YとY→xの到達性が同じなので、候補neighborごとに探索せずYから一回探索して全候補を同時判定できる。

usedを禁止すれば新しい頂点は重複せず、各stepでcontinuationを保つため候補枯渇も起きない。最大N-1回で必ずYへ着く。

path=[X],used[X]=trueとする。current≠Yの間、usedを通らずYからDFSしてreachableを作り、currentの隣接頂点のうち未使用かつreachableな最小xを選ぶ。xをpathへ追加・usedにし、最後に列を出力する。

## 典型の発動条件

### feasibility oracle付き辞書順貪欲

発動条件: 列の次要素を小さい順に試し、completion存在性を判定できるとき。

残graphのYへのreachabilityをoracleとして最小neighborを確定する。

### 禁止頂点下の到達性

発動条件: simple path prefixを固定し、残りで頂点再訪を防ぎたいとき。

prefix頂点を削除したgraphを毎step DFS/BFSする。

## 問題固有の要素

simple pathを直接数えず、「禁止集合を避けるwalkがある iff simple pathがある」でcompletion判定を通常reachabilityへ落とす。

別の問題へ持ち帰る視点: simple構造のlex最小構成では、固定prefixを禁止し、残りcompletionの存在をcycle除去可能なwalk判定へ緩和する。

## 正当性

無向graphではx→YとY→xの到達性が同じなので、候補neighborごとに探索せずYから一回探索して全候補を同時判定できる。 usedを禁止すれば新しい頂点は重複せず、各stepでcontinuationを保つため候補枯渇も起きない。最大N-1回で必ずYへ着く。 reachabilityがsimple path continuationのexistence oracleになり、選択後も必ずYへのcontinuationを保つ。path長≤NなのでO(N(N+M))。

## 実装上の注意

- current自身をusedとして探索から除くが、候補neighborは未使用であることを確認する。Y到達時は探索せず終了し、adjacency順に依存せず番号最小を明示比較する。

## 復習の核

- 最小neighborがdead end、後で合流するcycle、Yがcurrentの直接neighbor、complete graphを全simple path列挙と比較する。

## 計算量と制約

### 時間

O(N(N+M))、最大N−1stepでYから到達性DFS。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 500; 2\leq N\leq 1000; N-1\leq M\leq \min\left( \frac{N(N-1)}{2},5\times 10^4\right); 1\leq X,Y \leq N; X\neq Y; 1\leq U_i<V_i \leq N; If i\neq j, then (U_i,V_i)\neq (U_j,V_j).; The given graph is connected.; The sum of N over all test cases in each input is at most 1000.; The sum of M over all test cases in each input is at most 5\times 10^4.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc417/tasks/abc417_e) — source-abc417-e-problem-cea5c0f901c5869c9617734403c1605b07cb4daae4cb08d44ffe2e96ab5de334
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc417/editorial/13571) — source-abc417-editorial-13571-65acaa3021e80a01a0a423f7d4d2a04e3d780b47e6fb306f13a62da489869e7f
