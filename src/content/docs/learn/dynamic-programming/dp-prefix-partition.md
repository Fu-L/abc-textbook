---
title: "prefix分割DP"
description: "「prefix分割DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 32
---

# prefix分割DP

## 概要

### prefix分割DP

列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。

dp[r]をprefix [0,r)の答えとし、最後のブロック[l,r)を固定してdp[l]から遷移する。分割を一意に最後の切れ目へ対応させると、漏れ・重複のない漸化式になる。依存は短いprefixから長いprefixへ向かう。

ABC285 Eでは休日間の平日ブロックの価値を前計算する。ABC288 Fでは最後の数の桁を一つ延ばす式を用いて全切れ目の和をまとめる。区間合成と違い、最後のブロック自体を同種の区間DPで解くとは限らない。

ABC234 Gではdp[i]=Σ_{j<i}dp[j]·(max A[j,i)−min A[j,i))。最後の区間の寄与をmaxとminへ分け、各切れ目jの重みdp[j]を極値が等しい連続群ごとに単調stackへ持つ。右端追加で極値が更新される群をまとめて併合するため、各要素は高々一度push・popされる。

ABC374 Fでは、出荷を前へ詰めても待ち時間が悪化しないことから、出荷時刻をT_i+kXへ限定する。到着順に先頭から何個を出荷済みかと、候補時刻を状態にして、次の荷物のブロックを出荷するDPへ進む。候補を残してよい証明を先に行い、時刻差には圧縮順位でなく元の時刻を使う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

DPの最小十分状態で得た考え方と実装を再利用し、prefix分割DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC285 E「Work or Rest」](https://atcoder.jp/contests/abc285/tasks/abc285_e)
2. [ABC466 E「Range Flip」](https://atcoder.jp/contests/abc466/tasks/abc466_e)
3. [ABC230 F「Predilection」](https://atcoder.jp/contests/abc230/tasks/abc230_f)
4. [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f)
5. [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
- [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f)

## 根拠

- [ABC230 F 公式解説](https://atcoder.jp/contests/abc230/editorial/91)
- [ABC230 F 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_f)
- [ABC234 G 公式解説](https://atcoder.jp/contests/abc234/editorial/3227)
- [ABC234 G 公式問題文](https://atcoder.jp/contests/abc234/tasks/abc234_g)
- [ABC262 H 公式解説](https://atcoder.jp/contests/abc262/editorial/4481)
- [ABC262 H 公式問題文](https://atcoder.jp/contests/abc262/tasks/abc262_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-prefix-partition`
