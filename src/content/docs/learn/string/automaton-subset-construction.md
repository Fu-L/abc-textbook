---
title: "非決定性automatonのsubset construction"
description: "非決定性automatonのsubset constructionの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 110
---

# 非決定性automatonのsubset construction

## 概要

### 非決定性automatonのsubset construction

同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 有限状態automatonの構成。

有限状態automatonの構成で得た考え方と実装を再利用し、非決定性automatonのsubset constructionの発動条件・正当化・境界を重複なく学ぶ。

- 非決定性automatonのsubset constructionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-automaton-subset-construction`
