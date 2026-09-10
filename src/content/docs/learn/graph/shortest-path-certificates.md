---
title: "重み付き最短路・経路復元・差分制約"
description: "重み付き最短路・経路復元・差分制約の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 42
---

# 重み付き最短路・経路復元・差分制約

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

辺重みに応じた距離計算、距離等式による経路復元、差の不等式を緩和へ写す制約系への応用を順に学ぶ。

- 辺重みや最短距離を扱わず、到達可否だけを求める探索、および最短路に限らない一般の変更影響解析。

## 下位単元

- [最短路モデル](/learn/graph/weighted-shortest-path/)
- [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)
- [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g)
- [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e)
- [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e)
- [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e)
- [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e)
- [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f)
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)
- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f)
- [ABC375 G「Road Blocked 2」](https://atcoder.jp/contests/abc375/tasks/abc375_g)
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g)
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)

## 根拠

- [ABC213 E 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_e)
- [ABC213 E 公式解説](https://atcoder.jp/contests/abc213/editorial/2397)
- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-shortest-path-certificates`
