---
title: "ordered interval partition・ODT"
description: "「ordered interval partition・ODT」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 33
---

# ordered interval partition・ODT

習得対象の目安: **青色（1600–1999）**。ordered setに区間を載せ、split・mergeと消去区間数の償却評価を組み合わせる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### ordered interval partition・ODT

互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。

ordered set・multisetの動的順序管理で得た考え方と実装を再利用し、ordered interval partition・ODTの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- ordered interval partition・ODTの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e)
2. [ABC380 E「1D Bucket Tool」](https://atcoder.jp/contests/abc380/tasks/abc380_e)
3. [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h)
4. [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h)
5. [ABC465 G「Sum of Mex of Mod of Linear」](https://atcoder.jp/contests/abc465/tasks/abc465_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h)

## 根拠

- [ABC251 H 公式解説](https://atcoder.jp/contests/abc251/editorial/3954)
- [ABC251 H 公式問題文](https://atcoder.jp/contests/abc251/tasks/abc251_h)
- [ABC255 H 公式解説](https://atcoder.jp/contests/abc255/editorial/4103)
- [ABC255 H 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC256 H 公式解説](https://atcoder.jp/contests/abc256/editorial/4113)
- [ABC256 H 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-ordered-interval-partition`
