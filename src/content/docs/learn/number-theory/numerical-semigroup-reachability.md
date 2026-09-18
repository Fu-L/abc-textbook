---
title: "数値半群のconductor以後を一括到達とみなす"
description: "「数値半群のconductor以後を一括到達とみなす」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 177
---

# 数値半群のconductor以後を一括到達とみなす

難度の目安: **発展**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 数値半群・conductor

正の生成元の非負整数結合がconductor以後を全て覆うことを示し、巨大な到達判定を有限prefixへ縮約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。

生成元をgcdで正規化し、非負整数結合の到達集合がconductor以後の全整数を含むことを示して巨大距離を有限prefixへ縮約する。

### このUnitでは扱わないもの

- 負の係数も許す整数線形結合のgcd可解性だけを判定する問題、および使用回数に上限がある有限knapsack。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC388 F 公式解説](https://atcoder.jp/contests/abc388/editorial/11910)
- [ABC388 F 公式問題文](https://atcoder.jp/contests/abc388/tasks/abc388_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-numerical-semigroup-reachability`
