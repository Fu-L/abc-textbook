---
title: "rerooting・全方位木DP"
description: "rerooting・全方位木DPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 154
---

# rerooting・全方位木DP

## 概要

### rerooting・全方位木DP

辺の両側情報とprefix/suffix合成を用いて、全ての根に対する木DP値を線形または準線形時間で得る。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 根付き木DP・部分木集約。

根付き木DP・部分木集約で得た考え方と実装を再利用し、rerooting・全方位木DPの発動条件・正当化・境界を重複なく学ぶ。

- rerooting・全方位木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC220 F「Distance Sums 2」](https://atcoder.jp/contests/abc220/tasks/abc220_f)
2. [ABC223 G「Vertex Deletion」](https://atcoder.jp/contests/abc223/tasks/abc223_g)
3. [ABC348 E「Minimize Sum of Distances」](https://atcoder.jp/contests/abc348/tasks/abc348_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h)
- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g)

## 根拠

- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC223 G 公式解説](https://atcoder.jp/contests/abc223/editorial/2775)
- [ABC223 G 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_g)
- [ABC311 H 公式解説](https://atcoder.jp/contests/abc311/editorial/6814)
- [ABC311 H 公式問題文](https://atcoder.jp/contests/abc311/tasks/abc311_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-rerooting`
