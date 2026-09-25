---
title: "素因数分解と約数構造"
description: "「素因数分解と約数構造」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 162
---

# 素因数分解と約数構造

習得対象の目安: **緑色（800–1199）**。試し割りや篩を使い、素因数の指数と約数に条件を分解する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第16単元。技能の説明を学んでから問題一覧へ進んでください。

前: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/) ／ 次: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)

## 概要

### 素因数・約数分解

整数の条件を素数ごとの指数や約数格子の条件に分解する。

ABC227 Gでは巨大二項係数を実際に作らず、短い分子区間の各素数倍数から指数を取り出す。分母の階乗の指数を引き、残った素因数も集計する。数式に二項係数が現れることよりも、「巨大な値を短い区間上の指数集計へ移す」発想を取り出す。

### 習得する技能

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

### このUnitでは扱わないもの

- 床関数や整数根の値が一定となる区間への分割。

## 問題一覧

1. [ABC400 E「Ringo's Favorite Numbers 3」](https://atcoder.jp/contests/abc400/tasks/abc400_e) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。
2. [ABC393 E「GCD of Subset」](https://atcoder.jp/contests/abc393/tasks/abc393_e) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。
3. [ABC259 E「LCM on Whiteboard」](https://atcoder.jp/contests/abc259/tasks/abc259_e) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。
4. [ABC445 E「Many LCMs」](https://atcoder.jp/contests/abc445/tasks/abc445_e) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。
5. [ABC420 G「sqrt(n²+n+X)」](https://atcoder.jp/contests/abc420/tasks/abc420_g) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。
6. [ABC412 E「LCM Sequence」](https://atcoder.jp/contests/abc412/tasks/abc412_e) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。
7. [ABC384 F「Double Sum 2」](https://atcoder.jp/contests/abc384/tasks/abc384_f) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。
8. [ABC322 G「Two Kinds of Base」](https://atcoder.jp/contests/abc322/tasks/abc322_g) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
9. [ABC227 G「Divisors of Binomial Coefficient」](https://atcoder.jp/contests/abc227/tasks/abc227_g) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。 C(N,K)自体は作らない。K=min(K,N−K)として分子の短い区間[N−K+1,N]を素数ごとの倍数走査で篩い、分母K!の指数を引く。小素数除去後に残る大素数も集計し、Σではなく∏(e_p+1)で約数数を得る。巨大な整数を短い区間の素因数指数へ写すことが主題。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
- [ABC222 G「222」](https://atcoder.jp/contests/abc222/tasks/abc222_g) — 主題: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
- [ABC230 G「GCD Permutation」](https://atcoder.jp/contests/abc230/tasks/abc230_g) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC238 G「Cubic?」](https://atcoder.jp/contests/abc238/tasks/abc238_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC272 G「Yet Another mod M」](https://atcoder.jp/contests/abc272/tasks/abc272_g) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC285 Ex「Avoid Square Number」](https://atcoder.jp/contests/abc285/tasks/abc285_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC304 F「Shift Table」](https://atcoder.jp/contests/abc304/tasks/abc304_f) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC349 F「Subsequence LCM」](https://atcoder.jp/contests/abc349/tasks/abc349_f) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC363 F「Palindromic Expression」](https://atcoder.jp/contests/abc363/tasks/abc363_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC368 F「Dividing Game」](https://atcoder.jp/contests/abc368/tasks/abc368_f) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC461 F「Total Product is N」](https://atcoder.jp/contests/abc461/tasks/abc461_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC222 G 公式解説](https://atcoder.jp/contests/abc222/editorial/2750)
- [ABC222 G 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC227 G 公式解説](https://atcoder.jp/contests/abc227/editorial/2909)
- [ABC227 G 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-prime-divisor`
