---
title: "ABC364-F — Range Connect MST"
draft: true
authoringUnit: {"problemId":"abc364-f","docPath":"src/content/docs/problems/graph-search/outcome-construct-optimal-spanning-tree/outcome-construct-optimal-spanning-tree-shard-001/abc364-f.md","learningOutcomeIds":["outcome-construct-optimal-spanning-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-dsu-components","unit-greedy-exchange","unit-ordered-set-multiset"],"excludedTopics":["任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。"],"tagIds":["tag-spanning-tree-optimization","tag-amortized-monotone-progress","tag-dsu-components","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc364-editorial-10546-c51091ade72495bd9fe6ab20dcbf6f4f99a7922c871c701a30491b72e74f62d1","source-abc364-f-problem-08a508ef61535ab30447a98aa4ed266a5477e4b9e098a2be3e353d049856cdc7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"重み順で補助頂点を接ぐと、基点への一辺は必須で、区間の既存成分をさらに接ぐ本数は未消去の隣接境界数に等しい。区間成分は連続で、この境界を消すことがKruskalの成分併合と一致する。境界は一度だけ消え、最後に全消去なら全元頂点と全補助頂点が連結。","sourceRevisionIds":["source-abc364-editorial-10546-c51091ade72495bd9fe6ab20dcbf6f4f99a7922c871c701a30491b72e74f62d1","source-abc364-f-problem-08a508ef61535ab30447a98aa4ed266a5477e4b9e098a2be3e353d049856cdc7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md)

- cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。

先に読む単元:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md) — 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md) — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 考察

query iは補助頂点N+iと区間[L_i,R_i]の全頂点を同じcost C_iで結ぶ。辺を明示すると総数がNQに達するが、Kruskalでは区間内の未連結な隣接境界だけが重要である。cost昇順に区間を処理すると、補助頂点をL_iへ結ぶ一辺は必ず採用でき、以降jへ必要な辺は元頂点j−1とjがまだ別成分かに一致する。区間[L,R]が消せる未接続境界数をkとすると、この補助頂点から採用する辺は基点への一辺を含むk+1本で、費用寄与は(k+1)Cである。最後に未接続境界が残ることと元頂点群全体が非連結であることが同値なので、その場合は−1となる。

採用する候補: 未接続の隣接境界indexをordered setで持ち、各区間内の境界を列挙・削除しながらKruskal費用を加える。

各境界は全処理を通して一度しか削除されず、暗黙の大量辺を必要な接続数へまとめられる。

棄却する候補: N+Q頂点間に区間内の全辺を生成して通常Kruskalを行う。

長い区間が多数あると辺数が入力サイズの積になり、生成もsortも不可能である。

queryをC昇順にsortし、setへ境界1..N−1を入れる。各(L,R,C)でlower_bound(L)からR未満の境界を順に取り出して削除し、その個数kに対して(k+1)Cを答えへ加える。全query後にsetが空なら答え、残れば−1を出力する。

## 典型の発動条件

### implicit graphのKruskal

発動条件: 規則的な大量辺が同一costで生成される最小全域木問題。

辺を列挙せず、そのcost段階で新たに結ぶcomponent境界だけを処理する。

### 削除型ordered set走査

発動条件: 多数の区間内にある未処理位置を列挙し、処理後は永久に不要になるとき。

lower_boundから該当要素を消しながら進み、全体の列挙回数を抑える。

## 問題固有の要素

区間hubとの連結性は、線形順序上の隣接頂点が繋がったかというN−1個のgapだけで表せる。

別の問題へ持ち帰る視点: 区間が点群をまとめるgraphでは、点間の全関係より連続境界の消滅を追う。

## 正当性

重み順で補助頂点を接ぐと、基点への一辺は必須で、区間の既存成分をさらに接ぐ本数は未消去の隣接境界数に等しい。区間成分は連続で、この境界を消すことがKruskalの成分併合と一致する。境界は一度だけ消え、最後に全消去なら全元頂点と全補助頂点が連結。

## 実装上の注意

- 境界indexの対象はL≤j<Rで、R自身を消さない。kが0でも補助頂点を接続する一辺分Cを加え、合計は64 bitで持つ。

## 復習の核

- 小区間[L,L]ではgapが0個でも一辺必要なことを確認する。set iteratorはeraseの戻り値で進め、境界の半開区間を固定する。

## 計算量と制約

### 時間

元頂点 N、区間操作 Q。sort O(Q log Q)、set境界削除 O((N+Q)log N)。

### 空間

未接続境界setと操作で O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 2 \times 10^5; 1 \leq L_i \leq R_i \leq N; 1 \leq C_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc364/editorial/10546) — source-abc364-editorial-10546-c51091ade72495bd9fe6ab20dcbf6f4f99a7922c871c701a30491b72e74f62d1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc364/tasks/abc364_f) — source-abc364-f-problem-08a508ef61535ab30447a98aa4ed266a5477e4b9e098a2be3e353d049856cdc7
