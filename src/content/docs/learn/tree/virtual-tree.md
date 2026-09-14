---
title: "virtual tree・auxiliary tree"
description: "「virtual tree・auxiliary tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 131
---

# virtual tree・auxiliary tree

## 概要

### virtual tree・auxiliary tree

選択頂点と隣接LCAだけをEuler順にstack接続し、必要な祖先関係を保つ小木を構築する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: ancestor query・LCA、Euler順による部分木区間化。

ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、virtual tree・auxiliary treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- virtual tree・auxiliary treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC340 G 公式解説](https://atcoder.jp/contests/abc340/editorial/9249)
- [ABC340 G 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-virtual-tree`
