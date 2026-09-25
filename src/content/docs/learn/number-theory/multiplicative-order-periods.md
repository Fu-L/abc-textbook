---
title: "乗法的位数から最小周期を求める"
description: "「乗法的位数から最小周期を求める」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 170
---

# 乗法的位数から最小周期を求める

習得対象の目安: **青色（1600–1999）**。群の位数と要素の位数を区別し、約数を割り落として最小周期を求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第94単元。技能の説明を学んでから問題一覧へ進んでください。

前: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/) ／ 次: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)

## 概要

### 乗法的位数・最小周期

合同反復の最小正周期をmultiplicative orderへ帰着し、群位数の約数を割り落として求める。

### 習得する技能

- 合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)、[素因数分解と約数構造](/learn/number-theory/prime-divisor/)。

合同算術と約数分解を使えることを前提に、最小周期を乗法的位数へ帰着して約数から絞る。

### このUnitでは扱わないもの

- 約数格子上の指数計数・包除。

## 問題一覧

1. [ABC222 G「222」](https://atcoder.jp/contests/abc222/tasks/abc222_g) — 主題: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC222 G 公式解説](https://atcoder.jp/contests/abc222/editorial/2750)
- [ABC222 G 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC335 G 公式解説](https://atcoder.jp/contests/abc335/editorial/9017)
- [ABC335 G 公式問題文](https://atcoder.jp/contests/abc335/tasks/abc335_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-multiplicative-order-periods`
