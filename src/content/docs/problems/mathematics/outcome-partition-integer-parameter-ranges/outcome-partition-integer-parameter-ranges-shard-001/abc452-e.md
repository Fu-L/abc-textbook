---
title: "ABC452-E — You WILL Like Sigma Problem"
draft: true
authoringUnit: {"problemId":"abc452-e","docPath":"src/content/docs/problems/mathematics/outcome-partition-integer-parameter-ranges/outcome-partition-integer-parameter-ranges-shard-001/abc452-e.md","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate"],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks","tag-prefix-difference"],"sourceRevisionIds":["source-abc452-e-problem-5f1581080675f4fb95414d24e1530ca25f21b78a01cd26a7d776c5f9af5964db","source-abc452-editorial-18408-85a9ae859fce76e2bd46d644fe5a8e22341b3d766381b400fb2476808c5ddc88"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各jの商0区間は[1,min(N,j−1)]、正の商kの区間は[jk,min(N,j(k+1)−1)]で、互いに素かつi=1,…,Nを覆う。商0ではi mod j=i、それ以外ではi−jkなので、提示したprefix差が各区間の重み付き剰余和を与える。全j=1,…,Mの寄与を足せば要求する全ordered pairを一度ずつ数える。","sourceRevisionIds":["source-abc452-e-problem-5f1581080675f4fb95414d24e1530ca25f21b78a01cd26a7d776c5f9af5964db","source-abc452-editorial-18408-85a9ae859fce76e2bd46d644fe5a8e22341b3d766381b400fb2476808c5ddc88"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

先に読む単元:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 素因数指数による整数条件の分解。

## 考察

要求はi=1,…,N、j=1,…,Mの全組のA_iB_j(i mod j)。i<jも含まれ、その場合i mod j=iである。固定jで商k=floor(i/j)が一定なら、剰余はi−jkという一次式になる。

PA[t]=Σ_{i=1}^t A_i、PIA[t]=Σ_{i=1}^t iA_i、PA[0]=PIA[0]=0を用意する。各j=1,…,Mについて、まず商0の区間[1,min(N,j−1)]からB_j·PIA[min(N,j−1)]を足す。次にk=1,…,floor(N/j)についてl=jk、r=min(N,j(k+1)−1)とし、

```text
B_j·((PIA[r]−PIA[l−1])−jk(PA[r]−PA[l−1]))
```

を足す。全演算をmod 998244353で行う。j>Nなら商0の項だけであり、N≠Mでも同じ手順で全組を覆う。

例えばN=1,M=2,A=(1),B=(1,1)ではj=1の寄与0、j=2の商0の寄与1なので答え1。商1以上だけを走査するとこの最小反例を落とす。

全pair列挙はO(NM)だが、商0は各jで定数時間、残りのblock数はΣ_{j≤min(M,N)}floor(N/j)=O(N log N)。剰余を商一定区間へ分け、二つの重み付きprefix和から区間総和を計算すればO(N log N+M)になる。

## 典型の発動条件

### 商一定区間の分割

発動条件: floor(i/j) や i mod j を全 pair で総和したいとき。

固定 divisor ごとに quotient が一定の連続区間を走査する。

### 重み付き prefix sum

発動条件: 区間内で係数が index の一次式になる総和を求めたいとき。

ΣA_i と ΣiA_i を組み合わせる。

## 問題固有の要素

mod を不規則な値として扱わず、quotient ごとの一次式へほどくと区間集約できる。

別の問題へ持ち帰る視点: 二重 loop でも内側長が N/j なら、総計を調和級数で評価して採用可能性を判断する。

## 正当性

各jの商0区間は[1,min(N,j−1)]、正の商kの区間は[jk,min(N,j(k+1)−1)]で、互いに素かつi=1,…,Nを覆う。商0ではi mod j=i、それ以外ではi−jkなので、提示したprefix差が各区間の重み付き剰余和を与える。全j=1,…,Mの寄与を足せば要求する全ordered pairを一度ずつ数える。

## 実装上の注意

- NはAの長さ、MはBの長さ。jをMまで走査し、j>Nでは商0だけを加える。
- PA[0]=PIA[0]=0、商0の右端min(N,j−1)を使う。商1以上のbucketへ重ねない。
- 各積は64 bitで中間計算し、prefix差と最終値をmod 998244353で正規化する。

## 復習の核

- 一つの j で quotient block を列挙し、i mod j=i-jk の区間寄与式と全 block 数の調和級数評価を手で導く。

## 計算量と制約

### 時間

O(N log N+M)。二つのweighted prefix和で各商bucketを定数時間評価する。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,M \leq 5 \times 10^5; 1 \leq A_i, B_j \leq 5 \times 10^5; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc452/tasks/abc452_e) — source-abc452-e-problem-5f1581080675f4fb95414d24e1530ca25f21b78a01cd26a7d776c5f9af5964db
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc452/editorial/18408) — source-abc452-editorial-18408-85a9ae859fce76e2bd46d644fe5a8e22341b3d766381b400fb2476808c5ddc88
