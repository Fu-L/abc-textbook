---
title: "整数境界と同値区間を正確に分ける"
description: "「整数境界と同値区間を正確に分ける」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 173
---

# 整数境界と同値区間を正確に分ける

習得対象の目安: **水色（1200–1599）**。床関数や整数根が変わる境界を厳密に求め、同じ値の区間をまとめる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 整数境界・同値区間分割

floor値・整数根・表記桁数・圧縮block内の式が変わる整数境界を正確に分け、区間ごとに処理する。

商q=floor(N/l)が一定の最大区間は[l,floor(N/q)]である。右端の次へ進めば、i≤√Nの部分と商≤√Nの部分を合わせてO(√N)個のblockだけを処理できる。三角数・整数根・桁数の境界も、式が変わる位置を整数演算で求める。

一次式の床和を格子点領域の転置で計算するfloor_sumは別の原理である。商一定区間の列挙と混ぜず、「格子点転置によるfloor_sum」の節で引数の減少と重み付き和への拡張を学ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。

### このUnitでは扱わないもの

- 素因数指数による整数条件の分解。

## 問題一覧

1. [ABC230 E「Fraction Floor Sum」](https://atcoder.jp/contests/abc230/tasks/abc230_e)
2. [ABC414 E「Count A%B=C」](https://atcoder.jp/contests/abc414/tasks/abc414_e)
3. [ABC452 E「You WILL Like Sigma Problem」](https://atcoder.jp/contests/abc452/tasks/abc452_e)
4. [ABC356 E「Max/Min」](https://atcoder.jp/contests/abc356/tasks/abc356_e)
5. [ABC253 G「Swap Many Times」](https://atcoder.jp/contests/abc253/tasks/abc253_g)
6. [ABC293 F「Zero or One」](https://atcoder.jp/contests/abc293/tasks/abc293_f)
7. [ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」](https://atcoder.jp/contests/abc315/tasks/abc315_g)
8. [ABC444 F「Half and Median」](https://atcoder.jp/contests/abc444/tasks/abc444_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC239 Ex「Dice Product 2」](https://atcoder.jp/contests/abc239/tasks/abc239_h)
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
- [ABC243 G「Sqrt」](https://atcoder.jp/contests/abc243/tasks/abc243_g)
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f)
- [ABC361 F「x = a^b」](https://atcoder.jp/contests/abc361/tasks/abc361_f)
- [ABC370 G「Divisible by 3」](https://atcoder.jp/contests/abc370/tasks/abc370_g)
- [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g)

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC230 E 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_e)
- [ABC230 E 公式解説](https://atcoder.jp/contests/abc230/editorial/3015)
- [ABC239 H 公式解説](https://atcoder.jp/contests/abc239/editorial/3357)
- [ABC239 H 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-integer-boundary-blocks`
