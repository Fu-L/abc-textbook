---
title: "Rolling fingerprintで列の同値性を比較する"
description: "「Rolling fingerprintで列の同値性を比較する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 53
---

# Rolling fingerprintで列の同値性を比較する

導入対象の目安: **水色（1200–1599）**。列の一致判定を連結可能な要約へ写し、衝突のある比較として扱う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

列の順序と長さを保つrolling fingerprintを作り、連結・部分列の切り出し・回文比較へ使う。集合や代数式の乱択fingerprintは乱択アルゴリズムの単元で扱う。

## 考え方

文字列を多項式評価へ写し、prefix hashとbaseの冪からsubstringの指紋をO(1)で求める。等しい列は同じ値になり、異なる列にも衝突の可能性が残る。

具体的な初期化・切り出し・連結・LCP二分探索は[列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)で導出する。そこで使う保証は、文字の単射な符号化から得る非零多項式と、ランダムな評価点の根の個数に基づく。[多重集合・指数vector・巨大整数式](/learn/modeling/randomized-algebraic-fingerprint/)には別の構成と衝突評価が必要であり、この構造単元では順序を持つ列の比較へ進む。

## 成立条件と計算量

前処理O(N)、substring hash O(1)。比較する長さを揃え、modの正規化と乗算overflowを扱う。ランダムbaseの誤り評価には体・次数・選択集合の条件が必要。厳密な一致が要るならsuffix索引などを選ぶ。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 全接尾辞の辞書順索引と回文半径。

## 下位単元

- [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)（順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F 公式解説](https://atcoder.jp/contests/abc331/editorial/7820)
- [ABC331 F 公式問題文](https://atcoder.jp/contests/abc331/tasks/abc331_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-string-hash`
