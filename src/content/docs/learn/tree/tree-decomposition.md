---
title: "包含木の構築とancestor・path分解"
description: "「包含木の構築とancestor・path分解」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 132
---

# 包含木の構築とancestor・path分解

導入対象の目安: **水色（1200–1599）**。木を区間や祖先関係へ写し、配列上の算法へ接続する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

基本的な木DFSを土台に、laminar区間をstackで包含木へ変換し、binary liftingでancestor・LCAを問い合わせ、Euler in/outで部分木を区間化し、HLDでpathをheavy path列へ分け、対象頂点と必要なLCAだけをvirtual treeへ縮約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- LCAという概念で対象を一意分類するだけで、ancestor query・Euler区間化・HLD・virtual treeを実装利用しない数え上げ、および重心による再帰分解。

## 下位単元

- [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/) — 青色
- [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/) — 水色
- [ancestor query・LCA](/learn/tree/tree-ancestor-lca/) — 水色
- [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/) — 青色
- [virtual tree・auxiliary tree](/learn/tree/virtual-tree/) — 黄色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g)
- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f)

## 根拠

- [ABC240 E 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 E 公式解説](https://atcoder.jp/contests/abc240/editorial/3426)
- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-tree-decomposition`
