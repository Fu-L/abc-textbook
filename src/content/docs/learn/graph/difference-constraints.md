---
title: "difference constraints・不等式系の最短路化"
description: "difference constraints・不等式系の最短路化の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 144
---

# difference constraints・不等式系の最短路化

## 概要

### difference constraints・不等式系の最短路化

差の上界 x_v-x_u≤c を有向辺 u→v の重みcへ写し、Bellman–Ford等の緩和と負閉路から可解性・極値・具体解を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最短路モデル。

最短路の緩和と負閉路を理解した後、差の不等式を辺へ写して制約系の可解性・極値・具体解を同じ不変条件で求める。

- difference constraints・不等式系の最短路化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC216 G「01Sequence」](https://atcoder.jp/contests/abc216/tasks/abc216_g)
2. [ABC404 G「Specified Range Sums」](https://atcoder.jp/contests/abc404/tasks/abc404_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC404 G 公式解説](https://atcoder.jp/contests/abc404/editorial/12867)
- [ABC404 G 公式問題文](https://atcoder.jp/contests/abc404/tasks/abc404_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-difference-constraints`
