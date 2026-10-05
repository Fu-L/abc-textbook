---
title: "fractional programming・比率parametric search"
description: "「fractional programming・比率parametric search」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 227
---

# fractional programming・比率parametric search

習得対象の目安: **青色（1600–1999）**。分母の正性を確認し、比率を加法的な判定へ変換して二分探索する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### fractional programming・比率parametric search

比率目標xに対して各寄与をbenefit-x·costへ変換し、和が非負かという単調な加法最適化へ帰着する。

分母Bが正の比率A/Bをx以上にできるかは、A−xB≥0に変換する。比率そのものは加算できなくても、変換後のスコアは要素・辺ごとに足せる。分母の符号と単調性を確認してから二分探索する。

ABC236 Eの平均値側は各要素をA_i−xに置き換え、選択制約のDPでスコア最大値を求める。中央値側はA_i≥xを+1、それ以外を−1とする個数比較であり、比率の線形化とは区別する。

ABC324 Fでは各辺の利得−x·費用をDAG上で最大化する。ABC294 Fでは砂糖量−x·総重量を各溶液に割り当て、二つのスコアの和が非負となる組数を整列と二分探索で数える。同じ変換の後に、最適化と計数という異なる判定器を接続する。

### 習得する技能

- 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。

## 考え方

比率Σa/Σbを最大化しΣb>0が保証されるなら、候補rについてΣ(a−rb)≥0となる選択の存在へ直す。比率を直接比較せず、判定問題の単調な境界を探す。

## 成立条件と計算量

判定費用T、探索幅U、絶対精度εならO(T log(U/ε))。分母0や符号が変わる選択を除外する理由を明示する。整数・有理数の厳密な答えを要する場合は浮動小数点の二分探索だけで丸めの正当性を済ませない。

概念上の親: [幾何・凸最適化](/learn/geometry-optimization/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。

このUnitを直接前提とする単元: なし。

単調境界探索で得た考え方と実装を再利用し、fractional programming・比率parametric searchの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- fractional programming・比率parametric searchの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)（比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。）。既習技能: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC294 F「Sugar Water 2」](https://atcoder.jp/contests/abc294/tasks/abc294_f) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)（比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。）。
- [ABC236 E「Average and Median」](https://atcoder.jp/contests/abc236/tasks/abc236_e) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)（比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC236 E 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_e)
- [ABC236 E 公式解説](https://atcoder.jp/contests/abc236/editorial/3279)
- [ABC294 F 公式解説](https://atcoder.jp/contests/abc294/editorial/6007)
- [ABC294 F 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_f)
- [ABC324 F 公式解説](https://atcoder.jp/contests/abc324/editorial/7405)
- [ABC324 F 公式問題文](https://atcoder.jp/contests/abc324/tasks/abc324_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-fractional-parametric-search`
