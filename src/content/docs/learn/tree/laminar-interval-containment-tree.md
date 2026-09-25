---
title: "laminar区間族の包含木構築"
description: "「laminar区間族の包含木構築」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 132
---

# laminar区間族の包含木構築

習得対象の目安: **青色（1600–1999）**。包含条件を確認し、端点の整列とstackで直接の親を構築する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### laminar区間族の包含木構築

互いに素または包含関係にある区間を端点順に走査し、stackで直接包含する親を定めてdummy root付き包含木を作り、点を最小包含区間へ対応させる。

### 習得する技能

- laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

非交差区間族を括弧列として走査し、stack topを直接包含親にして包含関係を木へ変換する。その後の包含差分queryをLCAや木上距離へ接続する。

### このUnitでは扱わないもの

- laminar区間族の包含木構築の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)（laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。） / [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC405 F 公式解説](https://atcoder.jp/contests/abc405/editorial/13009)
- [ABC405 F 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `7fd0d20393e1ee2f28bfe43444ff43159e5d8f980ff2ec7298a591ed3f297b32` / LearningUnit `unit-laminar-interval-containment-tree`
