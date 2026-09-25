---
title: "Convex Hull Trick・直線包絡"
description: "「Convex Hull Trick・直線包絡」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 221
---

# Convex Hull Trick・直線包絡

習得対象の目安: **黄色（2000–2399）**。DPなどの候補を一次関数へ写し、傾き・交点順やLi Chao Treeで包絡を保つ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第147単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/) ／ 次: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)

## 概要

### Convex Hull Trick・直線包絡

一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。

### 習得する技能

- 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC289 G「Shopping in AtCoder store」](https://atcoder.jp/contests/abc289/tasks/abc289_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。
2. [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
3. [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。
4. [ABC372 G「Ax + By < C」](https://atcoder.jp/contests/abc372/tasks/abc372_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。
5. [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC228 H 公式解説](https://atcoder.jp/contests/abc228/editorial/2946)
- [ABC228 H 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC289 G 公式解説](https://atcoder.jp/contests/abc289/editorial/5700)
- [ABC289 G 公式問題文](https://atcoder.jp/contests/abc289/tasks/abc289_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-line-envelope`
