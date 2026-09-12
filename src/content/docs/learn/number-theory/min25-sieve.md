---
title: "Min_25・Lucy DP型の総和篩"
description: "Min_25・Lucy DP型の総和篩の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 188
---

# Min_25・Lucy DP型の総和篩

## 概要

### Min_25・Lucy DP型の総和篩

floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 素因数分解と約数構造。

素因数・約数分解で得た考え方と実装を再利用し、Min_25・Lucy DP型の総和篩の発動条件・正当化・境界を重複なく学ぶ。

- Min_25・Lucy DP型の総和篩の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC370 G「Divisible by 3」](https://atcoder.jp/contests/abc370/tasks/abc370_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC370 G 公式解説](https://atcoder.jp/contests/abc370/editorial/10869)
- [ABC370 G 公式問題文](https://atcoder.jp/contests/abc370/tasks/abc370_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-min25-sieve`
