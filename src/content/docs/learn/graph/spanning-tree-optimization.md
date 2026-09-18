---
title: "cut・cycle性質から最適全域木を構成する"
description: "「cut・cycle性質から最適全域木を構成する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 109
---

# cut・cycle性質から最適全域木を構成する

難度の目安: **標準**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 最小・最大全域木とcut・cycle性質

辺重み順の成分併合を交換論で正当化し、最小または最大全域木を構成して辺の採否を判定する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

貪欲の交換論を土台に、cut・cycle性質から最適全域木の辺の採否条件を導く。DSUはKruskal順の閾値sweepで初めて必須にする。

### このUnitでは扱わないもの

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 下位単元

- [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/) — 応用

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e)
2. [ABC282 E「Choose Two and Eat One」](https://atcoder.jp/contests/abc282/tasks/abc282_e)
3. [ABC352 E「Clique Connect」](https://atcoder.jp/contests/abc352/tasks/abc352_e)
4. [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f)
5. [ABC355 F「MST Query」](https://atcoder.jp/contests/abc355/tasks/abc355_f)
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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-spanning-tree-optimization`
