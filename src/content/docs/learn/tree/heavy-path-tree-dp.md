---
title: "heavy path上の多項式木DP"
description: "「heavy path上の多項式木DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 161
---

# heavy path上の多項式木DP

## 概要

### heavy path上の多項式木DP

heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。

ABC269 Exではheavy path上の多項式漸化式を積と合成へまとめ、畳み込みと分割統治で評価する。必要なのは通常の多項式積を高速化できる代数構造であり、一般のmax-plus convolutionをNTTへ置き換えることはできない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: NTT・FFTで畳み込みと相互相関を求める、根付き木DP・部分木集約。

畳み込み・相互相関・根付き木DP・部分木集約で得た考え方と実装を再利用し、heavy path上の多項式木DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- heavy path上の多項式木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC269 H 公式解説](https://atcoder.jp/contests/abc269/editorial/4838)
- [ABC269 H 公式問題文](https://atcoder.jp/contests/abc269/tasks/abc269_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-heavy-path-tree-dp`
