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

## 標準履修順

第171単元。技能の説明を学んでから問題一覧へ進んでください。

前: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/) ／ 次: [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/)

## 概要

### isotonic regression・PAV

単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。

### 習得する技能

- 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

一次元凸・単峰最適化で得た考え方と実装を再利用し、isotonic regression・PAVの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC459 F「-1, +1」](https://atcoder.jp/contests/abc459/tasks/abc459_f) — 主題: [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC459 F 公式解説](https://atcoder.jp/contests/abc459/editorial/20507)
- [ABC459 F 公式問題文](https://atcoder.jp/contests/abc459/tasks/abc459_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-isotonic-regression`
