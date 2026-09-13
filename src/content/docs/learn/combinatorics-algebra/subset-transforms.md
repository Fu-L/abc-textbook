---
title: "subset zeta・Möbius変換"
description: "subset zeta・Möbius変換の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 126
---

# subset zeta・Möbius変換

## 概要

### subset zeta・Möbius変換

Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 部分集合・bitmask状態DP、包除・Möbius反転で重複を補正する。

集合上の包除原理・部分集合・bitmask状態DPで得た考え方と実装を再利用し、subset zeta・Möbius変換の発動条件・正当化・境界を重複なく学ぶ。

- subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 下位単元

- [subset convolution](/learn/combinatorics-algebra/subset-convolution/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC423 F「Loud Cicada」](https://atcoder.jp/contests/abc423/tasks/abc423_f)
2. [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h)
3. [ABC349 F「Subsequence LCM」](https://atcoder.jp/contests/abc349/tasks/abc349_f)
4. [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)
- [ABC295 H 公式解説](https://atcoder.jp/contests/abc295/editorial/6036)
- [ABC295 H 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-subset-transforms`
