---
title: "動的・implicit Segment Tree"
description: "「動的・implicit Segment Tree」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 46
---

# 動的・implicit Segment Tree

習得対象の目安: **青色（1600–1999）**。通常のSegment Treeを疎なnode生成へ拡張し、座標域とnode数を別々に評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 動的・implicit Segment Tree

巨大または疎な座標域で訪れたnodeだけを生成し、区間要約と境界探索をO(log U)で保つ。

### 習得する技能

- 巨大または疎な座標域で訪れたnodeだけを生成し、区間要約と境界探索をO(log U)で保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

巨大な座標域でも更新が疎なら、触れた経路上の節点だけ作る。未作成の区間は初期値の要約として扱い、座標の二分を必要な場所へ限定する。


座標域を半開区間[0,U)とし、nodeが持つ[l,r)をm=floor((l+r)/2)で分ける。点pの更新ではp<mなら左、それ以外なら右だけを必要時に生成し、葉r−l=1で値を変更、帰りに左右要約を結合する。存在しない子は担当区間の初期要約init(l,r)を返す。queryでは不交差なら単位元、完全被覆なら保存要約、部分被覆なら左右を元の順に結合する。境界探索も各子の要約で進む側を選び、未作成区間をinitで評価する。初期配列が全0の和ならinit=0だが、全1ならinit=r−lなので単位元とは異なる。境界探索にはprefixの成立・不成立が単調な判定関数を用いる。

## 成立条件と計算量

値域幅U・点更新QならO(Q log U)節点、操作O(log U)。読み取りで節点を無条件に作らない。未作成区間の値と単位元は異なる場合があり、lazy作用や区間長も正しく計算する。

概念上の親: [結合的な区間要約・区間分解・合成](/learn/query/monoid-segment-tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

このUnitを直接前提とする単元: なし。

区間monoid要約で得た考え方と実装を再利用し、動的・implicit Segment Treeの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 動的・implicit Segment Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC403 G「Odd Position Sum Query」](https://atcoder.jp/contests/abc403/tasks/abc403_g) — 主題: [動的・implicit Segment Tree](/learn/query/dynamic-segment-tree/)（巨大または疎な座標域で訪れたnodeだけを生成し、区間要約と境界探索をO(log U)で保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC403 G 公式解説](https://atcoder.jp/contests/abc403/editorial/12770)
- [ABC403 G 公式問題文](https://atcoder.jp/contests/abc403/tasks/abc403_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-dynamic-segment-tree`
