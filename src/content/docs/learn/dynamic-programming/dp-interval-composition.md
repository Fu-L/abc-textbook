---
title: "区間合成・領域分割DP"
description: "「区間合成・領域分割DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 67
---

# 区間合成・領域分割DP

習得対象の目安: **水色（1200–1599）**。小区間の独立性と長さ順の依存を確認し、分割点を遷移にする。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 区間合成・領域分割DP

区間・長方形の分割点を遷移にし、互いに独立な小領域の解を合成する。

区間[l,r)の解を、分割点mで得る独立な小区間の解から合成する。長さ昇順で処理し、空区間の単位元と、左右の選択を独立に掛けてよい条件を確かめる。消去・構文解析では、最初に対応させる端点を固定すると内側と外側へ分かれる。

ABC262 GはLISという題名でも、採用解法は位置区間と値区間を分割するDPである。末尾の支配関係だけでは状態を表せないため、この節で扱う。ABC233 G・298 Gは長方形への発展で、水平・垂直の切断と領域サイズ順の依存を比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

DPの最小十分状態で得た考え方と実装を再利用し、区間合成・領域分割DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC217 F「Make Pair」](https://atcoder.jp/contests/abc217/tasks/abc217_f)
2. [ABC400 F「Happy Birthday! 3」](https://atcoder.jp/contests/abc400/tasks/abc400_f)
3. [ABC233 G「Strongest Takahashi」](https://atcoder.jp/contests/abc233/tasks/abc233_g)
4. [ABC252 G「Pre-Order」](https://atcoder.jp/contests/abc252/tasks/abc252_g)
5. [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g)
6. [ABC262 G「LIS with Stack」](https://atcoder.jp/contests/abc262/tasks/abc262_g)
7. [ABC292 G「Count Strictly Increasing Sequences」](https://atcoder.jp/contests/abc292/tasks/abc292_g)
8. [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g)
9. [ABC325 G「offence」](https://atcoder.jp/contests/abc325/tasks/abc325_g)
10. [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)

## 根拠

- [ABC217 F 公式解説](https://atcoder.jp/contests/abc217/editorial/2584)
- [ABC217 F 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC228 H 公式解説](https://atcoder.jp/contests/abc228/editorial/2946)
- [ABC228 H 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC233 G 公式解説](https://atcoder.jp/contests/abc233/editorial/3184)
- [ABC233 G 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-interval-composition`
