---
title: "可逆な非零剰余と剰余 0 因子を含む法上の動的積"
description: "「可逆な非零剰余と剰余 0 因子を含む法上の動的積」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 166
---

# 可逆な非零剰余と剰余 0 因子を含む法上の動的積

習得対象の目安: **水色（1200–1599）**。逆元で除ける因子を確認し、0の個数と非零因子の積を分けて更新する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 法上の動的積・剰余 0 因子の分離

取り得る因子のうち法 m で非零となるものがすべて可逆であることを確認し、因子の差し替えを「剰余 0 の因子数」と「非零因子の積」に分け、可逆な旧因子を逆元で外して新因子を掛ける。

### 習得する技能

- 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

このUnitを直接前提とする単元: なし。

通常の法上演算と逆元の存在条件を前提に、取り得る因子のうち法 m で非零となるものがすべて可逆（典型的には素数法）かを確認する。剰余 0 だけは逆元を持たないため、その個数と可逆な非零剰余因子の積へ状態を分けて因子差し替えを定数時間で処理する。

### このUnitでは扱わないもの

- 因子が変化しない一回限りの積、和やmin/maxの更新、任意区間積を求めるSegment Tree、および合成数法で非零の非可逆因子も差し替える一般の場合。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。既習技能: [値軸のbucket分割と区間集約](/learn/query/value-bucket-aggregation/)（値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)（法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。）。
- [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。追加で学ぶ技能: [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)（法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC456 G「Count Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)（法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。）。

## 根拠

- [ABC405 G 公式解説](https://atcoder.jp/contests/abc405/editorial/12997)
- [ABC405 G 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC411 E 公式問題文](https://atcoder.jp/contests/abc411/tasks/abc411_e)
- [ABC411 E 公式解説](https://atcoder.jp/contests/abc411/editorial/13361)
- [ABC456 G 公式解説](https://atcoder.jp/contests/abc456/editorial/19853)
- [ABC456 G 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-dynamic-modular-product`
