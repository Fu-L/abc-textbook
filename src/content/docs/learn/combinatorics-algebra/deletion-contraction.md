---
title: "削除・縮約recurrence"
description: "「削除・縮約recurrence」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 189
---

# 削除・縮約recurrence

習得対象の目安: **黄色（2000–2399）**。辺の削除と縮約が対象をどう分割するかを示し、graphの計数再帰を立てる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第161単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Segment Tree Beats](/learn/query/segment-tree-beats/) ／ 次: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)

## 概要

### 削除・縮約recurrence

辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。

### 習得する技能

- 辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 削除・縮約recurrenceの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC294 Ex「K-Coloring」](https://atcoder.jp/contests/abc294/tasks/abc294_h) — 主題: [subset convolution](/learn/combinatorics-algebra/subset-convolution/)。既習技能: 辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-deletion-contraction`
