---
title: "線形方程式・rank"
description: "「線形方程式・rank」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 196
---

# 線形方程式・rank

習得対象の目安: **青色（1600–1999）**。体上の消去法を実装し、rankから可解性と自由度を判断する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 線形方程式・rank

制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 線形方程式・rankの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g)
2. [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC278 Ex「make 1」](https://atcoder.jp/contests/abc278/tasks/abc278_h)
- [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g)
- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g)
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)

## 根拠

- [ABC276 H 公式解説](https://atcoder.jp/contests/abc276/editorial/5169)
- [ABC276 H 公式問題文](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC278 H 公式解説](https://atcoder.jp/contests/abc278/editorial/5210)
- [ABC278 H 公式問題文](https://atcoder.jp/contests/abc278/tasks/abc278_h)
- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-linear-system-rank`
