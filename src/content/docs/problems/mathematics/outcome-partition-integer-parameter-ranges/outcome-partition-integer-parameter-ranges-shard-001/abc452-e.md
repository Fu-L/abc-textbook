---
title: "ABC452-E — You WILL Like Sigma Problem"
draft: true
authoringUnit: {"problemId":"abc452-e","docPath":"src/content/docs/problems/mathematics/outcome-partition-integer-parameter-ranges/outcome-partition-integer-parameter-ranges-shard-001/abc452-e.md","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate"],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks","tag-prefix-difference"],"sourceRevisionIds":["source-abc452-e-problem-5f1581080675f4fb95414d24e1530ca25f21b78a01cd26a7d776c5f9af5964db","source-abc452-editorial-18408-85a9ae859fce76e2bd46d644fe5a8e22341b3d766381b400fb2476808c5ddc88"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"商q固定の正確なbucketは[jq,j(q+1)−1]。この範囲でi modj=i−jqなので、A_i重み和はΣiA_i−jqΣA_iとなる。二つのprefix差でその全寄与を評価でき、商bucketは互いに素で指定添字領域を覆う。特にi<jを含む領域ではq=0も別途加える必要がある。","sourceRevisionIds":["source-abc452-e-problem-5f1581080675f4fb95414d24e1530ca25f21b78a01cd26a7d776c5f9af5964db","source-abc452-editorial-18408-85a9ae859fce76e2bd46d644fe5a8e22341b3d766381b400fb2476808c5ddc88"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 素因数指数による整数条件の分解。

## 考察

固定 j で quotient k=floor(i/j) が同じ i は連続区間 [jk,min(j(k+1)-1,N)] をなし、その区間では i mod j=i-jk と一次式になる。

採用する候補: ΣA_i と ΣiA_i の prefix sum を作り、各 j について quotient block k=1..floor(N/j) を走査して区間寄与を定数時間で加える。

各 block の寄与は B_j(ΣiA_i-jkΣA_i) で二本の prefix sum から得られ、block 総数 Σ_j floor(N/j)=O(N log N) に収まる。

棄却する候補: 全 (i,j) pair を列挙して i mod j を直接計算する。

pair は Θ(N^2) 個あり、N=5×10^5 では二重 loop が間に合わない。

剰余は quotient が一定の区間で i-jk という affine 式になり、A_i 付き総和も二種類の prefix sumへ分解できる。

j ごとの block 数 N/j の総和は調和級数で N log N 程度であり、全 j でも許容される。

PA[t]=Σ_{i≤t}A_i、PIA[t]=ΣiA_i を構築する。各 j と k=1..floor(N/j) で l=jk,r=min(j(k+1)-1,N) を取り、B_j((PIA[r]-PIA[l-1])-jk(PA[r]-PA[l-1])) を加算する。

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

商q固定の正確なbucketは[jq,j(q+1)−1]。この範囲でi modj=i−jqなので、A_i重み和はΣiA_i−jqΣA_iとなる。二つのprefix差でその全寄与を評価でき、商bucketは互いに素で指定添字領域を覆う。特にi<jを含む領域ではq=0も別途加える必要がある。

## 実装上の注意

- k=0 の i<j が問題の添字範囲に含まれるかを式と合わせる。jkB_j と prefix総和の積は十分広い整数型・mod処理を使う。

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
