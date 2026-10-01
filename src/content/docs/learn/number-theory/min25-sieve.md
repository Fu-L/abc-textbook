---
title: "Min_25・Lucy DP型の総和篩"
description: "「Min_25・Lucy DP型の総和篩」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 182
---

# Min_25・Lucy DP型の総和篩

習得対象の目安: **赤色（2800以上）**。商の異なる値を状態とする篩を構築し、乗法的関数の総和を高速に計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Min_25・Lucy DP型の総和篩

floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。

### 習得する技能

- floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

積性関数の総和を素数の寄与と最小素因数による分類へ分ける。N/iの相異なる値を索引にし、素数和の篩と素数冪の再帰を共有して1からNの直接列挙を避ける。

## 成立条件と計算量

圧縮表の空間はO(√N)が典型だが、時間は素数和の更新と再帰の双方から評価する。一般の積性関数へ同じ上界を置かない。f(p^e)の計算、重複を防ぐ最小素因数の順序、1の寄与を確認する。

素数和の段では、既に除いた素数より小さい因子を持たない数を商ごとに集計し、pを処理する差分をS(v/p)から求める。乗法的関数の段ではpの冪と、それより大きい素因数だけを持つ残りへ一意に分ける。通常本文の「N^(2/3)級」は本来の高速化を含む場合であり、Lucy DPと簡略版のO(N^(3/4)/log N)を同じ上界としない。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。

このUnitを直接前提とする単元: なし。

素因数・約数分解で得た考え方と実装を再利用し、Min_25・Lucy DP型の総和篩の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Min_25・Lucy DP型の総和篩の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC370 G「Divisible by 3」](https://atcoder.jp/contests/abc370/tasks/abc370_g) — 主題: [Min_25・Lucy DP型の総和篩](/learn/number-theory/min25-sieve/)（floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC370 G 公式解説](https://atcoder.jp/contests/abc370/editorial/10869)
- [ABC370 G 公式問題文](https://atcoder.jp/contests/abc370/tasks/abc370_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-min25-sieve`
