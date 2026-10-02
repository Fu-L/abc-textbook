---
title: "ABC311-F — Yet Another Grid Task"
draft: true
authoringUnit: {"problemId":"abc311-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-003/abc311-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-transition-optimization"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc311-editorial-6822-96ffb790c28543d7f79fc0523feb4155ae1ba103221e11e8a1d4b6cbd3e8b05d","source-abc311-f-problem-d6a1ad02dc19a3597fe316ab786a8642371fa801c5ddddd5ce5fb8b9e8fba0b2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"美しさの局所条件を繰り返すと、入力の黒セルから強制される全黒セルが決まる。残りの自由な黒白は斜め境界の切替位置で一意に表せる。隣接対角線間の局所含意は境界位置の大小条件k≥jと等価であり、それ以外の履歴を参照しない。したがって現在境界jへ来る全合法前境界kの個数を足すDPが全美しい盤面を一回ずつ数える。suffix sumはその和をまとめるだけなので正しさを保ち、強制黒に反する境界を除けば元の黒セルも全て残る。","sourceRevisionIds":["source-abc311-editorial-6822-96ffb790c28543d7f79fc0523feb4155ae1ba103221e11e8a1d4b6cbd3e8b05d","source-abc311-f-problem-d6a1ad02dc19a3597fe316ab786a8642371fa801c5ddddd5ce5fb8b9e8fba0b2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

黒マスなら直下と右下も黒という条件を閉包として先に入力へ反映してよい。反映後は各右下がり対角線で白の prefix と黒の suffix に分かれる。

対角線 c=i−j ごとの最左黒列 L_c は、隣の対角線へ進むにつれて広義単調減少する。この境界列を数えれば grid 全体を一意に数えられる。

採用する候補: 強制黒を下方へ伝播した後、対角線ごとの白黒境界位置を状態にして suffix sum DP を行う。

美しい grid と単調な境界列が一対一で、各対角線の遷移を累積和により O(M)、全体 O(NM) で処理できる。

棄却する候補: 未確定マスを上から順に白黒へ塗り、局所条件違反を枝刈りする。

条件があっても自由な境界が多数あり、マス単位の 2^{NM} 探索を制約内へ落とせない。

局所含意をすべて閉包した grid は既に美しく、追加で黒くする自由度は対角線上の切替点だけに残る。

前対角線の境界 k が現在の j 以上という単調条件なので、dp[c][j]=Σ_{k≥j}dp[c−1][k] を右からの累積和で更新できる。

入力の # から下・右下へ強制黒を伝播する。c=−M+1..N−1 を走査し、境界 j ごとの dp を前段の suffix sum から作る。対角線外の状態と、強制黒より右へ境界を置いて矛盾する状態を 0 にし、最終段を合計する。

## 典型の発動条件

### 局所制約の閉包と境界線 DP

発動条件: 二値 grid の単調な含意が、各走査線を一つの切替点へ圧縮するとき。

強制状態を先に伝播し、対角線ごとの境界位置だけを DP 状態にする。

### 単調遷移の累積和高速化

発動条件: dp の遷移元が k≥j など連続区間全体になるとき。

前段の suffix sum を一走査で作り、各 j の総和を O(1) で得る。

## 問題固有の要素

行列を行・列ではなく条件が伝播する右下がり対角線で切ると、美しさが単調な一次元境界になる。

別の問題へ持ち帰る視点: 局所条件の方向ベクトルを見て、それに直交する走査線上で frontier が低次元化しないか探す。

## 正当性

美しさの局所条件を繰り返すと、入力の黒セルから強制される全黒セルが決まる。残りの自由な黒白は斜め境界の切替位置で一意に表せる。隣接対角線間の局所含意は境界位置の大小条件k≥jと等価であり、それ以外の履歴を参照しない。したがって現在境界jへ来る全合法前境界kの個数を足すDPが全美しい盤面を一回ずつ数える。suffix sumはその和をまとめるだけなので正しさを保ち、強制黒に反する境界を除けば元の黒セルも全て残る。

## 実装上の注意

- 存在しない対角線マスと外側を黒とみなす番兵 M+1 を区別する。強制黒 (i,j) が境界 j+1 以降を禁じる添字を図で合わせる。

## 復習の核

- 局所条件を見たら、まず入力をその条件で閉包しても答えが変わらないか試す。その後、小例に白黒の境界を描いて走査方向を選ぶ。

## 計算量と制約

### 時間

O(NM)、斜め境界のsuffix DPと強制黒の閉包。

### 空間

O(NM)、gridとrolling境界DP。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N,M \le 2000; S_i is a string of length M consisting of . and #.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/editorial/6822) — source-abc311-editorial-6822-96ffb790c28543d7f79fc0523feb4155ae1ba103221e11e8a1d4b6cbd3e8b05d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/tasks/abc311_f) — source-abc311-f-problem-d6a1ad02dc19a3597fe316ab786a8642371fa801c5ddddd5ce5fb8b9e8fba0b2
