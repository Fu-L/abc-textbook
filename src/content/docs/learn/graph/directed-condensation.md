---
title: "SCCで閉路・DAG順・2-SATを処理する"
description: "「SCCで閉路・DAG順・2-SATを処理する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 95
---

# SCCで閉路・DAG順・2-SATを処理する

導入対象の目安: **水色（1200–1599）**。有向グラフの循環部分と非循環部分を区別し、縮約して処理する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

到達可能性を理解した後、相互到達する頂点を強連結成分へまとめ、DAG順の伝播またはimplication graphの矛盾判定へ使う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 無向辺追加だけを扱うDSU連結成分管理。

## 下位単元

- [DAGのtopological processing](/learn/graph/dag-topological-processing/) — 緑色
- [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/) — 水色
- [有向cycle検出・sink/source peeling](/learn/graph/directed-core-peeling/) — 水色
- [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/) — 黄色
- [2-SAT・含意グラフ](/learn/graph/two-sat/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 H「Collecting」](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h)
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h)
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)
- [ABC335 E「Non-Decreasing Colorful Path」](https://atcoder.jp/contests/abc335/tasks/abc335_e)
- [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f)
- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g)

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC224 E 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC224 E 公式解説](https://atcoder.jp/contests/abc224/editorial/2814)
- [ABC245 F 公式解説](https://atcoder.jp/contests/abc245/editorial/3652)
- [ABC245 F 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-directed-condensation`
