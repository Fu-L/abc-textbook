---
title: "有限関数・作用の合成"
description: "「有限関数・作用の合成」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 41
---

# 有限関数・作用の合成

習得対象の目安: **水色（1200–1599）**。小さな遷移表を関数として合成し、適用順の逆転を避ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有限関数・作用の合成

小さな有限集合上の関数を遷移表として表し、適用順を保ってprefix・区間の作用を合成する。

### 習得する技能

- 小さな有限集合上の関数を遷移表として表し、適用順を保ってprefix・区間の作用を合成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

有限集合上の写像は、各入力の行き先を配列で保存できる。fとgの合成は入力xをgに通してからfへ送ることで作れ、結合的な区間要約になる。


列を左からf_1,f_2,…の順に適用するなら、要約Fと後続要約Gの結合を `combine(F,G)[x]=G[F[x]]` と定義する。空列の表はid[x]=x。三列の結合はどちらの括り方でもH[G[F[x]]]なので結合的である。prefix表も区間表もこのcombineで作り、初期状態sの最終状態は表[s]を読む。有限写像は多対一にもなり得るので、一般にはprefix表の逆を使って区間表を取り出せない。

## 成立条件と計算量

集合サイズσなら一合成O(σ)、Segment Tree操作O(σ log N)、空間O(Nσ)。恒等写像を単位元とする。合成は一般に非可換なので、文字列や操作列を読む順と配列添字の意味を合わせる。

概念上の親: [結合的な区間要約・区間分解・合成](/learn/query/monoid-segment-tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

小さな有限集合上の関数を遷移表として表し、適用順を保ってprefix・区間の作用を合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 有限関数・作用の合成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC261 E「Many Operations」](https://atcoder.jp/contests/abc261/tasks/abc261_e) — 主題: [有限関数・作用の合成](/learn/query/finite-function-composition/)（小さな有限集合上の関数を遷移表として表し、適用順を保ってprefix・区間の作用を合成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC261 E 公式問題文](https://atcoder.jp/contests/abc261/tasks/abc261_e)
- [ABC261 E 公式解説](https://atcoder.jp/contests/abc261/editorial/4451)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-finite-function-composition`
