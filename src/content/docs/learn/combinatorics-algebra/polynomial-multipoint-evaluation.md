---
title: "多項式の多点評価・補間"
description: "「多項式の多点評価・補間」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 190
---

# 多項式の多点評価・補間

## 概要

### 多項式の多点評価・補間

product treeとremainder treeを構築し、一つの多項式を多数の点へ準線形時間で評価・補間する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: FPS演算・多点評価・合成を行う、再帰分割・分割統治。

形式的べき級数の基本演算・再帰分割・分割統治で得た考え方と実装を再利用し、多項式の多点評価・補間の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 多項式の多点評価・補間の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g)
2. [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC272 H 公式解説](https://atcoder.jp/contests/abc272/editorial/4963)
- [ABC272 H 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC381 G 公式解説](https://atcoder.jp/contests/abc381/editorial/11378)
- [ABC381 G 公式問題文](https://atcoder.jp/contests/abc381/tasks/abc381_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-polynomial-multipoint-evaluation`
