---
title: "ABC460-F — Farthest Pair Query"
draft: true
authoringUnit: {"problemId":"abc460-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc460-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-tree-ancestor-lca","unit-tree-metric"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-tree-ancestor-lca","tag-tree-metric-diameter"],"sourceRevisionIds":["source-abc460-editorial-21029-aa3aea6c62f0ad6ad7f3a90d4b509af29a9962b410820591d626e0987bf398fd","source-abc460-f-problem-e78320848f728b55f4d63e6e3cb1a19f2d2668613420c720327f73c7da3d2621"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"empty集合は単位元、一頂点集合は同じ頂点を両端とする長さ0diameterとしてmonoidを構成できる。 merge時は(a,b,c,d)の全pair距離から最大の二端点を選べばS∪Tのdiameterになる。 任意の外部点xから集合U内の最遠点はUのdiameter端点のどちらかなので、cross pairの最大も二組の端点四個で覆える。","sourceRevisionIds":["source-abc460-editorial-21029-aa3aea6c62f0ad6ad7f3a90d4b509af29a9962b410820591d626e0987bf398fd","source-abc460-f-problem-e78320848f728b55f4d63e6e3cb1a19f2d2668613420c720327f73c7da3d2621"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

先に読む単元:

- [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md) — doubling・binary liftingで得た考え方と実装を再利用し、ancestor query・LCAの発動条件・正当化・境界を重複なく学ぶ。
- [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md) — 木を探索して基準点から距離labelを作る方法を土台に、距離剰余類による構造分類と、直径端点・中心が距離構造を代表する性質を区別して学ぶ。

## 考察

黒頂点集合Sの最大距離はSのdiameterであり、二集合S,Tをunionしたdiameterは各集合diameterの高々四端点だけから決まる。

採用する候補: vertex番号上のsegment tree各nodeに、その範囲の黒頂点集合diameter端点pairを持ち、色flipをpoint update、mergeを定数回のtree距離比較で行う。

棄却する候補: 各flip後に全黒頂点pairの距離を列挙して最大を求める。

一queryで黒頂点数の二乗pairがあり、Q回処理できない。

Euler tour+RMQまたはbinary liftingでLCAとdist(u,v)を前計算する。segment tree leafは黒なら(v,v)、白ならempty。内部nodeは左右の端点候補最大pairを選び、各queryのleaf更新後root端点距離を出力する。

## 典型の発動条件

### diameter端点のmerge monoid

発動条件: tree上の動的vertex集合で最大pair距離を保ちたいとき。

部分集合ごとのdiameter二端点だけをsegment treeへ載せる。

### LCA距離oracle

発動条件: 固定tree上で多数の二頂点距離比較を行うとき。

depthとLCAからdistを定数・対数時間で返す。

## 問題固有の要素

集合の全pair情報でも、tree metricではdiameter端点が外部点に対する最遠候補を代表する。

別の問題へ持ち帰る視点: 動的subset queryをsegment treeへ載せるには、union時に閉じる最小要約とempty単位元を探す。

## 正当性

empty集合は単位元、一頂点集合は同じ頂点を両端とする長さ0diameterとしてmonoidを構成できる。 merge時は(a,b,c,d)の全pair距離から最大の二端点を選べばS∪Tのdiameterになる。 任意の外部点xから集合U内の最遠点はUのdiameter端点のどちらかなので、cross pairの最大も二組の端点四個で覆える。

## 実装上の注意

- 黒頂点0個・1個の出力規約を確認し、距離最大tieは任意端点でよい。merge一回のdistance呼出し定数を抑える。

## 復習の核

- 外部点からdiameter端点のどちらかが最遠となる補題を使い、二集合mergeで四端点だけで十分な証明を再現する。

## 計算量と制約

### 時間

binary lifting版で前計算O(N log N)、Q更新O(Q log²N)。O(1)距離のRMQ版なら更新O(log N)。

### 空間

binary lifting版O(N log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 10^5; 1 \leq U_i, V_i \leq N; The given graph is a tree.; 1 \leq Q \leq 10^5; For each query, 1 \leq x \leq N.; There are always at least two black vertices.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc460/editorial/21029) — source-abc460-editorial-21029-aa3aea6c62f0ad6ad7f3a90d4b509af29a9962b410820591d626e0987bf398fd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc460/tasks/abc460_f) — source-abc460-f-problem-e78320848f728b55f4d63e6e3cb1a19f2d2668613420c720327f73c7da3d2621
