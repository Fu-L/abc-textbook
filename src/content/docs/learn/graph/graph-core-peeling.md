---
title: "閉路数・次数構造からgraph coreとkernelを調べる"
description: "「閉路数・次数構造からgraph coreとkernelを調べる」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 114
---

# 閉路数・次数構造からgraph coreとkernelを調べる

導入対象の目安: **水色（1200–1599）**。辺数と頂点数から閉路数を読み、次数条件で残る核を取り出す入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

連結成分のcycle rankを辺数と頂点数から読み、必要なら低次数頂点を反復削除してcycle coreや小さなkernelを露出させる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- DFS時刻とlowlink値による橋・関節点の判定。

## 下位単元

- [単一サイクル成分とgraph core](/learn/graph/graph-core/) — 水色
- [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC226 E 公式問題文](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC226 E 公式解説](https://atcoder.jp/contests/abc226/editorial/2889)
- [ABC266 F 公式解説](https://atcoder.jp/contests/abc266/editorial/4698)
- [ABC266 F 公式問題文](https://atcoder.jp/contests/abc266/tasks/abc266_f)
- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `a83767c84a9cb372c1228a1849ba7ad25ea0b926c3443a52e846b4230fa86ee8` / LearningUnit `unit-graph-core-peeling`
