---
title: "ABC450-G — Random Subtraction"
draft: true
authoringUnit: {"problemId":"abc450-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc450-g.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic","unit-normalization"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic","tag-state-normalization"],"sourceRevisionIds":["source-abc450-editorial-17336-bf2c5e1844b10675c3cdfa066abdf715122241b5d2f24c86c619da6d4c8d2f43","source-abc450-g-problem-2340ce7f0c546b54eb6c3073d60a40b2ae28e46d1a0fcb4b73e9ac6181415c98"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最終x=Σc_iA_i、c_i=±1なのでx²の対角項は固定で、交差項だけの相関を求めればよい。操作はindexについて対称だから各pairのE[c_ic_j]は等しい。最初に二要素を減算併合すると、その二つの符号は常に逆でpair寄与−1、他要素との寄与は相殺。残るN−2要素同士の相関はN−1要素問題と同じで、C_N=−1+(N−3)/(N−1)C_{N−1}を得る。C_Nをpair数で割り、2ΣA_iA_jへ掛けた期待値が求める二次モーメントである。","sourceRevisionIds":["source-abc450-editorial-17336-bf2c5e1844b10675c3cdfa066abdf715122241b5d2f24c86c619da6d4c8d2f43","source-abc450-g-problem-2340ce7f0c546b54eb6c3073d60a40b2ae28e46d1a0fcb4b73e9ac6181415c98"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

最終値 x は各 A_i に符号 c_i∈{±1} を掛けた和である。操作の対称性により、任意 pair の E[c_i c_j] は同じで N のみに依存する。 x^2=ΣA_i^2+2Σ_{i<j}c_ic_j A_iA_j なので、必要な確率情報は pair 符号積の期待値一種類だけである。 Σ_{i<j}A_iA_j=((ΣA_i)^2-ΣA_i^2)/2 から入力依存部分も二つの scalar sum に圧縮できる。

採用する候補: C_N=Σ_{i<j}E[c_ic_j] の recurrence C_N=-1+(N-3)/(N-1) C_{N-1} を求め、ΣA_i^2 と Σ_{i<j}A_iA_j から E[x^2] を計算する。

最初に二要素を引くとその二符号積は-1、他要素との交差項は相殺し、残り同士は N-1 要素問題と同じ分布になる。

棄却する候補: ランダムな二要素選択と引く向きを全操作列について列挙し、最終値の二乗を平均する。

操作列の分岐数は超指数的で、確率分布を値ごとに保持することもできない。

x^2=ΣA_i^2+2Σ_{i<j}c_ic_j A_iA_j なので、必要な確率情報は pair 符号積の期待値一種類だけである。

Σ_{i<j}A_iA_j=((ΣA_i)^2-ΣA_i^2)/2 から入力依存部分も二つの scalar sum に圧縮できる。

modulus 上で C_1=0 から N まで recurrence を回す。pair 一個当たり期待値 C_N/binom(N,2) を求め、sumSq と pairProduct を使って sumSq+2×expectPair×pairProduct を計算する。N=1は別処理する。

## 典型の発動条件

### 交換対称性による期待値圧縮

発動条件: ランダム過程の最終係数が index permutation に対して対称なとき。

全 pair の相関を一つの N 依存値へまとめる。

### 一次 moment recurrence

発動条件: 最初の操作で二要素をまとめると小さい同型問題になるとき。

固定された交差項と残り問題の期待値を足して漸化式を作る。

## 問題固有の要素

最終値分布を求めず、目的関数を展開して必要な二次 moment だけを対称性で分類する。

別の問題へ持ち帰る視点: ランダム縮約過程では最初の一手を固定し、残った object が一サイズ小さい同分布になるかを見る。

## 正当性

最終x=Σc_iA_i、c_i=±1なのでx²の対角項は固定で、交差項だけの相関を求めればよい。操作はindexについて対称だから各pairのE[c_ic_j]は等しい。最初に二要素を減算併合すると、その二つの符号は常に逆でpair寄与−1、他要素との寄与は相殺。残るN−2要素同士の相関はN−1要素問題と同じで、C_N=−1+(N−3)/(N−1)C_{N−1}を得る。C_Nをpair数で割り、2ΣA_iA_jへ掛けた期待値が求める二次モーメントである。

## 実装上の注意

- N=1では binom(N,2) の逆元を取らない。modular fraction の分母 N-1 と pair数が0でない範囲を分ける。

## 復習の核

- 最初の二要素に関する三種類の pair（互い・片方と外部・外部同士）の寄与を分けて C_N の式を再導出する。

## 計算量と制約

### 時間

N 要素。整数逆元を1..Nで前計算すれば recurrenceと集約は O(N)。各stepでべき逆元を計算する実装は O(Nlog p)、p=998244353。

### 空間

逆元表O(N)、入力逐次sumとsumSq集約ならそれ以外O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq A_i \leq 998244352; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/editorial/17336) — source-abc450-editorial-17336-bf2c5e1844b10675c3cdfa066abdf715122241b5d2f24c86c619da6d4c8d2f43
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/tasks/abc450_g) — source-abc450-g-problem-2340ce7f0c546b54eb6c3073d60a40b2ae28e46d1a0fcb4b73e9ac6181415c98
