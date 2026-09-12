---
title: "Stern–Brocot木の経路と祖先"
description: "Stern–Brocot木の経路と祖先の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 144
---

# Stern–Brocot木の経路と祖先

## 概要

### Stern–Brocot木の経路と祖先

隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。

隣接するa/b<c/dのbc-ad=1を不変量にmediant(a+c)/(b+d)を挿入する。左右への一歩を巨大回数繰り返す代わりにEuclidの商で一括移動する。ABC273 Exでは必要な祖先集合を合併して数える工程までが対象で、分母上限の最良近似は求めていない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: gcd不変量・差分構造。

gcd不変量・差分構造で得た考え方と実装を再利用し、Stern–Brocot木の経路と祖先の発動条件・正当化・境界を重複なく学ぶ。

- Stern–Brocot木の経路と祖先の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-stern-brocot-ancestry`
