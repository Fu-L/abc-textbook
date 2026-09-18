---
title: "集合・資源軸のDP"
description: "「集合・資源軸のDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 69
---

# 集合・資源軸のDP

習得対象の目安: **緑色（800–1199）**。個数・容量を軸とするナップサック型DPを実装し、更新方向を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 資源軸knapsack DP

容量・時間・個数などの有界資源を軸に選択の価値を更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

最小十分状態を設計できるようになった後、集合bitmaskや容量を軸にした遷移と更新順へ進む。

### このUnitでは扱わないもの

- 入力順や区間端点だけを状態にし、集合・容量軸を持たないDP。

## 下位単元

- [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/) — 橙色
- [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/) — 水色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e)
2. [ABC288 E「Wish List」](https://atcoder.jp/contests/abc288/tasks/abc288_e)
3. [ABC322 E「Product Development」](https://atcoder.jp/contests/abc322/tasks/abc322_e)
4. [ABC364 E「Maximum Glutton」](https://atcoder.jp/contests/abc364/tasks/abc364_e)
5. [ABC375 E「3 Team Division」](https://atcoder.jp/contests/abc375/tasks/abc375_e)
6. [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e)
7. [ABC410 E「Battles in a Row」](https://atcoder.jp/contests/abc410/tasks/abc410_e)
8. [ABC419 E「Subarray Sum Divisibility」](https://atcoder.jp/contests/abc419/tasks/abc419_e)
9. [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f)
10. [ABC275 F「Erase Subarrays」](https://atcoder.jp/contests/abc275/tasks/abc275_f)
11. [ABC320 F「Fuel Round Trip」](https://atcoder.jp/contests/abc320/tasks/abc320_f)
12. [ABC321 F「#(subset sum = K) with Add and Erase」](https://atcoder.jp/contests/abc321/tasks/abc321_f)
13. [ABC325 F「Sensor Optimization Dilemma」](https://atcoder.jp/contests/abc325/tasks/abc325_f)
14. [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f)
15. [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f)
16. [ABC383 F「Diversity」](https://atcoder.jp/contests/abc383/tasks/abc383_f)
17. [ABC441 F「Must Buy」](https://atcoder.jp/contests/abc441/tasks/abc441_f)
18. [ABC461 F「Total Product is N」](https://atcoder.jp/contests/abc461/tasks/abc461_f)
19. [ABC269 G「Reversible Cards 2」](https://atcoder.jp/contests/abc269/tasks/abc269_g)
20. [ABC307 G「Approximate Equalization」](https://atcoder.jp/contests/abc307/tasks/abc307_g)
21. [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g)
22. [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h)
- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC287 F「Components」](https://atcoder.jp/contests/abc287/tasks/abc287_f)
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h)
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h)
- [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e)
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g)
- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h)
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g)
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g)
- [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f)
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)
- [ABC382 E「Expansion Packs」](https://atcoder.jp/contests/abc382/tasks/abc382_e)
- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g)
- [ABC416 F「Paint Tree 2」](https://atcoder.jp/contests/abc416/tasks/abc416_f)
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g)
- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g)

## 根拠

- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC215 E 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC215 E 公式解説](https://atcoder.jp/contests/abc215/editorial/2483)
- [ABC216 F 公式解説](https://atcoder.jp/contests/abc216/editorial/2560)
- [ABC216 F 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-subset-resource`
