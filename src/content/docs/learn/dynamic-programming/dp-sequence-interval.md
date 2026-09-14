---
title: "列・区間・分割のDP"
description: "「列・区間・分割のDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 30
---

# 列・区間・分割のDP

## 概要

配列上のDPは、添字が似ていても依存関係で分ける。列DPは処理済みprefixへ一要素を追加し、prefix分割は最後のブロックを固定する。区間合成は独立な小区間の答えを合わせ、区間拡張は訪問済み区間の外へ一歩進む。

LISは列DPのうち、末尾の支配関係で状態を圧縮する流れとして独立に読む。問題名や配列という入力形式ではなく、「何を固定すると残りが同じ問題になるか」で節を選ぶ。

状態設計を土台に、列の選択、LISの支配関係、prefix分割、独立な区間の合成、訪問済み区間の拡張を別の依存構造として比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

### このUnitでは扱わないもの

- bitmask集合や容量だけを状態にし、列順・区間分割を持たないDP。

## 下位単元

- [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)
- [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)
- [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)
- [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)
- [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)
- [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h)
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h)
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e)
- [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f)
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)

## 根拠

- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC217 F 公式解説](https://atcoder.jp/contests/abc217/editorial/2584)
- [ABC217 F 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_f)
- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-sequence-interval`
