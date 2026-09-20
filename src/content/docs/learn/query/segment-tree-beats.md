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

## 概要

### Segment Tree Beats

nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

区間monoid要約で得た考え方と実装を再利用し、Segment Tree Beatsの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Segment Tree Beatsの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC430 G 公式解説](https://atcoder.jp/contests/abc430/editorial/14300)
- [ABC430 G 公式問題文](https://atcoder.jp/contests/abc430/tasks/abc430_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-segment-tree-beats`
