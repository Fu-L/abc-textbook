---
title: "値軸のbucket分割と区間集約"
description: "「値軸のbucket分割と区間集約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 48
---

# 値軸のbucket分割と区間集約

習得対象の目安: **水色（1200–1599）**。平方根分割で完全blockと端数を分け、更新とqueryの費用を調整する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第73単元。技能の説明を学んでから問題一覧へ進んでください。

前: [rerooting・全方位木DP](/learn/tree/rerooting/) ／ 次: [最短路モデル](/learn/graph/weighted-shortest-path/)

## 概要

### 値軸のbucket分割と区間集約

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。

値域の大きさをV、block幅をBとする。値prefixはO(V/B)個の完全blockとO(B)個の端数へ分かれる。和は差分、非零因子の積は旧因子の逆元と新因子でblock要約を更新できるので、点更新O(1)、取得O(V/B+B)となる。一般の結合演算でO(1)更新できるわけではない。

ABC405 Gはこの更新と取得の非対称性をMoに組み込む。各値の頻度とblock内のΣf_v、∏invFact[f_v]を持ち、値の重複数に依存する並べ替え数を計算する。頻出値をheavyへ分類する方法とは、分割対象も計算量の証明も異なる。

### 習得する技能

- 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 値軸のbucket分割と区間集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)。既習技能: 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。

## 根拠

- [ABC405 G 公式解説](https://atcoder.jp/contests/abc405/editorial/12997)
- [ABC405 G 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-value-bucket-aggregation`
