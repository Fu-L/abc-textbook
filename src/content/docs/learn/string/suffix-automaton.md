---
title: "Suffix Automatonで部分文字列集合を表す"
description: "「Suffix Automatonで部分文字列集合を表す」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 158
---

# Suffix Automatonで部分文字列集合を表す

習得対象の目安: **橙色（2400–2799）**。endpos同値類・suffix link・cloneを理解し、全部分文字列を線形状態数で表す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第152単元。技能の説明を学んでから問題一覧へ進んでください。

前: [run-length状態の動的遷移](/learn/string/run-length-dynamics/) ／ 次: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)

## 概要

### Suffix Automaton

endpos同値類をstateとし、suffix linkとcloneで全部分文字列の遷移を線形状態数へ圧縮する。

### 習得する技能

- endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。

有限状態で文字列を読む視点を土台に、endpos同値類・suffix link・cloneで全部分文字列を線形状態数に圧縮する。

### このUnitでは扱わないもの

- 接尾辞を辞書順に並べるSuffix Array、および複数patternの辞書照合だけを行うAho–Corasick。

## 問題一覧

1. [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g) — 主題: [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)。既習技能: 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC433 G 公式解説](https://atcoder.jp/contests/abc433/editorial/14604)
- [ABC433 G 公式問題文](https://atcoder.jp/contests/abc433/tasks/abc433_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-suffix-automaton`
