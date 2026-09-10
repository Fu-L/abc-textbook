---
title: "交換論から選択順を導く"
description: "交換論から選択順を導くの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 24
---

# 交換論から選択順を導く

## 概要

### 貪欲法と交換論

局所選択の交換または候補の支配関係から、調べる順序・残す候補・定数個のcaseを確定する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

- 対称操作による状態の正規化。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC268 F「Best Concatenation」](https://atcoder.jp/contests/abc268/tasks/abc268_f)
2. [ABC226 G「The baggage」](https://atcoder.jp/contests/abc226/tasks/abc226_g)
3. [ABC257 E「Addition and Multiplication 2」](https://atcoder.jp/contests/abc257/tasks/abc257_e)
4. [ABC312 F「Cans and Openers」](https://atcoder.jp/contests/abc312/tasks/abc312_f)
5. [ABC385 E「Snowflake Tree」](https://atcoder.jp/contests/abc385/tasks/abc385_e)
6. [ABC404 E「Bowls and Beans」](https://atcoder.jp/contests/abc404/tasks/abc404_e)
7. [ABC457 E「Crossing Table Cloth」](https://atcoder.jp/contests/abc457/tasks/abc457_e)
8. [ABC225 E「7」](https://atcoder.jp/contests/abc225/tasks/abc225_e)
9. [ABC252 F「Bread」](https://atcoder.jp/contests/abc252/tasks/abc252_f)
10. [ABC262 F「Erase and Rotate」](https://atcoder.jp/contests/abc262/tasks/abc262_f)
11. [ABC290 G「Edge Elimination」](https://atcoder.jp/contests/abc290/tasks/abc290_g)
12. [ABC298 F「Rook Score」](https://atcoder.jp/contests/abc298/tasks/abc298_f)
13. [ABC299 G「Minimum Permutation」](https://atcoder.jp/contests/abc299/tasks/abc299_g)
14. [ABC376 E「Max × Sum」](https://atcoder.jp/contests/abc376/tasks/abc376_e)
15. [ABC388 E「Simultaneous Kagamimochi」](https://atcoder.jp/contests/abc388/tasks/abc388_e)
16. [ABC407 E「Most Valuable Parentheses」](https://atcoder.jp/contests/abc407/tasks/abc407_e)
17. [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e)
18. [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f)
19. [ABC447 E「Divide Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_e)
20. [ABC214 E「Packing Under Range Regulations」](https://atcoder.jp/contests/abc214/tasks/abc214_e)
21. [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e)
22. [ABC433 E「Max Matrix 2」](https://atcoder.jp/contests/abc433/tasks/abc433_e)
23. [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h)
24. [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f)
25. [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC227 E「Swap」](https://atcoder.jp/contests/abc227/tasks/abc227_e)
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f)
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC254 Ex「Multiply or Divide by 2」](https://atcoder.jp/contests/abc254/tasks/abc254_h)
- [ABC259 F「Select Edges」](https://atcoder.jp/contests/abc259/tasks/abc259_f)
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g)
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h)
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC308 F「Vouchers」](https://atcoder.jp/contests/abc308/tasks/abc308_f)
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g)
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f)
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f)
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g)
- [ABC322 G「Two Kinds of Base」](https://atcoder.jp/contests/abc322/tasks/abc322_g)
- [ABC333 E「Takahashi Quest」](https://atcoder.jp/contests/abc333/tasks/abc333_e)
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g)
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)
- [ABC374 E「Sensor Optimization Dilemma 2」](https://atcoder.jp/contests/abc374/tasks/abc374_e)
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e)
- [ABC384 E「Takahashi is Slime 2」](https://atcoder.jp/contests/abc384/tasks/abc384_e)
- [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e)
- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f)
- [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g)
- [ABC416 G「Concat (1st)」](https://atcoder.jp/contests/abc416/tasks/abc416_g)
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f)
- [ABC436 E「Minimum Swap」](https://atcoder.jp/contests/abc436/tasks/abc436_e)
- [ABC440 F「Egoism」](https://atcoder.jp/contests/abc440/tasks/abc440_f)
- [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f)
- [ABC454 F「Make it Palindrome 2」](https://atcoder.jp/contests/abc454/tasks/abc454_f)
- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g)
- [ABC466 E「Range Flip」](https://atcoder.jp/contests/abc466/tasks/abc466_e)

## 根拠

- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC225 E 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_e)
- [ABC225 F 公式解説](https://atcoder.jp/contests/abc225/editorial/2833)
- [ABC225 E 公式解説](https://atcoder.jp/contests/abc225/editorial/2853)
- [ABC225 F 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-greedy-exchange`
