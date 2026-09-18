---
title: "静的sorted range index・Merge Sort Tree"
description: "「静的sorted range index・Merge Sort Tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 44
---

# 静的sorted range index・Merge Sort Tree

習得対象の目安: **青色（1600–1999）**。区間分解・整列列・prefix和を組み合わせ、二つの軸を持つ問い合わせを処理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 静的sorted range index・Merge Sort Tree

各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)。

Segment Treeのcanonical区間分解で得た考え方と実装を再利用し、静的sorted range index・Merge Sort Treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 静的sorted range index・Merge Sort Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC339 G「Smaller Sum」](https://atcoder.jp/contests/abc339/tasks/abc339_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC339 G 公式解説](https://atcoder.jp/contests/abc339/editorial/9207)
- [ABC339 G 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-static-sorted-range-index`
