---
title: "ABC472 F — Centroid of a Slice"
draft: true
authoringUnit: {"problemId":"abc472-f","docPath":"src/content/docs/problems/updates/abc472-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc472-f-problem-7e31dbedfaf6d1a51ca2f83122e25b610b523e8575a5abfa7d1cf400193b5ba2","source-abc472-editorial-24789-eabfdcdba235c31591c4711eecff145d778964b5f996445b024391bb139d4845"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"符号付き三角形の面積と一次モーメントは加法的で、原点が多角形外でも向き付き分解の相殺により多角形全体の値になる。境界区間と閉鎖弦を足す式は切断多角形の全辺を一度ずつ含む。面積に対するモーメントの比が一様板の重心である。","sourceRevisionIds":["source-abc472-f-problem-7e31dbedfaf6d1a51ca2f83122e25b610b523e8575a5abfa7d1cf400193b5ba2","source-abc472-editorial-24789-eabfdcdba235c31591c4711eecff145d778964b5f996445b024391bb139d4845"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

## 考察

重心は頂点の座標平均ではない。面積で重みづけした一次モーメントを使う。原点Oと境界辺(P_i,P_{i+1})で作る符号付き三角形について、面積の2倍は cross(P_i,P_{i+1})。重心が(P_i+P_{i+1})/3なので、一次モーメントの6倍は (P_i+P_{i+1})cross(P_i,P_{i+1})。

切断後の多角形は、反時計回り境界の一つの連続区間と、それを閉じる弦からなる。配列を二周分へ伸ばし、境界辺のcrossとx,yモーメントをそれぞれ累積和にする。u→vの右側は、反時計回り境界をuからvへ進む側なので、uを始点にvが後へ来るようvの添字を必要ならN増やす。辺u,…,v−1の和に閉鎖辺v→uの寄与を足す。

得た面積2倍をA2、モーメント6倍をMx6,My6とすると、重心は (Mx6/(3A2),My6/(3A2))。途中を浮動小数点にすると大きな累積量の差で桁落ちしやすいので、crossとモーメントの集計・差分は整数で行い、最後だけ実数へ変える。実装を一般座標へ転用するなら128 bitで中間積を保つと境界評価が単純になる。

## 典型の発動条件

平均座標ではなく、加法的な面積とモーメントを保つ。多角形の連続境界問い合わせは閉鎖弦の寄与を加えた累積和で処理できる。

## 問題固有の要素

弦の向きで求める側が変わる。境界の選択と閉鎖辺の方向を一組として扱う。

## 正当性

符号付き三角形の面積と一次モーメントは加法的で、原点が多角形外でも向き付き分解の相殺により多角形全体の値になる。境界区間と閉鎖弦を足す式は切断多角形の全辺を一度ずつ含む。面積に対するモーメントの比が一様板の重心である。

## 実装上の注意

厳密凸かつ非隣接頂点なので選ぶ領域の面積は正。整数集計後に除算し、必要な出力精度を確保する。

## 復習の核

重心は重み付き平均。分子と分母を別々に加法的な量へ変えてから、最後に割る。

## 計算量と制約

### 時間

前計算 O(N)、各質問 O(1)、全体 O(N+Q)。

### 空間

二周分の三つの累積和 O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 4 \leq N \leq 3 \times 10^4; 1 \leq Q \leq 2 \times 10^5; |x_i|,|y_i| \leq 5 \times 10^5; (x_1,y_1),(x_2,y_2),\dots,(x_N,y_N) form a convex polygon in counterclockwise order.; All interior angles of P are less than 180 degrees.; 1 \leq u_j,v_j \leq N; u_j \neq v_j; Vertices u_j and v_j are not adjacent on the boundary of P.; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc472/tasks/abc472_f)
- [公式解説](https://atcoder.jp/contests/abc472/editorial/24789)
