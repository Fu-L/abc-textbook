---
title: "Aho–Corasick"
description: "Aho–Corasickの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 130
---

# Aho–Corasick

## 概要

### Aho–Corasick

複数patternのTrieへfailure linkとoutput情報を加え、最長接尾辞状態を文字ごとに更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 有限状態automatonの構成、Trieで共有接頭辞を索引化する。

有限状態automatonの構成・Trieによる共有接頭辞の索引で得た考え方と実装を再利用し、Aho–Corasickの発動条件・正当化・境界を重複なく学ぶ。

- Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f)
2. [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC419 F 公式解説](https://atcoder.jp/contests/abc419/editorial/13623)
- [ABC419 F 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC458 F 公式解説](https://atcoder.jp/contests/abc458/editorial/20159)
- [ABC458 F 公式問題文](https://atcoder.jp/contests/abc458/tasks/abc458_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-aho-corasick`
