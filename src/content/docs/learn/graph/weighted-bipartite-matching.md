---
title: "重み付き二部完全matching"
description: "重み付き二部完全matchingの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 208
---

# 重み付き二部完全matching

## 概要

### 重み付き二部完全matching

assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 二部matching・Hall・Kőnig。

二部matching・Hall・Kőnigで得た考え方と実装を再利用し、重み付き二部完全matchingの発動条件・正当化・境界を重複なく学ぶ。

- 重み付き二部完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC373 G「No Cross Matching」](https://atcoder.jp/contests/abc373/tasks/abc373_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC373 G 公式解説](https://atcoder.jp/contests/abc373/editorial/11045)
- [ABC373 G 公式問題文](https://atcoder.jp/contests/abc373/tasks/abc373_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-weighted-bipartite-matching`
