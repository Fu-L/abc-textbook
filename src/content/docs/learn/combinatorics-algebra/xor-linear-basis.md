---
title: "XOR線形基底"
description: "「XOR線形基底」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 197
---

# XOR線形基底

習得対象の目安: **青色（1600–1999）**。bit列をF₂ベクトルと見なし、pivotによる消去で独立性と表現可能性を管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### XOR線形基底

整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC283 G「Partial Xor Enumeration」](https://atcoder.jp/contests/abc283/tasks/abc283_g)
2. [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g)
3. [ABC223 H「Xor Query」](https://atcoder.jp/contests/abc223/tasks/abc223_h)
4. [ABC249 G「Xor Cards」](https://atcoder.jp/contests/abc249/tasks/abc249_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f)

## 根拠

- [ABC223 H 公式解説](https://atcoder.jp/contests/abc223/editorial/2784)
- [ABC223 H 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_h)
- [ABC236 F 公式解説](https://atcoder.jp/contests/abc236/editorial/3287)
- [ABC236 F 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_f)
- [ABC249 G 公式解説](https://atcoder.jp/contests/abc249/editorial/3791)
- [ABC249 G 公式問題文](https://atcoder.jp/contests/abc249/tasks/abc249_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-xor-linear-basis`
