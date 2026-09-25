---
title: "subset convolution"
description: "「subset convolution」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 193
---

# subset convolution

習得対象の目安: **橙色（2400–2799）**。集合サイズ別の変換と反転を組み合わせ、互いに素な分割の畳み込みを求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### subset convolution

互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。

### 習得する技能

- 互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（後の節）、[subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。

このUnitを直接前提とする単元: なし。

畳み込み・相互相関・subset zeta・Möbius変換で得た考え方と実装を再利用し、subset convolutionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- subset convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC294 Ex「K-Coloring」](https://atcoder.jp/contests/abc294/tasks/abc294_h) — 主題: [subset convolution](/learn/combinatorics-algebra/subset-convolution/)（互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/)（辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-subset-convolution`
