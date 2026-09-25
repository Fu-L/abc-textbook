---
title: "基準点からの木距離・剰余類・直径・中心"
description: "「基準点からの木距離・剰余類・直径・中心」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 128
---

# 基準点からの木距離・剰余類・直径・中心

習得対象の目安: **水色（1200–1599）**。一意経路と直径端点の性質を理解し、少数の距離計算で全頂点を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 木距離の剰余類による構造分類

木の一つの基準点から各頂点への距離を求め、距離の剰余類と局所構造から頂点の役割や周期的な部品構造を分類する。

### 木距離・直径・中心・最遠点

木の一意経路距離を少数の基準点から一括計算し、距離label・直径端点・中心・最遠点性質で頂点集合の距離条件を整理する。

### 習得する技能

- 木の一つの基準点から全頂点への距離を求め、距離の剰余類と局所構造から各頂点の役割や周期的な部品構造を分類できる。
- 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/)。

木を探索して基準点から距離labelを作る方法を土台に、距離剰余類による構造分類と、直径端点・中心が距離構造を代表する性質を区別して学ぶ。

### このUnitでは扱わないもの

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 問題一覧

- [ABC303 E「A Gift From the Stars」](https://atcoder.jp/contests/abc303/tasks/abc303_e) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（木の一つの基準点から全頂点への距離を求め、距離の剰余類と局所構造から各頂点の役割や周期的な部品構造を分類できる。）。
- [ABC361 E「Tree and Hamilton Path 2」](https://atcoder.jp/contests/abc361/tasks/abc361_e) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。
- [ABC428 E「Farthest Vertex」](https://atcoder.jp/contests/abc428/tasks/abc428_e) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。
- [ABC221 F「Diameter set」](https://atcoder.jp/contests/abc221/tasks/abc221_f) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC222 F「Expensive Expense」](https://atcoder.jp/contests/abc222/tasks/abc222_f) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。
- [ABC267 F「Exactly K Steps」](https://atcoder.jp/contests/abc267/tasks/abc267_f) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC401 F「Add One Edge 3」](https://atcoder.jp/contests/abc401/tasks/abc401_f) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。） / [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。

## 根拠

- [ABC221 F 公式解説](https://atcoder.jp/contests/abc221/editorial/2723)
- [ABC221 F 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_f)
- [ABC222 F 公式解説](https://atcoder.jp/contests/abc222/editorial/2749)
- [ABC222 F 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_f)
- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `bc3fd38aa082c37e76f0829dcc0cff7e6d53e5b699f0b15c0b0432ab980d791f` / LearningUnit `unit-tree-metric`
