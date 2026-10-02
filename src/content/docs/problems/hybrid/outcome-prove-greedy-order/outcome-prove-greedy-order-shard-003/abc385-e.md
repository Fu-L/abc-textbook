---
title: "ABC385-E — Snowflake Tree"
draft: true
authoringUnit: {"problemId":"abc385-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc385-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc385-e-problem-31f1e48e1b47f94d6bfe746b537b31b8fd3189cc059f04a525da7a930b91abe4","source-abc385-editorial-11640-df769f63cf1103b792437bd9b3be1880bc948f70c7a9e56e6de1c5f0ee721a93"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"第一層v自身が中心との辺を一本使うため、葉数候補はdeg(v)-1である。 最大残存頂点数を求めれば、必要削除数はNから引くだけである。 x番目の次数dがbottleneckとなり、残せる頂点数1+x+x(d-1)を各候補で直接評価でき、全隣接sortの合計O(N log N)で済む。","sourceRevisionIds":["source-abc385-e-problem-31f1e48e1b47f94d6bfe746b537b31b8fd3189cc059f04a525da7a930b91abe4","source-abc385-editorial-11640-df769f63cf1103b792437bd9b3be1880bc948f70c7a9e56e6de1c5f0ee721a93"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 対称操作による状態の正規化。

## 考察

中心uと第一層の頂点数xを固定すると、全第一層へ同じ数yの葉を付ける必要があり、yは選んだ隣接頂点の最小(deg(v)-1)で決まる。

同じxならこの最小値を最大化するには、uの隣接頂点を次数の大きい順に上位x個選べばよい。

採用する候補: 各中心の隣接次数を降順sortし、prefix個数xを全探索する

x番目の次数dがbottleneckとなり、残せる頂点数1+x+x(d-1)を各候補で直接評価でき、全隣接sortの合計O(N log N)で済む。

棄却する候補: 削除する頂点集合をsubset全探索する

N=3×10^5で組合せは指数的であり、snowflake構造が次数だけで決まる性質を使えていない。

第一層v自身が中心との辺を一本使うため、葉数候補はdeg(v)-1である。

最大残存頂点数を求めれば、必要削除数はNから引くだけである。

全頂点uについて隣接頂点のdegを降順に並べる。x=1..deg(u)を走査し、y=sortedDeg[x-1]-1として1+x+xyの最大を更新し、Nから引く。

## 典型の発動条件

### bottleneck最大化のsort prefix

発動条件: x個選んだ価値が選択集合の最小keyで決まるとき。

key上位x個を選び、xごとの最小を末尾要素として評価する。

### 木の次数による局所構造評価

発動条件: 部分木の形が中心と隣接頂点の次数だけで決まるとき。

中心候補ごとに二層snowflakeの最大サイズを数える。

## 問題固有の要素

どの葉を残すかは個別に選ばなくても、木なので第一層vには中心以外のdeg(v)-1隣接点を自由に葉として残せる。

別の問題へ持ち帰る視点: 木から固定深さ・一様分岐構造を残す問題では、cycle干渉がないため局所次数のorder statisticsへ帰着できる。

## 正当性

第一層v自身が中心との辺を一本使うため、葉数候補はdeg(v)-1である。 最大残存頂点数を求めれば、必要削除数はNから引くだけである。 x番目の次数dがbottleneckとなり、残せる頂点数1+x+x(d-1)を各候補で直接評価でき、全隣接sortの合計O(N log N)で済む。

## 実装上の注意

- deg(v)-1=0も評価可能で、公式の同値変形により別途除外不要。式1+x+x*yと答えの引き算は整数型で行う。

## 復習の核

- path、star、全隣接次数が同じ木を手計算し、x=1とx=deg(u)、y=0相当の扱いを確認する。

## 計算量と制約

### 時間

O(N log N)、各頂点の隣接degree sortの合計≤O(N log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 3 \times 10^5; 1 \leq u_i < v_i \leq N; The given graph is a tree.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc385/tasks/abc385_e) — source-abc385-e-problem-31f1e48e1b47f94d6bfe746b537b31b8fd3189cc059f04a525da7a930b91abe4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc385/editorial/11640) — source-abc385-editorial-11640-df769f63cf1103b792437bd9b3be1880bc948f70c7a9e56e6de1c5f0ee721a93
