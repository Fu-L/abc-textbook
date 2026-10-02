---
title: "ABC265-F — Manhattan Cafe"
draft: true
authoringUnit: {"problemId":"abc265-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc265-f.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc265-f-problem-c6b77bc325b288f3569ccda1bcbe0cb7350d67c1e0f56c3511104dfac712e57b","source-abc265-editorial-4680-0bbdbb3200c34e8acb881cfadc8bfc252fd0b57bdc73888428aa846296363ee6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各座標の寄与は(|x−p_i|,|x−q_i|)で、全体の二つの距離はそれぞれの和である。座標を一つずつ加える二次元DPは、独立な整数xの選択をその寄与へ分類して数える。p_iとq_iの間では二距離の和が一定、外では二距離が同時に増えるので、遷移先は斜めの連続区間になる。斜め方向の差分・累積和は同じ全xの和を計算するだけなので数え方を変えず、最後に両距離D以下の全状態を足せばよい。","sourceRevisionIds":["source-abc265-f-problem-c6b77bc325b288f3569ccda1bcbe0cb7350d67c1e0f56c3511104dfac712e57b","source-abc265-editorial-4680-0bbdbb3200c34e8acb881cfadc8bfc252fd0b57bdc73888428aa846296363ee6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

軸ごとの絶対値距離は加法的なので、先頭t軸までのp距離i・q距離jだけを状態にして座標を順に決められる。

一軸でs=|p_t−q_t|とすると、増分pair (|p_t−r_t|,|q_t−r_t|) は和がsの有限線分と、差が±sの二本の半直線に並ぶ。

棄却する候補: 各dp距離pairから取り得るr_tを全て列挙して次層へ加算する。

各状態から距離上限D個程度の候補があり、二次元状態との積が大きすぎる。

採用する候補: 前層dpの二種類の対角方向へ累積和を作り、三本の増分集合から各次状態へ入る総和を定数回の区間差で求める。

座標候補の連続列がdp表上でも対角線区間になり、遷移先ごとの全候補走査をrange sumへ置き換えられる。

p_tとq_tの間にあるr_tは (s,0),(s−1,1),…,(0,s)、外側は (s＋k,k) と (k,s＋k) (k≥1) を一度ずつ作る。

中央線分と二半直線の端点を重複させず、距離がDを超える部分を切れば、各格子点の遷移係数は正確に1になる。

separable L1-ball intersection countingをdistance-pair DPにし、一軸transition kernelの三本のdiagonal supportをprefix sumsで高速畳み込みする。

## 典型の発動条件

### 距離和を状態にする次元DP

発動条件: 高次元の距離が軸ごとの寄与和で、総距離上限が小さいとき。

処理済み軸数と二つの累積距離を状態にし、各軸の距離pairを加える。

### 対角累積和によるDP遷移

発動条件: 二次元DPの遷移元が一定和・一定差の直線区間に並ぶとき。

必要な斜め方向ごとにprefix sumを作り、線分上の和を両端差で得る。

## 問題固有の要素

一軸の整数rはpとqの間・p側外部・q側外部の三領域へ分けると、距離pairの重複しない三直線として記述できる。

別の問題へ持ち帰る視点: 絶対値二つを含む遷移は、基準点の大小順で数直線を分割して線形式へ変える。

## 正当性

各座標の寄与は(|x−p_i|,|x−q_i|)で、全体の二つの距離はそれぞれの和である。座標を一つずつ加える二次元DPは、独立な整数xの選択をその寄与へ分類して数える。p_iとq_iの間では二距離の和が一定、外では二距離が同時に増えるので、遷移先は斜めの連続区間になる。斜め方向の差分・累積和は同じ全xの和を計算するだけなので数え方を変えず、最後に両距離D以下の全状態を足せばよい。

## 実装上の注意

- 中央線分にk=0の両端を含め、二つの外側半直線はk=1から始めて同じr_tを二重計上しない。
- 各層で距離添字0…Dだけを保持し、対角区間の端を盤面境界でclipして法998244353で差を正規化する。

## 復習の核

- 絶対値距離の多次元問題は、各軸の寄与pairが状態平面上でどんな幾何図形を作るか描く。
- DP遷移候補が直線上へ密に並ぶなら、その方向の累積和を追加して一括取得する。

## 計算量と制約

### 時間

O(ND²)、二距離tableへの対角prefix遷移。

### 空間

O(D²)、一軸ずつrolling。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 100; 0 \leq D \leq 1000; -1000 \leq p_i, q_i \leq 1000; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/tasks/abc265_f) — source-abc265-f-problem-c6b77bc325b288f3569ccda1bcbe0cb7350d67c1e0f56c3511104dfac712e57b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/editorial/4680) — source-abc265-editorial-4680-0bbdbb3200c34e8acb881cfadc8bfc252fd0b57bdc73888428aa846296363ee6
