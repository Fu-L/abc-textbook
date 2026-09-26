---
title: "回文半径と左右対称区間を特定する"
description: "「回文半径と左右対称区間を特定する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 152
---

# 回文半径と左右対称区間を特定する

習得対象の目安: **青色（1600–1999）**。中心の左右対称性と既知区間を再利用し、奇数長・偶数長の回文半径を求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 回文半径・Manacher

各中心の最大回文半径を左右対称性と既知区間の再利用で線形に求める。

### 習得する技能

- 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

各中心の左右一致を半径としてまとめ、回文区間の判定と列挙へ利用する。

### このUnitでは扱わないもの

- 一般の部分文字列hash比較と、接尾辞・LCPの索引。

## 問題一覧

- [ABC398 F「ABCBA」](https://atcoder.jp/contests/abc398/tasks/abc398_f) — 主題: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)（各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。）。
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g) — 主題: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)（各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC349 G 公式解説](https://atcoder.jp/contests/abc349/editorial/9782)
- [ABC349 G 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC398 F 公式解説](https://atcoder.jp/contests/abc398/editorial/12501)
- [ABC398 F 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-palindrome-radius`
