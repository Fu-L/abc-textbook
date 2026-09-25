---
title: "Gaussian整数・二平方和"
description: "「Gaussian整数・二平方和」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 177
---

# Gaussian整数・二平方和

習得対象の目安: **赤色（2800以上）**。Gaussian整数の素因数分解と共役を使い、二平方和の構成・計数を行う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Gaussian整数・二平方和

Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。

### 習得する技能

- Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5856cce249dc16a05c694fe4136c7592920790e2786135edf898cc4b20161c4a` / LearningUnit `unit-gaussian-integers-two-squares`
