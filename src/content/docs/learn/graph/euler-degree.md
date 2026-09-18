---
title: "次数parityからwalkや選択辺集合を判定・構成する"
description: "「次数parityからwalkや選択辺集合を判定・構成する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 115
---

# 次数parityからwalkや選択辺集合を判定・構成する

## 概要

グラフを探索できることを前提に、全辺walkの成立性や選択辺集合の端点条件を次数parityで特徴付け、葉から判定・構成する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 容量付きフロー・マッチング・最小カットへの帰着。

## 下位単元

- [Euler trail・circuit](/learn/graph/euler-trail-circuit/) — 標準
- [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/) — 応用

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)

## 根拠

- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC286 G 公式解説](https://atcoder.jp/contests/abc286/editorial/5573)
- [ABC286 G 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_g)
- [ABC336 G 公式解説](https://atcoder.jp/contests/abc336/editorial/9060)
- [ABC336 G 公式問題文](https://atcoder.jp/contests/abc336/tasks/abc336_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-euler-degree`
