---
title: "乱択代数fingerprint"
description: "乱択代数fingerprintの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 184
---

# 乱択代数fingerprint

## 概要

### 乱択代数fingerprint

multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 乱択の成功条件と誤り確率を設計する。

乱択・Monte Carloアルゴリズムで得た考え方と実装を再利用し、乱択代数fingerprintの発動条件・正当化・境界を重複なく学ぶ。

- 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-randomized-algebraic-fingerprint`
