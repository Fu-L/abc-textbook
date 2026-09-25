---
title: "分離可能線形変換・Walsh–Hadamard変換"
description: "「分離可能線形変換・Walsh–Hadamard変換」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 198
---

# 分離可能線形変換・Walsh–Hadamard変換

習得対象の目安: **黄色（2000–2399）**。各軸の小変換へ分離し、Walsh–Hadamard変換とXOR畳み込みを導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第131単元。技能の説明を学んでから問題一覧へ進んでください。

前: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/) ／ 次: [virtual tree・auxiliary tree](/learn/tree/virtual-tree/)

## 概要

### 分離可能線形変換・Walsh–Hadamard変換

Kronecker積型の多次元変換を各軸の小変換へ分離し、XOR convolution等をpointwise積へ移す。

### 習得する技能

- Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

Kronecker積型の多次元変換を各軸の小変換へ分離し、XOR convolution等をpointwise積へ移す。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC288 G「3^N Minesweeper」](https://atcoder.jp/contests/abc288/tasks/abc288_g) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)。
2. [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)。既習技能: 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。
3. [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。
4. [ABC367 G「Sum of (XOR^K or 0)」](https://atcoder.jp/contests/abc367/tasks/abc367_g) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)。既習技能: 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。 / Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。

## 根拠

- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC265 H 公式解説](https://atcoder.jp/contests/abc265/editorial/4577)
- [ABC265 H 公式問題文](https://atcoder.jp/contests/abc265/tasks/abc265_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-separable-linear-transform`
