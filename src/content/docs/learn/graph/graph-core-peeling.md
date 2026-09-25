---
title: "次数構造からgraph coreまたは小さなkernelへ縮約する"
description: "「次数構造からgraph coreまたは小さなkernelへ縮約する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 113
---

# 次数構造からgraph coreまたは小さなkernelへ縮約する

導入対象の目安: **水色（1200–1599）**。次数条件で頂点を取り除き、残る核を取り出す入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

連結性を探索できることを前提に、低次数頂点を反復削除してcycle coreや小さなkernelを露出させる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- DFS時刻とlowlink値による橋・関節点の判定。

## 下位単元

- [graph core・leaf peeling](/learn/graph/graph-core/) — 水色
- [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [graph core・leaf peeling](/learn/graph/graph-core/)（次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)
- [ABC267 E 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC267 E 公式解説](https://atcoder.jp/contests/abc267/editorial/4729)
- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-graph-core-peeling`
