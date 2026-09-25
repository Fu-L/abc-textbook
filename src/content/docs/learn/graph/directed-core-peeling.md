---
title: "有向cycle検出・sink/source peeling"
description: "「有向cycle検出・sink/source peeling」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 97
---

# 有向cycle検出・sink/source peeling

習得対象の目安: **水色（1200–1599）**。DFSの訪問状態や次数零の反復削除から、有向cycleと残る領域を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有向cycle検出・sink/source peeling

三色DFSのrecursion stackまたは入次数・出次数零の反復削除により有向cycleを検出し、必要ならcycleへ到達するcoreと処理可能なDAG部分を分離する。

### 習得する技能

- 三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

三色DFSのrecursion stackまたは入次数・出次数零の反復削除により有向cycleを検出し、必要ならcycleへ到達するcoreと処理可能なDAG部分を分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 有向cycle検出・sink/source peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC456 E「Endless Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_e) — 主題: [有向cycle検出・sink/source peeling](/learn/graph/directed-core-peeling/)（三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。）。
- [ABC245 F「Endless Walk」](https://atcoder.jp/contests/abc245/tasks/abc245_f) — 主題: [有向cycle検出・sink/source peeling](/learn/graph/directed-core-peeling/)（三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC245 F 公式解説](https://atcoder.jp/contests/abc245/editorial/3652)
- [ABC245 F 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_f)
- [ABC456 E 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_e)
- [ABC456 E 公式解説](https://atcoder.jp/contests/abc456/editorial/19849)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5856cce249dc16a05c694fe4136c7592920790e2786135edf898cc4b20161c4a` / LearningUnit `unit-directed-core-peeling`
