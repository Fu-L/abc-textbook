---
title: "下限制約付きflowの実現可能性"
description: "「下限制約付きflowの実現可能性」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 122
---

# 下限制約付きflowの実現可能性

習得対象の目安: **黄色（2000–2399）**。下限を需要へ移し、補助source・sinkでcirculationの可解性を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 下限制約付きflowの実現可能性

各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。

最大流・最小カットで得た考え方と実装を再利用し、下限制約付きflowの実現可能性の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 下限制約付きflowの実現可能性の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC285 G 公式解説](https://atcoder.jp/contests/abc285/editorial/5500)
- [ABC285 G 公式問題文](https://atcoder.jp/contests/abc285/tasks/abc285_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-flow-lower-bounds`
