---
title: "ABC321-F — #(subset sum = K) with Add and Erase"
draft: true
authoringUnit: {"problemId":"abc321-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc321-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc321-editorial-7262-d2b9b8860ec2cfdca0a6b3fb6537c169e4fea09cadf1a78b75ec513a07f2835c","source-abc321-f-problem-db02ce3276d716fc8807c4554c30ea699cb92847de58b49207b5ed44b19feb68"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一個の値x球は母関数因子1+t^x。追加の降順更新は旧係数だけ参照して一因子を掛ける。削除の昇順更新は old[s]=new[s]+new[s−x] を順に解いて一因子を割る。重複球も因子を別に持つため個体別部分集合数を保つ。","sourceRevisionIds":["source-abc321-editorial-7262-d2b9b8860ec2cfdca0a6b3fb6537c169e4fea09cadf1a78b75ec513a07f2835c","source-abc321-f-problem-db02ce3276d716fc8807c4554c30ea699cb92847de58b49207b5ed44b19feb68"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

箱内の各ballを選ぶか否かは生成関数のfactor (1+z^x)に対応し、dp[s]は全factor積のz^s係数である。 ball xの追加は通常の0/1 subset sumとしてsを降順にdp[s]+=dp[s-x]と更新すれば、同じballを一度だけ使う。 削除前oldと削除後newはold[s]=new[s]+new[s-x]を満たすので、s昇順にnew[s]=old[s]-new[s-x]と逆変換できる。 追加のin-place更新を逆に解くとloop方向も逆になり、昇順ならdp[s-x]が既にnewへ更新済みである。 sum Kより大きい係数は非負weightしかないためdp[0..K]へ戻って影響せず、truncateしたまま可逆更新できる。

採用する候補: 長さK+1のsubset-sum DPを保持し、追加遷移を降順、削除をその逆の昇順減算で更新する。

各operationをKに比例する処理で反映し、distinguishableな重複ballもfactor単位で正確に扱える。

棄却する候補: 各query後に箱内の全ballからsubset-sum DPを作り直す。

Q回それまでのball数を再走査し、最大でQ^2K規模になる。

棄却する候補: 削除時も追加と同じ降順でdp[s]-=dp[s-x]とする。

右辺に必要なのは削除後new[s-x]だが、降順ではまだold値のままで逆変換にならない。

追加のin-place更新を逆に解くとloop方向も逆になり、昇順ならdp[s-x]が既にnewへ更新済みである。

sum Kより大きい係数は非負weightしかないためdp[0..K]へ戻って影響せず、truncateしたまま可逆更新できる。

dp[0]=1、他0で始める。+xではs=K..xの降順にdp[s]+=dp[s-x]、-xではs=x..Kの昇順にdp[s]-=dp[s-x]を行い、mod 998244353で正規化する。各operation後のdp[K]を出力する。x>Kなら保持範囲の係数は変化しない。

## 典型の発動条件

### 動的subset-sum DP

発動条件: itemの追加削除後に同じ目標和の個数を繰り返し問われるとき。

生成関数factorの乗除を係数array上の一次更新として行う。

### in-place遷移の逆演算

発動条件: triangularなDP更新をonlineで取り消したいとき。

依存方向を反転し、既に復元済みの値から元factorを除く。

### 次数truncate

発動条件: weightが非負で目標係数Kだけを必要とするとき。

degree>Kを保持せず更新する。

## 問題固有の要素

削除を別data structureへ持ち込まず、追加式old=new·(1+z^x)を低次数から解くことでfactor divisionをO(K)の整数DPへ落とせる。

別の問題へ持ち帰る視点: online削除では、追加遷移が三角行列なら走査順を逆にして局所的にinvertできないか調べる。

## 正当性

一個の値x球は母関数因子1+t^x。追加の降順更新は旧係数だけ参照して一因子を掛ける。削除の昇順更新は old[s]=new[s]+new[s−x] を順に解いて一因子を割る。重複球も因子を別に持つため個体別部分集合数を保つ。

## 実装上の注意

- 同じ値のballも区別されるので、追加・削除1回ごとにfactorを1つだけ掛け外し、個数でまとめて0/1扱いしない。
- 減算後は負値へmodを足し、dp[0]=1が全operation後も保たれることを確認する。

## 復習の核

- 同じxのballを2個追加して1個削除する例で係数1,2,1が1,1へ戻ることを追い、削除loopが昇順である理由を確認する。

## 計算量と制約

### 時間

操作数Q、目标K。各追加削除 O(K)、全体 O(QK)。

### 空間

係数dp[0..K] O(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le Q \le 5000; 1 \le K \le 5000; For each type-1 operation, 1 \le x \le 5000.; All the operations satisfy the condition in the problem statement.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc321/editorial/7262) — source-abc321-editorial-7262-d2b9b8860ec2cfdca0a6b3fb6537c169e4fea09cadf1a78b75ec513a07f2835c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc321/tasks/abc321_f) — source-abc321-f-problem-db02ce3276d716fc8807c4554c30ea699cb92847de58b49207b5ed44b19feb68
