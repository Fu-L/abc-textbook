---
title: "一般グラフの最小重み完全matching"
description: "「一般グラフの最小重み完全matching」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 125
---

# 一般グラフの最小重み完全matching

習得対象の目安: **赤色（2800以上）**。奇cycleのblossom縮約またはTutte多項式を使う一般matchingの理論を学ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 一般グラフの最小重み完全matching

奇cycleを含む一般グラフで全頂点をpairにし、weighted blossomまたは重み付きTutte多項式の最小次数からperfect matchingの重みを最小化する。

### 習得する技能

- 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。

このUnitを直接前提とする単元: なし。

二部matchingでは表せないpairing模型を作った後、奇cycleを扱うweighted blossomまたは重み付きTutte多項式で最小重みまで求める。

### このUnitでは扱わないもの

- 一般グラフの最小重み完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g) — 主題: [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)（一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC412 G 公式解説](https://atcoder.jp/contests/abc412/editorial/13380)
- [ABC412 G 公式問題文](https://atcoder.jp/contests/abc412/tasks/abc412_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-min-weight-general-perfect-matching`
