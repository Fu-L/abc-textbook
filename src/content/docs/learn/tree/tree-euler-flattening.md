---
title: "Euler順による部分木区間化"
description: "Euler順による部分木区間化の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 73
---

# Euler順による部分木区間化

## 概要

### Euler順による部分木区間化

DFS入退時刻で各部分木を連続区間へ写し、配列上の更新・集約へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

DFS入退時刻で各部分木を連続区間へ写し、配列上の更新・集約へ変換する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e)
2. [ABC406 F「Compare Tree Weights」](https://atcoder.jp/contests/abc406/tasks/abc406_f)
3. [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g)

## 根拠

- [ABC240 E 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 E 公式解説](https://atcoder.jp/contests/abc240/editorial/3426)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)
- [ABC337 G 公式解説](https://atcoder.jp/contests/abc337/editorial/9128)
- [ABC337 G 公式問題文](https://atcoder.jp/contests/abc337/tasks/abc337_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-tree-euler-flattening`
