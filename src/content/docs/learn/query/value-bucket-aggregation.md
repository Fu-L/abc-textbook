---
title: "値軸のbucket分割と区間集約"
description: "「値軸のbucket分割と区間集約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 47
---

# 値軸のbucket分割と区間集約

習得対象の目安: **水色（1200–1599）**。平方根分割で完全blockと端数を分け、更新とqueryの費用を調整する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 値軸のbucket分割と区間集約

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。

値域の大きさをV、block幅をBとする。値prefixはO(V/B)個の完全blockとO(B)個の端数へ分かれる。和は差分、非零因子の積は旧因子の逆元と新因子でblock要約を更新できるので、点更新O(1)、取得O(V/B+B)となる。一般の結合演算でO(1)更新できるわけではない。

ABC405 Gはこの更新と取得の非対称性をMoに組み込む。各値の頻度とblock内のΣf_v、∏invFact[f_v]を持ち、値の重複数に依存する並べ替え数を計算する。頻出値をheavyへ分類する方法とは、分割対象も計算量の証明も異なる。

### 習得する技能

- 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 値軸のbucket分割と区間集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。既習技能: [値軸のbucket分割と区間集約](/learn/query/value-bucket-aggregation/)（値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)（法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。）。

## 根拠

- [ABC405 G 公式解説](https://atcoder.jp/contests/abc405/editorial/12997)
- [ABC405 G 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `7fd0d20393e1ee2f28bfe43444ff43159e5d8f980ff2ec7298a591ed3f297b32` / LearningUnit `unit-value-bucket-aggregation`
