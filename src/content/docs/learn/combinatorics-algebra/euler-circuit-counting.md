---
title: "BEST定理によるEuler circuit数え上げ"
description: "「BEST定理によるEuler circuit数え上げ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 211
---

# BEST定理によるEuler circuit数え上げ

難度の目安: **発展**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### BEST定理によるEuler circuit数え上げ

有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)、[Euler trail・circuit](/learn/graph/euler-trail-circuit/)。

行列式による数え上げ・Euler trail・circuitで得た考え方と実装を再利用し、BEST定理によるEuler circuit数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- BEST定理によるEuler circuit数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC336 G 公式解説](https://atcoder.jp/contests/abc336/editorial/9060)
- [ABC336 G 公式問題文](https://atcoder.jp/contests/abc336/tasks/abc336_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-euler-circuit-counting`
