---
title: "下限制約付きflowの実現可能性"
description: "「下限制約付きflowの実現可能性」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 123
---

# 下限制約付きflowの実現可能性

習得対象の目安: **黄色（2000–2399）**。下限を需要へ移し、補助source・sinkでcirculationの可解性を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 下限制約付きflowの実現可能性

各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。

### 習得する技能

- 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

辺の流量をl+fへ分け、残り容量u−lと頂点ごとの収支要求へ直す。super source/sinkで要求を補い、必要な辺をすべて飽和できるかを調べる。

## 成立条件と計算量

補助頂点・辺を加えた最大流の費用になる。l≤uを確認し、収支の符号を固定する。s-t流ではt→sの補助辺などを用いて循環へ直すが、実行可能性と最大流量の最適化は別段階である。

概念上の親: [フロー・マッチング・カットへ帰着する](/learn/graph/flow-matching/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。

このUnitを直接前提とする単元: なし。

最大流・最小カットで得た考え方と実装を再利用し、下限制約付きflowの実現可能性の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 下限制約付きflowの実現可能性の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g) — 主題: [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)（各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC285 G 公式解説](https://atcoder.jp/contests/abc285/editorial/5500)
- [ABC285 G 公式問題文](https://atcoder.jp/contests/abc285/tasks/abc285_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-flow-lower-bounds`
