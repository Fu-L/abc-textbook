---
title: "Prüfer code・次数制約付きlabel木"
description: "Prüfer code・次数制約付きlabel木の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 170
---

# Prüfer code・次数制約付きlabel木

## 概要

### Prüfer code・次数制約付きlabel木

label付き木を長さN-2の列へ全単射し、頂点の出現回数=次数-1として次数条件を独立な係数条件へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 組合せ係数と対称性で数える。

組合せ係数・数え上げで得た考え方と実装を再利用し、Prüfer code・次数制約付きlabel木の発動条件・正当化・境界を重複なく学ぶ。

- Prüfer code・次数制約付きlabel木の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC303 H 公式解説](https://atcoder.jp/contests/abc303/editorial/6425)
- [ABC303 H 公式問題文](https://atcoder.jp/contests/abc303/tasks/abc303_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-prufer-code`
