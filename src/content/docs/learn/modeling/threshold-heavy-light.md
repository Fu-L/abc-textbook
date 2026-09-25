---
title: "平方根・閾値による軽重分類"
description: "「平方根・閾値による軽重分類」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 23
---

# 平方根・閾値による軽重分類

習得対象の目安: **青色（1600–1999）**。頻度や次数で場合分けし、二つの計算量の釣合いから閾値を選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第108単元。技能の説明を学んでから問題一覧へ進んでください。

前: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/) ／ 次: [文字列周期・primitive word](/learn/string/string-periodicity/)

## 概要

### 平方根・閾値による軽重分類

頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。

### 習得する技能

- 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 平方根・閾値による軽重分類の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC335 F「Hop Sugoroku」](https://atcoder.jp/contests/abc335/tasks/abc335_f) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)。
2. [ABC350 G「Mediator」](https://atcoder.jp/contests/abc350/tasks/abc350_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)。
3. [ABC365 G「AtCoder Office」](https://atcoder.jp/contests/abc365/tasks/abc365_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
4. [ABC219 G「Propagation」](https://atcoder.jp/contests/abc219/tasks/abc219_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)。
5. [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

## 根拠

- [ABC219 G 公式解説](https://atcoder.jp/contests/abc219/editorial/2653)
- [ABC219 G 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_g)
- [ABC259 H 公式解説](https://atcoder.jp/contests/abc259/editorial/4269)
- [ABC259 H 公式問題文](https://atcoder.jp/contests/abc259/tasks/abc259_h)
- [ABC335 F 公式解説](https://atcoder.jp/contests/abc335/editorial/9038)
- [ABC335 F 公式問題文](https://atcoder.jp/contests/abc335/tasks/abc335_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-threshold-heavy-light`
