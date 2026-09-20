---
title: "動的・implicit Segment Tree"
description: "「動的・implicit Segment Tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 45
---

# 動的・implicit Segment Tree

習得対象の目安: **青色（1600–1999）**。通常のSegment Treeを疎なnode生成へ拡張し、座標域とnode数を別々に評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 動的・implicit Segment Tree

巨大または疎な座標域で訪れたnodeだけを生成し、区間要約と境界探索をO(log U)で保つ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

区間monoid要約で得た考え方と実装を再利用し、動的・implicit Segment Treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 動的・implicit Segment Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC403 G「Odd Position Sum Query」](https://atcoder.jp/contests/abc403/tasks/abc403_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC403 G 公式解説](https://atcoder.jp/contests/abc403/editorial/12770)
- [ABC403 G 公式問題文](https://atcoder.jp/contests/abc403/tasks/abc403_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dynamic-segment-tree`
