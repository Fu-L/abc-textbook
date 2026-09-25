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

## 標準履修順

第133単元。技能の説明を学んでから問題一覧へ進んでください。

前: [virtual tree・auxiliary tree](/learn/tree/virtual-tree/) ／ 次: [SWAG・two-stack queue aggregation](/learn/query/swag/)

## 概要

### Aho–Corasick

複数patternのTrieへfailure linkとoutput情報を加え、最長接尾辞状態を文字ごとに更新する。

### 習得する技能

- 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)、[Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)。

有限状態automatonの構成・Trieによる共有接頭辞の索引で得た考え方と実装を再利用し、Aho–Corasickの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
2. [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC419 F 公式解説](https://atcoder.jp/contests/abc419/editorial/13623)
- [ABC419 F 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC458 F 公式解説](https://atcoder.jp/contests/abc458/editorial/20159)
- [ABC458 F 公式問題文](https://atcoder.jp/contests/abc458/tasks/abc458_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-aho-corasick`
