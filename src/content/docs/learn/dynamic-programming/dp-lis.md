---
title: "LIS・末尾の支配関係"
description: "LIS・末尾の支配関係の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 106
---

# LIS・末尾の支配関係

## 概要

### LIS・末尾の支配関係

部分列の長さ別最小末尾と値別最良長を比較し、延長可能性を失わない状態圧縮と値域集約を選ぶ。

LISは「末尾が小さいほど次を延長しやすい」という支配関係を使う。長さごとの最小末尾tailsを保てば、狭義増加はlower_bound、非減少はupper_boundで更新できる。ABC393 Fのprefix・値上限query、ABC369 Fの二次元順序と復元へ進む。

もう一つの表現は値ごとの最良長であり、許される直前値の範囲の最大値に1を足す。ABC339 Eでは範囲が[A_i−D,A_i+D]なのでSegment Treeが自然になる。tailsで十分か、値域集約が必要かを延長条件から判断するため、区間monoidを先に学ぶ。

ABC354 Fでは左からの最良長l_iと右からの最良長r_iを計算し、l_i+r_i−1=Lで最長解に属し得る位置を判定する。直接のLIS計算から、最適解全体に関する情報へ発展する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 列・subsequence DP、区間monoid要約。

区間monoid要約・列・subsequence DPで得た考え方と実装を再利用し、LIS・末尾の支配関係の発動条件・正当化・境界を重複なく学ぶ。

- LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC439 E「Kite」](https://atcoder.jp/contests/abc439/tasks/abc439_e)
2. [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e)
3. [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f)
4. [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f)
5. [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
6. [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
7. [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
8. [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC339 E 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_e)
- [ABC339 E 公式解説](https://atcoder.jp/contests/abc339/editorial/9210)
- [ABC354 F 公式解説](https://atcoder.jp/contests/abc354/editorial/10027)
- [ABC354 F 公式問題文](https://atcoder.jp/contests/abc354/tasks/abc354_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-dp-lis`
