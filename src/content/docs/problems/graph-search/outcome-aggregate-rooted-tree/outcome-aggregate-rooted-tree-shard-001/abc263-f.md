---
title: "ABC263-F — Tournament"
draft: true
authoringUnit: {"problemId":"abc263-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc263-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc263-f-problem-29c43defca98c2a963108037041bb5b6dcc5966f30ac660724107a28ed5d9274","source-abc263-editorial-4550-b6e2922d0d6dd7c13db4dd4ddb7bb9d9b79ac9e390f694ef5317da5f15264315"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"部分木の勝者 j を固定し、j の未確定賞金以外の最適合計を持つ。反対側勝者 k はその段で敗退するので賞金を確定し、max_k(dp[k]+C[k][h]) を加える。これは j に依存せず全結果を網羅する。根だけ優勝者賞金を最後に加えると各賞金を一度だけ数える。","sourceRevisionIds":["source-abc263-f-problem-29c43defca98c2a963108037041bb5b6dcc5966f30ac660724107a28ed5d9274","source-abc263-editorial-4550-b6e2922d0d6dd7c13db4dd4ddb7bb9d9b79ac9e390f694ef5317da5f15264315"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

固定対戦表を葉が参加者の完全二分木として見る。`dp[node][person]` を「personがその部分木を勝ち上がるとき、既に敗退した人へ確定した賞金の最大合計」とする。相手側の勝者kは親の試合で敗退するため、その賞金を `C[k][h]` として加える。ここでhはその人が敗退前に勝った試合数。0勝で敗退した賞金は `C[k][0]=0` と定める。

採用する候補: 勝ち上がり者を状態にして、子部分木の最適値を下からマージする。

勝者を固定すると、敗者側の最良値は相手勝者についての最大値へ集約できる。

棄却する候補: 全ての試合結果を列挙する。

試合数が指数的で、勝敗列の総当たりは不可能。

## 典型の発動条件

### 勝ち上がり者を状態にするトーナメント木DP

発動条件: 固定トーナメント表で勝敗を選び、各参加者の到達roundに応じた利得を最大化するとき。

各部分木について勝者候補ごとの最適値を持ち、左右勝者の対戦で親へ遷移する。

### 遷移相手の最大値前計算

発動条件: 二群の状態をマージする際、一方を固定した評価が相手の識別子に依存せず最大値だけ必要なとき。

相手部分木で敗者賞金込みの最大値を一度計算し、全勝者候補へ共通加算する。

## 問題固有の要素

同じ深さの全ノードで勝者候補集合は葉を分割しており、dp状態総数は各深さ2^N個、全体でN×2^N個に収まる。

別の問題へ持ち帰る視点: 木DPの状態数はノード数×全候補数で粗く見ず、同じ層で候補集合が分割されるかを数える。

## 正当性

部分木の勝者 j を固定し、j の未確定賞金以外の最適合計を持つ。反対側勝者 k はその段で敗退するので賞金を確定し、max_k(dp[k]+C[k][h]) を加える。これは j に依存せず全結果を網羅する。根だけ優勝者賞金を最後に加えると各賞金を一度だけ数える。

## 実装上の注意

- 葉は `dp=0` で初期化する。敗退までの勝利数hは0から数え、`C[i][0]=0` を補ってから木DPを始める。
- 根の優勝者賞金だけ最後に加える。

## 復習の核

- トーナメント問題は列の反復処理ではなく、葉区間が固定された完全二分木として描く。
- 左右候補の二重ループが見えたら、勝者を固定した評価が敗者側の最大値だけで決まらないか確認する。

## 計算量と制約

### 時間

大会深さ N、参加者 P=2^N。各段で全参加者を一回評価して O(PN)。

### 空間

賞金入力表込み O(PN)。DP 作業配列は O(P)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 16; 1 \leq C_{i,j} \leq 10^9; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/tasks/abc263_f) — source-abc263-f-problem-29c43defca98c2a963108037041bb5b6dcc5966f30ac660724107a28ed5d9274
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/editorial/4550) — source-abc263-editorial-4550-b6e2922d0d6dd7c13db4dd4ddb7bb9d9b79ac9e390f694ef5317da5f15264315
