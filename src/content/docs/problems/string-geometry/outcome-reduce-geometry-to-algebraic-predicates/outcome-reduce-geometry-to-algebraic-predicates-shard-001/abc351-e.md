---
title: "ABC351-E — Jump Distance Sum"
draft: true
authoringUnit: {"problemId":"abc351-e","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc351-e.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-contribution-reordering"],"sourceRevisionIds":["source-abc351-e-problem-a298ef7244fa4a1ea123aa4d1d3434a2f4331859aa342b3f4d3bd12b576fde0f","source-abc351-editorial-9890-252c10a6f3108732a2cc331dac4102643e03c18803abef766d1c416cce70baf2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"斜めmoveはu=x+y,v=x−yの一軸±2moveになるためparity不一致は到達不能。同parityでは各軸を必要差分だけ動かせ、最短距離は(|Δu|+|Δv|)/2。各sorted軸で新値z_iの過去全値との絶対差はiz_i−prefix。両軸合計して2で割れば全到達可能unordered pair距離を一度数える。","sourceRevisionIds":["source-abc351-e-problem-a298ef7244fa4a1ea123aa4d1d3434a2f4331859aa342b3f4d3bd12b576fde0f","source-abc351-editorial-9890-252c10a6f3108732a2cc331dac4102643e03c18803abef766d1c416cce70baf2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

斜め四方向へ一歩動くたび x+y または x−y が2だけ変わる。u=x+y,v=x−y へ45度変換すると移動は二軸いずれかを±2する Manhattan 型になる。

x+y の parity が異なる二点間は到達不能で距離0。同 parity group 内では距離が (|Δu|+|Δv|)/2 となり、二軸の絶対値和を独立に数えられる。

採用する候補: 点を parity 別に分け、u=x+y と v=x−y の各一次元 pairwise absolute difference sum を sort と prefix sum で求め、2で割る。

到達可能性と距離式が変換後に分離し、N² 点対を四本の一次元走査へ圧縮できる。

棄却する候補: 各点対について BFS 的に最短ジャンプ数または座標差式を計算する。

一対の距離が O(1) でも N=2×10^5 の全 N² 対は列挙できない。

同 parity なら u,v も同 parity なので |Δu|+|Δv| は偶数で、最後の2除算は常に整数になる。

sorted z_0≤…≤z_{m−1} では z_i が過去との絶対値和へ i·z_i−prefix を寄与し、全対を一走査で数えられる。

各点を (x+y)%2 の二群に分け、それぞれ u=x+y 列と v=x−y 列を sort する。各列で prefix sum を持ち Σ_i(i z_i−prefix_i) を加算し、四列の合計を2で割る。

## 典型の発動条件

### 45度座標変換

発動条件: 斜め移動や max(|dx|,|dy|) 型距離が現れ、x±y で軸方向へ直せるとき。

u=x+y,v=x−y に写し、到達 parity と距離を Manhattan 成分へ分解する。

### 一次元絶対値総和

発動条件: 多数点の全 pair |z_i−z_j| を求めるとき。

sort 後に各要素の左側への寄与を prefix sum から計算する。

## 問題固有の要素

距離0の「到達不能」は座標変換前の parity invariant で先に分離しないと、異なる連結成分の差を誤加算する。

別の問題へ持ち帰る視点: 移動問題では距離公式の前に状態空間の連結成分を不変量で分類する。

## 正当性

斜めmoveはu=x+y,v=x−yの一軸±2moveになるためparity不一致は到達不能。同parityでは各軸を必要差分だけ動かせ、最短距離は(|Δu|+|Δv|)/2。各sorted軸で新値z_iの過去全値との絶対差はiz_i−prefix。両軸合計して2で割れば全到達可能unordered pair距離を一度数える。

## 実装上の注意

- v=x−y は負になり得るが通常の signed 64 bit で sort する。全点対距離和は 64 bit、合計後に2で割る。

## 復習の核

- x±y 変換後に一歩がどう動くかを書き、到達条件と距離の1/2を同時に導く。絶対値和は小さい sorted 列で寄与式を検算する。

## 計算量と制約

### 時間

O(N log N)。parityごとのu,vをsortしてprefix集計。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 0 \leq X_i, Y_i \leq 10^8; For i \neq j, (X_i, Y_i) \neq (X_j, Y_j); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc351/tasks/abc351_e) — source-abc351-e-problem-a298ef7244fa4a1ea123aa4d1d3434a2f4331859aa342b3f4d3bd12b576fde0f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc351/editorial/9890) — source-abc351-editorial-9890-252c10a6f3108732a2cc331dac4102643e03c18803abef766d1c416cce70baf2
