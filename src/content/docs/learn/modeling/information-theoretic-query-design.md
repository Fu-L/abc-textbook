---
title: "情報量下界・query符号設計"
description: "「情報量下界・query符号設計」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 26
---

# 情報量下界・query符号設計

習得対象の目安: **水色（1200–1599）**。応答で区別できる状態数を数え、bit符号化と復号を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 情報量下界・query符号設計

応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。

### 習得する技能

- 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 情報量下界・query符号設計の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC337 E「Bad Juice」](https://atcoder.jp/contests/abc337/tasks/abc337_e) — 主題: [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/)（応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。）。既習技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC337 E 公式問題文](https://atcoder.jp/contests/abc337/tasks/abc337_e)
- [ABC337 E 公式解説](https://atcoder.jp/contests/abc337/editorial/9140)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `7fd0d20393e1ee2f28bfe43444ff43159e5d8f980ff2ec7298a591ed3f297b32` / LearningUnit `unit-information-theoretic-query-design`
