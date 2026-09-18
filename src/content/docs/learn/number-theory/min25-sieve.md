---
title: "Min_25・Lucy DP型の総和篩"
description: "「Min_25・Lucy DP型の総和篩」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 181
---

# Min_25・Lucy DP型の総和篩

難度の目安: **専門**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Min_25・Lucy DP型の総和篩

floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。

素因数・約数分解で得た考え方と実装を再利用し、Min_25・Lucy DP型の総和篩の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Min_25・Lucy DP型の総和篩の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC370 G「Divisible by 3」](https://atcoder.jp/contests/abc370/tasks/abc370_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC370 G 公式解説](https://atcoder.jp/contests/abc370/editorial/10869)
- [ABC370 G 公式問題文](https://atcoder.jp/contests/abc370/tasks/abc370_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-min25-sieve`
