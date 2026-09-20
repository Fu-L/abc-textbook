---
title: "状態グラフ探索・到達関係"
description: "「状態グラフ探索・到達関係」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 86
---

# 状態グラフ探索・到達関係

導入対象の目安: **緑色（800–1199）**。入力の頂点以外にも状態を作り、探索と到達関係を使う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

既知のDFS・BFS実装を土台に、長距離効果は探索前の方向別scanで静的な通行条件へ変換し、問題の状態を頂点、合法操作を辺として設計して到達関係を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- eventをsortしてactive集合を増減するsweep line。
- 非負重み付き距離の緩和・確定と最短路certificateの復元。

## 下位単元

- [状態グラフのモデリングと探索](/learn/graph/state-graph-search/) — 緑色
- [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/) — 水色
- [推移閉包](/learn/graph/transitive-closure/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e)
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f)
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)
- [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g)
- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g)
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f)
- [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f)

## 根拠

- [ABC241 F 公式解説](https://atcoder.jp/contests/abc241/editorial/3451)
- [ABC241 F 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_f)
- [ABC244 F 公式解説](https://atcoder.jp/contests/abc244/editorial/3599)
- [ABC244 F 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-graph-search`
