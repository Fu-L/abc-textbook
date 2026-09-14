---
title: "Moの順序で区間問い合わせの差分を更新する"
description: "「Moの順序で区間問い合わせの差分を更新する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 97
---

# Moの順序で区間問い合わせの差分を更新する

## 概要

### Mo's algorithmによるオフライン区間問い合わせ

区間問い合わせを端点の移動量が小さい順に並べ、一要素の追加・削除で答えを更新する。

ABC242 Gでは値vの頻度f_vからΣ floor(f_v/2)を維持する。端の追加・削除では一つの頻度だけが変わるのでO(1)で差分更新できる。ABC293 Gでは同じ枠組みでΣ C(f_v,3)を保つ。まず端点操作を定義し、その後にquery順の並べ替えで総移動量を抑える。

ABC405 GではMoで現在区間を動かしながら、別の軸である値をbucketに分ける。値vの頻度が変わるたび所属bucketの頻度和と逆階乗積をO(1)で修正し、値prefix [1,X)の完全bucketと端数からk! / ∏ f_v!を求める。区間端の移動がO(N√Q)回、答えの取得がQ回なので、更新側からlog因子を外す効果が大きい。

Moはquery順の再配置、値bucketは座標軸のblock分割、heavy/lightは対象を頻度や次数で分類する技法である。平方根が現れるという共通点だけで同一視せず、何を分け、どの操作の総回数を減らしたかを説明する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

区間への要素の追加・削除を定義し、問い合わせ順を並べ替えて端点移動の総量を抑える。

### このUnitでは扱わないもの

- オンラインのpriority queue・multiset、および単調stack・queue。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC242 G「Range Pairing Query」](https://atcoder.jp/contests/abc242/tasks/abc242_g)
2. [ABC293 G「Triple Index」](https://atcoder.jp/contests/abc293/tasks/abc293_g)
3. [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g)
4. [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)
5. [ABC463 G「Random Walk Distance」](https://atcoder.jp/contests/abc463/tasks/abc463_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC242 G 公式解説](https://atcoder.jp/contests/abc242/editorial/3517)
- [ABC242 G 公式問題文](https://atcoder.jp/contests/abc242/tasks/abc242_g)
- [ABC293 G 公式解説](https://atcoder.jp/contests/abc293/editorial/5947)
- [ABC293 G 公式問題文](https://atcoder.jp/contests/abc293/tasks/abc293_g)
- [ABC384 G 公式解説](https://atcoder.jp/contests/abc384/editorial/11548)
- [ABC384 G 公式問題文](https://atcoder.jp/contests/abc384/tasks/abc384_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-mo-offline-range`
