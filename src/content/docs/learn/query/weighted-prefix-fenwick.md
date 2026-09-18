---
title: "反転数・重み付き接頭辞統計をFenwick Treeで保つ"
description: "「反転数・重み付き接頭辞統計をFenwick Treeで保つ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 37
---

# 反転数・重み付き接頭辞統計をFenwick Treeで保つ

難度の目安: **標準**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Fenwick Tree・反転数・重み付き接頭辞統計

値や座標の頻度を動的な接頭辞和で数えて反転数を求めるか、複数本を組み合わせて次数付きの区間式を評価する。

ABC296 Fでは、二列のmultisetが一致し、値がすべて異なる場合に反転数の偶奇を比較する。左から値を追加し、既出個数から現在値以下のprefix頻度を引けば新たな反転数が得られる。重複がある場合に置換の偶奇を調整できるという証明と、その不変量を計算するFenwick treeの役割を分ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)。

静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

### このUnitでは扱わないもの

- 一般のモノイドによるSegment Treeの区間要約。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e)
2. [ABC341 E「Alternating String」](https://atcoder.jp/contests/abc341/tasks/abc341_e)
3. [ABC378 E「Mod Sigma Problem」](https://atcoder.jp/contests/abc378/tasks/abc378_e)
4. [ABC441 E「A > B substring」](https://atcoder.jp/contests/abc441/tasks/abc441_e)
5. [ABC449 E「A += v」](https://atcoder.jp/contests/abc449/tasks/abc449_e)
6. [ABC461 E「E-liter」](https://atcoder.jp/contests/abc461/tasks/abc461_e)
7. [ABC231 F「Jealous Two」](https://atcoder.jp/contests/abc231/tasks/abc231_f)
8. [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f)
9. [ABC256 F「Cumulative Cumulative Cumulative Sum」](https://atcoder.jp/contests/abc256/tasks/abc256_f)
10. [ABC261 F「Sorting Color Balls」](https://atcoder.jp/contests/abc261/tasks/abc261_f)
11. [ABC276 F「Double Chance」](https://atcoder.jp/contests/abc276/tasks/abc276_f)
12. [ABC296 F「Simultaneous Swap」](https://atcoder.jp/contests/abc296/tasks/abc296_f)
13. [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f)
14. [ABC351 F「Double Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_f)
15. [ABC392 F「Insert」](https://atcoder.jp/contests/abc392/tasks/abc392_f)
16. [ABC396 F「Rotated Inversions」](https://atcoder.jp/contests/abc396/tasks/abc396_f)
17. [ABC436 F「Starry Landscape Photo」](https://atcoder.jp/contests/abc436/tasks/abc436_f)
18. [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f)
19. [ABC452 F「Interval Inversion Count」](https://atcoder.jp/contests/abc452/tasks/abc452_f)
20. [ABC287 G「Balance Update Query」](https://atcoder.jp/contests/abc287/tasks/abc287_g)
21. [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g)
22. [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g)
23. [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g)
24. [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g)
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g)
- [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g)
- [ABC406 F「Compare Tree Weights」](https://atcoder.jp/contests/abc406/tasks/abc406_f)

## 根拠

- [ABC221 E 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC221 E 公式解説](https://atcoder.jp/contests/abc221/editorial/2718)
- [ABC231 F 公式解説](https://atcoder.jp/contests/abc231/editorial/3059)
- [ABC231 F 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC233 H 公式解説](https://atcoder.jp/contests/abc233/editorial/3168)
- [ABC233 H 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-weighted-prefix-fenwick`
