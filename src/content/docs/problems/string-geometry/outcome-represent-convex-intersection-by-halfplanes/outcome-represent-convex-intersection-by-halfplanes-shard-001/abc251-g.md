---
title: "ABC251-G — Intersection of Polygons"
draft: true
authoringUnit: {"problemId":"abc251-g","docPath":"src/content/docs/problems/string-geometry/outcome-represent-convex-intersection-by-halfplanes/outcome-represent-convex-intersection-by-halfplanes-shard-001/abc251-g.md","learningOutcomeIds":["outcome-represent-convex-intersection-by-halfplanes"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["半平面制約・凸領域の共通部分の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-half-plane-constraints"],"sourceRevisionIds":["source-abc251-editorial-3961-2a9bef4a1862573769c0974a139227410cfe23c0b17110582e5c2dd0790c3413","source-abc251-g-problem-ed1514ba44cff749adc79cbdfd6994026e15dfd7a7cc482f7ea929e03c45625c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"反時計回りの辺e_iとその始点p_iに対し、移動u_j後の内側はcross(e_i,z)≥cross(e_i,p_i+u_j)。全移動で左辺が共通なので、各方向で右辺の最大limit_iを残すことは不等式の論理積と同値。N方向全ての条件を満たす点が全多角形の共通部分にある。空の共通部分も特別な多角形構築なしで自動的に判定できる。","sourceRevisionIds":["source-abc251-editorial-3961-2a9bef4a1862573769c0974a139227410cfe23c0b17110582e5c2dd0790c3413","source-abc251-g-problem-ed1514ba44cff749adc79cbdfd6994026e15dfd7a7cc482f7ea929e03c45625c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [半平面制約・凸領域の共通部分](src/content/docs/learn/geometry-optimization/half-plane-constraints.md)

- 凸多角形を向き付き辺の線形半平面制約へ変換し、平行移動後も左辺が同じ制約を最強の右辺へ集約して共通部分への包含を判定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 半平面制約・凸領域の共通部分の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

凸多角形を平行移動しても各辺の向きと内向き半平面の法線は変わらず、変わるのは半平面境界の右辺定数だけである。

採用する候補: 辺ごとに全平行移動の最強半平面を前計算

共通のN方向それぞれで右辺の最大値を取れば、M個の多角形の共通部分をN個の不等式だけで表せる。

棄却する候補: 各質問点をM個全ての多角形へ点包含判定

質問ごとにN M個の辺判定が必要となり、最大制約では過大になる。

反時計回りの辺ベクトルq_iに対し、点zが平行移動後の内部にある条件はcross(q_i,z)がその移動後頂点のcross値以上であることと書ける。

全ての移動多角形に入るには各方向の全不等式を満たす必要があり、同じ左辺に対する右辺の最大値だけを残せる。

各辺iについてM個の平行移動後頂点との外積定数を計算し、その最大値limit[i]を保存する。各質問点zについて全iでcross(edge[i],z)≥limit[i]かを調べ、全て満たせばYesとする。

## 典型の発動条件

### 凸多角形の半平面表現

発動条件: 点包含や複数凸集合の共通部分を辺ごとの線形不等式で扱いたい。

反時計回り各辺の内側条件を外積不等式として表す。

### 同一左辺の制約集約

発動条件: 多数の制約が法線を共有し定数項だけ異なる。

右辺の最大値だけを残し、平行な半平面の論理積を一つへ縮約する。

## 問題固有の要素

平行移動族では辺方向が共通なので、M個の多角形の共通部分も元と同じN方向の半平面だけで表現できる。

別の問題へ持ち帰る視点: 変換後も係数が不変で定数だけ動く制約群は、方向ごとの最厳値へ畳み込める。

## 正当性

反時計回りの辺e_iとその始点p_iに対し、移動u_j後の内側はcross(e_i,z)≥cross(e_i,p_i+u_j)。全移動で左辺が共通なので、各方向で右辺の最大limit_iを残すことは不等式の論理積と同値。N方向全ての条件を満たす点が全多角形の共通部分にある。空の共通部分も特別な多角形構築なしで自動的に判定できる。

## 実装上の注意

- 座標差と平行移動を含む外積は64ビット整数で計算し、境界上は内部として等号を許す。頂点と対応する辺の向きを全箇所で統一する。

## 復習の核

- M=1、移動量0、共通部分の境界上、共通部分が空になる例で、全多角形への素朴な包含判定と比較する。

## 計算量と制約

### 時間

O(N(M+Q))。

### 空間

O(N)補助領域。入力を保持するならO(N+M+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 50; 1 \leq M \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; -10^8 \leq x_i, y_i \leq 10^8; -10^8 \leq u_i, v_i \leq 10^8; -10^8 \leq a_i, b_i \leq 10^8; All values in input are integers.; (x_1, y_1), (x_2, y_2), \ldots, (x_N, y_N) forms a convex N-gon in the counterclockwise order.; Each interior angle of the polygon P is less than 180 degrees.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/editorial/3961) — source-abc251-editorial-3961-2a9bef4a1862573769c0974a139227410cfe23c0b17110582e5c2dd0790c3413
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/tasks/abc251_g) — source-abc251-g-problem-ed1514ba44cff749adc79cbdfd6994026e15dfd7a7cc482f7ea929e03c45625c
