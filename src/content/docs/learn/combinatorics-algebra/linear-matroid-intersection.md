---
title: "線形matroid交差の乱択rank判定"
description: "線形matroid交差の乱択rank判定の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 219
---

# 線形matroid交差の乱択rank判定

## 概要

### 線形matroid交差の乱択rank判定

二つの線形matroidの表現A₁,A₂からA₁diag(r)A₂ᵀを作り、有限体上の乱択rankを共通独立集合の最大sizeとして高確率で判定する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 線形方程式・rank、matroid greedy、乱択の成功条件と誤り確率を設計する。

matroidの独立性・交換公理、線形方程式のrank計算、乱択誤り評価を学んだ後、二つの線形matroidの共通独立rankを一枚の乱択行列へ圧縮する。

- 線形matroid交差の乱択rank判定の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC399 G 公式解説](https://atcoder.jp/contests/abc399/editorial/12546)
- [ABC399 G 公式問題文](https://atcoder.jp/contests/abc399/tasks/abc399_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-linear-matroid-intersection`
