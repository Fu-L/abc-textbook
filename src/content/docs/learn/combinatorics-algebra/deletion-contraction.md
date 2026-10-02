---
title: "削除・縮約recurrence"
description: "「削除・縮約recurrence」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 197
---

# 削除・縮約recurrence

習得対象の目安: **黄色（2000–2399）**。辺の削除と縮約が対象をどう分割するかを示し、graphの計数再帰を立てる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 削除・縮約recurrence

辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。

### 習得する技能

- 辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

辺eを選ばない対象と選ぶ対象へ分け、選ぶ側を縮約した小問題へ写す。全域木などではこの二分によって再帰式を得られ、構造を一意に数えられる。


全域木数τではloopでない辺eについて `τ(G)=τ(G−e)+τ(G/e)`。eを使わない木はG−eの木そのもの。使う木からeを縮めるとG/eの木になり、逆に縮約頂点を元の二端点へ戻してeを加えると一意に元の木へ戻る。eがbridgeなら第一項0、loopならどの木も使わずτ(G)=τ(G−e)。一頂点は空木の1、非連結graphは0で止める。

彩色多項式χ_G(q)では、G−eのproper彩色を二端点が異色・同色で分ける。同色側はG/eの彩色なので `χ_G(q)=χ_(G−e)(q)−χ_(G/e)(q)` と符号が変わる。loopがあれば0、辺なしV頂点ならq^Vが基底となる。何を選択・同一視するかで式と符号が違い、削除縮約という名前だけで全て同じ加算にしない。

## 成立条件と計算量

そのままの再帰は辺数に対して指数になり得る。memo化や小さな核を使う場合は相異なる部分問題数を数える。loopとbridgeで再帰式が変わり、縮約後のparallel edgeを必要に応じて保持する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 削除・縮約recurrenceの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC294 Ex「K-Coloring」](https://atcoder.jp/contests/abc294/tasks/abc294_h) — 主題: [subset convolution](/learn/combinatorics-algebra/subset-convolution/)（互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/)（辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC294 H 公式解説](https://atcoder.jp/contests/abc294/editorial/5999)
- [ABC294 H 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-deletion-contraction`
