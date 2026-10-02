---
title: "ABC265-E — Warp"
draft: true
authoringUnit: {"problemId":"abc265-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc265-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc265-e-problem-34c2e6fb9b90f3eb28c9af246cc0db103c0a71a09d001b89d12a09a00ffcdee7","source-abc265-editorial-4587-0da702bb6f4af09d1b7452baa670b91c9db1cc7951fa06c33d2e97f9bbe422f1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"三操作の変位は順序に依らず回数で定まり、回数組と時刻から座標を一意復元できる。各合法prefixに次操作を足して障害destinationを除くDPは全順序を数える。同座標の異回数は後続回数処理で同じでも別履歴を正しく加算する。","sourceRevisionIds":["source-abc265-e-problem-34c2e6fb9b90f3eb28c9af246cc0db103c0a71a09d001b89d12a09a00ffcdee7","source-abc265-editorial-4587-0da702bb6f4af09d1b7452baa670b91c9db1cc7951fa06c33d2e97f9bbe422f1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

n回後の座標は三種類の移動をそれぞれ何回選んだかだけで決まり、選んだ順序には依存しない。 三つの回数 x,y,z は x+y+z=n を満たすため、時刻 n と二つの回数を持てば残り一つを復元できる。 回数状態が異なっても同じ座標へ着く場合があるが、移動列は別なので状態を無理に座標で統合せずそれぞれ数えてよい。

棄却する候補: 3^N 個の移動列を列挙し、各stepの着地点が障害物か確認する。

N=300で移動列が指数個になる。

採用する候補: dp[n][x][y] をn回中に第1移動をx回、第2移動をy回使ったpath数とし、z=n−x−yから座標を計算して障害物でなければ三方向へ遷移する。

各stepの異なる回数組は二次元個に収まり、到達座標を64 bit線形式として直接障害物集合へ照会できる。

回数状態が異なっても同じ座標へ着く場合があるが、移動列は別なので状態を無理に座標で統合せずそれぞれ数えてよい。

commutative displacement のwalk countingをcomposition count lattice上のDPへ移し、幾何座標は障害物判定時だけ線形写像で復元する。

## 典型の発動条件

### 操作種類別回数DP

発動条件: 操作の累積結果が各種類の使用回数だけで決まり、順序はpath数として数えたいとき。

時刻と種類別回数を状態にし、次に選ぶ操作ごとに一つの回数を増やす。

### 総和制約による一次元削減

発動条件: k個の非負回数の総和が現在step数に等しいとき。

k−1個だけを状態に持ち、最後の回数をstep数との差で復元する。

## 問題固有の要素

障害物は最大10万点だけなので、巨大な座標平面を持たず座標pairのsetで着地可否を判定できる。

別の問題へ持ち帰る視点: 疎な禁止点を持つ無限格子では盤面配列を作らずhash setと生成状態だけを管理する。

## 正当性

三操作の変位は順序に依らず回数で定まり、回数組と時刻から座標を一意復元できる。各合法prefixに次操作を足して障害destinationを除くDPは全順序を数える。同座標の異回数は後続回数処理で同じでも別履歴を正しく加算する。

## 実装上の注意

- 座標は回数300と移動量10^9の積になるため64 bit整数で計算する。
- 遷移先が障害物なら加算せず、n層とn＋1層の二枚だけを持つ場合は次層を毎回0クリアする。

## 復習の核

- ベクトル移動の順序列では、終点を決める十分統計量が各ベクトルの使用回数にならないか確認する。
- 状態の座標が衝突しても、将来遷移と数える対象が回数組に依存するなら安易に統合しない。

## 計算量と制約

### 時間

操作回数N、障害数M。時刻tの回数組O(t²)を全時刻処理して O(N³+M)、hash障害照会はexpected O(1)。

### 空間

rolling回数組 O(N²)、障害set O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 300; 0 \leq M \leq 10^5; -10^9 \leq A,B,C,D,E,F \leq 10^9; (A,B), (C,D), and (E,F) are distinct.; -10^9 \leq X_i,Y_i \leq 10^9; (X_i,Y_i)\neq(0,0); (X_i,Y_i) are distinct.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/tasks/abc265_e) — source-abc265-e-problem-34c2e6fb9b90f3eb28c9af246cc0db103c0a71a09d001b89d12a09a00ffcdee7
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/editorial/4587) — source-abc265-editorial-4587-0da702bb6f4af09d1b7452baa670b91c9db1cc7951fa06c33d2e97f9bbe422f1
