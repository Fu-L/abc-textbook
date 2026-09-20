---
title: "automaton上のDP・行列遷移"
description: "「automaton上のDP・行列遷移」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 75
---

# automaton上のDP・行列遷移

習得対象の目安: **青色（1600–1999）**。構成済みautomatonと位置の直積を使い、禁止状態と受理状態を区別して数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### automaton上のDP・行列遷移

位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)、[有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（後の章）。

有限pattern automatonの完全遷移を構成できるようになった後、位置・長さとの直積状態で受理列を数え、桁上限がある場合だけ桁DPと組み合わせる。

### このUnitでは扱わないもの

- automaton上のDP・行列遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g)
2. [ABC391 G「Many LCS」](https://atcoder.jp/contests/abc391/tasks/abc391_g)
3. [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
4. [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f)

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G 公式解説](https://atcoder.jp/contests/abc305/editorial/6540)
- [ABC305 G 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-automaton-dp`
