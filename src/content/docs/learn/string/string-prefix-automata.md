---
title: "接頭辞との一致長を再利用する"
description: "「接頭辞との一致長を再利用する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 149
---

# 接頭辞との一致長を再利用する

導入対象の目安: **水色（1200–1599）**。既に調べた一致区間を再利用する考え方へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

各位置から接頭辞との一致長を求める。既に得られた一致区間の情報を再利用し、Z algorithmで全位置を線形時間に処理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 接尾辞・LCPの索引、文字列hash、回文半径。KMPのfailure linkによる逐次照合も本Unitの対象に含めない。

## 下位単元

- [Z algorithmによるprefix matching](/learn/string/z-algorithm/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h)
- [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g)

## 根拠

- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC284 F 公式解説](https://atcoder.jp/contests/abc284/editorial/5469)
- [ABC284 F 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_f)
- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-string-prefix-automata`
