---
title: "加法的tree metric復元"
description: "「加法的tree metric復元」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 130
---

# 加法的tree metric復元

難度の目安: **発展**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 加法的tree metric復元

全点対距離行列の加法性から葉の接続先とedge長を決め、候補木の全距離を再計算して存在を完全検証する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。

木距離・直径・中心・最遠点で得た考え方と実装を再利用し、加法的tree metric復元の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 加法的tree metric復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC451 E 公式問題文](https://atcoder.jp/contests/abc451/tasks/abc451_e)
- [ABC451 E 公式解説](https://atcoder.jp/contests/abc451/editorial/18053)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-additive-tree-metric-reconstruction`
