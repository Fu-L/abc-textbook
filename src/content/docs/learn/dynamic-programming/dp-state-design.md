---
title: "最小十分状態からDPを設計する"
description: "最小十分状態からDPを設計するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 0
---

# 最小十分状態からDPを設計する

## 概要

### DPの最小十分状態

将来の選択肢と答えが同じprefixを同一状態に縮約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 下位単元

- [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC232 E「Rook Path」](https://atcoder.jp/contests/abc232/tasks/abc232_e)
2. [ABC217 G「Groups」](https://atcoder.jp/contests/abc217/tasks/abc217_g)
3. [ABC229 F「Make Bipartite」](https://atcoder.jp/contests/abc229/tasks/abc229_f)
4. [ABC244 E「King Bombee」](https://atcoder.jp/contests/abc244/tasks/abc244_e)
5. [ABC247 F「Cards」](https://atcoder.jp/contests/abc247/tasks/abc247_f)
6. [ABC251 E「Takahashi and Animals」](https://atcoder.jp/contests/abc251/tasks/abc251_e)
7. [ABC264 F「Monochromatic Path」](https://atcoder.jp/contests/abc264/tasks/abc264_f)
8. [ABC283 E「Don't Isolate Elements」](https://atcoder.jp/contests/abc283/tasks/abc283_e)
9. [ABC310 E「NAND repeatedly」](https://atcoder.jp/contests/abc310/tasks/abc310_e)
10. [ABC344 F「Earn to Advance」](https://atcoder.jp/contests/abc344/tasks/abc344_f)
11. [ABC376 F「Hands on Ring (Hard)」](https://atcoder.jp/contests/abc376/tasks/abc376_f)
12. [ABC462 F「More ABC」](https://atcoder.jp/contests/abc462/tasks/abc462_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 E「Chain Contestant」](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC227 E「Swap」](https://atcoder.jp/contests/abc227/tasks/abc227_e)
- [ABC236 E「Average and Median」](https://atcoder.jp/contests/abc236/tasks/abc236_e)
- [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f)
- [ABC265 E「Warp」](https://atcoder.jp/contests/abc265/tasks/abc265_e)
- [ABC273 G「Row Column Sums 2」](https://atcoder.jp/contests/abc273/tasks/abc273_g)
- [ABC279 G「At Most 2 Colors」](https://atcoder.jp/contests/abc279/tasks/abc279_g)
- [ABC281 G「Farthest City」](https://atcoder.jp/contests/abc281/tasks/abc281_g)
- [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g)
- [ABC307 E「Distinct Adjacent」](https://atcoder.jp/contests/abc307/tasks/abc307_e)
- [ABC309 E「Family and Insurance」](https://atcoder.jp/contests/abc309/tasks/abc309_e)
- [ABC311 E「Defect-free Squares」](https://atcoder.jp/contests/abc311/tasks/abc311_e)
- [ABC311 F「Yet Another Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_f)
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h)
- [ABC322 E「Product Development」](https://atcoder.jp/contests/abc322/tasks/abc322_e)
- [ABC345 E「Colorful Subsequence」](https://atcoder.jp/contests/abc345/tasks/abc345_e)
- [ABC350 E「Toward 0」](https://atcoder.jp/contests/abc350/tasks/abc350_e)
- [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f)
- [ABC375 E「3 Team Division」](https://atcoder.jp/contests/abc375/tasks/abc375_e)
- [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g)
- [ABC381 F「1122 Subsequence」](https://atcoder.jp/contests/abc381/tasks/abc381_f)
- [ABC386 F「Operate K」](https://atcoder.jp/contests/abc386/tasks/abc386_f)
- [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f)
- [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g)
- [ABC391 G「Many LCS」](https://atcoder.jp/contests/abc391/tasks/abc391_g)
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f)
- [ABC416 G「Concat (1st)」](https://atcoder.jp/contests/abc416/tasks/abc416_g)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)
- [ABC422 F「Eat and Ride」](https://atcoder.jp/contests/abc422/tasks/abc422_f)
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e)
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f)
- [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g)
- [ABC450 F「Strongly Connected 2」](https://atcoder.jp/contests/abc450/tasks/abc450_f)
- [ABC457 F「Second Gap」](https://atcoder.jp/contests/abc457/tasks/abc457_f)

## 根拠

- [ABC215 E 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC215 E 公式解説](https://atcoder.jp/contests/abc215/editorial/2483)
- [ABC217 G 公式解説](https://atcoder.jp/contests/abc217/editorial/2390)
- [ABC217 G 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_g)
- [ABC227 E 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_e)
- [ABC227 E 公式解説](https://atcoder.jp/contests/abc227/editorial/2908)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-dp-state-design`
