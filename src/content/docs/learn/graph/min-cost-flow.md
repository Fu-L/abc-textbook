---
title: "最小費用流・circulation"
description: "「最小費用流・circulation」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 123
---

# 最小費用流・circulation

習得対象の目安: **黄色（2000–2399）**。残余辺の費用とpotentialを理解し、流量別の最小費用へ還元する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第145単元。技能の説明を学んでから問題一覧へ進んでください。

前: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/) ／ 次: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)

## 概要

### 最小費用流・circulation

流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。

### 習得する技能

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最大流・最小カット](/learn/graph/max-flow-min-cut/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、最小費用流・circulationの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC247 G「Dream Team」](https://atcoder.jp/contests/abc247/tasks/abc247_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)。
2. [ABC407 G「Domino Covering SUM」](https://atcoder.jp/contests/abc407/tasks/abc407_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)。
3. [ABC421 G「Increase to make it Increasing」](https://atcoder.jp/contests/abc421/tasks/abc421_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
4. [ABC224 H「Security Camera 2」](https://atcoder.jp/contests/abc224/tasks/abc224_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)。
5. [ABC231 H「Minimum Coloring」](https://atcoder.jp/contests/abc231/tasks/abc231_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)。
6. [ABC214 H「Collecting」](https://atcoder.jp/contests/abc214/tasks/abc214_h) — 主題: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。 / 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。 / 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC224 H 公式解説](https://atcoder.jp/contests/abc224/editorial/2812)
- [ABC224 H 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_h)
- [ABC231 H 公式解説](https://atcoder.jp/contests/abc231/editorial/3060)
- [ABC231 H 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-min-cost-flow`
