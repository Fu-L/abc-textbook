---
title: "DSU merge tree・Kruskal reconstruction tree"
description: "「DSU merge tree・Kruskal reconstruction tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 143
---

# DSU merge tree・Kruskal reconstruction tree

習得対象の目安: **青色（1600–1999）**。DSUの併合履歴を木に保存し、時刻や閾値のqueryを祖先関係へ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### DSU merge tree・Kruskal reconstruction tree

成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。

DSUによる連結成分管理・縮約で得た考え方と実装を再利用し、DSU merge tree・Kruskal reconstruction treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- DSU merge tree・Kruskal reconstruction treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
2. [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC235 H 公式解説](https://atcoder.jp/contests/abc235/editorial/3250)
- [ABC235 H 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_h)
- [ABC314 F 公式解説](https://atcoder.jp/contests/abc314/editorial/6953)
- [ABC314 F 公式問題文](https://atcoder.jp/contests/abc314/tasks/abc314_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dsu-merge-tree`
