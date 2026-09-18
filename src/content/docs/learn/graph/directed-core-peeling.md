---
title: "有向cycle検出・sink/source peeling"
description: "「有向cycle検出・sink/source peeling」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 97
---

# 有向cycle検出・sink/source peeling

習得対象の目安: **水色（1200–1599）**。DFSの訪問状態や次数零の反復削除から、有向cycleと残る領域を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有向cycle検出・sink/source peeling

三色DFSのrecursion stackまたは入次数・出次数零の反復削除により有向cycleを検出し、必要ならcycleへ到達するcoreと処理可能なDAG部分を分離する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

三色DFSのrecursion stackまたは入次数・出次数零の反復削除により有向cycleを検出し、必要ならcycleへ到達するcoreと処理可能なDAG部分を分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 有向cycle検出・sink/source peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC456 E「Endless Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_e)
2. [ABC245 F「Endless Walk」](https://atcoder.jp/contests/abc245/tasks/abc245_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC245 F 公式解説](https://atcoder.jp/contests/abc245/editorial/3652)
- [ABC245 F 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_f)
- [ABC456 E 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_e)
- [ABC456 E 公式解説](https://atcoder.jp/contests/abc456/editorial/19849)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-directed-core-peeling`
