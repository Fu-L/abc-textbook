---
title: "幾何・凸最適化"
description: "「幾何・凸最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 215
---

# 幾何・凸最適化

導入対象の目安: **水色（1200–1599）**。座標と向きによる判定から、凸な境界・関数の最適化へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

位置関係と凸性から、調べる候補を絞る。まず座標・向き・円環順序の判定を揃え、凸包と半平面の共通部分を扱う。直線包絡を境に、幾何的な境界から関数の最適化へ視点を移す。凸最適化のまとまりで限界費用、傾き、順序制約、罰則係数、Monge性を比較し、比率目的の判定問題への変換へ進む。DP・データ構造・flowで得た表現を組み合わせる章として読む。

### 幾何・凸最適化への変換

配置・距離・目的関数を幾何predicateや凸構造へ変換する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

orientationなどの幾何predicateから凸境界・傾き・dual penaltyへ進み、候補を構造的に削減する。

### このUnitでは扱わないもの

- なし

## 章の構成

- [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/) — 水色
  - [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/) — 青色
- [凸境界・半平面制約を扱う](/learn/geometry-optimization/convex-geometry/) — 青色（導入）
  - [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/) — 青色
  - [半平面制約・凸領域の共通部分](/learn/geometry-optimization/half-plane-constraints/) — 黄色
- [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/) — 黄色
- [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/) — 青色（導入）
  - [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/) — 青色
  - [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/) — 青色
  - [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/) — 橙色
  - [slope trick](/learn/geometry-optimization/slope-trick/) — 黄色
  - [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/) — 橙色
  - [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/) — 橙色
- [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC240 G「Teleporting Takahashi」](https://atcoder.jp/contests/abc240/tasks/abc240_g)
- [ABC243 Ex「Builder Takahashi (Enhanced version)」](https://atcoder.jp/contests/abc243/tasks/abc243_h)
- [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h)
- [ABC274 F「Fishing」](https://atcoder.jp/contests/abc274/tasks/abc274_f)
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f)
- [ABC296 G「Polygon and Points」](https://atcoder.jp/contests/abc296/tasks/abc296_g)
- [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f)
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
- [ABC377 F「Avoid Queen Attack」](https://atcoder.jp/contests/abc377/tasks/abc377_f)
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e)
- [ABC437 F「Manhattan Christmas Tree 2」](https://atcoder.jp/contests/abc437/tasks/abc437_f)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-chapter-geometry-optimization`
