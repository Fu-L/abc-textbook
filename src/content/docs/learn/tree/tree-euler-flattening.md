---
title: "Euler順による部分木区間化"
description: "「Euler順による部分木区間化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 134
---

# Euler順による部分木区間化

習得対象の目安: **水色（1200–1599）**。DFS時刻で部分木が連続区間になることを使い、区間queryへ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Euler順による部分木区間化

DFS入退時刻で各部分木を連続区間へ写し、配列上の更新・集約へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

DFS入退時刻で各部分木を連続区間へ写し、配列上の更新・集約へ変換する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e)
2. [ABC406 F「Compare Tree Weights」](https://atcoder.jp/contests/abc406/tasks/abc406_f)
3. [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g)

## 根拠

- [ABC240 E 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 E 公式解説](https://atcoder.jp/contests/abc240/editorial/3426)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)
- [ABC337 G 公式解説](https://atcoder.jp/contests/abc337/editorial/9128)
- [ABC337 G 公式問題文](https://atcoder.jp/contests/abc337/tasks/abc337_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-tree-euler-flattening`
