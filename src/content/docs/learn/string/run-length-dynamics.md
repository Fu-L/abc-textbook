---
title: "run-length状態の動的遷移"
description: "「run-length状態の動的遷移」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 159
---

# run-length状態の動的遷移

習得対象の目安: **青色（1600–1999）**。runのsplit・mergeと長さを管理し、一操作と全体のrun数の変化を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### run-length状態の動的遷移

同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。

### 習得する技能

- 同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- run-length状態の動的遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC313 E「Duplicate」](https://atcoder.jp/contests/abc313/tasks/abc313_e) — 主題: [run-length状態の動的遷移](/learn/string/run-length-dynamics/)（同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC313 E 公式問題文](https://atcoder.jp/contests/abc313/tasks/abc313_e)
- [ABC313 E 公式解説](https://atcoder.jp/contests/abc313/editorial/6911)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `c6f65fe967897b3b327c1c837df5c30f493b2f2f75185478863272b445d1ff85` / LearningUnit `unit-run-length-dynamics`
