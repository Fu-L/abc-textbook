---
title: "最短路を証明する木・経路の復元"
description: "「最短路を証明する木・経路の復元」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 74
---

# 最短路を証明する木・経路の復元

## 概要

### 最短路を証明する木・経路の復元

最短距離の等式を満たす辺から、親・木・実現経路を選ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最短路モデル。

最短距離を計算できるようになった後、距離等式を満たす親辺を記録して最短路木・実現経路を復元する。

### このUnitでは扱わないもの

- 最短路を証明する木・経路の復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC252 E「Road Reduction」](https://atcoder.jp/contests/abc252/tasks/abc252_e)
2. [ABC308 Ex「Make Q」](https://atcoder.jp/contests/abc308/tasks/abc308_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)

## 根拠

- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC252 E 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_e)
- [ABC252 E 公式解説](https://atcoder.jp/contests/abc252/editorial/3980)
- [ABC308 H 公式解説](https://atcoder.jp/contests/abc308/editorial/6709)
- [ABC308 H 公式問題文](https://atcoder.jp/contests/abc308/tasks/abc308_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-shortest-path-reconstruction`
