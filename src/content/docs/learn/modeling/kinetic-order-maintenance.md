---
title: "kinetic sorting・交差event順序更新"
description: "「kinetic sorting・交差event順序更新」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 16
---

# kinetic sorting・交差event順序更新

習得対象の目安: **橙色（2400–2799）**。連続的な順序変化を隣接交差に限定し、失効eventと総event数を管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### kinetic sorting・交差event順序更新

連続parameterで隣接要素の順序が入れ替わる時刻だけをevent化し、次の有効交差を処理して全順序を更新する。

### 習得する技能

- 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。

このUnitを直接前提とする単元: なし。

event・値順のオフライン走査で得た考え方と実装を再利用し、kinetic sorting・交差event順序更新の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- kinetic sorting・交差event順序更新の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC344 G「Points and Comparison」](https://atcoder.jp/contests/abc344/tasks/abc344_g) — 主題: [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/)（隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。既習技能: [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/)（隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。）。

## 根拠

- [ABC257 H 公式解説](https://atcoder.jp/contests/abc257/editorial/4168)
- [ABC257 H 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC344 G 公式解説](https://atcoder.jp/contests/abc344/editorial/9491)
- [ABC344 G 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `92099379c10b1293bc646a527638868dd1efe0702c16fd1e83cad6f8052521cb` / LearningUnit `unit-kinetic-order-maintenance`
