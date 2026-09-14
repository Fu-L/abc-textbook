---
title: "木距離を基準点・直径・中心から捉える"
description: "「木距離を基準点・直径・中心から捉える」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 41
---

# 木距離を基準点・直径・中心から捉える

## 概要

### 木距離・直径・中心・最遠点

木の一意経路距離を少数の基準点から一括計算し、距離label・直径端点・中心・最遠点性質で頂点集合の距離条件を整理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

木を探索して基準点からの距離を求められることを前提に、一意経路から得る距離labelと、直径端点・中心が距離構造を代表する性質を学ぶ。

### このUnitでは扱わないもの

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC303 E「A Gift From the Stars」](https://atcoder.jp/contests/abc303/tasks/abc303_e)
2. [ABC361 E「Tree and Hamilton Path 2」](https://atcoder.jp/contests/abc361/tasks/abc361_e)
3. [ABC428 E「Farthest Vertex」](https://atcoder.jp/contests/abc428/tasks/abc428_e)
4. [ABC221 F「Diameter set」](https://atcoder.jp/contests/abc221/tasks/abc221_f)
5. [ABC222 F「Expensive Expense」](https://atcoder.jp/contests/abc222/tasks/abc222_f)
6. [ABC401 F「Add One Edge 3」](https://atcoder.jp/contests/abc401/tasks/abc401_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC267 F「Exactly K Steps」](https://atcoder.jp/contests/abc267/tasks/abc267_f)
- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f)

## 根拠

- [ABC221 F 公式解説](https://atcoder.jp/contests/abc221/editorial/2723)
- [ABC221 F 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_f)
- [ABC222 F 公式解説](https://atcoder.jp/contests/abc222/editorial/2749)
- [ABC222 F 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_f)
- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-tree-metric`
