---
title: "ABC298-F — Rook Score"
draft: true
authoringUnit: {"problemId":"abc298-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc298-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc298-editorial-6211-8114a025037834e41fb9ef5cb0443dad7fe85b1d98c3a7af10e1c3564a6478fe","source-abc298-f-problem-82542e25568160a466c44eea2f79e94505de6b46f2709898ee0a8440b9138d0f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各行で調べる既入力交点数の総和はNなので、列降順走査の打切りまでの総試行もO(N+行数)に抑えられる。 入力交点だけ補正候補を評価し、最初の空交点では以後より小さい列和が勝てないので打ち切れる。","sourceRevisionIds":["source-abc298-editorial-6211-8114a025037834e41fb9ef5cb0443dad7fe85b1d98c3a7af10e1c3564a6478fe","source-abc298-f-problem-82542e25568160a466c44eea2f79e94505de6b46f2709898ee0a8440b9138d0f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 対称操作による状態の正規化。

## 考察

固定行Rの得点はrowSum[R]+colSum[C]-cell(R,C)で、入力にない交点なら減算0である。

採用する候補: 列和降順を行ごとに未入力交点まで走査

入力交点だけ補正候補を評価し、最初の空交点では以後より小さい列和が勝てないので打ち切れる。

棄却する候補: 全行列交点を列挙

相異なる行列が各2×10^5あり直積が巨大。

各行で調べる既入力交点数の総和はNなので、列降順走査の打切りまでの総試行もO(N+行数)に抑えられる。

行和・列和とcell mapを作り、列を和降順にsortする。各行で先頭からrow+col-cellを更新し、cellが存在しない列に到達したらその候補を評価して停止する。

## 典型の発動条件

### 疎行列の行列和集約

発動条件: 非零cellのみ与えられ行・列合計を組み合わせる。

hash mapで入力に現れる行・列・cellだけを保持し、交点のcell値を補正として引く。

### 上界順探索の早期打切り

発動条件: 候補の基礎値が降順で、例外補正は既知の疎点だけ。

最初の補正なし候補で後続を支配する。

## 問題固有の要素

密なrow×column探索を、減点cellが存在する疎な例外だけ調べる問題へ反転する。

別の問題へ持ち帰る視点: 基礎score上位順と疎なペナルティを組み合わせる。

## 正当性

各行で調べる既入力交点数の総和はNなので、列降順走査の打切りまでの総試行もO(N+行数)に抑えられる。 入力交点だけ補正候補を評価し、最初の空交点では以後より小さい列和が勝てないので打ち切れる。

## 実装上の注意

- 同一cellはないが行列和は64ビット。空交点候補が見つからない行でも全既存交点を評価する。

## 復習の核

- 小疎行列の全交点と比較し、最大列との交点が大値、空交点最適、1行/1列だけの例を確認する。

## 計算量と制約

### 時間

O(N log N)、列sum sort、存在交点の全走査は償却O(N)。

### 空間

O(N)、疎cellと行列sum。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq r_i,c_i,x_i \leq 10^9; (r_i,c_i) \neq (r_j,c_j) if i \neq j.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/editorial/6211) — source-abc298-editorial-6211-8114a025037834e41fb9ef5cb0443dad7fe85b1d98c3a7af10e1c3564a6478fe
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/tasks/abc298_f) — source-abc298-f-problem-82542e25568160a466c44eea2f79e94505de6b46f2709898ee0a8440b9138d0f
