---
title: "laminar区間族の包含木構築"
description: "「laminar区間族の包含木構築」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 133
---

# laminar区間族の包含木構築

難度の目安: **応用**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### laminar区間族の包含木構築

互いに素または包含関係にある区間を端点順に走査し、stackで直接包含する親を定めてdummy root付き包含木を作り、点を最小包含区間へ対応させる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

非交差区間族を括弧列として走査し、stack topを直接包含親にして包含関係を木へ変換する。その後の包含差分queryをLCAや木上距離へ接続する。

### このUnitでは扱わないもの

- laminar区間族の包含木構築の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC405 F 公式解説](https://atcoder.jp/contests/abc405/editorial/13009)
- [ABC405 F 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-laminar-interval-containment-tree`
