---
title: "2-SAT・含意グラフ"
description: "「2-SAT・含意グラフ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 100
---

# 2-SAT・含意グラフ

習得対象の目安: **青色（1600–1999）**。二値制約を含意へ変換し、literalと否定のSCCから可解性と代入を得る。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 2-SAT・含意グラフ

二値選択のclauseを含意辺へ変換し、literalと否定literalのSCC関係から可解性と代入を得る。

### 習得する技能

- 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

このUnitを直接前提とする単元: なし。

SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、2-SAT・含意グラフの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 2-SAT・含意グラフの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC277 Ex「Constrained Sums」](https://atcoder.jp/contests/abc277/tasks/abc277_h) — 主題: [2-SAT・含意グラフ](/learn/graph/two-sat/)（整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC277 H 公式解説](https://atcoder.jp/contests/abc277/editorial/5207)
- [ABC277 H 公式問題文](https://atcoder.jp/contests/abc277/tasks/abc277_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-two-sat`
