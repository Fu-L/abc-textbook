---
title: "巡回群を指数化して数える"
description: "「巡回群を指数化して数える」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 172
---

# 巡回群を指数化して数える

習得対象の目安: **黄色（2000–2399）**。巡回群を指数へ写し、位数・gcd・約数の分類で重複なく数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第150単元。技能の説明を学んでから問題一覧へ進んでください。

前: [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/) ／ 次: [run-length状態の動的遷移](/learn/string/run-length-dynamics/)

## 概要

### 巡回群の指数化・位数別数え上げ

巡回部分群の元を指数へ写し、gcd・位数・約数格子で分類して重複なく数える。

### 習得する技能

- 巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)。

乗法的位数とその約数分類を先に学び、巡回群の元を指数へ写して位数別に重複なく数える。個別問題で必要な約数Möbius反転はsupporting readinessとして接続する。

### このUnitでは扱わないもの

- 乗法的位数から最小周期だけを求める問題。

## 問題一覧

1. [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
2. [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC335 G 公式解説](https://atcoder.jp/contests/abc335/editorial/9017)
- [ABC335 G 公式問題文](https://atcoder.jp/contests/abc335/tasks/abc335_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-cyclic-group-exponent-counting`
