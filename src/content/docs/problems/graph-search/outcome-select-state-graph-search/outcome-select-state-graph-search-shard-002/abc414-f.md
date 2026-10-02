---
title: "ABC414-F — Jump Traveling"
draft: true
authoringUnit: {"problemId":"abc414-f","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc414-f.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc414-editorial-13439-06426077f4ac1f7611d8310107d8325328cb341b45aef3eb6ff0c5f6495a3df6","source-abc414-f-problem-29225b0da36f7b897e7b7bd84e8bac500cee8ae58044912e0baaf0317ecf04e0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"木の距離K移動はK辺のbacktrackなしpath。jump内は直前頂点禁止、境界では戻りも許すedge状態で正確に再現できる。同(v,k)の最初incomingはその逆以外全neighbor、第二が未展開の逆一本も覆うので第三以降は新遷移を改善しない。BFS距離/Kが最小jump数。","sourceRevisionIds":["source-abc414-editorial-13439-06426077f4ac1f7611d8310107d8325328cb341b45aef3eb6ff0c5f6495a3df6","source-abc414-f-problem-29225b0da36f7b897e7b7bd84e8bac500cee8ae58044912e0baaf0317ecf04e0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

treeで距離Kの一jumpは、K本のedgeからなるbacktrackなしのsimple pathである。jump境界では次のpathを自由に選べるため、直前edgeへ戻ることも許される。 有向edge(u,v)と現在jump内のstep kを状態にすれば通常BFSにできるが、vの高次数で全incoming×outgoingを遷移すると二次的に膨らむ。 k<Kでは同じjump内なのでw=uを禁止し、k=Kでは新jump開始なので全neighbor wを許す。この差だけでtree上の距離ちょうどKを正確に表現できる。 BFS距離を元tree上で進んだedge数として持つと、k=Kで頂点vへ着いた状態の距離はKの倍数で、最小jump回数はdistance/Kになる。

採用する候補: directed-edge×step状態をBFSし、各(v,k)へ到着した最初の二incomingだけを展開する

最初のincoming aはa以外の全outgoingを覆い、二番目のincoming bは未処理だったv→aも覆う。三番目以降に新しいoutgoingはなく、全体O(NK)。

棄却する候補: 距離Kの頂点pairを各頂点からBFS/DFSで列挙してjump graphを作る

K≤20でもstar状treeでは距離2のpairだけでΘ(N^2)本になり、jump graphを明示できない。

k<Kでは同じjump内なのでw=uを禁止し、k=Kでは新jump開始なので全neighbor wを許す。この差だけでtree上の距離ちょうどKを正確に表現できる。

BFS距離を元tree上で進んだedge数として持つと、k=Kで頂点vへ着いた状態の距離はKの倍数で、最小jump回数はdistance/Kになる。

頂点1から出る各有向edge状態k=1を距離1で初期化する。state(u,v,k)をpopし、k<Kならw≠uへk+1、k=Kなら全wへ1として緩和する。ただし各(v,nextK)で展開するincomingは先着2個までに制限する。各vのk=K状態の最小距離/Kを答える。

## 典型の発動条件

### edge-state BFS

発動条件: path内部で直前edgeへの即時backtrackを禁止し、一定長ごとに制約をresetするとき。

直前頂点u、現在v、segment内step kを状態にする。

### 高次数遷移の二回打ち切り

発動条件: 各incomingが除外するoutgoingがそのreverse一つだけのとき。

最初の二つの異なるincomingを処理すれば全outgoing緩和が網羅される。

### implicit graph shortest path

発動条件: 明示すると二次本になる固定距離jump edge上の最短路を求めるとき。

tree edgeをK段ずつ辿るstate graphをon-the-fly BFSする。

## 問題固有の要素

一jumpのsimple path制約は直前頂点だけで表せ、transitionの欠落辺がincomingごとに一つなので二到着で完全coverできる。

別の問題へ持ち帰る視点: 高次数頂点でincoming×outgoingが重いとき、各incomingが除外・追加する遷移差分の種類数が小さければ代表到着だけ処理する。

## 正当性

木の距離K移動はK辺のbacktrackなしpath。jump内は直前頂点禁止、境界では戻りも許すedge状態で正確に再現できる。同(v,k)の最初incomingはその逆以外全neighbor、第二が未展開の逆一本も覆うので第三以降は新遷移を改善しない。BFS距離/Kが最小jump数。

## 実装上の注意

- 同じ有向edge状態の最短距離だけを保持し、各(v,k)の到着元を区別して先着二つを数える。K=1では毎edgeがjump境界で、頂点1の答え0は出力対象外。

## 復習の核

- K=1、diameter<K、starでK=2、chainで往復jumpが必要な例を距離K pairを明示した小graph BFSと比較する。

## 計算量と制約

### 時間

N木頂点、jump距離K。edge向き×進行段状態 O(NK)、各(v,nextK)で二incomingまで展開し O(NK)。

### 空間

状態dist、queue、二incoming記録 O(NK)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 10^5; 2\leq N\leq 2\times 10^5; 1\leq K\leq 20; 1\leq u_i\lt v_i\leq N; The given graph is a tree.; The sum of N over all test cases is at most 2\times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc414/editorial/13439) — source-abc414-editorial-13439-06426077f4ac1f7611d8310107d8325328cb341b45aef3eb6ff0c5f6495a3df6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc414/tasks/abc414_f) — source-abc414-f-problem-29225b0da36f7b897e7b7bd84e8bac500cee8ae58044912e0baaf0317ecf04e0
