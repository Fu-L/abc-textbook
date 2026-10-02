---
title: "ABC448-F — Authentic Traveling Salesman Problem"
draft: true
authoringUnit: {"problemId":"abc448-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-002/abc448-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc448-editorial-16776-3bc7b72384fc188ec6b67c28ddf6a6693a283de4ce56f68b910592f6556b75c5","source-abc448-f-problem-1d4b90b63b2d294b7123ff349949419179a137fe39504cf132e8ad287f5c2f86"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"隣り合う strip で y の走査向きを反転すると、strip 境界で上下端を毎回往復せず蛇行してつながる。 W^2/B と NB の trade-off は B=W/√N 付近で均衡し、総距離が O(W√N) になる。 縦移動総量は O(W^2/B)、同 strip 内横移動は O(NB)、strip 間と閉路復帰は O(W) となり、B の選択で制限内に収まる。","sourceRevisionIds":["source-abc448-editorial-16776-3bc7b72384fc188ec6b67c28ddf6a6693a283de4ce56f68b910592f6556b75c5","source-abc448-f-problem-1d4b90b63b2d294b7123ff349949419179a137fe39504cf132e8ad287f5c2f86"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

要求は全点を一度ずつ訪れて戻る Hamilton cycle であり、最短でなく総 Manhattan 距離10^10以下ならよい。平面を縦 strip に分けて y 順を交互反転すると移動量を評価できる。

採用する候補: 幅 B≈W/√N の x strip に点を分類し、strip 番号昇順、内部は奇偶で y 昇順・降順に蛇行 sort して巡回順を構成する。

縦移動総量は O(W^2/B)、同 strip 内横移動は O(NB)、strip 間と閉路復帰は O(W) となり、B の選択で制限内に収まる。

棄却する候補: 任意の点から常に最も近い未訪問点へ進む nearest-neighbor 貪欲を行う。

局所貪欲には総距離上限の保証がなく、全候補探索も O(N^2) で制約を超える。

隣り合う strip で y の走査向きを反転すると、strip 境界で上下端を毎回往復せず蛇行してつながる。

W^2/B と NB の trade-off は B=W/√N 付近で均衡し、総距離が O(W√N) になる。

座標幅 W と N から整数 B を選び、key=(floor(x/B), parityに応じた ±y) で sort する。得た巡回列を点1が先頭になるよう rotate して全 index を出力し、末尾から先頭へ戻る。

## 典型の発動条件

### 空間 strip の蛇行構成

発動条件: 平面上の全点巡回を厳密最適化せず距離上界付きで構成したいとき。

細長い領域ごとに順方向を交互にして Hamilton cycle を作る。

### 上界式の parameter balancing

発動条件: 構成コストが A/B+CB の形で評価できるとき。

二項を均衡させる B を選んで最悪上界を最小化する。

## 問題固有の要素

出力構築問題では最適 TSP を解かず、制約値を下回ることを証明できる規則的巡回を設計する。

別の問題へ持ち帰る視点: Mo順のような蛇行 sort は、区画をまたぐたびの大きな座標方向の戻りを相殺する。

## 正当性

隣り合う strip で y の走査向きを反転すると、strip 境界で上下端を毎回往復せず蛇行してつながる。 W^2/B と NB の trade-off は B=W/√N 付近で均衡し、総距離が O(W√N) になる。 縦移動総量は O(W^2/B)、同 strip 内横移動は O(NB)、strip 間と閉路復帰は O(W) となり、B の選択で制限内に収まる。

## 実装上の注意

- B を0にせず整数丸め後の距離上界を確認する。全点を一度ずつ出力し、点1への rotate と閉路の最後の辺を忘れない。

## 復習の核

- 縦・同strip横・strip間・閉路復帰の四項を別々に上界評価し、選んだ B で10^10以下となる数値まで確認する。

## 計算量と制約

### 時間

O(N log N)、strip keyでsort、output rotate O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 6 \times 10^4; 0 \leq X_i \leq 2 \times 10^7; 0 \leq Y_i \leq 2 \times 10^7; (X_i, Y_i) \neq (X_j, Y_j) if i \neq j; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc448/editorial/16776) — source-abc448-editorial-16776-3bc7b72384fc188ec6b67c28ddf6a6693a283de4ce56f68b910592f6556b75c5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc448/tasks/abc448_f) — source-abc448-f-problem-1d4b90b63b2d294b7123ff349949419179a137fe39504cf132e8ad287f5c2f86
