---
title: "一次元凸・単峰最適化"
description: "「一次元凸・単峰最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 223
---

# 一次元凸・単峰最適化

習得対象の目安: **青色（1600–1999）**。単峰性や差分の単調性を証明し、三分探索・整数境界で最適点を求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第102単元。技能の説明を学んでから問題一覧へ進んでください。

前: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/) ／ 次: [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/)

## 概要

### 一次元凸・単峰最適化

差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。

### 習得する技能

- 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 一次元凸・単峰最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
2. [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
3. [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
4. [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
5. [ABC224 G「Roll or Increment」](https://atcoder.jp/contests/abc224/tasks/abc224_g) — 主題: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。
6. [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
7. [ABC314 Ex「Disk and Segments」](https://atcoder.jp/contests/abc314/tasks/abc314_h) — 主題: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
8. [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC224 G 公式解説](https://atcoder.jp/contests/abc224/editorial/2816)
- [ABC224 G 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_g)
- [ABC229 G 公式解説](https://atcoder.jp/contests/abc229/editorial/2963)
- [ABC229 G 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_g)
- [ABC240 F 公式解説](https://atcoder.jp/contests/abc240/editorial/3422)
- [ABC240 F 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-basic-convex-optimization`
