---
title: "Lagrangian relaxation・Aliens trick"
description: "「Lagrangian relaxation・Aliens trick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 227
---

# Lagrangian relaxation・Aliens trick

習得対象の目安: **橙色（2400–2799）**。罰則係数による個数単調性に加え、双対ギャップなく復元できる条件を証明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第169単元。技能の説明を学んでから問題一覧へ進んでください。

前: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/) ／ 次: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)

## 概要

### Lagrangian relaxation・Aliens trick

個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。

最小化でg(λ)=min_k(f(k)+λk)と置くと、g(λ)-λK≤f(K)は常に下界に過ぎない。f(k+1)-f(k)が単調非減少など、Kで支持直線に接する根拠を証明して初めて等号で復元できる。整数λだけを探す場合は必要な支持傾きが探索範囲にあることも確認する。

反例f(0)=0,f(1)=10,f(2)=0では、どのλでもk=1は選ばれず、K=1の最大双対下界は0。個数の単調性や同点時の個数優先だけでは真の値10を復元できない。

### 習得する技能

- 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

一次元凸・単峰最適化で得た考え方と実装を再利用し、Lagrangian relaxation・Aliens trickの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
2. [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
3. [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。 / 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。 / 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC355 G「Baseball」](https://atcoder.jp/contests/abc355/tasks/abc355_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。

## 根拠

- [ABC305 H 公式解説](https://atcoder.jp/contests/abc305/editorial/6534)
- [ABC305 H 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC355 G 公式解説](https://atcoder.jp/contests/abc355/editorial/10078)
- [ABC355 G 公式問題文](https://atcoder.jp/contests/abc355/tasks/abc355_g)
- [ABC393 G 公式解説](https://atcoder.jp/contests/abc393/editorial/12192)
- [ABC393 G 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-lagrangian-relaxation`
