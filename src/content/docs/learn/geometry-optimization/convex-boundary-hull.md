---
title: "凸包・支持方向・境界候補"
description: "「凸包・支持方向・境界候補」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 219
---

# 凸包・支持方向・境界候補

習得対象の目安: **青色（1600–1999）**。外積で凸包を構築し、支持方向と境界上の極値を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第115単元。技能の説明を学んでから問題一覧へ進んでください。

前: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/) ／ 次: [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/)

## 概要

### 凸包・支持方向・境界候補

内部点が線形/凸目的に不要なことを示し、orientation順で凸境界を構成して支持方向ごとの極値を得る。

### 習得する技能

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。

幾何の基本判定・配置・座標変換で得た考え方と実装を再利用し、凸包・支持方向・境界候補の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC341 G「Highest Ratio」](https://atcoder.jp/contests/abc341/tasks/abc341_g) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)。
2. [ABC275 G「Infinite Knapsack」](https://atcoder.jp/contests/abc275/tasks/abc275_g) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)。
3. [ABC286 Ex「Don't Swim」](https://atcoder.jp/contests/abc286/tasks/abc286_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)。
4. [ABC356 G「Freestyle」](https://atcoder.jp/contests/abc356/tasks/abc356_g) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。
- [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)。既習技能: 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。

## 根拠

- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC257 H 公式解説](https://atcoder.jp/contests/abc257/editorial/4168)
- [ABC257 H 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC275 G 公式解説](https://atcoder.jp/contests/abc275/editorial/5111)
- [ABC275 G 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-convex-boundary-hull`
