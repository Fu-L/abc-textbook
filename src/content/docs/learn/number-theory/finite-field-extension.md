---
title: "拡大有限体の表現と四則演算を構成する"
description: "「拡大有限体の表現と四則演算を構成する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 179
---

# 拡大有限体の表現と四則演算を構成する

習得対象の目安: **橙色（2400–2799）**。既約多項式や基底座標から有限体を構成し、四則演算の実装を正当化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第189単元。技能の説明を学んでから問題一覧へ進んでください。

前: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/) ／ 次: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)

## 概要

### 拡大有限体の表現と演算

素体上の多項式剰余または基底座標で有限体の元を表し、標準化された加減乗除を構成する。

### 習得する技能

- 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

素体上の演算を土台に、既約関係で元を標準化し、加減乗除が閉じる拡大体として扱う。

### このUnitでは扱わないもの

- 素数法上の通常の四則演算だけで閉じる計算、および環上で逆元の存在を仮定できない演算。

## 問題一覧

1. [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h) — 主題: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。 拡大体・畳み込み・等比点評価を既習として接続する。拡大体で数列の一般項を指数の式へ変換し、周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。

## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC381 G 公式解説](https://atcoder.jp/contests/abc381/editorial/11378)
- [ABC381 G 公式問題文](https://atcoder.jp/contests/abc381/tasks/abc381_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-finite-field-extension`
