---
title: "巡回群を指数化して数える"
description: "「巡回群を指数化して数える」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 173
---

# 巡回群を指数化して数える

習得対象の目安: **黄色（2000–2399）**。巡回群を指数へ写し、位数・gcd・約数の分類で重複なく数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 巡回群の指数化・位数別数え上げ

巡回部分群の元を指数へ写し、gcd・位数・約数格子で分類して重複なく数える。

### 習得する技能

- 巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)。

このUnitを直接前提とする単元: なし。

乗法的位数とその約数分類を先に学び、巡回群の元を指数へ写して位数別に重複なく数える。個別問題で必要な約数Möbius反転はsupporting readinessとして接続する。

### このUnitでは扱わないもの

- 乗法的位数から最小周期だけを求める問題。

## 問題一覧

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)（巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)（巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。）。追加で学ぶ技能: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)（合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)（約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC335 G 公式解説](https://atcoder.jp/contests/abc335/editorial/9017)
- [ABC335 G 公式問題文](https://atcoder.jp/contests/abc335/tasks/abc335_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `a83767c84a9cb372c1228a1849ba7ad25ea0b926c3443a52e846b4230fa86ee8` / LearningUnit `unit-cyclic-group-exponent-counting`
