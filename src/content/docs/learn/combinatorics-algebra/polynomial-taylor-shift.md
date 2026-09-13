---
title: "factorial convolutionによる多項式Taylor shift"
description: "factorial convolutionによる多項式Taylor shiftの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 176
---

# factorial convolutionによる多項式Taylor shift

## 概要

### factorial convolutionによる多項式Taylor shift

P(x+a) の全係数を二項展開し、階乗倍した係数列と a^i/i! の反転畳み込みへ変換して準線形時間で求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 組合せ係数と対称性で数える、NTT・FFTで畳み込みと相互相関を求める。

畳み込みと二項係数の階乗表示を理解した後、二項展開の添字を反転して P(x+a) の全係数を一回の畳み込みへ落とす。多点評価や一般FPS合成とは目的を区別する。

- factorial convolutionによる多項式Taylor shiftの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-polynomial-taylor-shift`
