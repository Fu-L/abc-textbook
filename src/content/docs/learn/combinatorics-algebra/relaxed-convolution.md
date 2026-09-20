---
title: "Relaxed・online convolution"
description: "「Relaxed・online convolution」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 204
---

# Relaxed・online convolution

習得対象の目安: **橙色（2400–2799）**。未確定の係数を参照しないblock分割で、オンラインの係数再帰を高速化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Relaxed・online convolution

係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。

畳み込み・相互相関で得た考え方と実装を再利用し、Relaxed・online convolutionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Relaxed・online convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC213 H「Stroll」](https://atcoder.jp/contests/abc213/tasks/abc213_h)
2. [ABC315 Ex「Typical Convolution Problem」](https://atcoder.jp/contests/abc315/tasks/abc315_h)
3. [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g)
4. [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h)

## 根拠

- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC281 H 公式解説](https://atcoder.jp/contests/abc281/editorial/5371)
- [ABC281 H 公式問題文](https://atcoder.jp/contests/abc281/tasks/abc281_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-relaxed-convolution`
