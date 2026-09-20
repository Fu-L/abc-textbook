---
title: "群作用・軌道数え上げ"
description: "「群作用・軌道数え上げ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 186
---

# 群作用・軌道数え上げ

習得対象の目安: **黄色（2000–2399）**。群作用と固定点を定義し、Burnside・Pólyaによる対称性込みの計数を行う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 群作用・軌道数え上げ

群作用の固定点を作用素のcycle typeごとに数え、BurnsideまたはPólyaで軌道数を得る。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [同値な状態を正規化する](/learn/modeling/normalization/)。

状態・配置の正規化で得た考え方と実装を再利用し、群作用・軌道数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 群作用・軌道数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g)
2. [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC284 H 公式解説](https://atcoder.jp/contests/abc284/editorial/5481)
- [ABC284 H 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_h)
- [ABC428 G 公式解説](https://atcoder.jp/contests/abc428/editorial/14241)
- [ABC428 G 公式問題文](https://atcoder.jp/contests/abc428/tasks/abc428_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-orbit-counting`
