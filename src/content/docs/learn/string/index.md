---
title: "文字列アルゴリズム"
description: "「文字列アルゴリズム」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 147
---

# 文字列アルゴリズム

## 概要

文字列の一致をどの単位で共有するかを軸に読む。接頭辞の共有と一致長から、周期・回文・接尾辞の順序へ進む。次に読んだprefixを有限状態へまとめ、複数pattern、非決定性、部分文字列集合へ広げる。最後に入力自体が圧縮されている場合の再帰とrunの変化を扱う。rolling fingerprintはデータ構造章、構成したautomaton上の計数はDP章へ接続する。

### 文字列状態表現

一致・接辞・反復を十分な文字列状態へ圧縮する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

接頭辞・接尾辞・一致長などの文字列状態を共通言語にし、各種の照合・索引法へ進む土台を作る。

### このUnitでは扱わないもの

- なし

## 章の構成

- [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/) — 基礎
- [接頭辞との一致長を再利用する](/learn/string/string-prefix-automata/) — 節案内
- [Z algorithmによるprefix matching](/learn/string/z-algorithm/) — 基礎
- [文字列周期・primitive word](/learn/string/string-periodicity/) — 応用
- [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/) — 標準
- [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/) — 応用
- [禁止・要求patternを有限状態へ圧縮する](/learn/string/string-automata/) — 節案内
- [有限状態automatonの構成](/learn/string/finite-pattern-automaton/) — 標準
- [Aho–Corasick](/learn/string/aho-corasick/) — 応用
- [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/) — 発展
- [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/) — 発展
- [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/) — 応用
- [run-length状態の動的遷移](/learn/string/run-length-dynamics/) — 発展

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC268 G「Random Student ID」](https://atcoder.jp/contests/abc268/tasks/abc268_g)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g)
- [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g)
- [ABC353 E「Yet Another Sigma Problem」](https://atcoder.jp/contests/abc353/tasks/abc353_e)
- [ABC403 E「Forbidden Prefix」](https://atcoder.jp/contests/abc403/tasks/abc403_e)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-chapter-string`
