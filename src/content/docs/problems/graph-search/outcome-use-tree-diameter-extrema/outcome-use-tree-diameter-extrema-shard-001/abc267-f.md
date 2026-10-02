---
title: "ABC267-F — Exactly K Steps"
draft: true
authoringUnit: {"problemId":"abc267-f","docPath":"src/content/docs/problems/graph-search/outcome-use-tree-diameter-extrema/outcome-use-tree-diameter-extrema-shard-001/abc267-f.md","learningOutcomeIds":["outcome-use-tree-diameter-extrema"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-tree-ancestor-lca"],"excludedTopics":["根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。"],"tagIds":["tag-tree-metric-diameter","tag-tree-ancestor-lca"],"sourceRevisionIds":["source-abc267-f-problem-76fb2bc9fdf42512538d622b731b2dbcd57ef2398e2848449be7321573eebfd1","source-abc267-editorial-4714-1a42795ebf05b4ab26ae976d6e4b5d3cc9e2bfa9f8465c9136826534404a3fba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"任意uの最大距離は直径端a,bのいずれかで達成される。距離K点があれば少なくとも一端へのpath長≥KなのでそのpathのK歩点を返せる。a,b根DFSのancestor stackがpath上の所要点を正確に取得する。","sourceRevisionIds":["source-abc267-f-problem-76fb2bc9fdf42512538d622b731b2dbcd57ef2398e2848449be7321573eebfd1","source-abc267-editorial-4714-1a42795ebf05b4ab26ae976d6e4b5d3cc9e2bfa9f8465c9136826534404a3fba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md)

- 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md)

対象外:

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 考察

木の直径端点をL,Rとすると、任意の頂点uから最遠の頂点の一つはLまたはRである。 uから距離Kの頂点がどこかに存在すれば、uからLまたはRへのpathのうち長さK以上の方に、距離ちょうどKの頂点が必ずある。 root Xでuの深さがK以上なら、path stackの深さ depth(u)−K の頂点がuからX方向へK進んだ答えになる。

棄却する候補: 各queryでuからBFSし、距離Kの頂点を探す。

木全体の探索をQ回繰り返すことになる。

採用する候補: 直径端点L,Rをそれぞれ根にDFSし、root-to-current path stackからuのK個上の祖先をquery回答候補として二回調べる。

uから各端点へのpathは根付き木の祖先列であり、直径性により二本のどちらかを試せば存在する全queryを覆う。

root Xでuの深さがK以上なら、path stackの深さ depth(u)−K の頂点がuからX方向へK進んだ答えになる。

arbitrary-distance witness queryをdiameter endpoint coverで二つのlevel-ancestor queryへ帰着し、offline DFS stackで解く。

## 典型の発動条件

### 木の直径端点による最遠点cover

発動条件: 任意頂点から指定距離のwitnessを一つ求め、方向を全分岐へ探したくないとき。

直径両端への二本のpathだけを候補にし、いずれか十分長い方から頂点を取る。

### offline level ancestor

発動条件: 固定rootの木で、各頂点に付いた祖先深さqueryをまとめて答えるとき。

DFS中のroot-to-current pathをstackに保ち、対象深さを配列indexで参照する。

## 問題固有の要素

必要なのは任意の一頂点なので、uを中心とする距離K球全体を表現せず、直径方向の一つのwitnessへ限定できる。

別の問題へ持ち帰る視点: witness queryは全候補を列挙するより、必ず候補を含む少数のcanonical pathを探す。

## 正当性

任意uの最大距離は直径端a,bのいずれかで達成される。距離K点があれば少なくとも一端へのpath長≥KなのでそのpathのK歩点を返せる。a,b根DFSのancestor stackがpath上の所要点を正確に取得する。

## 実装上の注意

- 任意頂点から最遠点Lを求め、Lから最遠点Rを求める二回のDFS/BFSで直径端点を得る。
- 各queryを頂点uへ付け、L根の走査で未回答ならR根の走査を試し、両方でdepth<Kなら−1にする。

## 復習の核

- 木で指定距離の任意点を求める問題は、直径端点へのpathが全距離を代表できないか確認する。
- queryを先読みできるlevel ancestorはbinary liftingを作る前にDFS path stackで線形処理できるか検討する。

## 計算量と制約

### 時間

N頂点Q質問。直径探索O(N)、二root DFS stack回答O(N+Q)。

### 空間

木、質問list、depth stack O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_i \lt B_i \leq N \, (1 \leq i \leq N - 1); The given graph is a tree.; 1 \leq Q \leq 2 \times 10^5; 1 \leq U_i, K_i \leq N \, (1 \leq i \leq Q); All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/tasks/abc267_f) — source-abc267-f-problem-76fb2bc9fdf42512538d622b731b2dbcd57ef2398e2848449be7321573eebfd1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/editorial/4714) — source-abc267-editorial-4714-1a42795ebf05b4ab26ae976d6e4b5d3cc9e2bfa9f8465c9136826534404a3fba
