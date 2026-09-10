---
title: "平面graph双対・cut/path対応"
description: "平面graph双対・cut/path対応の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 181
---

# 平面graph双対・cut/path対応

## 概要

### 平面graph双対・cut/path対応

埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最大流・最小カット、最短路モデル。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、平面graph双対・cut/path対応の発動条件・正当化・境界を重複なく学ぶ。

- 平面graph双対・cut/path対応の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC413 G 公式解説](https://atcoder.jp/contests/abc413/editorial/13403)
- [ABC413 G 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-planar-duality`
