---
title: "FPS合成・power projection"
description: "「FPS合成・power projection」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 214
---

# FPS合成・power projection

習得対象の目安: **赤色（2800以上）**。FPS合成と転置の対応を理解し、block分割や有理関数への還元を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### FPS合成・power projection

多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。

### 習得する技能

- 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

f(g(x))の合成と、g(x)^kの係数を線形汎関数で読むpower projectionは、係数写像の転置として関係する。求める精度とg(0)などの条件を固定して高速法の入出力を理解する。

## 成立条件と計算量

素朴な方法は二次以上で、合成の高速化は畳み込み一回で済むとは限らない。採用する算法の計算量と標数条件を確認する。Lagrange反転や転置原理を使うときは、変数と係数の対応を明示する。

g(0)=0、精度Nの合成では、Kinoshita–Li法がBostan–Mori型の変数削減と転置原理を使い、NTT前提でO(N log² N)を実現する。power projectionはgの冪へ与えた線形汎関数をまとめて評価する側の写像である。転置は逆写像ではなく、各線形計算の情報の流れを反転する操作として理解する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)。

このUnitを直接前提とする単元: なし。

形式的べき級数の基本演算で得た考え方と実装を再利用し、FPS合成・power projectionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC387 G 公式解説](https://atcoder.jp/contests/abc387/editorial/11727)
- [ABC387 G 公式問題文](https://atcoder.jp/contests/abc387/tasks/abc387_g)
- [ABC439 G 公式解説](https://atcoder.jp/contests/abc439/editorial/14995)
- [ABC439 G 公式問題文](https://atcoder.jp/contests/abc439/tasks/abc439_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-fps-composition-power-projection`
