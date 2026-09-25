---
title: "Segment Tree Beats"
description: "「Segment Tree Beats」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 47
---

# Segment Tree Beats

習得対象の目安: **橙色（2400–2799）**。一括更新が失敗する条件を要約に持たせ、再帰下降の回数まで償却解析する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第160単元。技能の説明を学んでから問題一覧へ進んでください。

前: [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/) ／ 次: [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/)

## 概要

### Segment Tree Beats

nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。

### 習得する技能

- nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

区間monoid要約で得た考え方と実装を再利用し、Segment Tree Beatsの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Segment Tree Beatsの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g) — 主題: [Segment Tree Beats](/learn/query/segment-tree-beats/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC430 G 公式解説](https://atcoder.jp/contests/abc430/editorial/14300)
- [ABC430 G 公式問題文](https://atcoder.jp/contests/abc430/tasks/abc430_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-segment-tree-beats`
