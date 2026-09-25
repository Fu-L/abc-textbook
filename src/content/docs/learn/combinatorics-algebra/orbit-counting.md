---
title: "群作用・軌道数え上げ"
description: "「群作用・軌道数え上げ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 189
---

# 群作用・軌道数え上げ

習得対象の目安: **黄色（2000–2399）**。群作用と固定点を定義し、Burnside・Pólyaによる対称性込みの計数を行う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 群作用・軌道数え上げ

群作用の固定点を作用素のcycle typeごとに数え、BurnsideまたはPólyaで軌道数を得る。

### 習得する技能

- 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [同値な状態を正規化する](/learn/modeling/normalization/)。

このUnitを直接前提とする単元: なし。

状態・配置の正規化で得た考え方と実装を再利用し、群作用・軌道数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 群作用・軌道数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)（群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)（群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC284 H 公式解説](https://atcoder.jp/contests/abc284/editorial/5481)
- [ABC284 H 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_h)
- [ABC428 G 公式解説](https://atcoder.jp/contests/abc428/editorial/14241)
- [ABC428 G 公式問題文](https://atcoder.jp/contests/abc428/tasks/abc428_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `c6f65fe967897b3b327c1c837df5c30f493b2f2f75185478863272b445d1ff85` / LearningUnit `unit-orbit-counting`
