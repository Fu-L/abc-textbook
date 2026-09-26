---
title: "Aho–Corasick"
description: "「Aho–Corasick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 155
---

# Aho–Corasick

習得対象の目安: **黄色（2000–2399）**。Trieのfailure linkで最長suffixを保ち、複数patternの検出情報を伝播する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Aho–Corasick

複数patternのTrieへfailure linkとoutput情報を加え、最長接尾辞状態を文字ごとに更新する。

### 習得する技能

- 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)、[Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)。

このUnitを直接前提とする単元: なし。

有限状態automatonの構成・Trieによる共有接頭辞の索引で得た考え方と実装を再利用し、Aho–Corasickの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC419 F 公式解説](https://atcoder.jp/contests/abc419/editorial/13623)
- [ABC419 F 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC458 F 公式解説](https://atcoder.jp/contests/abc458/editorial/20159)
- [ABC458 F 公式問題文](https://atcoder.jp/contests/abc458/tasks/abc458_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-aho-corasick`
