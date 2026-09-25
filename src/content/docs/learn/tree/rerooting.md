---
title: "rerooting・全方位木DP"
description: "「rerooting・全方位木DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 140
---

# rerooting・全方位木DP

習得対象の目安: **青色（1600–1999）**。各辺の両側の情報を設計し、prefix・suffix合成で全根の答えを求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第72単元。技能の説明を学んでから問題一覧へ進んでください。

前: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/) ／ 次: [値軸のbucket分割と区間集約](/learn/query/value-bucket-aggregation/)

## 概要

### rerooting・全方位木DP

辺の両側情報とprefix/suffix合成を用いて、全ての根に対する木DP値を線形または準線形時間で得る。

### 習得する技能

- 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

根付き木DP・部分木集約で得た考え方と実装を再利用し、rerooting・全方位木DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- rerooting・全方位木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC220 F「Distance Sums 2」](https://atcoder.jp/contests/abc220/tasks/abc220_f) — 主題: [rerooting・全方位木DP](/learn/tree/rerooting/)。
2. [ABC348 E「Minimize Sum of Distances」](https://atcoder.jp/contests/abc348/tasks/abc348_e) — 主題: [rerooting・全方位木DP](/learn/tree/rerooting/)。
3. [ABC223 G「Vertex Deletion」](https://atcoder.jp/contests/abc223/tasks/abc223_g) — 主題: [rerooting・全方位木DP](/learn/tree/rerooting/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h) — 主題: [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。
- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)。既習技能: 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。

## 根拠

- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC223 G 公式解説](https://atcoder.jp/contests/abc223/editorial/2775)
- [ABC223 G 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_g)
- [ABC311 H 公式解説](https://atcoder.jp/contests/abc311/editorial/6814)
- [ABC311 H 公式問題文](https://atcoder.jp/contests/abc311/tasks/abc311_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-rerooting`
