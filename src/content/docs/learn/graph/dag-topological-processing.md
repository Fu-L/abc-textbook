---
title: "DAGのtopological processing"
description: "DAGのtopological processingの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 21
---

# DAGのtopological processing

## 概要

### DAGのtopological processing

依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 状態グラフのモデリングと探索。

状態グラフのモデリングと探索で得た考え方と実装を再利用し、DAGのtopological processingの発動条件・正当化・境界を重複なく学ぶ。

- DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC315 E「Prerequisites」](https://atcoder.jp/contests/abc315/tasks/abc315_e)
2. [ABC277 F「Sorting a Matrix」](https://atcoder.jp/contests/abc277/tasks/abc277_f)
3. [ABC291 E「Find Permutation」](https://atcoder.jp/contests/abc291/tasks/abc291_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h)
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h)
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)
- [ABC335 E「Non-Decreasing Colorful Path」](https://atcoder.jp/contests/abc335/tasks/abc335_e)
- [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f)

## 根拠

- [ABC224 E 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC224 E 公式解説](https://atcoder.jp/contests/abc224/editorial/2814)
- [ABC277 F 公式解説](https://atcoder.jp/contests/abc277/editorial/5205)
- [ABC277 F 公式問題文](https://atcoder.jp/contests/abc277/tasks/abc277_f)
- [ABC291 E 公式問題文](https://atcoder.jp/contests/abc291/tasks/abc291_e)
- [ABC291 E 公式解説](https://atcoder.jp/contests/abc291/editorial/5839)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-dag-topological-processing`
