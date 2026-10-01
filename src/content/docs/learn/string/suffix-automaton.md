---
title: "Suffix Automatonで部分文字列集合を表す"
description: "「Suffix Automatonで部分文字列集合を表す」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 159
---

# Suffix Automatonで部分文字列集合を表す

習得対象の目安: **橙色（2400–2799）**。endpos同値類・suffix link・cloneを理解し、全部分文字列を線形状態数で表す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Suffix Automaton

endpos同値類をstateとし、suffix linkとcloneで全部分文字列の遷移を線形状態数へ圧縮する。

### 習得する技能

- endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。

## 考え方

同じ終了位置集合を持つsubstringを一状態へまとめる。状態vが表す長さはlen(link(v))+1からlen(v)までで、suffix linkはより短い終了位置同値類へ向かう。cloneは新しい出現を足すためでなく同値類を分割するために作る。

## 成立条件と計算量

長さNで状態数はO(N)。固定文字種の遷移なら構築O(N)、連想配列なら探索費用を含める。出現数はlen降順にsuffix linkへ伝播し、cloneの初期出現数を0にする。distinct substring数は各状態の長さ幅の総和になる。

概念上の親: [文字列アルゴリズム](/learn/string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。

このUnitを直接前提とする単元: なし。

有限状態で文字列を読む視点を土台に、endpos同値類・suffix link・cloneで全部分文字列を線形状態数に圧縮する。

### このUnitでは扱わないもの

- 接尾辞を辞書順に並べるSuffix Array、および複数patternの辞書照合だけを行うAho–Corasick。

## 問題一覧

- [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g) — 主題: [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)（endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。）。既習技能: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC433 G 公式解説](https://atcoder.jp/contests/abc433/editorial/14604)
- [ABC433 G 公式問題文](https://atcoder.jp/contests/abc433/tasks/abc433_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-suffix-automaton`
