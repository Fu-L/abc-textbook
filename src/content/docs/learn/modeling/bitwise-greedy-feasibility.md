---
title: "bitwise greedyによるmask最適化"
description: "「bitwise greedyによるmask最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 10
---

# bitwise greedyによるmask最適化

習得対象の目安: **水色（1200–1599）**。上位bitの優先性と単調な可否判定を組み合わせてmaskを決める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### bitwise greedyによるmask最適化

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。

### 習得する技能

- 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- bitwise greedyによるmask最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e) — 主題: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)（上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC408 E 公式問題文](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC408 E 公式解説](https://atcoder.jp/contests/abc408/editorial/13159)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `c6f65fe967897b3b327c1c837df5c30f493b2f2f75185478863272b445d1ff85` / LearningUnit `unit-bitwise-greedy-feasibility`
