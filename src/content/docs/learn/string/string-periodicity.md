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

## 概要

### 文字列周期・primitive word

prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。

Z algorithmによるprefix matchingで得た考え方と実装を再利用し、文字列周期・primitive wordの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 文字列周期・primitive wordの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-string-periodicity`
