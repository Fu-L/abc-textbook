---
title: "次数構造からgraph coreまたは小さなkernelへ縮約する"
description: "「次数構造からgraph coreまたは小さなkernelへ縮約する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 113
---

# 次数構造からgraph coreまたは小さなkernelへ縮約する

導入対象の目安: **水色（1200–1599）**。次数条件で頂点を取り除き、残る核を取り出す入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

連結性を探索できることを前提に、低次数頂点を反復削除してcycle coreや小さなkernelを露出させる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- DFS時刻とlowlink値による橋・関節点の判定。

## 下位単元

- [graph core・leaf peeling](/learn/graph/graph-core/) — 水色
- [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)
- [ABC267 E 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC267 E 公式解説](https://atcoder.jp/contests/abc267/editorial/4729)
- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-graph-core-peeling`
