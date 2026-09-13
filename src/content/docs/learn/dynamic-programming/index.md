---
title: "動的計画法"
description: "動的計画法の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 0
---

# 動的計画法

## 概要

### DP状態と遷移

未来に必要な情報を状態とし、遷移と基底を設計する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

状態と遷移の設計を共通言語にし、集合・列・確率・ゲーム・遷移高速化へ進む土台を作る。

- なし

## 下位単元

- [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)
- [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)
- [列・区間・分割のDP](/learn/dynamic-programming/dp-sequence-interval/)
- [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)
- [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)
- [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)
- [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)
- [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)
- [接頭辞から更新する有限状態DP](/learn/dynamic-programming/dp-digit-string/)
- [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)
- [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)
- [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)
- [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/)
- [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h)
- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC227 E「Swap」](https://atcoder.jp/contests/abc227/tasks/abc227_e)
- [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f)
- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC236 E「Average and Median」](https://atcoder.jp/contests/abc236/tasks/abc236_e)
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h)
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
- [ABC265 E「Warp」](https://atcoder.jp/contests/abc265/tasks/abc265_e)
- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e)
- [ABC273 G「Row Column Sums 2」](https://atcoder.jp/contests/abc273/tasks/abc273_g)
- [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g)
- [ABC281 G「Farthest City」](https://atcoder.jp/contests/abc281/tasks/abc281_g)
- [ABC287 F「Components」](https://atcoder.jp/contests/abc287/tasks/abc287_f)
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h)
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h)
- [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e)
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC307 E「Distinct Adjacent」](https://atcoder.jp/contests/abc307/tasks/abc307_e)
- [ABC309 E「Family and Insurance」](https://atcoder.jp/contests/abc309/tasks/abc309_e)
- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h)
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h)
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g)
- [ABC332 F「Random Update Query」](https://atcoder.jp/contests/abc332/tasks/abc332_f)
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g)
- [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f)
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f)
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)
- [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g)
- [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f)
- [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g)
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g)
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f)
- [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g)
- [ABC416 F「Paint Tree 2」](https://atcoder.jp/contests/abc416/tasks/abc416_f)
- [ABC416 G「Concat (1st)」](https://atcoder.jp/contests/abc416/tasks/abc416_g)
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC422 F「Eat and Ride」](https://atcoder.jp/contests/abc422/tasks/abc422_f)
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g)
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e)
- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g)
- [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g)
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f)
- [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g)
- [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g)
- [ABC450 F「Strongly Connected 2」](https://atcoder.jp/contests/abc450/tasks/abc450_f)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f)
- [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e)
- [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g)

## 根拠

- [ABC212 E 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_e)
- [ABC212 E 公式解説](https://atcoder.jp/contests/abc212/editorial/2357)
- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-chapter-dynamic-programming`
