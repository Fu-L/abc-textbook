---
title: "加法的tree metric復元"
description: "加法的tree metric復元の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 109
---

# 加法的tree metric復元

## 概要

### 加法的tree metric復元

全点対距離行列の加法性から葉の接続先とedge長を決め、候補木の全距離を再計算して存在を完全検証する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 木距離を基準点・直径・中心から捉える。

木距離・直径・中心・最遠点で得た考え方と実装を再利用し、加法的tree metric復元の発動条件・正当化・境界を重複なく学ぶ。

- 加法的tree metric復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC451 E 公式問題文](https://atcoder.jp/contests/abc451/tasks/abc451_e)
- [ABC451 E 公式解説](https://atcoder.jp/contests/abc451/editorial/18053)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-additive-tree-metric-reconstruction`
