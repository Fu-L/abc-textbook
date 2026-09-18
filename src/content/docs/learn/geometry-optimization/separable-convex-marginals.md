---
title: "分離凸・凹の単調限界値選択"
description: "「分離凸・凹の単調限界値選択」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 224
---

# 分離凸・凹の単調限界値選択

難度の目安: **応用**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 分離凸・凹の単調限界値選択

各対象の限界費用が単調増加（または限界利益が単調減少）することを使い、複数の限界値列から必要な上位・下位K項をpriority queue mergeまたは値の閾値計数で選ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

離散凸・凹の差分が単調になることを確認し、複数の限界値列から必要な上位・下位K項だけをheap mergeまたは閾値計数で選ぶ。

### このUnitでは扱わないもの

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e)
2. [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e)
3. [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f)
4. [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)
5. [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC359 F 公式解説](https://atcoder.jp/contests/abc359/editorial/10260)
- [ABC359 F 公式問題文](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC369 G 公式解説](https://atcoder.jp/contests/abc369/editorial/10843)
- [ABC369 G 公式問題文](https://atcoder.jp/contests/abc369/tasks/abc369_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-separable-convex-marginals`
