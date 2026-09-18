---
title: "フロー・マッチング・カットへ帰着する"
description: "「フロー・マッチング・カットへ帰着する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 119
---

# フロー・マッチング・カットへ帰着する

導入対象の目安: **青色（1600–1999）**。割当て・容量・cutの制約を読み、matchingとflowへの還元を選ぶ入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

頂点と辺のモデルを作れることを前提に、選択制約を容量・カット・マッチングへ翻訳する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- Eulerウォークの次数・偶奇条件。

## 下位単元

- [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/) — 青色
- [最大流・最小カット](/learn/graph/max-flow-min-cut/) — 青色
- [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/) — 黄色
- [最小費用流・circulation](/learn/graph/min-cost-flow/) — 黄色
- [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/) — 黄色
- [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/) — 赤色
- [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/) — 橙色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g)
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g)
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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-flow-matching`
