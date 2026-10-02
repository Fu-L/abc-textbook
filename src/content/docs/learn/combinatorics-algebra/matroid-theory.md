---
title: "Matroidの独立性・greedy・線形交差"
description: "「Matroidの独立性・greedy・線形交差」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 200
---

# Matroidの独立性・greedy・線形交差

導入対象の目安: **黄色（2000–2399）**。独立性と交換公理を使い、貪欲法の成立範囲を整理する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

独立集合族と交換公理を共通言語にし、単一matroidの重み付き基底と、現corpusで観測された二つの線形matroidの共通rank判定を分けて学ぶ。

## 考え方

独立集合が部分集合で閉じ、より大きい独立集合から小さい独立集合へ要素を一つ足せる交換公理を満たすとmatroidになる。線形独立性や森はその代表例である。

## 成立条件と計算量

matroidであることの証明と独立性oracleの実装を分ける。二つの制約の共通部分が再びmatroidとは限らない。重み付き基底のgreedyやintersectionへ進む際は必要な公理とoracle費用を確認する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 線形方程式一般、graph matching一般、および交換公理を用いない単なる貪欲選択。

## 下位単元

- [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/) — 黄色
- [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/) — 赤色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC236 F 公式解説](https://atcoder.jp/contests/abc236/editorial/3287)
- [ABC236 F 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_f)
- [ABC399 G 公式解説](https://atcoder.jp/contests/abc399/editorial/12546)
- [ABC399 G 公式問題文](https://atcoder.jp/contests/abc399/tasks/abc399_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-matroid-theory`
