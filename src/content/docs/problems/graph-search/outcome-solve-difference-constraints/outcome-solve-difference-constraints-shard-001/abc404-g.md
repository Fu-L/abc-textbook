---
title: "ABC404-G — Specified Range Sums"
draft: true
authoringUnit: {"problemId":"abc404-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-difference-constraints/outcome-solve-difference-constraints-shard-001/abc404-g.md","learningOutcomeIds":["outcome-solve-difference-constraints"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate","unit-weighted-shortest-path"],"excludedTopics":["difference constraints・不等式系の最短路化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-difference-constraints","tag-prefix-difference"],"sourceRevisionIds":["source-abc404-editorial-12867-07ec4e656a2816bf6bedd96c93c8e48bddf8381e4b5afe650723b7a41d0c3552","source-abc404-g-problem-92bb4dcb3f7cfb6cf7e8a701d6403e72b19590e52bb6098a6300d10b981420ee"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各区間等式は逆符号二辺、A_i≥1はi→i−1重み−1に一致する。全差分制約がfeasible iff負cycleなし。B_N=0の固定により総和は−B0、Nからの最短距離は最大可能B0で自身がfeasibleなのでその負値が最小総和。","sourceRevisionIds":["source-abc404-editorial-12867-07ec4e656a2816bf6bedd96c93c8e48bddf8381e4b5afe650723b7a41d0c3552","source-abc404-g-problem-92bb4dcb3f7cfb6cf7e8a701d6403e72b19590e52bb6098a6300d10b981420ee"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [difference constraints・不等式系の最短路化](src/content/docs/learn/graph/difference-constraints.md)

- 差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。

先に読む単元:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

## 考察

正整数列 A の区間和制約は、B_k=Σ_{j=1}^k A_j と置けば B_R-B_{L-1}=S という二点間の差へ変わる。 等式を二本の不等式へ分け、正値条件を B_j-B_{j-1}≥1 と書くと、すべて X_v-X_u≤c 型の差分制約になる。 B_R-B_{L-1}=S は (L-1)→R の重み S と R→(L-1) の重み -S、B_j-B_{j-1}≥1 は j→j-1 の重み -1 に対応する。 全 B を定数だけずらしても差は変わらない。B_N=0 とすると元の総和 B_N-B_0 は -B_0 であり、N からの最短距離が制約下での最大 B_0 を与える。

採用する候補: B_N=0 へ平行移動し、差分制約グラフの最短路で最大可能な B_0 を求めて答え -B_0 を得る

各制約を有向辺にし Bellman-Ford 法を使えば、負閉路による実行不能判定と目的値の最適化を N,M≤4000 で同時に扱える。

棄却する候補: 区間和の等式だけを連立方程式として解き、未決定変数を任意に埋める

A_j≥1 の不等式と総和の最小化を反映できず、整合する等式系でも正整数解が存在しない場合を判定できない。

B_R-B_{L-1}=S は (L-1)→R の重み S と R→(L-1) の重み -S、B_j-B_{j-1}≥1 は j→j-1 の重み -1 に対応する。

全 B を定数だけずらしても差は変わらない。B_N=0 とすると元の総和 B_N-B_0 は -B_0 であり、N からの最短距離が制約下での最大 B_0 を与える。

頂点 0..N のグラフを作り、X_v≤X_u+c を辺 u→v, 重み c に変換する。B_N=0 を始点として Bellman-Ford で距離を緩和し、N 回後にも更新があれば -1、なければ -dist[0] を出力する。

## 典型の発動条件

### 累積和による区間制約変換

発動条件: 多数の区間和の等式・不等式を同時に扱うとき。

区間和を二つの prefix sum の差として、変数二個の制約へ変える。

### 差分制約と Bellman-Ford

発動条件: 制約が X_v-X_u≤c に統一でき、実行可能性と一変数の極値が必要なとき。

制約を有向辺へ写し、最短距離と負閉路検出で最大 B_0 を求める。

## 問題固有の要素

総和を直接最小化せず終点を 0 に固定して始点を最大化すると、区間和の平行移動不変性が最短路の目的関数へ一致する。

別の問題へ持ち帰る視点: 差だけで定まる変数系では一変数を固定して平行移動自由度を消し、求める差を別頂点の極値として読む。

## 正当性

各区間等式は逆符号二辺、A_i≥1はi→i−1重み−1に一致する。全差分制約がfeasible iff負cycleなし。B_N=0の固定により総和は−B0、Nからの最短距離は最大可能B0で自身がfeasibleなのでその負値が最小総和。

## 実装上の注意

- S_i と距離は 32 bit を超えうるので 64 bit を使う。等式の両向き辺と正値条件の向きを取り違えず、到達可能な負閉路の更新を判定する。

## 復習の核

- 同一区間に異なる S がある矛盾、S が区間長未満、制約のない位置を含む例、N=1 を小さい A の全探索と照合する。

## 計算量と制約

### 時間

N要素M和制約、V=N+1,E=N+2M。Bellman–Ford O(NE)=O(N(N+M))。

### 空間

constraint edgeとdist O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N,M \le 4000; 1 \le L_i \le R_i \le N; 1 \le S_i \le 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc404/editorial/12867) — source-abc404-editorial-12867-07ec4e656a2816bf6bedd96c93c8e48bddf8381e4b5afe650723b7a41d0c3552
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc404/tasks/abc404_g) — source-abc404-g-problem-92bb4dcb3f7cfb6cf7e8a701d6403e72b19590e52bb6098a6300d10b981420ee
