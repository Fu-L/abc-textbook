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

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f)

## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F 公式解説](https://atcoder.jp/contests/abc331/editorial/7820)
- [ABC331 F 公式問題文](https://atcoder.jp/contests/abc331/tasks/abc331_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-string-hash`
