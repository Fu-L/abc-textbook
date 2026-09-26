---
title: "半平面制約・凸領域の共通部分"
description: "「半平面制約・凸領域の共通部分」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 221
---

# 半平面制約・凸領域の共通部分

習得対象の目安: **黄色（2000–2399）**。平行・非有界・空領域を区別し、向き付き直線で凸領域の共通部分を求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 半平面制約・凸領域の共通部分

向き付き直線の左側を線形不等式とし、平行制約を最強の境界へ集約して凸領域の包含・共通部分を扱う。

### 習得する技能

- 凸多角形を向き付き辺の線形半平面制約へ変換し、平行移動後も左辺が同じ制約を最強の右辺へ集約して共通部分への包含を判定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。

このUnitを直接前提とする単元: なし。

幾何の基本判定・配置・座標変換で得た考え方と実装を再利用し、半平面制約・凸領域の共通部分の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 半平面制約・凸領域の共通部分の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC251 G「Intersection of Polygons」](https://atcoder.jp/contests/abc251/tasks/abc251_g) — 主題: [半平面制約・凸領域の共通部分](/learn/geometry-optimization/half-plane-constraints/)（凸多角形を向き付き辺の線形半平面制約へ変換し、平行移動後も左辺が同じ制約を最強の右辺へ集約して共通部分への包含を判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC251 G 公式解説](https://atcoder.jp/contests/abc251/editorial/3961)
- [ABC251 G 公式問題文](https://atcoder.jp/contests/abc251/tasks/abc251_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-half-plane-constraints`
