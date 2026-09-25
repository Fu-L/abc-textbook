---
title: "有向walkの周期・cycle差分gcd"
description: "「有向walkの周期・cycle差分gcd」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 99
---

# 有向walkの周期・cycle差分gcd

習得対象の目安: **黄色（2000–2399）**。SCC内の閉路長を差分のgcdでまとめ、巨大歩数の到達条件を周期へ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第144単元。技能の説明を学んでから問題一覧へ進んでください。

前: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/) ／ 次: [最小費用流・circulation](/learn/graph/min-cost-flow/)

## 概要

### 有向walkの周期・cycle差分gcd

往復可能領域でedgeごとのdepth差を集め、そのgcdをclosed walk長の周期として巨大歩数の到達可能性を判定する。

### 習得する技能

- 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)、[SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

gcd不変量・差分構造・SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、有向walkの周期・cycle差分gcdの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 有向walkの周期・cycle差分gcdの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g) — 主題: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)。既習技能: 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC306 G 公式解説](https://atcoder.jp/contests/abc306/editorial/6602)
- [ABC306 G 公式問題文](https://atcoder.jp/contests/abc306/tasks/abc306_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-directed-walk-periodicity`
