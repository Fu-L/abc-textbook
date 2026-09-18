---
title: "部分集合・bitmask状態DP"
description: "「部分集合・bitmask状態DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 70
---

# 部分集合・bitmask状態DP

難度の目安: **標準**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 部分集合・bitmask状態DP

各bitの意味を固定し、訪問集合・選択集合・frontierなどの部分集合状態間を遷移する。

ABC309 Gは全N個の値の使用集合を持たず、走査位置の近傍2X−1個だけを残す発展例である。bitmaskという表記以上に、未来の禁止辺に接続しない値を忘れられることが状態削減の根拠になる。境界DPの節で、盤面のprofileと帯状matchingの共通原理を学ぶ。

ABC354 Eでは残存集合maskを状態とし、合法なpairを消すと要素数が2減る順序で勝敗を求める。集合状態とゲームの勝敗再帰を組み合わせる練習として扱う。

bitmaskで状態を書けることと、部分集合DPで解けることは別である。選択済み集合が増えるなどの非循環な順序を証明してから更新順を決める。ABC244 Fはbitを反転して閉路を持つ状態グラフになる比較例であり、状態グラフ探索の節を参照する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC215 E「Chain Contestant」](https://atcoder.jp/contests/abc215/tasks/abc215_e)
2. [ABC274 E「Booster」](https://atcoder.jp/contests/abc274/tasks/abc274_e)
3. [ABC332 E「Lucky bag」](https://atcoder.jp/contests/abc332/tasks/abc332_e)
4. [ABC354 E「Remove Pairs」](https://atcoder.jp/contests/abc354/tasks/abc354_e)
5. [ABC402 E「Payment Required」](https://atcoder.jp/contests/abc402/tasks/abc402_e)
6. [ABC232 F「Simple Operations on Sequence」](https://atcoder.jp/contests/abc232/tasks/abc232_f)
7. [ABC246 F「typewriter」](https://atcoder.jp/contests/abc246/tasks/abc246_f)
8. [ABC278 F「Shiritori」](https://atcoder.jp/contests/abc278/tasks/abc278_f)
9. [ABC310 F「Make 10 Again」](https://atcoder.jp/contests/abc310/tasks/abc310_f)
10. [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f)
11. [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f)
12. [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f)
13. [ABC381 F「1122 Subsequence」](https://atcoder.jp/contests/abc381/tasks/abc381_f)
14. [ABC425 F「Inserting Process」](https://atcoder.jp/contests/abc425/tasks/abc425_f)
15. [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f)
16. [ABC328 G「Cut and Reorder」](https://atcoder.jp/contests/abc328/tasks/abc328_g)
17. [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g)
18. [ABC396 G「Flip Row or Col」](https://atcoder.jp/contests/abc396/tasks/abc396_g)
19. [ABC411 G「Count Cycles」](https://atcoder.jp/contests/abc411/tasks/abc411_g)
20. [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h)
- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h)
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h)
- [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e)
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g)
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g)
- [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f)
- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g)
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f)

## 根拠

- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC215 E 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC215 E 公式解説](https://atcoder.jp/contests/abc215/editorial/2483)
- [ABC216 H 公式解説](https://atcoder.jp/contests/abc216/editorial/2561)
- [ABC216 H 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-subset-state`
