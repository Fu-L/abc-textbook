---
title: "上限制約付き桁DP"
description: "「上限制約付き桁DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 82
---

# 上限制約付き桁DP

## 概要

### 上限制約付き桁DP

数値上限以下の桁列を接頭辞から構成し、tight・started・剰余・digit maskなど将来に必要な有限統計を保つ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

接頭辞状態DPの共通像を得た後、数値上限とのtight・started・剰余・digit maskだけを状態にして、上限以下の整数を数える。

### このUnitでは扱わないもの

- 上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC336 E「Digit Sum Divisible」](https://atcoder.jp/contests/abc336/tasks/abc336_e)
2. [ABC406 E「Popcount Sum 3」](https://atcoder.jp/contests/abc406/tasks/abc406_e)
3. [ABC465 E「Digit Circus」](https://atcoder.jp/contests/abc465/tasks/abc465_e)
4. [ABC235 F「Variety of Digits」](https://atcoder.jp/contests/abc235/tasks/abc235_f)
5. [ABC317 F「Nim」](https://atcoder.jp/contests/abc317/tasks/abc317_f)
6. [ABC288 Ex「A Nameless Counting Problem」](https://atcoder.jp/contests/abc288/tasks/abc288_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC235 F 公式解説](https://atcoder.jp/contests/abc235/editorial/3247)
- [ABC235 F 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_f)
- [ABC288 H 公式解説](https://atcoder.jp/contests/abc288/editorial/5663)
- [ABC288 H 公式問題文](https://atcoder.jp/contests/abc288/tasks/abc288_h)
- [ABC317 F 公式解説](https://atcoder.jp/contests/abc317/editorial/7018)
- [ABC317 F 公式問題文](https://atcoder.jp/contests/abc317/tasks/abc317_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-digit-dp`
