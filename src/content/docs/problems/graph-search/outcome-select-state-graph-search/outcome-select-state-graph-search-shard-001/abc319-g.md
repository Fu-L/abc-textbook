---
title: "ABC319-G — Counting Shortest Paths"
draft: true
authoringUnit: {"problemId":"abc319-g","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc319-g.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-dp-transition-optimization","unit-ordered-set-multiset"],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search","tag-amortized-monotone-progress","tag-dp-transition-acceleration","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc319-editorial-7118-3acc6181e5d0bb9bf43d6f690d56a73812764e8eb373c0455e0eb90f547e9aa0","source-abc319-g-problem-c3bbfea156ff3fc3ce28a9a9a7bdf1f75000e3605171c1819220290f852642d7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"未訪問走査成功は頂点を一度削除し、失敗は禁止edgeへ課金でき総走査O(N+M)。よって補graphBFSの全許可neighborを省略なく処理できる。最短countは前layer全和から禁止前layerneighbor分だけ引くことと等価で全密edgeを作らない。","sourceRevisionIds":["source-abc319-editorial-7118-3acc6181e5d0bb9bf43d6f690d56a73812764e8eb373c0455e0eb90f547e9aa0","source-abc319-g-problem-c3bbfea156ff3fc3ce28a9a9a7bdf1f75000e3605171c1819220290f852642d7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

先に読む単元:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md) — 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md) — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

対象graphはほぼcompleteで、存在edgeを列挙すると二次になる一方、禁止edgeはM≤2×10^5本しかない。BFSで未訪問集合Lを保ち、現在頂点vからL全体を走査すると、通行可能なuはその場でLから削除され、残る失敗は禁止edge(v,u)に対応する。最短path数は前layer全体のdp和から、vとの禁止edgeを持つ前layer頂点のdpだけを引けば求められる。L走査で許可edgeなら頂点が永久に削除される事象は高々N回、禁止edgeで残る事象は各禁止edgeにつき高々1回なので、総候補確認量をN+Mで抑えられる。距離dのvへの全最短遷移元は距離d-1の全頂点から禁止neighborだけを除いた集合であり、存在neighborを列挙する必要がない。

採用する候補: 補graphBFSを未訪問setで行い、距離layerごとの総dp−禁止neighbor寄与で最短path数を数える。

complete側の膨大なedgeを生成せず、各頂点と禁止edgeを全体で少数回だけ処理できる。

棄却する候補: 削除後graphの全存在edgeを生成して通常BFSとDPを行う。

存在edgeがΘ(N^2)本になり得てmemory・時間とも制約を超える。

棄却する候補: 禁止edgeだけのgraphでBFSし、その距離を反転解釈する。

補graphのpath長は元の禁止graphの距離から単純には復元できない。

禁止edgeを判定できるsetと各頂点の禁止adjacency listを作る。未訪問ordered set Lに2..Nを入れ、queueを1から開始する。vをpopするたびLをiterator走査し、(v,u)が禁止でなければdist[u]=dist[v]+1としてqueueへ入れLからerase、禁止なら残す。距離順に頂点をbucket化し、dp[1]=1から、v∈layer dへsum[d-1]−Σ_{u∈forbidden[v],dist[u]=d-1}dp[u]を加え、dp[N]または未到達-1を出力する。

## 典型の発動条件

### 補graph BFS

発動条件: denseな補graphを探索し、元側の非edge集合だけが疎なとき。

未訪問setから禁止されていない頂点を一括発見・削除する。

### 全体和から例外を引くDP

発動条件: 遷移可能集合がほぼ全体で、禁止相手だけが疎に列挙されるとき。

前layer総和から禁止neighborのdpを減算する。

### amortizedな未訪問set走査

発動条件: scan中の成功要素を永久削除し、失敗pair総数にも疎な上界があるとき。

成功N回・禁止失敗M回として全BFSを評価する。

## 問題固有の要素

距離計算とpath数計算の両方で、complete graphの存在edgeではなく削除されたedgeを例外として処理する同じ補集合発想が使える。

別の問題へ持ち帰る視点: dense object−sparse exceptionsという入力では、探索と集計の各段階を全体集合から例外を除く形へ書き換える。

## 正当性

未訪問走査成功は頂点を一度削除し、失敗は禁止edgeへ課金でき総走査O(N+M)。よって補graphBFSの全許可neighborを省略なく処理できる。最短countは前layer全和から禁止前layerneighbor分だけ引くことと等価で全密edgeを作らない。

## 実装上の注意

- Lのiteratorは許可edgeでeraseした戻り値へ進め、禁止edgeでは通常incrementして無限loopを避ける。
- dp減算はmod 998244353で負値を正規化し、禁止neighborのうちdistが直前layerのものだけを引く。
- 頂点Nが未訪問ならpath数ではなく-1を出力する。

## 復習の核

- 禁止edgeしか残らずLから削除されない候補と、一度に多数削除される候補を含む小例でBFS iteratorを追い、layer DPの引く対象を照合する。

## 計算量と制約

### 時間

N頂点、禁止M辺。ordered set/hash判定なら expected O(N+M)走査＋erase O(N log N)、tree禁止setなら O((N+M)log(N+M))。layer counting O(N+M)。

### 空間

禁止adjacency、未訪問set、dist,dp O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 0 \leq M \leq \min\lbrace 2 \times 10^5, N(N-1)/2 \rbrace; 1 \leq u_i, v_i \leq N; u_i \neq v_i; i \neq j \implies \lbrace u_i, v_i \rbrace \neq \lbrace u_j, v_j \rbrace; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc319/editorial/7118) — source-abc319-editorial-7118-3acc6181e5d0bb9bf43d6f690d56a73812764e8eb373c0455e0eb90f547e9aa0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc319/tasks/abc319_g) — source-abc319-g-problem-c3bbfea156ff3fc3ce28a9a9a7bdf1f75000e3605171c1819220290f852642d7
