---
title: "冪等演算のoverlap range query・Sparse Table"
description: "「冪等演算のoverlap range query・Sparse Table」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 70
---

# 冪等演算のoverlap range query・Sparse Table

## 概要

### 冪等演算のoverlap range query・Sparse Table

冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。

ABC282 Exでは各再帰区間の最小値とその位置をRMQで取得し、その位置を含む部分区間を数えて左右へ再帰する。Sparse Tableに(値,位置)のminを保持すれば同値の規約も固定できる。Cartesian treeで同じ最小位置の分割を表す構成は別実装として比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 区間monoid要約。

区間monoid要約で得た考え方と実装を再利用し、冪等演算のoverlap range query・Sparse Tableの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 冪等演算のoverlap range query・Sparse Tableの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f)

## 根拠

- [ABC282 F 公式解説](https://atcoder.jp/contests/abc282/editorial/5403)
- [ABC282 H 公式解説](https://atcoder.jp/contests/abc282/editorial/5404)
- [ABC282 H 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_h)
- [ABC282 F 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-idempotent-overlap-range-query`
