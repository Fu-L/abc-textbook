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

## 標準履修順

第154単元。技能の説明を学んでから問題一覧へ進んでください。

前: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/) ／ 次: [slope trick](/learn/geometry-optimization/slope-trick/)

## 概要

### 群作用・軌道数え上げ

群作用の固定点を作用素のcycle typeごとに数え、BurnsideまたはPólyaで軌道数を得る。

### 習得する技能

- 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [同値な状態を正規化する](/learn/modeling/normalization/)。

状態・配置の正規化で得た考え方と実装を再利用し、群作用・軌道数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 群作用・軌道数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC428 G「Necklace」](https://atcoder.jp/contests/abc428/tasks/abc428_g) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 / 資源軸の上限と更新順を選び、選択の重複を避けられる。
2. [ABC284 Ex「Count Unlabeled Graphs」](https://atcoder.jp/contests/abc284/tasks/abc284_h) — 主題: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC284 H 公式解説](https://atcoder.jp/contests/abc284/editorial/5481)
- [ABC284 H 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_h)
- [ABC428 G 公式解説](https://atcoder.jp/contests/abc428/editorial/14241)
- [ABC428 G 公式問題文](https://atcoder.jp/contests/abc428/tasks/abc428_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-orbit-counting`
