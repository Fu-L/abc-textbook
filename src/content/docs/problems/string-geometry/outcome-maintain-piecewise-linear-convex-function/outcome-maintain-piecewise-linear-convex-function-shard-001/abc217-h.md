---
title: "ABC217-H — Snuketoon"
draft: true
authoringUnit: {"problemId":"abc217-h","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc217-h.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-slope-trick"],"sourceRevisionIds":["source-abc217-editorial-2581-5cfe6e31c3ff5d31da68a002a05248a0efb60b183ccd53f67b66edfeec1c8eef","source-abc217-h-problem-c9df3d72bfdd2c9dde80f0832a31542448dc4195a205a6a0c17f3f6dea3d0323"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"時刻tで位置xにいる最小累積被害をf_t(x)とする。速度制約の下で次の移動更新は区間[x−Δt,x+Δt]で前の凸関数を最小化する操作となる。凸関数の減少側・増加側の折れ点をそれぞれ左右へΔtずらすと、この区間最小化を正確に表せる。射撃被害は向きに応じた片側hingeであり、傾きに一段の変化を加えるだけである。二つのheapとoffsetはこれらの折れ点と現在の最小値を保持するので、移動してからhingeを加える順序を守ればDPの帰納法が成立する。初期位置0以外を有限費用にしてはならない。","sourceRevisionIds":["source-abc217-editorial-2581-5cfe6e31c3ff5d31da68a002a05248a0efb60b183ccd53f67b66edfeec1c8eef","source-abc217-h-problem-c9df3d72bfdd2c9dde80f0832a31542448dc4195a205a6a0c17f3f6dea3d0323"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)

対象外:

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

時刻 T_i の位置 x を状態とする素朴な DP では、前時刻から距離 ΔT 以内の全位置の最小値に、左からの射撃なら max(0,X_i-x)、右からなら max(0,x-X_i) を加える。しかし座標と時刻は 10^9 まであり、位置を列挙できない。

初期コスト、距離 ΔT 以内から取る区間最小、片側だけ傾き1の被害関数はいずれも凸性を保つため、各時刻の DP は少数の折れ点で表せる凸区分線形関数になる。

採用する候補: DP の値を全位置に展開せず、凸関数の左右の折れ点を二つの priority queue と offset で管理する Slope Trick を用いる。

移動可能幅による min-plus 更新は最小区間を左右へ ΔT だけ広げる操作、射撃被害は hinge 関数を一つ足す操作として、折れ点だけを更新できる。

棄却する候補: 各整数時刻・各到達可能座標について遷移元区間の最小値を計算する。

到達位置の幅が最大 T_i に比例し、最適化しても 10^9 規模の状態を保持できない。

移動更新 min_{|y-x|≤ΔT} f(y) は凸関数の最小値を取る区間を左へ ΔT、右へ ΔT だけ広げ、関数値の最小値自体は変えない。

D_i=0 の被害は (X_i-x)_+、D_i=1 の被害は (x-X_i)_+ であり、Slope Trick の片側 hinge 追加にそのまま対応する。

f_0 は x=0 だけが有限な凸関数として初期化する。射撃ごとに前時刻との差 ΔT を使って左右 heap の座標 offset を広げ、D_i に応じた hinge を X_i に追加し、最後に保持した最小値を答える。

## 典型の発動条件

### Slope Trick

発動条件: 最小化 DP の状態が一次元座標で、遷移が凸区分線形関数への hinge 加算や区間 min-plus 畳み込みとして書けるとき。

関数全体ではなく傾きが変わる位置を左右 heap に持ち、最小値と折れ点を更新する。

### 到達可能距離の min-plus 更新

発動条件: 速度制限により次状態 x の遷移元が |y-x|≤d の区間になるとき。

凸関数の minimizer interval を d だけ拡張する shift 操作へ置き換える。

## 問題固有の要素

射撃方向の違いは別々の DP を作るのではなく、同じ凸関数へ左右どちらの hinge を加えるかだけの違いになる。

別の問題へ持ち帰る視点: 片側でだけ線形に増える罰則を見たら max(0,a-x) または max(0,x-a) と書き、凸関数更新の部品へ分解する。

## 正当性

時刻tで位置xにいる最小累積被害をf_t(x)とする。速度制約の下で次の移動更新は区間[x−Δt,x+Δt]で前の凸関数を最小化する操作となる。凸関数の減少側・増加側の折れ点をそれぞれ左右へΔtずらすと、この区間最小化を正確に表せる。射撃被害は向きに応じた片側hingeであり、傾きに一段の変化を加えるだけである。二つのheapとoffsetはこれらの折れ点と現在の最小値を保持するので、移動してからhingeを加える順序を守ればDPの帰納法が成立する。初期位置0以外を有限費用にしてはならない。

## 実装上の注意

- 左右 heap に保存する実座標と遅延 offset の符号を混同しない。T_i-T_{i-1} で両側を広げてから当該射撃の hinge を加え、答えと座標には 64 bit 整数を使う。

## 復習の核

- heap 操作を暗記する前に、V字関数へ「距離1以内からの最小」を施した図を描き、最小区間だけが左右へ広がることを再導出する。

## 計算量と制約

### 時間

各射撃で定数個のheap操作と座標offset更新を行い O(N log(N+1))。時刻・座標の幅には比例しない。

### 空間

各射撃が追加する折れ点と初期条件を表すheap要素で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq T_1 \lt T_2 \lt \dots \lt T_N \leq 10^9; D_i (1 \leq i \leq N) is 0 or 1.; -10^9 \leq X_i \leq 10^9 (1 \leq i \leq N); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc217/editorial/2581) — source-abc217-editorial-2581-5cfe6e31c3ff5d31da68a002a05248a0efb60b183ccd53f67b66edfeec1c8eef
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc217/tasks/abc217_h) — source-abc217-h-problem-c9df3d72bfdd2c9dde80f0832a31542448dc4195a205a6a0c17f3f6dea3d0323
