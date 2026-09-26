---
title: "Convex Hull Trick・直線包絡"
description: "「Convex Hull Trick・直線包絡」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 222
---

# Convex Hull Trick・直線包絡

習得対象の目安: **黄色（2000–2399）**。DPなどの候補を一次関数へ写し、傾き・交点順やLi Chao Treeで包絡を保つ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Convex Hull Trick・直線包絡

一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。

### 習得する技能

- 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC289 G「Shopping in AtCoder store」](https://atcoder.jp/contests/abc289/tasks/abc289_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。
- [ABC372 G「Ax + By < C」](https://atcoder.jp/contests/abc372/tasks/abc372_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。
- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC228 H 公式解説](https://atcoder.jp/contests/abc228/editorial/2946)
- [ABC228 H 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC289 G 公式解説](https://atcoder.jp/contests/abc289/editorial/5700)
- [ABC289 G 公式問題文](https://atcoder.jp/contests/abc289/tasks/abc289_g)
- [ABC372 G 公式解説](https://atcoder.jp/contests/abc372/editorial/10973)
- [ABC372 G 公式問題文](https://atcoder.jp/contests/abc372/tasks/abc372_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1d03846ca5c5afa48c210e3527c3d0a048880fc11e6612e8ba16e5387f6de90a` / LearningUnit `unit-line-envelope`
