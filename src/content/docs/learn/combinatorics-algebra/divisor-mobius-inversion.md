---
title: "約数格子のzeta・Möbius反転"
description: "約数格子のzeta・Möbius反転の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 172
---

# 約数格子のzeta・Möbius反転

## 概要

### 約数格子のzeta・Möbius反転

約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 素因数分解と約数構造。

素因数・約数分解で得た考え方と実装を再利用し、約数格子のzeta・Möbius反転の発動条件・正当化・境界を重複なく学ぶ。

- 約数格子のzeta・Möbius反転の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC230 G「GCD Permutation」](https://atcoder.jp/contests/abc230/tasks/abc230_g)
2. [ABC361 F「x = a^b」](https://atcoder.jp/contests/abc361/tasks/abc361_f)
3. [ABC304 F「Shift Table」](https://atcoder.jp/contests/abc304/tasks/abc304_f)

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-divisor-mobius-inversion`
