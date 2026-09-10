---
title: "静的graph等式制約のpotential伝播"
description: "静的graph等式制約のpotential伝播の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 178
---

# 静的graph等式制約のpotential伝播

## 概要

### 静的graph等式制約のpotential伝播

可逆な加法・XOR演算で x_v=x_u⊙w と書ける辺等式をDFS/BFSで伝播し、cycle整合性を検査して各連結成分の解をroot offset一つで表す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 状態グラフのモデリングと探索。

通常のDFS・BFSを土台に、辺等式からroot-relative potentialを静的に伝播し、cycle整合性と成分offsetの自由度を分離する。

- 静的graph等式制約のpotential伝播の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC280 F「Pay or Receive」](https://atcoder.jp/contests/abc280/tasks/abc280_f)
2. [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f)

## 根拠

- [ABC280 F 公式解説](https://atcoder.jp/contests/abc280/editorial/5303)
- [ABC280 F 公式問題文](https://atcoder.jp/contests/abc280/tasks/abc280_f)
- [ABC352 F 公式解説](https://atcoder.jp/contests/abc352/editorial/9924)
- [ABC352 F 公式問題文](https://atcoder.jp/contests/abc352/tasks/abc352_f)
- [ABC396 E 公式問題文](https://atcoder.jp/contests/abc396/tasks/abc396_e)
- [ABC396 E 公式解説](https://atcoder.jp/contests/abc396/editorial/12390)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-graph-potential-propagation`
