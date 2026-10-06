---
title: "ABC469 F — GCD Maximum Spanning Tree"
draft: true
authoringUnit: {"problemId":"abc469-f","docPath":"src/content/docs/problems/updates/abc469-f.md","learningOutcomeIds":["outcome-construct-optimal-spanning-tree","outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-spanning-tree-optimization","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc469-f-problem-8a1921fe308d2127bb288d93ec5581f351870427d841174dd497dba7781d935d","source-abc469-editorial-23761-2d75eb28b42ad51f716796342df54f9ea49c2dcb94a081b25821ddd8d3e931d7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"重みがgより大きい全辺の連結成分は、gの処理前にDSUへ反映されている。gの倍数集合の頂点が異なるDSU成分にある場合、その間の辺重みはg以上で、gより大きい可能性は既処理性により除かれる。従って降順Kruskalと同じ成分併合を安全に行い、最大重み全域木を得る。","sourceRevisionIds":["source-abc469-f-problem-8a1921fe308d2127bb288d93ec5581f351870427d841174dd497dba7781d935d","source-abc469-editorial-23761-2d75eb28b42ad51f716796342df54f9ea49c2dcb94a081b25821ddd8d3e931d7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md)

- cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。
- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

先に読む単元:

- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

## 考察

完全グラフの辺を全列挙するKruskalは O(N²)。辺重みgcdには『gの倍数同士は少なくともgで結ばれる』という集合構造がある。Aの最大値をVとし、g=V,…,1を降順に走査する。値から頂点への逆引き表を用意し、g,2g,…のうちAにあるものを列挙する。

その頂点を一つの代表に順に併合し、DSUで異なる成分を結ぶたび答えへgを加える。列挙集合を完全グラフとして辺を作る必要はなく、一つの代表へ星状に結べばその集合の成分を全てつなげられる。

重要なのは、gの倍数同士のgcdが必ずgとは限らない点。もしgcdがgより大きければ、その値の段階で二頂点は既に連結済みである。今新しく併合される二成分を結ぶ辺は、重みgとして扱ってよい。g=1まで進めれば全頂点が結ばれ、成功する併合はちょうどN−1回。

## 典型の発動条件

暗黙完全グラフの辺を重みの閾値でまとめる。約数の倍数集合を降順に処理し、辺ではなく連結成分の変化だけを追う。

## 問題固有の要素

Aが相異なるので値から頂点を一つへ逆引きできる。gcdがgを超える組は既に併合済みという不変条件が鍵。

## 正当性

重みがgより大きい全辺の連結成分は、gの処理前にDSUへ反映されている。gの倍数集合の頂点が異なるDSU成分にある場合、その間の辺重みはg以上で、gより大きい可能性は既処理性により除かれる。従って降順Kruskalと同じ成分併合を安全に行い、最大重み全域木を得る。

## 実装上の注意

総重みは64 bit整数。各gで最初に見つかった頂点を代表にし、同じ成分への併合は加算しない。

## 復習の核

『この閾値より重い辺は全て処理済み』をDSUの不変条件として説明する。倍数走査の計算量は調和級数で評価する。

## 計算量と制約

### 時間

倍数走査はΣ_{g≤V}floor(V/g)=O(V log V)。DSUを含め O((N+V log V)α(N))。

### 空間

逆引き表 O(V)、DSU O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_1 \lt A_2 \lt \dots \lt A_N \leq 10^6; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc469/tasks/abc469_f)
- [公式解説](https://atcoder.jp/contests/abc469/editorial/23761)
