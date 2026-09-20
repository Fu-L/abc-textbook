---
title: "分離可能線形変換・Walsh–Hadamard変換"
description: "「分離可能線形変換・Walsh–Hadamard変換」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 198
---

# 分離可能線形変換・Walsh–Hadamard変換

習得対象の目安: **黄色（2000–2399）**。各軸の小変換へ分離し、Walsh–Hadamard変換とXOR畳み込みを導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 分離可能線形変換・Walsh–Hadamard変換

Kronecker積型の多次元変換を各軸の小変換へ分離し、XOR convolution等をpointwise積へ移す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

Kronecker積型の多次元変換を各軸の小変換へ分離し、XOR convolution等をpointwise積へ移す。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC288 G「3^N Minesweeper」](https://atcoder.jp/contests/abc288/tasks/abc288_g)
2. [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h)
3. [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h)
4. [ABC367 G「Sum of (XOR^K or 0)」](https://atcoder.jp/contests/abc367/tasks/abc367_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h)

## 根拠

- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC265 H 公式解説](https://atcoder.jp/contests/abc265/editorial/4577)
- [ABC265 H 公式問題文](https://atcoder.jp/contests/abc265/tasks/abc265_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-separable-linear-transform`
