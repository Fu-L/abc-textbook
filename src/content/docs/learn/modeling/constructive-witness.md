---
title: "成立証明から構成解を復元する"
description: "成立証明から構成解を復元するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 24
---

# 成立証明から構成解を復元する

## 概要

### 構成解・witness復元

成立条件の証明が与える局所操作やparentを記録し、実際の解を復元する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC244 G「Construct Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_g)
2. [ABC251 F「Two Spanning Trees」](https://atcoder.jp/contests/abc251/tasks/abc251_f)
3. [ABC255 F「Pre-order and In-order」](https://atcoder.jp/contests/abc255/tasks/abc255_f)
4. [ABC289 F「Teleporter Takahashi」](https://atcoder.jp/contests/abc289/tasks/abc289_f)
5. [ABC299 E「Nearest Black Vertex」](https://atcoder.jp/contests/abc299/tasks/abc299_e)
6. [ABC358 F「Easiest Maze」](https://atcoder.jp/contests/abc358/tasks/abc358_f)
7. [ABC448 F「Authentic Traveling Salesman Problem」](https://atcoder.jp/contests/abc448/tasks/abc448_f)
8. [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f)
9. [ABC232 H「King's Tour」](https://atcoder.jp/contests/abc232/tasks/abc232_h)
10. [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f)
11. [ABC363 F「Palindromic Expression」](https://atcoder.jp/contests/abc363/tasks/abc363_f)
12. [ABC387 E「Digit Sum Divisible 2」](https://atcoder.jp/contests/abc387/tasks/abc387_e)
13. [ABC454 E「LRUD Moving」](https://atcoder.jp/contests/abc454/tasks/abc454_e)
14. [ABC362 F「Perfect Matching on a Tree」](https://atcoder.jp/contests/abc362/tasks/abc362_f)
15. [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e)
16. [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f)
17. [ABC333 E「Takahashi Quest」](https://atcoder.jp/contests/abc333/tasks/abc333_e)
18. [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC326 F「Robot Rotation」](https://atcoder.jp/contests/abc326/tasks/abc326_f)
- [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f)
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g)
- [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f)
- [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e)
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g)
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f)
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g)
- [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e)
- [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f)

## 根拠

- [ABC221 G 公式解説](https://atcoder.jp/contests/abc221/editorial/2724)
- [ABC221 G 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC232 H 公式解説](https://atcoder.jp/contests/abc232/editorial/3140)
- [ABC232 H 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-constructive-witness`
