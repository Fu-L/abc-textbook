---
title: "XOR線形基底"
description: "「XOR線形基底」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 197
---

# XOR線形基底

習得対象の目安: **青色（1600–1999）**。bit列をF₂ベクトルと見なし、pivotによる消去で独立性と表現可能性を管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### XOR線形基底

整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。

### 習得する技能

- 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC249 G「Xor Cards」](https://atcoder.jp/contests/abc249/tasks/abc249_g) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC283 G「Partial Xor Enumeration」](https://atcoder.jp/contests/abc283/tasks/abc283_g) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC223 H「Xor Query」](https://atcoder.jp/contests/abc223/tasks/abc223_h) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f) — 主題: [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)（独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g) — 主題: [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。既習技能: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC223 H 公式解説](https://atcoder.jp/contests/abc223/editorial/2784)
- [ABC223 H 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_h)
- [ABC236 F 公式解説](https://atcoder.jp/contests/abc236/editorial/3287)
- [ABC236 F 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_f)
- [ABC249 G 公式解説](https://atcoder.jp/contests/abc249/editorial/3791)
- [ABC249 G 公式問題文](https://atcoder.jp/contests/abc249/tasks/abc249_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-xor-linear-basis`
