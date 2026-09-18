---
title: "平面graph双対・cut/path対応"
description: "「平面graph双対・cut/path対応」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 127
---

# 平面graph双対・cut/path対応

習得対象の目安: **黄色（2000–2399）**。平面埋め込みのfaceを構成し、primalのcutとdualのpath・cycleを対応させる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 平面graph双対・cut/path対応

埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最大流・最小カット](/learn/graph/max-flow-min-cut/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、平面graph双対・cut/path対応の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 平面graph双対・cut/path対応の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC413 G 公式解説](https://atcoder.jp/contests/abc413/editorial/13403)
- [ABC413 G 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-planar-duality`
