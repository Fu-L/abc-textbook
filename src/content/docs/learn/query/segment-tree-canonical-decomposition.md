---
title: "Segment Treeのcanonical区間分解"
description: "Segment Treeのcanonical区間分解の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 107
---

# Segment Treeのcanonical区間分解

## 概要

### Segment Treeのcanonical区間分解

区間をO(log N)個のcanonical nodeへ分解し、range object・生存時間・range edgeを少数のnodeへ配置する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 区間monoid要約。

区間monoid要約で得た考え方と実装を再利用し、Segment Treeのcanonical区間分解の発動条件・正当化・境界を重複なく学ぶ。

- Segment Treeのcanonical区間分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC342 G「Retroactive Range Chmax」](https://atcoder.jp/contests/abc342/tasks/abc342_g)
2. [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)

## 根拠

- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC342 G 公式解説](https://atcoder.jp/contests/abc342/editorial/9373)
- [ABC342 G 公式問題文](https://atcoder.jp/contests/abc342/tasks/abc342_g)
- [ABC363 G 公式解説](https://atcoder.jp/contests/abc363/editorial/10451)
- [ABC363 G 公式問題文](https://atcoder.jp/contests/abc363/tasks/abc363_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-segment-tree-canonical-decomposition`
