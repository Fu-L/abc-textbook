---
title: "候補数を界して全列挙・有限case分解する"
description: "「候補数を界して全列挙・有限case分解する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 4
---

# 候補数を界して全列挙・有限case分解する

習得対象の目安: **緑色（800–1199）**。制約から候補数を見積もり、成功までの探索回数を界する考え方を学ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有界全列挙・有限case分解

制約や生成パラメータから候補総数を界すか、鳩ノ巣原理で成功前の失敗回数を界して探索する。

有界探索には、候補総数が小さい場合と、成功するまでの失敗回数だけが小さい場合がある。後者では、探索が長引くなら必ず衝突して解が得られることを鳩ノ巣原理で示す。

ABC260 Fでは小さい側の端点対(u,v)に、その二点と隣接する中点を記録する。別の中点で同じ対を見つければ4-cycleを復元して終了する。衝突前には各端点対を高々一度しか登録しないため、見かけのΣdeg²ではなくO(S+M+T²)で探索を界せる。復元よりも、失敗回数を界する証明が再利用すべき核心である。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。

### このUnitでは扱わないもの

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 問題一覧

1. [ABC234 E「Arithmetic Number」](https://atcoder.jp/contests/abc234/tasks/abc234_e)
2. [ABC254 E「Small d and k」](https://atcoder.jp/contests/abc254/tasks/abc254_e)
3. [ABC272 E「Add and Mex」](https://atcoder.jp/contests/abc272/tasks/abc272_e)
4. [ABC386 E「Maximize XOR」](https://atcoder.jp/contests/abc386/tasks/abc386_e)
5. [ABC219 E「Moat」](https://atcoder.jp/contests/abc219/tasks/abc219_e)
6. [ABC410 F「Balanced Rectangles」](https://atcoder.jp/contests/abc410/tasks/abc410_f)
7. [ABC312 E「Tangency of Cuboids」](https://atcoder.jp/contests/abc312/tasks/abc312_e)
8. [ABC302 G「Sort from 1 to 4」](https://atcoder.jp/contests/abc302/tasks/abc302_g)
9. [ABC260 F「Find 4-cycle」](https://atcoder.jp/contests/abc260/tasks/abc260_f)
10. [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f)
11. [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f)
12. [ABC442 G「Lightweight Knapsack」](https://atcoder.jp/contests/abc442/tasks/abc442_g)
13. [ABC290 G「Edge Elimination」](https://atcoder.jp/contests/abc290/tasks/abc290_g)

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
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f)
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC284 E「Count Simple Paths」](https://atcoder.jp/contests/abc284/tasks/abc284_e)
- [ABC293 F「Zero or One」](https://atcoder.jp/contests/abc293/tasks/abc293_f)
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g)
- [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g)
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f)
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f)
- [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e)
- [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e)
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
- [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f)
- [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e)
- [ABC387 E「Digit Sum Divisible 2」](https://atcoder.jp/contests/abc387/tasks/abc387_e)
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f)
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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-bounded-enumeration`
