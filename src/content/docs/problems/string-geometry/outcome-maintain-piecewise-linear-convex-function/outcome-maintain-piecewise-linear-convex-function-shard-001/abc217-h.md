---
title: "ABC217-H — Snuketoon"
draft: true
authoringUnit: {"problemId":"abc217-h","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc217-h.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-slope-trick"],"sourceRevisionIds":["source-abc217-editorial-2581-5cfe6e31c3ff5d31da68a002a05248a0efb60b183ccd53f67b66edfeec1c8eef","source-abc217-h-problem-c9df3d72bfdd2c9dde80f0832a31542448dc4195a205a6a0c17f3f6dea3d0323"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"二heapのhinge表現でmax L≤min Rを保つとmが最小値である。左右の折れ点をΔだけ外へずらす操作は区間最小化と一致し、hingeの付替えは交差する二hingeの定数差をmへ戻す恒等式なので射撃DPを正確に更新する。初期関数(N+1)|x|では、原点以外の始点zの経路を原点へ平行移動することで、射撃総被害の増加高々N|z|より大きい初期penaltyを取り除ける。したがって最終最小値は原点始点に制限した元DPと一致する。移動後に射撃を加える順序で更新して得たmが答えとなる。","sourceRevisionIds":["source-abc217-editorial-2581-5cfe6e31c3ff5d31da68a002a05248a0efb60b183ccd53f67b66edfeec1c8eef","source-abc217-h-problem-c9df3d72bfdd2c9dde80f0832a31542448dc4195a205a6a0c17f3f6dea3d0323"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

時刻Tの位置xにいる最小累積被害をf(x)とする。時刻差Δではmin_{|y−x|≤Δ}f(y)へ更新し、射撃D=0なら(X−x)_+、D=1なら(x−X)_+を足す。座標を直接列挙するDPは10^9の値域が大きすぎるが、これらの操作は凸区分線形性を保ち、射撃一つで折れ点が一つ増えるだけである。

表現をf(x)=m+Σ_{l∈L}(l−x)_++Σ_{r∈R}(x−r)_+、max L≤min Rとする。Lは最大heap、Rは最小heapに持つ。mが関数の最小値で、最小区間は[max L,min R]。移動の区間最小化は全lを−Δ、全rを+Δする操作だから、二heapのoffsetだけを更新する。

右hinge(x−a)_+を加える時は、l=max Lを読み、m+=max(0,l−a)。Lへaを挿入して最大値を一つ取り出し、Rへ移す。左hinge(a−x)_+ならr=min Rを読み、m+=max(0,a−r)、Rへaを挿入して最小値を一つLへ移す。この付替えがmax L≤min Rを保ち、交差した二hingeの間の高さをmへ加える。

初期位置0の制約を、空heapで定数0と初期化してはいけない。ここではH=N+1としてf_0(x)=H|x|を使い、L,Rそれぞれへ0をH個、m=0から始める。これは初期位置違反への有限penaltyだが最小被害は元の問題と同じになる。始点zの経路を丸ごと−z平行移動すると原点始点の合法経路になり、N個の射撃被害の増加は高々N|z|。初期penalty H|z|の方が大きいので、z≠0から始めても最終最小値を改善できない。

全射撃について、時刻差でoffsetを広げ、射撃向きに応じたhingeを加える。最後のmを答える。例えば最初の射撃がT=1,D=0,X=3なら、原点から右へ1までしか動けないので被害2。原点の折れ点を忘れると最初から3にいることを許して0になる。各段は定数個のheap操作だけで、時刻差には比例しない。

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

二heapのhinge表現でmax L≤min Rを保つとmが最小値である。左右の折れ点をΔだけ外へずらす操作は区間最小化と一致し、hingeの付替えは交差する二hingeの定数差をmへ戻す恒等式なので射撃DPを正確に更新する。初期関数(N+1)|x|では、原点以外の始点zの経路を原点へ平行移動することで、射撃総被害の増加高々N|z|より大きい初期penaltyを取り除ける。したがって最終最小値は原点始点に制限した元DPと一致する。移動後に射撃を加える順序で更新して得たmが答えとなる。

## 実装上の注意

- 各heapの格納座標は実座標からoffsetを引く。反対heapへ移す時は、元offsetを足してから移動先offsetを引く。
- 初期に両heapへ0をN+1個入れる。空heapによる自由な初期位置を許さない。座標offsetと最小値mは64bitで保持する。

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
