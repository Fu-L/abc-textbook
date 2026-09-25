---
title: "difference constraints・不等式系の最短路化"
description: "「difference constraints・不等式系の最短路化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 94
---

# difference constraints・不等式系の最短路化

習得対象の目安: **青色（1600–1999）**。不等式を辺へ変換し、負閉路と可解性・最適なpotentialの関係を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第76単元。技能の説明を学んでから問題一覧へ進んでください。

前: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/) ／ 次: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)

## 概要

### difference constraints・不等式系の最短路化

差の上界 x_v-x_u≤c を有向辺 u→v の重みcへ写し、Bellman–Ford等の緩和と負閉路から可解性・極値・具体解を求める。

### 習得する技能

- 差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最短路モデル](/learn/graph/weighted-shortest-path/)。

最短路の緩和と負閉路を理解した後、差の不等式を辺へ写して制約系の可解性・極値・具体解を同じ不変条件で求める。

### このUnitでは扱わないもの

- difference constraints・不等式系の最短路化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC404 G「Specified Range Sums」](https://atcoder.jp/contests/abc404/tasks/abc404_g) — 主題: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
2. [ABC216 G「01Sequence」](https://atcoder.jp/contests/abc216/tasks/abc216_g) — 主題: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC404 G 公式解説](https://atcoder.jp/contests/abc404/editorial/12867)
- [ABC404 G 公式問題文](https://atcoder.jp/contests/abc404/tasks/abc404_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-difference-constraints`
