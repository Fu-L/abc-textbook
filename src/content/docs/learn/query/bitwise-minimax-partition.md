---
title: "上位bitの支配関係によるXOR minimax"
description: "「上位bitの支配関係によるXOR minimax」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 55
---

# 上位bitの支配関係によるXOR minimax

習得対象の目安: **青色（1600–1999）**。上位bitが最大値を支配することを使い、二群への再帰とminimaxを導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 上位bitの支配関係によるXOR minimax

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。

### 習得する技能

- 最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 上位bitの支配関係によるXOR minimaxの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f) — 主題: [上位bitの支配関係によるXOR minimax](/learn/query/bitwise-minimax-partition/)（最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC281 F 公式解説](https://atcoder.jp/contests/abc281/editorial/5367)
- [ABC281 F 公式問題文](https://atcoder.jp/contests/abc281/tasks/abc281_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-bitwise-minimax-partition`
