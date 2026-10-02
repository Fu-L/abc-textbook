---
title: "ABC263-EX — Intersection 2"
draft: true
authoringUnit: {"problemId":"abc263-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001/abc263-ex.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-cyclic-order-crossing","unit-event-sweep","unit-geometry-primitives","unit-weighted-prefix-fenwick"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-cyclic-order-crossing","tag-event-sweep","tag-fenwick-weighted-prefix","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc263-ex-problem-543b610b58a83ab8fcc49166621729ab3c9bf7cfd405b3b5859683cf177be57e","source-abc263-editorial-4547-ab6351f9ba6f38bd467d4a0c42d90e514bf944d17b5b4e6d7e5997527f0df228"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"円周を一点で切って端点へ順位を付けると、二弦が交差する条件は L_i<L_j<R_i<R_j またはその対称形になる。 区間を R の昇順に処理し、既処理区間の開区間 (L,R) へ加算して現在の L を一点照会すれば、交互配置の各組を一度数えられる。 平面内の交点判定を円周上の一次元区間交差へ移せ、各半径の交点対数を直線対列挙なしで得られる。","sourceRevisionIds":["source-abc263-ex-problem-543b610b58a83ab8fcc49166621729ab3c9bf7cfd405b3b5859683cf177be57e","source-abc263-editorial-4547-ab6351f9ba6f38bd467d4a0c42d90e514bf944d17b5b4e6d7e5997527f0df228"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [円環順序・chord交差](src/content/docs/learn/geometry-optimization/cyclic-order-crossing.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

半径 r 以内の交点数は r に対して単調非減少なので、K 番目の距離を答え二分探索できる。

円を横切る各直線を円内の弦とみなすと、二直線の交点が円内にあることは二弦の端点が円周上で交互に並ぶことと同値である。

棄却する候補: 全ての直線対の交点座標と原点距離を計算し、K番目を選ぶ。

交点が約 N^2 個あり、N=5万では列挙も保存もできない。

採用する候補: 半径 r の円との各直線の二交点を偏角順に並べ、各弦を区間 [L_i,R_i] として端点交互配置の組数を BIT で数える判定を二分探索する。

平面内の交点判定を円周上の一次元区間交差へ移せ、各半径の交点対数を直線対列挙なしで得られる。

円周を一点で切って端点へ順位を付けると、二弦が交差する条件は L_i<L_j<R_i<R_j またはその対称形になる。

区間を R の昇順に処理し、既処理区間の開区間 (L,R) へ加算して現在の L を一点照会すれば、交互配置の各組を一度数えられる。

geometric order statistic を parametric counting にし、line-circle dualization で chord intersection、さらに circular order の interval crossing count へ段階的に落とす。

## 典型の発動条件

### 幾何量の答え二分探索

発動条件: 距離などのK番目を直接列挙できず、閾値以内の対象数を高速に数えられるとき。

半径 r 内の交点対数が K 以上かを判定して境界を絞る。

### 円内直線交点の弦交差化

発動条件: 多数の直線対について共通の凸領域内で交わるかを数えたいとき。

各直線と境界円の二交点を弦端点とし、端点の円周順が交互かを判定する。

### 端点交互区間のBIT数え上げ

発動条件: L_i<L_j<R_i<R_j 型の区間対を数えるとき。

右端順に sweep し、過去区間の内部をrange add、現在左端をpoint queryする。

## 問題固有の要素

原点からの距離が r より大きい直線は円と交わらず、その直線が作る交点は円内に存在しないため判定から除外できる。

別の問題へ持ち帰る視点: 境界との交点を使う幾何変換では、対象領域を通過しないオブジェクトを先に除く。

## 正当性

円周を一点で切って端点へ順位を付けると、二弦が交差する条件は L_i<L_j<R_i<R_j またはその対称形になる。 区間を R の昇順に処理し、既処理区間の開区間 (L,R) へ加算して現在の L を一点照会すれば、交互配置の各組を一度数えられる。 平面内の交点判定を円周上の一次元区間交差へ移せ、各半径の交点対数を直線対列挙なしで得られる。

## 実装上の注意

- 二分探索上限は係数範囲とCramerの公式から全交点距離を覆う値にし、許容誤差に十分な反復回数を取る。
- 円との交点と偏角の計算は long double などで行い、弦端点の二つの順位を小さい順に L,R とする。

## 復習の核

- 多数の交点の距離順位は、交点を作るのでなく固定領域内に何対あるかを数える判定へ変える。
- 凸領域を横切る線分同士の交差は、境界上の端点順序だけで判定できることを利用する。

## 計算量と制約

### 時間

O(I·N log N)、Iは実数二分探索回数、N直線、各半径判定で端点sortと交差数。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 7 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 5 \times 10^4; 1 \le K \le \frac{N(N-1)}{2}; -1000 \le |A_i|,|B_i|,|C_i| \le 1000(1 \le i \le N); No two of the lines are parallel.; A_i \neq 0 or B_i \neq 0(1 \le i \le N).; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/tasks/abc263_h) — source-abc263-ex-problem-543b610b58a83ab8fcc49166621729ab3c9bf7cfd405b3b5859683cf177be57e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/editorial/4547) — source-abc263-editorial-4547-ab6351f9ba6f38bd467d4a0c42d90e514bf944d17b5b4e6d7e5997527f0df228
