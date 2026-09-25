---
title: "乱択代数fingerprint"
description: "「乱択代数fingerprint」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 25
---

# 乱択代数fingerprint

習得対象の目安: **黄色（2000–2399）**。体やXORへの写像を設計し、代数的な衝突確率を全比較回数まで含めて評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第130単元。技能の説明を学んでから問題一覧へ進んでください。

前: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/) ／ 次: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)

## 概要

### 乱択代数fingerprint

multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。

### 習得する技能

- multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。

乱択・Monte Carloアルゴリズムで得た考え方と実装を再利用し、乱択代数fingerprintの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC367 F「Rearrange Query」](https://atcoder.jp/contests/abc367/tasks/abc367_f) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。
2. [ABC339 F「Product Equality」](https://atcoder.jp/contests/abc339/tasks/abc339_f) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。
3. [ABC238 G「Cubic?」](https://atcoder.jp/contests/abc238/tasks/abc238_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
4. [ABC455 G「Balanced Subarrays」](https://atcoder.jp/contests/abc455/tasks/abc455_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)
- [ABC367 F 公式解説](https://atcoder.jp/contests/abc367/editorial/10692)
- [ABC367 F 公式問題文](https://atcoder.jp/contests/abc367/tasks/abc367_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-randomized-algebraic-fingerprint`
