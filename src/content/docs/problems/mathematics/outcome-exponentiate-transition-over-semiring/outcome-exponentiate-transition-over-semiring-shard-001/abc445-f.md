---
title: "ABC445-F — Exactly K Steps 2"
draft: true
authoringUnit: {"problemId":"abc445-f","docPath":"src/content/docs/problems/mathematics/outcome-exponentiate-transition-over-semiring/outcome-exponentiate-transition-over-semiring-shard-001/abc445-f.md","learningOutcomeIds":["outcome-exponentiate-transition-over-semiring"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-linear-recurrence"],"excludedTopics":["半環行列・min-plus/max-min遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-semiring-matrix-exponentiation"],"sourceRevisionIds":["source-abc445-editorial-15907-89f35be3c547667a7b103bd1a349b102d4c891c815d9c3eb7304f679c2bfa2f7","source-abc445-f-problem-bbb5df2daeea8d608944b9dfacd26db3a65d3051c3e818bd05f1ec115d582db4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"ちょうどa+b歩の任意経路はa歩目の中継点jで一意に分かれる。各jの前後最小値の和をminで取ると全経路の最小値になり、従ってC^{a+b}=C^a⊗C^b。結合則と0歩単位行列により二分累乗はC^Kを正確に計算する。一般の最短路と異なり入力にない待機は追加しない。","sourceRevisionIds":["source-abc445-editorial-15907-89f35be3c547667a7b103bd1a349b102d4c891c815d9c3eb7304f679c2bfa2f7","source-abc445-f-problem-bbb5df2daeea8d608944b9dfacd26db3a65d3051c3e818bd05f1ec115d582db4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [半環行列・min-plus/max-min遷移](src/content/docs/learn/combinatorics-algebra/semiring-matrix-exponentiation.md)

- 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。

先に読む単元:

- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md) — 一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。

## 考察

ちょうど k 回移動する最小コスト行列 c^k は、経路を a 歩と b 歩に分けることで min-plus 積 c^a⊗c^b を満たす。

採用する候補: 一歩のコスト行列を min-plus 半環上で二分累乗し、K の立っている bit に対応する行列を min-plus 乗算して c^K を求める。

経路の中継頂点で最小を取る min-plus 積が歩数の加法に対して結合的で、通常の行列累乗と同じ繰り返し二乗が使える。

棄却する候補: 歩数0からKまで dp[step][vertex] を一段ずつ更新する。

K は最大10^9で、各段の N^2 遷移以前に step 数へ比例する処理が不可能である。

(A⊗B)_{i,k}=min_j(A_{i,j}+B_{j,k}) は、前半経路の終点 j を全探索して連結した最小コストである。

単位行列は対角0・非対角∞で、0歩経路を正しく表して累乗 accumulator の初期値になる。

cost を base、min-plus 単位行列を acc とする。K の bit を下から見て、bit が1なら acc=acc⊗base、各段で base=base⊗base と更新し、要求された成分または行列を出力する。

## 典型の発動条件

### min-plus 行列累乗

発動条件: 固定グラフ上で巨大なちょうど K 歩の最短コストを求めるとき。

歩数結合を min-plus 行列積として繰り返し二乗する。

## 問題固有の要素

通常の和・積を min・加算へ置換しても結合則と単位元があれば、二分累乗の枠組みをそのまま使える。

別の問題へ持ち帰る視点: 巨大回数の同一遷移は、状態間遷移を半環行列として累乗できないか検討する。

## 正当性

ちょうどa+b歩の任意経路はa歩目の中継点jで一意に分かれる。各jの前後最小値の和をminで取ると全経路の最小値になり、従ってC^{a+b}=C^a⊗C^b。結合則と0歩単位行列により二分累乗はC^Kを正確に計算する。一般の最短路と異なり入力にない待機は追加しない。

## 実装上の注意

- ∞との加算で overflow しない上限・分岐を設ける。ちょうどK歩なので通常の最短路の0歩待機を勝手に許さない。

## 復習の核

- 二歩の小例で中継点 j の min-plus 積を手計算し、単位行列と bit 合成が「ちょうど」の歩数を保つことを確認する。

## 計算量と制約

### 時間

O(N³ log K)。min-plus行列二分累乗。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 100; 1 \le K \le 10^9; 0 \le C_{i,j} \le 10^9\ (1 \le i \le N,1 \le j \le N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc445/editorial/15907) — source-abc445-editorial-15907-89f35be3c547667a7b103bd1a349b102d4c891c815d9c3eb7304f679c2bfa2f7
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc445/tasks/abc445_f) — source-abc445-f-problem-bbb5df2daeea8d608944b9dfacd26db3a65d3051c3e818bd05f1ec115d582db4
