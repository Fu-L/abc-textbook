---
title: "凸境界・半平面制約を扱う"
description: "「凸境界・半平面制約を扱う」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 219
---

# 凸境界・半平面制約を扱う

導入対象の目安: **青色（1600–1999）**。凸性によって内部の候補を捨て、境界と半平面で領域を表す入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

向きと交差を判定できた後、点集合を凸包へ絞る方法と、半平面の共通部分として実行可能領域を表す方法を学ぶ。直線群の最小値・最大値queryは直線包絡の単元で扱う。

## 考え方

凸集合は二点間の線分を含むため、境界と支持直線から全体を記述できる。点集合の凸包、半平面の共通部分、円周上の交差は、それぞれ異なる入力から境界へ制約を集める方法である。

## 成立条件と計算量

最適値が境界にあるかは目的関数による。線形目的関数なら極点に最適解を選べるが、凸関数の最小値は内部にもあり得る。子単元を選ぶ際は、何を候補から除いてよいかの証明を先に確認する。

概念上の親: [幾何・凸最適化](/learn/geometry-optimization/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 直線群の最小値・最大値queryはConvex Hull Trick・直線包絡で扱う。凸性を使わない一般のevent sweepや座標圧縮も対象外とする。

## 下位単元

- [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/) — 青色
- [半平面制約・凸領域の共通部分](/learn/geometry-optimization/half-plane-constraints/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC251 G 公式解説](https://atcoder.jp/contests/abc251/editorial/3961)
- [ABC251 G 公式問題文](https://atcoder.jp/contests/abc251/tasks/abc251_g)
- [ABC257 H 公式解説](https://atcoder.jp/contests/abc257/editorial/4168)
- [ABC257 H 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-convex-geometry`
