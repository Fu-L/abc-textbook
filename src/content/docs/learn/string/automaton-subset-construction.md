---
title: "非決定性automatonのsubset construction"
description: "「非決定性automatonのsubset construction」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 157
---

# 非決定性automatonのsubset construction

習得対象の目安: **黄色（2000–2399）**。NFAの可能状態集合を一状態へ写し、受理条件と指数的な状態数を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 非決定性automatonのsubset construction

同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。

有限状態automatonの構成で得た考え方と実装を再利用し、非決定性automatonのsubset constructionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 非決定性automatonのsubset constructionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-automaton-subset-construction`
