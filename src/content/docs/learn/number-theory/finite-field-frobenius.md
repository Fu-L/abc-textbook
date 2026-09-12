---
title: "標数pのFrobenius恒等式による反復高速化"
description: "標数pのFrobenius恒等式による反復高速化の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 178
---

# 標数pのFrobenius恒等式による反復高速化

## 概要

### 標数pのFrobenius恒等式による反復高速化

標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。

シフトをSとすれば一行上がる操作はI+Sであり、標数7で(I+S)^(7^t)=I+S^(7^t)。有限体の元の軌道長を圧縮する話ではない。F7上ではa^7=aなので元のFrobeniusは恒等写像である。

ABC251 Exでは大きい7冪から各幅を高々6回適用する。同じ幅qでの反復は元の境界の高々7種類のシフトを作るだけ。幅qの処理終了時のrun数はO(MN/q)とO(K+q)の両方で抑えられる。小さい方の上界を使えば全体O((√(MN)+K) log N)。単にRLEを使うだけでは高速性の証明にならない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 法上の四則演算・高速累乗・逆元。

法上の四則演算・高速累乗・逆元で得た考え方と実装を再利用し、標数pのFrobenius恒等式による反復高速化の発動条件・正当化・境界を重複なく学ぶ。

- 標数pのFrobenius恒等式による反復高速化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC251 H 公式解説](https://atcoder.jp/contests/abc251/editorial/3954)
- [ABC251 H 公式問題文](https://atcoder.jp/contests/abc251/tasks/abc251_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-finite-field-frobenius`
