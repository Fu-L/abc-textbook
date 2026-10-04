---
title: "ABC280-F — Pay or Receive"
draft: true
authoringUnit: {"problemId":"abc280-f","docPath":"src/content/docs/problems/graph-search/outcome-propagate-static-graph-potentials/outcome-propagate-static-graph-potentials-shard-001/abc280-f.md","learningOutcomeIds":["outcome-propagate-static-graph-potentials"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["静的graph等式制約のpotential伝播の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-graph-potential-propagation"],"sourceRevisionIds":["source-abc280-editorial-5303-aea62deae9b25f1c4e4b148b805c4bf36522b9a2edc9a3e1d8ad4c9488e912b0","source-abc280-f-problem-47f71a8cdee8536d7a88cdb6ec9f45a36b4048b5445c952d60040e01ecc44ae9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"矛盾がなければ全辺scoreがpotential差となり任意pathのscoreは終点差へtelescopingする。矛盾があれば非零closed walkがあり、逆向きで符号を選んで正scoreを無限反復できる。同成分からそこへ往復可能なのでinf。別成分はpathなし。","sourceRevisionIds":["source-abc280-editorial-5303-aea62deae9b25f1c4e4b148b805c4bf36522b9a2edc9a3e1d8ad4c9488e912b0","source-abc280-f-problem-47f71a8cdee8536d7a88cdb6ec9f45a36b4048b5445c952d60040e01ecc44ae9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [静的graph等式制約のpotential伝播](src/content/docs/learn/graph/graph-potential-propagation.md)

- 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

roadを往復するとscore変化が符号反転するため、連結成分内でrootから各頂点へのpotentialが一意なら任意pathのscore差も一意になる。 同じ頂点へ異なるscoreで到達できるなら差を持つclosed walkがあり、正になる向きで何度も回ってscoreを無限に増やせる。 consistent componentでは任意のx→y walk scoreはpot[y]-pot[x]で、closed walk scoreは全て0になる。 不整合edgeが1本でもあるcomponentでは非零closed walkを両方向のうち有利な向きに反復でき、同componentの任意x,y queryがinfになる。

採用する候補: 各componentをDFSし、edge A→Bでpot[B]=pot[A]+Cを割り当て、既割当てとの矛盾があればcomponentをunboundedと印付ける。

連結性・有限時のscore差・非零cycleの有無を一度の前処理で得て、queryを定数時間で分類できる。

棄却する候補: 各queryごとに最大score pathをBellman-Ford等で探索する。

Q,N,M≤10^5で繰返し最短路は重く、undirected符号edgeのpotential構造を活かしていない。

consistent componentでは任意のx→y walk scoreはpot[y]-pot[x]で、closed walk scoreは全て0になる。

不整合edgeが1本でもあるcomponentでは非零closed walkを両方向のうち有利な向きに反復でき、同componentの任意x,y queryがinfになる。

未訪問vertexごとにcomponent idとpot=0を置き、(u,v,+c)をDFS緩和する。pot[v]≠pot[u]+cを見つけたcomponentをbadにする。queryはcomponent不同ならnan、badならinf、それ以外はpot[y]-pot[x]。

## 典型の発動条件

### potential付きgraph

発動条件: edgeが頂点値の差を指定し、path和の一意性や矛盾を判定したいとき。

rootからpotentialを割り当て、各edgeが差分式を満たすか検査する。

### 非零cycleによるunbounded判定

発動条件: cycleを繰り返せるwalk最適化で、cycle利得が0でないとき。

符号反転可能なclosed walkを有利な向きに反復してinfとする。

## 問題固有の要素

各roadの逆向きscoreが正確に−Cなので、cycle矛盾は単なる有限の別解ではなく、向きを選べる無限利得へ直結する。

別の問題へ持ち帰る視点: 可逆edgeの加法scoreでは、path差の不整合がreversible profitable cycleになるかを見る。

## 正当性

矛盾がなければ全辺scoreがpotential差となり任意pathのscoreは終点差へtelescopingする。矛盾があれば非零closed walkがあり、逆向きで符号を選んで正scoreを無限反復できる。同成分からそこへ往復可能なのでinf。別成分はpathなし。

## 実装上の注意

- A→Bで+C、B→Aで−Cを隣接listへ保存し、potentialの符号をquery式まで統一する。
- self-loop C>0やparallel edgeの不一致もbad検出対象で、potentialと答えは64 bitにする。

## 復習の核

- 同じ2頂点を異なるCのparallel roadで結ぶ例から非零closed walkを作り、なぜcomponent全queryがinfになるか説明する。

## 計算量と制約

### 時間

N 頂点、M road、Q質問。potentialDFS O(N+M)、各質問 O(1)。

### 空間

符号付き隣接、component、potential O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 10^5; 0\leq M \leq 10^5; 1\leq Q \leq 10^5; 1\leq A_i,B_i,X_i,Y_i \leq N; 0\leq C_i \leq 10^9; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc280/editorial/5303) — source-abc280-editorial-5303-aea62deae9b25f1c4e4b148b805c4bf36522b9a2edc9a3e1d8ad4c9488e912b0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc280/tasks/abc280_f) — source-abc280-f-problem-47f71a8cdee8536d7a88cdb6ec9f45a36b4048b5445c952d60040e01ecc44ae9
