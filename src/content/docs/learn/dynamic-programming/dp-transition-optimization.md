---
title: "DP遷移を因数分解・集約して加速する"
description: "DP遷移を因数分解・集約して加速するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 76
---

# DP遷移を因数分解・集約して加速する

## 概要

### DP遷移の集約・高速化

同じ形の遷移をprefix、単調構造、剰余類などでまとめる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。

- 固定線形遷移の巨大回累乗。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC212 E「Safety Journey」](https://atcoder.jp/contests/abc212/tasks/abc212_e)
2. [ABC249 E「RLE」](https://atcoder.jp/contests/abc249/tasks/abc249_e)
3. [ABC253 E「Distance Sequence」](https://atcoder.jp/contests/abc253/tasks/abc253_e)
4. [ABC265 F「Manhattan Cafe」](https://atcoder.jp/contests/abc265/tasks/abc265_f)
5. [ABC338 G「evall」](https://atcoder.jp/contests/abc338/tasks/abc338_g)
6. [ABC370 E「Avoid K Partition」](https://atcoder.jp/contests/abc370/tasks/abc370_e)
7. [ABC372 F「Teleporting Takahashi 2」](https://atcoder.jp/contests/abc372/tasks/abc372_f)
8. [ABC442 F「Diagonal Separation 2」](https://atcoder.jp/contests/abc442/tasks/abc442_f)
9. [ABC457 F「Second Gap」](https://atcoder.jp/contests/abc457/tasks/abc457_f)
10. [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g)
11. [ABC221 H「Count Multiset」](https://atcoder.jp/contests/abc221/tasks/abc221_h)
12. [ABC243 G「Sqrt」](https://atcoder.jp/contests/abc243/tasks/abc243_g)
13. [ABC334 F「Christmas Present 2」](https://atcoder.jp/contests/abc334/tasks/abc334_f)
14. [ABC358 G「AtCoder Tour」](https://atcoder.jp/contests/abc358/tasks/abc358_g)
15. [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g)
16. [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f)
17. [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g)
- [ABC279 G「At Most 2 Colors」](https://atcoder.jp/contests/abc279/tasks/abc279_g)
- [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f)
- [ABC311 F「Yet Another Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_f)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC333 F「Bomb Game 2」](https://atcoder.jp/contests/abc333/tasks/abc333_f)
- [ABC342 F「Black Jack」](https://atcoder.jp/contests/abc342/tasks/abc342_f)
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f)
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f)
- [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g)
- [ABC446 G「221 Subsequence」](https://atcoder.jp/contests/abc446/tasks/abc446_g)

## 根拠

- [ABC212 E 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_e)
- [ABC212 E 公式解説](https://atcoder.jp/contests/abc212/editorial/2357)
- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC221 H 公式解説](https://atcoder.jp/contests/abc221/editorial/2719)
- [ABC221 H 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-dp-transition-optimization`
