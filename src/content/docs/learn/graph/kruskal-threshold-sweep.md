---
title: "Kruskal順の閾値DSU sweep"
description: "「Kruskal順の閾値DSU sweep」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 110
---

# Kruskal順の閾値DSU sweep

習得対象の目安: **青色（1600–1999）**。辺とqueryを同じ重み順に処理し、連結する閾値と同重みの扱いを整理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Kruskal順の閾値DSU sweep

辺とqueryを重み順に並べ、同重みの処理順を明示してDSU成分とmetadataを更新し、二点が初めて連結するminimax閾値で判定・pairing・集計を行う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)、[cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。

DSUによる成分管理とMSTのcut・cycle性質を学んだ後、辺重み順のprefixが閾値部分graphと一致する不変条件からminimax連結時刻をquery・集計へ使う。

### このUnitでは扱わないもの

- Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e)
2. [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e)
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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-kruskal-threshold-sweep`
