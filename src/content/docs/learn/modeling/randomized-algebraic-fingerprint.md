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

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。

乱択・Monte Carloアルゴリズムで得た考え方と実装を再利用し、乱択代数fingerprintの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC339 F「Product Equality」](https://atcoder.jp/contests/abc339/tasks/abc339_f)
2. [ABC367 F「Rearrange Query」](https://atcoder.jp/contests/abc367/tasks/abc367_f)
3. [ABC238 G「Cubic?」](https://atcoder.jp/contests/abc238/tasks/abc238_g)
4. [ABC455 G「Balanced Subarrays」](https://atcoder.jp/contests/abc455/tasks/abc455_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)
- [ABC367 F 公式解説](https://atcoder.jp/contests/abc367/editorial/10692)
- [ABC367 F 公式問題文](https://atcoder.jp/contests/abc367/tasks/abc367_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-randomized-algebraic-fingerprint`
