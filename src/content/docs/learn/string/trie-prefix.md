---
title: "Trieで共有接頭辞を索引化する"
description: "「Trieで共有接頭辞を索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 148
---

# Trieで共有接頭辞を索引化する

習得対象の目安: **水色（1200–1599）**。共有prefixを木にし、通過数・辞書順・文字遷移をnode上で管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Trieによる共有接頭辞の索引

文字列集合の各文字遷移を木として共有し、prefix通過数・prefix DP・辞書順探索をnode上で処理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

文字ごとの遷移を配列やmapで持ち、複数文字列の共有接頭辞を木として索引化する。

### このUnitでは扱わないもの

- failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC287 E「Karuta」](https://atcoder.jp/contests/abc287/tasks/abc287_e)
2. [ABC437 E「Sort Arrays」](https://atcoder.jp/contests/abc437/tasks/abc437_e)
3. [ABC377 G「Edit to Match」](https://atcoder.jp/contests/abc377/tasks/abc377_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC268 G「Random Student ID」](https://atcoder.jp/contests/abc268/tasks/abc268_g)
- [ABC353 E「Yet Another Sigma Problem」](https://atcoder.jp/contests/abc353/tasks/abc353_e)
- [ABC403 E「Forbidden Prefix」](https://atcoder.jp/contests/abc403/tasks/abc403_e)

## 根拠

- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC268 G 公式解説](https://atcoder.jp/contests/abc268/editorial/4782)
- [ABC268 G 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_g)
- [ABC287 E 公式問題文](https://atcoder.jp/contests/abc287/tasks/abc287_e)
- [ABC287 E 公式解説](https://atcoder.jp/contests/abc287/editorial/5609)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-trie-prefix`
