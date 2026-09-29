---
title: "XOR閾値matchingのbit分割再帰"
description: "「XOR閾値matchingのbit分割再帰」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 28
---

# XOR閾値matchingのbit分割再帰

習得対象の目安: **赤色（2800以上）**。XOR閾値ごとにpair可能数を最大化するbit分割再帰を組み立て、同一部分集合内と二集合間のmatching数を合成する根拠を証明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### XOR閾値matchingのbit分割再帰

固定閾値xに対し、XORがx以上となる最大pair数を求める。最上位bitで集合を分け、閾値bitが0なら確定できるcross pairを最大化し、1ならcross pairだけを残し、同一集合内と二集合間の再帰値を合成する。

### 習得する技能

- 整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)。

このUnitを直接前提とする単元: なし。

固定したXOR閾値でpair可能数を最大化する問題を、bitごとの同一集合内matchingと二集合間matchingへ分ける。閾値bitによる確定pairと下位bitへ残すpairを区別し、再帰式が最大数を保つ理由を証明する。

### このUnitでは扱わないもの

- 一般二部matching・一般グラフmatchingを汎用アルゴリズムで解く問題。
- 二集合間の最大XORだけを求める最小化問題、および上位bitを順に固定するbitwise greedy feasibility。

## 問題一覧

- [ABC304 G「Max of Medians」](https://atcoder.jp/contests/abc304/tasks/abc304_g) — 主題: [XOR閾値matchingのbit分割再帰](/learn/modeling/xor-threshold-matching/)（整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC304 G 公式解説](https://atcoder.jp/contests/abc304/editorial/6509)
- [ABC304 G 公式問題文](https://atcoder.jp/contests/abc304/tasks/abc304_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-xor-threshold-matching`
