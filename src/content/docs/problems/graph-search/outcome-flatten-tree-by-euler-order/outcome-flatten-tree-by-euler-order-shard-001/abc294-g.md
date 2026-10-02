---
title: "ABC294-G — Distance Queries on a Tree"
draft: true
authoringUnit: {"problemId":"abc294-g","docPath":"src/content/docs/problems/graph-search/outcome-flatten-tree-by-euler-order/outcome-flatten-tree-by-euler-order-shard-001/abc294-g.md","learningOutcomeIds":["outcome-flatten-tree-by-euler-order","outcome-answer-tree-ancestor-queries"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-tree-ancestor-lca","tag-tree-euler-flattening","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc294-editorial-5997-847c64675d80e9d32193370e0a6b21e728c34c9c50f83776ee22566d0a7df60f","source-abc294-g-problem-661d8ffe4b86fc3f1e1a04c47567707eab6336d64f74d84899b6fe898104e971"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"進入+w退出−wのEuler prefixはその時点の根path辺和。辺変更は二点の符号付き差分で全影響prefixを同時に修正する。dist(u,v)=rootDist(u)+rootDist(v)−2rootDist(LCA)は共通祖先pathを二重除去し目的pathだけ残す。","sourceRevisionIds":["source-abc294-editorial-5997-847c64675d80e9d32193370e0a6b21e728c34c9c50f83776ee22566d0a7df60f","source-abc294-g-problem-661d8ffe4b86fc3f1e1a04c47567707eab6336d64f74d84899b6fe898104e971"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Euler順による部分木区間化](src/content/docs/learn/tree/tree-euler-flattening.md)

- Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。
- binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

根から頂点への距離はEuler tourで辺を入る時+w、戻る時-wと置いたprefix和になり、辺更新は二点更新にできる。 d(u,v)=distRoot(u)+distRoot(v)-2distRoot(lca)により、動く重み情報と動かない祖先構造を分離できる。

採用する候補: Euler tour BITと静的LCA

木形は固定なのでLCAを前計算し、動的根距離だけをBITで更新して距離公式へ代入できる。

棄却する候補: 各更新後に全頂点距離を再計算

Q回のDFSでO(NQ)になる。

d(u,v)=distRoot(u)+distRoot(v)-2distRoot(lca)により、動く重み情報と動かない祖先構造を分離できる。

DFSで各辺の進入・退出時刻とLCA用tourを作る。重み変更はBITの+位置/-位置を差分更新し、距離質問は三頂点のprefix和とLCAから答える。

## 典型の発動条件

### Euler tour差分

発動条件: 部分木へ共通に効く辺重みを動的更新する。

進入+、退出-のprefix和で根距離を得る。

### LCA距離公式

発動条件: 木上二点距離を根距離へ分解する。

静的LCAと動的距離を結合する。

## 問題固有の要素

更新されるのは重みだけなので、祖先関係を静的前計算として切り離せる。

別の問題へ持ち帰る視点: 動的木距離は形と重みの役割を分離する。

## 正当性

進入+w退出−wのEuler prefixはその時点の根path辺和。辺変更は二点の符号付き差分で全影響prefixを同時に修正する。dist(u,v)=rootDist(u)+rootDist(v)−2rootDist(LCA)は共通祖先pathを二重除去し目的pathだけ残す。

## 実装上の注意

- 辺番号から子側と二つのtour位置を保存し、更新は新旧差分を符号逆で加える。

## 復習の核

- 小木で経路和と比較し、根隣接辺・同頂点・祖先子孫・同辺の反復更新を確認する。

## 計算量と制約

### 時間

N 頂点、Q 操作。EulerとLCA前計算 O(N log N)、辺更新と距離照会 O(log N)。

### 空間

木、Euler BIT、祖先表で O(N log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times10^5; 1\leq u _ i,v _ i\leq N\ (1\leq i\leq N-1); 1\leq w _ i\leq 10^9\ (1\leq i\leq N-1); The given graph is a tree.; 1\leq Q\leq 2\times10^5; For each query of the first kind, 1\leq i\leq N-1, and 1\leq w\leq 10^9.; 1\leq i\leq N-1, and; 1\leq w\leq 10^9.; For each query of the second kind, 1\leq u,v\leq N.; 1\leq u,v\leq N.; There is at least one query of the second kind.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc294/editorial/5997) — source-abc294-editorial-5997-847c64675d80e9d32193370e0a6b21e728c34c9c50f83776ee22566d0a7df60f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc294/tasks/abc294_g) — source-abc294-g-problem-661d8ffe4b86fc3f1e1a04c47567707eab6336d64f74d84899b6fe898104e971
