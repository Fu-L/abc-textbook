---
title: "最小費用流・circulation"
description: "「最小費用流・circulation」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 122
---

# 最小費用流・circulation

習得対象の目安: **黄色（2000–2399）**。残余辺の費用とpotentialを理解し、流量別の最小費用へ還元する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 最小費用流・circulation

流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。

### 習得する技能

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最大流・最小カット](/learn/graph/max-flow-min-cut/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

このUnitを直接前提とする単元: なし。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、最小費用流・circulationの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC247 G「Dream Team」](https://atcoder.jp/contests/abc247/tasks/abc247_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC407 G「Domino Covering SUM」](https://atcoder.jp/contests/abc407/tasks/abc407_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC421 G「Increase to make it Increasing」](https://atcoder.jp/contests/abc421/tasks/abc421_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC214 H「Collecting」](https://atcoder.jp/contests/abc214/tasks/abc214_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。）。
- [ABC224 H「Security Camera 2」](https://atcoder.jp/contests/abc224/tasks/abc224_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC231 H「Minimum Coloring」](https://atcoder.jp/contests/abc231/tasks/abc231_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。） / [最短路モデル](/learn/graph/weighted-shortest-path/)（辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。） / [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC224 H 公式解説](https://atcoder.jp/contests/abc224/editorial/2812)
- [ABC224 H 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_h)
- [ABC231 H 公式解説](https://atcoder.jp/contests/abc231/editorial/3060)
- [ABC231 H 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `33e4c8113deec1ccee9b61a9379e197530cbd5a6fb918e3b477bf71e2a2003da` / LearningUnit `unit-min-cost-flow`
