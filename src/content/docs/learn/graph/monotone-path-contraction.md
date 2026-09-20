---
title: "単調path contraction・DSU jump"
description: "「単調path contraction・DSU jump」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 108
---

# 単調path contraction・DSU jump

習得対象の目安: **青色（1600–1999）**。確定した区間を次未処理pointerで飛ばし、削除済み部分を再走査しない。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単調path contraction・DSU jump

一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 単調path contraction・DSU jumpの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC295 G 公式解説](https://atcoder.jp/contests/abc295/editorial/6052)
- [ABC295 G 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-monotone-path-contraction`
