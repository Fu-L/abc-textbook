---
title: "閉路数・次数構造からgraph coreを調べる"
description: "「閉路数・次数構造からgraph coreを調べる」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 117
---

# 閉路数・次数構造からgraph coreを調べる

導入対象の目安: **水色（1200–1599）**。辺数と頂点数から閉路数を読み、次数条件で残る核を取り出す入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

連結成分のcycle rankを辺数と頂点数から読み、葉を反復削除してcycle coreを露出させる。cycle spaceと組み合わせたnear-tree kernel化は独立した節で学ぶ。

## 考え方

次数が閾値未満の頂点を反復して除き、残るk-coreを求める。除去される頂点は条件を満たす誘導部分graphに属せないため、順に捨てても最終coreを失わない。

## 成立条件と計算量

queueと次数更新でO(V+E)。coreが空か、連結か、cycle数はいくつかは別の性質。最大coreの存在判定と最大密度などの最適化を混同しない。葉刈りはk=2の代表的な場合になる。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- DFS時刻とlowlink値による橋・関節点の判定。

## 下位単元

- [単一サイクル成分とgraph core](/learn/graph/graph-core/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC226 E 公式問題文](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC226 E 公式解説](https://atcoder.jp/contests/abc226/editorial/2889)
- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-graph-core-peeling`
