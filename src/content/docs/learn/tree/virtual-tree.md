---
title: "virtual tree・auxiliary tree"
description: "「virtual tree・auxiliary tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 137
---

# virtual tree・auxiliary tree

習得対象の目安: **黄色（2000–2399）**。Euler順と隣接LCAで必要な分岐点だけを残し、小さな木上で計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第132単元。技能の説明を学んでから問題一覧へ進んでください。

前: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/) ／ 次: [Aho–Corasick](/learn/string/aho-corasick/)

## 概要

### virtual tree・auxiliary tree

選択頂点と隣接LCAだけをEuler順にstack接続し、必要な祖先関係を保つ小木を構築する。

### 習得する技能

- 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)、[Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。

ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、virtual tree・auxiliary treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- virtual tree・auxiliary treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g) — 主題: [virtual tree・auxiliary tree](/learn/tree/virtual-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC340 G 公式解説](https://atcoder.jp/contests/abc340/editorial/9249)
- [ABC340 G 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-virtual-tree`
