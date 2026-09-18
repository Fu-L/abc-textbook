---
title: "重み付き最短路・経路復元・差分制約"
description: "「重み付き最短路・経路復元・差分制約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 90
---

# 重み付き最短路・経路復元・差分制約

導入対象の目安: **緑色（800–1199）**。辺の重みに合う距離計算を選び、最短路の復元へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

辺重みに応じた距離計算、距離等式による経路復元、差の不等式を緩和へ写す制約系への応用を順に学ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 辺重みや最短距離を扱わず、到達可否だけを求める探索、および最短路に限らない一般の変更影響解析。

## 下位単元

- [最短路モデル](/learn/graph/weighted-shortest-path/) — 緑色
- [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/) — 水色
- [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/) — 青色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e)
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g)
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)
- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g)
- [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g)
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)

## 根拠

- [ABC213 E 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_e)
- [ABC213 E 公式解説](https://atcoder.jp/contests/abc213/editorial/2397)
- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-shortest-path-certificates`
