---
title: "path matchingのheap縮約greedy"
description: "path matchingのheap縮約greedyの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 181
---

# path matchingのheap縮約greedy

## 概要

### path matchingのheap縮約greedy

pathの非隣接edgeからk本を選ぶ最小重みmatchingを、最小edgeの採用と近傍二辺の補正縮約 w_l+w_r-w_i により全cardinalityについて順に求める。

列の非隣接な要素iを選ぶことは、頂点0,…,nのpathで辺(i-1,i)を選ぶmatchingと同値。ABC218 Hの最大化はw_i=-B_iで最小化へ写り、w_l+w_r-w_iの符号を戻すとB_l+B_r-B_iとなる。個数を固定するため、途中の負の限界利益を勝手に打ち切らない。

端の辺を採用したときは存在しない隣辺を通常の重み0として扱わない。その辺と唯一の隣辺を除き、内部のときだけ左右二辺と中央を補正辺へ置き換える。番兵を使う実装では実辺を表さないことと、無限値の加減算を避けることを確認する。ABC464 GとABC218 Hで端点と選択可能数を比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 交換論から選択順を導く、priority queue・best-first列挙。

path matchingの交互構造を使い、最小edgeの採用後も残りの全cardinality最適値を保存する補正縮約を導いてheapと双方向linkで実装する。

- path matchingのheap縮約greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g)
2. [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC464 G 公式解説](https://atcoder.jp/contests/abc464/editorial/22263)
- [ABC464 G 公式問題文](https://atcoder.jp/contests/abc464/tasks/abc464_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-path-matching-contraction`
