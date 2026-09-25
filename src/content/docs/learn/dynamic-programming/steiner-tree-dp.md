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

## 標準履修順

第164単元。技能の説明を学んでから問題一覧へ進んでください。

前: [鏡像法・reflection principle](/learn/combinatorics-algebra/reflection-principle/) ／ 次: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)

## 概要

### Steiner tree subset DP

terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。

### 習得する技能

- terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

最短路モデル・部分集合・bitmask状態DPで得た考え方と実装を再利用し、Steiner tree subset DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Steiner tree subset DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
2. [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC364 G 公式解説](https://atcoder.jp/contests/abc364/editorial/10547)
- [ABC364 G 公式問題文](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC395 G 公式解説](https://atcoder.jp/contests/abc395/editorial/12307)
- [ABC395 G 公式問題文](https://atcoder.jp/contests/abc395/tasks/abc395_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-steiner-tree-dp`
