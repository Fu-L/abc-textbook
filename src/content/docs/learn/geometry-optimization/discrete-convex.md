---
title: "凸性・傾き・限界費用・slope trick"
description: "「凸性・傾き・限界費用・slope trick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 222
---

# 凸性・傾き・限界費用・slope trick

導入対象の目安: **青色（1600–1999）**。差分の単調性を入口に、凸関数の選択・合成・制約付き最適化を見渡す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

目的関数の凸・凹性と傾き変化を捉え、breakpointや限界費用から最適点を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 真偽値の単調境界探索と、交換論だけで決まる貪欲順。

## 下位単元

- [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/) — 青色
- [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/) — 青色
- [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/) — 橙色
- [slope trick](/learn/geometry-optimization/slope-trick/) — 黄色
- [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/) — 橙色
- [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/) — 橙色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC224 G 公式解説](https://atcoder.jp/contests/abc224/editorial/2816)
- [ABC224 G 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-discrete-convex`
