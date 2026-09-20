---
title: "固定線形遷移を巨大回数進める"
description: "「固定線形遷移を巨大回数進める」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 84
---

# 固定線形遷移を巨大回数進める

習得対象の目安: **青色（1600–1999）**。固定線形遷移を行列や漸化式へ写し、巨大回数の反復を二分累乗する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 線形遷移・行列累乗

固定線形遷移を行列または線形漸化式として巨大回数進める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。

### このUnitでは扱わないもの

- 一般のDP遷移の区間集約・単調最適化。

## 問題一覧

1. [ABC293 E「Geometric Progression」](https://atcoder.jp/contests/abc293/tasks/abc293_e)
2. [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g)
3. [ABC271 G「Access Counter」](https://atcoder.jp/contests/abc271/tasks/abc271_g)
4. [ABC258 Ex「Odd Steps」](https://atcoder.jp/contests/abc258/tasks/abc258_h)
5. [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h)
6. [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h)
7. [ABC270 Ex「add 1」](https://atcoder.jp/contests/abc270/tasks/abc270_h)
8. [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h)
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g)
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f)

## 根拠

- [ABC245 H 公式解説](https://atcoder.jp/contests/abc245/editorial/3636)
- [ABC245 H 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC256 G 公式解説](https://atcoder.jp/contests/abc256/editorial/4130)
- [ABC256 G 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_g)
- [ABC258 H 公式解説](https://atcoder.jp/contests/abc258/editorial/4214)
- [ABC258 H 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-linear-recurrence`
