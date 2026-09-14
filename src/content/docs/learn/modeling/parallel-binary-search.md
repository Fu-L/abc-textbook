---
title: "parallel binary search・多数境界の判定共有"
description: "「parallel binary search・多数境界の判定共有」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 116
---

# parallel binary search・多数境界の判定共有

## 概要

### parallel binary search・多数境界の判定共有

多数queryの未知境界をmidごとにbucketし、更新を一方向に進める判定器を各roundで共有する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 単調境界を証明して探索する。

単一queryの単調境界を二分探索できるようになった後、多数queryのmidをroundごとに束ね、一方向更新できる判定器を共有する。

### このUnitでは扱わないもの

- parallel binary search・多数境界の判定共有の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g)
2. [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC233 H 公式解説](https://atcoder.jp/contests/abc233/editorial/3168)
- [ABC233 H 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC394 G 公式解説](https://atcoder.jp/contests/abc394/editorial/12282)
- [ABC394 G 公式問題文](https://atcoder.jp/contests/abc394/tasks/abc394_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-parallel-binary-search`
