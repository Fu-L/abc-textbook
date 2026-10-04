---
title: "ABC241-EX — Card Deck Score"
draft: true
authoringUnit: {"problemId":"abc241-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc241-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-generating-functions","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc241-editorial-3473-9985803265c2f2ceca16b28ef311d5a58d36baf0cc903dc7cd7087a0c39e5129","source-abc241-ex-problem-920692d485b32ace547699e9cee4a214d4b640f55d93314679fc656d0d3fe3c5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各種類k枚の重みA_i^kを積にすると有限等比和積のM次係数になる。分子subset展開は有限在庫の上限を正確に補正し、相異なるA_iによる部分分数分解は分母逆数のt次係数をΣc_iA_i^tと表す。d≤Mの各分子項へこの係数を掛ければ目的係数を過不足なく抽出できる。","sourceRevisionIds":["source-abc241-editorial-3473-9985803265c2f2ceca16b28ef311d5a58d36baf0cc903dc7cd7087a0c39e5129","source-abc241-ex-problem-920692d485b32ace547699e9cee4a214d4b640f55d93314679fc656d0d3fe3c5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

各値 A_i を k_i 枚選ぶ寄与は (A_i x)^{k_i} なので、求める和は ∏_i(1+A_i x+…+(A_i x)^{B_i}) の x^M 係数である。ただし M は10^18で係数 DP はできない。

各有限等比和を (1-(A_i x)^{B_i+1})/(1-A_i x) と分けると、分子は subset 展開で高々2^N項、分母逆数は相異なる A_i を使った一次分母の partial fraction にできる。

採用する候補: 分母逆数を Σ c_i/(1-A_i x) に部分分数分解し、分子の subset 各項から x^M への寄与 Σc_i A_i^{M-d} を計算する。

巨大次数 M を modular exponentiation に押し込み、N≤16 の subset 数だけを列挙すればよい。

棄却する候補: カード種類を順に処理し、0..M 枚の係数配列を持つ bounded knapsack を行う。

M は10^18で、多項式の必要次数まで配列を持てない。

c_i は x=A_i^{-1} を代入して c_i=∏_{j≠i}(1-A_j/A_i)^{-1} と求まり、A_i が法上で相異なるため全ての逆元が存在する。

subset U の分子項は degree d=Σ_{j∈U}(B_j+1)、coefficient (-1)^{|U|}∏_{j∈U}A_j^{B_j+1} で、d>M の項は係数 x^M に寄与しない。

全 i の c_i を法998244353で求める。全 subset U について degree d と numerator coefficient を更新し、d≤M なら coefficient·Σ_i c_i A_i^{M-d} を答えへ加える。冪は二分累乗で計算する。

## 典型の発動条件

### 重み付き選択の母関数

発動条件: 種類ごとの選択個数と積重みをまとめて、総選択数別の和を求めるとき。

各種類の有限幾何級数を掛け、求める総数の係数として読む。

### 相異なる根の部分分数分解

発動条件: ∏(1-a_i x)^{-1} の高次数係数が必要で a_i が相異なるとき。

一次分母へ分解し、係数を指数列 Σc_i a_i^m の閉形式にする。

## 問題固有の要素

枚数上限 B_i は sparse な分子の2^N項へ、上限なし部分は partial fraction の指数和へ分離できる。

別の問題へ持ち帰る視点: 巨大次数の有限幾何級数積では、上限補正を inclusion-exclusion 型分子、無限側を線形漸化式の閉形式として分担する。

## 正当性

各種類k枚の重みA_i^kを積にすると有限等比和積のM次係数になる。分子subset展開は有限在庫の上限を正確に補正し、相異なるA_iによる部分分数分解は分母逆数のt次係数をΣc_iA_i^tと表す。d≤Mの各分子項へこの係数を掛ければ目的係数を過不足なく抽出できる。

## 実装上の注意

- degree Σ(B_i+1) と M は 64 bit、係数積は法上で持つ。A_i の相異なりを使う c_i の分母を正規化し、subset の符号を popcount parity で加減する。

## 復習の核

- N=2 で分母逆数を二つの一次分母へ実際に分け、x^m 係数が c_1A_1^m+c_2A_2^m になることを確認する。

## 計算量と制約

### 時間

O(N²+N2^N log M)。各subsetと一次分母について二分累乗。

### 空間

O(N+2^N)。subset値を再利用する。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 16; 1 \leq M \leq 10^{18}; 1 \leq A_i < 998244353; 1 \leq B_i \leq 10^{17}; If i\neq j, then A_i \neq A_j.; M\leq B_1+B_2+\cdots B_N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc241/editorial/3473) — source-abc241-editorial-3473-9985803265c2f2ceca16b28ef311d5a58d36baf0cc903dc7cd7087a0c39e5129
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc241/tasks/abc241_h) — source-abc241-ex-problem-920692d485b32ace547699e9cee4a214d4b640f55d93314679fc656d0d3fe3c5
