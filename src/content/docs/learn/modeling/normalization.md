---
title: "同値な状態を正規化する"
description: "同値な状態を正規化するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 9
---

# 同値な状態を正規化する

## 概要

### 状態・配置の正規化

対称操作で同値な状態を一意な標準形へ写し、重複した探索・数え上げを除く。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

対称な状態を同一視できると探索やDPの状態数を減らせるため、同値類の標準形と不変量を先に定める。

- 交換論による貪欲順の証明。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC242 E「(∀x∀)」](https://atcoder.jp/contests/abc242/tasks/abc242_e)
2. [ABC219 F「Cleaning Robot」](https://atcoder.jp/contests/abc219/tasks/abc219_f)
3. [ABC250 E「Prefix Equality」](https://atcoder.jp/contests/abc250/tasks/abc250_e)
4. [ABC382 G「Tile Distance 3」](https://atcoder.jp/contests/abc382/tasks/abc382_g)
5. [ABC307 E「Distinct Adjacent」](https://atcoder.jp/contests/abc307/tasks/abc307_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC232 H「King's Tour」](https://atcoder.jp/contests/abc232/tasks/abc232_h)
- [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g)
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g)
- [ABC296 F「Simultaneous Swap」](https://atcoder.jp/contests/abc296/tasks/abc296_f)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC302 G「Sort from 1 to 4」](https://atcoder.jp/contests/abc302/tasks/abc302_g)
- [ABC313 G「Redistribution of Piles」](https://atcoder.jp/contests/abc313/tasks/abc313_g)
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f)
- [ABC328 G「Cut and Reorder」](https://atcoder.jp/contests/abc328/tasks/abc328_g)
- [ABC360 E「Random Swaps of Balls」](https://atcoder.jp/contests/abc360/tasks/abc360_e)
- [ABC404 F「Lost and Pound」](https://atcoder.jp/contests/abc404/tasks/abc404_f)
- [ABC411 G「Count Cycles」](https://atcoder.jp/contests/abc411/tasks/abc411_g)
- [ABC421 E「Yacht」](https://atcoder.jp/contests/abc421/tasks/abc421_e)
- [ABC425 F「Inserting Process」](https://atcoder.jp/contests/abc425/tasks/abc425_f)
- [ABC427 G「Takahashi's Expectation 2」](https://atcoder.jp/contests/abc427/tasks/abc427_g)
- [ABC446 G「221 Subsequence」](https://atcoder.jp/contests/abc446/tasks/abc446_g)
- [ABC450 G「Random Subtraction」](https://atcoder.jp/contests/abc450/tasks/abc450_g)
- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e)
- [ABC463 F「Senshuraku」](https://atcoder.jp/contests/abc463/tasks/abc463_f)

## 根拠

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC219 F 公式解説](https://atcoder.jp/contests/abc219/editorial/2654)
- [ABC219 F 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_f)
- [ABC232 H 公式解説](https://atcoder.jp/contests/abc232/editorial/3140)
- [ABC232 H 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-normalization`
