---
title: "一次合同・CRTで解の類を統合する"
description: "「一次合同・CRTで解の類を統合する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 168
---

# 一次合同・CRTで解の類を統合する

習得対象の目安: **青色（1600–1999）**。一次合同の可解条件を確認し、非互いに素な法も含めてCRTで統合する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第22単元。技能の説明を学んでから問題一覧へ進んでください。

前: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/) ／ 次: [DAGのtopological processing](/learn/graph/dag-topological-processing/)

## 概要

### 一次合同・CRT

一次合同のgcd可解性を判定し、互いに素でない法も含めて複数の剰余類を一つへ統合する。

### 習得する技能

- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)、[法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

法上の演算とBézout等式を使えることを前提に、一次合同の可解性を判定して複数条件をCRTで統合する。

### このUnitでは扱わないもの

- 可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。

## 問題一覧

1. [ABC460 E「x + y ≡ x + y」](https://atcoder.jp/contests/abc460/tasks/abc460_e) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 / 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。
- [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

## 根拠

- [ABC245 H 公式解説](https://atcoder.jp/contests/abc245/editorial/3636)
- [ABC245 H 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC286 F 公式解説](https://atcoder.jp/contests/abc286/editorial/5588)
- [ABC286 F 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC371 G 公式解説](https://atcoder.jp/contests/abc371/editorial/10927)
- [ABC371 G 公式問題文](https://atcoder.jp/contests/abc371/tasks/abc371_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-modular-congruence`
