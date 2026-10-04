---
title: "ABC356-F — Distance Component Size Query"
draft: true
authoringUnit: {"problemId":"abc356-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc356-f.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-range-monoid-aggregation"],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset","tag-coordinate-compression","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc356-editorial-10114-385f9336c50f21621b2c24a6263eb1fdf7353153925b6727b637471e3e2e6dce","source-abc356-f-problem-ff7fab795b8d9f8a7edcfcf4c31ab456e24710bdcf757f68dd9b2db4015b963a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"閾値graphの成分は、ソート順で隣り合うgap≤Kの辺だけを残しても変わらない。B_iが0となるのは実successorとの間に切断がある位置だけで、inactive葉のB=1はANDの単位元として切断を作らない。query点の左側では最後の切断の次から、右側では最初の切断の左端頂点までが同じ成分である。その区間のA和はactive頂点数なので答えになる。toggleは挿入・削除のpredecessor/successor関係だけを更新すれば不変量を保つ。","sourceRevisionIds":["source-abc356-editorial-10114-385f9336c50f21621b2c24a6263eb1fdf7353153925b6727b637471e3e2e6dce","source-abc356-f-problem-ff7fab795b8d9f8a7edcfcf4c31ab456e24710bdcf757f68dd9b2db4015b963a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

active点を昇順に `s_0<…<s_{m−1}` と並べると、gapがK以下の隣接点を結ぶpathだけで、元の距離threshold graphと同じ連結成分になる。toggleで変わる隣接edgeは、挿入・削除する点の前後に限られる。

座標圧縮の各葉に `A_i=1` をactive点、0をinactive点として置く。active葉の `B_i` は実際のactive successorへのgapがK以下なら1、successorがないかgap>Kなら0とする。inactive葉は `A_i=0,B_i=1` とし、AND集約の単位元にする。node集約は `(Aの和, BのAND)`。

query点iでは、iより前の最後の `B=0` の次indexを左端、i以降で最初の `B=0` のindexを右端にする。その右端indexの頂点自体は切断edgeの左端なので成分に含む。該当rangeのAの和を返す。

採用する候補: 存在数と実successorへの接続flagを、sum/ANDのsegment treeで管理する。

inactive座標を探索の障害にせず、切断edgeの境界から成分を得られる。

棄却する候補: queryのたびにactive点を左右へ走査する。

一成分に多くの点がある場合、query一回で線形時間かかる。

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

閾値graphの成分は、ソート順で隣り合うgap≤Kの辺だけを残しても変わらない。B_iが0となるのは実successorとの間に切断がある位置だけで、inactive葉のB=1はANDの単位元として切断を作らない。query点の左側では最後の切断の次から、右側では最初の切断の左端頂点までが同じ成分である。その区間のA和はactive頂点数なので答えになる。toggleは挿入・削除のpredecessor/successor関係だけを更新すれば不変量を保つ。

## 実装上の注意

- query点はactiveである。`B=0` を切断edgeの左端に置くため、右境界の頂点は区間に含め、左境界では前成分側の端点を除く。
- toggleでは、旧predecessor-successorのedgeを外してから新しい隣接edgeを設定する。K=0でもこの順で扱う。

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
