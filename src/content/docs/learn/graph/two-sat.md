---
title: "2-SAT・含意グラフ"
description: "「2-SAT・含意グラフ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 100
---

# 2-SAT・含意グラフ

習得対象の目安: **青色（1600–1999）**。二値制約を含意へ変換し、literalと否定のSCCから可解性と代入を得る。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第126単元。技能の説明を学んでから問題一覧へ進んでください。

前: [永続data structure・structural sharing](/learn/query/persistence/) ／ 次: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)

## 概要

### 2-SAT・含意グラフ

二値選択のclauseを含意辺へ変換し、literalと否定literalのSCC関係から可解性と代入を得る。

### 習得する技能

- 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、2-SAT・含意グラフの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 2-SAT・含意グラフの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC277 Ex「Constrained Sums」](https://atcoder.jp/contests/abc277/tasks/abc277_h) — 主題: [2-SAT・含意グラフ](/learn/graph/two-sat/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC277 H 公式解説](https://atcoder.jp/contests/abc277/editorial/5207)
- [ABC277 H 公式問題文](https://atcoder.jp/contests/abc277/tasks/abc277_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-two-sat`
