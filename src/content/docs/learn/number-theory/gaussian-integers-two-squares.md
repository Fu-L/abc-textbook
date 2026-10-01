---
title: "Gaussian整数・二平方和"
description: "「Gaussian整数・二平方和」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 181
---

# Gaussian整数・二平方和

習得対象の目安: **赤色（2800以上）**。Gaussian整数の素因数分解と共役を使い、二平方和の構成・計数を行う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Gaussian整数・二平方和

Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。

### 習得する技能

- Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

a²+b²はGaussian整数a+biのnormであり、積のnormが積になる。整数の素因数ごとの振る舞いへ分けると、二平方表示の存在や構成を扱える。

## 成立条件と計算量

正整数では3 mod 4の素数の指数が全て偶数であることが存在条件。構成には1 mod 4の素数の分解などが要り、因数分解と算術の費用を数える。0、符号、a,bの交換による重複を区別する。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。

このUnitを直接前提とする単元: なし。

素因数・約数分解で得た考え方と実装を再利用し、Gaussian整数・二平方和の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Gaussian整数・二平方和の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g) — 主題: [Gaussian整数・二平方和](/learn/number-theory/gaussian-integers-two-squares/)（Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC444 G 公式解説](https://atcoder.jp/contests/abc444/editorial/15201)
- [ABC444 G 公式問題文](https://atcoder.jp/contests/abc444/tasks/abc444_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-gaussian-integers-two-squares`
