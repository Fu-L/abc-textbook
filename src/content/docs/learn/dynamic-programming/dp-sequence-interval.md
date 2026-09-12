---
title: "列・区間・分割のDP"
description: "列・区間・分割のDPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 12
---

# 列・区間・分割のDP

## 概要

配列上のDPは、添字が似ていても依存関係で分ける。列DPは処理済みprefixへ一要素を追加し、prefix分割は最後のブロックを固定する。区間合成は独立な小区間の答えを合わせ、区間拡張は訪問済み区間の外へ一歩進む。

LISは列DPのうち、末尾の支配関係で状態を圧縮する流れとして独立に読む。問題名や配列という入力形式ではなく、「何を固定すると残りが同じ問題になるか」で節を選ぶ。

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

状態設計を土台に、列の選択、LISの支配関係、prefix分割、独立な区間の合成、訪問済み区間の拡張を別の依存構造として比較する。

- bitmask集合や容量だけを状態にし、列順・区間分割を持たないDP。

## 下位単元

- [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)
- [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)
- [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)
- [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)
- [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f)
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h)
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e)
- [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f)
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)
- [ABC466 E「Range Flip」](https://atcoder.jp/contests/abc466/tasks/abc466_e)

## 根拠

- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC217 F 公式解説](https://atcoder.jp/contests/abc217/editorial/2584)
- [ABC217 F 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-dp-sequence-interval`
