---
title: "可逆な非零剰余と剰余 0 因子を含む法上の動的積"
description: "「可逆な非零剰余と剰余 0 因子を含む法上の動的積」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 167
---

# 可逆な非零剰余と剰余 0 因子を含む法上の動的積

習得対象の目安: **水色（1200–1599）**。逆元で除ける因子を確認し、0の個数と非零因子の積を分けて更新する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第43単元。技能の説明を学んでから問題一覧へ進んでください。

前: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/) ／ 次: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)

## 概要

### 法上の動的積・剰余 0 因子の分離

取り得る因子のうち法 m で非零となるものがすべて可逆であることを確認し、因子の差し替えを「剰余 0 の因子数」と「非零因子の積」に分け、可逆な旧因子を逆元で外して新因子を掛ける。

### 習得する技能

- 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

通常の法上演算と逆元の存在条件を前提に、取り得る因子のうち法 m で非零となるものがすべて可逆（典型的には素数法）かを確認する。剰余 0 だけは逆元を持たないため、その個数と可逆な非零剰余因子の積へ状態を分けて因子差し替えを定数時間で処理する。

### このUnitでは扱わないもの

- 因子が変化しない一回限りの積、和やmin/maxの更新、任意区間積を求めるSegment Tree、および合成数法で非零の非可逆因子も差し替える一般の場合。

## 問題一覧

1. [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)。既習技能: 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。
- [ABC456 G「Count Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。

## 根拠

- [ABC405 G 公式解説](https://atcoder.jp/contests/abc405/editorial/12997)
- [ABC405 G 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC411 E 公式問題文](https://atcoder.jp/contests/abc411/tasks/abc411_e)
- [ABC411 E 公式解説](https://atcoder.jp/contests/abc411/editorial/13361)
- [ABC456 G 公式解説](https://atcoder.jp/contests/abc456/editorial/19853)
- [ABC456 G 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dynamic-modular-product`
