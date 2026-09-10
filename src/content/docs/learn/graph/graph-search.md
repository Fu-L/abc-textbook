---
title: "状態グラフ探索・到達関係"
description: "状態グラフ探索・到達関係の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 10
---

# 状態グラフ探索・到達関係

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

既知のDFS・BFS実装を土台に、長距離効果は探索前の方向別scanで静的な通行条件へ変換し、問題の状態を頂点、合法操作を辺として設計して到達関係を求める。

- eventをsortしてactive集合を増減するsweep line。
- 非負重み付き距離の緩和・確定と最短路certificateの復元。

## 下位単元

- [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)
- [推移閉包](/learn/graph/transitive-closure/)
- [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC244 F「Shortest Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e)
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f)
- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g)
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f)
- [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e)

## 根拠

- [ABC241 F 公式解説](https://atcoder.jp/contests/abc241/editorial/3451)
- [ABC241 F 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_f)
- [ABC244 F 公式解説](https://atcoder.jp/contests/abc244/editorial/3599)
- [ABC244 F 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-graph-search`
