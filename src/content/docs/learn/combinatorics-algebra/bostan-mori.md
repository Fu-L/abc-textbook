---
title: "Bostan–Mori・有理生成関数の係数抽出"
description: "「Bostan–Mori・有理生成関数の係数抽出」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 207
---

# Bostan–Mori・有理生成関数の係数抽出

習得対象の目安: **橙色（2400–2799）**。有理母関数の係数を偶奇で分け、指数を半減する変形を繰り返す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第179単元。技能の説明を学んでから問題一覧へ進んでください。

前: [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/) ／ 次: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)

## 概要

### Bostan–Mori・有理生成関数の係数抽出

P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。

### 習得する技能

- P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、Bostan–Mori・有理生成関数の係数抽出の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Bostan–Mori・有理生成関数の係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC300 H 公式解説](https://atcoder.jp/contests/abc300/editorial/6269)
- [ABC300 H 公式問題文](https://atcoder.jp/contests/abc300/tasks/abc300_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-bostan-mori`
