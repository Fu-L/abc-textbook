---
title: "組合せ係数と対称性で数える"
description: "組合せ係数と対称性で数えるの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 17
---

# 組合せ係数と対称性で数える

## 概要

### 組合せ係数・数え上げ

選択順・順列・分配を二項係数や階乗と対称性で式化する。

素数pのもとでもn≥pならn!は0になり、通常の階乗・逆階乗式は使えない。Lucasの定理はn,kのp進各桁についてC(n,k)=∏C(n_i,k_i) mod pと分解する。k_i>n_iの桁があれば0。0〜p−1の階乗を前計算し、ABC279 Exの巨大引数の係数計算へ接続する。

ABC234 Fのように文字の在庫から異なる文字列を数える場合を考える。入力: 処理済み文字種だけで作れる長さlの文字列数dp[l]と、新文字の在庫c。初期値は空文字列dp[0]=1。

変換: 新文字をk個使うなら、完成後のl+k個の位置から新文字の位置をk個選ぶ。残りの位置には元の文字列を順に入れるため、一対一対応から係数はC(l+k,k)。同じ文字同士は区別しないのでk!を掛けない。

出力: next[l+k]+=dp[l]C(l+k,k)を0≤k≤cで更新する。k=0も含め、最後は正の長さだけ足す。長さ上限まで階乗と逆階乗を用意する。

転用条件: 新しい要素が同一種類であり、元の相対順序が保存されることを確認する。ABC217 Gのラベルなし集合分割では、挿入位置でなく既存群への合流先を数える別のDPになる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

選び方の重複を二項係数で整理し、対称操作で同一視する対象は固定点平均でorbitを数える。

- 重なりを交互加減する包除・Möbius反転。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC358 E「Alphabet Tiles」](https://atcoder.jp/contests/abc358/tasks/abc358_e)
2. [ABC234 F「Reordering」](https://atcoder.jp/contests/abc234/tasks/abc234_f)
3. [ABC262 E「Red and Blue Graph」](https://atcoder.jp/contests/abc262/tasks/abc262_e)
4. [ABC266 G「Yet Another RGB Sequence」](https://atcoder.jp/contests/abc266/tasks/abc266_g)
5. [ABC267 G「Increasing K Times」](https://atcoder.jp/contests/abc267/tasks/abc267_g)
6. [ABC276 G「Count Sequences」](https://atcoder.jp/contests/abc276/tasks/abc276_g)
7. [ABC290 F「Maximum Diameter」](https://atcoder.jp/contests/abc290/tasks/abc290_f)
8. [ABC399 F「Range Power Sum」](https://atcoder.jp/contests/abc399/tasks/abc399_f)
9. [ABC425 E「Count Sequences 2」](https://atcoder.jp/contests/abc425/tasks/abc425_e)
10. [ABC458 E「Count 123」](https://atcoder.jp/contests/abc458/tasks/abc458_e)
11. [ABC240 G「Teleporting Takahashi」](https://atcoder.jp/contests/abc240/tasks/abc240_g)
12. [ABC243 F「Lottery」](https://atcoder.jp/contests/abc243/tasks/abc243_f)
13. [ABC405 E「Fruit Lineup」](https://atcoder.jp/contests/abc405/tasks/abc405_e)
14. [ABC431 F「Almost Sorted 2」](https://atcoder.jp/contests/abc431/tasks/abc431_f)
15. [ABC433 F「1122 Subsequence 2」](https://atcoder.jp/contests/abc433/tasks/abc433_f)
16. [ABC227 G「Divisors of Binomial Coefficient」](https://atcoder.jp/contests/abc227/tasks/abc227_g)
17. [ABC265 E「Warp」](https://atcoder.jp/contests/abc265/tasks/abc265_e)
18. [ABC273 G「Row Column Sums 2」](https://atcoder.jp/contests/abc273/tasks/abc273_g)
19. [ABC281 G「Farthest City」](https://atcoder.jp/contests/abc281/tasks/abc281_g)
20. [ABC463 F「Senshuraku」](https://atcoder.jp/contests/abc463/tasks/abc463_f)
21. [ABC226 F「Score of Permutations」](https://atcoder.jp/contests/abc226/tasks/abc226_f)
22. [ABC215 G「Colorful Candies 2」](https://atcoder.jp/contests/abc215/tasks/abc215_g)
23. [ABC295 E「Kth Number」](https://atcoder.jp/contests/abc295/tasks/abc295_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 G「Three Permutations」](https://atcoder.jp/contests/abc214/tasks/abc214_g)
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h)
- [ABC217 F「Make Pair」](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC225 H「Social Distance 2」](https://atcoder.jp/contests/abc225/tasks/abc225_h)
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g)
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h)
- [ABC242 F「Black and White Rooks」](https://atcoder.jp/contests/abc242/tasks/abc242_f)
- [ABC249 Ex「Dye Color」](https://atcoder.jp/contests/abc249/tasks/abc249_h)
- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h)
- [ABC256 F「Cumulative Cumulative Cumulative Sum」](https://atcoder.jp/contests/abc256/tasks/abc256_f)
- [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g)
- [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h)
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC278 Ex「make 1」](https://atcoder.jp/contests/abc278/tasks/abc278_h)
- [ABC279 Ex「Sum of Prod of Min」](https://atcoder.jp/contests/abc279/tasks/abc279_h)
- [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h)
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g)
- [ABC285 Ex「Avoid Square Number」](https://atcoder.jp/contests/abc285/tasks/abc285_h)
- [ABC288 Ex「A Nameless Counting Problem」](https://atcoder.jp/contests/abc288/tasks/abc288_h)
- [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h)
- [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f)
- [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h)
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g)
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h)
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g)
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g)
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g)
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g)
- [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g)
- [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g)
- [ABC392 G「Fine Triplets」](https://atcoder.jp/contests/abc392/tasks/abc392_g)
- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g)
- [ABC422 G「Balls and Boxes」](https://atcoder.jp/contests/abc422/tasks/abc422_g)
- [ABC432 G「Sum of Binom(A, B)」](https://atcoder.jp/contests/abc432/tasks/abc432_g)
- [ABC453 E「Team Division」](https://atcoder.jp/contests/abc453/tasks/abc453_e)
- [ABC456 G「Count Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_g)
- [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e)
- [ABC463 G「Random Walk Distance」](https://atcoder.jp/contests/abc463/tasks/abc463_g)

## 根拠

- [ABC214 G 公式解説](https://atcoder.jp/contests/abc214/editorial/2442)
- [ABC214 G 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_g)
- [ABC215 G 公式解説](https://atcoder.jp/contests/abc215/editorial/2497)
- [ABC215 G 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_g)
- [ABC216 H 公式解説](https://atcoder.jp/contests/abc216/editorial/2561)
- [ABC216 H 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-combinatorial-coefficients`
