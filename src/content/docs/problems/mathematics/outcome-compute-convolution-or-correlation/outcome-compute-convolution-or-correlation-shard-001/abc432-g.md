---
title: "ABC432-G — Sum of Binom(A, B)"
draft: true
authoringUnit: {"problemId":"abc432-g","docPath":"src/content/docs/problems/mathematics/outcome-compute-convolution-or-correlation/outcome-compute-convolution-or-correlation-shard-001/abc432-g.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"excludedTopics":["組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc432-editorial-14573-21fb5018d3fab75809ccff8511b070d8ba4e456ef07fcaed46009f687478889c","source-abc432-g-problem-b59b6f3bdc3b67c8c130001cf7ac8a17227de2582d0a4e9bbcc21f124b4734ca"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"C(i,j)=i!/(j!(i−j)!)のj側をB頻度/j!、残差側を1/k!として積のi次係数へ移すと、h_i=Σ_j freq_B(j)/(j!(i−j)!)になる。i!とA頻度を掛けると同値pairの全寄与を回復する。j>iは非負残差kが存在しないので自然に0になる。","sourceRevisionIds":["source-abc432-editorial-14573-21fb5018d3fab75809ccff8511b070d8ba4e456ef07fcaed46009f687478889c","source-abc432-g-problem-b59b6f3bdc3b67c8c130001cf7ac8a17227de2582d0a4e9bbcc21f124b4734ca"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 考察

求める二重和は値の頻度 C_a(i),C_b(j) でまとめられる。二項係数 i!/(j!(i-j)!) の j と i-j の部分は畳み込みの係数に一致する。

採用する候補: C_b(j)/j! と 1/k! の多項式を NTT で畳み込み、係数へ C_a(i)i! を掛けて総和する。

二重和を一回の畳み込みへ変形でき、O(K log K) で全 i の内側和を得られる。

棄却する候補: 全ての値 i,j または全 A,B の組について二項係数を加える。

最大で O(K^2) または O(NM) となる。

h_i=Σ_{j+k=i}(C_b(j)/j!)(1/k!) とおけば、i!h_i=Σ_j C_b(j)binom(i,j) である。

binom(i,j)=0 とみなす j>i は畳み込みの係数 i に現れないため、特別な枝分けなしで除外される。

K まで factorial と inverse factorial を前計算する。f[j]=C_b(j)·invfact[j]、g[k]=invfact[k] を作り、NTT convolution h=f*g を求める。i=0…K について C_a(i)·fact[i]·h[i] を足す。

## 典型の発動条件

### 階乗正規化による畳み込み

発動条件: 二項係数を含む二重和で添字和 i=j+k の形が見えるとき。

j! と k! を各列へ分離し、通常の多項式積の係数へ変換する。

### NTT

発動条件: 法が適合し、大きな二列の畳み込みを高速に求めたいとき。

頻度を階乗で正規化した多項式を O(K log K) で乗算する。

### 値頻度への集約

発動条件: 式が要素の位置でなく値だけに依存するとき。

同じ A_i、B_j の寄与を頻度でまとめて値域上の式にする。

## 問題固有の要素

二項係数付き和は i! を外へ出し、両入力を逆階乗で正規化すると通常畳み込みになる。

別の問題へ持ち帰る視点: 組合せ核 K(i,j) が j と i-j の積へ分離できれば、全組集計を convolution に落とせる。

## 正当性

C(i,j)=i!/(j!(i−j)!)のj側をB頻度/j!、残差側を1/k!として積のi次係数へ移すと、h_i=Σ_j freq_B(j)/(j!(i−j)!)になる。i!とA頻度を掛けると同値pairの全寄与を回復する。j>iは非負残差kが存在しないので自然に0になる。

## 実装上の注意

- 0! と値 0 の頻度を問題の範囲に合わせて含める。畳み込み結果は長さ 2K+1 だが使用係数は i≤K だけである。

## 復習の核

- h[i] の添字条件 j+k=i と、fact[i] を掛け戻した式が元の binom(i,j) に一致することを確認する。

## 計算量と制約

### 時間

O(V log V+N+M)、V=max(A_i,B_j)。階乗正規化とNTT。

### 空間

O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,M \leq 5\times 10^5; 1\leq A_i,B_j \leq 5\times 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc432/editorial/14573) — source-abc432-editorial-14573-21fb5018d3fab75809ccff8511b070d8ba4e456ef07fcaed46009f687478889c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc432/tasks/abc432_g) — source-abc432-g-problem-b59b6f3bdc3b67c8c130001cf7ac8a17227de2582d0a4e9bbcc21f124b4734ca
