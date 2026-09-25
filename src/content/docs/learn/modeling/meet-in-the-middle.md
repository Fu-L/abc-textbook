---
title: "meet-in-the-middle・半分全列挙"
description: "「meet-in-the-middle・半分全列挙」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 8
---

# meet-in-the-middle・半分全列挙

習得対象の目安: **水色（1200–1599）**。全列挙と整列・検索を組み合わせ、指数の半減と照合条件を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第34単元。技能の説明を学んでから問題一覧へ進んでください。

前: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/) ／ 次: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)

## 概要

### meet-in-the-middle・半分全列挙

探索対象を独立に列挙できる二集合へ分け、値・mask・境界を照合して指数を半減する。

### 習得する技能

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

探索対象を独立に列挙できる二集合へ分け、値・mask・境界を照合して指数を半減する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC271 F「XOR on Grid Path」](https://atcoder.jp/contests/abc271/tasks/abc271_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。
2. [ABC402 F「Path to Integer」](https://atcoder.jp/contests/abc402/tasks/abc402_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
3. [ABC427 F「Not Adjacent」](https://atcoder.jp/contests/abc427/tasks/abc427_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。
4. [ABC326 F「Robot Rotation」](https://atcoder.jp/contests/abc326/tasks/abc326_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
5. [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
6. [ABC464 F「Random Vault Heist」](https://atcoder.jp/contests/abc464/tasks/abc464_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
7. [ABC300 G「P-smooth number」](https://atcoder.jp/contests/abc300/tasks/abc300_g) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
8. [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。
- [ABC252 Ex「K-th beautiful Necklace」](https://atcoder.jp/contests/abc252/tasks/abc252_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。

## 根拠

- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC252 H 公式解説](https://atcoder.jp/contests/abc252/editorial/3981)
- [ABC252 H 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_h)
- [ABC271 F 公式解説](https://atcoder.jp/contests/abc271/editorial/4925)
- [ABC271 F 公式問題文](https://atcoder.jp/contests/abc271/tasks/abc271_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-meet-in-the-middle`
