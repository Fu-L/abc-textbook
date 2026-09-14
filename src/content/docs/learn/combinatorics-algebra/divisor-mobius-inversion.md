---
title: "約数格子のzeta・Möbius反転"
description: "「約数格子のzeta・Möbius反転」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 119
---

# 約数格子のzeta・Möbius反転

## 概要

### 約数格子のzeta・Möbius反転

約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 素因数分解と約数構造。

素因数・約数分解で得た考え方と実装を再利用し、約数格子のzeta・Möbius反転の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 約数格子のzeta・Möbius反転の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC304 F「Shift Table」](https://atcoder.jp/contests/abc304/tasks/abc304_f)
2. [ABC361 F「x = a^b」](https://atcoder.jp/contests/abc361/tasks/abc361_f)
3. [ABC230 G「GCD Permutation」](https://atcoder.jp/contests/abc230/tasks/abc230_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g)

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC230 G 公式解説](https://atcoder.jp/contests/abc230/editorial/3020)
- [ABC230 G 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_g)
- [ABC304 F 公式解説](https://atcoder.jp/contests/abc304/editorial/6511)
- [ABC304 F 公式問題文](https://atcoder.jp/contests/abc304/tasks/abc304_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-divisor-mobius-inversion`
