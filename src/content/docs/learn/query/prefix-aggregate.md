---
title: "一次元・二次元累積和と差分で区間情報を線形化する"
description: "「一次元・二次元累積和と差分で区間情報を線形化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 36
---

# 一次元・二次元累積和と差分で区間情報を線形化する

習得対象の目安: **茶色（400–799）**。加算と差分で区間を表し、一次元から二次元の包除へ広げる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 累積和・差分配列

一次元区間や多次元直方体の情報、または一括加算を接頭辞・端点の差へ変換し、query・数え上げ・復元に使う。

ABC465 Fの添字は{0,…,9}の6軸の直積。各軸を小さい桁値から累積し、queryの上下端を選ぶ64項の包除で直方体和を取る。桁値1は上限2のprefixに含まれるが、二進の1は2の部分マスクではない。Boolean lattice上の部分集合ゼータ変換と更新関係を混同しない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

### このUnitでは扱わないもの

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC268 E「Chinese Restaurant (Three-Star Version)」](https://atcoder.jp/contests/abc268/tasks/abc268_e)
2. [ABC278 E「Grid Filling」](https://atcoder.jp/contests/abc278/tasks/abc278_e)
3. [ABC300 F「More Holidays」](https://atcoder.jp/contests/abc300/tasks/abc300_f)
4. [ABC430 F「Back and Forth Filling」](https://atcoder.jp/contests/abc430/tasks/abc430_f)
5. [ABC260 G「Scalene Triangle Area」](https://atcoder.jp/contests/abc260/tasks/abc260_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC216 G「01Sequence」](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC228 F「Stamp Game」](https://atcoder.jp/contests/abc228/tasks/abc228_f)
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC233 G「Strongest Takahashi」](https://atcoder.jp/contests/abc233/tasks/abc233_g)
- [ABC238 E「Range Sums」](https://atcoder.jp/contests/abc238/tasks/abc238_e)
- [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f)
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g)
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g)
- [ABC307 G「Approximate Equalization」](https://atcoder.jp/contests/abc307/tasks/abc307_g)
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g)
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f)
- [ABC330 G「Inversion Squared」](https://atcoder.jp/contests/abc330/tasks/abc330_g)
- [ABC333 E「Takahashi Quest」](https://atcoder.jp/contests/abc333/tasks/abc333_e)
- [ABC341 E「Alternating String」](https://atcoder.jp/contests/abc341/tasks/abc341_e)
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f)
- [ABC404 G「Specified Range Sums」](https://atcoder.jp/contests/abc404/tasks/abc404_g)
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f)
- [ABC410 F「Balanced Rectangles」](https://atcoder.jp/contests/abc410/tasks/abc410_f)
- [ABC419 E「Subarray Sum Divisibility」](https://atcoder.jp/contests/abc419/tasks/abc419_e)
- [ABC420 F「kirinuki」](https://atcoder.jp/contests/abc420/tasks/abc420_f)
- [ABC421 G「Increase to make it Increasing」](https://atcoder.jp/contests/abc421/tasks/abc421_g)
- [ABC423 E「Sum of Subarrays」](https://atcoder.jp/contests/abc423/tasks/abc423_e)
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e)
- [ABC441 E「A > B substring」](https://atcoder.jp/contests/abc441/tasks/abc441_e)
- [ABC452 E「You WILL Like Sigma Problem」](https://atcoder.jp/contests/abc452/tasks/abc452_e)
- [ABC454 F「Make it Palindrome 2」](https://atcoder.jp/contests/abc454/tasks/abc454_f)
- [ABC455 E「Unbalanced ABC Substrings」](https://atcoder.jp/contests/abc455/tasks/abc455_e)
- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g)
- [ABC465 F「Sjeltzer?」](https://atcoder.jp/contests/abc465/tasks/abc465_f)
- [ABC465 G「Sum of Mex of Mod of Linear」](https://atcoder.jp/contests/abc465/tasks/abc465_g)

## 根拠

- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC228 F 公式解説](https://atcoder.jp/contests/abc228/editorial/2945)
- [ABC228 F 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_f)
- [ABC233 H 公式解説](https://atcoder.jp/contests/abc233/editorial/3168)
- [ABC233 H 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-prefix-aggregate`
