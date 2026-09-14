---
title: "木DP・集約・rerooting"
description: "「木DP・集約・rerooting」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 58
---

# 木DP・集約・rerooting

## 概要

探索で親子関係を作りDP状態を定義できた後、子側の集約と親側への差し替えで木全体の値を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

### このUnitでは扱わないもの

- heap番号で暗黙に表された完全二分木の区間算術、木上パスの連続区間分解、重心による再帰分解、および更新のためのTop Tree cluster化。

## 下位単元

- [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)
- [rerooting・全方位木DP](/learn/tree/rerooting/)
- [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC298 Ex「Sum of Min of Length」](https://atcoder.jp/contests/abc298/tasks/abc298_h)
- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC329 G「Delivery on Tree」](https://atcoder.jp/contests/abc329/tasks/abc329_g)
- [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g)
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f)
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f)
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f)
- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g)

## 根拠

- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC223 G 公式解説](https://atcoder.jp/contests/abc223/editorial/2775)
- [ABC223 G 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_g)
- [ABC239 E 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_e)
- [ABC239 E 公式解説](https://atcoder.jp/contests/abc239/editorial/3385)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-tree-aggregation`
