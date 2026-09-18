---
title: "FPS合成・power projection"
description: "「FPS合成・power projection」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 209
---

# FPS合成・power projection

難度の目安: **専門**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### FPS合成・power projection

多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)。

形式的べき級数の基本演算で得た考え方と実装を再利用し、FPS合成・power projectionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g)
2. [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC387 G 公式解説](https://atcoder.jp/contests/abc387/editorial/11727)
- [ABC387 G 公式問題文](https://atcoder.jp/contests/abc387/tasks/abc387_g)
- [ABC439 G 公式解説](https://atcoder.jp/contests/abc439/editorial/14995)
- [ABC439 G 公式問題文](https://atcoder.jp/contests/abc439/tasks/abc439_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-fps-composition-power-projection`
