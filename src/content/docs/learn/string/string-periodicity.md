---
title: "文字列周期・primitive word"
description: "「文字列周期・primitive word」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 152
---

# 文字列周期・primitive word

習得対象の目安: **青色（1600–1999）**。prefix一致・border・primitive rootを結び付け、周期の必要十分条件を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 文字列周期・primitive word

prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。

### 習得する技能

- prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。

このUnitを直接前提とする単元: なし。

Z algorithmによるprefix matchingで得た考え方と実装を再利用し、文字列周期・primitive wordの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 文字列周期・primitive wordの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h) — 主題: [文字列周期・primitive word](/learn/string/string-periodicity/)（prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1d03846ca5c5afa48c210e3527c3d0a048880fc11e6612e8ba16e5387f6de90a` / LearningUnit `unit-string-periodicity`
