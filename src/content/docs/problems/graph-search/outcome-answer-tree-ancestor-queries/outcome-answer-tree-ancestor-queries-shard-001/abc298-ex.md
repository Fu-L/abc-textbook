---
title: "ABC298-EX — Sum of Min of Length"
draft: true
authoringUnit: {"problemId":"abc298-ex","docPath":"src/content/docs/problems/graph-search/outcome-answer-tree-ancestor-queries/outcome-answer-tree-ancestor-queries-shard-001/abc298-ex.md","learningOutcomeIds":["outcome-answer-tree-ancestor-queries"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-binary-lifting","unit-rooted-tree-aggregation"],"excludedTopics":["ancestor query・LCAの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-tree-ancestor-lca","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc298-editorial-6218-40986b7f851ab2196d74d174440ce6ebd7f8d977070f487178d42b543e7d46cd","source-abc298-ex-problem-306d0f55300f97018ec9802314cff3e14f0ea70b3bf1c58098b6b91d4a31789f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"L=Rではmin距離が常にその端点への距離であり、全距離和D[L]を返す。異なる端点はdep[L]≤dep[R]に揃えると、Rから中央直前のMまでの経路はLCAより下に収まる。M部分木がRに厳密に近い側、補集合がLに近いか等距離の側なので、この二領域は目的のmin距離を漏れなく分担する。Dのreroot遷移は各頂点への距離変化を数える。F_RはMからRへの各辺でsz[M]−2sz[子]を加える式、F_Lは全頂点のLCAがCであることから導かれる。従ってD[L]−F_L+F_Rは正しい。","sourceRevisionIds":["source-abc298-editorial-6218-40986b7f851ab2196d74d174440ce6ebd7f8d977070f487178d42b543e7d46cd","source-abc298-ex-problem-306d0f55300f97018ec9802314cff3e14f0ea70b3bf1c58098b6b91d4a31789f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md)

- binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。

先に読む単元:

- [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md) — 決定的遷移の2^k回後と累積値を合成し、巨大回数のjumpを二進分解で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md) — DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。

## 考察

各クエリで全頂点への距離を足すとO(NQ)になる。木では二点L,Rへの近さがL–R経路上の位置だけで決まるので、経路の中央で切り、各側への距離総和をまとめて求めたい。

根を任意に固定し、dep[v]を深さ、sz[v]を部分木サイズ、H[v]=Σ_{j∈subtree(v)}dep[j]とする。またS[v]を根からvまでの頂点のszの和とする。DFSでsz,Hを求め、根からの走査でSを求める。

全頂点への距離和D[v]も前計算する。根oではD[o]=H[o]、親uから子vへ進むと部分木内のsz[v]頂点へは1近づき、それ以外へは1遠ざかるため、D[v]=D[u]+N−2sz[v]である。

まずL=RならD[L]を返す。この分岐にはN=1の場合も含まれる。以下はL≠Rとし、必要なら交換してdep[L]≤dep[R]に揃える。d=dep[L]+dep[R]−2dep[LCA(L,R)]を求め、Rのfloor((d−1)/2)段上の祖先をMとする。この歩数は非負で、MはLCA(L,R)より厳密に下にある。同深さでもこの性質は成り立つ。

Mの部分木内ではRの方が近く、外ではLの方が近いか等距離になる。したがって求める値はD[L]から「M部分木内のLへの距離和」を引き、「M部分木内のRへの距離和」を足したものになる。

RはMの子孫なので、MからRへ一辺下るたびに距離和はsz[M]−2sz[下った子]だけ変わる。よって内側の和は

F_R=H[M]−dep[M]sz[M]+(dep[R]−dep[M])sz[M]−2(S[R]−S[M])

である。一方LはM部分木の外にある。C=LCA(L,M)とすれば、M部分木内の全jについてLCA(L,j)=Cなので、

F_L=H[M]+sz\[M](dep[L]−2dep[C])

となる。回答はD[L]−F_L+F_R。倍増表でLCAと祖先を照会すれば、一質問につき定数回のO(log N)照会で済む。

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

L=Rではmin距離が常にその端点への距離であり、全距離和D[L]を返す。異なる端点はdep[L]≤dep[R]に揃えると、Rから中央直前のMまでの経路はLCAより下に収まる。M部分木がRに厳密に近い側、補集合がLに近いか等距離の側なので、この二領域は目的のmin距離を漏れなく分担する。Dのreroot遷移は各頂点への距離変化を数える。F_RはMからRへの各辺でsz[M]−2sz[子]を加える式、F_Lは全頂点のLCAがCであることから導かれる。従ってD[L]−F_L+F_Rは正しい。

## 実装上の注意

- L=Rを祖先照会より先に処理する。交換条件はdep[L]>dep[R]とし、同深さも許す。
- H,S,Dと距離和の積は64ビット整数で持つ。
- 経路長が偶数なら中央とその枝の等距離頂点はL側に入る。N=1、隣接、同深さ、祖先関係を同じ式で確認する。

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
