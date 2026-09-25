---
title: "Prüfer code・次数制約付きlabel木"
description: "「Prüfer code・次数制約付きlabel木」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 188
---

# Prüfer code・次数制約付きlabel木

習得対象の目安: **黄色（2000–2399）**。label付き木と列の全単射を理解し、次数を出現回数へ写して数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Prüfer code・次数制約付きlabel木

label付き木を長さN-2の列へ全単射し、頂点の出現回数=次数-1として次数条件を独立な係数条件へ変換する。

### 習得する技能

- Prüfer列とlabel付き木の全単射、および各labelの出現回数=次数-1を使って次数制約を係数条件へ変換できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。

このUnitを直接前提とする単元: なし。

組合せ係数・数え上げで得た考え方と実装を再利用し、Prüfer code・次数制約付きlabel木の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Prüfer code・次数制約付きlabel木の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h) — 主題: [Prüfer code・次数制約付きlabel木](/learn/combinatorics-algebra/prufer-code/)（Prüfer列とlabel付き木の全単射、および各labelの出現回数=次数-1を使って次数制約を係数条件へ変換できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC303 H 公式解説](https://atcoder.jp/contests/abc303/editorial/6425)
- [ABC303 H 公式問題文](https://atcoder.jp/contests/abc303/tasks/abc303_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `bc3fd38aa082c37e76f0829dcc0cff7e6d53e5b699f0b15c0b0432ab980d791f` / LearningUnit `unit-prufer-code`
