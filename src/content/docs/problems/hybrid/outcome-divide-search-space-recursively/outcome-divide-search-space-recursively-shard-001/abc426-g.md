---
title: "ABC426-G — Range Knapsack Query"
draft: true
authoringUnit: {"problemId":"abc426-g","docPath":"src/content/docs/problems/hybrid/outcome-divide-search-space-recursively/outcome-divide-search-space-recursively-shard-001/abc426-g.md","learningOutcomeIds":["outcome-divide-search-space-recursively"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource"],"excludedTopics":["再帰分割・分割統治の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-recursive-divide-and-conquer","tag-knapsack-resource"],"sourceRevisionIds":["source-abc426-editorial-14152-f056049ecde829dec68a330e8a32e5f30cc4fa20790da1a4bcfe72cb66623b15","source-abc426-g-problem-80a35605001b68778e1e50ec302320928b9098d034248db93b8edfa8cf50ffc8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間 [l,r] の中央 m に対し、L<m≤R のクエリだけをこの節点で処理し、片側に収まるものは再帰へ送る。 容量 j を左に、C-j を右に配る全分割を試せば、左右で独立に選んだ最適値の和が区間全体の最適値になる。 各要素は深さごとに一度 DP 更新へ寄与し、各クエリも一節点で処理されるため O(K(N log N+Q)) になる。","sourceRevisionIds":["source-abc426-editorial-14152-f056049ecde829dec68a330e8a32e5f30cc4fa20790da1a4bcfe72cb66623b15","source-abc426-g-problem-80a35605001b68778e1e50ec302320928b9098d034248db93b8edfa8cf50ffc8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

- pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。

先に読む単元:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md) — 最小十分状態を設計できるようになった後、選択数・容量・費用などの資源軸で遷移を表し、0/1選択と無制限選択の更新方向を区別する。

## 考察

各クエリは部分配列 [L,R] 内の 0/1 ナップサックで、容量 C は小さい。区間ごとに DP を作ると重複が大きいが、分割点をまたぐクエリは左右の DP を合成できる。

採用する候補: 配列を分割統治し、各節点で中央をまたぐ全クエリへ左 suffix DP と右 prefix DP を構築して答える。

各要素は深さごとに一度 DP 更新へ寄与し、各クエリも一節点で処理されるため O(K(N log N+Q)) になる。

棄却する候補: クエリごとに [L,R] の全アイテムでナップサック DP をやり直す。

区間の重複を共有できず O(NKQ) に達する。

区間 [l,r] の中央 m に対し、L<m≤R のクエリだけをこの節点で処理し、片側に収まるものは再帰へ送る。

容量 j を左に、C-j を右に配る全分割を試せば、左右で独立に選んだ最適値の和が区間全体の最適値になる。

solve(l,r) で m を定め、i=m-1…l の suffix ナップサック dp_l[i][j] と i=m…r の prefix ナップサック dp_r[i][j] を容量 K まで作る。中央をまたぐ各クエリを max_j(dp_l[L][j]+dp_r[R][C-j]) で答え、残りを左右へ再帰する。

## 典型の発動条件

### オフライン区間分割統治

発動条件: 静的配列上の多数の区間クエリを、中央をまたぐものと片側のものへ分類できるとき。

各クエリを両端が初めて分かれる節点で一度だけ処理する。

### prefix・suffix ナップサック DP

発動条件: 区間が固定境界をまたぎ、左右の選択が容量配分だけで結合するとき。

中央から外向きにアイテムを追加した DP を全端点分共有する。

## 問題固有の要素

クエリ区間そのものではなく、再帰木で両端が分離する唯一の節点を担当箇所にすると DP の再利用範囲が最大化する。

別の問題へ持ち帰る視点: 結合条件が小さい容量だけなら、左右の区間情報を容量配分の max-plus 畳み込みで合成できる。

## 正当性

区間 [l,r] の中央 m に対し、L<m≤R のクエリだけをこの節点で処理し、片側に収まるものは再帰へ送る。 容量 j を左に、C-j を右に配る全分割を試せば、左右で独立に選んだ最適値の和が区間全体の最適値になる。 各要素は深さごとに一度 DP 更新へ寄与し、各クエリも一節点で処理されるため O(K(N log N+Q)) になる。

## 実装上の注意

- 左 DP は m-1 から降順、右 DP は m から昇順にコピー更新する。容量以下の最大値として j=0 を 0 に初期化し、到達不能値の扱いを統一する。

## 復習の核

- 中央をまたぐ条件を L<m≤R と統一し、各クエリがちょうど一つの再帰節点で回答されることを確認する。

## 計算量と制約

### 時間

O(NK log N+QK)、N品数K最大容量Q区間query。

### 空間

O(NK+Q)、親配列を解放してから子へ再帰する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^4; 1\leq Q \leq 2\times 10^5; 1\leq W_i \leq 500; 1\leq V_i \leq 10^9; 1\leq L_j \leq R_j \leq N; 1\leq C_j \leq 500; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc426/editorial/14152) — source-abc426-editorial-14152-f056049ecde829dec68a330e8a32e5f30cc4fa20790da1a4bcfe72cb66623b15
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc426/tasks/abc426_g) — source-abc426-g-problem-80a35605001b68778e1e50ec302320928b9098d034248db93b8edfa8cf50ffc8
