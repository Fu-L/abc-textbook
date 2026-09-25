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

## 標準履修順

第49単元。技能の説明を学んでから問題一覧へ進んでください。

前: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/) ／ 次: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)

## 概要

### game状態・Grundy DP

各状態の勝敗またはGrundy数を後続状態から求める。

有限で非循環な局面遷移では、後続に必敗局面が一つでもあれば必勝、なければ必敗とする。独立なimpartial gameの和はGrundy数のXORで評価する。局面の符号化と勝敗を合成する原理を区別し、通常のNim型ゲームに部分集合DPの知識は要求しない。

ABC354 Eはこの勝敗再帰を残存カード集合へ適用する複合例である。主技法はゲームだが、問題は集合状態も学んだ位置に掲載する。集合の符号化をゲーム一般の前提へ引き上げない。

### 習得する技能

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

状態遷移を設計できることを前提に、後続状態の勝敗やGrundy数から現在局面を分類する。

### このUnitでは扱わないもの

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 問題一覧

1. [ABC368 F「Dividing Game」](https://atcoder.jp/contests/abc368/tasks/abc368_f) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
2. [ABC380 F「Exchange Game」](https://atcoder.jp/contests/abc380/tasks/abc380_f) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。
3. [ABC297 G「Constrained Nim 2」](https://atcoder.jp/contests/abc297/tasks/abc297_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。
4. [ABC255 G「Constrained Nim」](https://atcoder.jp/contests/abc255/tasks/abc255_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。
5. [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)。既習技能: 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。 / Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。
- [ABC278 F「Shiritori」](https://atcoder.jp/contests/abc278/tasks/abc278_f) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC354 E「Remove Pairs」](https://atcoder.jp/contests/abc354/tasks/abc354_e) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g) — 主題: [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)。既習技能: 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

## 根拠

- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC255 G 公式解説](https://atcoder.jp/contests/abc255/editorial/4104)
- [ABC255 G 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_g)
- [ABC265 H 公式解説](https://atcoder.jp/contests/abc265/editorial/4577)
- [ABC265 H 公式問題文](https://atcoder.jp/contests/abc265/tasks/abc265_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dp-game`
