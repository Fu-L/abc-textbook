---
title: "大小関係をCartesian treeへ変換する"
description: "大小関係をCartesian treeへ変換するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 97
---

# 大小関係をCartesian treeへ変換する

## 概要

### Cartesian treeによる区間極値分解

配列順と値のheap順を同時に保つ木を構成し、区間極値を根とする再帰分割へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 支配関係から不要な候補を単調stack・queueで削る。

単調stackの支配関係を親子関係へ持ち上げ、配列の区間極値を部分木境界として分割処理へ使う。

- 最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC420 F「kirinuki」](https://atcoder.jp/contests/abc420/tasks/abc420_f)
2. [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)

## 根拠

- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC420 F 公式解説](https://atcoder.jp/contests/abc420/editorial/13741)
- [ABC420 F 公式問題文](https://atcoder.jp/contests/abc420/tasks/abc420_f)
- [ABC435 F 公式解説](https://atcoder.jp/contests/abc435/editorial/14734)
- [ABC435 F 公式問題文](https://atcoder.jp/contests/abc435/tasks/abc435_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-cartesian-tree`
