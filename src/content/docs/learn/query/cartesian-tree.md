---
title: "大小関係をCartesian treeへ変換する"
description: "「大小関係をCartesian treeへ変換する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 35
---

# 大小関係をCartesian treeへ変換する

習得対象の目安: **青色（1600–1999）**。単調stackから木を構築し、区間極値と再帰分割が同じ構造になることを使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第101単元。技能の説明を学んでから問題一覧へ進んでください。

前: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/) ／ 次: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)

## 概要

### Cartesian treeによる区間極値分解

配列順と値のheap順を同時に保つ木を構成し、区間極値を根とする再帰分割へ変換する。

### 習得する技能

- 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。

単調stackの支配関係を親子関係へ持ち上げ、配列の区間極値を部分木境界として分割処理へ使う。

### このUnitでは扱わないもの

- 最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。

## 問題一覧

1. [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
2. [ABC420 F「kirinuki」](https://atcoder.jp/contests/abc420/tasks/abc420_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC420 F 公式解説](https://atcoder.jp/contests/abc420/editorial/13741)
- [ABC420 F 公式問題文](https://atcoder.jp/contests/abc420/tasks/abc420_f)
- [ABC435 F 公式解説](https://atcoder.jp/contests/abc435/editorial/14734)
- [ABC435 F 公式問題文](https://atcoder.jp/contests/abc435/tasks/abc435_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-cartesian-tree`
