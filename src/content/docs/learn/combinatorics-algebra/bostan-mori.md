---
title: "Bostan–Mori・有理生成関数の係数抽出"
description: "「Bostan–Mori・有理生成関数の係数抽出」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 207
---

# Bostan–Mori・有理生成関数の係数抽出

難度の目安: **発展**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Bostan–Mori・有理生成関数の係数抽出

P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、Bostan–Mori・有理生成関数の係数抽出の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Bostan–Mori・有理生成関数の係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC300 H 公式解説](https://atcoder.jp/contests/abc300/editorial/6269)
- [ABC300 H 公式問題文](https://atcoder.jp/contests/abc300/tasks/abc300_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-bostan-mori`
