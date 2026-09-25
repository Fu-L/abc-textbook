---
title: "剰余周期と指数法則を利用する"
description: "「剰余周期と指数法則を利用する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 169
---

# 剰余周期と指数法則を利用する

習得対象の目安: **青色（1600–1999）**。Fermat・Euler型の指数簡約で必要な互いに素条件と周期を確認する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第86単元。技能の説明を学んでから問題一覧へ進んでください。

前: [monoid exponentiation・連結演算doubling](/learn/combinatorics-algebra/monoid-exponentiation/) ／ 次: [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/)

## 概要

### 剰余周期・指数法則

有限剰余状態の周期またはFermat/Euler型指数簡約を示し、巨大な反復やtower exponentを短縮する。

### 習得する技能

- 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

剰余列や冪が有限状態で周期化することを示し、周期前計算や指数法則で巨大な反復を短縮する。

### このUnitでは扱わないもの

- 逆元・一次合同・CRTによる合同条件の統合、および巡回群の位数を使う計数。

## 問題一覧

1. [ABC319 E「Bus Stops」](https://atcoder.jp/contests/abc319/tasks/abc319_e) — 主題: [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)。
2. [ABC228 E「Integer Sequence Fair」](https://atcoder.jp/contests/abc228/tasks/abc228_e) — 主題: [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)。
3. [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 二部matchingを既習として、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。周期的な候補時刻の圧縮とmatchingによる可否を組み合わせ、単調な判定を二分探索へ接続する。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。

## 根拠

- [ABC228 E 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_e)
- [ABC228 E 公式解説](https://atcoder.jp/contests/abc228/editorial/2932)
- [ABC286 F 公式解説](https://atcoder.jp/contests/abc286/editorial/5588)
- [ABC286 F 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC319 E 公式問題文](https://atcoder.jp/contests/abc319/tasks/abc319_e)
- [ABC319 E 公式解説](https://atcoder.jp/contests/abc319/editorial/7100)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-modular-periodicity`
