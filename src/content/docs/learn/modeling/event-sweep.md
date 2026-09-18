---
title: "event順にactive集合を更新する"
description: "「event順にactive集合を更新する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 16
---

# event順にactive集合を更新する

習得対象の目安: **水色（1200–1599）**。時刻・座標で整列し、同時eventの順序とactive集合の不変量を保つ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### event・値順のオフライン走査

値・時刻・座標順にeventを並べ、同値eventの処理順を定めてactive集合や集約を増分更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。

### このUnitでは扱わないもの

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 下位単元

- [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/) — 橙色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC214 E「Packing Under Range Regulations」](https://atcoder.jp/contests/abc214/tasks/abc214_e)
2. [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e)
3. [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e)
4. [ABC368 E「Train Delay」](https://atcoder.jp/contests/abc368/tasks/abc368_e)
5. [ABC401 E「Reachable Set」](https://atcoder.jp/contests/abc401/tasks/abc401_e)
6. [ABC433 E「Max Matrix 2」](https://atcoder.jp/contests/abc433/tasks/abc433_e)
7. [ABC453 E「Team Division」](https://atcoder.jp/contests/abc453/tasks/abc453_e)
8. [ABC274 F「Fishing」](https://atcoder.jp/contests/abc274/tasks/abc274_f)
9. [ABC308 F「Vouchers」](https://atcoder.jp/contests/abc308/tasks/abc308_f)
10. [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f)
11. [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f)
12. [ABC449 F「Grid Clipping」](https://atcoder.jp/contests/abc449/tasks/abc449_f)
13. [ABC296 G「Polygon and Points」](https://atcoder.jp/contests/abc296/tasks/abc296_g)
14. [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g)
15. [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC223 H「Xor Query」](https://atcoder.jp/contests/abc223/tasks/abc223_h)
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC231 F「Jealous Two」](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g)
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h)
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f)
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f)
- [ABC309 F「Box in Box」](https://atcoder.jp/contests/abc309/tasks/abc309_f)
- [ABC327 F「Apples」](https://atcoder.jp/contests/abc327/tasks/abc327_f)
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g)
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g)
- [ABC346 G「Alone」](https://atcoder.jp/contests/abc346/tasks/abc346_g)
- [ABC351 F「Double Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_f)
- [ABC360 F「InterSections」](https://atcoder.jp/contests/abc360/tasks/abc360_f)
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g)
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e)
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g)
- [ABC436 F「Starry Landscape Photo」](https://atcoder.jp/contests/abc436/tasks/abc436_f)
- [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g)
- [ABC447 G「Div. 1 & Div. 2」](https://atcoder.jp/contests/abc447/tasks/abc447_g)
- [ABC449 E「A += v」](https://atcoder.jp/contests/abc449/tasks/abc449_e)

## 根拠

- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC223 H 公式解説](https://atcoder.jp/contests/abc223/editorial/2784)
- [ABC223 H 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_h)
- [ABC224 E 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC224 E 公式解説](https://atcoder.jp/contests/abc224/editorial/2814)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-event-sweep`
