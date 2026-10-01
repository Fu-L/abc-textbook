---
title: "木のancestor・部分木・pathを索引化する"
description: "「木のancestor・部分木・pathを索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 134
---

# 木のancestor・部分木・pathを索引化する

導入対象の目安: **水色（1200–1599）**。木を区間や祖先関係へ写し、配列上の算法へ接続する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

基本的な木DFSを土台に、binary liftingでancestor・LCAを問い合わせ、Euler in/outで部分木を区間化し、HLDでpathをheavy path列へ分け、対象頂点と必要なLCAだけをvirtual treeへ縮約する。包含関係を木に変換する方法は独立した節で学ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- LCAという概念で対象を一意分類するだけで、ancestor query・Euler区間化・HLD・virtual treeを実装利用しない数え上げ、および重心による再帰分解。

## 下位単元

- [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/) — 水色
- [ancestor query・LCA](/learn/tree/tree-ancestor-lca/) — 水色
- [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/) — 青色
- [virtual tree・auxiliary tree](/learn/tree/virtual-tree/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC267 F「Exactly K Steps」](https://atcoder.jp/contests/abc267/tasks/abc267_f) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC329 G「Delivery on Tree」](https://atcoder.jp/contests/abc329/tasks/abc329_g) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/)（heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。）。
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)（laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。） / [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。）。
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。） / [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。

## 根拠

- [ABC240 E 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 E 公式解説](https://atcoder.jp/contests/abc240/editorial/3426)
- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-tree-decomposition`
