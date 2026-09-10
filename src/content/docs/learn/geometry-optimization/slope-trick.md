---
title: "slope trick"
description: "slope trickの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 190
---

# slope trick

## 概要

### slope trick

区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 一次元凸・単峰最適化。

一次元凸・単峰最適化で得た考え方と実装を再利用し、slope trickの発動条件・正当化・境界を重複なく学ぶ。

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC217 H「Snuketoon」](https://atcoder.jp/contests/abc217/tasks/abc217_h)
2. [ABC250 G「Stonks」](https://atcoder.jp/contests/abc250/tasks/abc250_g)
3. [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g)

## 根拠

- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC250 G 公式解説](https://atcoder.jp/contests/abc250/editorial/3929)
- [ABC250 G 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_g)
- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-slope-trick`
