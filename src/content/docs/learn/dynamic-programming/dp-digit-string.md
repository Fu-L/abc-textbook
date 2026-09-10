---
title: "接頭辞から更新する有限状態DP"
description: "接頭辞から更新する有限状態DPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 71
---

# 接頭辞から更新する有限状態DP

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

状態設計を土台に、接頭辞から決まる有限統計を更新するという共通像を作り、数値上限の桁DPと有限automaton DPの境界を比較する。

- 整除鎖・加算式のcarryだけを下位桁から渡すDP、および接頭辞状態を使わない一般の表DP。

## 下位単元

- [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)
- [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC391 G「Many LCS」](https://atcoder.jp/contests/abc391/tasks/abc391_g)
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f)

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC235 F 公式解説](https://atcoder.jp/contests/abc235/editorial/3247)
- [ABC235 F 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_f)
- [ABC288 H 公式解説](https://atcoder.jp/contests/abc288/editorial/5663)
- [ABC288 H 公式問題文](https://atcoder.jp/contests/abc288/tasks/abc288_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-dp-digit-string`
