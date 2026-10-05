---
title: "冪等演算のoverlap range query・Sparse Table"
description: "「冪等演算のoverlap range query・Sparse Table」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 42
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

## 考え方

minやgcdのようにx⊗x=xなら、同じ部分を二度含んでも答えが変わらない。Sparse Tableでは2^k長の区間を前計算し、queryを重なる二つの同長区間で覆う。


非空区間[l,r)についてk=floor(log₂(r−l))、幅w=2^kとする。`st[0][i]=a_i`、`st[k+1][i]=st[k][i]⊗st[k][i+2^k]` と前計算し、答えは `st[k][l]⊗st[k][r−w]`。左右二区間は全体を覆い、重複部分の積をbとすると、結果はa⊗b⊗b⊗c=a⊗b⊗cになる。結合則と冪等性がこの操作を正当化し、可換性を別途仮定しなくても元の順を保つ。

## 成立条件と計算量

O(N log N)構築・空間、O(1)queryに演算費用を掛ける。静的データが前提で、和には重なりを二重に数えるため使えない。空区間とlogの取り方を定める。

概念上の親: [結合的な区間要約・区間分解・合成](/learn/query/monoid-segment-tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

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

- [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)（冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。

## 根拠

- [ABC282 F 公式解説](https://atcoder.jp/contests/abc282/editorial/5403)
- [ABC282 H 公式解説](https://atcoder.jp/contests/abc282/editorial/5404)
- [ABC282 H 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_h)
- [ABC282 F 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-idempotent-overlap-range-query`
