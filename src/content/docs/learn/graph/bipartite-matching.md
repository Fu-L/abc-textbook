---
title: "二部matching・Hall・Kőnig"
description: "二部matching・Hall・Kőnigの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 167
---

# 二部matching・Hall・Kőnig

## 概要

### 二部matching・Hall・Kőnig

左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。

ABC215 Hでは品種集合Sの在庫総数をf(S)、許可品種がすべてSに含まれる注文数をg(S)とする。全Sでf(S)≥g(S)がHallの条件である。供給を減らして割当て不能にする最小削除数は、g(S)>0でのf(S)−g(S)+1の最小値。注文0の条件は供給を0まで減らしても破れない。

品種一つ、在庫3、注文1なら空集合の余裕0を最小化へ入れず、非空集合の余裕2から3個を食べる。選び方を数える最小集合族にもg(S)>0を課し、複数の最小集合に含まれる同じ個体選択を重複計数しない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 二部彩色と成分構造を扱う。

二部グラフの彩色と成分構造で得た考え方と実装を再利用し、二部matching・Hall・Kőnigの発動条件・正当化・境界を重複なく学ぶ。

- 二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC241 G「Round Robin」](https://atcoder.jp/contests/abc241/tasks/abc241_g)
2. [ABC461 G「Graph Problem 2026」](https://atcoder.jp/contests/abc461/tasks/abc461_g)
3. [ABC317 G「Rearranging」](https://atcoder.jp/contests/abc317/tasks/abc317_g)
4. [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g)
5. [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g)
6. [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g)
7. [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g)
8. [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g)
9. [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h)
10. [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h)
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f)
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g)

## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC237 H 公式解説](https://atcoder.jp/contests/abc237/editorial/3321)
- [ABC237 H 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC241 G 公式解説](https://atcoder.jp/contests/abc241/editorial/3452)
- [ABC241 G 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-bipartite-matching`
