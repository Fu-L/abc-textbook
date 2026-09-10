---
title: "指定次数parityの部分グラフ構成"
description: "指定次数parityの部分グラフ構成の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 159
---

# 指定次数parityの部分グラフ構成

## 概要

### 指定次数parityの部分グラフ構成

選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: Euler trail・circuit。

Euler trail・circuitで得た考え方と実装を再利用し、指定次数parityの部分グラフ構成の発動条件・正当化・境界を重複なく学ぶ。

- 指定次数parityの部分グラフ構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC345 F 公式解説](https://atcoder.jp/contests/abc345/editorial/9558)
- [ABC345 F 公式問題文](https://atcoder.jp/contests/abc345/tasks/abc345_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-degree-parity-subgraph`
