---
title: "局所寄与へ分解して集計順を交換する"
description: "「局所寄与へ分解して集計順を交換する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 3
---

# 局所寄与へ分解して集計順を交換する

習得対象の目安: **緑色（800–1199）**。答えを要素ごとの寄与に分け、二重ループの数え方を変える視点を持つ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 寄与の数え上げと順序交換

答えを要素・組・連結成分ごとの独立な局所寄与へ分解し、和または積の集計順序を交換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

答えを要素・組・成分ごとの局所寄与へ一意に分け、各対象が何回数えられるかを証明して二重和・積・期待値の集計順を交換する。

### このUnitでは扱わないもの

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および独立な局所寄与へ分解できない集計。

## 問題一覧

1. [ABC233 E「Σ[k=0..10^100]floor(X／10^k)」](https://atcoder.jp/contests/abc233/tasks/abc233_e)
2. [ABC371 E「I Hate Sigma Problems」](https://atcoder.jp/contests/abc371/tasks/abc371_e)
3. [ABC318 E「Sandwiches」](https://atcoder.jp/contests/abc318/tasks/abc318_e)
4. [ABC308 E「MEX」](https://atcoder.jp/contests/abc308/tasks/abc308_e)
5. [ABC365 E「Xor Sigma Problem」](https://atcoder.jp/contests/abc365/tasks/abc365_e)
6. [ABC324 E「Joint Two Strings」](https://atcoder.jp/contests/abc324/tasks/abc324_e)
7. [ABC347 E「Set Add Query」](https://atcoder.jp/contests/abc347/tasks/abc347_e)
8. [ABC334 E「Christmas Color Grid 1」](https://atcoder.jp/contests/abc334/tasks/abc334_e)
9. [ABC353 E「Yet Another Sigma Problem」](https://atcoder.jp/contests/abc353/tasks/abc353_e)
10. [ABC379 E「Sum of All Substrings」](https://atcoder.jp/contests/abc379/tasks/abc379_e)
11. [ABC247 E「Max Min」](https://atcoder.jp/contests/abc247/tasks/abc247_e)
12. [ABC423 E「Sum of Subarrays」](https://atcoder.jp/contests/abc423/tasks/abc423_e)
13. [ABC290 E「Make it Palindrome」](https://atcoder.jp/contests/abc290/tasks/abc290_e)
14. [ABC255 E「Lucky Numbers」](https://atcoder.jp/contests/abc255/tasks/abc255_e)
15. [ABC269 F「Numbered Checker」](https://atcoder.jp/contests/abc269/tasks/abc269_f)
16. [ABC224 F「Problem where +s Separate Digits」](https://atcoder.jp/contests/abc224/tasks/abc224_f)
17. [ABC390 F「Double Sum 3」](https://atcoder.jp/contests/abc390/tasks/abc390_f)
18. [ABC422 F「Eat and Ride」](https://atcoder.jp/contests/abc422/tasks/abc422_f)
19. [ABC268 G「Random Student ID」](https://atcoder.jp/contests/abc268/tasks/abc268_g)
20. [ABC295 F「substr = S」](https://atcoder.jp/contests/abc295/tasks/abc295_f)
21. [ABC231 G「Balls in Boxes」](https://atcoder.jp/contests/abc231/tasks/abc231_g)
22. [ABC330 G「Inversion Squared」](https://atcoder.jp/contests/abc330/tasks/abc330_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 G「Colorful Candies 2」](https://atcoder.jp/contests/abc215/tasks/abc215_g)
- [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f)
- [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h)
- [ABC220 E「Distance on Large Perfect Binary Tree」](https://atcoder.jp/contests/abc220/tasks/abc220_e)
- [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC221 F「Diameter set」](https://atcoder.jp/contests/abc221/tasks/abc221_f)
- [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e)
- [ABC226 E「Just one」](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC258 G「Triangle」](https://atcoder.jp/contests/abc258/tasks/abc258_g)
- [ABC261 F「Sorting Color Balls」](https://atcoder.jp/contests/abc261/tasks/abc261_f)
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
- [ABC269 E「Last Rook」](https://atcoder.jp/contests/abc269/tasks/abc269_e)
- [ABC277 G「Random Walk to Millionaire」](https://atcoder.jp/contests/abc277/tasks/abc277_g)
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
- [ABC283 Ex「Popcount Sum」](https://atcoder.jp/contests/abc283/tasks/abc283_h)
- [ABC295 E「Kth Number」](https://atcoder.jp/contests/abc295/tasks/abc295_e)
- [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f)
- [ABC298 F「Rook Score」](https://atcoder.jp/contests/abc298/tasks/abc298_f)
- [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f)
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g)
- [ABC326 E「Revenge of "The Salary of AtCoder Inc."」](https://atcoder.jp/contests/abc326/tasks/abc326_e)
- [ABC351 E「Jump Distance Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_e)
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g)
- [ABC359 G「Sum of Tree Distance」](https://atcoder.jp/contests/abc359/tasks/abc359_g)
- [ABC361 E「Tree and Hamilton Path 2」](https://atcoder.jp/contests/abc361/tasks/abc361_e)
- [ABC362 F「Perfect Matching on a Tree」](https://atcoder.jp/contests/abc362/tasks/abc362_f)
- [ABC378 E「Mod Sigma Problem」](https://atcoder.jp/contests/abc378/tasks/abc378_e)
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g)
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g)
- [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g)
- [ABC396 F「Rotated Inversions」](https://atcoder.jp/contests/abc396/tasks/abc396_f)
- [ABC401 F「Add One Edge 3」](https://atcoder.jp/contests/abc401/tasks/abc401_f)
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f)
- [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e)
- [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f)
- [ABC418 E「Trapezium」](https://atcoder.jp/contests/abc418/tasks/abc418_e)
- [ABC433 F「1122 Subsequence 2」](https://atcoder.jp/contests/abc433/tasks/abc433_f)
- [ABC436 F「Starry Landscape Photo」](https://atcoder.jp/contests/abc436/tasks/abc436_f)
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f)
- [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f)
- [ABC455 F「Merge Slimes 2」](https://atcoder.jp/contests/abc455/tasks/abc455_f)
- [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e)
- [ABC464 F「Random Vault Heist」](https://atcoder.jp/contests/abc464/tasks/abc464_f)

## 根拠

- [ABC215 G 公式解説](https://atcoder.jp/contests/abc215/editorial/2497)
- [ABC215 G 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_g)
- [ABC216 F 公式解説](https://atcoder.jp/contests/abc216/editorial/2560)
- [ABC216 F 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_f)
- [ABC218 E 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 E 公式解説](https://atcoder.jp/contests/abc218/editorial/2580)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-contribution-reordering`
