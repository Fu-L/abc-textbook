---
title: "数論"
description: "数論の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 5
---

# 数論

## 概要

### 数論構造への変換

整数条件を合同・整除・指数・約数格子などの数論構造へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

整数条件をgcd・合同・素因数指数・約数格子へ翻訳し、有限状態化と反転の基礎を作る。

- なし

## 下位単元

- [法上の演算と積の保守](/learn/number-theory/modular-product-foundations/)
- [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)
- [素因数分解と約数構造](/learn/number-theory/prime-divisor/)
- [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)
- [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)
- [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)
- [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)
- [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)
- [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)
- [Baby-Step Giant-Step・可逆作用の反復到達探索](/learn/number-theory/baby-step-giant-step/)
- [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)
- [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)
- [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)
- [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)
- [Gaussian整数・二平方和](/learn/number-theory/gaussian-integers-two-squares/)
- [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)
- [Min_25・Lucy DP型の総和篩](/learn/number-theory/min25-sieve/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 G「Colorful Candies 2」](https://atcoder.jp/contests/abc215/tasks/abc215_g)
- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC220 E「Distance on Large Perfect Binary Tree」](https://atcoder.jp/contests/abc220/tasks/abc220_e)
- [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC222 H「Beautiful Binary Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_h)
- [ABC226 E「Just one」](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC226 F「Score of Permutations」](https://atcoder.jp/contests/abc226/tasks/abc226_f)
- [ABC227 G「Divisors of Binomial Coefficient」](https://atcoder.jp/contests/abc227/tasks/abc227_g)
- [ABC230 G「GCD Permutation」](https://atcoder.jp/contests/abc230/tasks/abc230_g)
- [ABC234 F「Reordering」](https://atcoder.jp/contests/abc234/tasks/abc234_f)
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g)
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC238 G「Cubic?」](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC239 Ex「Dice Product 2」](https://atcoder.jp/contests/abc239/tasks/abc239_h)
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
- [ABC241 Ex「Card Deck Score」](https://atcoder.jp/contests/abc241/tasks/abc241_h)
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h)
- [ABC243 F「Lottery」](https://atcoder.jp/contests/abc243/tasks/abc243_f)
- [ABC243 G「Sqrt」](https://atcoder.jp/contests/abc243/tasks/abc243_g)
- [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC246 F「typewriter」](https://atcoder.jp/contests/abc246/tasks/abc246_f)
- [ABC248 G「GCD cost on the tree」](https://atcoder.jp/contests/abc248/tasks/abc248_g)
- [ABC254 F「Rectangle GCD」](https://atcoder.jp/contests/abc254/tasks/abc254_f)
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC263 E「Sugoroku 3」](https://atcoder.jp/contests/abc263/tasks/abc263_e)
- [ABC269 F「Numbered Checker」](https://atcoder.jp/contests/abc269/tasks/abc269_f)
- [ABC270 Ex「add 1」](https://atcoder.jp/contests/abc270/tasks/abc270_h)
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC271 G「Access Counter」](https://atcoder.jp/contests/abc271/tasks/abc271_g)
- [ABC272 G「Yet Another mod M」](https://atcoder.jp/contests/abc272/tasks/abc272_g)
- [ABC275 E「Sugoroku 4」](https://atcoder.jp/contests/abc275/tasks/abc275_e)
- [ABC276 F「Double Chance」](https://atcoder.jp/contests/abc276/tasks/abc276_f)
- [ABC277 G「Random Walk to Millionaire」](https://atcoder.jp/contests/abc277/tasks/abc277_g)
- [ABC280 E「Critical Hit」](https://atcoder.jp/contests/abc280/tasks/abc280_e)
- [ABC282 E「Choose Two and Eat One」](https://atcoder.jp/contests/abc282/tasks/abc282_e)
- [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h)
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g)
- [ABC285 Ex「Avoid Square Number」](https://atcoder.jp/contests/abc285/tasks/abc285_h)
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h)
- [ABC295 E「Kth Number」](https://atcoder.jp/contests/abc295/tasks/abc295_e)
- [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h)
- [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f)
- [ABC298 E「Unfair Sugoroku」](https://atcoder.jp/contests/abc298/tasks/abc298_e)
- [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h)
- [ABC304 F「Shift Table」](https://atcoder.jp/contests/abc304/tasks/abc304_f)
- [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g)
- [ABC310 F「Make 10 Again」](https://atcoder.jp/contests/abc310/tasks/abc310_f)
- [ABC310 G「Takahashi And Pass-The-Ball Game」](https://atcoder.jp/contests/abc310/tasks/abc310_g)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f)
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g)
- [ABC323 E「Playlist」](https://atcoder.jp/contests/abc323/tasks/abc323_e)
- [ABC326 E「Revenge of "The Salary of AtCoder Inc."」](https://atcoder.jp/contests/abc326/tasks/abc326_e)
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC332 F「Random Update Query」](https://atcoder.jp/contests/abc332/tasks/abc332_f)
- [ABC333 F「Bomb Game 2」](https://atcoder.jp/contests/abc333/tasks/abc333_f)
- [ABC334 E「Christmas Color Grid 1」](https://atcoder.jp/contests/abc334/tasks/abc334_e)
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)
- [ABC349 F「Subsequence LCM」](https://atcoder.jp/contests/abc349/tasks/abc349_f)
- [ABC360 E「Random Swaps of Balls」](https://atcoder.jp/contests/abc360/tasks/abc360_e)
- [ABC361 F「x = a^b」](https://atcoder.jp/contests/abc361/tasks/abc361_f)
- [ABC363 F「Palindromic Expression」](https://atcoder.jp/contests/abc363/tasks/abc363_f)
- [ABC368 F「Dividing Game」](https://atcoder.jp/contests/abc368/tasks/abc368_f)
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g)
- [ABC372 G「Ax + By < C」](https://atcoder.jp/contests/abc372/tasks/abc372_g)
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g)
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g)
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f)
- [ABC405 E「Fruit Lineup」](https://atcoder.jp/contests/abc405/tasks/abc405_e)
- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f)
- [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f)
- [ABC422 G「Balls and Boxes」](https://atcoder.jp/contests/abc422/tasks/abc422_g)
- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g)
- [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g)
- [ABC432 G「Sum of Binom(A, B)」](https://atcoder.jp/contests/abc432/tasks/abc432_g)
- [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g)
- [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f)
- [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g)
- [ABC448 E「Simple Division」](https://atcoder.jp/contests/abc448/tasks/abc448_e)
- [ABC456 G「Count Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_g)
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)
- [ABC461 F「Total Product is N」](https://atcoder.jp/contests/abc461/tasks/abc461_f)

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC215 G 公式解説](https://atcoder.jp/contests/abc215/editorial/2497)
- [ABC215 G 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_g)
- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-chapter-number-theory`
