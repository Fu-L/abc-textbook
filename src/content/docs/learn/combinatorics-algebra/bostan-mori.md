---
title: "Bostan–Mori・有理生成関数の係数抽出"
description: "「Bostan–Mori・有理生成関数の係数抽出」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 208
---

# Bostan–Mori・有理生成関数の係数抽出

習得対象の目安: **橙色（2400–2799）**。有理母関数の係数を偶奇で分け、指数を半減する変形を繰り返す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Bostan–Mori・有理生成関数の係数抽出

P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。

### 習得する技能

- P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

有理級数P(x)/Q(x)の第K係数を求める。Q(−x)を掛けると分母が偶数次数だけになり、分子のKの偶奇に合う係数だけを残してKを半分へ縮められる。

## 成立条件と計算量

分母次数dならO(M(d) log K)。Q(0)が可逆であることが必要。分子が分母以上の次数なら商の寄与を分ける。偶数・奇数係数の抽出添字とK=0の停止値を確認する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

このUnitを直接前提とする単元: なし。

生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、Bostan–Mori・有理生成関数の係数抽出の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Bostan–Mori・有理生成関数の係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)（P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC300 H 公式解説](https://atcoder.jp/contests/abc300/editorial/6269)
- [ABC300 H 公式問題文](https://atcoder.jp/contests/abc300/tasks/abc300_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-bostan-mori`
