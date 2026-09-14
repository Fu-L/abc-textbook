---
title: "kinetic sorting・交差event順序更新"
description: "「kinetic sorting・交差event順序更新」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 171
---

# kinetic sorting・交差event順序更新

## 概要

### kinetic sorting・交差event順序更新

連続parameterで隣接要素の順序が入れ替わる時刻だけをevent化し、次の有効交差を処理して全順序を更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: event順にactive集合を更新する。

event・値順のオフライン走査で得た考え方と実装を再利用し、kinetic sorting・交差event順序更新の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- kinetic sorting・交差event順序更新の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC344 G「Points and Comparison」](https://atcoder.jp/contests/abc344/tasks/abc344_g)
2. [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC257 H 公式解説](https://atcoder.jp/contests/abc257/editorial/4168)
- [ABC257 H 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC344 G 公式解説](https://atcoder.jp/contests/abc344/editorial/9491)
- [ABC344 G 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-kinetic-order-maintenance`
