---
title: "値軸のbucket分割と区間集約"
description: "「値軸のbucket分割と区間集約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 48
---

# 値軸のbucket分割と区間集約

難度の目安: **標準**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 値軸のbucket分割と区間集約

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。

値域の大きさをV、block幅をBとする。値prefixはO(V/B)個の完全blockとO(B)個の端数へ分かれる。和は差分、非零因子の積は旧因子の逆元と新因子でblock要約を更新できるので、点更新O(1)、取得O(V/B+B)となる。一般の結合演算でO(1)更新できるわけではない。

ABC405 Gはこの更新と取得の非対称性をMoに組み込む。各値の頻度とblock内のΣf_v、∏invFact[f_v]を持ち、値の重複数に依存する並べ替え数を計算する。頻出値をheavyへ分類する方法とは、分割対象も計算量の証明も異なる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 値軸のbucket分割と区間集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)

## 根拠

- [ABC405 G 公式解説](https://atcoder.jp/contests/abc405/editorial/12997)
- [ABC405 G 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-value-bucket-aggregation`
