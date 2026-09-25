---
title: "ancestor query・LCA"
description: "「ancestor query・LCA」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 135
---

# ancestor query・LCA

習得対象の目安: **水色（1200–1599）**。深さ調整とbinary liftingを用い、LCA・祖先・距離のqueryを処理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第63単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/) ／ 次: [graph core・leaf peeling](/learn/graph/graph-core/)

## 概要

### ancestor query・LCA

根付き木の祖先関係を時刻またはbinary liftingで索引化し、LCAと木上距離を答える。

### 習得する技能

- binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [doubling・binary lifting](/learn/graph/binary-lifting/)。

doubling・binary liftingで得た考え方と実装を再利用し、ancestor query・LCAの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- ancestor query・LCAの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
2. [ABC267 F「Exactly K Steps」](https://atcoder.jp/contests/abc267/tasks/abc267_f) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。
3. [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。
4. [ABC298 Ex「Sum of Min of Length」](https://atcoder.jp/contests/abc298/tasks/abc298_h) — 主題: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。
5. [ABC329 G「Delivery on Tree」](https://atcoder.jp/contests/abc329/tasks/abc329_g) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。
- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

## 根拠

- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)
- [ABC298 H 公式解説](https://atcoder.jp/contests/abc298/editorial/6218)
- [ABC298 H 公式問題文](https://atcoder.jp/contests/abc298/tasks/abc298_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-tree-ancestor-lca`
