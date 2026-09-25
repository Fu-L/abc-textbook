---
title: "上限制約付き桁DP"
description: "「上限制約付き桁DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 74
---

# 上限制約付き桁DP

習得対象の目安: **水色（1200–1599）**。tight・先頭の0・残す統計を分け、上限以下の整数を重複なく数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第83単元。技能の説明を学んでから問題一覧へ進んでください。

前: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/) ／ 次: [最大流・最小カット](/learn/graph/max-flow-min-cut/)

## 概要

### 上限制約付き桁DP

数値上限以下の桁列を接頭辞から構成し、tight・started・剰余・digit maskなど将来に必要な有限統計を保つ。

### 習得する技能

- 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

接頭辞状態DPの共通像を得た後、数値上限とのtight・started・剰余・digit maskだけを状態にして、上限以下の整数を数える。

### このUnitでは扱わないもの

- 上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC406 E「Popcount Sum 3」](https://atcoder.jp/contests/abc406/tasks/abc406_e) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。
2. [ABC465 E「Digit Circus」](https://atcoder.jp/contests/abc465/tasks/abc465_e) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。
3. [ABC336 E「Digit Sum Divisible」](https://atcoder.jp/contests/abc336/tasks/abc336_e) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。
4. [ABC235 F「Variety of Digits」](https://atcoder.jp/contests/abc235/tasks/abc235_f) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。
5. [ABC317 F「Nim」](https://atcoder.jp/contests/abc317/tasks/abc317_f) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
6. [ABC288 Ex「A Nameless Counting Problem」](https://atcoder.jp/contests/abc288/tasks/abc288_h) — 主題: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC235 F 公式解説](https://atcoder.jp/contests/abc235/editorial/3247)
- [ABC235 F 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_f)
- [ABC288 H 公式解説](https://atcoder.jp/contests/abc288/editorial/5663)
- [ABC288 H 公式問題文](https://atcoder.jp/contests/abc288/tasks/abc288_h)
- [ABC317 F 公式解説](https://atcoder.jp/contests/abc317/editorial/7018)
- [ABC317 F 公式問題文](https://atcoder.jp/contests/abc317/tasks/abc317_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-digit-dp`
