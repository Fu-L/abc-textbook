---
title: "ABC449-E — A += v"
draft: true
authoringUnit: {"problemId":"abc449-e","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc449-e.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc449-e-problem-997a7ccb68b25fa3f77cd4e902582d044a8b91c43b69d203e02549bcbc08cc26","source-abc449-editorial-17253-4e8fa9484930c48248f543a8b9996139c2c021ca4abb754b9bfa4f34b2a34829"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"頻度順先頭 k 値が次の頻度 V_{k+1} へ追いつくまで、追加列はその k 値を昇順に並べた周期の繰り返しになる。 stage 終了時の長さ N+Σ k(V_{k+1}-V_k) は単調なので、X の所属 stage を二分探索できる。 同じ頻度水準では最小頻度集合が固定で、その集合を値順に一周追加すると全員の頻度が一増えるため、巨大な操作列を矩形 stage として数えられる。","sourceRevisionIds":["source-abc449-e-problem-997a7ccb68b25fa3f77cd4e902582d044a8b91c43b69d203e02549bcbc08cc26","source-abc449-editorial-17253-4e8fa9484930c48248f543a8b9996139c2c021ca4abb754b9bfa4f34b2a34829"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

各値の出現回数が最小の値を一回ずつ追加する操作は、初期頻度の低い値から同じ水準へ追いつく level ごとの stage にまとめられる。

採用する候補: 値を初期頻度で安定 sort し、stage k の反復回数 V_{k+1}-V_k と一周期に追加される先頭 k 値を求める。query X が属する stage と周期内順位を二分探索し、offline Fenwick tree で先頭 k 値の v 番目を答える。

同じ頻度水準では最小頻度集合が固定で、その集合を値順に一周追加すると全員の頻度が一増えるため、巨大な操作列を矩形 stage として数えられる。

棄却する候補: 配列長が X になるまで最小頻度値を priority queue から取り出して一つずつ追加する。

X が10^18級で、追加回数に比例する simulation は不可能である。

頻度順先頭 k 値が次の頻度 V_{k+1} へ追いつくまで、追加列はその k 値を昇順に並べた周期の繰り返しになる。

stage 終了時の長さ N+Σ k(V_{k+1}-V_k) は単調なので、X の所属 stage を二分探索できる。

各値の頻度を数え、(頻度,初出安定順)で P,V を作って stage 累積長を128 bitで計算する。各 query を stage k と周期内 rank v に変換し、k 昇順で P_1..P_k を値 index Fenwickへ追加して kth order statisticを返す。

## 典型の発動条件

### 頻度 level の一括 simulation

発動条件: 最小頻度要素を繰り返し増やす操作を巨大位置まで追いたいとき。

次の頻度へ追いつくまでを同一集合の周期としてまとめる。

### offline Fenwick kth

発動条件: prefix 集合 P_1..P_k の値順 v 番目を多数問うとき。

k 順に要素を追加し、累積頻度の lower_bound で kth を得る。

## 問題固有の要素

逐次的な最小頻度更新は、水位が次の group へ達するまで active set が変わらない water filling として圧縮できる。

別の問題へ持ち帰る視点: 二次元 query (prefix長,順位) は prefix長で offline sort し、順序統計 tree を一方向更新する。

## 正当性

頻度順先頭 k 値が次の頻度 V_{k+1} へ追いつくまで、追加列はその k 値を昇順に並べた周期の繰り返しになる。 stage 終了時の長さ N+Σ k(V_{k+1}-V_k) は単調なので、X の所属 stage を二分探索できる。 同じ頻度水準では最小頻度集合が固定で、その集合を値順に一周追加すると全員の頻度が一増えるため、巨大な操作列を矩形 stage として数えられる。

## 実装上の注意

- 初期配列内の X≤N はそのまま答え、無限最後 stage を別扱いする。stage 長の積は64 bitを超え得る。

## 復習の核

- 小さな頻度表で追加列を実際に書き、stage の周期・終了長・周期内0/1-origin順位の式を照合する。

## 計算量と制約

### 時間

O((N+Q)log(N+Q))、N入力長、distinct stage数≤N、offline kth選択。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N,M\le 5\times 10^5; 1\le A_i \le M; 1\le Q\le 2\times 10^5; 1\le X_i \le 10^{18}; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/tasks/abc449_e) — source-abc449-e-problem-997a7ccb68b25fa3f77cd4e902582d044a8b91c43b69d203e02549bcbc08cc26
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/editorial/17253) — source-abc449-editorial-17253-4e8fa9484930c48248f543a8b9996139c2c021ca4abb754b9bfa4f34b2a34829
