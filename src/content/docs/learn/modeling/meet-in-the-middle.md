---
title: "meet-in-the-middle・半分全列挙"
description: "「meet-in-the-middle・半分全列挙」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 8
---

# meet-in-the-middle・半分全列挙

難度の目安: **基礎**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### meet-in-the-middle・半分全列挙

探索対象を独立に列挙できる二集合へ分け、値・mask・境界を照合して指数を半減する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

探索対象を独立に列挙できる二集合へ分け、値・mask・境界を照合して指数を半減する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC271 F「XOR on Grid Path」](https://atcoder.jp/contests/abc271/tasks/abc271_f)
2. [ABC326 F「Robot Rotation」](https://atcoder.jp/contests/abc326/tasks/abc326_f)
3. [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f)
4. [ABC402 F「Path to Integer」](https://atcoder.jp/contests/abc402/tasks/abc402_f)
5. [ABC427 F「Not Adjacent」](https://atcoder.jp/contests/abc427/tasks/abc427_f)
6. [ABC464 F「Random Vault Heist」](https://atcoder.jp/contests/abc464/tasks/abc464_f)
7. [ABC300 G「P-smooth number」](https://atcoder.jp/contests/abc300/tasks/abc300_g)
8. [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC252 Ex「K-th beautiful Necklace」](https://atcoder.jp/contests/abc252/tasks/abc252_h)

## 根拠

- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC252 H 公式解説](https://atcoder.jp/contests/abc252/editorial/3981)
- [ABC252 H 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_h)
- [ABC271 F 公式解説](https://atcoder.jp/contests/abc271/editorial/4925)
- [ABC271 F 公式問題文](https://atcoder.jp/contests/abc271/tasks/abc271_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-meet-in-the-middle`
