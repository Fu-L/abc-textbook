---
title: "laminar区間族の包含木構築"
description: "「laminar区間族の包含木構築」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 133
---

# laminar区間族の包含木構築

習得対象の目安: **青色（1600–1999）**。包含条件を確認し、端点の整列とstackで直接の親を構築する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第124単元。技能の説明を学んでから問題一覧へ進んでください。

前: [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/) ／ 次: [永続data structure・structural sharing](/learn/query/persistence/)

## 概要

### laminar区間族の包含木構築

互いに素または包含関係にある区間を端点順に走査し、stackで直接包含する親を定めてdummy root付き包含木を作り、点を最小包含区間へ対応させる。

### 習得する技能

- laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

非交差区間族を括弧列として走査し、stack topを直接包含親にして包含関係を木へ変換する。その後の包含差分queryをLCAや木上距離へ接続する。

### このUnitでは扱わないもの

- laminar区間族の包含木構築の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC405 F 公式解説](https://atcoder.jp/contests/abc405/editorial/13009)
- [ABC405 F 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-laminar-interval-containment-tree`
