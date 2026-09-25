---
title: "半順序・Dilworth・最大反鎖"
description: "「半順序・Dilworth・最大反鎖」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 187
---

# 半順序・Dilworth・最大反鎖

習得対象の目安: **黄色（2000–2399）**。半順序のchain・antichainを整理し、matchingやLDSとの対応を使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第170単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/) ／ 次: [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)

## 概要

### 半順序・Dilworth・最大反鎖

比較可能性をposetとして明示し、antichain・chain cover・LDS・bipartite matching/min-cutの双対関係を選んで最適化する。

### 習得する技能

- 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)、[列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。

二部matching・Hall・Kőnig・列・subsequence DPで得た考え方と実装を再利用し、半順序・Dilworth・最大反鎖の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
2. [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
3. [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC237 H 公式解説](https://atcoder.jp/contests/abc237/editorial/3321)
- [ABC237 H 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC354 G 公式解説](https://atcoder.jp/contests/abc354/editorial/10029)
- [ABC354 G 公式問題文](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC457 G 公式解説](https://atcoder.jp/contests/abc457/editorial/20073)
- [ABC457 G 公式問題文](https://atcoder.jp/contests/abc457/tasks/abc457_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-poset-dilworth-antichain`
