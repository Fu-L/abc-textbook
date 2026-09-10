---
title: "反転数・重み付き接頭辞統計をFenwick Treeで保つ"
description: "反転数・重み付き接頭辞統計をFenwick Treeで保つの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 46
---

# 反転数・重み付き接頭辞統計をFenwick Treeで保つ

## 概要

### Fenwick Tree・反転数・重み付き接頭辞統計

値や座標の頻度を動的な接頭辞和で数えて反転数を求めるか、複数本を組み合わせて次数付きの区間式を評価する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 一次元・二次元累積和と差分で区間情報を線形化する。

静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

- 一般のモノイドによるSegment Treeの区間要約。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC461 E「E-liter」](https://atcoder.jp/contests/abc461/tasks/abc461_e)
2. [ABC256 F「Cumulative Cumulative Cumulative Sum」](https://atcoder.jp/contests/abc256/tasks/abc256_f)
3. [ABC287 G「Balance Update Query」](https://atcoder.jp/contests/abc287/tasks/abc287_g)
4. [ABC276 F「Double Chance」](https://atcoder.jp/contests/abc276/tasks/abc276_f)
5. [ABC351 F「Double Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_f)
6. [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC231 F「Jealous Two」](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f)
- [ABC261 F「Sorting Color Balls」](https://atcoder.jp/contests/abc261/tasks/abc261_f)
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g)
- [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f)
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g)
- [ABC341 E「Alternating String」](https://atcoder.jp/contests/abc341/tasks/abc341_e)
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g)
- [ABC378 E「Mod Sigma Problem」](https://atcoder.jp/contests/abc378/tasks/abc378_e)
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g)
- [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g)
- [ABC392 F「Insert」](https://atcoder.jp/contests/abc392/tasks/abc392_f)
- [ABC396 F「Rotated Inversions」](https://atcoder.jp/contests/abc396/tasks/abc396_f)
- [ABC406 F「Compare Tree Weights」](https://atcoder.jp/contests/abc406/tasks/abc406_f)
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g)
- [ABC436 F「Starry Landscape Photo」](https://atcoder.jp/contests/abc436/tasks/abc436_f)
- [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g)
- [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f)
- [ABC441 E「A > B substring」](https://atcoder.jp/contests/abc441/tasks/abc441_e)
- [ABC449 E「A += v」](https://atcoder.jp/contests/abc449/tasks/abc449_e)
- [ABC452 F「Interval Inversion Count」](https://atcoder.jp/contests/abc452/tasks/abc452_f)

## 根拠

- [ABC221 E 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC221 E 公式解説](https://atcoder.jp/contests/abc221/editorial/2718)
- [ABC231 F 公式解説](https://atcoder.jp/contests/abc231/editorial/3059)
- [ABC231 F 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC233 H 公式解説](https://atcoder.jp/contests/abc233/editorial/3168)
- [ABC233 H 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-weighted-prefix-fenwick`
