---
title: "ordered set・multisetの動的順序管理"
description: "「ordered set・multisetの動的順序管理」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 32
---

# ordered set・multisetの動的順序管理

習得対象の目安: **緑色（800–1199）**。前後要素・重複を管理し、二集合に分けて境界と集計値を保つ基本操作を学ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### ordered set・multisetの動的順序管理

比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e)
2. [ABC306 E「Best Performances」](https://atcoder.jp/contests/abc306/tasks/abc306_e)
3. [ABC330 E「Mex and Update」](https://atcoder.jp/contests/abc330/tasks/abc330_e)
4. [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e)
5. [ABC308 G「Minimum Xor Pair Query」](https://atcoder.jp/contests/abc308/tasks/abc308_g)
6. [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e)
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e)
- [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g)
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f)
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f)
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g)
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g)
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f)
- [ABC418 F「We're teapots」](https://atcoder.jp/contests/abc418/tasks/abc418_f)
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g)

## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC245 E 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_e)
- [ABC245 E 公式解説](https://atcoder.jp/contests/abc245/editorial/3635)
- [ABC268 H 公式解説](https://atcoder.jp/contests/abc268/editorial/4786)
- [ABC268 H 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-ordered-set-multiset`
