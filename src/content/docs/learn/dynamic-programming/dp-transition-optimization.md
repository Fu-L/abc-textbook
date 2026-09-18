---
title: "DP遷移を因数分解・集約して加速する"
description: "「DP遷移を因数分解・集約して加速する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 83
---

# DP遷移を因数分解・集約して加速する

難度の目安: **応用**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### DP遷移の集約・高速化

同じ形の遷移をprefix、単調構造、剰余類などでまとめる。

全状態へ同じ操作を行うとき、共通部分を外に持ち、例外だけを更新できないかを考える。ABC372 Fは添字の移動、ABC457 Fは全体倍率、ABC435 Gは色別状態の共通affine変換と疎な追加・削除という同じ方向の高速化である。

ABC435 Gでは隣接する色集合の対称差だけを明示更新し、共通状態への変換を遅延させる。対称差の総サイズを入力の集合サイズ総和で界すれば線形時間になる。区間分解を行わないため、Segment Treeの区間作用を前提としない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。

### このUnitでは扱わないもの

- 固定線形遷移の巨大回累乗。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC212 E「Safety Journey」](https://atcoder.jp/contests/abc212/tasks/abc212_e)
2. [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)
3. [ABC249 E「RLE」](https://atcoder.jp/contests/abc249/tasks/abc249_e)
4. [ABC253 E「Distance Sequence」](https://atcoder.jp/contests/abc253/tasks/abc253_e)
5. [ABC370 E「Avoid K Partition」](https://atcoder.jp/contests/abc370/tasks/abc370_e)
6. [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f)
7. [ABC265 F「Manhattan Cafe」](https://atcoder.jp/contests/abc265/tasks/abc265_f)
8. [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f)
9. [ABC311 F「Yet Another Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_f)
10. [ABC333 F「Bomb Game 2」](https://atcoder.jp/contests/abc333/tasks/abc333_f)
11. [ABC334 F「Christmas Present 2」](https://atcoder.jp/contests/abc334/tasks/abc334_f)
12. [ABC342 F「Black Jack」](https://atcoder.jp/contests/abc342/tasks/abc342_f)
13. [ABC372 F「Teleporting Takahashi 2」](https://atcoder.jp/contests/abc372/tasks/abc372_f)
14. [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f)
15. [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f)
16. [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f)
17. [ABC442 F「Diagonal Separation 2」](https://atcoder.jp/contests/abc442/tasks/abc442_f)
18. [ABC457 F「Second Gap」](https://atcoder.jp/contests/abc457/tasks/abc457_f)
19. [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g)
20. [ABC243 G「Sqrt」](https://atcoder.jp/contests/abc243/tasks/abc243_g)
21. [ABC279 G「At Most 2 Colors」](https://atcoder.jp/contests/abc279/tasks/abc279_g)
22. [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g)
23. [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
24. [ABC338 G「evall」](https://atcoder.jp/contests/abc338/tasks/abc338_g)
25. [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g)
26. [ABC358 G「AtCoder Tour」](https://atcoder.jp/contests/abc358/tasks/abc358_g)
27. [ABC435 G「Domino Arrangement」](https://atcoder.jp/contests/abc435/tasks/abc435_g)
28. [ABC446 G「221 Subsequence」](https://atcoder.jp/contests/abc446/tasks/abc446_g)
29. [ABC221 H「Count Multiset」](https://atcoder.jp/contests/abc221/tasks/abc221_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g)

## 根拠

- [ABC212 E 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_e)
- [ABC212 E 公式解説](https://atcoder.jp/contests/abc212/editorial/2357)
- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC221 H 公式解説](https://atcoder.jp/contests/abc221/editorial/2719)
- [ABC221 H 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-transition-optimization`
