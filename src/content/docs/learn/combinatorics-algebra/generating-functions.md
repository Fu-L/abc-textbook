---
title: "組合せを生成関数へ符号化する"
description: "「組合せを生成関数へ符号化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 112
---

# 組合せを生成関数へ符号化する

## 概要

### 生成関数による組合せ構造の符号化

和・積・sequence・set・cycleなどの組合せ構成を係数列の演算へ翻訳し、欲しい個数を係数として抽出する。

まず組合せ構造を和・積へ翻訳し、何の係数を求めるのかを定める。ABC385 Gなどの局所多項式の積はこの基本操作の例である。得られた式が暗黙方程式や巨大な積なら、次の高度な係数抽出の節で、式から計算可能な係数列を取り出す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 組合せ係数と対称性で数える。

高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。

### このUnitでは扱わないもの

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC214 G「Three Permutations」](https://atcoder.jp/contests/abc214/tasks/abc214_g)
2. [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g)
3. [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g)
4. [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g)
5. [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g)
6. [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g)
7. [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g)
8. [ABC392 G「Fine Triplets」](https://atcoder.jp/contests/abc392/tasks/abc392_g)
9. [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g)
10. [ABC422 G「Balls and Boxes」](https://atcoder.jp/contests/abc422/tasks/abc422_g)
11. [ABC432 G「Sum of Binom(A, B)」](https://atcoder.jp/contests/abc432/tasks/abc432_g)
12. [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g)
13. [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g)
14. [ABC225 H「Social Distance 2」](https://atcoder.jp/contests/abc225/tasks/abc225_h)
15. [ABC241 Ex「Card Deck Score」](https://atcoder.jp/contests/abc241/tasks/abc241_h)
16. [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h)
17. [ABC267 Ex「Odd Sum」](https://atcoder.jp/contests/abc267/tasks/abc267_h)
18. [ABC285 Ex「Avoid Square Number」](https://atcoder.jp/contests/abc285/tasks/abc285_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h)
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h)
- [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h)
- [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h)
- [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h)
- [ABC315 Ex「Typical Convolution Problem」](https://atcoder.jp/contests/abc315/tasks/abc315_h)
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h)
- [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h)
- [ABC367 G「Sum of (XOR^K or 0)」](https://atcoder.jp/contests/abc367/tasks/abc367_g)
- [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g)
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g)
- [ABC449 G「Many Repunit Sum 2」](https://atcoder.jp/contests/abc449/tasks/abc449_g)

## 根拠

- [ABC214 G 公式解説](https://atcoder.jp/contests/abc214/editorial/2442)
- [ABC214 G 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_g)
- [ABC225 H 公式解説](https://atcoder.jp/contests/abc225/editorial/2834)
- [ABC225 H 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_h)
- [ABC235 H 公式解説](https://atcoder.jp/contests/abc235/editorial/3250)
- [ABC235 H 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-generating-functions`
