---
title: "循環局面の後退解析とminimax距離"
description: "「循環局面の後退解析とminimax距離」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 80
---

# 循環局面の後退解析とminimax距離

習得対象の目安: **黄色（2000–2399）**。循環する局面でOR・ANDの確定条件を分け、引き分けと有限minimax距離を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 循環局面の後退解析とminimax距離

終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。

DAGのminimax再帰をそのまま循環グラフへ適用すると終了しない。終了へ強制できる集合を終端から拡大し、ORでは一つの確定手、ANDでは全手の確定を必要とする。未確定集合に残れる相手の選択を示して無限継続を証明する。

ABC261 Exの非負重みではminimax距離順の確定を使う。ABC413 Fでは妨害側が一方向を禁止する手と移動側の手をまとめると、二番目の有限な隣接値で確定する閾値規則になる。通常の最短路の一隣接確定とは区別する。

### 習得する技能

- 終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)。

このUnitを直接前提とする単元: なし。

有限局面DAGのminimaxで得た考え方と実装を再利用し、循環局面の後退解析とminimax距離の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 循環局面の後退解析とminimax距離の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f) — 主題: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)（終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC261 Ex「Game on Graph」](https://atcoder.jp/contests/abc261/tasks/abc261_h) — 主題: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)（終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC261 H 公式解説](https://atcoder.jp/contests/abc261/editorial/4449)
- [ABC261 H 公式問題文](https://atcoder.jp/contests/abc261/tasks/abc261_h)
- [ABC413 F 公式解説](https://atcoder.jp/contests/abc413/editorial/13408)
- [ABC413 F 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `7fd0d20393e1ee2f28bfe43444ff43159e5d8f980ff2ec7298a591ed3f297b32` / LearningUnit `unit-cyclic-minimax-game`
