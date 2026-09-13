---
title: "集合・資源軸のDP"
description: "集合・資源軸のDPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 34
---

# 集合・資源軸のDP

## 概要

### 資源軸knapsack DP

容量・時間・個数などの有界資源を軸に選択の価値を更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

最小十分状態を設計できるようになった後、集合bitmaskや容量を軸にした遷移と更新順へ進む。

- 入力順や区間端点だけを状態にし、集合・容量軸を持たないDP。

## 下位単元

- [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)
- [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f)
2. [ABC383 F「Diversity」](https://atcoder.jp/contests/abc383/tasks/abc383_f)
3. [ABC269 G「Reversible Cards 2」](https://atcoder.jp/contests/abc269/tasks/abc269_g)
4. [ABC275 F「Erase Subarrays」](https://atcoder.jp/contests/abc275/tasks/abc275_f)
5. [ABC288 E「Wish List」](https://atcoder.jp/contests/abc288/tasks/abc288_e)
6. [ABC320 F「Fuel Round Trip」](https://atcoder.jp/contests/abc320/tasks/abc320_f)
7. [ABC325 F「Sensor Optimization Dilemma」](https://atcoder.jp/contests/abc325/tasks/abc325_f)
8. [ABC364 E「Maximum Glutton」](https://atcoder.jp/contests/abc364/tasks/abc364_e)
9. [ABC410 E「Battles in a Row」](https://atcoder.jp/contests/abc410/tasks/abc410_e)
10. [ABC441 F「Must Buy」](https://atcoder.jp/contests/abc441/tasks/abc441_f)
11. [ABC322 E「Product Development」](https://atcoder.jp/contests/abc322/tasks/abc322_e)
12. [ABC375 E「3 Team Division」](https://atcoder.jp/contests/abc375/tasks/abc375_e)
13. [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e)
14. [ABC307 G「Approximate Equalization」](https://atcoder.jp/contests/abc307/tasks/abc307_g)
15. [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e)
16. [ABC419 E「Subarray Sum Divisibility」](https://atcoder.jp/contests/abc419/tasks/abc419_e)
17. [ABC461 F「Total Product is N」](https://atcoder.jp/contests/abc461/tasks/abc461_f)
18. [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h)
19. [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f)
20. [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g)
21. [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f)
22. [ABC321 F「#(subset sum = K) with Add and Erase」](https://atcoder.jp/contests/abc321/tasks/abc321_f)

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-dp-subset-resource`
