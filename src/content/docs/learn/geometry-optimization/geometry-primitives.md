---
title: "幾何の基本判定と座標変換"
description: "幾何の基本判定と座標変換の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 26
---

# 幾何の基本判定と座標変換

## 概要

### 幾何の基本判定・配置・座標変換

交差・方向・距離・接触条件を、外積、端点順、格子占有または変換後座標の局所判定にする。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。

- 凸包の境界候補列挙・半平面交差。

## 下位単元

- [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC385 F「Visible Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_f)
2. [ABC426 E「Closest Moment」](https://atcoder.jp/contests/abc426/tasks/abc426_e)
3. [ABC442 E「Laser Takahashi」](https://atcoder.jp/contests/abc442/tasks/abc442_e)
4. [ABC223 E「Placing Rectangles」](https://atcoder.jp/contests/abc223/tasks/abc223_e)
5. [ABC351 E「Jump Distance Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_e)
6. [ABC220 G「Isosceles Trapezium」](https://atcoder.jp/contests/abc220/tasks/abc220_g)
7. [ABC234 Ex「Enumerate Pairs」](https://atcoder.jp/contests/abc234/tasks/abc234_h)
8. [ABC248 E「K-colinear Line」](https://atcoder.jp/contests/abc248/tasks/abc248_e)
9. [ABC258 F「Main Street」](https://atcoder.jp/contests/abc258/tasks/abc258_f)
10. [ABC296 G「Polygon and Points」](https://atcoder.jp/contests/abc296/tasks/abc296_g)
11. [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g)
12. [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f)
13. [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e)
14. [ABC437 F「Manhattan Christmas Tree 2」](https://atcoder.jp/contests/abc437/tasks/abc437_f)
15. [ABC225 E「7」](https://atcoder.jp/contests/abc225/tasks/abc225_e)
16. [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f)
17. [ABC274 F「Fishing」](https://atcoder.jp/contests/abc274/tasks/abc274_f)
18. [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f)
19. [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f)
20. [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h)
21. [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC240 G「Teleporting Takahashi」](https://atcoder.jp/contests/abc240/tasks/abc240_g)
- [ABC243 Ex「Builder Takahashi (Enhanced version)」](https://atcoder.jp/contests/abc243/tasks/abc243_h)
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
- [ABC314 Ex「Disk and Segments」](https://atcoder.jp/contests/abc314/tasks/abc314_h)
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
- [ABC377 F「Avoid Queen Attack」](https://atcoder.jp/contests/abc377/tasks/abc377_f)
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)

## 根拠

- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)
- [ABC221 G 公式解説](https://atcoder.jp/contests/abc221/editorial/2724)
- [ABC221 G 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC223 E 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_e)
- [ABC223 E 公式解説](https://atcoder.jp/contests/abc223/editorial/2781)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-geometry-primitives`
