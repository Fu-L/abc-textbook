---
title: "分離凸・凹の単調限界値選択"
description: "分離凸・凹の単調限界値選択の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 106
---

# 分離凸・凹の単調限界値選択

## 概要

### 分離凸・凹の単調限界値選択

各対象の限界費用が単調増加（または限界利益が単調減少）することを使い、複数の限界値列から必要な上位・下位K項をpriority queue mergeまたは値の閾値計数で選ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 一次元凸・単峰最適化。

離散凸・凹の差分が単調になることを確認し、複数の限界値列から必要な上位・下位K項だけをheap mergeまたは閾値計数で選ぶ。

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e)
2. [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e)
3. [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f)
4. [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)
5. [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC359 F 公式解説](https://atcoder.jp/contests/abc359/editorial/10260)
- [ABC359 F 公式問題文](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC369 G 公式解説](https://atcoder.jp/contests/abc369/editorial/10843)
- [ABC369 G 公式問題文](https://atcoder.jp/contests/abc369/tasks/abc369_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-separable-convex-marginals`
