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

## 標準履修順

第186単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Gaussian整数・二平方和](/learn/number-theory/gaussian-integers-two-squares/) ／ 次: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)

## 概要

### 一般グラフの最小重み完全matching

奇cycleを含む一般グラフで全頂点をpairにし、weighted blossomまたは重み付きTutte多項式の最小次数からperfect matchingの重みを最小化する。

### 習得する技能

- 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。

二部matchingでは表せないpairing模型を作った後、奇cycleを扱うweighted blossomまたは重み付きTutte多項式で最小重みまで求める。

### このUnitでは扱わないもの

- 一般グラフの最小重み完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g) — 主題: [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC412 G 公式解説](https://atcoder.jp/contests/abc412/editorial/13380)
- [ABC412 G 公式問題文](https://atcoder.jp/contests/abc412/tasks/abc412_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-min-weight-general-perfect-matching`
