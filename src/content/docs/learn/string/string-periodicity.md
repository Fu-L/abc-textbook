---
title: "文字列周期・primitive word"
description: "文字列周期・primitive wordの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 105
---

# 文字列周期・primitive word

## 概要

### 文字列周期・primitive word

prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: Z algorithmによるprefix matching。

Z algorithmによるprefix matchingで得た考え方と実装を再利用し、文字列周期・primitive wordの発動条件・正当化・境界を重複なく学ぶ。

- 文字列周期・primitive wordの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-string-periodicity`
