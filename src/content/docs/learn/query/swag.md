---
title: "SWAG・two-stack queue aggregation"
description: "「SWAG・two-stack queue aggregation」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 43
---

# SWAG・two-stack queue aggregation

習得対象の目安: **青色（1600–1999）**。非可換な結合順を二つのstackで保ち、窓の集約を償却定数時間にする。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### SWAG・two-stack queue aggregation

queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。

### 習得する技能

- queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

queueを二つのstackへ分け、各stackにそこまでのmonoid積を保存する。取り出す側が空のときだけ逆順に移し、queue全体の積を両stackの積から作る。


### 非可換でも順序を保つ二つの積

入力側stackのtopまでの集約は、古い要素から新しい要素へ読む積inAggとする。末尾にxをpushすると `inAgg_new=inAgg_old⊗x`。出力側stackはtopがqueueの先頭で、topから底へ読む積outAggを持つ。そこへxをpushすると `outAgg_new=x⊗outAgg_old` である。各stackの各要素に、その時点の集約を添えておけばpopはtopを外すだけで前の集約へ戻る。

queueのpop時に出力側が空なら、入力側をtopから一つずつpopして出力側へpushする。順序が反転し、最古の要素が出力側topへ来る。全体のfoldは `outAgg⊗inAgg`、空stackの集約は単位元e。各要素は入力側へ一度、出力側へ高々一度移り、最終的に一度取り除かれるので、Q回の操作でO(Q)回の合成となる。空queueのpopは行わない。

## 成立条件と計算量

各要素は一度ずつ移るのでpush・pop・全体queryは償却O(1)に演算費用を掛ける。逆元は不要。非可換演算では左右stackで積の向きを変える。任意位置の削除には対応しない。

概念上の親: [結合的な区間要約・区間分解・合成](/learn/query/monoid-segment-tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

このUnitを直接前提とする単元: なし。

区間monoid要約で得た考え方と実装を再利用し、SWAG・two-stack queue aggregationの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- SWAG・two-stack queue aggregationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC456 F「Plan Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_f) — 主題: [SWAG・two-stack queue aggregation](/learn/query/swag/)（queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)（遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC456 F 公式解説](https://atcoder.jp/contests/abc456/editorial/19850)
- [ABC456 F 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-swag`
