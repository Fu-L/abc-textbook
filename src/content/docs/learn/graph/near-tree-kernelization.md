---
title: "near-tree graphのkernel化"
description: "「near-tree graphのkernel化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 121
---

# near-tree graphのkernel化

習得対象の目安: **黄色（2000–2399）**。葉と次数2のchainを答えを保って縮約し、余分な辺数で残るサイズを界する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### near-tree graphのkernel化

terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。

### 習得する技能

- terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

全域森を選び、木からはみ出す非木辺の端点を重要頂点として残す。木の長い枝をpathの要約へ縮めると、cycleに関係する小さな核と木の部分を分離できる。

### s-t単純pathを保つ具体的な縮約

異なるterminal s,tを持つ連結無向graphを考える。terminalでない次数1以下の頂点をqueueで反復削除する。s-t単純pathがその葉へ入ると同じ辺で戻って頂点を再訪するため、どのpathも失わない。s,tが削除後に非連結なら答えは0。

残す集合を{s,t}と次数3以上の頂点にする。各残存辺IDを一度だけ辿り、残す頂点から出て次数2の頂点では入った辺以外へ進み、次の残す頂点までのchainを一本の辺へ置き換える。重みはchain長（または元の辺費用和）、復元用に元辺列を保存する。異なるchainの内部頂点は共有しないので、kernelの単純pathを展開する操作と元の単純pathの縮約は全単射である。平行chainは別の辺のまま残し、同じ頂点へ戻るchainは自己loopとなるが、s-t単純pathでは使わない。

cycle rankをk=E−V+1とすると、Σ_v(deg(v)−2)=2k−2。削除後の次数1頂点は高々s,tの二個なので、次数3以上の頂点は高々2k個、terminalを含むkernelは高々2k+2頂点となる。次数2の縮約はcycle rankを保ち、辺数もE'=V'−1+k≤3k+1。元graphのO(V+E)処理に、kernel上の探索費用を加える。距離以外の目的ではchainの選択肢を要約へ残せることを別に証明する。

非連結入力では、まずs,tのcomponent
IDを確認する。異なればpath数0、同じならその成分Hだけを縮約し、k=E_H−V_H+1を用いる。別成分のcycleはこのpathの候補にも核サイズの評価にも必要ない。s=tを許すモデルでは、頂点を再訪しない単純pathは長さ0の一本とするか、正長cycleを別に数えるかを先に定め、上の異なるterminalの証明へ混ぜない。

## 成立条件と計算量

独立cycle数kが小さいことが有効性の条件。核のサイズと核上の指数探索費用をkで評価し、木部分のO(V+E)処理を加える。縮約pathの距離・選択数など元問題に必要な属性を捨てない。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-near-tree-kernelization`
