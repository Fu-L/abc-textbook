---
title: "ABC442-G — Lightweight Knapsack"
draft: true
authoringUnit: {"problemId":"abc442-g","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc442-g.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc442-editorial-15137-f9062b3b9b33f08c57c2c63af857ea694d32c7f63bab8f599644261528074d25","source-abc442-g-problem-786c4b7e64b2b3683fa610e7c89bbca283ff887a211e5bcba2c472babb3f0e46"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"F_i=R_i+(6/i)Q_i と分けると、Q_i 一単位は重さ i×(6/i)=6 の連続した価値群になる。 同じ重さの group は価値の高い順に選ぶだけで最適なので、三種類の group 列を統合した prefix 最大へ落ちる。 剰余の組は36通りしかなく、固定後は全候補の重さが同じ6なので prefix 和または merge で容量内の最良値を直接選べる。","sourceRevisionIds":["source-abc442-editorial-15137-f9062b3b9b33f08c57c2c63af857ea694d32c7f63bab8f599644261528074d25","source-abc442-g-problem-786c4b7e64b2b3683fa610e7c89bbca283ff887a211e5bcba2c472babb3f0e46"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

同じ重さの品物は価値上位から選べばよい。選択個数 F_i を重さ6に揃う単位 6/i の剰余 R_i と商部分に分けると、商部分はすべて重さ6の group になる。

採用する候補: 重さ別に価値降順 sort し、R_1∈[0,5],R_2∈[0,2],R_3∈[0,1] を全探索して、残りを 6/i 個ずつまとめた重さ6 group の価値上位を選ぶ。

剰余の組は36通りしかなく、固定後は全候補の重さが同じ6なので prefix 和または merge で容量内の最良値を直接選べる。

棄却する候補: 容量 W まで通常の 0/1 knapsack DP を全品物について行う。

W が大きく NW の状態を持てず、重さが1,2,3に限定される特殊性を利用していない。

F_i=R_i+(6/i)Q_i と分けると、Q_i 一単位は重さ i×(6/i)=6 の連続した価値群になる。

同じ重さの group は価値の高い順に選ぶだけで最適なので、三種類の group 列を統合した prefix 最大へ落ちる。

各重さの価値を降順に並べ prefix 和を作る。36通りの R を固定して先頭 R_i 個の価値と重量を取り、以後をサイズ6/iごとの group 和へ分割する。group を価値順に選べるだけ加えて最大を更新する。

## 典型の発動条件

### 最小公倍数による有限剰余case列挙

発動条件: 品物の重さ種類が少数の小整数に限られる knapsack のとき。

選択個数を6/iで割った剰余R_iを固定し、R_1×R_2×R_3の候補数を6×3×2=36通りに界して、残りを共通重量6のgroupへまとめる。

## 問題固有の要素

容量 DP を回す代わりに、少数重量の lcm を一単位として個数の端数だけ全探索する。

別の問題へ持ち帰る視点: 同重量の選択では、各個数に対する最適集合が価値降順 prefix になる性質を徹底して使う。

## 正当性

F_i=R_i+(6/i)Q_i と分けると、Q_i 一単位は重さ i×(6/i)=6 の連続した価値群になる。 同じ重さの group は価値の高い順に選ぶだけで最適なので、三種類の group 列を統合した prefix 最大へ落ちる。 剰余の組は36通りしかなく、固定後は全候補の重さが同じ6なので prefix 和または merge で容量内の最良値を直接選べる。

## 実装上の注意

- R_i 個を除いた位置から完全な group だけを作り、端数 group は混ぜない。負価値なら選ばない選択も残す。

## 復習の核

- F_i の商・剰余分解を書き、各 group の重量が本当に6で、価値上位 group の prefix が最適になることを示す。

## 計算量と制約

### 時間

O(N log N)、各重量のsortと36残数case、caseごとのgroup列merge。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; 1\leq C \leq 2\times 10^9; 1\leq W_i \leq 3; 1\leq V_i \leq 10^9; 1\leq K_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc442/editorial/15137) — source-abc442-editorial-15137-f9062b3b9b33f08c57c2c63af857ea694d32c7f63bab8f599644261528074d25
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc442/tasks/abc442_g) — source-abc442-g-problem-786c4b7e64b2b3683fa610e7c89bbca283ff887a211e5bcba2c472babb3f0e46
