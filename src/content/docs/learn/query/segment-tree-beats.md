---
title: "Segment Tree Beats"
description: "Segment Tree Beatsの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 156
---

# Segment Tree Beats

## 概要

### Segment Tree Beats

nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 区間monoid要約。

区間monoid要約で得た考え方と実装を再利用し、Segment Tree Beatsの発動条件・正当化・境界を重複なく学ぶ。

- Segment Tree Beatsの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC430 G 公式解説](https://atcoder.jp/contests/abc430/editorial/14300)
- [ABC430 G 公式問題文](https://atcoder.jp/contests/abc430/tasks/abc430_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-segment-tree-beats`
