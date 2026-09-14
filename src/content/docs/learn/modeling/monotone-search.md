---
title: "単調境界を証明して探索する"
description: "「単調境界を証明して探索する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 1
---

# 単調境界を証明して探索する

## 概要

### 単調境界探索

可否または値の単調性を証明し、最初・最後の成立点を探す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

### このUnitでは扱わないもの

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC270 E「Apple Baskets on Circle」](https://atcoder.jp/contests/abc270/tasks/abc270_e)
2. [ABC373 E「How to Win the Election」](https://atcoder.jp/contests/abc373/tasks/abc373_e)
3. [ABC381 E「11/22 Subsequence」](https://atcoder.jp/contests/abc381/tasks/abc381_e)
4. [ABC292 F「Regular Triangle Inside a Rectangle」](https://atcoder.jp/contests/abc292/tasks/abc292_f)
5. [ABC303 F「Damage over Time」](https://atcoder.jp/contests/abc303/tasks/abc303_f)
6. [ABC395 F「Smooth Occlusion」](https://atcoder.jp/contests/abc395/tasks/abc395_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 F「Dist Max 2」](https://atcoder.jp/contests/abc215/tasks/abc215_f)
- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g)
- [ABC246 G「Game on Tree 3」](https://atcoder.jp/contests/abc246/tasks/abc246_g)
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC269 E「Last Rook」](https://atcoder.jp/contests/abc269/tasks/abc269_e)
- [ABC293 Ex「Optimal Path Decomposition」](https://atcoder.jp/contests/abc293/tasks/abc293_h)
- [ABC295 F「substr = S」](https://atcoder.jp/contests/abc295/tasks/abc295_f)
- [ABC300 F「More Holidays」](https://atcoder.jp/contests/abc300/tasks/abc300_f)
- [ABC304 G「Max of Medians」](https://atcoder.jp/contests/abc304/tasks/abc304_g)
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g)
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f)
- [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f)
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f)
- [ABC374 E「Sensor Optimization Dilemma 2」](https://atcoder.jp/contests/abc374/tasks/abc374_e)
- [ABC388 E「Simultaneous Kagamimochi」](https://atcoder.jp/contests/abc388/tasks/abc388_e)
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g)
- [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e)
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g)
- [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g)
- [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g)
- [ABC402 F「Path to Integer」](https://atcoder.jp/contests/abc402/tasks/abc402_f)
- [ABC424 E「Cut in Half」](https://atcoder.jp/contests/abc424/tasks/abc424_e)
- [ABC427 G「Takahashi's Expectation 2」](https://atcoder.jp/contests/abc427/tasks/abc427_g)
- [ABC428 F「Pyramid Alignment」](https://atcoder.jp/contests/abc428/tasks/abc428_f)
- [ABC444 F「Half and Median」](https://atcoder.jp/contests/abc444/tasks/abc444_f)
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g)

## 根拠

- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)
- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC229 G 公式解説](https://atcoder.jp/contests/abc229/editorial/2963)
- [ABC229 G 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-monotone-search`
