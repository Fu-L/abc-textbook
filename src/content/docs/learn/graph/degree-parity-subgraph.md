---
title: "指定次数parityの部分グラフ構成"
description: "「指定次数parityの部分グラフ構成」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 105
---

# 指定次数parityの部分グラフ構成

## 概要

### 指定次数parityの部分グラフ構成

選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: Euler trail・circuit。

Euler trail・circuitで得た考え方と実装を再利用し、指定次数parityの部分グラフ構成の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 指定次数parityの部分グラフ構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC345 F 公式解説](https://atcoder.jp/contests/abc345/editorial/9558)
- [ABC345 F 公式問題文](https://atcoder.jp/contests/abc345/tasks/abc345_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-degree-parity-subgraph`
