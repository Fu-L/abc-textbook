---
title: "単調path contraction・DSU jump"
description: "単調path contraction・DSU jumpの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 99
---

# 単調path contraction・DSU jump

## 概要

### 単調path contraction・DSU jump

一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- 単調path contraction・DSU jumpの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC295 G 公式解説](https://atcoder.jp/contests/abc295/editorial/6052)
- [ABC295 G 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-monotone-path-contraction`
