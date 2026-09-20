---
title: "二部彩色と成分構造を扱う"
description: "「二部彩色と成分構造を扱う」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 90
---

# 二部彩色と成分構造を扱う

習得対象の目安: **緑色（800–1199）**。探索で二色塗りと矛盾を判定し、成分ごとの反転対称性を数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 二部グラフの彩色と成分構造

無向グラフを二色に塗れる条件を探索で検証し、各連結成分の二部サイズ・反転対称性を集約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

無向グラフを探索できることを前提に、辺をまたぐたび色を反転し、矛盾検出と成分ごとの二部サイズ集約を行う。

### このUnitでは扱わないもの

- 重み付き最短路、一般の彩色問題、および容量付きmatching・min-cutの最適化。

## 問題一覧

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-bipartite-structure`
