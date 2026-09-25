---
title: "指定次数parityの部分グラフ構成"
description: "「指定次数parityの部分グラフ構成」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 118
---

# 指定次数parityの部分グラフ構成

習得対象の目安: **青色（1600–1999）**。木の葉から奇偶条件を確定し、指定した奇数次数集合を実現する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第106単元。技能の説明を学んでから問題一覧へ進んでください。

前: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/) ／ 次: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)

## 概要

### 指定次数parityの部分グラフ構成

選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。

### 習得する技能

- 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)。

Euler trail・circuitで得た考え方と実装を再利用し、指定次数parityの部分グラフ構成の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 指定次数parityの部分グラフ構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f) — 主題: [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC345 F 公式解説](https://atcoder.jp/contests/abc345/editorial/9558)
- [ABC345 F 公式問題文](https://atcoder.jp/contests/abc345/tasks/abc345_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-degree-parity-subgraph`
