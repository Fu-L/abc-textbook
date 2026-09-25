---
title: "循環局面の後退解析とminimax距離"
description: "「循環局面の後退解析とminimax距離」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 81
---

# 循環局面の後退解析とminimax距離

習得対象の目安: **黄色（2000–2399）**。循環する局面でOR・ANDの確定条件を分け、引き分けと有限minimax距離を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第140単元。技能の説明を学んでから問題一覧へ進んでください。

前: [上位bitの支配関係によるXOR minimax](/learn/query/bitwise-minimax-partition/) ／ 次: [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)

## 概要

### 循環局面の後退解析とminimax距離

終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。

DAGのminimax再帰をそのまま循環グラフへ適用すると終了しない。終了へ強制できる集合を終端から拡大し、ORでは一つの確定手、ANDでは全手の確定を必要とする。未確定集合に残れる相手の選択を示して無限継続を証明する。

ABC261 Exの非負重みではminimax距離順の確定を使う。ABC413 Fでは妨害側が一方向を禁止する手と移動側の手をまとめると、二番目の有限な隣接値で確定する閾値規則になる。通常の最短路の一隣接確定とは区別する。

### 習得する技能

- 終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)。

有限局面DAGのminimaxで得た考え方と実装を再利用し、循環局面の後退解析とminimax距離の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 循環局面の後退解析とminimax距離の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f) — 主題: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
2. [ABC261 Ex「Game on Graph」](https://atcoder.jp/contests/abc261/tasks/abc261_h) — 主題: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC261 H 公式解説](https://atcoder.jp/contests/abc261/editorial/4449)
- [ABC261 H 公式問題文](https://atcoder.jp/contests/abc261/tasks/abc261_h)
- [ABC413 F 公式解説](https://atcoder.jp/contests/abc413/editorial/13408)
- [ABC413 F 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-cyclic-minimax-game`
