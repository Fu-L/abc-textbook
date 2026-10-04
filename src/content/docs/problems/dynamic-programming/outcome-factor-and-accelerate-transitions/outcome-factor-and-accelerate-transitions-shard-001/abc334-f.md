---
title: "ABC334-F — Christmas Present 2"
draft: true
authoringUnit: {"problemId":"abc334-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc334-f.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-monotone-stack-queue"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-monotone-stack-queue"],"sourceRevisionIds":["source-abc334-editorial-8982-8917f4a224d06b6aea49f249e93291c2c820606bc4687557ef5132cf2fbee41c","source-abc334-f-problem-8df90cafee9c55969daaf7f93fe4840a719f1e1de48c92e1a6d995f4e39b467d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一回の積載で配達するのは訪問順の連続区間で、長さはK以下である。補充せず全点を巡るbaselineに対し、境界iへ補充を挟むとi→i+1がi→S→i+1に替わるだけなので追加距離d_iが独立に加算される。従って実行可能な旅程と、隣接間隔K以下の選択境界列が一対一になる。最後の境界から次の境界へ進む一次元最小費用DPは全境界列を覆い、dequeはその範囲最小を正確に維持する。baselineを足した終点値が最短距離となる。","sourceRevisionIds":["source-abc334-editorial-8982-8917f4a224d06b6aea49f249e93291c2c820606bc4687557ef5132cf2fbee41c","source-abc334-f-problem-8df90cafee9c55969daaf7f93fe4840a719f1e1de48c92e1a6d995f4e39b467d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md) — 候補の支配関係を証明し、不要になった要素を一度だけ捨てて線形処理へ変える。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

子供iからi+1へは直接進むか、Santa宅へ戻って補充してから進むかの二択だけを考えればよい。補充境界を0とNも含めて並べると、携帯上限Kは隣接境界間の子供数がK以下という条件になる。

採用する候補: 直接巡回をbaselineにし、補充境界の追加costをwindow-min DPで選ぶ

幾何部分を各境界の独立な差分へ分け、K間隔制約を一次元DPとしてO(N)またはO(N log N)で解ける。

棄却する候補: 持っているpresent数を含む二次元DPを全位置で遷移する

O(NK)状態になりK=Nでは二乗時間となる一方、必要情報は最後の補充位置だけに圧縮できる。

baselineをS→1→…→N→Sとし、境界iで補充する追加距離をd_i=dist(i,S)+dist(S,i+1)-dist(i,i+1)と置く。選んだ境界間隔≤Kなら実行可能で、総距離はbaseline+Σd_iになる。

d_0=d_N=0としてdp[0]=0、dp[i]=d_i+min{dp[j] | i-K≤j<i}をi=1,…,Nで計算する。dequeの先頭をwindow最小に保てばO(N)でdp[N]を得て、baselineへ加える。

## 典型の発動条件

### baselineとの差分化

発動条件: 二種類の移動が共通部分を持ち、一方が既定routeの一辺を置換する。

直接routeを全て足し、補充を選ぶ境界だけdetour minus directの差分を加える。

### sliding-window minimum DP

発動条件: 次の補充位置iは直前の補充位置が幅Kの範囲にあればよい。

直近K個のdp最小値をmonotone dequeで維持する。

## 問題固有の要素

携帯個数を逐次状態にせず、補充した位置同士のgap≤Kへ言い換えると、route選択がinterval covering型の最短pathになる。

別の問題へ持ち帰る視点: 容量制約は補給・reset点の間隔制約へ変換すると状態次元を減らせる。

## 正当性

一回の積載で配達するのは訪問順の連続区間で、長さはK以下である。補充せず全点を巡るbaselineに対し、境界iへ補充を挟むとi→i+1がi→S→i+1に替わるだけなので追加距離d_iが独立に加算される。従って実行可能な旅程と、隣接間隔K以下の選択境界列が一対一になる。最後の境界から次の境界へ進む一次元最小費用DPは全境界列を覆い、dequeはその範囲最小を正確に維持する。baselineを足した終点値が最短距離となる。

## 実装上の注意

- 座標差を浮動小数へ変換してhypotを計算し、baselineにはS→1とN→Sも含める。dequeからi-K未満のindexを削除してから最小を参照する。

## 復習の核

- K=1、K=N、一直線配置、detour差がほぼ0の座標でO(NK) DPとの誤差を含めて比較する。

## 計算量と制約

### 時間

O(N)、境界cost前計算と幅Kのdeque最小DP。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq K\leq N \leq 2\times 10^5; -10^9\leq S_X,S_Y,X_i,Y_i \leq 10^9; (S_X,S_Y)\neq (X_i,Y_i); (X_i,Y_i)\neq (X_j,Y_j)\ (i\neq j); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc334/editorial/8982) — source-abc334-editorial-8982-8917f4a224d06b6aea49f249e93291c2c820606bc4687557ef5132cf2fbee41c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc334/tasks/abc334_f) — source-abc334-f-problem-8df90cafee9c55969daaf7f93fe4840a719f1e1de48c92e1a6d995f4e39b467d
