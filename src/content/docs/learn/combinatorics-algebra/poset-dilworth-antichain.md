---
title: "半順序・Dilworth・最大反鎖"
description: "半順序・Dilworth・最大反鎖の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 168
---

# 半順序・Dilworth・最大反鎖

## 概要

### 半順序・Dilworth・最大反鎖

比較可能性をposetとして明示し、antichain・chain cover・LDS・bipartite matching/min-cutの双対関係を選んで最適化する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 二部matching・Hall・Kőnig、列・区間・分割のDP。

二部matching・Hall・Kőnig・列・subsequence DPで得た考え方と実装を再利用し、半順序・Dilworth・最大反鎖の発動条件・正当化・境界を重複なく学ぶ。

- 半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h)
2. [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)
3. [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC237 H 公式解説](https://atcoder.jp/contests/abc237/editorial/3321)
- [ABC237 H 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC354 G 公式解説](https://atcoder.jp/contests/abc354/editorial/10029)
- [ABC354 G 公式問題文](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC457 G 公式解説](https://atcoder.jp/contests/abc457/editorial/20073)
- [ABC457 G 公式問題文](https://atcoder.jp/contests/abc457/tasks/abc457_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-poset-dilworth-antichain`
