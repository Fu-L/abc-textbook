---
title: "ABC395-G — Minimum Steiner Tree 2"
draft: true
authoringUnit: {"problemId":"abc395-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-steiner-tree-by-subset-dp/outcome-solve-steiner-tree-by-subset-dp-shard-001/abc395-g.md","learningOutcomeIds":["outcome-solve-steiner-tree-by-subset-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-state","unit-weighted-shortest-path"],"excludedTopics":["Steiner tree subset DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-steiner-tree-dp","tag-shortest-path"],"sourceRevisionIds":["source-abc395-editorial-12307-e3846bd673cb29dc671b045fefc51c7af285741c36938e39669b440a4ba00500","source-abc395-g-problem-28b4b77f6fd7b5f3d752638e1f2aa35eefec8abc1a034fccb30e919e725d5d55"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"固定端点集合と s を結ぶ木を root t で読むことは、固定端点・s・t を結ぶ問題と同値であり、tに別のbitは不要。subset merge と最短路 closure は root 付き Steiner 木の分岐と枝延長を網羅する。可変 s の bit を含む状態では、併合の一方だけが s を含み、他方は共有済み固定 subset DP となる。端点数の帰納法で全追加 s の最適値を求め、一度の計算を全 t で共有できる。","sourceRevisionIds":["source-abc395-editorial-12307-e3846bd673cb29dc671b045fefc51c7af285741c36938e39669b440a4ba00500","source-abc395-g-problem-28b4b77f6fd7b5f3d752638e1f2aa35eefec8abc1a034fccb30e919e725d5d55"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Steiner tree subset DP](src/content/docs/learn/dynamic-programming/steiner-tree-dp.md)

- terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- Steiner tree subset DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

非負edgeのconnected subgraph最小costはSteiner treeであり、必須terminalは固定1..Kにquery固有s,tを加えたもの。K≤8なのでfixed terminal subset DPが使える。 dp[mask][v]をmask terminalsとvを結ぶ最小costとすると、vで二treeを結ぶsubset mergeと、endpointをedge沿いに移すshortest-path closureの二段階で更新できる。 同じroot vでmaskをzとmask\zに分けるdp[z][v]+dp[mask\z][v]がbranch結合を表す。 merge遷移を確定後、dp[mask][*]を初期距離とするmulti-source shortest pathで任意Steiner vertexまで延長する。

採用する候補: Dreyfus–Wagner型subset Steiner DPを、固定terminal集合＋各sを追加した状態まで前計算する

必要maskは固定K terminalに高々一query頂点を加えたものに整理でき、密graphのO(N²) Dijkstra closureとsubset mergeでO(3^K N²+2^K N³)に収まる。

棄却する候補: 各queryごとにK+2 terminalのSteiner DPを独立に実行する

Q≤5000で同じ固定terminal部分の計算を繰り返し、指数DPをquery数倍する。

同じroot vでmaskをzとmask\zに分けるdp[z][v]+dp[mask\z][v]がbranch結合を表す。

merge遷移を確定後、dp[mask][*]を初期距離とするmulti-source shortest pathで任意Steiner vertexまで延長する。

固定terminal bitmaskについてsubset merge→dense Dijkstra closureを昇順maskで計算する。さらに各s>Kを一つ追加したterminal stateを同じ遷移で計算し、そのstateからtへclosureしたdp値をquery答えとして参照する。

## 典型の発動条件

### subset Steiner tree DP

発動条件: terminal数が小さく、Steiner vertexを自由に使える最小connected subgraphを求めるとき。

terminal subsetと接続rootを状態にする。

### subset merge＋shortest-path closure

発動条件: Steiner treeのbranch結合とedge延長を分離するとき。

submask partition後にDijkstraでroot位置を緩和する。

### query共通部分の前計算

発動条件: 多数queryが大半のterminalを共有するとき。

固定K集合と追加sごとまでを共有計算する。

## 問題固有の要素

queryの二terminal s,tを同時にsubset bitへ加えず、sをterminal集合へ入れてtを最終root位置として読むとquery pair全体を前計算できる。

別の問題へ持ち帰る視点: 小さい固定集合＋二可変endpointの問題では、一方を状態生成軸、他方を全頂点closureの参照先にする。

## 正当性

固定端点集合と s を結ぶ木を root t で読むことは、固定端点・s・t を結ぶ問題と同値であり、tに別のbitは不要。subset merge と最短路 closure は root 付き Steiner 木の分岐と枝延長を網羅する。可変 s の bit を含む状態では、併合の一方だけが s を含み、他方は共有済み固定 subset DP となる。端点数の帰納法で全追加 s の最適値を求め、一度の計算を全 t で共有できる。

## 実装上の注意

- Cはtriangle inequalityを満たすとは限らないので元complete edgeでclosureを必ず行う。submask重複は正しさを保つが計算量を見積もる。

## 復習の核

- N≤9,K≤3でedge subset全探索または全Steiner vertex subsetのMSTと比較し、s/tが中継点として使われるcaseを確認する。

## 計算量と制約

### 時間

N 頂点 complete graph、固定端点 K、Q 質問。固定集合＋各 s の共有前計算で O(3^K N²+2^K N³+Q)。

### 空間

固定 subset と追加 s の dp を全保持すると O(2^K N²)、答え pair 表 O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 80; 1\leq K\leq \min(N-2,\textcolor{red}{8}); 0 \leq C_{i,j} \leq 10^9 \ (1 \leq i,j \leq N, i \ne j); C_{i,j} = C_{j,i} \ (1 \leq i,j \leq N, i \ne j); C_{i,i} = 0 \ (1 \leq i \leq N); 1 \leq Q \leq 5000; K+1 \leq s_i, t_i \leq N \ (1 \leq i \leq Q); s_i \ne t_i \ (1 \leq i \leq Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc395/editorial/12307) — source-abc395-editorial-12307-e3846bd673cb29dc671b045fefc51c7af285741c36938e39669b440a4ba00500
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc395/tasks/abc395_g) — source-abc395-g-problem-28b4b77f6fd7b5f3d752638e1f2aa35eefec8abc1a034fccb30e919e725d5d55
