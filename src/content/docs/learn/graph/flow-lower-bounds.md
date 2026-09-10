---
title: "下限制約付きflowの実現可能性"
description: "下限制約付きflowの実現可能性の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 193
---

# 下限制約付きflowの実現可能性

## 概要

### 下限制約付きflowの実現可能性

各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最大流・最小カット。

最大流・最小カットで得た考え方と実装を再利用し、下限制約付きflowの実現可能性の発動条件・正当化・境界を重複なく学ぶ。

- 下限制約付きflowの実現可能性の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC285 G 公式解説](https://atcoder.jp/contests/abc285/editorial/5500)
- [ABC285 G 公式問題文](https://atcoder.jp/contests/abc285/tasks/abc285_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-flow-lower-bounds`
