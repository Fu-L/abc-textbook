---
title: "SCC・縮約DAG・トポロジカル順序"
description: "「SCC・縮約DAG・トポロジカル順序」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 97
---

# SCC・縮約DAG・トポロジカル順序

習得対象の目安: **水色（1200–1599）**。相互到達性で頂点をまとめ、縮約後がDAGになることを使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### SCC・縮約DAG・トポロジカル順序

強連結成分を一頂点へ縮約し、閉路を除いたDAG上の順序・DP・coverへ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [DAGのtopological processing](/learn/graph/dag-topological-processing/)。

DAGのtopological processingで得た考え方と実装を再利用し、SCC・縮約DAG・トポロジカル順序の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- SCC・縮約DAG・トポロジカル順序の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 H「Collecting」](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g)
- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g)

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC306 G 公式解説](https://atcoder.jp/contests/abc306/editorial/6602)
- [ABC306 G 公式問題文](https://atcoder.jp/contests/abc306/tasks/abc306_g)
- [ABC374 G 公式解説](https://atcoder.jp/contests/abc374/editorial/11099)
- [ABC374 G 公式問題文](https://atcoder.jp/contests/abc374/tasks/abc374_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-scc-condensation`
