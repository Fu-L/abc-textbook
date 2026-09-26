---
title: "対称性・深さ・label区間で巨大な完全二分木を数える"
description: "「対称性・深さ・label区間で巨大な完全二分木を数える」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 132
---

# 対称性・深さ・label区間で巨大な完全二分木を数える

習得対象の目安: **水色（1200–1599）**。二冪・深さ・heap番号の区間を使い、巨大な完全二分木を展開せず数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 暗黙・対称な完全二分木の深さ算術

巨大な完全二分木を展開せず、同じ深さの対称性と2冪で集約するか、heap番号の祖先移動と深さdの子孫label区間を使って数える。

### 習得する技能

- 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

指数個の頂点を持つ完全二分木を展開せず、深さごとの対称性と2冪で集約するか、heap番号の祖先移動と深さ別子孫label区間で数える。

### このUnitでは扱わないもの

- 子を明示した一般木の木DP・rerooting、およびLCA・Euler順・HLD・virtual treeを実装するpath query。完全二分木でも個々の頂点を列挙する処理。

## 問題一覧

- [ABC321 E「Complete Binary Tree」](https://atcoder.jp/contests/abc321/tasks/abc321_e) — 主題: [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/)（同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC220 E「Distance on Large Perfect Binary Tree」](https://atcoder.jp/contests/abc220/tasks/abc220_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/)（同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。）。
- [ABC424 E「Cut in Half」](https://atcoder.jp/contests/abc424/tasks/abc424_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/)（同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。）。

## 根拠

- [ABC220 E 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_e)
- [ABC220 E 公式解説](https://atcoder.jp/contests/abc220/editorial/2679)
- [ABC321 E 公式問題文](https://atcoder.jp/contests/abc321/tasks/abc321_e)
- [ABC321 E 公式解説](https://atcoder.jp/contests/abc321/editorial/7267)
- [ABC424 E 公式問題文](https://atcoder.jp/contests/abc424/tasks/abc424_e)
- [ABC424 E 公式解説](https://atcoder.jp/contests/abc424/editorial/13858)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `a83767c84a9cb372c1228a1849ba7ad25ea0b926c3443a52e846b4230fa86ee8` / LearningUnit `unit-implicit-binary-tree`
