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

## 概要

### 平方根・閾値による軽重分類

頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 平方根・閾値による軽重分類の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC335 F「Hop Sugoroku」](https://atcoder.jp/contests/abc335/tasks/abc335_f)
2. [ABC350 G「Mediator」](https://atcoder.jp/contests/abc350/tasks/abc350_g)
3. [ABC365 G「AtCoder Office」](https://atcoder.jp/contests/abc365/tasks/abc365_g)
4. [ABC219 G「Propagation」](https://atcoder.jp/contests/abc219/tasks/abc219_g)
5. [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g)

## 根拠

- [ABC219 G 公式解説](https://atcoder.jp/contests/abc219/editorial/2653)
- [ABC219 G 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_g)
- [ABC259 H 公式解説](https://atcoder.jp/contests/abc259/editorial/4269)
- [ABC259 H 公式問題文](https://atcoder.jp/contests/abc259/tasks/abc259_h)
- [ABC335 F 公式解説](https://atcoder.jp/contests/abc335/editorial/9038)
- [ABC335 F 公式問題文](https://atcoder.jp/contests/abc335/tasks/abc335_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-threshold-heavy-light`
