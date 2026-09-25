---
title: "minimax・得点差・局面値を評価するゲームDP"
description: "「minimax・得点差・局面値を評価するゲームDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 79
---

# minimax・得点差・局面値を評価するゲームDP

習得対象の目安: **水色（1200–1599）**。手番と終端利得を明示し、minimaxや得点差の再帰を実装する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有限局面DAGのminimax

必ず終了するゲームの局面DAGで、終端利得と各手番の最大化・最小化から局面値を求める。

### 習得する技能

- 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/)、[循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)。

状態遷移を設計できることを前提に、双方の最適行動を最大化・最小化として評価する。

### このUnitでは扱わないもの

- 勝敗だけを分類する通常の後退解析・Grundy数。

## 問題一覧

- [ABC349 E「Weighted Tic-Tac-Toe」](https://atcoder.jp/contests/abc349/tasks/abc349_e) — 主題: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)（有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。）。
- [ABC303 G「Bags Game」](https://atcoder.jp/contests/abc303/tasks/abc303_g) — 主題: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)（有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。）。既習技能: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)（有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC303 G 公式解説](https://atcoder.jp/contests/abc303/editorial/6444)
- [ABC303 G 公式問題文](https://atcoder.jp/contests/abc303/tasks/abc303_g)
- [ABC349 E 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_e)
- [ABC349 E 公式解説](https://atcoder.jp/contests/abc349/editorial/9780)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `c6f65fe967897b3b327c1c837df5c30f493b2f2f75185478863272b445d1ff85` / LearningUnit `unit-dp-game-value`
