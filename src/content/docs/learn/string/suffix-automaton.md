---
title: "Suffix Automatonで部分文字列集合を表す"
description: "Suffix Automatonで部分文字列集合を表すの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 151
---

# Suffix Automatonで部分文字列集合を表す

## 概要

### Suffix Automaton

endpos同値類をstateとし、suffix linkとcloneで全部分文字列の遷移を線形状態数へ圧縮する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 有限状態automatonの構成。

有限状態で文字列を読む視点を土台に、endpos同値類・suffix link・cloneで全部分文字列を線形状態数に圧縮する。

- 接尾辞を辞書順に並べるSuffix Array、および複数patternの辞書照合だけを行うAho–Corasick。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC433 G 公式解説](https://atcoder.jp/contests/abc433/editorial/14604)
- [ABC433 G 公式問題文](https://atcoder.jp/contests/abc433/tasks/abc433_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-suffix-automaton`
