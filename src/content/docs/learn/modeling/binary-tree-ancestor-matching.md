---
title: "二進操作の木へのモデル化と祖先マッチング"
description: "「二進操作の木へのモデル化と祖先マッチング」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 11
---

# 二進操作の木へのモデル化と祖先マッチング

習得対象の目安: **青色（1600–1999）**。二進操作を祖先への移動に写し、深い一致から確定する交換論法を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 二進操作の木へのモデル化と祖先マッチング

二進末尾の削除を親への辺に写し、深い頂点で需要と供給を相殺して余剰だけを祖先へ渡す。両側の移動可能な辺を区別し、深い一致を優先する交換論法で移動数の最小性を示す。

### 習得する技能

- 二進末尾の削除を親への辺に写し、深い頂点で需要と供給を相殺して余剰だけを祖先へ渡す。両側の移動可能な辺を区別し、深い一致を優先する交換論法で移動数の最小性を示す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

このUnitを直接前提とする単元: なし。

貪欲法と交換論で得た考え方と実装を再利用し、二進操作の木へのモデル化と祖先マッチングの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 二進操作の木へのモデル化と祖先マッチングの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC254 Ex「Multiply or Divide by 2」](https://atcoder.jp/contests/abc254/tasks/abc254_h) — 主題: [二進操作の木へのモデル化と祖先マッチング](/learn/modeling/binary-tree-ancestor-matching/)（二進末尾の削除を親への辺に写し、深い頂点で需要と供給を相殺して余剰だけを祖先へ渡す。両側の移動可能な辺を区別し、深い一致を優先する交換論法で移動数の最小性を示す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC254 H 公式解説](https://atcoder.jp/contests/abc254/editorial/4053)
- [ABC254 H 公式問題文](https://atcoder.jp/contests/abc254/tasks/abc254_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-binary-tree-ancestor-matching`
