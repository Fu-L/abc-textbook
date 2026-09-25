---
title: "加法的tree metric復元"
description: "「加法的tree metric復元」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 130
---

# 加法的tree metric復元

習得対象の目安: **橙色（2400–2799）**。距離行列から接続先と辺長を復元し、加法性と全距離の整合を検証する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 加法的tree metric復元

全点対距離行列の加法性から葉の接続先とedge長を決め、候補木の全距離を再計算して存在を完全検証する。

### 習得する技能

- 加法的距離行列から正重み木の候補を復元し、全点対距離の再計算で存在を完全検証できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。

このUnitを直接前提とする単元: なし。

木距離・直径・中心・最遠点で得た考え方と実装を再利用し、加法的tree metric復元の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 加法的tree metric復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e) — 主題: [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/)（加法的距離行列から正重み木の候補を復元し、全点対距離の再計算で存在を完全検証できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC451 E 公式問題文](https://atcoder.jp/contests/abc451/tasks/abc451_e)
- [ABC451 E 公式解説](https://atcoder.jp/contests/abc451/editorial/18053)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-additive-tree-metric-reconstruction`
