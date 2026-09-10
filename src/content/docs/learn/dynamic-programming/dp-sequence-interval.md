---
title: "列・区間・分割のDP"
description: "列・区間・分割のDPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 34
---

# 列・区間・分割のDP

## 概要

### 区間・分割DP

区間またはprefixの分割点を遷移にし、局所解の合成を行う。

### 列・subsequence DP

列のprefixや最後に選んだ要素を状態にし、順序を保つ選択を組み立てる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

状態設計を土台に、列順を保つ選択と区間の分割点という二つの合成方法を学ぶ。

- bitmask集合や容量だけを状態にし、列順・区間分割を持たないDP。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC230 F「Predilection」](https://atcoder.jp/contests/abc230/tasks/abc230_f)
2. [ABC238 F「Two Exams」](https://atcoder.jp/contests/abc238/tasks/abc238_f)
3. [ABC252 G「Pre-Order」](https://atcoder.jp/contests/abc252/tasks/abc252_g)
4. [ABC262 G「LIS with Stack」](https://atcoder.jp/contests/abc262/tasks/abc262_g)
5. [ABC285 E「Work or Rest」](https://atcoder.jp/contests/abc285/tasks/abc285_e)
6. [ABC292 G「Count Strictly Increasing Sequences」](https://atcoder.jp/contests/abc292/tasks/abc292_g)
7. [ABC299 F「Square Subsequence」](https://atcoder.jp/contests/abc299/tasks/abc299_f)
8. [ABC325 G「offence」](https://atcoder.jp/contests/abc325/tasks/abc325_g)
9. [ABC327 E「Maximize Rating」](https://atcoder.jp/contests/abc327/tasks/abc327_e)
10. [ABC362 E「Count Arithmetic Subsequences」](https://atcoder.jp/contests/abc362/tasks/abc362_e)
11. [ABC400 F「Happy Birthday! 3」](https://atcoder.jp/contests/abc400/tasks/abc400_f)
12. [ABC439 E「Kite」](https://atcoder.jp/contests/abc439/tasks/abc439_e)
13. [ABC386 F「Operate K」](https://atcoder.jp/contests/abc386/tasks/abc386_f)
14. [ABC466 E「Range Flip」](https://atcoder.jp/contests/abc466/tasks/abc466_e)
15. [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f)
16. [ABC233 G「Strongest Takahashi」](https://atcoder.jp/contests/abc233/tasks/abc233_g)
17. [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f)
18. [ABC217 F「Make Pair」](https://atcoder.jp/contests/abc217/tasks/abc217_f)
19. [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h)
20. [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f)
21. [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f)
22. [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e)
23. [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f)
24. [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f)
25. [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e)
26. [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g)
27. [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
28. [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g)
29. [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
30. [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
31. [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
32. [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f)
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g)
- [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f)
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h)
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h)
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC345 E「Colorful Subsequence」](https://atcoder.jp/contests/abc345/tasks/abc345_e)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)

## 根拠

- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC217 F 公式解説](https://atcoder.jp/contests/abc217/editorial/2584)
- [ABC217 F 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-dp-sequence-interval`
