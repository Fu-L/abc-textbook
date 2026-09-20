---
title: "結合的要約と列・区間の合成"
description: "「結合的要約と列・区間の合成」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 38
---

# 結合的要約と列・区間の合成

導入対象の目安: **水色（1200–1599）**。結合則・単位元・順序を区間集約の共通言語として使う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

結合則を持つ要約という共通像から、Segment Tree・Sparse Table・SWAG・有限関数合成が使う分解方法の違いを比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- Fenwick Treeで保つ重み付き接頭辞統計。

## 下位単元

- [区間monoid要約](/learn/query/range-monoid-aggregation/) — 水色
- [有限関数・作用の合成](/learn/query/finite-function-composition/) — 水色
- [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/) — 水色
- [SWAG・two-stack queue aggregation](/learn/query/swag/) — 青色
- [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/) — 青色
- [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/) — 青色
- [動的・implicit Segment Tree](/learn/query/dynamic-segment-tree/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h)
- [ABC265 G「012 Inversion」](https://atcoder.jp/contests/abc265/tasks/abc265_g)
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f)
- [ABC322 F「Vacation Query」](https://atcoder.jp/contests/abc322/tasks/abc322_f)
- [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e)
- [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g)
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
- [ABC357 F「Two Sequence Queries」](https://atcoder.jp/contests/abc357/tasks/abc357_f)
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC424 F「Adding Chords」](https://atcoder.jp/contests/abc424/tasks/abc424_f)
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)
- [ABC453 G「Copy Query」](https://atcoder.jp/contests/abc453/tasks/abc453_g)

## 根拠

- [ABC223 F 公式解説](https://atcoder.jp/contests/abc223/editorial/2774)
- [ABC223 F 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_f)
- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-monoid-segment-tree`
