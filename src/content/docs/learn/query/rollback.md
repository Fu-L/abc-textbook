---
title: "rollback・DFS入退場の状態復元"
description: "「rollback・DFS入退場の状態復元」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 51
---

# rollback・DFS入退場の状態復元

習得対象の目安: **青色（1600–1999）**。変更前の差分を保存し、DFSや時間分割から戻るたびに不変量を復元する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### rollback・DFS入退場の状態復元

更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g)
2. [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)
3. [ABC302 Ex「Ball Collector」](https://atcoder.jp/contests/abc302/tasks/abc302_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC302 H 公式解説](https://atcoder.jp/contests/abc302/editorial/6409)
- [ABC302 H 公式問題文](https://atcoder.jp/contests/abc302/tasks/abc302_h)
- [ABC363 G 公式解説](https://atcoder.jp/contests/abc363/editorial/10451)
- [ABC363 G 公式問題文](https://atcoder.jp/contests/abc363/tasks/abc363_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-rollback`
