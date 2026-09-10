---
title: "一般グラフの最小重み完全matching"
description: "一般グラフの最小重み完全matchingの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 211
---

# 一般グラフの最小重み完全matching

## 概要

### 一般グラフの最小重み完全matching

奇cycleを含む一般グラフで全頂点をpairにし、weighted blossomまたは重み付きTutte多項式の最小次数からperfect matchingの重みを最小化する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 二部matching・Hall・Kőnig。

二部matchingでは表せないpairing模型を作った後、奇cycleを扱うweighted blossomまたは重み付きTutte多項式で最小重みまで求める。

- 一般グラフの最小重み完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC412 G 公式解説](https://atcoder.jp/contests/abc412/editorial/13380)
- [ABC412 G 公式問題文](https://atcoder.jp/contests/abc412/tasks/abc412_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-min-weight-general-perfect-matching`
