---
title: "subset convolution"
description: "「subset convolution」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 193
---

# subset convolution

習得対象の目安: **橙色（2400–2799）**。集合サイズ別の変換と反転を組み合わせ、互いに素な分割の畳み込みを求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### subset convolution

互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（後の節）、[subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。

畳み込み・相互相関・subset zeta・Möbius変換で得た考え方と実装を再利用し、subset convolutionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- subset convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC294 Ex「K-Coloring」](https://atcoder.jp/contests/abc294/tasks/abc294_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-subset-convolution`
