---
title: "ABC222-E — Red and Blue Tree"
draft: true
authoringUnit: {"problemId":"abc222-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc222-e.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource","tag-contribution-reordering"],"sourceRevisionIds":["source-abc222-e-problem-66346b14b7b00a2cf4c6f7a62e715f4396dfffe5f6510c009dabb84dd57c2a75","source-abc222-editorial-2751-4c6263ecd939d2c7d814aacdf3a72b228b6a7db9ec6a206adaa6fc4962cd7f6c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"木pathは一意なので各辺の通過Cが確定する。赤寄与R、青寄与BについてR+B=S,R−B=KよりR=(S+K)/2。赤辺subsetをこの和で数えることは彩色と一対一。負・奇数・範囲外目標なら不可能。","sourceRevisionIds":["source-abc222-e-problem-66346b14b7b00a2cf4c6f7a62e715f4396dfffe5f6510c009dabb84dd57c2a75","source-abc222-editorial-2751-4c6263ecd939d2c7d814aacdf3a72b228b6a7db9ec6a206adaa6fc4962cd7f6c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

色を決める前から駒が通る道は木の一意な単純路で確定しているため、各辺が何回使われるかだけを先に数えれば、移動列そのものは以後の判定に不要になる。 S=ΣC_e とおくと R+B=S なので、R-B=K は赤い辺に対応する C_e の和が (S+K)/2 であることと同値になる。 S+K が奇数、または目標和が 0 未満・S より大きい場合は不可能であり、C_e=0 の辺も二つの色を別の選択としてDPに通す必要がある。

採用する候補: 連続する A_i,A_{i+1} 間のパスから各辺の通過回数 C_e を求め、赤にする辺の通過回数の和を数える部分和DPへ変換する。

色の寄与が辺ごとの C_e に分離し、R-B=K を一つの部分和条件へ直せるため、2^(N-1) 通りの彩色を列挙せずに数えられる。

棄却する候補: 全ての辺の赤青を列挙し、各彩色について移動列を再現して R-B を調べる。

辺数に対して指数個の彩色があり、N=1000 では列挙できないうえ、同じ辺を通る移動を何度も評価してしまう。

S=ΣC_e とおくと R+B=S なので、R-B=K は赤い辺に対応する C_e の和が (S+K)/2 であることと同値になる。

S+K が奇数、または目標和が 0 未満・S より大きい場合は不可能であり、C_e=0 の辺も二つの色を別の選択としてDPに通す必要がある。

各 A_i から A_{i+1} への木上パスをDFSで復元して C_e を加算し、目標 (S+K)/2 に対して C_e を一度ずつ選ぶ0/1部分和DPを行う。

## 典型の発動条件

### 木上パスの辺使用回数への圧縮

発動条件: 木上の複数の移動に対し、最終評価が各辺を通った回数と辺属性だけで決まるとき。

一意なパスごとに辺カウンタを加算し、長い移動列を N-1 個の独立な辺の重み C_e へ縮約する。

### 符号割当てから部分和DPへの変換

発動条件: 各要素を正負のどちらかへ割り当て、その符号付き総和を指定値にしたいとき。

総和 S と符号差 K から正側の和を (S+K)/2 と定め、各 C_e を選ぶかどうかの数え上げにする。

## 問題固有の要素

辺の色は全移動で共通でも、色が答えに与える影響は『その辺の総通過回数』だけなので、時系列と彩色を分離できる。

別の問題へ持ち帰る視点: 同じ選択が多数のイベントへ繰り返し作用するときは、イベントを再生する代わりに選択対象ごとの使用回数を集計する。

## 正当性

木pathは一意なので各辺の通過Cが確定する。赤寄与R、青寄与BについてR+B=S,R−B=KよりR=(S+K)/2。赤辺subsetをこの和で数えることは彩色と一対一。負・奇数・範囲外目標なら不可能。

## 実装上の注意

- S+K の偶奇と目標和の範囲をDP前に検査し、C_e=0 でも『赤にする・青にする』の二遷移を残す。

## 復習の核

- 『正側の和−負側の和』を見たら、まず全体和との連立で片側の和を決められないか確認する。

## 計算量と制約

### 時間

N頂点、訪問列長M、全通過回数S。各path DFS O(NM)、0/1 DP O(NS)。

### 空間

木、辺回数 O(N)、和DP O(S)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 1000; 2 \leq M \leq 100; |K| \leq 10^5; 1 \leq A_i \leq N; 1\leq U_i,V_i\leq N; The given graph is a tree.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/tasks/abc222_e) — source-abc222-e-problem-66346b14b7b00a2cf4c6f7a62e715f4396dfffe5f6510c009dabb84dd57c2a75
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/editorial/2751) — source-abc222-editorial-2751-4c6263ecd939d2c7d814aacdf3a72b228b6a7db9ec6a206adaa6fc4962cd7f6c
