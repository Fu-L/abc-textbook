---
title: "rake・compressで動的木DPを保つ"
description: "「rake・compressで動的木DPを保つ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 187
---

# rake・compressで動的木DPを保つ

## 概要

### Static Top Treeによる動的木DP

境界頂点つきtree clusterをrake・compressで二分合成し、局所更新後の木DP値を根まで再計算する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 根付き木DP・部分木集約。

木DPの合成則を理解した後、境界頂点つきclusterをrake・compressし、局所変更を根まで再合成する。

### このUnitでは扱わないもの

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g)
2. [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC351 G 公式解説](https://atcoder.jp/contests/abc351/editorial/9868)
- [ABC351 G 公式問題文](https://atcoder.jp/contests/abc351/tasks/abc351_g)
- [ABC460 G 公式解説](https://atcoder.jp/contests/abc460/editorial/21012)
- [ABC460 G 公式問題文](https://atcoder.jp/contests/abc460/tasks/abc460_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-static-top-tree`
