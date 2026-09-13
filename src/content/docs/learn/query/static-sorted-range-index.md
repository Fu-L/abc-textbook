---
title: "静的sorted range index・Merge Sort Tree"
description: "静的sorted range index・Merge Sort Treeの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 125
---

# 静的sorted range index・Merge Sort Tree

## 概要

### 静的sorted range index・Merge Sort Tree

各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: Segment Treeのcanonical区間分解。

Segment Treeのcanonical区間分解で得た考え方と実装を再利用し、静的sorted range index・Merge Sort Treeの発動条件・正当化・境界を重複なく学ぶ。

- 静的sorted range index・Merge Sort Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC339 G「Smaller Sum」](https://atcoder.jp/contests/abc339/tasks/abc339_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC339 G 公式解説](https://atcoder.jp/contests/abc339/editorial/9207)
- [ABC339 G 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-static-sorted-range-index`
