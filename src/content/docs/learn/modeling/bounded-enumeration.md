---
title: "候補数を界して全列挙・有限case分解する"
description: "候補数を界して全列挙・有限case分解するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 25
---

# 候補数を界して全列挙・有限case分解する

## 概要

### 有界全列挙・有限case分解

制約、少数の生成パラメータ、固定選択数、有限な幾何caseから候補総数を直接界し、全候補を評価する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

制約、生成パラメータ、固定選択数、有限な幾何caseから候補総数を先に界し、全候補を漏れなく評価する。

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC234 E「Arithmetic Number」](https://atcoder.jp/contests/abc234/tasks/abc234_e)
2. [ABC386 E「Maximize XOR」](https://atcoder.jp/contests/abc386/tasks/abc386_e)
3. [ABC442 G「Lightweight Knapsack」](https://atcoder.jp/contests/abc442/tasks/abc442_g)
4. [ABC219 E「Moat」](https://atcoder.jp/contests/abc219/tasks/abc219_e)
5. [ABC254 E「Small d and k」](https://atcoder.jp/contests/abc254/tasks/abc254_e)
6. [ABC272 E「Add and Mex」](https://atcoder.jp/contests/abc272/tasks/abc272_e)
7. [ABC312 E「Tangency of Cuboids」](https://atcoder.jp/contests/abc312/tasks/abc312_e)
8. [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e)
9. [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f)
10. [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f)
11. [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC220 G「Isosceles Trapezium」](https://atcoder.jp/contests/abc220/tasks/abc220_g)
- [ABC223 E「Placing Rectangles」](https://atcoder.jp/contests/abc223/tasks/abc223_e)
- [ABC226 F「Score of Permutations」](https://atcoder.jp/contests/abc226/tasks/abc226_f)
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC234 Ex「Enumerate Pairs」](https://atcoder.jp/contests/abc234/tasks/abc234_h)
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
- [ABC248 E「K-colinear Line」](https://atcoder.jp/contests/abc248/tasks/abc248_e)
- [ABC257 F「Teleporter Setting」](https://atcoder.jp/contests/abc257/tasks/abc257_f)
- [ABC258 F「Main Street」](https://atcoder.jp/contests/abc258/tasks/abc258_f)
- [ABC260 F「Find 4-cycle」](https://atcoder.jp/contests/abc260/tasks/abc260_f)
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f)
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC284 E「Count Simple Paths」](https://atcoder.jp/contests/abc284/tasks/abc284_e)
- [ABC290 G「Edge Elimination」](https://atcoder.jp/contests/abc290/tasks/abc290_g)
- [ABC293 F「Zero or One」](https://atcoder.jp/contests/abc293/tasks/abc293_f)
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g)
- [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g)
- [ABC302 G「Sort from 1 to 4」](https://atcoder.jp/contests/abc302/tasks/abc302_g)
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f)
- [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e)
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
- [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f)
- [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e)
- [ABC387 E「Digit Sum Divisible 2」](https://atcoder.jp/contests/abc387/tasks/abc387_e)
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f)
- [ABC410 F「Balanced Rectangles」](https://atcoder.jp/contests/abc410/tasks/abc410_f)
- [ABC418 E「Trapezium」](https://atcoder.jp/contests/abc418/tasks/abc418_e)
- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)

## 根拠

- [ABC219 E 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_e)
- [ABC219 E 公式解説](https://atcoder.jp/contests/abc219/editorial/2652)
- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)
- [ABC223 E 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_e)
- [ABC223 E 公式解説](https://atcoder.jp/contests/abc223/editorial/2781)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-bounded-enumeration`
