---
title: "BEST定理によるEuler circuit数え上げ"
description: "「BEST定理によるEuler circuit数え上げ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 211
---

# BEST定理によるEuler circuit数え上げ

習得対象の目安: **橙色（2400–2799）**。有向全域木と出辺順列への対応を導き、BEST定理の数え方を適用する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### BEST定理によるEuler circuit数え上げ

有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。

### 習得する技能

- 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)、[Euler trail・circuit](/learn/graph/euler-trail-circuit/)。

このUnitを直接前提とする単元: なし。

行列式による数え上げ・Euler trail・circuitで得た考え方と実装を再利用し、BEST定理によるEuler circuit数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- BEST定理によるEuler circuit数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g) — 主題: [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)（有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC336 G 公式解説](https://atcoder.jp/contests/abc336/editorial/9060)
- [ABC336 G 公式問題文](https://atcoder.jp/contests/abc336/tasks/abc336_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-euler-circuit-counting`
