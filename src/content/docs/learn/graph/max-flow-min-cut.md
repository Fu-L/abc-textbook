---
title: "最大流・最小カット"
description: "最大流・最小カットの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 124
---

# 最大流・最小カット

## 概要

### 最大流・最小カット

選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 状態グラフのモデリングと探索。

状態グラフのモデリングと探索で得た考え方と実装を再利用し、最大流・最小カットの発動条件・正当化・境界を重複なく学ぶ。

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC225 G「X」](https://atcoder.jp/contests/abc225/tasks/abc225_g)
2. [ABC239 G「Builder Takahashi」](https://atcoder.jp/contests/abc239/tasks/abc239_g)
3. [ABC259 G「Grid Card Game」](https://atcoder.jp/contests/abc259/tasks/abc259_g)
4. [ABC318 G「Typical Path Problem」](https://atcoder.jp/contests/abc318/tasks/abc318_g)
5. [ABC326 G「Unlock Achievement」](https://atcoder.jp/contests/abc326/tasks/abc326_g)
6. [ABC347 G「Grid Coloring 2」](https://atcoder.jp/contests/abc347/tasks/abc347_g)
7. [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g)
8. [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g)
9. [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g)
10. [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g)
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g)

## 根拠

- [ABC225 G 公式解説](https://atcoder.jp/contests/abc225/editorial/2854)
- [ABC225 G 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_g)
- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC239 G 公式解説](https://atcoder.jp/contests/abc239/editorial/3393)
- [ABC239 G 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-max-flow-min-cut`
