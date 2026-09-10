---
title: "Lagrangian relaxation・Aliens trick"
description: "Lagrangian relaxation・Aliens trickの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 201
---

# Lagrangian relaxation・Aliens trick

## 概要

### Lagrangian relaxation・Aliens trick

個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。

最小化でg(λ)=min_k(f(k)+λk)と置くと、g(λ)-λK≤f(K)は常に下界に過ぎない。f(k+1)-f(k)が単調非減少など、Kで支持直線に接する根拠を証明して初めて等号で復元できる。整数λだけを探す場合は必要な支持傾きが探索範囲にあることも確認する。

反例f(0)=0,f(1)=10,f(2)=0では、どのλでもk=1は選ばれず、K=1の最大双対下界は0。個数の単調性や同点時の個数優先だけでは真の値10を復元できない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 一次元凸・単峰最適化。

一次元凸・単峰最適化で得た考え方と実装を再利用し、Lagrangian relaxation・Aliens trickの発動条件・正当化・境界を重複なく学ぶ。

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g)
2. [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
3. [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC355 G「Baseball」](https://atcoder.jp/contests/abc355/tasks/abc355_g)

## 根拠

- [ABC305 H 公式解説](https://atcoder.jp/contests/abc305/editorial/6534)
- [ABC305 H 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC355 G 公式解説](https://atcoder.jp/contests/abc355/editorial/10078)
- [ABC355 G 公式問題文](https://atcoder.jp/contests/abc355/tasks/abc355_g)
- [ABC393 G 公式解説](https://atcoder.jp/contests/abc393/editorial/12192)
- [ABC393 G 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-lagrangian-relaxation`
