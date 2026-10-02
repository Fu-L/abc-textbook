---
title: "ABC380-E — 1D Bucket Tool"
draft: true
authoringUnit: {"problemId":"abc380-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-interval-partition/outcome-maintain-ordered-interval-partition-shard-001/abc380-e.md","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset"],"excludedTopics":["端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-interval-partition"],"sourceRevisionIds":["source-abc380-e-problem-dd8c10305a788a2a30b313d2210feba55617308d1e2496b89242163d2d5a0dd1","source-abc380-editorial-11356-041c38a9de6037d2568c49211fd531c4c502c153b71bf9b9b1787e13924fb222"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"境界 set で x 以下最大の左端 L と次の境界 R を取れば、x の成分は半開区間 [L,R) と一意に分かる。 再着色後に左・右と同色なら境界だけを消せばよく、内部セルを更新しなくても成分表現は正しい。 成分境界は局所的にしか変わらず、predecessor/successor と高々二回の merge で各 query を O(log N) にできる。","sourceRevisionIds":["source-abc380-e-problem-dd8c10305a788a2a30b313d2210feba55617308d1e2496b89242163d2d5a0dd1","source-abc380-editorial-11356-041c38a9de6037d2568c49211fd531c4c502c153b71bf9b9b1787e13924fb222"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

- 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- 端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一度の塗替えは x を含む同色連続成分全体に作用し、その後に併合し得るのは左右隣の成分だけである。各色の総セル数も成分長の移動として差分更新できる。

採用する候補: 各連続成分の左端を ordered set で持ち、左端から右端と色を特定して再着色し、同色になった左右境界を削除する。

成分境界は局所的にしか変わらず、predecessor/successor と高々二回の merge で各 query を O(log N) にできる。

棄却する候補: type 1 ごとに x から左右へ同色セルを走査して全要素を書き換える。

大きな成分を何度も塗り直す query 列で Θ(NQ) になり得る。

境界 set で x 以下最大の左端 L と次の境界 R を取れば、x の成分は半開区間 [L,R) と一意に分かる。

再着色後に左・右と同色なら境界だけを消せばよく、内部セルを更新しなくても成分表現は正しい。

各位置を長さ1成分として境界set・左端色map・色別個数を初期化する。塗替えで旧色個数を R-L 減らし新色へ足し、右境界、次に左境界を同色なら削除する。count query は色別個数を返す。

## 典型の発動条件

### run-length interval の動的管理

発動条件: 区間全体への操作が同値 run を作り、隣接 run だけと併合する場合。

ordered set に run 左端を持ち、境界の挿入削除で列を表す。

## 問題固有の要素

セル列ではなく最大同色区間を原子にすると、一操作の変更箇所が定数個の境界になる。

別の問題へ持ち帰る視点: 区間長を色別集計へ差分反映すれば global count query も同時に解ける。

## 正当性

境界 set で x 以下最大の左端 L と次の境界 R を取れば、x の成分は半開区間 [L,R) と一意に分かる。 再着色後に左・右と同色なら境界だけを消せばよく、内部セルを更新しなくても成分表現は正しい。 成分境界は局所的にしか変わらず、predecessor/successor と高々二回の merge で各 query を O(log N) にできる。

## 実装上の注意

- 右端番兵 N+1 を置き、右 merge 後に左 predecessor を取り直す。色map を消す境界と残す左端を取り違えない。

## 復習の核

- [L,R) の再着色前後を図にし、右併合と左併合でどの境界を消すかを個別に確認する。

## 計算量と制約

### 時間

O(N+Q log N)、count照会O(1)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 1 \leq Q \leq 2 \times 10^5; In queries of the first type, 1 \leq x \leq N.; In queries of the first and second types, 1 \leq c \leq N.; There is at least one query of the second type.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc380/tasks/abc380_e) — source-abc380-e-problem-dd8c10305a788a2a30b313d2210feba55617308d1e2496b89242163d2d5a0dd1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc380/editorial/11356) — source-abc380-editorial-11356-041c38a9de6037d2568c49211fd531c4c502c153b71bf9b9b1787e13924fb222
