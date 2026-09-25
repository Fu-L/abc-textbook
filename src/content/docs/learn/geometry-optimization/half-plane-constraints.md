---
title: "半平面制約・凸領域の共通部分"
description: "「半平面制約・凸領域の共通部分」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 220
---

# 半平面制約・凸領域の共通部分

習得対象の目安: **黄色（2000–2399）**。平行・非有界・空領域を区別し、向き付き直線で凸領域の共通部分を求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第136単元。技能の説明を学んでから問題一覧へ進んでください。

前: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/) ／ 次: [Baby-Step Giant-Step・可逆作用の反復到達探索](/learn/number-theory/baby-step-giant-step/)

## 概要

### 半平面制約・凸領域の共通部分

向き付き直線の左側を線形不等式とし、平行制約を最強の境界へ集約して凸領域の包含・共通部分を扱う。

### 習得する技能

- 凸多角形を向き付き辺の線形半平面制約へ変換し、平行移動後も左辺が同じ制約を最強の右辺へ集約して共通部分への包含を判定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。

幾何の基本判定・配置・座標変換で得た考え方と実装を再利用し、半平面制約・凸領域の共通部分の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 半平面制約・凸領域の共通部分の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC251 G「Intersection of Polygons」](https://atcoder.jp/contests/abc251/tasks/abc251_g) — 主題: [半平面制約・凸領域の共通部分](/learn/geometry-optimization/half-plane-constraints/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC251 G 公式解説](https://atcoder.jp/contests/abc251/editorial/3961)
- [ABC251 G 公式問題文](https://atcoder.jp/contests/abc251/tasks/abc251_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-half-plane-constraints`
