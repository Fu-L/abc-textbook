---
title: "ABC314-G — Amulets"
draft: true
authoringUnit: {"problemId":"abc314-g","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc314-g.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange","unit-two-pointers-window"],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset","tag-greedy-exchange-order","tag-two-pointers-window"],"sourceRevisionIds":["source-abc314-editorial-6952-45640d7016a0ea86a83a2614d7b26e993e32e24a29c4f1e68e6d084d818e0df0","source-abc314-g-problem-f7e8cb27d04d7402d24779863a2b30886f8d1a1ef3eaea735f50e48c054a17f8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"T を未所持側として sum(T)<H を保ちつつ、T が C の小さい側 prefix になるよう max(T)≤min(S) を維持すれば |T| は最大である。 L_i は prefix とともに非減少なので、各 K の最大討伐数は L_i≤K となる最大 i を sweep または lower_bound で反転できる。 一歩で変わる C は一種類だけで、境界要素の交換を定数回行えば各 L_i を O(log M) で得られる。","sourceRevisionIds":["source-abc314-editorial-6952-45640d7016a0ea86a83a2614d7b26e993e32e24a29c4f1e68e6d084d818e0df0","source-abc314-g-problem-f7e8cb27d04d7402d24779863a2b30886f8d1a1ef3eaea735f50e48c054a17f8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

先頭 i 体を倒すため、持たない amulet の type j から受ける総 damage は prefix 集計 C_j になる。生存には選んだ未所持 type の C_j 合計が H 未満である必要がある。

未所持 amulet 数を最大にするなら C_j の小さい順に選ぶのが最適で、必要所持数 L_i は「総和 H 未満に入る最小値側の最大個数」の補数になる。

採用する候補: prefix を伸ばしながら C_{B_i} を更新し、small/large 二 multiset で和 H 未満となる最小 C の最大集合を動的維持する。

一歩で変わる C は一種類だけで、境界要素の交換を定数回行えば各 L_i を O(log M) で得られる。

棄却する候補: 各 i で全 M 個の C_j を sort し、H 未満まで貪欲に取り直す。

一回 O(M log M) を N prefix に行うと最大 9×10^10 規模で、差分一要素しか変わらないことを捨てている。

T を未所持側として sum(T)<H を保ちつつ、T が C の小さい側 prefix になるよう max(T)≤min(S) を維持すれば |T| は最大である。

L_i は prefix とともに非減少なので、各 K の最大討伐数は L_i≤K となる最大 i を sweep または lower_bound で反転できる。

初期 C_j=0 を全て未所持側 T に入れる。monster i を追加するたび type b の旧 C を属する multiset から削除し C_b+=A_i で再挿入する。T の和が H 以上なら最大を所持側 S へ、S の最小を T に戻せる間は戻し、順序逆転も交換して正規化する。L_i=M−|T| を記録し、K=0..M の最大 i を求める。

## 典型の発動条件

### 動的 k-smallest sum の二集合管理

発動条件: 一点更新される multiset から、和制約内に入る最小要素の最大個数を毎回求めるとき。

採用側と非採用側を境界で分け、和・最大・最小を持って rebalance する。

### 閾値列の逆引き

発動条件: 各 prefix の必要資源 L_i が単調で、資源量ごとの最大 prefix を全て求めるとき。

L を一度列挙し、two-pointer または lower_bound で各 K へ反転する。

## 問題固有の要素

amulet を選ぶ側でなく「置いていける type」を選ぶと、目的が個数最大・制約が damage 和という単純な最小値貪欲になる。

別の問題へ持ち帰る視点: ちょうど K 個守る問題では補集合を見て、値の小さいものを容量内へ最大個数詰める形を探す。

## 正当性

T を未所持側として sum(T)<H を保ちつつ、T が C の小さい側 prefix になるよう max(T)≤min(S) を維持すれば |T| は最大である。 L_i は prefix とともに非減少なので、各 K の最大討伐数は L_i≤K となる最大 i を sweep または lower_bound で反転できる。 一歩で変わる C は一種類だけで、境界要素の交換を定数回行えば各 L_i を O(log M) で得られる。

## 実装上の注意

- 生存条件は damage≤H−1、すなわち sum(T)<H の strict 条件。値が等しい type を識別できるよう (C_j,j) を key にする。

## 復習の核

- K ごとの冒険を直接解かず、各 prefix の必要最小 K を先に求める。二 multiset では和制約と境界順序の二つの不変条件を別々に検査する。

## 計算量と制約

### 時間

O((N+M)log M)、N魔物Mamulet種。L_iを反転する全K sweepはO(N+M)。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 3 \times 10^5; 1 \leq H \leq 10^9; 1 \leq A_i \leq 10^9; 1 \leq B_i \leq M; For each 1 \leq i \leq M, there is 1 \leq j \leq N such that B_j = i.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc314/editorial/6952) — source-abc314-editorial-6952-45640d7016a0ea86a83a2614d7b26e993e32e24a29c4f1e68e6d084d818e0df0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc314/tasks/abc314_g) — source-abc314-g-problem-f7e8cb27d04d7402d24779863a2b30886f8d1a1ef3eaea735f50e48c054a17f8
