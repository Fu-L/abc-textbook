---
title: "rake・compressで動的木DPを保つ"
description: "「rake・compressで動的木DPを保つ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 146
---

# rake・compressで動的木DPを保つ

習得対象の目安: **橙色（2400–2799）**。境界付きclusterのrake・compressを設計し、更新の影響を木DPの合成で伝播する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Static Top Treeによる動的木DP

境界頂点つきtree clusterをrake・compressで二分合成し、局所更新後の木DP値を根まで再計算する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

木DPの合成則を理解した後、境界頂点つきclusterをrake・compressし、局所変更を根まで再合成する。

### このUnitでは扱わないもの

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 問題一覧

1. [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g)
2. [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC351 G 公式解説](https://atcoder.jp/contests/abc351/editorial/9868)
- [ABC351 G 公式問題文](https://atcoder.jp/contests/abc351/tasks/abc351_g)
- [ABC460 G 公式解説](https://atcoder.jp/contests/abc460/editorial/21012)
- [ABC460 G 公式問題文](https://atcoder.jp/contests/abc460/tasks/abc460_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-static-top-tree`
