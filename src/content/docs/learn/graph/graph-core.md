---
title: "単一サイクル成分とgraph core"
description: "「単一サイクル成分とgraph core」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 118
---

# 単一サイクル成分とgraph core

習得対象の目安: **水色（1200–1599）**。成分のE−V+1から閉路数を読み、必要なら葉を剥がして残るcoreを調べる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単一サイクル成分とgraph core

連結成分の辺数と頂点数からcycle rankを判定し、必要なら葉を反復削除してcycle coreと削除順を得る。

### 辺数から単一cycleを読む

連結成分の頂点数をV、辺数をEとするとcycle rankはE−V+1である。E=Vなら独立な閉路は一つで、葉を剥がすと唯一のcycleが残る。E<Vなら木、E>Vなら複数の独立な閉路を持つため、単一cycleを仮定した数え上げには使えない。

ABC226 Eでは各成分についてE=Vを確認する。木部分の辺の向きはcycleへ向かうように強制され、cycleの向きだけが二通りある。したがって成分数をCとして答えは2^C。葉刈りは構造を理解するための見方であり、この判定だけなら実装上は不要である。ABC266 Fでは実際に葉を剥がし、残ったcycleを使って問い合わせへ答える。

### 習得する技能

- 連結成分のE−V+1から独立な閉路数を判定し、E=Vなら唯一のcycleを持つことを示せる。必要なら次数1以下の頂点を反復削除し、残るcoreと削除順を求められる。

## 考え方

連結無向成分のcycle rankはE−V+1であり、E=Vなら独立cycleが一つになる。葉を除くとcycleが残り、cycle上と木枝上で経路の振る舞いを分けられる。

## 成立条件と計算量

成分の探索・葉刈りはO(V+E)。木はE=V−1で、複数cycleの成分へ単一cycleの議論を拡張しない。自己loopやparallel edgeを許すかでcycleの表現が変わるため入力条件を確認する。

概念上の親: [閉路数・次数構造からgraph coreを調べる](/learn/graph/graph-core-peeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)。

連結成分の辺数と頂点数からcycle rankを判定し、必要なら葉を反復削除してcycle coreと削除順を得る。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 単一サイクル成分とgraph coreの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC226 E「Just one」](https://atcoder.jp/contests/abc226/tasks/abc226_e) — 主題: [単一サイクル成分とgraph core](/learn/graph/graph-core/)（連結成分のE−V+1から独立な閉路数を判定し、E=Vなら唯一のcycleを持つことを示せる。必要なら次数1以下の頂点を反復削除し、残るcoreと削除順を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC266 F「Well-defined Path Queries on a Namori」](https://atcoder.jp/contests/abc266/tasks/abc266_f) — 主題: [単一サイクル成分とgraph core](/learn/graph/graph-core/)（連結成分のE−V+1から独立な閉路数を判定し、E=Vなら唯一のcycleを持つことを示せる。必要なら次数1以下の頂点を反復削除し、残るcoreと削除順を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC226 E 公式問題文](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC226 E 公式解説](https://atcoder.jp/contests/abc226/editorial/2889)
- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-graph-core`
