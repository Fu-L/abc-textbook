---
title: "rake・compressで動的木DPを保つ"
description: "「rake・compressで動的木DPを保つ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 146
---

# rake・compressで動的木DPを保つ

習得対象の目安: **橙色（2400–2799）**。境界付きclusterのrake・compressを設計し、更新の影響を木DPの合成で伝播する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Static Top Treeによる動的木DP

境界頂点つきtree clusterをrake・compressで二分合成し、局所更新後の木DP値を根まで再計算する。

### 習得する技能

- 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

このUnitを直接前提とする単元: なし。

木DPの合成則を理解した後、境界頂点つきclusterをrake・compressし、局所変更を根まで再合成する。

### このUnitでは扱わないもの

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 問題一覧

- [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/)（heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。）。
- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC351 G 公式解説](https://atcoder.jp/contests/abc351/editorial/9868)
- [ABC351 G 公式問題文](https://atcoder.jp/contests/abc351/tasks/abc351_g)
- [ABC460 G 公式解説](https://atcoder.jp/contests/abc460/editorial/21012)
- [ABC460 G 公式問題文](https://atcoder.jp/contests/abc460/tasks/abc460_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-static-top-tree`
