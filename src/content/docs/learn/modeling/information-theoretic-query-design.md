---
title: "情報量下界・query符号設計"
description: "「情報量下界・query符号設計」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 24
---

# 情報量下界・query符号設計

習得対象の目安: **水色（1200–1599）**。応答で区別できる状態数を数え、bit符号化と復号を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 情報量下界・query符号設計

応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。

### 習得する技能

- 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。

## 考え方

候補数M、一回の返答が最大r通りなら、区別には少なくともlog_r M回の情報が必要になる。この下界を目安に、返答の組が候補を一意に識別する符号としてqueryを設計する。


返答がr≥2通りでquery数を最悪qに抑えるなら、決定木の葉は高々r^q個なのでM候補の区別にはq≥ceil(log_r M)が必要。下界に一致する構成ができる模型として「queryで任意の部分集合を選び、隠れた候補が含まれるかを返す」を考える。M候補へ長さq=ceil(log₂M)の相異なる二進codewordを割り当て、bit jが1の候補集合をquery jにする。返答列がそのままcodewordとなり、整数IDへ復号できる。実際のquery制約が任意の部分集合を許さない場合は、この構成の各集合が合法であることを別に示す。

## 成立条件と計算量

下界だけでは構成の存在は示せない。返答同士の依存、誤り、同じqueryに許される制約を確認し、衝突しない符号かを検証する。適応的なqueryでは決定木の深さ、非適応的なら符号の長さを数える。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-information-theoretic-query-design`
