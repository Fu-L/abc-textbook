---
title: "lowlinkで橋・関節点を特定する"
description: "「lowlinkで橋・関節点を特定する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 109
---

# lowlinkで橋・関節点を特定する

習得対象の目安: **青色（1600–1999）**。DFS木と後退辺を区別し、lowlinkの不変量から橋・関節点を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### lowlinkによる橋・関節点の検出

DFS木の到達時刻とlowlink値から、除去で連結性が変わる辺・頂点を特定する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

DFS木を作れることを前提に、到達時刻とlowlink値から橋・関節点を判定する。

### このUnitでは扱わないもの

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC334 G「Christmas Color Grid 2」](https://atcoder.jp/contests/abc334/tasks/abc334_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC375 G「Road Blocked 2」](https://atcoder.jp/contests/abc375/tasks/abc375_g)

## 根拠

- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC334 G 公式解説](https://atcoder.jp/contests/abc334/editorial/8980)
- [ABC334 G 公式問題文](https://atcoder.jp/contests/abc334/tasks/abc334_g)
- [ABC375 G 公式解説](https://atcoder.jp/contests/abc375/editorial/11133)
- [ABC375 G 公式問題文](https://atcoder.jp/contests/abc375/tasks/abc375_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-lowlink-critical-structure`
