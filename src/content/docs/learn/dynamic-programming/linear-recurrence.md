---
title: "固定線形遷移を巨大回数進める"
description: "固定線形遷移を巨大回数進めるの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 93
---

# 固定線形遷移を巨大回数進める

## 概要

### 線形遷移・行列累乗

固定線形遷移を行列または線形漸化式として巨大回数進める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。

- 一般のDP遷移の区間集約・単調最適化。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC293 E「Geometric Progression」](https://atcoder.jp/contests/abc293/tasks/abc293_e)
2. [ABC258 Ex「Odd Steps」](https://atcoder.jp/contests/abc258/tasks/abc258_h)
3. [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g)
4. [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g)
5. [ABC271 G「Access Counter」](https://atcoder.jp/contests/abc271/tasks/abc271_g)
6. [ABC270 Ex「add 1」](https://atcoder.jp/contests/abc270/tasks/abc270_h)
7. [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h)
8. [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h)

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-linear-recurrence`
