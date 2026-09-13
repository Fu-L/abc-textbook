---
title: "二進操作の木へのモデル化と祖先マッチング"
description: "二進操作の木へのモデル化と祖先マッチングの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 133
---

# 二進操作の木へのモデル化と祖先マッチング

## 概要

### 二進操作の木へのモデル化と祖先マッチング

二進末尾の削除を親への辺に写し、深い頂点で需要と供給を相殺して余剰だけを祖先へ渡す。両側の移動可能な辺を区別し、深い一致を優先する交換論法で移動数の最小性を示す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 交換論から選択順を導く。

貪欲法と交換論で得た考え方と実装を再利用し、二進操作の木へのモデル化と祖先マッチングの発動条件・正当化・境界を重複なく学ぶ。

- 二進操作の木へのモデル化と祖先マッチングの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC254 Ex「Multiply or Divide by 2」](https://atcoder.jp/contests/abc254/tasks/abc254_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC254 H 公式解説](https://atcoder.jp/contests/abc254/editorial/4053)
- [ABC254 H 公式問題文](https://atcoder.jp/contests/abc254/tasks/abc254_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-binary-tree-ancestor-matching`
