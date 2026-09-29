---
title: "isotonic regression・PAV"
description: "「isotonic regression・PAV」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 228
---

# isotonic regression・PAV

習得対象の目安: **橙色（2400–2799）**。順序制約に違反するblockの併合が正しい理由を示し、PAVで最適化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### isotonic regression・PAV

単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。

### 習得する技能

- 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

このUnitを直接前提とする単元: なし。

一次元凸・単峰最適化で得た考え方と実装を再利用し、isotonic regression・PAVの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC459 F「-1, +1」](https://atcoder.jp/contests/abc459/tasks/abc459_f) — 主題: [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)（単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC459 F 公式解説](https://atcoder.jp/contests/abc459/editorial/20507)
- [ABC459 F 公式問題文](https://atcoder.jp/contests/abc459/tasks/abc459_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-isotonic-regression`
