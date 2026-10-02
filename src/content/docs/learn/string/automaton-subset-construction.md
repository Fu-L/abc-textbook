---
title: "非決定性automatonのsubset construction"
description: "「非決定性automatonのsubset construction」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 158
---

# 非決定性automatonのsubset construction

習得対象の目安: **黄色（2000–2399）**。NFAの可能状態集合を一状態へ写し、受理条件と指数的な状態数を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 非決定性automatonのsubset construction

同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。

### 習得する技能

- 同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

非決定性機械で、あるprefixを読んだ後に可能な状態を集合として一つの決定性状態にする。次の文字では集合内の全状態の遷移先を合併する。受理は集合に受理状態が含まれるかで判定する。


NFAの初期集合I、受理集合F、文字遷移δ(v,c)を定義し、ε-closure(A)をε辺だけでAから到達する全状態とする。DFA初期状態はε-closure(I)。集合Aの文字cによる遷移は `ε-closure(∪_{v∈A}δ(v,c))`、受理条件はA∩F≠∅。空集合も遷移先として作り、以後全文字で空集合に留まる。

初期集合をqueueへ入れ、未処理集合から全文字の遷移を計算し、既知集合ならそのID、未知なら新IDを割り当ててqueueへ追加する。元状態が少数なら集合をbitmaskで表せる。prefix長の帰納法で、Aがそのprefixを読んで到達し得るNFA状態のちょうど全体になるので受理言語を保存する。ε閉包は初期状態と文字を読むたびの両方に必要である。

## 成立条件と計算量

元の状態数sに対し部分集合は最大2^s個。到達する集合だけ生成しても最悪指数であり、少数状態や実際の到達集合が小さい条件が必要。ε遷移があれば閉包を取る。各集合遷移の計算費用も別に数える。

概念上の親: [禁止・要求patternを有限状態へ圧縮する](/learn/string/string-automata/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。

このUnitを直接前提とする単元: なし。

有限状態automatonの構成で得た考え方と実装を再利用し、非決定性automatonのsubset constructionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 非決定性automatonのsubset constructionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)（同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-automaton-subset-construction`
