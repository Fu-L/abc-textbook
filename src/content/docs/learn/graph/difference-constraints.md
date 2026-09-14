---
title: "difference constraints・不等式系の最短路化"
description: "「difference constraints・不等式系の最短路化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 75
---

# difference constraints・不等式系の最短路化

## 概要

### difference constraints・不等式系の最短路化

差の上界 x_v-x_u≤c を有向辺 u→v の重みcへ写し、Bellman–Ford等の緩和と負閉路から可解性・極値・具体解を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最短路モデル。

最短路の緩和と負閉路を理解した後、差の不等式を辺へ写して制約系の可解性・極値・具体解を同じ不変条件で求める。

### このUnitでは扱わないもの

- difference constraints・不等式系の最短路化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC216 G「01Sequence」](https://atcoder.jp/contests/abc216/tasks/abc216_g)
2. [ABC404 G「Specified Range Sums」](https://atcoder.jp/contests/abc404/tasks/abc404_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC404 G 公式解説](https://atcoder.jp/contests/abc404/editorial/12867)
- [ABC404 G 公式問題文](https://atcoder.jp/contests/abc404/tasks/abc404_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-difference-constraints`
