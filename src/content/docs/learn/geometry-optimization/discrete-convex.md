---
title: "凸性・傾き・限界費用・slope trick"
description: "凸性・傾き・限界費用・slope trickの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 90
---

# 凸性・傾き・限界費用・slope trick

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

目的関数の凸・凹性と傾き変化を捉え、breakpointや限界費用から最適点を求める。

- 真偽値の単調境界探索と、交換論だけで決まる貪欲順。

## 下位単元

- [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)
- [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)
- [slope trick](/learn/geometry-optimization/slope-trick/)
- [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)
- [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)
- [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g)
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f)
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g)
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)
- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e)

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC224 G 公式解説](https://atcoder.jp/contests/abc224/editorial/2816)
- [ABC224 G 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-discrete-convex`
