---
title: "ABC275-G — Infinite Knapsack"
draft: true
authoringUnit: {"problemId":"abc275-g","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc275-g.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull"],"sourceRevisionIds":["source-abc275-editorial-5111-51c9acaf8a6c44d57dd0445da6d60dda5cc93d44ef12a3eabc0b55b292e8d731","source-abc275-g-problem-db4426d48142d9ee833f9447103bd7f71cfe0d09a8729b7542ca946e6029d37b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"総価値で重み・体積を割った比率は正規化点(A_i/C_i,B_i/C_i)の凸結合になる。逆に凸結合の係数は大きな個数で任意の精度まで近似できるので、極限問題の可達比率集合は凸包。両資源の容量が同じなら価値効率は1/max(x,y)、よってmax(x,y)を最小化する。支配された点は不要で下側Pareto凸包だけを見る。辺上ではmaxは二つの一次関数の最大だから、端点かx=yの交点で最小になる。これら全候補の最小値の逆数が求める極限。","sourceRevisionIds":["source-abc275-editorial-5111-51c9acaf8a6c44d57dd0445da6d60dda5cc93d44ef12a3eabc0b55b292e8d731","source-abc275-g-problem-db4426d48142d9ee833f9447103bd7f71cfe0d09a8729b7542ca946e6029d37b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

先に読む単元:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。

## 考察

X を大きくした極限では品物個数の整数丸めの影響が X に対して消え、各品物を非負実数個混ぜる連続最適化として密度を考えられる。

価値を 1 に正規化した点 (A_i/C_i,B_i/C_i) の凸結合 (x,y) に対し、価値 1 を運ぶ必要 level は max(x,y) である。

採用する候補: 正規化点の下側凸包を作り、各頂点と隣接辺上で max(x,y) の最小値を求め、その逆数を出力する。

混合比全体が凸包になり、左下から支配されない境界だけを線形に走査できる。

棄却する候補: 各品物単独の C_i/max(A_i,B_i) の最大値を選ぶ。

重さに強い品物と体積に強い品物を混ぜると両制約を均衡させ、どの単品より高い極限効率を得る場合がある。

正規化点の左下に別点または凸包線分がある点は、同じ価値で両資源を多く使うため最適解から除ける。

凸包辺上では x-y が混合率の一次関数なので、max(x,y) の最小は端点または x=y との交点で達成される。

各点を (A_i/C_i,B_i/C_i) に写し、単調鎖で下側の Pareto convex frontier を作る。全頂点と隣接線分について max 座標の最小値 ans を調べ、求める極限 1/ans を浮動小数で出力する。

## 典型の発動条件

### 連続緩和と密度正規化

発動条件: 容量を無限に拡大したときの価値/容量の極限を問われ、整数丸めが相対的に消えるとき。

価値 1 当たりの資源 vector に正規化し、非負混合を凸結合として扱う。

### 下側凸包による二目的最適化

発動条件: 2 資源を同時に小さくしたい線形混合問題で、目的が座標ごとに単調なとき。

支配点と凸包上方の点を捨て、下側境界の頂点・辺だけを調べる。

## 問題固有の要素

二つの同じ上限 X は、正規化資源点で L∞ norm=max(x,y) を最小化する問題になり、最良混合は下側凸包と対角線 x=y の関係で決まる。

別の問題へ持ち帰る視点: 複数容量が同一スケールで増える極限では、価値当たり資源 vector と適切な norm の最小化へ読み替える。

## 正当性

総価値で重み・体積を割った比率は正規化点(A_i/C_i,B_i/C_i)の凸結合になる。逆に凸結合の係数は大きな個数で任意の精度まで近似できるので、極限問題の可達比率集合は凸包。両資源の容量が同じなら価値効率は1/max(x,y)、よってmax(x,y)を最小化する。支配された点は不要で下側Pareto凸包だけを見る。辺上ではmaxは二つの一次関数の最大だから、端点かx=yの交点で最小になる。これら全候補の最小値の逆数が求める極限。

## 実装上の注意

- 同じ x 座標や重複・支配点を整理し、下側凸包の外積向きと collinear 点の残し方を一貫させる。
- 比 A_i/C_i と交点計算には long double 等を用い、最後まで精度を落とさない。

## 復習の核

- 一方が軽く大きい体積、他方が重く小さい体積の2点を描き、単品比較ではなく線分と x=y の交点を見る理由を説明する。

## 計算量と制約

### 時間

O(N log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times 10^5; 10^8\leq A_i,B_i,C_i \leq 10^9; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/editorial/5111) — source-abc275-editorial-5111-51c9acaf8a6c44d57dd0445da6d60dda5cc93d44ef12a3eabc0b55b292e8d731
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/tasks/abc275_g) — source-abc275-g-problem-db4426d48142d9ee833f9447103bd7f71cfe0d09a8729b7542ca946e6029d37b
