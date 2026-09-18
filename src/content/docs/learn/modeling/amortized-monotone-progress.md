---
title: "単調進行による償却解析"
description: "「単調進行による償却解析」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 21
---

# 単調進行による償却解析

習得対象の目安: **水色（1200–1599）**。一度だけの削除やpotentialの減少に課金し、操作列全体を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単調進行による償却解析

要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC217 E「Sorting Queries」](https://atcoder.jp/contests/abc217/tasks/abc217_e)
2. [ABC302 E「Isolation」](https://atcoder.jp/contests/abc302/tasks/abc302_e)
3. [ABC403 E「Forbidden Prefix」](https://atcoder.jp/contests/abc403/tasks/abc403_e)
4. [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f)
5. [ABC428 F「Pyramid Alignment」](https://atcoder.jp/contests/abc428/tasks/abc428_f)
6. [ABC466 F「Many Mod Calculation」](https://atcoder.jp/contests/abc466/tasks/abc466_f)
7. [ABC427 G「Takahashi's Expectation 2」](https://atcoder.jp/contests/abc427/tasks/abc427_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h)
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g)
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f)
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f)
- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g)
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f)
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g)
- [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e)

## 根拠

- [ABC217 E 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC217 E 公式解説](https://atcoder.jp/contests/abc217/editorial/2577)
- [ABC255 H 公式解説](https://atcoder.jp/contests/abc255/editorial/4103)
- [ABC255 H 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC256 H 公式解説](https://atcoder.jp/contests/abc256/editorial/4113)
- [ABC256 H 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-amortized-monotone-progress`
