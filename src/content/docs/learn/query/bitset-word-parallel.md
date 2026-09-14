---
title: "bitsetで集合演算をword並列化する"
description: "「bitsetで集合演算をword並列化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 51
---

# bitsetで集合演算をword並列化する

## 概要

### bitsetによるword並列集合演算

真偽集合をbit列へ詰め、交差・和・shift・popcountをword単位で実行して遷移や組数計算を加速する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

集合の交差・和・shiftを機械語word単位で同時処理し、要素ごとの走査をword幅だけ短縮する。

### このUnitでは扱わないもの

- 集合状態そのものを一つずつ遷移するbitmask DP、および単一整数のbit演算だけで完結する処理。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC348 F「Oddly Similar」](https://atcoder.jp/contests/abc348/tasks/abc348_f)
2. [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g)
3. [ABC258 G「Triangle」](https://atcoder.jp/contests/abc258/tasks/abc258_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g)
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g)

## 根拠

- [ABC221 G 公式解説](https://atcoder.jp/contests/abc221/editorial/2724)
- [ABC221 G 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC258 G 公式解説](https://atcoder.jp/contests/abc258/editorial/4234)
- [ABC258 G 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_g)
- [ABC276 H 公式解説](https://atcoder.jp/contests/abc276/editorial/5169)
- [ABC276 H 公式問題文](https://atcoder.jp/contests/abc276/tasks/abc276_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-bitset-word-parallel`
