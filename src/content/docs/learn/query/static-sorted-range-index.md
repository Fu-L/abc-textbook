---
title: "静的sorted range index・Merge Sort Tree"
description: "「静的sorted range index・Merge Sort Tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 44
---

# 静的sorted range index・Merge Sort Tree

習得対象の目安: **青色（1600–1999）**。区間分解・整列列・prefix和を組み合わせ、二つの軸を持つ問い合わせを処理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第128単元。技能の説明を学んでから問題一覧へ進んでください。

前: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/) ／ 次: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)

## 概要

### 静的sorted range index・Merge Sort Tree

各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。

### 習得する技能

- 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)。

Segment Treeのcanonical区間分解で得た考え方と実装を再利用し、静的sorted range index・Merge Sort Treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 静的sorted range index・Merge Sort Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC339 G「Smaller Sum」](https://atcoder.jp/contests/abc339/tasks/abc339_g) — 主題: [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC339 G 公式解説](https://atcoder.jp/contests/abc339/editorial/9207)
- [ABC339 G 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-static-sorted-range-index`
