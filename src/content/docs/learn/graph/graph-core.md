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

## 概要

### graph core・leaf peeling

次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。

### 習得する技能

- 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)。

次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- graph core・leaf peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC266 F「Well-defined Path Queries on a Namori」](https://atcoder.jp/contests/abc266/tasks/abc266_f) — 主題: [graph core・leaf peeling](/learn/graph/graph-core/)（次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [graph core・leaf peeling](/learn/graph/graph-core/)（次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)
- [ABC267 E 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC267 E 公式解説](https://atcoder.jp/contests/abc267/editorial/4729)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-graph-core`
