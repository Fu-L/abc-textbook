---
title: "永続data structure・structural sharing"
description: "「永続data structure・structural sharing」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 52
---

# 永続data structure・structural sharing

習得対象の目安: **黄色（2000–2399）**。更新pathだけの複製と共有部分の不変性を理解し、複数versionを管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第125単元。技能の説明を学んでから問題一覧へ進んでください。

前: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/) ／ 次: [2-SAT・含意グラフ](/learn/graph/two-sat/)

## 概要

### 永続data structure・structural sharing

変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。

### 習得する技能

- 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC273 E「Notebook」](https://atcoder.jp/contests/abc273/tasks/abc273_e) — 主題: [永続data structure・structural sharing](/learn/query/persistence/)。
2. [ABC453 G「Copy Query」](https://atcoder.jp/contests/abc453/tasks/abc453_g) — 主題: [永続data structure・structural sharing](/learn/query/persistence/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC273 E 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_e)
- [ABC273 E 公式解説](https://atcoder.jp/contests/abc273/editorial/5023)
- [ABC453 G 公式解説](https://atcoder.jp/contests/abc453/editorial/18526)
- [ABC453 G 公式問題文](https://atcoder.jp/contests/abc453/tasks/abc453_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-persistence`
