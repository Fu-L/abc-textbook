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

## 概要

### 乱択代数fingerprint

multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。

### 習得する技能

- multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。

このUnitを直接前提とする単元: なし。

乱択・Monte Carloアルゴリズムで得た考え方と実装を再利用し、乱択代数fingerprintの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC339 F「Product Equality」](https://atcoder.jp/contests/abc339/tasks/abc339_f) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。）。
- [ABC367 F「Rearrange Query」](https://atcoder.jp/contests/abc367/tasks/abc367_f) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。）。
- [ABC238 G「Cubic?」](https://atcoder.jp/contests/abc238/tasks/abc238_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC455 G「Balanced Subarrays」](https://atcoder.jp/contests/abc455/tasks/abc455_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)
- [ABC367 F 公式解説](https://atcoder.jp/contests/abc367/editorial/10692)
- [ABC367 F 公式問題文](https://atcoder.jp/contests/abc367/tasks/abc367_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-randomized-algebraic-fingerprint`
