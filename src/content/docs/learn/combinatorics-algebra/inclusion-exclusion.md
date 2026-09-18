---
title: "包除・Möbius反転で重複を補正する"
description: "「包除・Möbius反転で重複を補正する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 190
---

# 包除・Möbius反転で重複を補正する

習得対象の目安: **水色（1200–1599）**。条件の共通部分を数え、交互符号が重複を打ち消す理由を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 集合上の包除原理

条件集合の交差をsubsetごとに数え、交互符号で「少なくとも一つ」「全てを避ける」対象を重複なく数える。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。

### このUnitでは扱わないもの

- 選択順を二項係数だけで式化する数え上げ。

## 下位単元

- [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/) — 青色
- [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/) — 青色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
2. [ABC455 E「Unbalanced ABC Substrings」](https://atcoder.jp/contests/abc455/tasks/abc455_e)
3. [ABC242 F「Black and White Rooks」](https://atcoder.jp/contests/abc242/tasks/abc242_f)
4. [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f)
5. [ABC377 F「Avoid Queen Attack」](https://atcoder.jp/contests/abc377/tasks/abc377_f)
6. [ABC465 F「Sjeltzer?」](https://atcoder.jp/contests/abc465/tasks/abc465_f)
7. [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
8. [ABC456 G「Count Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC214 G「Three Permutations」](https://atcoder.jp/contests/abc214/tasks/abc214_g)
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g)
- [ABC236 Ex「Distinct Multiples」](https://atcoder.jp/contests/abc236/tasks/abc236_h)
- [ABC246 F「typewriter」](https://atcoder.jp/contests/abc246/tasks/abc246_f)
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h)
- [ABC285 Ex「Avoid Square Number」](https://atcoder.jp/contests/abc285/tasks/abc285_h)
- [ABC288 Ex「A Nameless Counting Problem」](https://atcoder.jp/contests/abc288/tasks/abc288_h)
- [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h)
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h)
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g)
- [ABC317 F「Nim」](https://atcoder.jp/contests/abc317/tasks/abc317_f)
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g)
- [ABC335 G「Discrete Logarithm Problems」](https://atcoder.jp/contests/abc335/tasks/abc335_g)
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g)
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g)
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g)

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC214 G 公式解説](https://atcoder.jp/contests/abc214/editorial/2442)
- [ABC214 G 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_g)
- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-inclusion-exclusion`
