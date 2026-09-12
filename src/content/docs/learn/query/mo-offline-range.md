---
title: "Moの順序で区間問い合わせの差分を更新する"
description: "Moの順序で区間問い合わせの差分を更新するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 63
---

# Moの順序で区間問い合わせの差分を更新する

## 概要

### Mo's algorithmによるオフライン区間問い合わせ

区間問い合わせを端点の移動量が小さい順に並べ、一要素の追加・削除で答えを更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

区間への要素の追加・削除を定義し、問い合わせ順を並べ替えて端点移動の総量を抑える。

- オンラインのpriority queue・multiset、および単調stack・queue。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC293 G「Triple Index」](https://atcoder.jp/contests/abc293/tasks/abc293_g)
2. [ABC463 G「Random Walk Distance」](https://atcoder.jp/contests/abc463/tasks/abc463_g)
3. [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC242 G「Range Pairing Query」](https://atcoder.jp/contests/abc242/tasks/abc242_g)
- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)

## 根拠

- [ABC242 G 公式解説](https://atcoder.jp/contests/abc242/editorial/3517)
- [ABC242 G 公式問題文](https://atcoder.jp/contests/abc242/tasks/abc242_g)
- [ABC293 G 公式解説](https://atcoder.jp/contests/abc293/editorial/5947)
- [ABC293 G 公式問題文](https://atcoder.jp/contests/abc293/tasks/abc293_g)
- [ABC384 G 公式解説](https://atcoder.jp/contests/abc384/editorial/11548)
- [ABC384 G 公式問題文](https://atcoder.jp/contests/abc384/tasks/abc384_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-mo-offline-range`
