---
title: "minimax・得点差・局面値を評価するゲームDP"
description: "minimax・得点差・局面値を評価するゲームDPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 46
---

# minimax・得点差・局面値を評価するゲームDP

## 概要

### 有限局面DAGのminimax

必ず終了するゲームの局面DAGで、終端利得と各手番の最大化・最小化から局面値を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

状態遷移を設計できることを前提に、双方の最適行動を最大化・最小化として評価する。

- 勝敗だけを分類する通常の後退解析・Grundy数。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC349 E「Weighted Tic-Tac-Toe」](https://atcoder.jp/contests/abc349/tasks/abc349_e)
2. [ABC303 G「Bags Game」](https://atcoder.jp/contests/abc303/tasks/abc303_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g)

## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC303 G 公式解説](https://atcoder.jp/contests/abc303/editorial/6444)
- [ABC303 G 公式問題文](https://atcoder.jp/contests/abc303/tasks/abc303_g)
- [ABC349 E 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_e)
- [ABC349 E 公式解説](https://atcoder.jp/contests/abc349/editorial/9780)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-dp-game-value`
