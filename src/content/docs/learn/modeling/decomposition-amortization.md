---
title: "軽重分類と償却解析で総仕事量を抑える"
description: "「軽重分類と償却解析で総仕事量を抑える」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 20
---

# 軽重分類と償却解析で総仕事量を抑える

導入対象の目安: **水色（1200–1599）**。一操作の最悪時間から離れ、総仕事量と軽重分類で計算量を設計する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

各操作ではなく操作列全体の変化回数を数え、軽重分類や一度限りの移動で総計算量を抑える。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 探索空間を分けて候補を列挙・照合するmeet-in-the-middleや分割統治。

## 下位単元

- [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/) — 水色
- [small-to-large・DSU on Tree](/learn/modeling/small-to-large/) — 青色
- [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g)
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f)
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f)
- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g)
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g)
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f)
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g)
- [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e)
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g)

## 根拠

- [ABC217 E 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC217 E 公式解説](https://atcoder.jp/contests/abc217/editorial/2577)
- [ABC219 G 公式解説](https://atcoder.jp/contests/abc219/editorial/2653)
- [ABC219 G 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_g)
- [ABC255 H 公式解説](https://atcoder.jp/contests/abc255/editorial/4103)
- [ABC255 H 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-decomposition-amortization`
