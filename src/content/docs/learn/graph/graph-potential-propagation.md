---
title: "静的graph等式制約のpotential伝播"
description: "「静的graph等式制約のpotential伝播」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 105
---

# 静的graph等式制約のpotential伝播

習得対象の目安: **水色（1200–1599）**。辺の差やXORを伝播し、閉路の整合性と成分ごとの自由度を確認する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 静的graph等式制約のpotential伝播

可逆な加法・XOR演算で x_v=x_u⊙w と書ける辺等式をDFS/BFSで伝播し、cycle整合性を検査して各連結成分の解をroot offset一つで表す。

### 習得する技能

- 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

このUnitを直接前提とする単元: [potential・weighted DSU](/learn/graph/potential-dsu/)。

通常のDFS・BFSを土台に、辺等式からroot-relative potentialを静的に伝播し、cycle整合性と成分offsetの自由度を分離する。

### このUnitでは扱わないもの

- 静的graph等式制約のpotential伝播の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)（辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC280 F「Pay or Receive」](https://atcoder.jp/contests/abc280/tasks/abc280_f) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)（辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)（辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。）。

## 根拠

- [ABC280 F 公式解説](https://atcoder.jp/contests/abc280/editorial/5303)
- [ABC280 F 公式問題文](https://atcoder.jp/contests/abc280/tasks/abc280_f)
- [ABC352 F 公式解説](https://atcoder.jp/contests/abc352/editorial/9924)
- [ABC352 F 公式問題文](https://atcoder.jp/contests/abc352/tasks/abc352_f)
- [ABC396 E 公式問題文](https://atcoder.jp/contests/abc396/tasks/abc396_e)
- [ABC396 E 公式解説](https://atcoder.jp/contests/abc396/editorial/12390)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `92099379c10b1293bc646a527638868dd1efe0702c16fd1e83cad6f8052521cb` / LearningUnit `unit-graph-potential-propagation`
