---
title: "cut・cycle性質から最適全域木を構成する"
description: "「cut・cycle性質から最適全域木を構成する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 110
---

# cut・cycle性質から最適全域木を構成する

習得対象の目安: **水色（1200–1599）**。DSUやheapを用い、cut・cycle性質で全域木の辺選択を正当化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第55単元。技能の説明を学んでから問題一覧へ進んでください。

前: [推移閉包](/learn/graph/transitive-closure/) ／ 次: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)

## 概要

### 最小・最大全域木とcut・cycle性質

辺重み順の成分併合を交換論で正当化し、最小または最大全域木を構成して辺の採否を判定する。

### 習得する技能

- cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

貪欲の交換論を土台に、cut・cycle性質から最適全域木の辺の採否条件を導く。DSUはKruskal順の閾値sweepで初めて必須にする。

### このUnitでは扱わないもの

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 下位単元

- [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/) — 青色

## 問題一覧

1. [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
2. [ABC352 E「Clique Connect」](https://atcoder.jp/contests/abc352/tasks/abc352_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
3. [ABC282 E「Choose Two and Eat One」](https://atcoder.jp/contests/abc282/tasks/abc282_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。
4. [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
5. [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
6. [ABC355 F「MST Query」](https://atcoder.jp/contests/abc355/tasks/abc355_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

## 根拠

- [ABC218 E 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 E 公式解説](https://atcoder.jp/contests/abc218/editorial/2580)
- [ABC235 E 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC235 E 公式解説](https://atcoder.jp/contests/abc235/editorial/3254)
- [ABC250 H 公式解説](https://atcoder.jp/contests/abc250/editorial/3908)
- [ABC250 H 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-spanning-tree-optimization`
