---
title: "near-tree graphのkernel化"
description: "「near-tree graphのkernel化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 115
---

# near-tree graphのkernel化

習得対象の目安: **黄色（2000–2399）**。葉と次数2のchainを答えを保って縮約し、余分な辺数で残るサイズを界する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### near-tree graphのkernel化

terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)、[graph core・leaf peeling](/learn/graph/graph-core/)。

cycle space・fundamental cycle basis・graph core・leaf peelingで得た考え方と実装を再利用し、near-tree graphのkernel化の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- near-tree graphのkernel化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-near-tree-kernelization`
