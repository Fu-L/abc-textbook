---
title: "大小関係をCartesian treeへ変換する"
description: "「大小関係をCartesian treeへ変換する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 34
---

# 大小関係をCartesian treeへ変換する

習得対象の目安: **青色（1600–1999）**。単調stackから木を構築し、区間極値と再帰分割が同じ構造になることを使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Cartesian treeによる区間極値分解

配列順と値のheap順を同時に保つ木を構成し、区間極値を根とする再帰分割へ変換する。

### 習得する技能

- 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。

このUnitを直接前提とする単元: なし。

単調stackの支配関係を親子関係へ持ち上げ、配列の区間極値を部分木境界として分割処理へ使う。

### このUnitでは扱わないもの

- 最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。

## 問題一覧

- [ABC420 F「kirinuki」](https://atcoder.jp/contests/abc420/tasks/abc420_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC420 F 公式解説](https://atcoder.jp/contests/abc420/editorial/13741)
- [ABC420 F 公式問題文](https://atcoder.jp/contests/abc420/tasks/abc420_f)
- [ABC435 F 公式解説](https://atcoder.jp/contests/abc435/editorial/14734)
- [ABC435 F 公式問題文](https://atcoder.jp/contests/abc435/tasks/abc435_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `33e4c8113deec1ccee9b61a9379e197530cbd5a6fb918e3b477bf71e2a2003da` / LearningUnit `unit-cartesian-tree`
