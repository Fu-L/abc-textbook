---
title: "最短路モデル"
description: "最短路モデルの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 70
---

# 最短路モデル

## 概要

### 最短路モデル

重み付きグラフに帰着し、距離の確定条件に応じた最短路法を選ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 状態グラフのモデリングと探索。

基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC213 E「Stronger Takahashi」](https://atcoder.jp/contests/abc213/tasks/abc213_e)
2. [ABC237 E「Skiing」](https://atcoder.jp/contests/abc237/tasks/abc237_e)
3. [ABC325 E「Our clients, please wait a moment」](https://atcoder.jp/contests/abc325/tasks/abc325_e)
4. [ABC245 G「Foreign Friends」](https://atcoder.jp/contests/abc245/tasks/abc245_g)
5. [ABC246 E「Bishop 2」](https://atcoder.jp/contests/abc246/tasks/abc246_e)
6. [ABC277 E「Crystal Switches」](https://atcoder.jp/contests/abc277/tasks/abc277_e)
7. [ABC286 E「Souvenir」](https://atcoder.jp/contests/abc286/tasks/abc286_e)
8. [ABC291 F「Teleporter and Closed off」](https://atcoder.jp/contests/abc291/tasks/abc291_f)
9. [ABC342 E「Last Train」](https://atcoder.jp/contests/abc342/tasks/abc342_e)
10. [ABC363 E「Sinking Land」](https://atcoder.jp/contests/abc363/tasks/abc363_e)
11. [ABC395 E「Flip Edge」](https://atcoder.jp/contests/abc395/tasks/abc395_e)
12. [ABC416 E「Development」](https://atcoder.jp/contests/abc416/tasks/abc416_e)
13. [ABC431 E「Reflection on Grid」](https://atcoder.jp/contests/abc431/tasks/abc431_e)
14. [ABC463 E「Roads and Gates」](https://atcoder.jp/contests/abc463/tasks/abc463_e)
15. [ABC232 G「Modulo Shortest Path」](https://atcoder.jp/contests/abc232/tasks/abc232_g)
16. [ABC243 Ex「Builder Takahashi (Enhanced version)」](https://atcoder.jp/contests/abc243/tasks/abc243_h)
17. [ABC257 F「Teleporter Setting」](https://atcoder.jp/contests/abc257/tasks/abc257_f)
18. [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e)
19. [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g)
20. [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e)
21. [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e)
22. [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f)
23. [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f)
24. [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e)
25. [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e)
26. [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e)
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC252 E「Road Reduction」](https://atcoder.jp/contests/abc252/tasks/abc252_e)
- [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g)
- [ABC308 Ex「Make Q」](https://atcoder.jp/contests/abc308/tasks/abc308_h)
- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC375 G「Road Blocked 2」](https://atcoder.jp/contests/abc375/tasks/abc375_g)
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g)
- [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g)
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)

## 根拠

- [ABC213 E 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_e)
- [ABC213 E 公式解説](https://atcoder.jp/contests/abc213/editorial/2397)
- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC232 G 公式解説](https://atcoder.jp/contests/abc232/editorial/3141)
- [ABC232 G 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-weighted-shortest-path`
