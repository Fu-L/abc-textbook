---
title: "永続data structure・structural sharing"
description: "「永続data structure・structural sharing」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 57
---

# 永続data structure・structural sharing

習得対象の目安: **黄色（2000–2399）**。更新pathだけの複製と共有部分の不変性を理解し、複数versionを管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 永続data structure・structural sharing

変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。

### 習得する技能

- 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

更新経路の節点だけコピーし、変更しない子を旧版と共有する。各版のrootを保存すれば、任意の過去の版を読みながら新しい版を分岐できる。


点更新update(old,l,r,p,x)はoldのnodeを一個コピーしたnewを作る。葉ならxへ変更してnewを返す。内部ならpを含む子にだけupdateを呼び、その返り値をnewの子へ付け、もう一方はoldの子を共有する。newの要約を二子から再計算して返す。旧rootには一切書き込まないため、共有する未変更区間も含め旧版の全queryは不変である。各更新の返り値をrootsへ追加し、任意版のqueryは通常のSegment Treeと同じ再帰で行う。

## 成立条件と計算量

persistent Segment Treeは点更新・query O(log N)、Q更新でO(N+Q log N)節点。共有節点を変更しない。二版の差でqueryできるのは和・個数など差が意味を持つ要約で、一般monoidへ無条件には拡張できない。

概念上の親: [構造を共有して過去の版を保存・復元する](/learn/query/persistence-rollback/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC273 E「Notebook」](https://atcoder.jp/contests/abc273/tasks/abc273_e) — 主題: [永続data structure・structural sharing](/learn/query/persistence/)（変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC453 G「Copy Query」](https://atcoder.jp/contests/abc453/tasks/abc453_g) — 主題: [永続data structure・structural sharing](/learn/query/persistence/)（変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC273 E 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_e)
- [ABC273 E 公式解説](https://atcoder.jp/contests/abc273/editorial/5023)
- [ABC453 G 公式解説](https://atcoder.jp/contests/abc453/editorial/18526)
- [ABC453 G 公式問題文](https://atcoder.jp/contests/abc453/tasks/abc453_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-persistence`
