---
title: "ABC381-F — 1122 Subsequence"
draft: true
authoringUnit: {"problemId":"abc381-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-002/abc381-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc381-editorial-11408-e28925a36a1cc0462a58855ec2b49a1d989b5e9f61e0ee91cd9c99f91bda87aa","source-abc381-f-problem-83a041909bdba22c82453addbdbc034a229cddb66e0846a3e5cfab78226b857d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"maskで使った各値は隣接二出現のblockとして選ぶ。未使用値の最初二出現を現在終点後から選ぶと、同値二個を選ぶどの他の選択より終点が早く全将来に優越する。maskごと最短終点だけ残す帰納法で全feasible値集合を見つけ最大2popcountを得る。","sourceRevisionIds":["source-abc381-editorial-11408-e28925a36a1cc0462a58855ec2b49a1d989b5e9f61e0ee91cd9c99f91bda87aa","source-abc381-f-problem-83a041909bdba22c82453addbdbc034a229cddb66e0846a3e5cfab78226b857d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

値は1..20で、1122部分列では各採用値をちょうど二回ずつ使うため長さは最大40である。採用値集合 S が同じなら、最も早く作れる終了位置だけ残せば以後の拡張可能性を完全に表せる。 同じ集合 S を作る方法のうち終了位置が早いものは、遅いものが可能な全ての将来追加を同様に行えるため支配する。 next(pos,x) を前計算すれば、x を二回追加した終了位置は next(next(dp[S],x),x) と書ける。

採用する候補: dp[S] を各値を二回ずつ並べた部分列を作れる最小終了位置とし、S から最後の値 x を除いた状態の後に x の次出現を二回辿って更新する bit DP を行う。

2^20 状態と各状態の set bit 遷移で O(20·2^20)、次出現表で各遷移 O(1) にできる。

棄却する候補: 長さ40以下の全ての部分列 index を DFS して 1122 条件を確認する。

N が2×10^5で短い長さでも部分列数は組合せ爆発し、値集合の小ささを使えていない。

同じ集合 S を作る方法のうち終了位置が早いものは、遅いものが可能な全ての将来追加を同様に行えるため支配する。

next(pos,x) を前計算すれば、x を二回追加した終了位置は next(next(dp[S],x),x) と書ける。

各位置と値の次出現 index を後ろから前計算する。dp[0]=0、他をINFとし、mask と未使用値 x について二回 next を適用して dp[mask|1<<x] を chmin する。到達 mask の最大 popcount×2を返す。

## 典型の発動条件

### 最早終了位置を値にする bit DP

発動条件: 種類数が小さい部分列選択で、同じ集合なら早い終了だけが優越するとき。

mask ごとに最小 prefix 長を保持し next occurrence で遷移する。

## 問題固有の要素

部分列そのものを状態にせず、採用済み値集合と将来余地を最大化する最早位置だけへ圧縮する。

別の問題へ持ち帰る視点: 各値をちょうど二回という規則が、遷移を next の二重適用へする。

## 正当性

maskで使った各値は隣接二出現のblockとして選ぶ。未使用値の最初二出現を現在終点後から選ぶと、同値二個を選ぶどの他の選択より終点が早く全将来に優越する。maskごと最短終点だけ残す帰納法で全feasible値集合を見つけ最大2popcountを得る。

## 実装上の注意

- 値を0-origin bitへ直し、INF に next を適用しない。dp[empty] の位置0と配列 index の番兵規約を統一する。

## 復習の核

- 同じ mask の二つの終了位置を比較し、早い方だけで十分という支配性を次の二出現選択から説明する。

## 計算量と制約

### 時間

列長N、値種C=20。next表 O(NC)、subset DP O(C2^C)。

### 空間

next表 O(NC)、最短終点DP O(2^C)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2 \times 10^5; 1\leq A_i \leq 20; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc381/editorial/11408) — source-abc381-editorial-11408-e28925a36a1cc0462a58855ec2b49a1d989b5e9f61e0ee91cd9c99f91bda87aa
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc381/tasks/abc381_f) — source-abc381-f-problem-83a041909bdba22c82453addbdbc034a229cddb66e0846a3e5cfab78226b857d
