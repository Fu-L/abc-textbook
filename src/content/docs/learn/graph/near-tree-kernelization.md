---
title: "near-tree graphのkernel化"
description: "「near-tree graphのkernel化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 118
---

# near-tree graphのkernel化

習得対象の目安: **黄色（2000–2399）**。葉と次数2のchainを答えを保って縮約し、余分な辺数で残るサイズを界する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### near-tree graphのkernel化

terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。

### 習得する技能

- terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)、[単一サイクル成分とgraph core](/learn/graph/graph-core/)。

このUnitを直接前提とする単元: なし。

cycle space・fundamental cycle basis・単一サイクル成分とgraph coreで得た考え方と実装を再利用し、near-tree graphのkernel化の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- near-tree graphのkernel化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)（terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)（無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)（再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-near-tree-kernelization`
