---
title: "幾何・凸最適化"
description: "幾何・凸最適化の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 15
---

# 幾何・凸最適化

## 概要

### 幾何・凸最適化への変換

配置・距離・目的関数を幾何predicateや凸構造へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

orientationなどの幾何predicateから凸境界・傾き・dual penaltyへ進み、候補を構造的に削減する。

- なし

## 下位単元

- [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)
- [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/)
- [凸境界・半平面制約・直線包絡を扱う](/learn/geometry-optimization/convex-geometry/)
- [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)
- [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC240 G「Teleporting Takahashi」](https://atcoder.jp/contests/abc240/tasks/abc240_g)
- [ABC243 Ex「Builder Takahashi (Enhanced version)」](https://atcoder.jp/contests/abc243/tasks/abc243_h)
- [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h)
- [ABC274 F「Fishing」](https://atcoder.jp/contests/abc274/tasks/abc274_f)
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f)
- [ABC296 G「Polygon and Points」](https://atcoder.jp/contests/abc296/tasks/abc296_g)
- [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f)
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
- [ABC377 F「Avoid Queen Attack」](https://atcoder.jp/contests/abc377/tasks/abc377_f)
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e)
- [ABC437 F「Manhattan Christmas Tree 2」](https://atcoder.jp/contests/abc437/tasks/abc437_f)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-chapter-geometry-optimization`
