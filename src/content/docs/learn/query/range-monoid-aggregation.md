---
title: "区間monoid要約"
description: "「区間monoid要約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 39
---

# 区間monoid要約

習得対象の目安: **水色（1200–1599）**。十分な要約と結合演算を定義し、Segment Treeへ正しく載せる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 区間monoid要約

queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC432 E「Clamp」](https://atcoder.jp/contests/abc432/tasks/abc432_e)
2. [ABC223 F「Parenthesis Checking」](https://atcoder.jp/contests/abc223/tasks/abc223_f)
3. [ABC254 F「Rectangle GCD」](https://atcoder.jp/contests/abc254/tasks/abc254_f)
4. [ABC262 F「Erase and Rotate」](https://atcoder.jp/contests/abc262/tasks/abc262_f)
5. [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f)
6. [ABC285 F「Substring of Sorted String」](https://atcoder.jp/contests/abc285/tasks/abc285_f)
7. [ABC309 F「Box in Box」](https://atcoder.jp/contests/abc309/tasks/abc309_f)
8. [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f)
9. [ABC343 F「Second Largest Query」](https://atcoder.jp/contests/abc343/tasks/abc343_f)
10. [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f)
11. [ABC365 F「Takahashi on Grid」](https://atcoder.jp/contests/abc365/tasks/abc365_f)
12. [ABC415 F「Max Combo」](https://atcoder.jp/contests/abc415/tasks/abc415_f)
13. [ABC418 F「We're teapots」](https://atcoder.jp/contests/abc418/tasks/abc418_f)
14. [ABC437 F「Manhattan Christmas Tree 2」](https://atcoder.jp/contests/abc437/tasks/abc437_f)
15. [ABC440 F「Egoism」](https://atcoder.jp/contests/abc440/tasks/abc440_f)
16. [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f)
17. [ABC299 G「Minimum Permutation」](https://atcoder.jp/contests/abc299/tasks/abc299_g)
18. [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g)
19. [ABC434 G「Keyboard」](https://atcoder.jp/contests/abc434/tasks/abc434_g)
20. [ABC447 G「Div. 1 & Div. 2」](https://atcoder.jp/contests/abc447/tasks/abc447_g)
21. [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h)
22. [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h)
23. [ABC292 Ex「Rating Estimator」](https://atcoder.jp/contests/abc292/tasks/abc292_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h)
- [ABC265 G「012 Inversion」](https://atcoder.jp/contests/abc265/tasks/abc265_g)
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC322 F「Vacation Query」](https://atcoder.jp/contests/abc322/tasks/abc322_f)
- [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e)
- [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g)
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
- [ABC357 F「Two Sequence Queries」](https://atcoder.jp/contests/abc357/tasks/abc357_f)
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
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
- [ABC246 H 公式解説](https://atcoder.jp/contests/abc246/editorial/3705)
- [ABC246 H 公式問題文](https://atcoder.jp/contests/abc246/tasks/abc246_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-range-monoid-aggregation`
