---
title: "組合せ・多項式・線形代数"
description: "組合せ・多項式・線形代数の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 7
---

# 組合せ・多項式・線形代数

## 概要

### 組合せ・多項式・線形代数への変換

数え上げや遷移を係数列・多項式・線形写像へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

数え上げを全単射・係数列・線形写像へ変換し、高速変換と構造定理へ接続する。

- なし

## 下位単元

- [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)
- [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)
- [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)
- [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)
- [線形方程式・分離可能変換・行列式計数へ変換する](/learn/combinatorics-algebra/linear-algebra-xor/)
- [Matroidの独立性・greedy・線形交差](/learn/combinatorics-algebra/matroid-theory/)
- [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)
- [monoid exponentiation・連結演算doubling](/learn/combinatorics-algebra/monoid-exponentiation/)
- [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/)
- [鏡像法・reflection principle](/learn/combinatorics-algebra/reflection-principle/)
- [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)
- [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)
- [Prüfer code・次数制約付きlabel木](/learn/combinatorics-algebra/prufer-code/)
- [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)
- [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)
- [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)
- [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)
- [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC215 G「Colorful Candies 2」](https://atcoder.jp/contests/abc215/tasks/abc215_g)
- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC217 F「Make Pair」](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC227 G「Divisors of Binomial Coefficient」](https://atcoder.jp/contests/abc227/tasks/abc227_g)
- [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h)
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC249 Ex「Dye Color」](https://atcoder.jp/contests/abc249/tasks/abc249_h)
- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h)
- [ABC256 F「Cumulative Cumulative Cumulative Sum」](https://atcoder.jp/contests/abc256/tasks/abc256_f)
- [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g)
- [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h)
- [ABC265 E「Warp」](https://atcoder.jp/contests/abc265/tasks/abc265_e)
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)
- [ABC273 G「Row Column Sums 2」](https://atcoder.jp/contests/abc273/tasks/abc273_g)
- [ABC281 G「Farthest City」](https://atcoder.jp/contests/abc281/tasks/abc281_g)
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g)
- [ABC288 Ex「A Nameless Counting Problem」](https://atcoder.jp/contests/abc288/tasks/abc288_h)
- [ABC295 E「Kth Number」](https://atcoder.jp/contests/abc295/tasks/abc295_e)
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h)
- [ABC317 F「Nim」](https://atcoder.jp/contests/abc317/tasks/abc317_f)
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g)
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
- [ABC377 F「Avoid Queen Attack」](https://atcoder.jp/contests/abc377/tasks/abc377_f)
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g)
- [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g)
- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)
- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g)
- [ABC453 E「Team Division」](https://atcoder.jp/contests/abc453/tasks/abc453_e)
- [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e)
- [ABC463 F「Senshuraku」](https://atcoder.jp/contests/abc463/tasks/abc463_f)
- [ABC465 F「Sjeltzer?」](https://atcoder.jp/contests/abc465/tasks/abc465_f)

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-chapter-combinatorics-algebra`
