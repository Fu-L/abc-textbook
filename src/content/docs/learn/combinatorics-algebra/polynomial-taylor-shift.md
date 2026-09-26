---
title: "factorial convolutionによる多項式Taylor shift"
description: "「factorial convolutionによる多項式Taylor shift」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 204
---

# factorial convolutionによる多項式Taylor shift

習得対象の目安: **橙色（2400–2799）**。二項展開の階乗因子を整理し、全係数の平行移動を一回の畳み込みへ還元する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### factorial convolutionによる多項式Taylor shift

P(x+a) の全係数を二項展開し、階乗倍した係数列と a^i/i! の反転畳み込みへ変換して準線形時間で求める。

### 習得する技能

- 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)、[NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。

このUnitを直接前提とする単元: なし。

畳み込みと二項係数の階乗表示を理解した後、二項展開の添字を反転して P(x+a) の全係数を一回の畳み込みへ落とす。多点評価や一般FPS合成とは目的を区別する。

### このUnitでは扱わないもの

- factorial convolutionによる多項式Taylor shiftの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。）。既習技能: [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/)（二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-polynomial-taylor-shift`
