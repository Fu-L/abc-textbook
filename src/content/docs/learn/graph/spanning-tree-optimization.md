---
title: "cut・cycle性質から最適全域木を構成する"
description: "cut・cycle性質から最適全域木を構成するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 73
---

# cut・cycle性質から最適全域木を構成する

## 概要

### 最小・最大全域木とcut・cycle性質

辺重み順の成分併合を交換論で正当化し、最小または最大全域木を構成して辺の採否を判定する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 交換論から選択順を導く。

貪欲の交換論を土台に、cut・cycle性質から最適全域木の辺の採否条件を導く。DSUはKruskal順の閾値sweepで初めて必須にする。

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 下位単元

- [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC282 E「Choose Two and Eat One」](https://atcoder.jp/contests/abc282/tasks/abc282_e)
2. [ABC352 E「Clique Connect」](https://atcoder.jp/contests/abc352/tasks/abc352_e)
3. [ABC355 F「MST Query」](https://atcoder.jp/contests/abc355/tasks/abc355_f)
4. [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e)
5. [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f)
6. [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g)

## 根拠

- [ABC218 E 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 E 公式解説](https://atcoder.jp/contests/abc218/editorial/2580)
- [ABC235 E 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC235 E 公式解説](https://atcoder.jp/contests/abc235/editorial/3254)
- [ABC250 H 公式解説](https://atcoder.jp/contests/abc250/editorial/3908)
- [ABC250 H 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-spanning-tree-optimization`
