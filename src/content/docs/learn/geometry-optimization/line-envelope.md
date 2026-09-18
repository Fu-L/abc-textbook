---
title: "Convex Hull Trick・直線包絡"
description: "「Convex Hull Trick・直線包絡」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 221
---

# Convex Hull Trick・直線包絡

難度の目安: **応用**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Convex Hull Trick・直線包絡

一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC289 G「Shopping in AtCoder store」](https://atcoder.jp/contests/abc289/tasks/abc289_g)
2. [ABC372 G「Ax + By < C」](https://atcoder.jp/contests/abc372/tasks/abc372_g)
3. [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g)
4. [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
5. [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC228 H 公式解説](https://atcoder.jp/contests/abc228/editorial/2946)
- [ABC228 H 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC289 G 公式解説](https://atcoder.jp/contests/abc289/editorial/5700)
- [ABC289 G 公式問題文](https://atcoder.jp/contests/abc289/tasks/abc289_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-line-envelope`
