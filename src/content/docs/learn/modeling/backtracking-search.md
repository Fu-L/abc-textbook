---
title: "backtracking・可逆な探索状態"
description: "「backtracking・可逆な探索状態」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 5
---

# backtracking・可逆な探索状態

習得対象の目安: **緑色（800–1199）**。再帰と訪問済み管理を使い、選択と取り消しが対応する探索を実装する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### backtracking・可逆な探索状態

再帰へ入る直前に局所選択を反映し、復帰時に必ずundoして現在pathだけの制約を保ちながら探索木を列挙する。

### 習得する技能

- 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

再帰へ入る直前に局所選択を反映し、復帰時に必ずundoして現在pathだけの制約を保ちながら探索木を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- backtracking・可逆な探索状態の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC284 E「Count Simple Paths」](https://atcoder.jp/contests/abc284/tasks/abc284_e) — 主題: [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)（再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)（terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)（無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)（再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。）。

## 根拠

- [ABC284 E 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_e)
- [ABC284 E 公式解説](https://atcoder.jp/contests/abc284/editorial/5494)
- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-backtracking-search`
