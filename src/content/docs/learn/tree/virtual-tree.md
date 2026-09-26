---
title: "virtual tree・auxiliary tree"
description: "「virtual tree・auxiliary tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 138
---

# virtual tree・auxiliary tree

習得対象の目安: **黄色（2000–2399）**。Euler順と隣接LCAで必要な分岐点だけを残し、小さな木上で計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### virtual tree・auxiliary tree

選択頂点と隣接LCAだけをEuler順にstack接続し、必要な祖先関係を保つ小木を構築する。

### 習得する技能

- 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)、[Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。

このUnitを直接前提とする単元: なし。

ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、virtual tree・auxiliary treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- virtual tree・auxiliary treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g) — 主題: [virtual tree・auxiliary tree](/learn/tree/virtual-tree/)（対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC340 G 公式解説](https://atcoder.jp/contests/abc340/editorial/9249)
- [ABC340 G 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-virtual-tree`
