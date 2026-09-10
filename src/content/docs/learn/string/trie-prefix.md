---
title: "Trieで共有接頭辞を索引化する"
description: "Trieで共有接頭辞を索引化するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 17
---

# Trieで共有接頭辞を索引化する

## 概要

### Trieによる共有接頭辞の索引

文字列集合の各文字遷移を木として共有し、prefix通過数・prefix DP・辞書順探索をnode上で処理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

文字ごとの遷移を配列やmapで持ち、複数文字列の共有接頭辞を木として索引化する。

- failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC287 E「Karuta」](https://atcoder.jp/contests/abc287/tasks/abc287_e)
2. [ABC437 E「Sort Arrays」](https://atcoder.jp/contests/abc437/tasks/abc437_e)
3. [ABC377 G「Edit to Match」](https://atcoder.jp/contests/abc377/tasks/abc377_g)
4. [ABC353 E「Yet Another Sigma Problem」](https://atcoder.jp/contests/abc353/tasks/abc353_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC268 G「Random Student ID」](https://atcoder.jp/contests/abc268/tasks/abc268_g)
- [ABC403 E「Forbidden Prefix」](https://atcoder.jp/contests/abc403/tasks/abc403_e)

## 根拠

- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC268 G 公式解説](https://atcoder.jp/contests/abc268/editorial/4782)
- [ABC268 G 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_g)
- [ABC287 E 公式問題文](https://atcoder.jp/contests/abc287/tasks/abc287_e)
- [ABC287 E 公式解説](https://atcoder.jp/contests/abc287/editorial/5609)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-trie-prefix`
