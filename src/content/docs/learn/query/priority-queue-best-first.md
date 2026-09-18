---
title: "priority queue・best-first列挙"
description: "「priority queue・best-first列挙」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 31
---

# priority queue・best-first列挙

習得対象の目安: **緑色（800–1199）**。heapの操作を使い、現在選べる候補だけを管理して順に取り出す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### priority queue・best-first列挙

現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e)
2. [ABC376 E「Max × Sum」](https://atcoder.jp/contests/abc376/tasks/abc376_e)
3. [ABC384 E「Takahashi is Slime 2」](https://atcoder.jp/contests/abc384/tasks/abc384_e)
4. [ABC407 E「Most Valuable Parentheses」](https://atcoder.jp/contests/abc407/tasks/abc407_e)
5. [ABC440 E「Cookies」](https://atcoder.jp/contests/abc440/tasks/abc440_e)
6. [ABC252 F「Bread」](https://atcoder.jp/contests/abc252/tasks/abc252_f)
7. [ABC391 F「K-th Largest Triplet」](https://atcoder.jp/contests/abc391/tasks/abc391_f)
8. [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 E「Packing Under Range Regulations」](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC217 E「Sorting Queries」](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f)
- [ABC250 G「Stonks」](https://atcoder.jp/contests/abc250/tasks/abc250_g)
- [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e)
- [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e)
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f)
- [ABC308 F「Vouchers」](https://atcoder.jp/contests/abc308/tasks/abc308_f)
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f)
- [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e)
- [ABC342 G「Retroactive Range Chmax」](https://atcoder.jp/contests/abc342/tasks/abc342_g)
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f)
- [ABC433 E「Max Matrix 2」](https://atcoder.jp/contests/abc433/tasks/abc433_e)

## 根拠

- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC217 E 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC217 E 公式解説](https://atcoder.jp/contests/abc217/editorial/2577)
- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-priority-queue-best-first`
