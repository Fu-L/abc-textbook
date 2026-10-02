---
title: "ABC231-H — Minimum Coloring"
draft: true
authoringUnit: {"problemId":"abc231-h","docPath":"src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc231-h.md","learningOutcomeIds":["outcome-model-min-cost-flow"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut","unit-weighted-shortest-path"],"excludedTopics":["最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-cost-flow"],"sourceRevisionIds":["source-abc231-editorial-3060-dbef394c0980a57c2674c27645e1d1d98f3c5367f8da315fbf04ba22bf450948","source-abc231-h-problem-b7f4c99f6cc5b222f9af3d5af4695b2d525c0f188af41616f45bd49c5bf90baf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全頂点の最安辺費用sumを基準に、両端を一本で共有して覆う辺の差分はw−min_u−min_v。共有辺は重複端点をなくしても最安補完で悪化しないためmatchingへ正規化できる。任意濃度の最小差分matchingを足すと全辺cover最小を得る。shift後費用はkBIGを引いて比較する。","sourceRevisionIds":["source-abc231-editorial-3060-dbef394c0980a57c2674c27645e1d1d98f3c5367f8da315fbf04ba22bf450948","source-abc231-h-problem-b7f4c99f6cc5b222f9af3d5af4695b2d525c0f188af41616f45bd49c5bf90baf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

行を左頂点、列を右頂点、駒をそのマスのコストを持つ辺とすると、各行・各列に黒駒を置く条件は全頂点を覆う重み付き辺被覆である。 各頂点 v で最安の接続辺コスト C_v を払う基準から始め、一本の辺で両端を同時に覆う選択による費用差を考えられる。 共有辺集合 E₁ の端点が重複するなら一方を E₁ から外しても残りの最安辺補完で費用は増えないため、最適な E₁ はマッチングとしてよい。 差分辺には負費用があり得るので、BIG を足した非負費用で流量別最小費用 P_i を求め、min_i(P_i−i×BIG) を取る。

棄却する候補: 各行と各列で最安の駒を独立に黒くし、重複した駒だけを一つにまとめる。

少し高い一本で行と列を同時に覆う方が、二つの独立最安辺を選ぶより安い場合を最適化できない。

採用する候補: 基準費用 ΣC_v から、辺 e=(u,v) を共有利用する差分 c(e)−C_u−C_v の任意サイズ最小重みマッチングを引き出し、最小費用流で求める。

共有利用する辺は端点を重ねず選べるためマッチングになり、残り頂点は各自の最安辺で必ず覆える。

共有辺集合 E₁ の端点が重複するなら一方を E₁ から外しても残りの最安辺補完で費用は増えないため、最適な E₁ はマッチングとしてよい。

差分辺には負費用があり得るので、BIG を足した非負費用で流量別最小費用 P_i を求め、min_i(P_i−i×BIG) を取る。

二部グラフの最小重み辺被覆を頂点別最安値の定数項と任意濃度の差分マッチングへ分解し、費用シフト付き min-cost-flow slope で最適濃度まで選ぶ。

## 典型の発動条件

### 重み付き辺被覆からマッチングへの変換

発動条件: 全頂点を少なくとも一本の選択辺で覆い、一本が両端の要求を同時に満たすとき。

頂点ごとの最安辺を基準にし、両端を共有して得る差分を端点非共有の辺集合として最適化する。

### 任意流量の最小費用流

発動条件: マッチングの選択辺数が固定されず、負の差分を持つ辺だけ有利な範囲で選びたいとき。

費用を BIG で非負化し、流量別費用曲線からシフトを戻した最小値を取る。

## 問題固有の要素

「各行・列で最安を選ぶ」解を捨てるのでなく、それを定数基準として一本で二要求を兼ねる節約額だけをマッチングへ載せる。

別の問題へ持ち帰る視点: 被覆最適化では各要求の独立最安解を基準にし、共有による相互作用を差分問題として抽出すると構造が単純になる。

## 正当性

全頂点の最安辺費用sumを基準に、両端を一本で共有して覆う辺の差分はw−min_u−min_v。共有辺は重複端点をなくしても最安補完で悪化しないためmatchingへ正規化できる。任意濃度の最小差分matchingを足すと全辺cover最小を得る。shift後費用はkBIGを引いて比較する。

## 実装上の注意

- 各行・列に少なくとも一駒ある保証を使って C_v を初期化し、基準和と費用差は 64 bit 整数で保持する。
- BIG は全差分辺を非負にする十分な値とし、slope の各流量区間について BIG×流量を引いた値を比較する。

## 復習の核

- 行と列を同時に満たす選択は二部グラフの辺被覆だと認識し、独立最安からの共有効果を数式化する。
- マッチング本数が固定されない場合、負費用辺を無理に全て選ばず、流量ごとの費用曲線から停止点を選ぶ。

## 計算量と制約

### 時間

行H列W、駒N、V=H+W+2,E=O(N+H+W)、最大matchingK≤min(H,W)。potential flow O(K E log V)。

### 空間

network、頂点最安値 O(N+H+W)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W \leq 10^3; 1 \leq N \leq 10^3; 1 \leq A_i \leq H; 1 \leq B_i \leq W; 1 \leq C_i \leq 10^9; All pairs (A_i,B_i) are distinct.; There is at least one white piece in every row and every column.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/editorial/3060) — source-abc231-editorial-3060-dbef394c0980a57c2674c27645e1d1d98f3c5367f8da315fbf04ba22bf450948
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/tasks/abc231_h) — source-abc231-h-problem-b7f4c99f6cc5b222f9af3d5af4695b2d525c0f188af41616f45bd49c5bf90baf
