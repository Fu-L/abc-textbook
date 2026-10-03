---
title: "ABC299-E — Nearest Black Vertex"
draft: true
authoringUnit: {"problemId":"abc299-e","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-001/abc299-e.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-shortest-path"],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness","tag-shortest-path"],"sourceRevisionIds":["source-abc299-e-problem-5eaff5658e585b8a1814cac9913fea7903aacea5cdd6667c316624d32892b682","source-abc299-editorial-6249-59f19c37efef7a16afe92952d4945c5c877864bfc8ee65f98ccb11763c3056a3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"条件(p_i,d_i)があると距離<d_iの頂点は必ず白でなければならない。全条件で強制白となる頂点だけを白とし残りを全て黒にするのが、黒へできる最大集合である。この最大集合に距離d_iの黒が一つあれば条件を満たし、なければどの合法色分けでも新しい黒を追加できず不可能。","sourceRevisionIds":["source-abc299-e-problem-5eaff5658e585b8a1814cac9913fea7903aacea5cdd6667c316624d32892b682","source-abc299-editorial-6249-59f19c37efef7a16afe92952d4945c5c877864bfc8ee65f98ccb11763c3056a3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

条件(p_i,d_i)は「黒頂点までの最短距離がちょうどd_i」である。dist(p_i,v)<d_iの頂点は強制白、dist(p_i,v)=d_iには少なくとも一つ黒が必要と分ける。黒候補を減らして得をする条件はないため、全強制白の和集合だけを除いた最大集合を黒にすればよい。

各p_iからBFSしてdist_i[v]を求める。全頂点を黒候補で初期化し、全iについてdist_i[v]<d_iを満たすvを白へする。この除外を全条件で終えてから、全iについてdist_i[v]=d_iの黒候補が少なくとも一つあるか調べる。あればYesと候補の01列、なければNo。条件ごとに一つの黒を先に選ぶ方法では、後の条件から白を強制されるのでこの二段階が必要である。

問題には黒を少なくとも一個置く条件もある。K=0では除外せず全黒を返す。K>0で全距離球に黒があれば自動的にこの条件も満たす。d_i=0では禁止球が空で、p_i自身が黒でなければならない。

## 典型の発動条件

### 最大許容集合の構成

発動条件: 禁止条件が要素ごとの除外、要求条件が存在量化。

禁止されない全頂点を採用して存在条件を検査する。

### 全点対最短距離

発動条件: N,M≤2000の無重みgraphで多数距離条件。

各頂点BFSを前計算する。

## 問題固有の要素

黒候補を減らす利点がない単調な存在条件なので、最大候補集合一つだけ試せばよい。

別の問題へ持ち帰る視点: 禁止集合を除いた全採用が存在制約のcanonical witnessになる。

## 正当性

条件(p_i,d_i)があると距離<d_iの頂点は必ず白でなければならない。全条件で強制白となる頂点だけを白とし残りを全て黒にするのが、黒へできる最大集合である。この最大集合に距離d_iの黒が一つあれば条件を満たし、なければどの合法色分けでも新しい黒を追加できず不可能。

## 実装上の注意

- d_i=0では禁止ballが空でp_i自身が黒必要。K=0でも黒1個以上の条件を満たす配置を出す。

## 復習の核

- 小graphの全着色と比較し、d=0、禁止領域が全頂点、複数条件の境界球が重なる例を確認する。

## 計算量と制約

### 時間

K個の指定始点だけからBFSすればO(N+K(N+M)+KN)、保持O(N+M+KN)。全N始点を前計算する方式ならO(N(N+M)+KN)。

### 空間

O(N+M+KN)。隣接listとK始点の距離表。全N始点を前計算する実装ならO(N²+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2000; N-1 \leq M \leq \min\lbrace N(N-1)/2, 2000 \rbrace; 1 \leq u_i, v_i \leq N; 0 \leq K \leq N; 1 \leq p_1 \lt p_2 \lt \cdots \lt p_K \leq N; 0 \leq d_i \leq N; The given graph is simple and connected.; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/tasks/abc299_e) — source-abc299-e-problem-5eaff5658e585b8a1814cac9913fea7903aacea5cdd6667c316624d32892b682
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/editorial/6249) — source-abc299-editorial-6249-59f19c37efef7a16afe92952d4945c5c877864bfc8ee65f98ccb11763c3056a3
