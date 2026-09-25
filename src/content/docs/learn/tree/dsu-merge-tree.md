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

## 標準履修順

第127単元。技能の説明を学んでから問題一覧へ進んでください。

前: [2-SAT・含意グラフ](/learn/graph/two-sat/) ／ 次: [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/)

## 概要

### DSU merge tree・Kruskal reconstruction tree

成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。

### 習得する技能

- 成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。

DSUによる連結成分管理・縮約で得た考え方と実装を再利用し、DSU merge tree・Kruskal reconstruction treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- DSU merge tree・Kruskal reconstruction treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
2. [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC235 H 公式解説](https://atcoder.jp/contests/abc235/editorial/3250)
- [ABC235 H 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_h)
- [ABC314 F 公式解説](https://atcoder.jp/contests/abc314/editorial/6953)
- [ABC314 F 公式問題文](https://atcoder.jp/contests/abc314/tasks/abc314_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dsu-merge-tree`
