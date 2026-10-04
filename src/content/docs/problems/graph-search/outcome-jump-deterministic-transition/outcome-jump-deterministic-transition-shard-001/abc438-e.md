---
title: "ABC438-E — Heavy Buckets"
draft: true
authoringUnit: {"problemId":"abc438-e","docPath":"src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc438-e.md","learningOutcomeIds":["outcome-jump-deterministic-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-binary-lifting"],"sourceRevisionIds":["source-abc438-e-problem-6392dfca12a247f83bdd4deb25a184c922e4d84801ab08acc370de6406f691b4","source-abc438-editorial-14964-92e2c297aa167b81542365c9f8c0612a0a6ba5d11cf6d32180a4220251602708"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"2^d回遷移は二つの2^(d−1)区間を接続した先と重み和で表せる。結合は順序を保つため非一様注水でも正しい。質問のbitを現在所有者から順に使うと区間を重複なく敷き詰め、T回後の総注水を得る。","sourceRevisionIds":["source-abc438-e-problem-6392dfca12a247f83bdd4deb25a184c922e4d84801ab08acc370de6406f691b4","source-abc438-editorial-14964-92e2c297aa167b81542365c9f8c0612a0a6ba5d11cf6d32180a4220251602708"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

## 考察

一つのバケツに注目すると、操作ごとに持ち主 i から A_i へ移り、その時の注水量が現在持ち主だけで決まる。これは functional graph 上の遷移と経路重み和である。 2^(d-1) 回後の持ち主 j=P[d-1][i] からさらに同回数進むので、P[d][i]=P[d-1][j] である。 追加水量も前半 Q[d-1][i] と後半 Q[d-1][j] の和として同じ合成則を持つ。

採用する候補: 2^d 回後の持ち主 P[d][i] と追加水量 Q[d][i] をダブリング前計算し、各質問の T を二進分解する。

遷移先と重み和が結合可能で、O((N+Q)log T) で巨大な操作回数を処理できる。

棄却する候補: 各質問で T 回の操作を逐一シミュレーションする。

T は最大 10^9 で実行不能である。

2^(d-1) 回後の持ち主 j=P[d-1][i] からさらに同回数進むので、P[d][i]=P[d-1][j] である。

追加水量も前半 Q[d-1][i] と後半 Q[d-1][j] の和として同じ合成則を持つ。

一回遷移から P[0][i] と Q[0][i] を作る。d ごとに中間 j を介して遷移と和を倍化する。質問では current と water を初期化し、T の立っている bit d ごとに water+=Q[d][current]、current=P[d][current] と更新して答える。

## 典型の発動条件

### 重み付きダブリング

発動条件: 決定的遷移を多数回適用した後の状態と、途中の加法的コストを問うとき。

jump table に遷移先と区間重み和を対で保存する。

### functional graph

発動条件: 各頂点の出次数が1で、同じ遷移を反復するとき。

人を頂点、バケツの受け渡しを有向辺として捉える。

## 問題固有の要素

反復操作で必要な情報が終状態と加法的集約なら、両方を同じ二進持ち上げで合成できる。

別の問題へ持ち帰る視点: ダブリングは祖先取得だけでなく、モノイド値を遷移区間に付加して経路集約にも使える。

## 正当性

2^d回遷移は二つの2^(d−1)区間を接続した先と重み和で表せる。結合は順序を保つため非一様注水でも正しい。質問のbitを現在所有者から順に使うと区間を重複なく敷き詰め、T回後の総注水を得る。

## 実装上の注意

- 質問処理では Q を足してから P へ移る順序をテーブル定義と合わせる。最大水量に耐える整数型と必要 bit 数を確保する。

## 復習の核

- P[d],Q[d] の後半が中間頂点 j から始まることと、質問の bit 適用順を確認する。

## 計算量と制約

### 時間

N所有者Q質問、最大回数T。重み付きjump O((N+Q)log(T+1))。

### 空間

jump先と注水和 O(N log(T+1))。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq A_i \leq N; 1 \leq T_i \leq 10^9; 1 \leq B_i \leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc438/tasks/abc438_e) — source-abc438-e-problem-6392dfca12a247f83bdd4deb25a184c922e4d84801ab08acc370de6406f691b4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc438/editorial/14964) — source-abc438-editorial-14964-92e2c297aa167b81542365c9f8c0612a0a6ba5d11cf6d32180a4220251602708
