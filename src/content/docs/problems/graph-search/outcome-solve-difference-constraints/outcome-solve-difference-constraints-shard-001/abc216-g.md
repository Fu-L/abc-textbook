---
title: "ABC216-G — 01Sequence"
draft: true
authoringUnit: {"problemId":"abc216-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-difference-constraints/outcome-solve-difference-constraints-shard-001/abc216-g.md","learningOutcomeIds":["outcome-solve-difference-constraints"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate","unit-weighted-shortest-path"],"excludedTopics":["difference constraints・不等式系の最短路化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-difference-constraints","tag-prefix-difference"],"sourceRevisionIds":["source-abc216-editorial-2474-35eb7d20d651a85291f8335f4bd73bb4b03897d5acea3531a3818958a41280db","source-abc216-g-problem-13b299a257f18f16182b1fb89e4953703d498edd2b25ab7f86504e773a0ff15e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"0prefix Bの隣差0..1と区間上限をedge上限制約に変える。0から最短距離は全制約を満たすBの各点最大上界であり自身も三角不等式でfeasible。したがってB_N最大、1個数最小。隣差からbitを復元すると全区間条件を満たす。","sourceRevisionIds":["source-abc216-editorial-2474-35eb7d20d651a85291f8335f4bd73bb4b03897d5acea3531a3818958a41280db","source-abc216-g-problem-13b299a257f18f16182b1fb89e4953703d498edd2b25ab7f86504e773a0ff15e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [difference constraints・不等式系の最短路化](src/content/docs/learn/graph/difference-constraints.md)

- 差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- difference constraints・不等式系の最短路化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

区間 [L_i,R_i] に 1 が X_i 個以上という条件は、その区間にある 0 の個数が R_i−L_i＋1−X_i 以下という条件へ置き換えられる。 B_i を先頭 i 要素の 0 の個数とすると、区間条件も各要素が 0/1 である条件も B の差に対する上限制約として書ける。 1 の個数最小化を直接扱わず、補数である 0 の prefix 個数 B_N の最大化へ反転すると差分制約の上界問題になる。 B_i≤B_{i+1} と B_{i+1}≤B_i＋1 を同時に課すことで、隣接 prefix 差が必ず 0 または 1 となり二進列を復元できる。

棄却する候補: 左から各 A_i を 0 または 1 に決め、未充足の区間制約をその都度検査しながら探索する。

局所的な選択が多数の重なる区間へ影響し、二進列の候補を直接探索すると指数的になる。

採用する候補: 0 の prefix 個数 B に対する差分制約グラフを作り、頂点 0 からの最短距離を求めて B_N を最大化する。

全制約が d_j−d_i≤w の形になり、辺重みも非負なのでダイクストラ法で同時に満たす最大の上界を得られる。

1 の個数最小化を直接扱わず、補数である 0 の prefix 個数 B_N の最大化へ反転すると差分制約の上界問題になる。

B_i≤B_{i+1} と B_{i+1}≤B_i＋1 を同時に課すことで、隣接 prefix 差が必ず 0 または 1 となり二進列を復元できる。

区間内 1 の下限制約を prefix 0 数の差の上限へ翻訳し、各不等式を有向辺として最短路距離に符号化して、距離差から最小 1 列を復元する。

## 典型の発動条件

### 区間個数制約の prefix 変換

発動条件: 多数の区間について要素和の上限・下限が課され、各要素が小さな差分値を取るとき。

prefix の 0 個数を導入し、区間の 1 下限を二つの prefix の差上限へ変える。

### 差分制約の最短路帰着

発動条件: 変数間の制約が d_j−d_i≤w の形で並び、特定の差を最大化したいとき。

i から j へ重み w の辺を張り、始点からの最短距離を実現可能な最大 prefix 値として使う。

## 問題固有の要素

区間の 1 下限をそのまま prefix 1 数の下限制約にする代わりに、0 の上限制約へ補うことで非負辺だけのグラフが得られる。

別の問題へ持ち帰る視点: 最小化対象の補数を最大化すると、不等号の向きや辺重みが扱いやすくなる場合がある。

## 正当性

0prefix Bの隣差0..1と区間上限をedge上限制約に変える。0から最短距離は全制約を満たすBの各点最大上界であり自身も三角不等式でfeasible。したがってB_N最大、1個数最小。隣差からbitを復元すると全区間条件を満たす。

## 実装上の注意

- 区間条件には L_i−1 から R_i へ重み R_i−L_i＋1−X_i の辺を張り、添字を一つずらす。
- 各 i について i＋1 から i へ重み 0、i から i＋1 へ重み 1 の両辺を張り、B_i−B_{i−1} が 1 なら A_i＝0 と復元する。

## 復習の核

- 区間の下限制約が扱いにくいときは、区間長から引いた補数の上限制約を作れるか確認する。
- 差分制約グラフでは式 d_j≤d_i＋w と辺 i→j を対応させ、目的変数の最大値が最短距離になる理由を確認する。

## 計算量と制約

### 時間

N bit、M区間。prefix graph N+1頂点、2N+M辺、Dijkstra O((N+M)log N)。

### 空間

prefix graphとdist O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq M \leq \min(2 \times 10^5, \frac{N(N+1)}{2} ); 1 \leq L_i \leq R_i \leq N; 1 \leq X_i \leq R_i-L_i+1; (L_i,R_i) \neq (L_j,R_j) if i \neq j.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc216/editorial/2474) — source-abc216-editorial-2474-35eb7d20d651a85291f8335f4bd73bb4b03897d5acea3531a3818958a41280db
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc216/tasks/abc216_g) — source-abc216-g-problem-13b299a257f18f16182b1fb89e4953703d498edd2b25ab7f86504e773a0ff15e
