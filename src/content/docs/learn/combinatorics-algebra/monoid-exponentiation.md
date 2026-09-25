---
title: "monoid exponentiation・連結演算doubling"
description: "「monoid exponentiation・連結演算doubling」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 194
---

# monoid exponentiation・連結演算doubling

習得対象の目安: **水色（1200–1599）**。結合則と単位元を定義し、数値以外の反復合成にも二分累乗を使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第85単元。技能の説明を学んでから問題一覧へ進んでください。

前: [最大流・最小カット](/learn/graph/max-flow-min-cut/) ／ 次: [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)

## 概要

### monoid exponentiation・連結演算doubling

長さ・値・補助剰余を含む要約の結合則と単位元を定義し、巨大な反復連結を二分累乗する。

### 習得する技能

- 反復対象を閉じた結合的要約へ持ち上げ、monoidの二分累乗で巨大な連結・合成を評価できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

長さ・値・補助剰余を含む要約の結合則と単位元を定義し、巨大な反復連結を二分累乗する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- monoid exponentiation・連結演算doublingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC448 E「Simple Division」](https://atcoder.jp/contests/abc448/tasks/abc448_e) — 主題: [monoid exponentiation・連結演算doubling](/learn/combinatorics-algebra/monoid-exponentiation/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC448 E 公式問題文](https://atcoder.jp/contests/abc448/tasks/abc448_e)
- [ABC448 E 公式解説](https://atcoder.jp/contests/abc448/editorial/16749)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-monoid-exponentiation`
