---
title: "fractional programming・比率parametric search"
description: "fractional programming・比率parametric searchの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 96
---

# fractional programming・比率parametric search

## 概要

### fractional programming・比率parametric search

比率目標xに対して各寄与をbenefit-x·costへ変換し、和が非負かという単調な加法最適化へ帰着する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 単調境界を証明して探索する。

単調境界探索で得た考え方と実装を再利用し、fractional programming・比率parametric searchの発動条件・正当化・境界を重複なく学ぶ。

- fractional programming・比率parametric searchの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC324 F 公式解説](https://atcoder.jp/contests/abc324/editorial/7405)
- [ABC324 F 公式問題文](https://atcoder.jp/contests/abc324/tasks/abc324_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-fractional-parametric-search`
