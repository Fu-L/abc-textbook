---
title: "ABC308-G — Minimum Xor Pair Query"
draft: true
authoringUnit: {"problemId":"abc308-g","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc308-g.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc308-g-problem-5f1e37a4408da6b0b3ff6f2ac5d4239bd0610d292685302a43f32136cf30268a","source-abc308-editorial-6707-1e3beaaaa4cc22ca819353d6cc0d97f74a2ac4ff027f5854b7841956d497e107"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"insert xで旧pred-succ xorを消し、pred-xとx-succを追加する。eraseではこの操作を逆にする。 duplicate xも別要素として隣接しxor 0を生成するため、valuesもcandidate XORsもsetではなくmultisetで管理する。 minimum候補の完全性がadjacency lemmaで保証され、各queryをO(log Q)で処理できる。","sourceRevisionIds":["source-abc308-g-problem-5f1e37a4408da6b0b3ff6f2ac5d4239bd0610d292685302a43f32136cf30268a","source-abc308-editorial-6707-1e3beaaaa4cc22ca819353d6cc0d97f74a2ac4ff027f5854b7841956d497e107"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

sorted values x<y<zについてmin(x xor y,y xor z)<x xor zなので、global minimum XOR pairはsorted multisetのadjacent pairに必ず存在する。

一要素のinsert/eraseで変化するadjacenciesはそのpredecessor・itself・successor周辺だけである。

棄却する候補: type 3ごとに全pairsのXORを計算する。

一queryで要素数の二乗が必要になる。

採用する候補: valuesのordered multisetと全adjacent XORsのmultisetを持ち、local edgesだけ差分更新して候補multiset最小を返す。

minimum候補の完全性がadjacency lemmaで保証され、各queryをO(log Q)で処理できる。

insert xで旧pred-succ xorを消し、pred-xとx-succを追加する。eraseではこの操作を逆にする。

duplicate xも別要素として隣接しxor 0を生成するため、valuesもcandidate XORsもsetではなくmultisetで管理する。

minimum XOR pairをnumeric-order adjacencyへ局所化し、dynamic ordered multisetのneighbor-edge aggregateとして維持する。

## 典型の発動条件

### XOR minimumの隣接性

発動条件: 整数集合からminimum pairwise XORを求めたいとき。

numeric sortで隣接するpairsだけをcandidateにする。

### 動的順序集合の局所gap更新

発動条件: ordered elementsのadjacent-pair functionをinsert/erase下で維持したいとき。

更新点前後のold edgeを除きnew edgesを追加する。

## 問題固有の要素

x,zが初めて異なるhighest bitに対し、中間yはx側かz側のbitを持つので片方のadjacent XORはそのbit未満になる。

別の問題へ持ち帰る視点: bitwise distanceの最小pairはhighest-differing-bitのorder argumentで隣接候補へ絞れる。

## 正当性

insert xで旧pred-succ xorを消し、pred-xとx-succを追加する。eraseではこの操作を逆にする。 duplicate xも別要素として隣接しxor 0を生成するため、valuesもcandidate XORsもsetではなくmultisetで管理する。 minimum候補の完全性がadjacency lemmaで保証され、各queryをO(log Q)で処理できる。

## 実装上の注意

- begin/end sentinelを跨いでxorを作らず、candidate multisetからも該当値一個だけをeraseする。
- erase対象iteratorを得てneighborsを先に保存し、container変更後のiterator invalidationを避ける。

## 復習の核

- 全pair最小値はsort order上の非隣接pairを中間点で改善できる性質がないか調べる。
- adjacent-pair aggregateの更新はinserted/deleted node周辺のedge差分だけを管理する。

## 計算量と制約

### 時間

O(Q log Q)。

### 空間

O(Q)、値multisetと隣接XOR multiset。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq Q \leq 3\times 10^5; 0\leq x < 2 ^{30}; When a query 2 is given, at least one x is written on the blackboard.; When a query 3 is given, at least two integers are written on the blackboard.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/tasks/abc308_g) — source-abc308-g-problem-5f1e37a4408da6b0b3ff6f2ac5d4239bd0610d292685302a43f32136cf30268a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/editorial/6707) — source-abc308-editorial-6707-1e3beaaaa4cc22ca819353d6cc0d97f74a2ac4ff027f5854b7841956d497e107
