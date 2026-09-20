---
title: "Aho–Corasick"
description: "「Aho–Corasick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 156
---

# Aho–Corasick

習得対象の目安: **黄色（2000–2399）**。Trieのfailure linkで最長suffixを保ち、複数patternの検出情報を伝播する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Aho–Corasick

複数patternのTrieへfailure linkとoutput情報を加え、最長接尾辞状態を文字ごとに更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)、[Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)。

有限状態automatonの構成・Trieによる共有接頭辞の索引で得た考え方と実装を再利用し、Aho–Corasickの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f)
2. [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC419 F 公式解説](https://atcoder.jp/contests/abc419/editorial/13623)
- [ABC419 F 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC458 F 公式解説](https://atcoder.jp/contests/abc458/editorial/20159)
- [ABC458 F 公式問題文](https://atcoder.jp/contests/abc458/tasks/abc458_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-aho-corasick`
