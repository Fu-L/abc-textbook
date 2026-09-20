---
title: "ゲーム状態の勝敗とGrundy数"
description: "「ゲーム状態の勝敗とGrundy数」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 79
---

# ゲーム状態の勝敗とGrundy数

習得対象の目安: **水色（1200–1599）**。DAG上の勝敗再帰からGrundy数へ進み、独立なゲームの和をXORで評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### game状態・Grundy DP

各状態の勝敗またはGrundy数を後続状態から求める。

有限で非循環な局面遷移では、後続に必敗局面が一つでもあれば必勝、なければ必敗とする。独立なimpartial gameの和はGrundy数のXORで評価する。局面の符号化と勝敗を合成する原理を区別し、通常のNim型ゲームに部分集合DPの知識は要求しない。

ABC354 Eはこの勝敗再帰を残存カード集合へ適用する複合例である。主技法はゲームだが、問題は集合状態も学んだ位置に掲載する。集合の符号化をゲーム一般の前提へ引き上げない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

状態遷移を設計できることを前提に、後続状態の勝敗やGrundy数から現在局面を分類する。

### このUnitでは扱わないもの

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 問題一覧

1. [ABC368 F「Dividing Game」](https://atcoder.jp/contests/abc368/tasks/abc368_f)
2. [ABC380 F「Exchange Game」](https://atcoder.jp/contests/abc380/tasks/abc380_f)
3. [ABC297 G「Constrained Nim 2」](https://atcoder.jp/contests/abc297/tasks/abc297_g)
4. [ABC255 G「Constrained Nim」](https://atcoder.jp/contests/abc255/tasks/abc255_g)
5. [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h)
- [ABC278 F「Shiritori」](https://atcoder.jp/contests/abc278/tasks/abc278_f)
- [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g)
- [ABC354 E「Remove Pairs」](https://atcoder.jp/contests/abc354/tasks/abc354_e)
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g)

## 根拠

- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC255 G 公式解説](https://atcoder.jp/contests/abc255/editorial/4104)
- [ABC255 G 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_g)
- [ABC265 H 公式解説](https://atcoder.jp/contests/abc265/editorial/4577)
- [ABC265 H 公式問題文](https://atcoder.jp/contests/abc265/tasks/abc265_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-game`
