---
title: "情報量下界・query符号設計"
description: "「情報量下界・query符号設計」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 27
---

# 情報量下界・query符号設計

習得対象の目安: **水色（1200–1599）**。応答で区別できる状態数を数え、bit符号化と復号を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第123単元。技能の説明を学んでから問題一覧へ進んでください。

前: [rollback・DFS入退場の状態復元](/learn/query/rollback/) ／ 次: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)

## 概要

### 情報量下界・query符号設計

応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。

### 習得する技能

- 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 情報量下界・query符号設計の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC337 E「Bad Juice」](https://atcoder.jp/contests/abc337/tasks/abc337_e) — 主題: [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC337 E 公式問題文](https://atcoder.jp/contests/abc337/tasks/abc337_e)
- [ABC337 E 公式解説](https://atcoder.jp/contests/abc337/editorial/9140)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-information-theoretic-query-design`
