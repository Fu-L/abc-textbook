---
title: "cycle space・fundamental cycle basis"
description: "「cycle space・fundamental cycle basis」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 119
---

# cycle space・fundamental cycle basis

習得対象の目安: **青色（1600–1999）**。非木辺と基本cycleを対応させ、偶数次数の辺集合をF₂上の基底で表し、辺ラベルによるcycle空間の線形像をXOR spanへ移す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### cycle space・fundamental cycle basis

無向graphで全頂点が偶数次数となる辺集合をF_2上のcycle space C(G)として扱い、連結成分数C、spanning forest F、各non-tree edge eが作る唯一のcycleからfundamental cycle basisとdim C(G)=M-N+Cを導く。連結graphではC=1なのでM-N+1となる。

### 習得する技能

- spanning treeのroot-to-vertex XOR potentialで辺ラベルをfundamental cycleのXORへ変換し、cycle spaceの線形像が非木辺ごとのcycle XORのspanと一致することを示して、walkへ挿入できるXOR値をbasisで表せる。
- 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。

## 考え方

無向辺の部分集合をF₂ベクトルと見なし、各頂点の次数偶奇が0となる集合がcycle spaceになる。全域森の非木辺ごとに作るfundamental cycleは独立で、全cycle集合を張る。

### graph全体の辺集合の基底

全域森Fの各非木辺eに、eとF内の両端pathからなるcycle
C_eを対応させる。C_eは自分の非木辺だけを持つため、非空の基底部分集合のXORが0になることはなく独立である。任意の偶次数辺集合Zについて、Zにある非木辺ごとにC_eをXORすると非木辺が全て消える。残った森内の非空辺集合には葉の奇次数が必ずあるので、偶次数を保つ残りは空である。従って全Zを張り、非木辺数E−V+Cが次元になる。これは全成分にまたがる辺集合についての主張である。

### 一つのwalkが利用できる成分を固定する

始点sと終点tを含む連結成分をH、その全域木をT_Hとする。別成分ならs→t
walkは存在しない。Hの根からの木辺ラベルXORをp[v]とし、**H内の非木辺だけ**について
`c_e=p[u] XOR label(e) XOR p[v]`
を作る。これらが張るラベル部分空間をB_Hとすると、実現可能なwalkのXOR値全体は `p[s] XOR p[t] XOR B_H`
である。

必要性は辺ラベルを `label'(u,v)=p[u] XOR label(u,v) XOR p[v]`
へ置き換えて示せる。walkの途中のpは二回ずつ現れて消え、木辺のlabel'は0、非木辺のlabel'はc_eなので、値は上の形になる。walkはHから出られないため、別成分のc_eは現れない。

十分性では、選んだ各fundamental
cycleの頂点までsからT_H上を進み、cycleを一周し、同じ木pathを逆向きに戻る。その寄り道の木辺は二回通って消え、c_eだけが加わる。必要なcycleについて繰り返してからT_Hのs→t
pathを進めれば、B_Hの任意結合を実現できる。この証明は無向辺を往復できることを使う。

例えばHがラベル1のs−t辺だけならB_H={0}で、walkの値は1だけである。別成分にcycle
XORが1の三角形があってもHからは訪問できず、値0のwalkを作れない。複数成分を処理する実装はcomponent
IDごとにXOR基底を分け、queryの両端のID一致を先に確認する。

### 単純pathの個数とラベルの自由度を区別する

単純path
Pの辺集合を固定P0とXORする写像はC(H)への単射だが全射とは限らない。Hの頂点数V_H・辺数E_Hならpath数の上界は
`2^(E_H−V_H+1)`。graph全体の `2^(E−V+C)`
も上界ではあるが、別成分のcycleを足した分だけ緩くなる。辺集合のcycle基底が独立でも、ラベルへ写したc_eは0や同じ値になり得るため、ラベル基底のrankはE_H−V_H+1以下である。単純pathの計数とwalkのXOR最小化で使う空間を取り違えない。

## 成立条件と計算量

V頂点E辺C成分なら辺集合のcycle spaceの次元はE−V+C。DFS/BFSで全域森・component
ID・pをO(V+E)で作れば、各非木辺のcycle
XORはO(1)。W-bitラベルの成分別基底構築はO(V+EW)、保持する基底は一成分高々W本である。coset最小化の消去手順は[XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)で扱う。辺の再利用を許す無向walkについての等式であり、単純pathや有向walkへ任意のcycle挿入を認めない。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)。

無向graphを探索してspanning forestを構築できることを土台に、偶数次数辺集合をF_2上のcycle spaceとして捉え、fundamental cycle basisとdim C(G)=M-N+C（Cは連結成分数）を導く。さらに辺labelによる線形写像を通してcycle XORのspanを作り、path族の上界やwalk XORの自由度へ接続する。

### このUnitでは扱わないもの

- ord/lowを用いた橋・関節点の検出、および偶数次数辺集合のcycle-space構造を使わない単なるcycle検出。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)（terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)（無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)（再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。）。
- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（XOR部分空間の基底をpivot bitごとにreduced formへ整え、高位bitから基底を加減してaffine cosetの最小整数代表を一意に得る。正規化写像の線形性を示し、二値のXOR最小化を各値の正規化へ分離できる。）。既習技能: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)（spanning treeのroot-to-vertex XOR potentialで辺ラベルをfundamental cycleのXORへ変換し、cycle spaceの線形像が非木辺ごとのcycle XORのspanと一致することを示して、walkへ挿入できるXOR値をbasisで表せる。） / [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。

## 根拠

- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)
- [ABC451 G 公式解説](https://atcoder.jp/contests/abc451/editorial/18047)
- [ABC451 G 公式問題文](https://atcoder.jp/contests/abc451/tasks/abc451_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-cycle-space-basis`
