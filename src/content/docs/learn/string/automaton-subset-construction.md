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

## 標準履修順

第153単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/) ／ 次: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)

## 概要

### 非決定性automatonのsubset construction

同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。

### 習得する技能

- 同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。

有限状態automatonの構成で得た考え方と実装を再利用し、非決定性automatonのsubset constructionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 非決定性automatonのsubset constructionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-automaton-subset-construction`
