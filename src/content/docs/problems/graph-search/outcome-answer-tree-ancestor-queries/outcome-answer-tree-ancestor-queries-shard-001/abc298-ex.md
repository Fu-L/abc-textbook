---
title: "ABC298-EX — Sum of Min of Length"
draft: true
authoringUnit: {"problemId":"abc298-ex","docPath":"src/content/docs/problems/graph-search/outcome-answer-tree-ancestor-queries/outcome-answer-tree-ancestor-queries-shard-001/abc298-ex.md","learningOutcomeIds":["outcome-answer-tree-ancestor-queries"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-binary-lifting","unit-rooted-tree-aggregation"],"excludedTopics":["ancestor query・LCAの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-tree-ancestor-lca","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc298-editorial-6218-40986b7f851ab2196d74d174440ce6ebd7f8d977070f487178d42b543e7d46cd","source-abc298-ex-problem-306d0f55300f97018ec9802314cff3e14f0ea70b3bf1c58098b6b91d4a31789f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"L–R道の中央で切ると各側の全頂点はその側端点へ近く、等距離はどちらへ入れても値が同じ。R側を M 部分木として表し、その内側はR距離、外側はL距離を足す。部分木距離和は各辺切断のサイズと深さ和により厳密に集約できるため分割は漏れなく目的の min 距離を与える。","sourceRevisionIds":["source-abc298-editorial-6218-40986b7f851ab2196d74d174440ce6ebd7f8d977070f487178d42b543e7d46cd","source-abc298-ex-problem-306d0f55300f97018ec9802314cff3e14f0ea70b3bf1c58098b6b91d4a31789f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md)

- binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- ancestor query・LCAの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

二点L,Rへの距離の小さい側は、L-R path中央付近の辺で木を二領域に切ったとき一方ではR、他方ではLに固定される。 dep_L<dep_Rへ揃え、Rからfloor((d(L,R)-1)/2)上ったMの部分木がd(j,R)<d(j,L)となる側である。

採用する候補: LCA/level ancestorと距離総和の閉形式前計算

境界頂点Mを求め、M部分木内のR距離和と外のL距離和を部分木size・深さ和・祖先size和から定数個の式で得られる。

棄却する候補: 各質問で全頂点のmin距離を足す

O(NQ)になる。

dep_L<dep_Rへ揃え、Rからfloor((d(L,R)-1)/2)上ったMの部分木がd(j,R)<d(j,L)となる側である。

根付き木のdep,sz,subtree depth sum,祖先sz累積とLCA/LAを前計算する。各質問でMを求め、部分木距離和関数をR側とL側に適用して補集合と合算する。

## 典型の発動条件

### 木のVoronoi二分

発動条件: 二つのsiteへの近距離で全頂点を分割する。

LCAで二点間距離を求め、level ancestorで深い端点からpath中央直前まで上って境界辺を特定し、その両側へ二分する。

### 部分木距離総和

発動条件: 固定頂点から部分木/補集合への距離和を多数求める。

depth・subtree sizeのprefix集約で閉形式化する。

## 問題固有の要素

二点距離のmin和は木上Voronoi領域が一つの部分木になる向きへ端点を揃えると集約できる。

別の問題へ持ち帰る視点: 木の二site最短割当は中央edgeで切る。

## 正当性

L–R道の中央で切ると各側の全頂点はその側端点へ近く、等距離はどちらへ入れても値が同じ。R側を M 部分木として表し、その内側はR距離、外側はL距離を足す。部分木距離和は各辺切断のサイズと深さ和により厳密に集約できるため分割は漏れなく目的の min 距離を与える。

## 実装上の注意

- 深さ同値や距離偶奇でtieはL側へ含める式を確認し、全和は64ビットで持つ。

## 復習の核

- 全頂点BFS和と比較し、隣接点、祖先関係、同深さ、path長の奇偶を確認する。

## 計算量と制約

### 時間

N 頂点、Q 質問。LCA/level ancestor の倍増前計算 O(N log N)、各質問 O(log N)、全体 O((N+Q)log N)。

### 空間

祖先表と木、サイズ・深さ和で O(N log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 2 \times 10^5; 1 \leq A_i, B_i, L_i, R_i \leq N; The given graph is a tree.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/editorial/6218) — source-abc298-editorial-6218-40986b7f851ab2196d74d174440ce6ebd7f8d977070f487178d42b543e7d46cd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/tasks/abc298_h) — source-abc298-ex-problem-306d0f55300f97018ec9802314cff3e14f0ea70b3bf1c58098b6b91d4a31789f
