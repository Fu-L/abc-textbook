---
title: "difference constraints・不等式系の最短路化"
description: "「difference constraints・不等式系の最短路化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 99
---

# difference constraints・不等式系の最短路化

習得対象の目安: **青色（1600–1999）**。不等式を辺へ変換し、負閉路と可解性・最適なpotentialの関係を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### difference constraints・不等式系の最短路化

差の上界 x_v-x_u≤c を有向辺 u→v の重みcへ写し、Bellman–Ford等の緩和と負閉路から可解性・極値・具体解を求める。

### 習得する技能

- 差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最短路モデル](/learn/graph/weighted-shortest-path/)。

このUnitを直接前提とする単元: なし。

最短路の緩和と負閉路を理解した後、差の不等式を辺へ写して制約系の可解性・極値・具体解を同じ不変条件で求める。

### このUnitでは扱わないもの

- difference constraints・不等式系の最短路化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC216 G「01Sequence」](https://atcoder.jp/contests/abc216/tasks/abc216_g) — 主題: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)（差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC404 G「Specified Range Sums」](https://atcoder.jp/contests/abc404/tasks/abc404_g) — 主題: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)（差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC404 G 公式解説](https://atcoder.jp/contests/abc404/editorial/12867)
- [ABC404 G 公式問題文](https://atcoder.jp/contests/abc404/tasks/abc404_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-difference-constraints`
