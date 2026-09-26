---
title: "平面graph双対・cut/path対応"
description: "「平面graph双対・cut/path対応」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 126
---

# 平面graph双対・cut/path対応

習得対象の目安: **黄色（2000–2399）**。平面埋め込みのfaceを構成し、primalのcutとdualのpath・cycleを対応させる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 平面graph双対・cut/path対応

埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。

### 習得する技能

- 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最大流・最小カット](/learn/graph/max-flow-min-cut/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

このUnitを直接前提とする単元: なし。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、平面graph双対・cut/path対応の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 平面graph双対・cut/path対応の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g) — 主題: [平面graph双対・cut/path対応](/learn/graph/planar-duality/)（埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC413 G 公式解説](https://atcoder.jp/contests/abc413/editorial/13403)
- [ABC413 G 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `33e4c8113deec1ccee9b61a9379e197530cbd5a6fb918e3b477bf71e2a2003da` / LearningUnit `unit-planar-duality`
