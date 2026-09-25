---
title: "Euler順による部分木区間化"
description: "「Euler順による部分木区間化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 133
---

# Euler順による部分木区間化

習得対象の目安: **水色（1200–1599）**。DFS時刻で部分木が連続区間になることを使い、区間queryへ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Euler順による部分木区間化

DFS入退時刻で各部分木を連続区間へ写し、配列上の更新・集約へ変換する。

### 習得する技能

- Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/)、[virtual tree・auxiliary tree](/learn/tree/virtual-tree/)。

DFS入退時刻で各部分木を連続区間へ写し、配列上の更新・集約へ変換する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)（Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC406 F「Compare Tree Weights」](https://atcoder.jp/contests/abc406/tasks/abc406_f) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)（Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)（Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。）。追加で学ぶ技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)（Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC240 E 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 E 公式解説](https://atcoder.jp/contests/abc240/editorial/3426)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)
- [ABC337 G 公式解説](https://atcoder.jp/contests/abc337/editorial/9128)
- [ABC337 G 公式問題文](https://atcoder.jp/contests/abc337/tasks/abc337_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `c6f65fe967897b3b327c1c837df5c30f493b2f2f75185478863272b445d1ff85` / LearningUnit `unit-tree-euler-flattening`
