---
title: "疎なkeyの順序を保ってdense indexへ圧縮する"
description: "疎なkeyの順序を保ってdense indexへ圧縮するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 14
---

# 疎なkeyの順序を保ってdense indexへ圧縮する

## 概要

### 座標・値の順序保存圧縮

疎な初期値・将来更新値・event座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

比較に必要なのが順序と等値性だけであることを確認し、疎な初期値・将来更新値・event座標をsort-uniqueしたdense indexへ写す。

- 値・時刻順にactive集合を増減するevent sweep、および固定配列・行列を入力順のまま読むだけのscan。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC231 F「Jealous Two」](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC232 G「Modulo Shortest Path」](https://atcoder.jp/contests/abc232/tasks/abc232_g)
- [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g)
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h)
- [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f)
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC287 G「Balance Update Query」](https://atcoder.jp/contests/abc287/tasks/abc287_g)
- [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f)
- [ABC309 F「Box in Box」](https://atcoder.jp/contests/abc309/tasks/abc309_f)
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g)
- [ABC351 F「Double Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_f)
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f)
- [ABC360 F「InterSections」](https://atcoder.jp/contests/abc360/tasks/abc360_f)
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
- [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g)
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g)
- [ABC434 E「Distribute Bunnies」](https://atcoder.jp/contests/abc434/tasks/abc434_e)
- [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f)
- [ABC465 G「Sum of Mex of Mod of Linear」](https://atcoder.jp/contests/abc465/tasks/abc465_g)

## 根拠

- [ABC221 E 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC221 E 公式解説](https://atcoder.jp/contests/abc221/editorial/2718)
- [ABC231 F 公式解説](https://atcoder.jp/contests/abc231/editorial/3059)
- [ABC231 F 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC232 G 公式解説](https://atcoder.jp/contests/abc232/editorial/3141)
- [ABC232 G 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-coordinate-compression`
