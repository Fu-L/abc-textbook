---
title: "循環局面の後退解析とminimax距離"
description: "循環局面の後退解析とminimax距離の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 101
---

# 循環局面の後退解析とminimax距離

## 概要

### 循環局面の後退解析とminimax距離

終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。

DAGのminimax再帰をそのまま循環グラフへ適用すると終了しない。終了へ強制できる集合を終端から拡大し、ORでは一つの確定手、ANDでは全手の確定を必要とする。未確定集合に残れる相手の選択を示して無限継続を証明する。

ABC261 Exの非負重みではminimax距離順の確定を使う。ABC413 Fでは妨害側が一方向を禁止する手と移動側の手をまとめると、二番目の有限な隣接値で確定する閾値規則になる。通常の最短路の一隣接確定とは区別する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: minimax・得点差・局面値を評価するゲームDP。

有限局面DAGのminimaxで得た考え方と実装を再利用し、循環局面の後退解析とminimax距離の発動条件・正当化・境界を重複なく学ぶ。

- 循環局面の後退解析とminimax距離の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC261 Ex「Game on Graph」](https://atcoder.jp/contests/abc261/tasks/abc261_h)
2. [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC261 H 公式解説](https://atcoder.jp/contests/abc261/editorial/4449)
- [ABC261 H 公式問題文](https://atcoder.jp/contests/abc261/tasks/abc261_h)
- [ABC413 F 公式解説](https://atcoder.jp/contests/abc413/editorial/13408)
- [ABC413 F 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-cyclic-minimax-game`
