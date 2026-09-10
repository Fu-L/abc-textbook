---
title: "ゲーム状態の勝敗とGrundy数"
description: "ゲーム状態の勝敗とGrundy数の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 55
---

# ゲーム状態の勝敗とGrundy数

## 概要

### game状態・Grundy DP

各状態の勝敗またはGrundy数を後続状態から求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

状態遷移を設計できることを前提に、後続状態の勝敗やGrundy数から現在局面を分類する。

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC380 F「Exchange Game」](https://atcoder.jp/contests/abc380/tasks/abc380_f)
2. [ABC297 G「Constrained Nim 2」](https://atcoder.jp/contests/abc297/tasks/abc297_g)
3. [ABC255 G「Constrained Nim」](https://atcoder.jp/contests/abc255/tasks/abc255_g)
4. [ABC354 E「Remove Pairs」](https://atcoder.jp/contests/abc354/tasks/abc354_e)
5. [ABC278 F「Shiritori」](https://atcoder.jp/contests/abc278/tasks/abc278_f)
6. [ABC368 F「Dividing Game」](https://atcoder.jp/contests/abc368/tasks/abc368_f)
7. [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g)
8. [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g)
9. [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h)
- [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g)

## 根拠

- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC255 G 公式解説](https://atcoder.jp/contests/abc255/editorial/4104)
- [ABC255 G 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_g)
- [ABC265 H 公式解説](https://atcoder.jp/contests/abc265/editorial/4577)
- [ABC265 H 公式問題文](https://atcoder.jp/contests/abc265/tasks/abc265_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-dp-game`
