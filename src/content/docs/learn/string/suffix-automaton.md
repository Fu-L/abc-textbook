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

## 概要

### Suffix Automaton

endpos同値類をstateとし、suffix linkとcloneで全部分文字列の遷移を線形状態数へ圧縮する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。

有限状態で文字列を読む視点を土台に、endpos同値類・suffix link・cloneで全部分文字列を線形状態数に圧縮する。

### このUnitでは扱わないもの

- 接尾辞を辞書順に並べるSuffix Array、および複数patternの辞書照合だけを行うAho–Corasick。

## 問題一覧

1. [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC433 G 公式解説](https://atcoder.jp/contests/abc433/editorial/14604)
- [ABC433 G 公式問題文](https://atcoder.jp/contests/abc433/tasks/abc433_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-suffix-automaton`
