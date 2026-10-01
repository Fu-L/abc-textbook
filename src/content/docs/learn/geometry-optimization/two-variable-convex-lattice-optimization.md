---
title: "二変数の凸区分線形整数最適化"
description: "「二変数の凸区分線形整数最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 231
---

# 二変数の凸区分線形整数最適化

習得対象の目安: **橙色（2400–2799）**。折れ目直線の交点から連続最小候補を作り、整数最適点が入る有限近傍を証明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 二変数の凸区分線形格子最適化

二つの整数parameter上の凸区分線形目的について、折れ目直線の交点から連続最小候補を作り、定数半径内に整数最適解があることを証明して有限格子点へ縮約する。

### 習得する技能

- 二変数の凸区分線形目的について折れ目直線の交点で連続最小候補を求め、定数距離内に整数最適点があることを証明して有限個の近傍格子点だけを評価できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

整数解を二つの自由parameterで表し、折れ目直線の交点から連続最小候補を作る。定数半径の格子点に整数最適解があることを証明して、大域探索を有限近傍の評価へ縮約する。

### このUnitでは扱わないもの

- 一変数の傾き単調性やternary searchだけで解く凸最適化、および連続最小点から整数近傍への保証を持たない一般の格子探索。

## 問題一覧

- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g) — 主題: [二変数の凸区分線形整数最適化](/learn/geometry-optimization/two-variable-convex-lattice-optimization/)（二変数の凸区分線形目的について折れ目直線の交点で連続最小候補を求め、定数距離内に整数最適点があることを証明して有限個の近傍格子点だけを評価できる。）。追加で学ぶ技能: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC459 G 公式解説](https://atcoder.jp/contests/abc459/editorial/20454)
- [ABC459 G 公式問題文](https://atcoder.jp/contests/abc459/tasks/abc459_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-two-variable-convex-lattice-optimization`
