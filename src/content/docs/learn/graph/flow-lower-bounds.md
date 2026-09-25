---
title: "下限制約付きflowの実現可能性"
description: "「下限制約付きflowの実現可能性」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 122
---

# 下限制約付きflowの実現可能性

習得対象の目安: **黄色（2000–2399）**。下限を需要へ移し、補助source・sinkでcirculationの可解性を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第141単元。技能の説明を学んでから問題一覧へ進んでください。

前: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/) ／ 次: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)

## 概要

### 下限制約付きflowの実現可能性

各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。

### 習得する技能

- 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。

最大流・最小カットで得た考え方と実装を再利用し、下限制約付きflowの実現可能性の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 下限制約付きflowの実現可能性の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g) — 主題: [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)。既習技能: 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC285 G 公式解説](https://atcoder.jp/contests/abc285/editorial/5500)
- [ABC285 G 公式問題文](https://atcoder.jp/contests/abc285/tasks/abc285_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-flow-lower-bounds`
