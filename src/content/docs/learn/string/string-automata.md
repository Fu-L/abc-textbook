---
title: "禁止・要求patternを有限状態へ圧縮する"
description: "禁止・要求patternを有限状態へ圧縮するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 65
---

# 禁止・要求patternを有限状態へ圧縮する

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

未来の禁止・要求pattern到達や複数pattern一致だけを決める進行段階・接尾辞状態を作り、遷移表上のDP・行列計算へ接続する。

- 数値上限・桁・繰り上がりを状態にする桁DP、および接頭辞一致長だけを求めるKMP・Z法。

## 下位単元

- [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)
- [Aho–Corasick](/learn/string/aho-corasick/)
- [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC264 G 公式解説](https://atcoder.jp/contests/abc264/editorial/4580)
- [ABC264 G 公式問題文](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-string-automata`
