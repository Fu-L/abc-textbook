---
title: "run-length状態の動的遷移"
description: "「run-length状態の動的遷移」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 160
---

# run-length状態の動的遷移

習得対象の目安: **青色（1600–1999）**。runのsplit・mergeと長さを管理し、一操作と全体のrun数の変化を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第151単元。技能の説明を学んでから問題一覧へ進んでください。

前: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/) ／ 次: [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)

## 概要

### run-length状態の動的遷移

同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。

### 習得する技能

- 同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- run-length状態の動的遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC313 E「Duplicate」](https://atcoder.jp/contests/abc313/tasks/abc313_e) — 主題: [run-length状態の動的遷移](/learn/string/run-length-dynamics/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC313 E 公式問題文](https://atcoder.jp/contests/abc313/tasks/abc313_e)
- [ABC313 E 公式解説](https://atcoder.jp/contests/abc313/editorial/6911)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-run-length-dynamics`
