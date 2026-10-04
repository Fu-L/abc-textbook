---
title: "ABC277-G — Random Walk to Millionaire"
draft: true
authoringUnit: {"problemId":"abc277-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc277-g.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc277-editorial-5206-14af14904ec3ad231acf4708459f0200d373946b9f51e04c31502e64f36edd55","source-abc277-g-problem-2ed36a8919af830606b7492d0612289cead83ec578ec2c13b7213708d642c787"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"長さtの歩行prefixを固定すると、levelはそのprefix内のC=0到着数Xである。X²は、その到着時刻から同じ時刻も許して二つを順序付きで選ぶ方法数である。二つのmarkerの未選択/選択済みを四状態で追跡し、C=0到着で各markerを選ぶかを分岐させると、両方選択済みの重みはprefix確率×X²になる。したがってC=1到着時にその重みを足すと、まさに期待収入を足している。全歩行prefixの確率を辺の1/degで更新するので、K歩までの和が期待総収入になる。","sourceRevisionIds":["source-abc277-editorial-5206-14af14904ec3ad231acf4708459f0200d373946b9f51e04c31502e64f36edd55","source-abc277-g-problem-2ed36a8919af830606b7492d0612289cead83ec578ec2c13b7213708d642c787"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

levelをそのままDP次元にするとtime iまで0頂点を何回踏んだかで0,…,iに広がり、vertex×time×levelは重い。

level²は、それ以前に踏んだC=0の時刻からordered pair (x,y)を選ぶ個数と等しいため、二つのmarked時刻の有無だけで展開できる。

採用する候補: random walkのprefixに対し、二つのordered markerが未選択/選択済みかを表す4状態をvertexごとに持ち、C=0到着時にmarkerを選ぶ遷移を加える。

level値を列挙せず二次式を2個のmarkerへ展開し、各stepでgraph edgeを定数状態分だけ緩和できる。

棄却する候補: dp[step][vertex][level]で確率を持ち、C=1到着時にlevel²を加える。

levelがKまで増えるため、N,K≤3000では状態・遷移が一段多くなる。

二つのmarkerはorderedで同じC=0到着時刻を選んでもよく、これがX²の対角pairも正しく含める。

C=1の頂点へ到着した各prefixでは、両marker選択済み状態の重みがそのprefixの確率×現在level²に一致する。

初期vertex1でmarker00の重み1から始める。各stepでcurrent vertexのdeg逆元を掛けて隣接vertexへ配り、到着先C=0なら各未選択markerについて現在時刻を選ぶ/選ばない遷移を行う。C=1到着後のstate11を答えへ加え、K回繰り返す。

## 典型の発動条件

### 多項式量のmarker展開

発動条件: 履歴中のevent数のd次式を期待値として加算し、countをDP次元に持てないとき。

count^dをordered d-tupleの選択数とみなし、各markerの選択済みbitだけを持つ。

### random walkの重みDP

発動条件: 各vertexから隣接先を一様選択する有限step過程の期待値を求めるとき。

path確率をdegの逆元でedgeへ配り、寄与状態を線形に加算する。

## 問題固有の要素

報酬level²を『過去のlevel-up時刻のordered pair数』に変えると、levelの大きさが二つのboolean markerへ置き換わる。

別の問題へ持ち帰る視点: 履歴countの低次多項式は、marked eventの組を数えることで定数個のflag DPへ落とせる。

## 正当性

長さtの歩行prefixを固定すると、levelはそのprefix内のC=0到着数Xである。X²は、その到着時刻から同じ時刻も許して二つを順序付きで選ぶ方法数である。二つのmarkerの未選択/選択済みを四状態で追跡し、C=0到着で各markerを選ぶかを分岐させると、両方選択済みの重みはprefix確率×X²になる。したがってC=1到着時にその重みを足すと、まさに期待収入を足している。全歩行prefixの確率を辺の1/degで更新するので、K歩までの和が期待総収入になる。

## 実装上の注意

- 遷移確率は出発vertexのdegreeの逆元であり、到着vertexのdegreeではない。
- C=0到着時に両markerを同時に現在stepへ置く遷移を含め、C=1到着時にはmarker更新せずstate11だけを報酬へ加える。

## 復習の核

- 0頂点を2回踏んだ後のlevel²=4を、(1,1),(1,2),(2,1),(2,2)の4 marker pairとして列挙する。

## 計算量と制約

### 時間

O(K(N+M))、四marker状態でK歩の全辺を緩和。

### 空間

O(N+M)、一歩ずつrolling。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3000; N-1 \leq M \leq \min\lbrace N(N-1)/2, 3000\rbrace; 1 \leq K \leq 3000; 1 \leq u_i, v_i \leq N; u_i \neq v_i; i \neq j \implies \lbrace u_i, v_i\rbrace \neq \lbrace u_j, v_j \rbrace; The given graph is connected.; C_i \in \lbrace 0, 1\rbrace; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc277/editorial/5206) — source-abc277-editorial-5206-14af14904ec3ad231acf4708459f0200d373946b9f51e04c31502e64f36edd55
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc277/tasks/abc277_g) — source-abc277-g-problem-2ed36a8919af830606b7492d0612289cead83ec578ec2c13b7213708d642c787
