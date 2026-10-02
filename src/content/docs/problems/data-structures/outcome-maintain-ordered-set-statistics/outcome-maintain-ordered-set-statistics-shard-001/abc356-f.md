---
title: "ABC356-F — Distance Component Size Query"
draft: true
authoringUnit: {"problemId":"abc356-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc356-f.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-range-monoid-aggregation"],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset","tag-coordinate-compression","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc356-editorial-10114-385f9336c50f21621b2c24a6263eb1fdf7353153925b6727b637471e3e2e6dce","source-abc356-f-problem-ff7fab795b8d9f8a7edcfcf4c31ab456e24710bdcf757f68dd9b2db4015b963a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"component 境界は sorted S の隣接 gap>K の位置だけで、非隣接頂点間の直接辺は connectivity を新しく増やさない。 座標圧縮上の空 index は「Sで隣り合う」を壊さないよう、ordered set で実 predecessor/successor を取り、その edge flag の位置だけ更新する。 toggle は定数個の点更新、component query は左右の最初の gap>K を O(log Q) で探して区間存在数を取得できる。","sourceRevisionIds":["source-abc356-editorial-10114-385f9336c50f21621b2c24a6263eb1fdf7353153925b6727b637471e3e2e6dce","source-abc356-f-problem-ff7fab795b8d9f8a7edcfcf4c31ab456e24710bdcf757f68dd9b2db4015b963a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

S を昇順 s_1<…<s_m とすると、距離≤Kの全辺を張らなくても隣接 pair s_i,s_{i+1} の gap≤K の辺だけで連結成分は同じである。

一点の挿入・削除で変わる隣接関係は predecessor−x、x−successor、predecessor−successor の高々三辺だけなので動的更新が局所化する。

採用する候補: query値を先読み座標圧縮し、存在bitと右隣接edge bitを segment tree で管理して、切断点を二分探索し成分内存在数を得る。

toggle は定数個の点更新、component query は左右の最初の gap>K を O(log Q) で探して区間存在数を取得できる。

棄却する候補: type2 ごとに S の x から左右へ gap≤K の間走査して個数を数える。

全点が一成分の query が続くと一回 O(|S|)、合計 O(Q²) になる。

component 境界は sorted S の隣接 gap>K の位置だけで、非隣接頂点間の直接辺は connectivity を新しく増やさない。

座標圧縮上の空 index は「Sで隣り合う」を壊さないよう、ordered set で実 predecessor/successor を取り、その edge flag の位置だけ更新する。

全 x を圧縮し ordered set active を持つ。各 active point の存在Aと、その点からactive successorへのgap≤Kを表すBを segment tree に格納する。toggle時は前後点を求め B を張替えAを更新。query x ではBが連続して1の最大左右範囲をsegtreeのmax_right/min_leftで探し、その範囲のA合計を返す。

## 典型の発動条件

### 順序集合の局所隣接更新

発動条件: 一次元点集合の構造が sorted neighbor 関係だけで決まり、点をtoggleするとき。

predecessor/successor を取り、削除・追加される隣接辺だけ更新する。

### segment tree の境界探索

発動条件: binary edge列で連続する1の区間端と、その区間の頂点数を動的に求めるとき。

range aggregate と max_right/min_left を組み合わせる。

### 全query値のoffline座標圧縮

発動条件: 更新値を先読みでき、疎な整数key上へsegment treeを構築したいとき。

全queryのxをsort-uniqueして順序を保つdense indexへ写し、存在bitと右隣接edge bitの配列を確保する。

## 問題固有の要素

threshold graph は密でも、一次元順序では隣接点間の path が全 connectivity を保存する sparse certificate になる。

別の問題へ持ち帰る視点: 距離 threshold graph では sorted adjacency だけで連結性が保たれるか三点不等式を確認する。

## 正当性

component 境界は sorted S の隣接 gap>K の位置だけで、非隣接頂点間の直接辺は connectivity を新しく増やさない。 座標圧縮上の空 index は「Sで隣り合う」を壊さないよう、ordered set で実 predecessor/successor を取り、その edge flag の位置だけ更新する。 toggle は定数個の点更新、component query は左右の最初の gap>K を O(log Q) で探して区間存在数を取得できる。

## 実装上の注意

- K=0 では異なる整数間に辺がない。削除前後の predecessor-successor edge の復活と、挿入時の旧 edge 削除を順序立てる。

## 復習の核

- toggle 前後の三点 pred,x,succ を図示し、どの辺が消えどれが生えるか列挙する。graphの辺数ではなくcomponent境界を管理する。

## 計算量と制約

### 時間

前処理O(Q log Q)、各toggle・component queryO(log Q)。

### 空間

O(Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq Q \leq 2\times 10^5; 0 \leq K \leq 10^{18}; For each query, 1 \leq x \leq 10^{18}.; For each query of the second type, the given x is in S at that point.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc356/editorial/10114) — source-abc356-editorial-10114-385f9336c50f21621b2c24a6263eb1fdf7353153925b6727b637471e3e2e6dce
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc356/tasks/abc356_f) — source-abc356-f-problem-ff7fab795b8d9f8a7edcfcf4c31ab456e24710bdcf757f68dd9b2db4015b963a
