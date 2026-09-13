---
title: "最小費用流・circulation"
description: "最小費用流・circulationの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 143
---

# 最小費用流・circulation

## 概要

### 最小費用流・circulation

流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最大流・最小カット、最短路モデル。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、最小費用流・circulationの発動条件・正当化・境界を重複なく学ぶ。

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC407 G「Domino Covering SUM」](https://atcoder.jp/contests/abc407/tasks/abc407_g)
2. [ABC224 H「Security Camera 2」](https://atcoder.jp/contests/abc224/tasks/abc224_h)
3. [ABC231 H「Minimum Coloring」](https://atcoder.jp/contests/abc231/tasks/abc231_h)
4. [ABC247 G「Dream Team」](https://atcoder.jp/contests/abc247/tasks/abc247_g)
5. [ABC421 G「Increase to make it Increasing」](https://atcoder.jp/contests/abc421/tasks/abc421_g)
6. [ABC214 H「Collecting」](https://atcoder.jp/contests/abc214/tasks/abc214_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC224 H 公式解説](https://atcoder.jp/contests/abc224/editorial/2812)
- [ABC224 H 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_h)
- [ABC231 H 公式解説](https://atcoder.jp/contests/abc231/editorial/3060)
- [ABC231 H 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-min-cost-flow`
