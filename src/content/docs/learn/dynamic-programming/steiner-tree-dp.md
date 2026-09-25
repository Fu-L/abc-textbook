---
title: "Steiner tree subset DP"
description: "「Steiner tree subset DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 72
---

# Steiner tree subset DP

習得対象の目安: **橙色（2400–2799）**。terminal集合の分割と多始点最短路を交互に使い、部分解の合成を正当化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Steiner tree subset DP

terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。

### 習得する技能

- terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[最短路モデル](/learn/graph/weighted-shortest-path/)（後の章）。

このUnitを直接前提とする単元: なし。

最短路モデル・部分集合・bitmask状態DPで得た考え方と実装を再利用し、Steiner tree subset DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Steiner tree subset DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)（terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)（terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC364 G 公式解説](https://atcoder.jp/contests/abc364/editorial/10547)
- [ABC364 G 公式問題文](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC395 G 公式解説](https://atcoder.jp/contests/abc395/editorial/12307)
- [ABC395 G 公式問題文](https://atcoder.jp/contests/abc395/tasks/abc395_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-steiner-tree-dp`
