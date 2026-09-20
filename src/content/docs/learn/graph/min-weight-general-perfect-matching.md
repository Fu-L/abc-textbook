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

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。

二部matchingでは表せないpairing模型を作った後、奇cycleを扱うweighted blossomまたは重み付きTutte多項式で最小重みまで求める。

### このUnitでは扱わないもの

- 一般グラフの最小重み完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC412 G 公式解説](https://atcoder.jp/contests/abc412/editorial/13380)
- [ABC412 G 公式問題文](https://atcoder.jp/contests/abc412/tasks/abc412_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-min-weight-general-perfect-matching`
