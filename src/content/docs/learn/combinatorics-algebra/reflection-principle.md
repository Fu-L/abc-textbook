---
title: "鏡像法・reflection principle"
description: "「鏡像法・reflection principle」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 184
---

# 鏡像法・reflection principle

習得対象の目安: **青色（1600–1999）**。最初に境界を破るpathとの全単射を作り、壁付きの計数を差で表す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 鏡像法・reflection principle

境界を初めて破るpathを鏡像pathへ写す符号付き全単射により、壁付きwalkを無境界または巡回畳み込みへ変換する。

### 習得する技能

- 最初に境界を破るpathとの鏡像対応を構成し、壁付きwalkの数え上げを符号付きの無境界問題へ変換できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。

このUnitを直接前提とする単元: なし。

組合せ係数・数え上げで得た考え方と実装を再利用し、鏡像法・reflection principleの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 鏡像法・reflection principleの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC309 Ex「Simple Path Counting Problem」](https://atcoder.jp/contests/abc309/tasks/abc309_h) — 主題: [鏡像法・reflection principle](/learn/combinatorics-algebra/reflection-principle/)（最初に境界を破るpathとの鏡像対応を構成し、壁付きwalkの数え上げを符号付きの無境界問題へ変換できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC309 H 公式解説](https://atcoder.jp/contests/abc309/editorial/6751)
- [ABC309 H 公式問題文](https://atcoder.jp/contests/abc309/tasks/abc309_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-reflection-principle`
