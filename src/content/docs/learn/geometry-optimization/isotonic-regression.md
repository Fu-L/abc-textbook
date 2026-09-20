---
title: "isotonic regression・PAV"
description: "「isotonic regression・PAV」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 225
---

# isotonic regression・PAV

習得対象の目安: **橙色（2400–2799）**。順序制約に違反するblockの併合が正しい理由を示し、PAVで最適化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### isotonic regression・PAV

単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

一次元凸・単峰最適化で得た考え方と実装を再利用し、isotonic regression・PAVの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC459 F「-1, +1」](https://atcoder.jp/contests/abc459/tasks/abc459_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC459 F 公式解説](https://atcoder.jp/contests/abc459/editorial/20507)
- [ABC459 F 公式問題文](https://atcoder.jp/contests/abc459/tasks/abc459_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-isotonic-regression`
