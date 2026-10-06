---
title: "上位bitの支配関係によるXOR minimax"
description: "「上位bitの支配関係によるXOR minimax」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 52
---

# 上位bitの支配関係によるXOR minimax

習得対象の目安: **青色（1600–1999）**。上位bitが最大値を支配することを使い、二群への再帰とminimaxを導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 上位bitの支配関係によるXOR minimax

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。

### 習得する技能

- 最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

max_i(x XOR a_i)を最小化するには、最上位の未確定bitで値集合を二分する。両側があれば最大値にそのbitが立ち、xの選択に応じた片側の下位問題へ進む。


下位b+1 bitでの最適値をF(C,b)とし、F(C,−1)=0。bit bで分けたC0,C1の一方だけが非空なら、maskのそのbitを同じ値にして `F=F(非空側,b−1)`。両方非空なら `F=2^b+min(F(C0,b−1),F(C1,b−1))`。maskのbitを1にするとC0が最大側、0にするとC1が最大側になる。最大側の値は必ず2^b以上、他方は2^b未満なので、他方の下位bitを最適化へ混ぜない。小さい再帰値を選んだ側とbitを記録すればmaskも復元できる。同じ深さでは各入力値が一群だけに属すので総走査O(NB)となる。

## 成立条件と計算量

Trieやbit再帰でO(NB)の典型になる。全値が同じ側なら上位bitを消して進める。目的が最大値であることが再帰式の根拠で、XOR和や任意のmatchingへ同じ式を適用しない。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 上位bitの支配関係によるXOR minimaxの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f) — 主題: [上位bitの支配関係によるXOR minimax](/learn/query/bitwise-minimax-partition/)（最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC281 F 公式解説](https://atcoder.jp/contests/abc281/editorial/5367)
- [ABC281 F 公式問題文](https://atcoder.jp/contests/abc281/tasks/abc281_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-bitwise-minimax-partition`
