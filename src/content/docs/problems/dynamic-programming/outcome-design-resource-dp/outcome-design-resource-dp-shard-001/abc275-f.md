---
title: "ABC275-F — Erase Subarrays"
draft: true
authoringUnit: {"problemId":"abc275-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc275-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc275-editorial-5140-33e30d6f15367f3a5208b8ca2e5bcee240b76d6a3a84e356f18d66328559f2de","source-abc275-f-problem-bdd85c388ee0c3ba859aafd6e162e1ecaa453bdd3e6a5714ac9e83a67fd86834"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"削除操作数は消す位置の連続run数。直前が保持なら削除開始で1、削除なら継続で0を加えるとrun数を正確に数える。和と直前bitは未来の費用に十分なので同状態最小だけ残せる。","sourceRevisionIds":["source-abc275-editorial-5140-33e30d6f15367f3a5208b8ca2e5bcee240b76d6a3a84e356f18d66328559f2de","source-abc275-f-problem-bdd85c388ee0c3ba859aafd6e162e1ecaa453bdd3e6a5714ac9e83a67fd86834"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

最終的に各 a_i を残すか消すかを b_i∈{1,0} で表すと、目標和は Σa_i b_i=x になる。1 回の操作で消せるのは元の添字上で連続する 0 の塊であり、必要操作数は 0-run の個数、すなわち 1→0 の境界数になる。b_0=1 と仮定すれば、先頭から削除する場合も通常の 1→0 遷移として数えられ、端の特別扱いが消える。a_i は正なので、残した和が M を超えた状態は将来 1,…,M に戻らず、保持しなくてよい。

採用する候補: prefix、残した要素の和、直前を残したかの DP で、0-run を開始する時だけ費用 1 を加える。

和の knapsack 状態に直前 bit を足すだけで、区間削除回数を局所遷移として数えられる。

棄却する候補: 通常の部分和 DP で消した要素数を最小化する。

同じ個数を消しても連続なら 1 操作、分散すれば複数操作なので、削除個数は目的関数を表さない。

dp[sum][last] を最小操作数として dp[0][1]=0 から始める。a_i を残すなら sum+a_i,last=1 へ同費用、消すなら sum,last=0 へ last=1 のときだけ +1 して更新し、各 x の min(dp[x][0],dp[x][1]) を出す。

## 典型の発動条件

### run 数を数える 0/1 DP

発動条件: 選択結果の連続 block 数が費用になり、左から 1 要素ずつ決められるとき。

直前の選択状態を持ち、block を開始する境界でだけ費用を増やす。

### 目的値で切る knapsack

発動条件: 重みが正で、必要な部分和が上限 M までに限られるとき。

sum≤M の状態だけを保持して全 x の最小費用を同時に求める。

## 問題固有の要素

区間を何度消すかという操作列を、最終的な keep/delete 列の 0-run 数へ変換すると、操作順序が消えて局所 DP になる。

別の問題へ持ち帰る視点: 区間操作の最小回数では、最終状態を二値列にして変化点や連結成分数として費用を書けないか調べる。

## 正当性

削除操作数は消す位置の連続run数。直前が保持なら削除開始で1、削除なら継続で0を加えるとrun数を正確に数える。和と直前bitは未来の費用に十分なので同状態最小だけ残せる。

## 実装上の注意

- 到達不能を十分大きい INF で初期化し、rolling array を使う場合は各 i で次配列を初期化する。
- 最後が削除中でもその 0-run は開始時に既に数えているため、末尾で追加費用は不要である。

## 復習の核

- keep/delete 列 1001011000 の 0-run と操作数を対応させ、先頭・末尾の 0-run が遷移のどこで数えられるか追跡する。

## 計算量と制約

### 時間

列長N、出力和上限M。二bit knapsack O(NM)。

### 空間

rolling sum×last O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,M \leq 3000; 1 \leq a_i \leq 3000; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/editorial/5140) — source-abc275-editorial-5140-33e30d6f15367f3a5208b8ca2e5bcee240b76d6a3a84e356f18d66328559f2de
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/tasks/abc275_f) — source-abc275-f-problem-bdd85c388ee0c3ba859aafd6e162e1ecaa453bdd3e6a5714ac9e83a67fd86834
