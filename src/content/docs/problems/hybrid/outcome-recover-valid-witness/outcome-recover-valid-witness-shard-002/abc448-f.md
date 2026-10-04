---
title: "ABC448-F — Authentic Traveling Salesman Problem"
draft: true
authoringUnit: {"problemId":"abc448-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-002/abc448-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc448-editorial-16776-3bc7b72384fc188ec6b67c28ddf6a6693a283de4ce56f68b910592f6556b75c5","source-abc448-f-problem-1d4b90b63b2d294b7123ff349949419179a137fe39504cf132e8ad287f5c2f86"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各点はちょうど一つのstripに属するので、strip順のsortは全点を一度ずつ並べる。隣接stripでyの走査方向を反転すると境界で反対端まで戻らず接続できる。各stripの縦移動は高々Wでstrip数244、最後の閉路辺を加えて高々245W。strip内の横移動は各隣接点間の差がB未満なので高々NB、strip境界の移動と閉路復帰を合わせて高々2W。B=82000を代入した上界は9.86×10^9で10^10未満であり、構成は必ず制約を満たす。","sourceRevisionIds":["source-abc448-editorial-16776-3bc7b72384fc188ec6b67c28ddf6a6693a283de4ce56f68b910592f6556b75c5","source-abc448-f-problem-1d4b90b63b2d294b7123ff349949419179a137fe39504cf132e8ad287f5c2f86"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

この解説で扱わないこと:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

要求は全点を一度ずつ訪れて戻る巡回で、総Manhattan距離が10^10以下ならよい。x方向を幅Bのstripへ分け、strip内をy昇順・降順で交互に並べると、蛇行するHamilton cycleが得られる。

この問題では `W=2×10^7`、`N≤60000` に対して `B=82000` と固定する。x座標が0..Wなのでstripは高々244個。strip内の横移動は高々NB、strip間の横移動と閉路復帰は高々2W。各strip内の縦移動は高々Wなので、縦移動と復帰は高々245W。合計は
`NB+247W ≤ 60000×82000+247×20000000 = 9.86×10^9 < 10^10`。

採用する候補: strip番号順に点を並べ、stripごとにyの向きを交互に反転する。

最適TSPを解かずに、制約の数値上限を満たす構成を作れる。

棄却する候補: 最近傍未訪問点を選ぶ貪欲。

局所選択だけでは総距離の上限を保証できない。

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

各点はちょうど一つのstripに属するので、strip順のsortは全点を一度ずつ並べる。隣接stripでyの走査方向を反転すると境界で反対端まで戻らず接続できる。各stripの縦移動は高々Wでstrip数244、最後の閉路辺を加えて高々245W。strip内の横移動は各隣接点間の差がB未満なので高々NB、strip境界の移動と閉路復帰を合わせて高々2W。B=82000を代入した上界は9.86×10^9で10^10未満であり、構成は必ず制約を満たす。

## 実装上の注意

- `key=(floor(x/B), strip番号の偶奇に応じた±y)` でsortし、B=82000を使う。stripは最大244個。
- 出力を点1から始めるようrotateし、最後から点1への距離も上界に含める。

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
