---
title: "文字列周期・primitive word"
description: "「文字列周期・primitive word」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 151
---

# 文字列周期・primitive word

習得対象の目安: **青色（1600–1999）**。prefix一致・border・primitive rootを結び付け、周期の必要十分条件を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第109単元。技能の説明を学んでから問題一覧へ進んでください。

前: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/) ／ 次: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)

## 概要

### 文字列周期・primitive word

prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。

### 習得する技能

- prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。

Z algorithmによるprefix matchingで得た考え方と実装を再利用し、文字列周期・primitive wordの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 文字列周期・primitive wordの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h) — 主題: [文字列周期・primitive word](/learn/string/string-periodicity/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-string-periodicity`
