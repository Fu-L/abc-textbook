---
title: "区間拡張DP"
description: "「区間拡張DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 69
---

# 区間拡張DP

習得対象の目安: **青色（1600–1999）**。訪問済み範囲と現在の端で履歴を圧縮し、移動が往復しても非循環なDPを作る。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 区間拡張DP

訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。

数直線上で隣の未訪問点へ進むとき、訪問済みの点は連続区間になる。dp[l][r][side]で訪問済み範囲と現在いる端を表し、l−1またはr+1へ進む。区間長が増えるので、移動方向が左右へ反転してもDPの依存は循環しない。

ABC273 Fでは壁を越えるのに必要な鍵が訪問済み区間にあるかを判定する。続くABC219 Hでは将来回収する本数kを追加し、移動距離dによる損失k·dを評価する。区間の左右を独立に解いて合成するDPとは、状態の意味も遷移方向も異なる。

### 習得する技能

- 訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

数直線上の点を隣から訪問すると、訪問済み集合は連続区間になる。左右端と現在地がどちらの端かを状態にし、外側の隣点への移動を遷移として持つ。

## 成立条件と計算量

定数の追加状態ならO(N²)状態・遷移。残り個数や時間を持つ場合はその数を掛ける。壁や鍵の条件は訪問済み区間から判定する。座標圧縮後も移動距離は元座標の差を使う。

概念上の親: [列・編集距離・区間合成DP](/learn/dynamic-programming/dp-sequence-interval/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: なし。

DPの最小十分状態で得た考え方と実装を再利用し、区間拡張DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f) — 主題: [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)（訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。）。
- [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h) — 主題: [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)（訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)
- [ABC273 F 公式解説](https://atcoder.jp/contests/abc273/editorial/5034)
- [ABC273 F 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-dp-interval-expansion`
