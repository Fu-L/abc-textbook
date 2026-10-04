---
title: "ABC334-G — Christmas Color Grid 2"
draft: true
authoringUnit: {"problemId":"abc334-g","docPath":"src/content/docs/problems/graph-search/outcome-identify-bridges-and-articulations/outcome-identify-bridges-and-articulations-shard-001/abc334-g.md","learningOutcomeIds":["outcome-identify-bridges-and-articulations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-state-graph-search"],"excludedTopics":["次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。"],"tagIds":["tag-lowlink-critical-structure","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc334-editorial-8980-3d87c1f6debe165775648233d1b40aee0cb40e57553b8350c6bc13fe79b54577","source-abc334-g-problem-de26773c3b0150fd9a0fea4e8edc637749a971c31cb9054fee55eb6ea37d6238"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非root削除ではlow[child]≥ord[v]の各子が親側から分離し、残る親側が一成分。rootは親側がなくDFS子数だけ。よって削除後成分数は C−1+parts(v)。この厳密値を全緑で平均すると期待値になる。孤立rootはparts=0。","sourceRevisionIds":["source-abc334-editorial-8980-3d87c1f6debe165775648233d1b40aee0cb40e57553b8350c6bc13fe79b54577","source-abc334-g-problem-de26773c3b0150fd9a0fea4e8edc637749a971c31cb9054fee55eb6ea37d6238"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [lowlinkで橋・関節点を特定する](src/content/docs/learn/graph/lowlink-critical-structure.md)

- DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。

先に読む単元:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 考察

緑cellを一つ削除したとき、その所属連結成分が何個へ分裂するかを全頂点について求めればよい。これはDFS木のordとlowから、削除頂点を通らず祖先側へ戻れない子subtreeを数えて判定できる。 非root頂点vではlow[w]≥ord[v]を満たすDFS子wごとに独立成分が一つ生じ、残りの親側がもう一成分なのでparts(v)=c+1である。DFS rootでは親側がなくparts(v)=子数cとなる。

採用する候補: 緑graph全体にlowlinkを行い、各頂点削除後のcomponent数を集計する

一回のDFSで全articulation効果を求め、全選択の期待値を線形時間で計算できる。

棄却する候補: 各緑cellを一つずつ消してBFSする

緑頂点数回の全graph探索となり、最大100万cellで実行できない。

非root頂点vではlow[w]≥ord[v]を満たすDFS子wごとに独立成分が一つ生じ、残りの親側がもう一成分なのでparts(v)=c+1である。DFS rootでは親側がなくparts(v)=子数cとなる。

gridの#を無向graphとして各未訪問頂点からDFSし、ord・lowと初期成分数Cを求める。同時に各vの分離子数cを数え、rootならparts=c、非rootならparts=c+1とする。削除後全体はC-1+parts(v)なので全緑vで平均する。

## 典型の発動条件

### lowlinkとarticulation point

発動条件: 全頂点について削除時の連結成分分裂数が必要である。

DFS子のlowと親のordを比較し、親を介さず外へ出られないsubtreeを数える。

### 非連結graphのcomponent補正

発動条件: 削除が影響するのは所属する一成分だけで、他成分は不変である。

初期Cから所属成分を1引き、削除後のparts(v)を足す。

## 問題固有の要素

articulationか否かのbooleanだけでなく、条件を満たす子subtree数を数えることで、削除後に何成分増えるかまで同じlowlink情報から得られる。

別の問題へ持ち帰る視点: lowlinkは切断点検出を、頂点削除後component数という定量値へ拡張できる。

## 正当性

非root削除ではlow[child]≥ord[v]の各子が親側から分離し、残る親側が一成分。rootは親側がなくDFS子数だけ。よって削除後成分数は C−1+parts(v)。この厳密値を全緑で平均すると期待値になる。孤立rootはparts=0。

## 実装上の注意

- parentへの木辺だけをback edgeとして使わず、grid graphでも再帰深度がHWになり得るためiterative DFSまたは十分なstackを検討する。孤立rootはparts=0になる。

## 復習の核

- 孤立緑cell、pathの中央、cycle、複数DFS成分、rootの子が0・1・複数の例で削除後BFSの成分数と比較する。

## 計算量と制約

### 時間

H×W盤面、緑頂点V、隣接E=O(V)。読込とlowlinkで O(HW)。

### 空間

盤面、DFS情報とstackで O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W \leq 1000; S_{i,j} = . or S_{i,j} = #.; There is at least one (i,j) such that S_{i,j} = #.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc334/editorial/8980) — source-abc334-editorial-8980-3d87c1f6debe165775648233d1b40aee0cb40e57553b8350c6bc13fe79b54577
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc334/tasks/abc334_g) — source-abc334-g-problem-de26773c3b0150fd9a0fea4e8edc637749a971c31cb9054fee55eb6ea37d6238
