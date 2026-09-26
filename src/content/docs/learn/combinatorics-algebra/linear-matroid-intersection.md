---
title: "線形matroid交差の乱択rank判定"
description: "「線形matroid交差の乱択rank判定」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 213
---

# 線形matroid交差の乱択rank判定

習得対象の目安: **赤色（2800以上）**。二つの線形表現から乱択行列を作り、rankと共通独立集合の大きさを対応させる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 線形matroid交差の乱択rank判定

二つの線形matroidの表現A₁,A₂からA₁diag(r)A₂ᵀを作り、有限体上の乱択rankを共通独立集合の最大sizeとして高確率で判定する。

### 習得する技能

- 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)、[matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)、[乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。

このUnitを直接前提とする単元: なし。

matroidの独立性・交換公理、線形方程式のrank計算、乱択誤り評価を学んだ後、二つの線形matroidの共通独立rankを一枚の乱択行列へ圧縮する。

### このUnitでは扱わないもの

- 線形matroid交差の乱択rank判定の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g) — 主題: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)（二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC399 G 公式解説](https://atcoder.jp/contests/abc399/editorial/12546)
- [ABC399 G 公式問題文](https://atcoder.jp/contests/abc399/tasks/abc399_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-linear-matroid-intersection`
