---
title: "isotonic regression・PAV"
description: "「isotonic regression・PAV」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 228
---

# isotonic regression・PAV

習得対象の目安: **橙色（2400–2799）**。順序制約に違反するblockの併合が正しい理由を示し、PAVで最適化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### isotonic regression・PAV

単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。

### 習得する技能

- 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

x_1≤…≤x_Nという順序制約下で分離可能な凸損失を最小化する。隣接blockの最適値が逆転したら併合するPAV法は、違反を一つの共有値へ集めて順序制約を回復する。

## 成立条件と計算量

二乗損失ならblockの重み付き平均をO(1)で更新し、各blockが一度push・popされるためO(N)。絶対値損失では中央値管理が必要で費用は構造に依存する。異なる損失でも平均を使えるとは限らない。

概念上の親: [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

このUnitを直接前提とする単元: なし。

一次元凸・単峰最適化で得た考え方と実装を再利用し、isotonic regression・PAVの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC459 F「-1, +1」](https://atcoder.jp/contests/abc459/tasks/abc459_f) — 主題: [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)（単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC459 F 公式解説](https://atcoder.jp/contests/abc459/editorial/20507)
- [ABC459 F 公式問題文](https://atcoder.jp/contests/abc459/tasks/abc459_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-isotonic-regression`
