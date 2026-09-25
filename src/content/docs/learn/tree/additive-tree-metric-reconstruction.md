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

## 標準履修順

第176単元。技能の説明を学んでから問題一覧へ進んでください。

前: [subset convolution](/learn/combinatorics-algebra/subset-convolution/) ／ 次: [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/)

## 概要

### 加法的tree metric復元

全点対距離行列の加法性から葉の接続先とedge長を決め、候補木の全距離を再計算して存在を完全検証する。

### 習得する技能

- 加法的距離行列から正重み木の候補を復元し、全点対距離の再計算で存在を完全検証できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。

木距離・直径・中心・最遠点で得た考え方と実装を再利用し、加法的tree metric復元の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 加法的tree metric復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e) — 主題: [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC451 E 公式問題文](https://atcoder.jp/contests/abc451/tasks/abc451_e)
- [ABC451 E 公式解説](https://atcoder.jp/contests/abc451/editorial/18053)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-additive-tree-metric-reconstruction`
