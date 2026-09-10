---
title: "次数構造からgraph coreまたは小さなkernelへ縮約する"
description: "次数構造からgraph coreまたは小さなkernelへ縮約するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 66
---

# 次数構造からgraph coreまたは小さなkernelへ縮約する

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

連結性を探索できることを前提に、低次数頂点を反復削除してcycle coreや小さなkernelを露出させる。

- DFS時刻とlowlink値による橋・関節点の判定。

## 下位単元

- [graph core・leaf peeling](/learn/graph/graph-core/)
- [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e)

## 根拠

- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)
- [ABC267 E 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC267 E 公式解説](https://atcoder.jp/contests/abc267/editorial/4729)
- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-graph-core-peeling`
