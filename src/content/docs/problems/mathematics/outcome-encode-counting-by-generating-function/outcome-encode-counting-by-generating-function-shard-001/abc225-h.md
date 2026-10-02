---
title: "ABC225-H — Social Distance 2"
draft: true
authoringUnit: {"problemId":"abc225-h","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc225-h.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc225-editorial-2834-cdce3199f33b881049c53cbd155bf02b23ef7e989c6b1c6c5e6c04d5c5e8d01d","source-abc225-h-problem-eb012bb53f4a2575070ec7721fa3027063e62b8e837c718f9f96acbc0d54fafd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"内部区間では着席位置と正の距離の組が一対一であり、各距離の重みgを掛けた係数抽出が全位置選択のスコア和になる。端区間では無重みの端の余白を一つ、固定席なしでは二つ加えることで同じ対応が成立する。固定席をまたぐ距離は存在せず、スコアは区間ごとの積なので、人数配分は多項式の積の次数で合成できる。位置のみを数えた後にD!で人の区別を戻す。","sourceRevisionIds":["source-abc225-editorial-2834-cdce3199f33b881049c53cbd155bf02b23ef7e989c6b1c6c5e6c04d5c5e8d01d","source-abc225-h-problem-eb012bb53f4a2575070ec7721fa3027063e62b8e837c718f9f96acbc0d54fafd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

固定席の間で隣接着席位置の差の積が因数分解する。未着席のD=M−K人をどの空席に置くかだけを先に数え、最後に相異なる人の割当てD!を掛ける。

内部の固定席a<bの間の空席数をq=b−a−1とする。k人を追加すると正の距離がk+1個、その和はq+1である。距離gの重みgを表す母関数はΣ_{g≥1}g z^g=z/(1−z)²なので、内部区間の係数は

\[z^(q+1)](z/(1−z)²)^(k+1)=C(q+k+1,2k+1)。

左端または右端の固定席までの空席数qでは、固定席に向かうk個の距離だけに重みが付き、外端側の空席には重みがない。母関数に1/(1−z)を一つ掛け、係数はC(q+k,2k)となる。k=0でも1である。

K=0なら端の二つの空席部分が無重み、着席者間のk−1個の距離が重み付きである。N席にk≥1人を置く重み和はC(N+k−2,2k−1)。この場合はk=Mを直接評価しM!を掛ける。

K≥1では各空席区間についてP_q(x)=Σ_{k=0}^{min(q,D)}係数_k x^kを作り、その積のD次係数へD!を掛ける。全区間の空席数はN−Kなので、多項式の総次数も高々N−K。小次数からNTTで積み、毎回D次で打ち切ればO(N log²N)で足りる。

## 典型の発動条件

### 固定点による区間独立化

発動条件: 一次元配置の評価が隣接選択点間の積で、いくつかの選択点が既に固定されているとき。

固定点間と両端の区間を分離し、各区間へ追加する人数だけを共有変数として残す。

### 生成多項式の積による人数配分

発動条件: 独立な部品ごとに使用個数別の重みがあり、全部品で使う総数を固定したいとき。

各区間のk人分のスコア和をx^kの係数にし、多項式積の指定次数を畳み込みで求める。

## 問題固有の要素

距離の積という非加法的なスコアが、固定席で切った各区間のスコアの積としてちょうど因数分解する。

別の問題へ持ち帰る視点: 隣接要素間の積を全配置で足す問題では、固定境界で独立成分へ切り、各成分の重みを生成関数の係数にする。

## 正当性

内部区間では着席位置と正の距離の組が一対一であり、各距離の重みgを掛けた係数抽出が全位置選択のスコア和になる。端区間では無重みの端の余白を一つ、固定席なしでは二つ加えることで同じ対応が成立する。固定席をまたぐ距離は存在せず、スコアは区間ごとの積なので、人数配分は多項式の積の次数で合成できる。位置のみを数えた後にD!で人の区別を戻す。

## 実装上の注意

- qは空席数。内部ではC(q+k+1,2k+1)、端ではC(q+k,2k)。同じ未定義のnを使って式を混ぜない。
- q=0の内部区間でもk=0の係数は隣接固定席の距離1であり1。
- K=0は別式、K=Mは積の定数項。階乗表の上限は2N程度で足り、各積はD次まででよい。

## 復習の核

- 隣接距離の積は足し算DPへ急いで落とさず、固定点で切ったとき区間ごとの積へ分解するかを確認する。

## 計算量と制約

### 時間

O(N log²N)。区間多項式の総次数≤N−K、係数作成O(N)、均衡する積木または小次数優先NTTでO(N log²N)。

### 空間

O(N)。消費した入力多項式を解放し、NTT作業領域と現在の積だけを保持する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 2 \leq M \leq N; 0 \leq K \leq M; 1 \leq A_1 \lt A_2 \lt \ldots \lt A_K \leq N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc225/editorial/2834) — source-abc225-editorial-2834-cdce3199f33b881049c53cbd155bf02b23ef7e989c6b1c6c5e6c04d5c5e8d01d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc225/tasks/abc225_h) — source-abc225-h-problem-eb012bb53f4a2575070ec7721fa3027063e62b8e837c718f9f96acbc0d54fafd
