---
title: "二部彩色と成分構造を扱う"
description: "二部彩色と成分構造を扱うの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 31
---

# 二部彩色と成分構造を扱う

## 概要

### 二部グラフの彩色と成分構造

無向グラフを二色に塗れる条件を探索で検証し、各連結成分の二部サイズ・反転対称性を集約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

無向グラフを探索できることを前提に、辺をまたぐたび色を反転し、矛盾検出と成分ごとの二部サイズ集約を行う。

- 重み付き最短路、一般の彩色問題、および容量付きmatching・min-cutの最適化。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g)
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g)
- [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g)
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f)
- [ABC454 E「LRUD Moving」](https://atcoder.jp/contests/abc454/tasks/abc454_e)

## 根拠

- [ABC327 G 公式解説](https://atcoder.jp/contests/abc327/editorial/7557)
- [ABC327 G 公式問題文](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC398 E 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC398 G 公式解説](https://atcoder.jp/contests/abc398/editorial/12480)
- [ABC398 E 公式解説](https://atcoder.jp/contests/abc398/editorial/12483)
- [ABC398 G 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-bipartite-structure`
