---
title: "幾何・凸最適化"
description: "幾何・凸最適化の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 8
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
- [凸境界・半平面制約・直線包絡を扱う](/learn/geometry-optimization/convex-geometry/)
- [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/)
- [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)
- [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC225 E「7」](https://atcoder.jp/contests/abc225/tasks/abc225_e)
- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g)
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
- [ABC240 G「Teleporting Takahashi」](https://atcoder.jp/contests/abc240/tasks/abc240_g)
- [ABC243 Ex「Builder Takahashi (Enhanced version)」](https://atcoder.jp/contests/abc243/tasks/abc243_h)
- [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f)
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g)
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h)
- [ABC274 F「Fishing」](https://atcoder.jp/contests/abc274/tasks/abc274_f)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f)
- [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f)
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f)
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f)
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e)
- [ABC424 F「Adding Chords」](https://atcoder.jp/contests/abc424/tasks/abc424_f)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g)
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)
- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e)

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-chapter-geometry-optimization`
