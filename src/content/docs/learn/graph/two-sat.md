---
title: "2-SAT・含意グラフ"
description: "「2-SAT・含意グラフ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 125
---

# 2-SAT・含意グラフ

## 概要

### 2-SAT・含意グラフ

二値選択のclauseを含意辺へ変換し、literalと否定literalのSCC関係から可解性と代入を得る。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: SCC・縮約DAG・トポロジカル順序。

SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、2-SAT・含意グラフの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 2-SAT・含意グラフの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC277 Ex「Constrained Sums」](https://atcoder.jp/contests/abc277/tasks/abc277_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC277 H 公式解説](https://atcoder.jp/contests/abc277/editorial/5207)
- [ABC277 H 公式問題文](https://atcoder.jp/contests/abc277/tasks/abc277_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-two-sat`
