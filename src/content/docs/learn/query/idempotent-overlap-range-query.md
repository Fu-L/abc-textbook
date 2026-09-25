---
title: "冪等演算のoverlap range query・Sparse Table"
description: "「冪等演算のoverlap range query・Sparse Table」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 40
---

# 冪等演算のoverlap range query・Sparse Table

習得対象の目安: **水色（1200–1599）**。冪等性が区間の重複を許す理由を理解し、静的queryをSparse Tableで処理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 冪等演算のoverlap range query・Sparse Table

冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。

ABC282 Exでは各再帰区間の最小値とその位置をRMQで取得し、その位置を含む部分区間を数えて左右へ再帰する。Sparse Tableに(値,位置)のminを保持すれば同値の規約も固定できる。Cartesian treeで同じ最小位置の分割を表す構成は別実装として比較する。

### 習得する技能

- 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

このUnitを直接前提とする単元: なし。

区間monoid要約で得た考え方と実装を再利用し、冪等演算のoverlap range query・Sparse Tableの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 冪等演算のoverlap range query・Sparse Tableの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f) — 主題: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)（冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)（冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC282 F 公式解説](https://atcoder.jp/contests/abc282/editorial/5403)
- [ABC282 H 公式解説](https://atcoder.jp/contests/abc282/editorial/5404)
- [ABC282 H 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_h)
- [ABC282 F 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `c6f65fe967897b3b327c1c837df5c30f493b2f2f75185478863272b445d1ff85` / LearningUnit `unit-idempotent-overlap-range-query`
