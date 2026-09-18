---
title: "slope trick"
description: "「slope trick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 226
---

# slope trick

習得対象の目安: **黄色（2000–2399）**。区分線形凸関数を折れ点で表し、関数への操作をheapの更新へ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### slope trick

区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

一次元凸・単峰最適化で得た考え方と実装を再利用し、slope trickの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC250 G「Stonks」](https://atcoder.jp/contests/abc250/tasks/abc250_g)
2. [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g)
3. [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g)
4. [ABC217 H「Snuketoon」](https://atcoder.jp/contests/abc217/tasks/abc217_h)
5. [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC250 G 公式解説](https://atcoder.jp/contests/abc250/editorial/3929)
- [ABC250 G 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_g)
- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-slope-trick`
