---
title: "静的graph等式制約のpotential伝播"
description: "「静的graph等式制約のpotential伝播」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 106
---

# 静的graph等式制約のpotential伝播

習得対象の目安: **水色（1200–1599）**。辺の差やXORを伝播し、閉路の整合性と成分ごとの自由度を確認する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第38単元。技能の説明を学んでから問題一覧へ進んでください。

前: [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/) ／ 次: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)

## 概要

### 静的graph等式制約のpotential伝播

可逆な加法・XOR演算で x_v=x_u⊙w と書ける辺等式をDFS/BFSで伝播し、cycle整合性を検査して各連結成分の解をroot offset一つで表す。

### 習得する技能

- 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

通常のDFS・BFSを土台に、辺等式からroot-relative potentialを静的に伝播し、cycle整合性と成分offsetの自由度を分離する。

### このUnitでは扱わないもの

- 静的graph等式制約のpotential伝播の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
2. [ABC280 F「Pay or Receive」](https://atcoder.jp/contests/abc280/tasks/abc280_f) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。

## 根拠

- [ABC280 F 公式解説](https://atcoder.jp/contests/abc280/editorial/5303)
- [ABC280 F 公式問題文](https://atcoder.jp/contests/abc280/tasks/abc280_f)
- [ABC352 F 公式解説](https://atcoder.jp/contests/abc352/editorial/9924)
- [ABC352 F 公式問題文](https://atcoder.jp/contests/abc352/tasks/abc352_f)
- [ABC396 E 公式問題文](https://atcoder.jp/contests/abc396/tasks/abc396_e)
- [ABC396 E 公式解説](https://atcoder.jp/contests/abc396/editorial/12390)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-graph-potential-propagation`
