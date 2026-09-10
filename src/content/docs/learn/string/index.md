---
title: "文字列アルゴリズム"
description: "文字列アルゴリズムの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 5
---

# 文字列アルゴリズム

## 概要

### 文字列状態表現

一致・接辞・反復を十分な文字列状態へ圧縮する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

接頭辞・接尾辞・一致長などの文字列状態を共通言語にし、各種の照合・索引法へ進む土台を作る。

- なし

## 下位単元

- [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)
- [接頭辞の一致状態とオートマトン](/learn/string/string-prefix-automata/)
- [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)
- [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)
- [禁止・要求patternを有限状態へ圧縮する](/learn/string/string-automata/)
- [run-length状態の動的遷移](/learn/string/run-length-dynamics/)
- [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)
- [文字列周期・primitive word](/learn/string/string-periodicity/)
- [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC268 G「Random Student ID」](https://atcoder.jp/contests/abc268/tasks/abc268_g)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g)
- [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g)
- [ABC403 E「Forbidden Prefix」](https://atcoder.jp/contests/abc403/tasks/abc403_e)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)
- [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f)

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-chapter-string`
