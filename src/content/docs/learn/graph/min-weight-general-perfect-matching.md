---
title: "一般グラフの最小重み完全matching"
description: "「一般グラフの最小重み完全matching」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 124
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

- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g) — 主題: [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)（一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC412 G 公式解説](https://atcoder.jp/contests/abc412/editorial/13380)
- [ABC412 G 公式問題文](https://atcoder.jp/contests/abc412/tasks/abc412_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-min-weight-general-perfect-matching`
