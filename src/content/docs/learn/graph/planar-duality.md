---
title: "平面graph双対・cut/path対応"
description: "「平面graph双対・cut/path対応」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 127
---

# 平面graph双対・cut/path対応

習得対象の目安: **黄色（2000–2399）**。平面埋め込みのfaceを構成し、primalのcutとdualのpath・cycleを対応させる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第167単元。技能の説明を学んでから問題一覧へ進んでください。

前: [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/) ／ 次: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)

## 概要

### 平面graph双対・cut/path対応

埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。

### 習得する技能

- 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最大流・最小カット](/learn/graph/max-flow-min-cut/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、平面graph双対・cut/path対応の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 平面graph双対・cut/path対応の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g) — 主題: [平面graph双対・cut/path対応](/learn/graph/planar-duality/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC413 G 公式解説](https://atcoder.jp/contests/abc413/editorial/13403)
- [ABC413 G 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-planar-duality`
