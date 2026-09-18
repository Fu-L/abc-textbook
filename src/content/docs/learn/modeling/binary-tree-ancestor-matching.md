---
title: "二進操作の木へのモデル化と祖先マッチング"
description: "「二進操作の木へのモデル化と祖先マッチング」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 11
---

# 二進操作の木へのモデル化と祖先マッチング

習得対象の目安: **青色（1600–1999）**。二進操作を祖先への移動に写し、深い一致から確定する交換論法を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 二進操作の木へのモデル化と祖先マッチング

二進末尾の削除を親への辺に写し、深い頂点で需要と供給を相殺して余剰だけを祖先へ渡す。両側の移動可能な辺を区別し、深い一致を優先する交換論法で移動数の最小性を示す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

貪欲法と交換論で得た考え方と実装を再利用し、二進操作の木へのモデル化と祖先マッチングの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 二進操作の木へのモデル化と祖先マッチングの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC254 Ex「Multiply or Divide by 2」](https://atcoder.jp/contests/abc254/tasks/abc254_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC254 H 公式解説](https://atcoder.jp/contests/abc254/editorial/4053)
- [ABC254 H 公式問題文](https://atcoder.jp/contests/abc254/tasks/abc254_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-binary-tree-ancestor-matching`
