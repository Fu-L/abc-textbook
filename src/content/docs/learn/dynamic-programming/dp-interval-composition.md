---
title: "区間合成・領域分割DP"
description: "「区間合成・領域分割DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 66
---

# 区間合成・領域分割DP

習得対象の目安: **水色（1200–1599）**。小区間の独立性と長さ順の依存を確認し、分割点を遷移にする。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第77単元。技能の説明を学んでから問題一覧へ進んでください。

前: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/) ／ 次: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)

## 概要

### 区間合成・領域分割DP

区間・長方形の分割点を遷移にし、互いに独立な小領域の解を合成する。

区間[l,r)の解を、分割点mで得る独立な小区間の解から合成する。長さ昇順で処理し、空区間の単位元と、左右の選択を独立に掛けてよい条件を確かめる。消去・構文解析では、最初に対応させる端点を固定すると内側と外側へ分かれる。

ABC262 GはLISという題名でも、採用解法は位置区間と値区間を分割するDPである。末尾の支配関係だけでは状態を表せないため、この節で扱う。ABC233 G・298 Gは長方形への発展で、水平・垂直の切断と領域サイズ順の依存を比較する。

### 習得する技能

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

DPの最小十分状態で得た考え方と実装を再利用し、区間合成・領域分割DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC217 F「Make Pair」](https://atcoder.jp/contests/abc217/tasks/abc217_f) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
2. [ABC252 G「Pre-Order」](https://atcoder.jp/contests/abc252/tasks/abc252_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。
3. [ABC233 G「Strongest Takahashi」](https://atcoder.jp/contests/abc233/tasks/abc233_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
4. [ABC400 F「Happy Birthday! 3」](https://atcoder.jp/contests/abc400/tasks/abc400_f) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。
5. [ABC325 G「offence」](https://atcoder.jp/contests/abc325/tasks/abc325_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。
6. [ABC292 G「Count Strictly Increasing Sequences」](https://atcoder.jp/contests/abc292/tasks/abc292_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。
7. [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
8. [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。
9. [ABC262 G「LIS with Stack」](https://atcoder.jp/contests/abc262/tasks/abc262_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。
10. [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

## 根拠

- [ABC217 F 公式解説](https://atcoder.jp/contests/abc217/editorial/2584)
- [ABC217 F 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC228 H 公式解説](https://atcoder.jp/contests/abc228/editorial/2946)
- [ABC228 H 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC233 G 公式解説](https://atcoder.jp/contests/abc233/editorial/3184)
- [ABC233 G 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dp-interval-composition`
