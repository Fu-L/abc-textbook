---
title: "最短路を証明する木・経路の復元"
description: "「最短路を証明する木・経路の復元」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 93
---

# 最短路を証明する木・経路の復元

習得対象の目安: **水色（1200–1599）**。距離だけでなく到達元を保持し、最短路条件を満たす木や経路を取り出す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第75単元。技能の説明を学んでから問題一覧へ進んでください。

前: [最短路モデル](/learn/graph/weighted-shortest-path/) ／ 次: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)

## 概要

### 最短路を証明する木・経路の復元

最短距離の等式を満たす辺から、親・木・実現経路を選ぶ。

### 習得する技能

- 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最短路モデル](/learn/graph/weighted-shortest-path/)。

最短距離を計算できるようになった後、距離等式を満たす親辺を記録して最短路木・実現経路を復元する。

### このUnitでは扱わないもの

- 最短路を証明する木・経路の復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC252 E「Road Reduction」](https://atcoder.jp/contests/abc252/tasks/abc252_e) — 主題: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
2. [ABC308 Ex「Make Q」](https://atcoder.jp/contests/abc308/tasks/abc308_h) — 主題: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。

## 根拠

- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC252 E 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_e)
- [ABC252 E 公式解説](https://atcoder.jp/contests/abc252/editorial/3980)
- [ABC308 H 公式解説](https://atcoder.jp/contests/abc308/editorial/6709)
- [ABC308 H 公式問題文](https://atcoder.jp/contests/abc308/tasks/abc308_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-shortest-path-reconstruction`
