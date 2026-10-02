---
title: "ABC296-G — Polygon and Points"
draft: true
authoringUnit: {"problemId":"abc296-g","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc296-g.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-event-sweep"],"sourceRevisionIds":["source-abc296-editorial-6070-b5928528038187f1b949dfb21f42a524e70864b1ac6f8ee5a13996ec0cb4556d","source-abc296-g-problem-d9afff8c741acc3edb639a2230ca8b48afa26b9f844da97b64b74fb6f9cd2e3b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"strict convex polygonの各x断面は空か一つの閉区間で、端点は上下chainの該当辺にある。x昇順sweepのpointerはその辺を一意に特定する。外積が0で辺範囲内ならON、上下の内側ならIN、それ以外OUT。縦端辺と左右端を別処理すれば断面が縮む境界も含めて全点を正しく分類する。","sourceRevisionIds":["source-abc296-editorial-6070-b5928528038187f1b949dfb21f42a524e70864b1ac6f8ee5a13996ec0cb4556d","source-abc296-g-problem-d9afff8c741acc3edb639a2230ca8b48afa26b9f844da97b64b74fb6f9cd2e3b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

凸多角形をx方向に走査すると、固定xで内部を挟む境界は上側chainと下側chainの高々二辺だけである。

採用する候補: 頂点と質問点をx順に処理する平面走査

上下chainの現在辺を単調に進め、外積で境界・内部・外部を整数判定できる。

棄却する候補: 各点に全N辺の半平面判定

O(NQ)で最大4×10^10になる。

厳密凸かつCCWなので左右端間の上下境界はxに対し単調chainとなり、質問xを含む辺をpointerで特定できる。

左右端でpolygonを上下二chainへ分け、質問をx順にsortして各chainの辺pointerを進める。点と上下辺の外積符号を調べ、辺上ならON、間ならIN、外ならOUTとする。

## 典型の発動条件

### 凸多角形の単調chain

発動条件: 凸境界を一軸方向の上下包絡線として扱う。

左右端間の二chainへ分解する。

### offline平面走査

発動条件: 多数点のxが任意順で、対象辺が単調に変わる。

点をsortしedge pointerを共有する。

## 問題固有の要素

点包含に全辺は不要で、同じx断面を挟む二境界だけ比較すればよい。

別の問題へ持ち帰る視点: 凸集合の点包含は一方向断面と包絡線へ落とせる。

## 正当性

strict convex polygonの各x断面は空か一つの閉区間で、端点は上下chainの該当辺にある。x昇順sweepのpointerはその辺を一意に特定する。外積が0で辺範囲内ならON、上下の内側ならIN、それ以外OUT。縦端辺と左右端を別処理すれば断面が縮む境界も含めて全点を正しく分類する。

## 実装上の注意

- 縦辺・左右端と頂点上を先に扱い、外積は64ビット超の可能性を見て128ビットを使う。

## 復習の核

- O(N)半平面判定と比較し、頂点・縦辺・上下辺上、左右端と同じx、外側を確認する。

## 計算量と制約

### 時間

O(N+Q log Q)。queryをx順sortし上下chainをsweep。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 2\times 10^5; 1 \leq Q \leq 2\times 10^5; -10^9 \leq X_i,Y_i,A_i,B_i \leq 10^9; S is a strictly convex N-gon. That is, its interior angles are all less than 180 degrees.; (X_1,Y_1),\ldots,(X_N,Y_N) are the vertices of S in counter-clockwise order.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc296/editorial/6070) — source-abc296-editorial-6070-b5928528038187f1b949dfb21f42a524e70864b1ac6f8ee5a13996ec0cb4556d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc296/tasks/abc296_g) — source-abc296-g-problem-d9afff8c741acc3edb639a2230ca8b48afa26b9f844da97b64b74fb6f9cd2e3b
