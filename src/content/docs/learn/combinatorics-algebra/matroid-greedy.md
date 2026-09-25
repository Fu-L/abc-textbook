---
title: "matroid greedy"
description: "「matroid greedy」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 213
---

# matroid greedy

習得対象の目安: **黄色（2000–2399）**。独立性oracleと交換公理から、重み順の選択が最適基底を与えることを示す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第166単元。技能の説明を学んでから問題一覧へ進んでください。

前: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/) ／ 次: [平面graph双対・cut/path対応](/learn/graph/planar-duality/)

## 概要

### matroid greedy

独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。

### 習得する技能

- 独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

Matroidの独立集合族と交換公理を定義した後、重み順greedyが最適基底を作る必要十分な構造を証明する。

### このUnitでは扱わないもの

- matroid greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f) — 主題: [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)。既習技能: 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC236 F 公式解説](https://atcoder.jp/contests/abc236/editorial/3287)
- [ABC236 F 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-matroid-greedy`
