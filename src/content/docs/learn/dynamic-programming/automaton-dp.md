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

## 標準履修順

第114単元。技能の説明を学んでから問題一覧へ進んでください。

前: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/) ／ 次: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)

## 概要

### automaton上のDP・行列遷移

位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。

### 習得する技能

- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)、[有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。

有限pattern automatonの完全遷移を構成できるようになった後、位置・長さとの直積状態で受理列を数え、桁上限がある場合だけ桁DPと組み合わせる。

### このUnitでは扱わないもの

- automaton上のDP・行列遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。
2. [ABC391 G「Many LCS」](https://atcoder.jp/contests/abc391/tasks/abc391_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
3. [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
4. [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G 公式解説](https://atcoder.jp/contests/abc305/editorial/6540)
- [ABC305 G 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-automaton-dp`
