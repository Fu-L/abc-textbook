---
title: "円環順序・chord交差"
description: "円環順序・chord交差の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 170
---

# 円環順序・chord交差

## 概要

### 円環順序・chord交差

円周上の端点順をcutで線形化し、二chordの端点交互配置またはlaminar括弧構造として交差を判定・数え上げる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 幾何の基本判定と座標変換。

幾何の基本判定・配置・座標変換で得た考え方と実装を再利用し、円環順序・chord交差の発動条件・正当化・境界を重複なく学ぶ。

- 円環順序・chord交差の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC338 E「Chords」](https://atcoder.jp/contests/abc338/tasks/abc338_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f)
- [ABC424 F「Adding Chords」](https://atcoder.jp/contests/abc424/tasks/abc424_f)

## 根拠

- [ABC263 H 公式解説](https://atcoder.jp/contests/abc263/editorial/4547)
- [ABC263 H 公式問題文](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC338 E 公式問題文](https://atcoder.jp/contests/abc338/tasks/abc338_e)
- [ABC338 E 公式解説](https://atcoder.jp/contests/abc338/editorial/9172)
- [ABC405 F 公式解説](https://atcoder.jp/contests/abc405/editorial/13009)
- [ABC405 F 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-cyclic-order-crossing`
