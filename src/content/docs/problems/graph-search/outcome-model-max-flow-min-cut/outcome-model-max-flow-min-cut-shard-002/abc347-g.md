---
title: "ABC347-G — Grid Coloring 2"
draft: true
authoringUnit: {"problemId":"abc347-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-002/abc347-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc347-editorial-9671-6184ff3921feec0613e42dad5bf991b5cc0913ed7497d717d45c7bac68b7f22a","source-abc347-g-problem-4d7bd8e36b0ae6b211c6b2b1af886e1054c1707d1d6949b564f5cdd8e0720917"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"INF chainでtrue thresholdはprefixになりlabel1..5と一対一。固定labelの端threshold固定はexact値を強制する。隣接label差dのfinite crossing量は1+3+…+(2d−1)=d²なのでcut energyと目的平方和が一致し、mincutをlabelへ戻せば最適grid。","sourceRevisionIds":["source-abc347-editorial-9671-6184ff3921feec0613e42dad5bf991b5cc0913ed7497d717d45c7bac68b7f22a","source-abc347-g-problem-4d7bd8e36b0ae6b211c6b2b1af886e1054c1707d1d6949b564f5cdd8e0720917"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

最終値は0を残さず1へ変えてもcostが増えないため、各可変cellのlabelは1…5に限定できる。隣接cost(a-b)^2はordered labelに対するMonge関数で、threshold変数[cell value>k]を使うs-t min-cutへ表現できる。 label bはb>kが真となるthreshold k=1,…,b-1のprefixで一意に表せる。隣接x,yには同threshold間capacity 1と異thresholdl<k間capacity 2の両向きarcを張ると、cutへ1+3+…+(2|a-b|-1)=|a-b|²だけ寄与する。

採用する候補: 各cellを4個のthreshold nodeへ展開し、Monge pairwise costをmin-cutで最小化する

固定label制約と全隣接二次costを一つのsubmodular cut energyとして厳密に解き、cutからgridも復元できる。

棄却する候補: 0-cellの5^(個数)通りを全探索する

最大400可変cellで指数探索は不可能である。

label bはb>kが真となるthreshold k=1,…,b-1のprefixで一意に表せる。隣接x,yには同threshold間capacity 1と異thresholdl<k間capacity 2の両向きarcを張ると、cutへ1+3+…+(2|a-b|-1)=|a-b|²だけ寄与する。

cell xごとにnode x_{>1},…,x_{>4}を作り、x_{>k+1}→x_{>k}へINFを張る。固定A_x=aにはs→x_{>a-1}とx_{>a}→tの必要なINF arcでexact labelを強制する。各隣接cell pairの両方向に、同threshold capacity1とl<kのcross-threshold capacity2 arcを張る。max-flow後、source reachableなthreshold数+1をB_xとして出力する。

## 典型の発動条件

### multi-label graph cut

発動条件: orderedな有限labelとunary制約、pairwise Monge costのenergy最小化である。

labelをthreshold binary変数へ展開し、submodularな差分costをcut capacityで表す。

### threshold encoding

発動条件: 値1…dをbinary node d-1個で順序を保って表したい。

INF chainでtruth集合をprefixに限定し、source側node数からlabelを復号する。

## 問題固有の要素

平方差は奇数和d²=1+3+…+(2d-1)へ分解でき、その各増分がthreshold順序のcrossing arcとして実装される。

別の問題へ持ち帰る視点: convexなordered-label差costは離散一次差・二次差をthreshold cutへ配分できる。

## 正当性

INF chainでtrue thresholdはprefixになりlabel1..5と一対一。固定labelの端threshold固定はexact値を強制する。隣接label差dのfinite crossing量は1+3+…+(2d−1)=d²なのでcut energyと目的平方和が一致し、mincutをlabelへ戻せば最適grid。

## 実装上の注意

- INFは全有限cost上界より大きく取る。各undirected隣接pairで必要arcを両方向に張り、固定値1や5では存在しないthreshold端のconstraintを省く。

## 復習の核

- N=1、全固定、二cellの端label、0だけのgridを小規模5^z全探索し、cut costと復号Bの実costを比較する。

## 計算量と制約

### 時間

cell数C=N²、label数5。V=4C+2、隣接pairあたり定数arcでE=O(C)。一般Dinic O(C³)。

### 空間

networkと復号grid O(C)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq20; 0\leq A _ {i,j}\leq 5\ (1\leq i\leq N,1\leq j\leq N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc347/editorial/9671) — source-abc347-editorial-9671-6184ff3921feec0613e42dad5bf991b5cc0913ed7497d717d45c7bac68b7f22a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc347/tasks/abc347_g) — source-abc347-g-problem-4d7bd8e36b0ae6b211c6b2b1af886e1054c1707d1d6949b564f5cdd8e0720917
