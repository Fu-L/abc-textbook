---
title: "ABC308-EX — Make Q"
draft: true
authoringUnit: {"problemId":"abc308-ex","docPath":"src/content/docs/problems/graph-search/outcome-find-rooted-cycle-by-shortest-path-branches/outcome-find-rooted-cycle-by-shortest-path-branches-shard-001/abc308-ex.md","learningOutcomeIds":["outcome-find-rooted-cycle-by-shortest-path-branches"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-shortest-path-reconstruction","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-shortest-path-certificate"],"sourceRevisionIds":["source-abc308-ex-problem-2caebe996c7978f9549dc514be071ce9e0f3dfb6b41e899d8f90fc9626c9d6e8","source-abc308-editorial-6709-2c67b0a55940a814375986537bb36bec6a17cf8be1df7d462270bb76ada5ad60"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"根を独立ラベル、他を根の第一枝で分ける。異ラベルの非木辺と二本の木上経路は、根以外で交わらず、根側の空経路も許して単純閉路を作る。任意の根を通る閉路を根から辿ると、最初の根の木辺で枝へ入った場合でも最後にはラベルaの根へ戻るので、異ラベルの非木辺が少なくとも一つある。その辺までの閉路の両側の道を最短木上経路に換えると重みは増えず、oracleの最小候補は最小根閉路に一致する。基準閉路の二つのa隣接辺以外は尻尾としてそのまま使え、競合する二辺は削除後oracleでそれぞれ全候補を覆う。dが閉路の別頂点にあっても余分な辺を削り真のQへ費用を増やさず変換できるため、緩和後の最小値は元の最適値に一致する。","sourceRevisionIds":["source-abc308-ex-problem-2caebe996c7978f9549dc514be071ce9e0f3dfb6b41e899d8f90fc9626c9d6e8","source-abc308-editorial-6709-2c67b0a55940a814375986537bb36bec6a17cf8be1df7d462270bb76ada5ad60"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 根からの最短路木で第一枝の異なる頂点を結ぶ辺を列挙し、二本の木上経路と合わせて根を通る最小閉路を求められる。

先に読む単元:

- [最短路を証明する木・経路の復元](src/content/docs/learn/graph/shortest-path-reconstruction.md) — 最短距離を計算できるようになった後、距離等式を満たす親辺を記録して最短路木・実現経路を復元する。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

Qの接続頂点a、閉路でaに隣接する二頂点b,c、尻尾のもう一端dを考える。まず閉路＋辺(a,d)でd≠b,cだけ要求する。dが閉路の他の頂点にあっても、(a,d)と閉路の片側を新しい閉路、もう一方のa側の最初の辺を尻尾にすれば、余分な辺を削って真のQにできる。正の重みなので費用は増えない。この局所条件への緩和により、aを固定して最小閉路を求める方針が立つ。

全単純閉路は指数個あり列挙できない。代わりにaからの最短路木を一つ作る。根にはlabel[a]=aという独立ラベルを付け、根の子vに属する部分木全体へlabel=vを付ける。親をpar[v]、距離をdist[v]とする。到達可能な端点を持つ辺(u,v)のうち、par[u]≠vかつpar[v]≠uという非木辺で、label[u]≠label[v]のものだけを候補にする。その値はdist[u]+w(u,v)+dist[v]。

異なる二枝の木上経路は根だけで交わる。片方が根の場合はその木上経路を長さ0と定義する。このため候補は根を通る単純閉路になる。根の独立ラベルだけを加えて木辺を除外しないと、根から子への辺を往復してしまう。一方、根を候補から外すと、同じ枝内を通って非木辺で根へ戻る閉路を落とす。辺a-b:1,b-c:1,a-c:100,a-d:1では、非木辺a-cがdist[c]+100=102という唯一のa閉路を返す。木辺a-bによる2は候補にならない。

最小候補の木上経路を親ポインタで復元し、aに隣接するb,cも得る。基準の最小閉路をC0とする。aに接続する辺(a,d)でd≠b,cならC0との和を評価する。残るd=b,cは、それぞれ辺(a,d)を一時的に除いて最小a閉路を求め直し、存在すればその費用にw(a,d)を足す。各aについて閉路oracleは高々3回でよい。

この分け方が全候補を覆う理由は、最適Qの尻尾端dが基準閉路のb,c以外なら、より安いC0を使えること、dがb,cなら元の最適閉路自体がその辺を使わない削除後グラフの候補になることにある。最後に全aの最小値を返し、候補がなければ−1とする。

## 典型の発動条件

### 最短路木から根を通る最小閉路を求める

発動条件: 正の重みを持つ単純無向グラフで、指定した根を含む最小閉路が必要なとき。

根は独立ラベル、他は第一枝でラベルを付ける。ラベルの異なる非木辺と二本の根への木上経路を合わせる。根に戻る非木辺を含め、木辺の往復は除く。

### 構成辺の役割による場合分け

発動条件: 同じ接続辺を閉路と追加辺で重複使用できないとき。

基準の最適構成と競合する少数の辺だけを削除し、追加側への使用を固定してoracleを解き直す。

## 問題固有の要素

tail endpoint dがcycleの別vertexでも、そこまでのcycle arcを消せばcostを増やさず真のQへ縮められるためdがcycle外という条件をd≠b,cへ緩和できる。

別の問題へ持ち帰る視点: subgraph形状制約は余分なcycle/path edgesを削除するnormalizationで局所条件へ弱められることがある。

## 正当性

根を独立ラベル、他を根の第一枝で分ける。異ラベルの非木辺と二本の木上経路は、根以外で交わらず、根側の空経路も許して単純閉路を作る。任意の根を通る閉路を根から辿ると、最初の根の木辺で枝へ入った場合でも最後にはラベルaの根へ戻るので、異ラベルの非木辺が少なくとも一つある。その辺までの閉路の両側の道を最短木上経路に換えると重みは増えず、oracleの最小候補は最小根閉路に一致する。基準閉路の二つのa隣接辺以外は尻尾としてそのまま使え、競合する二辺は削除後oracleでそれぞれ全候補を覆う。dが閉路の別頂点にあっても余分な辺を削り真のQへ費用を増やさず変換できるため、緩和後の最小値は元の最適値に一致する。

## 実装上の注意

- 非木辺の判定は最短路木の親情報で行う。削除した辺を距離計算と候補走査の両方から外す。
- 到達不能な頂点を走査から外す。根のラベルと距離0を初期化する。
- 最小閉路のa隣接頂点b,cを親ポインタから復元する。閉路または合法な尻尾がない場合は無限大とする。

## 復習の核

- 根を含む閉路のoracleでは、根の独立ラベルと非木辺の条件を一組で覚える。
- 基準の最適構成と競合する辺が少数なら、その辺だけ役割を固定してoracleを解き直す。

## 計算量と制約

### 時間

N 頂点のdense graph。各attachment rootの定数回cycle oracleをO(N²)で行い全体 O(N³)。

### 空間

隣接重み表 O(N²)、各rootの距離・branchラベル O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 4\leq N \leq 300; 4\leq M \leq \frac{N(N-1)}{2}; 1 \leq A_i < B_i \leq N; (A_i,B_i) \neq (A_j,B_j), if i \neq j.; 1 \leq C_i \leq 10^5; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/tasks/abc308_h) — source-abc308-ex-problem-2caebe996c7978f9549dc514be071ce9e0f3dfb6b41e899d8f90fc9626c9d6e8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/editorial/6709) — source-abc308-editorial-6709-2c67b0a55940a814375986537bb36bec6a17cf8be1df7d462270bb76ada5ad60
