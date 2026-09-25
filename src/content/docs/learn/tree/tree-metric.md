---
title: "木距離を基準点・直径・中心から捉える"
description: "「木距離を基準点・直径・中心から捉える」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 129
---

# 木距離を基準点・直径・中心から捉える

習得対象の目安: **水色（1200–1599）**。一意経路と直径端点の性質を理解し、少数の距離計算で全頂点を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第42単元。技能の説明を学んでから問題一覧へ進んでください。

前: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/) ／ 次: [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)

## 概要

### 木距離・直径・中心・最遠点

木の一意経路距離を少数の基準点から一括計算し、距離label・直径端点・中心・最遠点性質で頂点集合の距離条件を整理する。

### 習得する技能

- 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

木を探索して基準点からの距離を求められることを前提に、一意経路から得る距離labelと、直径端点・中心が距離構造を代表する性質を学ぶ。

### このUnitでは扱わないもの

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 問題一覧

1. [ABC303 E「A Gift From the Stars」](https://atcoder.jp/contests/abc303/tasks/abc303_e) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。
2. [ABC361 E「Tree and Hamilton Path 2」](https://atcoder.jp/contests/abc361/tasks/abc361_e) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
3. [ABC428 E「Farthest Vertex」](https://atcoder.jp/contests/abc428/tasks/abc428_e) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。
4. [ABC401 F「Add One Edge 3」](https://atcoder.jp/contests/abc401/tasks/abc401_f) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
5. [ABC222 F「Expensive Expense」](https://atcoder.jp/contests/abc222/tasks/abc222_f) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。
6. [ABC221 F「Diameter set」](https://atcoder.jp/contests/abc221/tasks/abc221_f) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC267 F「Exactly K Steps」](https://atcoder.jp/contests/abc267/tasks/abc267_f) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。
- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

## 根拠

- [ABC221 F 公式解説](https://atcoder.jp/contests/abc221/editorial/2723)
- [ABC221 F 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_f)
- [ABC222 F 公式解説](https://atcoder.jp/contests/abc222/editorial/2749)
- [ABC222 F 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_f)
- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-tree-metric`
