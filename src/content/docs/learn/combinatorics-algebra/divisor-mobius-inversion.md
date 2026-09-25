---
title: "約数格子のzeta・Möbius反転"
description: "「約数格子のzeta・Möbius反転」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 191
---

# 約数格子のzeta・Möbius反転

習得対象の目安: **青色（1600–1999）**。約数・倍数の累積値とexact値を区別し、反転でgcd別の個数を取り出す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第120単元。技能の説明を学んでから問題一覧へ進んでください。

前: [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/) ／ 次: [動的・implicit Segment Tree](/learn/query/dynamic-segment-tree/)

## 概要

### 約数格子のzeta・Möbius反転

約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。

### 習得する技能

- 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。

素因数・約数分解で得た考え方と実装を再利用し、約数格子のzeta・Möbius反転の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 約数格子のzeta・Möbius反転の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC304 F「Shift Table」](https://atcoder.jp/contests/abc304/tasks/abc304_f) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
2. [ABC361 F「x = a^b」](https://atcoder.jp/contests/abc361/tasks/abc361_f) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)。既習技能: floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。
3. [ABC230 G「GCD Permutation」](https://atcoder.jp/contests/abc230/tasks/abc230_g) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g) — 主題: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC230 G 公式解説](https://atcoder.jp/contests/abc230/editorial/3020)
- [ABC230 G 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_g)
- [ABC304 F 公式解説](https://atcoder.jp/contests/abc304/editorial/6511)
- [ABC304 F 公式問題文](https://atcoder.jp/contests/abc304/tasks/abc304_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-divisor-mobius-inversion`
