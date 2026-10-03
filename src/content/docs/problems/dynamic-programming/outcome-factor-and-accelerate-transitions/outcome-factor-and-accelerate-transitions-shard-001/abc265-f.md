---
title: "ABC265-F — Manhattan Cafe"
draft: true
authoringUnit: {"problemId":"abc265-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc265-f.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc265-f-problem-c6b77bc325b288f3569ccda1bcbe0cb7350d67c1e0f56c3511104dfac712e57b","source-abc265-editorial-4680-0bbdbb3200c34e8acb881cfadc8bfc252fd0b57bdc73888428aa846296363ee6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一軸の全整数座標はp_tとq_tの間、左外側、右外側に一意に分かれ、それぞれ中央線分と二本の半直線の距離増分を作る。中央線分の有効範囲をlo,hiで切った反対角累積和と、k≥1の二本を主対角累積和で足す式は、全ての座標選択をその重複度通りに数える。s=0の同じ増分二項も左右の異なる座標を表すので必要である。初期値は空の座標選択一通りで、非負距離によりD超過状態を捨てられる。軸数について帰納すると、終層の距離上限内の全状態の和が求める点の個数になる。","sourceRevisionIds":["source-abc265-f-problem-c6b77bc325b288f3569ccda1bcbe0cb7350d67c1e0f56c3511104dfac712e57b","source-abc265-editorial-4680-0bbdbb3200c34e8acb881cfadc8bfc252fd0b57bdc73888428aa846296363ee6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

軸ごとの絶対値距離は加法的なので、先頭t軸までのp距離i・q距離jだけを状態にする。dp[i][j]をその座標選択数とし、初期値dp[0][0]=1、その他0、常に0≤i,j≤Dに切る。

一軸でs=|p_t−q_t|とすると、座標r_tによる増分は中央の(s,0),(s−1,1),…,(0,s)と、外側の(s+k,k),(k,s+k)（k≥1）になる。各状態から全座標を列挙するとO(ND³)。遷移先から見ると前層の対角線区間の和になるので、二方向の累積和でO(ND²)へ落とす。

主対角の累積和P[u][v]=dp[u][v]+P[u−1][v−1]、反対角の累積和Q[u][v]=dp[u][v]+Q[u−1][v+1]を作る。Pはu,vを増やす順、Qはuを増やす順で計算する。表の外は0とするが、区間端点は必ず有効な領域へ切る。

次状態(i,j)への中央線分の寄与はΣ_{a=0}^s dp[i−a][j−s+a]。有効なaの範囲をlo=max(0,s−j)、hi=min(s,i)として、lo≤hiなら

Q[i−lo][j−s+lo]−Q[i−hi−1][j−s+hi+1]

になる。lo>hiなら0。外側二本の寄与はそれぞれ

P[i−s−1][j−1]、P[i−1][j−s−1]

である。三項を加えて次層に書き、全軸を処理した後のΣ_{0≤i,j≤D}dp[i][j]を返す。計算は法998244353上で行う。

中央の端点を外側へ含めないためk≥1とする。s=0では外側二本の増分が一致するが、p_tの左と右の異なる二座標に対応するので、両方を加える。距離は軸を追加して減らないため、Dを超える状態を捨てても回答へ戻ることはない。

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

一軸の全整数座標はp_tとq_tの間、左外側、右外側に一意に分かれ、それぞれ中央線分と二本の半直線の距離増分を作る。中央線分の有効範囲をlo,hiで切った反対角累積和と、k≥1の二本を主対角累積和で足す式は、全ての座標選択をその重複度通りに数える。s=0の同じ増分二項も左右の異なる座標を表すので必要である。初期値は空の座標選択一通りで、非負距離によりD超過状態を捨てられる。軸数について帰納すると、終層の距離上限内の全状態の和が求める点の個数になる。

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
