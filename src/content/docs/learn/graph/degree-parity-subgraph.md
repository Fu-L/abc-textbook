---
title: "指定次数parityの部分グラフ構成"
description: "「指定次数parityの部分グラフ構成」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 117
---

# 指定次数parityの部分グラフ構成

習得対象の目安: **青色（1600–1999）**。木の葉から奇偶条件を確定し、指定した奇数次数集合を実現する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 指定次数parityの部分グラフ構成

選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。

### 習得する技能

- 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)。

このUnitを直接前提とする単元: なし。

Euler trail・circuitで得た考え方と実装を再利用し、指定次数parityの部分グラフ構成の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 指定次数parityの部分グラフ構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f) — 主題: [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/)（選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC345 F 公式解説](https://atcoder.jp/contests/abc345/editorial/9558)
- [ABC345 F 公式問題文](https://atcoder.jp/contests/abc345/tasks/abc345_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `33e4c8113deec1ccee9b61a9379e197530cbd5a6fb918e3b477bf71e2a2003da` / LearningUnit `unit-degree-parity-subgraph`
