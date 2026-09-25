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

## 標準履修順

第107単元。技能の説明を学んでから問題一覧へ進んでください。

前: [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/) ／ 次: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)

## 概要

### bitwise greedyによるmask最適化

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。

### 習得する技能

- 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- bitwise greedyによるmask最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e) — 主題: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC408 E 公式問題文](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC408 E 公式解説](https://atcoder.jp/contests/abc408/editorial/13159)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-bitwise-greedy-feasibility`
