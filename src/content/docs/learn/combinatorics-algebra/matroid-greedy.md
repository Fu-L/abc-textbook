---
title: "matroid greedy"
description: "「matroid greedy」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 214
---

# matroid greedy

習得対象の目安: **黄色（2000–2399）**。独立性oracleと交換公理から、重み順の選択が最適基底を与えることを示す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### matroid greedy

独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。

### 習得する技能

- 独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

このUnitを直接前提とする単元: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)。

Matroidの独立集合族と交換公理を定義した後、重み順greedyが最適基底を作る必要十分な構造を証明する。

### このUnitでは扱わないもの

- matroid greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f) — 主題: [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)（独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC236 F 公式解説](https://atcoder.jp/contests/abc236/editorial/3287)
- [ABC236 F 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1d03846ca5c5afa48c210e3527c3d0a048880fc11e6612e8ba16e5387f6de90a` / LearningUnit `unit-matroid-greedy`
