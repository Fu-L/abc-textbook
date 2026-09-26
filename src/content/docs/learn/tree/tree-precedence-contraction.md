---
title: "01 on Tree・親先行順序のcluster縮約"
description: "「01 on Tree・親先行順序のcluster縮約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 145
---

# 01 on Tree・親先行順序のcluster縮約

習得対象の目安: **橙色（2400–2799）**。親先行制約の交換比較量を導き、clusterをheapとDSUで縮約する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 01 on Tree・親先行順序のcluster縮約

親が子より先という順序制約の下でclusterの交換比較量を導き、priority queueとDSUで最良clusterを親へ縮約する。

### 習得する技能

- 親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)、[交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

このUnitを直接前提とする単元: なし。

DSUによる連結成分管理・縮約・貪欲法と交換論で得た考え方と実装を再利用し、01 on Tree・親先行順序のcluster縮約の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 01 on Tree・親先行順序のcluster縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)（親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC376 G 公式解説](https://atcoder.jp/contests/abc376/editorial/11196)
- [ABC376 G 公式問題文](https://atcoder.jp/contests/abc376/tasks/abc376_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1d03846ca5c5afa48c210e3527c3d0a048880fc11e6612e8ba16e5387f6de90a` / LearningUnit `unit-tree-precedence-contraction`
