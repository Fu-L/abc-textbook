---
title: "Moの順序で区間問い合わせの差分を更新する"
description: "「Moの順序で区間問い合わせの差分を更新する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 49
---

# Moの順序で区間問い合わせの差分を更新する

習得対象の目安: **青色（1600–1999）**。追加・削除可能な集計を作り、query順の変更で端点移動量を抑える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第98単元。技能の説明を学んでから問題一覧へ進んでください。

前: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/) ／ 次: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)

## 概要

### Mo's algorithmによるオフライン区間問い合わせ

区間問い合わせを端点の移動量が小さい順に並べ、一要素の追加・削除で答えを更新する。

ABC242 Gでは値vの頻度f_vからΣ floor(f_v/2)を維持する。端の追加・削除では一つの頻度だけが変わるのでO(1)で差分更新できる。ABC293 Gでは同じ枠組みでΣ C(f_v,3)を保つ。まず端点操作を定義し、その後にquery順の並べ替えで総移動量を抑える。

ABC405 GではMoで現在区間を動かしながら、別の軸である値をbucketに分ける。値vの頻度が変わるたび所属bucketの頻度和と逆階乗積をO(1)で修正し、値prefix [1,X)の完全bucketと端数からk! / ∏ f_v!を求める。区間端の移動がO(N√Q)回、答えの取得がQ回なので、更新側からlog因子を外す効果が大きい。

Moはquery順の再配置、値bucketは座標軸のblock分割、heavy/lightは対象を頻度や次数で分類する技法である。平方根が現れるという共通点だけで同一視せず、何を分け、どの操作の総回数を減らしたかを説明する。

### 習得する技能

- 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

区間への要素の追加・削除を定義し、問い合わせ順を並べ替えて端点移動の総量を抑える。

### このUnitでは扱わないもの

- オンラインのpriority queue・multiset、および単調stack・queue。

## 問題一覧

1. [ABC293 G「Triple Index」](https://atcoder.jp/contests/abc293/tasks/abc293_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)。
2. [ABC242 G「Range Pairing Query」](https://atcoder.jp/contests/abc242/tasks/abc242_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)。
3. [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
4. [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)。既習技能: 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。
5. [ABC463 G「Random Walk Distance」](https://atcoder.jp/contests/abc463/tasks/abc463_g) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。既習技能: 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC242 G 公式解説](https://atcoder.jp/contests/abc242/editorial/3517)
- [ABC242 G 公式問題文](https://atcoder.jp/contests/abc242/tasks/abc242_g)
- [ABC293 G 公式解説](https://atcoder.jp/contests/abc293/editorial/5947)
- [ABC293 G 公式問題文](https://atcoder.jp/contests/abc293/tasks/abc293_g)
- [ABC384 G 公式解説](https://atcoder.jp/contests/abc384/editorial/11548)
- [ABC384 G 公式問題文](https://atcoder.jp/contests/abc384/tasks/abc384_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-mo-offline-range`
