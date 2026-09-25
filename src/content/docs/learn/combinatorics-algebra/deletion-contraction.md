---
title: "削除・縮約recurrence"
description: "「削除・縮約recurrence」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 192
---

# 削除・縮約recurrence

習得対象の目安: **黄色（2000–2399）**。辺の削除と縮約が対象をどう分割するかを示し、graphの計数再帰を立てる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 削除・縮約recurrence

辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。

### 習得する技能

- 辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 削除・縮約recurrenceの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC294 Ex「K-Coloring」](https://atcoder.jp/contests/abc294/tasks/abc294_h) — 主題: [subset convolution](/learn/combinatorics-algebra/subset-convolution/)（互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/)（辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `bc3fd38aa082c37e76f0829dcc0cff7e6d53e5b699f0b15c0b0432ab980d791f` / LearningUnit `unit-deletion-contraction`
