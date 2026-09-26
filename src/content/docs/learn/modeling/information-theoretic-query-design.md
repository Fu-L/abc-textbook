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

- [ABC337 E「Bad Juice」](https://atcoder.jp/contests/abc337/tasks/abc337_e) — 主題: [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/)（応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。）。既習技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC337 E 公式問題文](https://atcoder.jp/contests/abc337/tasks/abc337_e)
- [ABC337 E 公式解説](https://atcoder.jp/contests/abc337/editorial/9140)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-information-theoretic-query-design`
