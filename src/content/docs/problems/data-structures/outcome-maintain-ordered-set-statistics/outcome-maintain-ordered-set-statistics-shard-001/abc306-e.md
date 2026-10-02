---
title: "ABC306-E — Best Performances"
draft: true
authoringUnit: {"problemId":"abc306-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc306-e.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc306-e-problem-7a0c907258114d906490202c29dd06ecd0183d802838a4082c7ffe19ef006fdd","source-abc306-editorial-6607-dfd76b13871fadcbf924ade6be1e1d08f663f009c7365a5820cfc4eef2479928"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"duplicate valuesがあるためvalue→一意位置ではなくmultisetを使い、eraseは該当iterator一個だけを削除する。 Xへの出入りと同時にrunning sum sを加減すれば、毎回K要素を走査せず答えを出せる。 一updateで境界を跨ぐ要素は定数個で、各insert/erase/moveをO(log N)で処理できる。","sourceRevisionIds":["source-abc306-e-problem-7a0c907258114d906490202c29dd06ecd0183d802838a4082c7ffe19ef006fdd","source-abc306-editorial-6607-dfd76b13871fadcbf924ade6be1e1d08f663f009c7365a5820cfc4eef2479928"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

求める値はmultiset Aのlargest K elementsの和なので、要素のindexではなく境界を挟む二つのmultisetsだけを維持すればよい。

top側Xを常にsize Kかつmin(X)≥max(Y)、rest側Yを残りと保てば、保持するsum(X)が各queryの答えになる。

棄却する候補: 各update後にA全体をsortして先頭K個を合計する。

Q回のO(N log N) sortはN,Q=50万で不可能である。

採用する候補: top Kとremaining valuesを二つのmultisetへ分け、old valueの削除・new valueの追加後に境界要素を移してbalanceする。

一updateで境界を跨ぐ要素は定数個で、各insert/erase/moveをO(log N)で処理できる。

duplicate valuesがあるためvalue→一意位置ではなくmultisetを使い、eraseは該当iterator一個だけを削除する。

Xへの出入りと同時にrunning sum sを加減すれば、毎回K要素を走査せず答えを出せる。

dynamic top-K aggregateをorder-statistic boundaryで二分したmultisetsとrunning sumにより維持する。

## 典型の発動条件

### 二つのmultisetによるtop-K維持

発動条件: point updatesのたびに全要素中のlargest Kまたはsmallest Kのaggregateが必要なとき。

selected/unselected multisetsをsizeとboundary orderの不変条件でbalanceする。

### 選択集合のrunning aggregate

発動条件: data structure間の要素移動を追跡でき、selected sideのsum等を即時取得したいとき。

Xへのinsertで加算、eraseで減算してsumを同期する。

## 問題固有の要素

初期値0をK個X、N−K個Yへ置けば最初からinvariantが成立し、index arrayは各updateで消すold valueだけを与える。

別の問題へ持ち帰る視点: 順位集合の更新では、値の所属を検索して削除し、境界不変条件から所属を再決定する。

## 正当性

duplicate valuesがあるためvalue→一意位置ではなくmultisetを使い、eraseは該当iterator一個だけを削除する。 Xへの出入りと同時にrunning sum sを加減すれば、毎回K要素を走査せず答えを出せる。 一updateで境界を跨ぐ要素は定数個で、各insert/erase/moveをO(log N)で処理できる。

## 実装上の注意

- K=NやN=1ではYがemptyになるので、min/max参照前にempty checkを行う。
- sumは最大5×10^14になるため64 bitを使い、duplicate削除はfindで得た一要素だけにする。

## 復習の核

- 固定順位までのaggregateは、境界の両側を別containerにしてsize/order invariantを明示する。
- selected集合が局所的に変わるならaggregateも移動時だけ差分更新する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le K \le N \le 5 \times 10^5; 1 \le Q \le 5 \times 10^5; 1 \le X_i \le N; 0 \le Y_i \le 10^9

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/tasks/abc306_e) — source-abc306-e-problem-7a0c907258114d906490202c29dd06ecd0183d802838a4082c7ffe19ef006fdd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/editorial/6607) — source-abc306-editorial-6607-dfd76b13871fadcbf924ade6be1e1d08f663f009c7365a5820cfc4eef2479928
