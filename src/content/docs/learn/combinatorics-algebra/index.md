---
title: "組合せ・多項式・線形代数"
description: "「組合せ・多項式・線形代数」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 182
---

# 組合せ・多項式・線形代数

導入対象の目安: **水色（1200–1599）**。対象を係数・和・積へ翻訳し、数え方と高速な評価を分ける入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

数えたい対象の分解と、それを計算する代数的な表現を結び付ける。係数・全単射・対称性による計数から包除と反転へ進み、線形写像・行列・基底を揃える。母関数で式を立て、畳み込みとFPSで評価し、高度な係数抽出へ広げる。最後に行列式によるグラフ計数と独立性の構造を扱う。式を導く段階と式を高速に計算する段階を分けて説明できることを目指す。

### 組合せ・多項式・線形代数への変換

数え上げや遷移を係数列・多項式・線形写像へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

数え上げを全単射・係数列・線形写像へ変換し、高速変換と構造定理へ接続する。

### このUnitでは扱わないもの

- なし

## 章の構成

- [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/) — 水色
- [鏡像法・reflection principle](/learn/combinatorics-algebra/reflection-principle/) — 青色
- [Prüfer code・次数制約付きlabel木](/learn/combinatorics-algebra/prufer-code/) — 黄色
- [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/) — 黄色
- [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/) — 黄色
- [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/) — 赤色
- [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/) — 黄色
- [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/) — 水色
  - [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/) — 青色
  - [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/) — 青色
    - [subset convolution](/learn/combinatorics-algebra/subset-convolution/) — 橙色
- [monoid exponentiation・連結演算doubling](/learn/combinatorics-algebra/monoid-exponentiation/) — 水色
- [線形方程式・基底・分離可能変換へ変換する](/learn/combinatorics-algebra/linear-algebra-xor/) — 青色（導入）
  - [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/) — 青色
  - [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/) — 青色
  - [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/) — 黄色
- [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/) — 青色
- [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/) — 黄色
- [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/) — 黄色
- [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/) — 黄色
  - [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/) — 橙色
  - [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/) — 橙色
- [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/) — 橙色
  - [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/) — 橙色
  - [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/) — 橙色
  - [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/) — 赤色
- [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/) — 橙色
- [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/) — 黄色
- [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/) — 橙色
- [Matroidの独立性・greedy・線形交差](/learn/combinatorics-algebra/matroid-theory/) — 黄色（導入）
  - [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/) — 黄色
  - [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/) — 赤色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC217 F「Make Pair」](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h)
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g)
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h)
- [ABC246 F「typewriter」](https://atcoder.jp/contests/abc246/tasks/abc246_f)
- [ABC249 Ex「Dye Color」](https://atcoder.jp/contests/abc249/tasks/abc249_h)
- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h)
- [ABC256 F「Cumulative Cumulative Cumulative Sum」](https://atcoder.jp/contests/abc256/tasks/abc256_f)
- [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g)
- [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h)
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h)
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g)
- [ABC288 Ex「A Nameless Counting Problem」](https://atcoder.jp/contests/abc288/tasks/abc288_h)
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h)
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g)
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h)
- [ABC317 F「Nim」](https://atcoder.jp/contests/abc317/tasks/abc317_f)
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g)
- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)
- [ABC453 E「Team Division」](https://atcoder.jp/contests/abc453/tasks/abc453_e)
- [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e)
- [ABC463 G「Random Walk Distance」](https://atcoder.jp/contests/abc463/tasks/abc463_g)

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-chapter-combinatorics-algebra`
