---
title: "near-tree graphのkernel化"
description: "near-tree graphのkernel化の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 145
---

# near-tree graphのkernel化

## 概要

### near-tree graphのkernel化

terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: cycle space・fundamental cycle basis、graph core・leaf peeling。

cycle space・fundamental cycle basis・graph core・leaf peelingで得た考え方と実装を再利用し、near-tree graphのkernel化の発動条件・正当化・境界を重複なく学ぶ。

- near-tree graphのkernel化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-near-tree-kernelization`
