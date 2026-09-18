---
title: "subset zeta・Möbius変換"
description: "「subset zeta・Möbius変換」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 192
---

# subset zeta・Möbius変換

習得対象の目安: **青色（1600–1999）**。集合の包含方向に一bitずつ和を集め、zeta変換と逆変換を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### subset zeta・Möbius変換

Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。

集合上の包除原理・部分集合・bitmask状態DPで得た考え方と実装を再利用し、subset zeta・Möbius変換の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 下位単元

- [subset convolution](/learn/combinatorics-algebra/subset-convolution/) — 橙色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC349 F「Subsequence LCM」](https://atcoder.jp/contests/abc349/tasks/abc349_f)
2. [ABC423 F「Loud Cicada」](https://atcoder.jp/contests/abc423/tasks/abc423_f)
3. [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h)
4. [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)
- [ABC295 H 公式解説](https://atcoder.jp/contests/abc295/editorial/6036)
- [ABC295 H 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-subset-transforms`
