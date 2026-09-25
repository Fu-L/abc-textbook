---
title: "標数pのFrobenius恒等式による反復高速化"
description: "「標数pのFrobenius恒等式による反復高速化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 180
---

# 標数pのFrobenius恒等式による反復高速化

習得対象の目安: **橙色（2400–2799）**。標数による二項係数の消滅を演算子へ適用し、反復と圧縮列の増大を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 標数pのFrobenius恒等式による反復高速化

標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。

シフトをSとすれば一行上がる操作はI+Sであり、標数7で(I+S)^(7^t)=I+S^(7^t)。有限体の元の軌道長を圧縮する話ではない。F7上ではa^7=aなので元のFrobeniusは恒等写像である。

ABC251 Exでは大きい7冪から各幅を高々6回適用する。同じ幅qでの反復は元の境界の高々7種類のシフトを作るだけ。幅qの処理終了時のrun数はO(MN/q)とO(K+q)の両方で抑えられる。小さい方の上界を使えば全体O((√(MN)+K) log N)。単にRLEを使うだけでは高速性の証明にならない。

### 習得する技能

- 標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

このUnitを直接前提とする単元: なし。

法上の四則演算・高速累乗・逆元で得た考え方と実装を再利用し、標数pのFrobenius恒等式による反復高速化の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 標数pのFrobenius恒等式による反復高速化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h) — 主題: [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)（標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC251 H 公式解説](https://atcoder.jp/contests/abc251/editorial/3954)
- [ABC251 H 公式問題文](https://atcoder.jp/contests/abc251/tasks/abc251_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-finite-field-frobenius`
