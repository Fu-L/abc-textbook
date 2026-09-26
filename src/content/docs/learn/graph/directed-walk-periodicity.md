---
title: "有向walkの周期・cycle差分gcd"
description: "「有向walkの周期・cycle差分gcd」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 100
---

# 有向walkの周期・cycle差分gcd

習得対象の目安: **黄色（2000–2399）**。SCC内の閉路長を差分のgcdでまとめ、巨大歩数の到達条件を周期へ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有向walkの周期・cycle差分gcd

往復可能領域でedgeごとのdepth差を集め、そのgcdをclosed walk長の周期として巨大歩数の到達可能性を判定する。

### 習得する技能

- 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（後の章）、[SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

このUnitを直接前提とする単元: なし。

gcd不変量・差分構造・SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、有向walkの周期・cycle差分gcdの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 有向walkの周期・cycle差分gcdの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g) — 主題: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)（往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。）。既習技能: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC306 G 公式解説](https://atcoder.jp/contests/abc306/editorial/6602)
- [ABC306 G 公式問題文](https://atcoder.jp/contests/abc306/tasks/abc306_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1d03846ca5c5afa48c210e3527c3d0a048880fc11e6612e8ba16e5387f6de90a` / LearningUnit `unit-directed-walk-periodicity`
