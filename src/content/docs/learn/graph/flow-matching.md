---
title: "フロー・マッチング・カットへ帰着する"
description: "フロー・マッチング・カットへ帰着するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 109
---

# フロー・マッチング・カットへ帰着する

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

頂点と辺のモデルを作れることを前提に、選択制約を容量・カット・マッチングへ翻訳する。

- Eulerウォークの次数・偶奇条件。

## 下位単元

- [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)
- [最大流・最小カット](/learn/graph/max-flow-min-cut/)
- [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)
- [最小費用流・circulation](/learn/graph/min-cost-flow/)
- [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/)
- [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)
- [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g)

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-flow-matching`
