---
title: "ABC332-G — Not Too Many Balls"
draft: true
authoringUnit: {"problemId":"abc332-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-002/abc332-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource","unit-event-sweep","unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut","tag-event-sweep","tag-knapsack-resource"],"sourceRevisionIds":["source-abc332-editorial-7889-a696f202b5f150eb8989f441fa20863c1a6b316a0313f978ffb91e3cfda3507b","source-abc332-g-problem-94f820c608cb46557c2fc6da8de68cfa7cac7508ac566620b787eab02fed157f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"cutでS側色集合Pを固定すると箱jの最適側はmin(B_j,jΣ_{i∈P}i)。従ってPの詳細は重み和kだけで十分。色subsetの取り逃しをknapsack最小、箱分を独立min和として足し全k最小にすれば全cutを覆う。max-flow=min-cutが最大収納数。","sourceRevisionIds":["source-abc332-editorial-7889-a696f202b5f150eb8989f441fa20863c1a6b316a0313f978ffb91e3cfda3507b","source-abc332-g-problem-94f820c608cb46557c2fc6da8de68cfa7cac7508ac566620b787eab02fed157f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md) — 最小十分状態を設計できるようになった後、選択数・容量・費用などの資源軸で遷移を表し、0/1選択と無制限選択の更新方向を区別する。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

色iから箱jへ入れる個数をflowとみなすと、source→色にA_i、色→箱にij、箱→sinkにB_jの容量を置ける。ただし完全二部辺NMは最大2.5×10^8で、直接max flowは構築不能である。 min-cutでsource側の色集合Pを固定すると、色→箱jのcut容量はj×Σ_{i∈P}iだけに依存する。subsetの詳細がk=Σiへ圧縮され、各箱はB_jとjkの小さい方を独立に選べる。 kを固定した色側寄与min Σ_{i∉P}A_iは、重さi・選択利得A_iの0/1 knapsackとして全kを求められる。 箱側F(k)=Σ_j min(jk,B_j)は、各箱がk>⌊B_j/j⌋で一次式jkから定数B_jへ一度だけ切り替わるので、傾きと定数をsweepできる。

採用する候補: max-flow min-cutでcutを重み和kへ圧縮し、色側knapsack DPと箱側min和を合成する

kは0..N(N+1)/2に収まり、色subsetの最小cut寄与をO(N^3)、箱寄与をbreakpoint順にO(N^2+M)で全k計算できる。

棄却する候補: N+M+2頂点・NM辺の二部graphへDinic法を直接適用する

M≤5×10^5で辺数NMが大きすぎ、graphの保持もflow計算も不可能である。

棄却する候補: 各箱へ入る量を箱ごとにgreedy配分する

色ごとの総供給A_iと全箱にまたがる上限ijが結合するため、局所選択では全体最適性を保証できない。

kを固定した色側寄与min Σ_{i∉P}A_iは、重さi・選択利得A_iの0/1 knapsackとして全kを求められる。

箱側F(k)=Σ_j min(jk,B_j)は、各箱がk>⌊B_j/j⌋で一次式jkから定数B_jへ一度だけ切り替わるので、傾きと定数をsweepできる。

L=N(N+1)/2とし、dp[k]=min cutの色側寄与を0/1 knapsackで計算する。箱jの切替点⌊B_j/j⌋をbucket化し、k=0..Lを昇順に走査しながら未切替index和×k＋切替済B和でF(k)を出す。min_k(dp[k]+F(k))がmax-flow値、すなわち答え。

## 典型の発動条件

### max-flow min-cutによる双対化

発動条件: 配分最大化はflowで表せるが、辺数が構造的に多すぎるとき。

cut容量の式へ移り、完全二部容量ijの可分性を利用する。

### subsetを十分統計量へ圧縮するknapsack

発動条件: 集合の他側への影響が選択indexの重み和だけで決まるとき。

Pをk=Σiへ圧縮し、各kの色側最小costをDPする。

### piecewise-linear minのsweep

発動条件: Σ min(slope_j×k, cap_j)を連続する整数kで求めるとき。

各項の一度だけのbreakpointをbucket化し、総傾きと定数和を更新する。

## 問題固有の要素

巨大な完全二部flowの各中間辺容量ijがrank-1積なので、cutで色集合の情報がΣiという一変数だけへ潰れる。

別の問題へ持ち帰る視点: 密なflowを諦める前に、min-cut式で辺容量行列が低rank・可分形になっていないかを調べる。

## 正当性

cutでS側色集合Pを固定すると箱jの最適側はmin(B_j,jΣ_{i∈P}i)。従ってPの詳細は重み和kだけで十分。色subsetの取り逃しをknapsack最小、箱分を独立min和として足し全k最小にすれば全cutを覆う。max-flow=min-cutが最大収納数。

## 実装上の注意

- A_i,B_jと総和には十分広い整数型を使う。切替条件jk>B_jの境界と、k>Lのbreakpointをbucketへ入れない処理を揃える。

## 復習の核

- N,M≤4で元の二部graphのmax flowと全cut列挙を行い、k固定DP・min(jk,B_j)・breakpoint境界の三者を比較する。

## 計算量と制約

### 時間

色N箱M、L=N(N+1)/2。knapsack O(NL)=O(N³)、箱breakpoint O(M+L)、入力O(N+M)。

### 空間

色DPとbreakpoint O(L)、箱inputO(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \leq N \leq 500; 1 \leq M \leq 5 \times 10^5; 0 \leq A_i, B_i \leq 10^{12}

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc332/editorial/7889) — source-abc332-editorial-7889-a696f202b5f150eb8989f441fa20863c1a6b316a0313f978ffb91e3cfda3507b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc332/tasks/abc332_g) — source-abc332-g-problem-94f820c608cb46557c2fc6da8de68cfa7cac7508ac566620b787eab02fed157f
