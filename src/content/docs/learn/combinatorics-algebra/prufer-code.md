---
title: "Prüfer code・次数制約付きlabel木"
description: "「Prüfer code・次数制約付きlabel木」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 185
---

# Prüfer code・次数制約付きlabel木

習得対象の目安: **黄色（2000–2399）**。label付き木と列の全単射を理解し、次数を出現回数へ写して数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第174単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/) ／ 次: [subset convolution](/learn/combinatorics-algebra/subset-convolution/)

## 概要

### Prüfer code・次数制約付きlabel木

label付き木を長さN-2の列へ全単射し、頂点の出現回数=次数-1として次数条件を独立な係数条件へ変換する。

### 習得する技能

- Prüfer列とlabel付き木の全単射、および各labelの出現回数=次数-1を使って次数制約を係数条件へ変換できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。

組合せ係数・数え上げで得た考え方と実装を再利用し、Prüfer code・次数制約付きlabel木の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Prüfer code・次数制約付きlabel木の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h) — 主題: [Prüfer code・次数制約付きlabel木](/learn/combinatorics-algebra/prufer-code/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC303 H 公式解説](https://atcoder.jp/contests/abc303/editorial/6425)
- [ABC303 H 公式問題文](https://atcoder.jp/contests/abc303/tasks/abc303_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-prufer-code`
