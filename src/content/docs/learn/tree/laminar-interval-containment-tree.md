---
title: "laminar区間族の包含木構築"
description: "「laminar区間族の包含木構築」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 140
---

# laminar区間族の包含木構築

習得対象の目安: **青色（1600–1999）**。包含条件を確認し、端点の整列とstackで直接の親を構築する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### laminar区間族の包含木構築

互いに素または包含関係にある区間を端点順に走査し、stackで直接包含する親を定めてdummy root付き包含木を作り、点を最小包含区間へ対応させる。

### 習得する技能

- laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。

## 考え方

二つの区間が互いに素か包含関係になるlaminar族では、最小の包含区間を親として木・森を作れる。左端昇順、同左端なら右端降順に処理し、stackで現在の包含連鎖を保つ。


非空半開区間を左端昇順・同左端なら右端降順へsortし、同一区間を統合する。全域を覆うdummy rootをstackへ置く。区間[l,r)を読むたび、末尾の右端≤lならpopする。残った末尾pでr≤right[p]なら親をpとしてpushし、r>right[p]なら交差がありlaminar条件に反する。現在のstackは開いている包含鎖なので、末尾が直接の親となる。

点の最小包含区間は端点eventと点queryを座標順に処理して得る。同座標では終了を内側からpop、開始を外側からpush、その後点を問い合わせる（半開区間なので終了点は含めない）。stack末尾が答え、dummyならどの実区間にも属さない。二点が同じ区間側にあるかの差分は、最小包含nodeから共通祖先までの包含木pathで表せる。閉区間なら終了eventを点query後へ移し、端点で接する区間の入力規約も合わせる。

## 成立条件と計算量

sort O(N log N)、走査O(N)。交差する区間がないことを検査し、同一区間を一つへまとめるか別頂点にするか決める。元問題の集約値を木DPへ渡す前に、端点の開閉条件を合わせる。

概念上の親: [木構造](/learn/tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

非交差区間族を括弧列として走査し、stack topを直接包含親にして包含関係を木へ変換する。その後の包含差分queryをLCAや木上距離へ接続する。

### このUnitでは扱わないもの

- laminar区間族の包含木構築の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)（laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。） / [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC405 F 公式解説](https://atcoder.jp/contests/abc405/editorial/13009)
- [ABC405 F 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-laminar-interval-containment-tree`
