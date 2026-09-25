---
title: "半環行列・min-plus/max-min遷移"
description: "「半環行列・min-plus/max-min遷移」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 199
---

# 半環行列・min-plus/max-min遷移

習得対象の目安: **青色（1600–1999）**。行列の和と積を遷移の選択・連結に対応させ、min-plusなどへ一般化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第142単元。技能の説明を学んでから問題一覧へ進んでください。

前: [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/) ／ 次: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)

## 概要

### 半環行列・min-plus/max-min遷移

遷移の結合と候補選択を半環の積・和として行列化し、結合則を使って固定長walkを二分累乗または区間積で処理する。

### 習得する技能

- 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)。

線形遷移・行列累乗で得た考え方と実装を再利用し、半環行列・min-plus/max-min遷移の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 半環行列・min-plus/max-min遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC445 F「Exactly K Steps 2」](https://atcoder.jp/contests/abc445/tasks/abc445_f) — 主題: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)。
2. [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。 / DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。
3. [ABC236 G「Good Vertices」](https://atcoder.jp/contests/abc236/tasks/abc236_g) — 主題: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC236 G 公式解説](https://atcoder.jp/contests/abc236/editorial/3286)
- [ABC236 G 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_g)
- [ABC429 F 公式解説](https://atcoder.jp/contests/abc429/editorial/14274)
- [ABC429 F 公式問題文](https://atcoder.jp/contests/abc429/tasks/abc429_f)
- [ABC445 F 公式解説](https://atcoder.jp/contests/abc445/editorial/15907)
- [ABC445 F 公式問題文](https://atcoder.jp/contests/abc445/tasks/abc445_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-semiring-matrix-exponentiation`
