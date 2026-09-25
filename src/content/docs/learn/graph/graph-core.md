---
title: "graph core・leaf peeling"
description: "「graph core・leaf peeling」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 114
---

# graph core・leaf peeling

習得対象の目安: **水色（1200–1599）**。queueで次数の変化を伝播し、葉除去やk-coreの削除順を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第64単元。技能の説明を学んでから問題一覧へ進んでください。

前: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/) ／ 次: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)

## 概要

### graph core・leaf peeling

次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。

### 習得する技能

- 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- graph core・leaf peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
2. [ABC266 F「Well-defined Path Queries on a Namori」](https://atcoder.jp/contests/abc266/tasks/abc266_f) — 主題: [graph core・leaf peeling](/learn/graph/graph-core/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)
- [ABC267 E 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC267 E 公式解説](https://atcoder.jp/contests/abc267/editorial/4729)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-graph-core`
