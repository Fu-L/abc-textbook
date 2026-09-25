---
title: "圧縮・反復・再帰文字列へ問い合わせる"
description: "「圧縮・反復・再帰文字列へ問い合わせる」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 159
---

# 圧縮・反復・再帰文字列へ問い合わせる

習得対象の目安: **青色（1600–1999）**。再帰blockの長さと位置を追い、展開せずに問い合わせや作用の合成を行う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第91単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/) ／ 次: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)

## 概要

### 再帰・圧縮・入れ子文字列の走査

明示展開できない反復・再帰文字列をblockで追跡するか、対応括弧で入れ子区間を飛び越えて作用を合成する。

### 習得する技能

- 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

明示展開できない文字列をblock長と再帰構造で表し、位置を構成要素へ降ろして照会する。

### このUnitでは扱わないもの

- 明示された文字列への接尾辞索引の構築。

## 問題一覧

1. [ABC450 E「Fibonacci String」](https://atcoder.jp/contests/abc450/tasks/abc450_e) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。
2. [ABC350 F「Transpose」](https://atcoder.jp/contests/abc350/tasks/abc350_f) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。
3. [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
4. [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC346 F 公式解説](https://atcoder.jp/contests/abc346/editorial/9644)
- [ABC346 F 公式問題文](https://atcoder.jp/contests/abc346/tasks/abc346_f)
- [ABC350 F 公式解説](https://atcoder.jp/contests/abc350/editorial/9820)
- [ABC350 F 公式問題文](https://atcoder.jp/contests/abc350/tasks/abc350_f)
- [ABC417 G 公式解説](https://atcoder.jp/contests/abc417/editorial/13580)
- [ABC417 G 公式問題文](https://atcoder.jp/contests/abc417/tasks/abc417_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-recursive-compressed-string`
