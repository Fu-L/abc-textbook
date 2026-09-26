---
title: "凸境界・半平面制約を扱う"
description: "「凸境界・半平面制約を扱う」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 218
---

# 凸境界・半平面制約を扱う

導入対象の目安: **青色（1600–1999）**。凸性によって内部の候補を捨て、境界と半平面で領域を表す入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

向きと交差を判定できた後、点集合を凸包へ絞る方法と、半平面の共通部分として実行可能領域を表す方法を学ぶ。直線群の最小値・最大値queryは直線包絡の単元で扱う。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-convex-geometry`
