---
title: "Steiner tree subset DP"
description: "Steiner tree subset DPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 150
---

# Steiner tree subset DP

## 概要

### Steiner tree subset DP

terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 部分集合・bitmask状態DP、最短路モデル。

最短路モデル・部分集合・bitmask状態DPで得た考え方と実装を再利用し、Steiner tree subset DPの発動条件・正当化・境界を重複なく学ぶ。

- Steiner tree subset DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g)
2. [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC364 G 公式解説](https://atcoder.jp/contests/abc364/editorial/10547)
- [ABC364 G 公式問題文](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC395 G 公式解説](https://atcoder.jp/contests/abc395/editorial/12307)
- [ABC395 G 公式問題文](https://atcoder.jp/contests/abc395/tasks/abc395_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-steiner-tree-dp`
