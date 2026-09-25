---
title: "subset zeta・Möbius変換"
description: "「subset zeta・Möbius変換」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 192
---

# subset zeta・Möbius変換

習得対象の目安: **青色（1600–1999）**。集合の包含方向に一bitずつ和を集め、zeta変換と逆変換を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第129単元。技能の説明を学んでから問題一覧へ進んでください。

前: [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/) ／ 次: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)

## 概要

### subset zeta・Möbius変換

Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。

### 習得する技能

- Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。

集合上の包除原理・部分集合・bitmask状態DPで得た考え方と実装を再利用し、subset zeta・Möbius変換の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 下位単元

- [subset convolution](/learn/combinatorics-algebra/subset-convolution/) — 橙色

## 問題一覧

1. [ABC423 F「Loud Cicada」](https://atcoder.jp/contests/abc423/tasks/abc423_f) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。
2. [ABC349 F「Subsequence LCM」](https://atcoder.jp/contests/abc349/tasks/abc349_f) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
3. [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
4. [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)
- [ABC295 H 公式解説](https://atcoder.jp/contests/abc295/editorial/6036)
- [ABC295 H 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-subset-transforms`
