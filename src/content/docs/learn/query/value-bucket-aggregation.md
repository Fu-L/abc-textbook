---
title: "値軸のbucket分割と区間集約"
description: "値軸のbucket分割と区間集約の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 70
---

# 値軸のbucket分割と区間集約

## 概要

### 値軸のbucket分割と区間集約

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。

値域の大きさをV、block幅をBとする。値prefixはO(V/B)個の完全blockとO(B)個の端数へ分かれる。和は差分、非零因子の積は旧因子の逆元と新因子でblock要約を更新できるので、点更新O(1)、取得O(V/B+B)となる。一般の結合演算でO(1)更新できるわけではない。

ABC405 Gはこの更新と取得の非対称性をMoに組み込む。各値の頻度とblock内のΣf_v、∏invFact[f_v]を持ち、値の重複数に依存する並べ替え数を計算する。頻出値をheavyへ分類する方法とは、分割対象も計算量の証明も異なる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- 値軸のbucket分割と区間集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)

## 根拠

- [ABC405 G 公式解説](https://atcoder.jp/contests/abc405/editorial/12997)
- [ABC405 G 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-value-bucket-aggregation`
