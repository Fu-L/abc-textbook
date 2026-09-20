---
title: "graph core・leaf peeling"
description: "「graph core・leaf peeling」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 114
---

# graph core・leaf peeling

習得対象の目安: **水色（1200–1599）**。queueで次数の変化を伝播し、葉除去やk-coreの削除順を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### graph core・leaf peeling

次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- graph core・leaf peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e)
2. [ABC266 F「Well-defined Path Queries on a Namori」](https://atcoder.jp/contests/abc266/tasks/abc266_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)
- [ABC267 E 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC267 E 公式解説](https://atcoder.jp/contests/abc267/editorial/4729)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-graph-core`
