---
title: "Kruskal順の閾値DSU sweep"
description: "Kruskal順の閾値DSU sweepの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 200
---

# Kruskal順の閾値DSU sweep

## 概要

### Kruskal順の閾値DSU sweep

辺とqueryを重み順に並べ、同重みの処理順を明示してDSU成分とmetadataを更新し、二点が初めて連結するminimax閾値で判定・pairing・集計を行う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: DSUによる連結成分管理・縮約、cut・cycle性質から最適全域木を構成する。

DSUによる成分管理とMSTのcut・cycle性質を学んだ後、辺重み順のprefixが閾値部分graphと一致する不変条件からminimax連結時刻をquery・集計へ使う。

- Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e)
2. [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e)
3. [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)
4. [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC235 E 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC235 E 公式解説](https://atcoder.jp/contests/abc235/editorial/3254)
- [ABC250 H 公式解説](https://atcoder.jp/contests/abc250/editorial/3908)
- [ABC250 H 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-kruskal-threshold-sweep`
