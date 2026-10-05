---
title: "静的sorted range index・Merge Sort Tree"
description: "「静的sorted range index・Merge Sort Tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 45
---

# 静的sorted range index・Merge Sort Tree

習得対象の目安: **青色（1600–1999）**。区間分解・整列列・prefix和を組み合わせ、二つの軸を持つ問い合わせを処理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 静的sorted range index・Merge Sort Tree

各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。

### 習得する技能

- 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

各Segment Tree節点にその区間の値をsortした列として持つ。query区間を節点へ分け、各列でlower_bound・upper_boundを使えば値域に入る個数などを求められる。


葉の列を一要素にし、親では左右のsorted列をmergeする。一深さの列長総和はNなので構築はO(N log N)。各列Vへ `P[0]=0,P[t+1]=P[t]+V[t]` を作る。位置区間[l,r)をcanonical nodeへ分け、各Vで値域[a,b)に対してp=lower_bound(a)、q=lower_bound(b)を求める。個数はq−p、値の和はP[q]−P[p]を全nodeで合計する。閉区間[a,b]ならqをupper_bound(b)へ変える。位置範囲と値範囲の開閉を別に扱えば重複値も正しく数えられる。

## 成立条件と計算量

Merge Sort TreeはO(N log N)構築・空間、標準的なquery O(log² N)。静的データが前提。元の位置の区間と値の区間を別々に定義し、同値の個数は上下境界の差で数える。

概念上の親: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)。

このUnitを直接前提とする単元: なし。

Segment Treeのcanonical区間分解で得た考え方と実装を再利用し、静的sorted range index・Merge Sort Treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 静的sorted range index・Merge Sort Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC339 G「Smaller Sum」](https://atcoder.jp/contests/abc339/tasks/abc339_g) — 主題: [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/)（各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC339 G 公式解説](https://atcoder.jp/contests/abc339/editorial/9207)
- [ABC339 G 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-static-sorted-range-index`
