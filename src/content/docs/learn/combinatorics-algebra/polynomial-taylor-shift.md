---
title: "factorial convolutionによる多項式Taylor shift"
description: "「factorial convolutionによる多項式Taylor shift」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 203
---

# factorial convolutionによる多項式Taylor shift

習得対象の目安: **橙色（2400–2799）**。二項展開の階乗因子を整理し、全係数の平行移動を一回の畳み込みへ還元する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### factorial convolutionによる多項式Taylor shift

P(x+a) の全係数を二項展開し、階乗倍した係数列と a^i/i! の反転畳み込みへ変換して準線形時間で求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)、[NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。

畳み込みと二項係数の階乗表示を理解した後、二項展開の添字を反転して P(x+a) の全係数を一回の畳み込みへ落とす。多点評価や一般FPS合成とは目的を区別する。

### このUnitでは扱わないもの

- factorial convolutionによる多項式Taylor shiftの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-polynomial-taylor-shift`
