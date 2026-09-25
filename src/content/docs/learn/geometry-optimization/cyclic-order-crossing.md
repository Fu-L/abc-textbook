---
title: "円環順序・chord交差"
description: "「円環順序・chord交差」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 217
---

# 円環順序・chord交差

習得対象の目安: **青色（1600–1999）**。円環を切って端点順を線形化し、交互配置と包含構造で交差を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第119単元。技能の説明を学んでから問題一覧へ進んでください。

前: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/) ／ 次: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)

## 概要

### 円環順序・chord交差

円周上の端点順をcutで線形化し、二chordの端点交互配置またはlaminar括弧構造として交差を判定・数え上げる。

### 習得する技能

- 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。

幾何の基本判定・配置・座標変換で得た考え方と実装を再利用し、円環順序・chord交差の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 円環順序・chord交差の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC338 E「Chords」](https://atcoder.jp/contests/abc338/tasks/abc338_e) — 主題: [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)。
2. [ABC424 F「Adding Chords」](https://atcoder.jp/contests/abc424/tasks/abc424_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。
3. [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。

## 根拠

- [ABC263 H 公式解説](https://atcoder.jp/contests/abc263/editorial/4547)
- [ABC263 H 公式問題文](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC338 E 公式問題文](https://atcoder.jp/contests/abc338/tasks/abc338_e)
- [ABC338 E 公式解説](https://atcoder.jp/contests/abc338/editorial/9172)
- [ABC405 F 公式解説](https://atcoder.jp/contests/abc405/editorial/13009)
- [ABC405 F 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-cyclic-order-crossing`
