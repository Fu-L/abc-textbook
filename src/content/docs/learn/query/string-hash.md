---
title: "Rolling fingerprintで列の同値性を比較する"
description: "「Rolling fingerprintで列の同値性を比較する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 56
---

# Rolling fingerprintで列の同値性を比較する

導入対象の目安: **水色（1200–1599）**。列の一致判定を連結可能な要約へ写し、衝突のある比較として扱う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

列の順序と長さを保つrolling fingerprintを作り、連結・部分列の切り出し・回文比較へ使う。集合や代数式の乱択fingerprintは乱択アルゴリズムの単元で扱う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 全接尾辞の辞書順索引と回文半径。

## 下位単元

- [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h) — 主題: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)。
- [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F 公式解説](https://atcoder.jp/contests/abc331/editorial/7820)
- [ABC331 F 公式問題文](https://atcoder.jp/contests/abc331/tasks/abc331_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-string-hash`
