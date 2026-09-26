---
title: "資源DPを引数で渡すHLRecDP"
description: "「資源DPを引数で渡すHLRecDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 146
---

# 資源DPを引数で渡すHLRecDP

習得対象の目安: **赤色（2800以上）**。資源DPを再帰の引数にし、軽い子への重複呼出しまで含めて計算量を証明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 資源DPを引数で渡すHLRecDP

外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。

dfs(v,dp)の引数は外部で既に選んだ候補の資源別最適値であり、返値は部分木vの選択肢も反映した値と定義する。独立な二配列のmax-plus mergeを、選択・非選択のO(X)更新へ展開する。重い子を一回だけ通す評価順を先に導く。

軽い子が半分以下というだけでO(NX log N)にはならない。各軽い子を二回呼ぶABC311 Exでは、サイズnの再帰量に重い子の一回分と軽い子の二回分が加わり、均等二分時は3T(n/2)となる。全heavy path根からの処理も含めO(N^(log₂3)X)を評価する。畳み込みを使う木DPとは別の証明である。

### 習得する技能

- 外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)、[根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

このUnitを直接前提とする単元: なし。

資源軸knapsack DP・根付き木DP・部分木集約で得た考え方と実装を再利用し、資源DPを引数で渡すHLRecDPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 資源DPを引数で渡すHLRecDPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h) — 主題: [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)（外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC311 H 公式解説](https://atcoder.jp/contests/abc311/editorial/6814)
- [ABC311 H 公式問題文](https://atcoder.jp/contests/abc311/tasks/abc311_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `a83767c84a9cb372c1228a1849ba7ad25ea0b926c3443a52e846b4230fa86ee8` / LearningUnit `unit-heavy-light-recursive-dp`
