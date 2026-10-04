---
title: "ABC232-E — Rook Path"
draft: true
authoringUnit: {"problemId":"abc232-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc232-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc232-e-problem-b3df9d137295d16f98ee6f59073e45ed18b647cf2dbdf82a892ff22347388b46","source-abc232-editorial-3148-7f04beda538197092502af948e67959fcd409b195b755f175d65a00bb8b05c5d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"終点相対の同一分類にある各マスは分類ごとの遷移先数が等しい。各分類への到達総数だけで次の到達総数を求められ、座標ごとDPの厳密な商となる。開始分類へ1を置きK回後の終点状態Aが目的数。","sourceRevisionIds":["source-abc232-e-problem-b3df9d137295d16f98ee6f59073e45ed18b647cf2dbdf82a892ff22347388b46","source-abc232-editorial-3148-7f04beda538197092502af948e67959fcd409b195b755f175d65a00bb8b05c5d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

H,W は最大 10^9 なので H×W 個のマスを状態にできない。一方 K≤10^6 なので、各手を定数個の状態で更新できれば十分間に合う。 終点との行一致・列一致の真偽でマスを 4 分類すると、同じ分類のマスは次に各分類へ移る行先数が等しい。開始位置も、終点そのもの・同じ行だけ・同じ列だけ・どちらも異なる、のいずれかとして初期化できる。 座標そのものではなく、終点の行・列との一致関係が遷移に関する十分統計量になる。 各状態には分類全体への到達通り数を持つ。例えば「終点と同じ行・異なる列」からは、終点へ 1 通り、同じ分類へ W-2 通り、行も列も異なる分類へ H-1 通り移れる。

採用する候補: 現在位置を終点との行一致・列一致の 4 状態へ圧縮し、状態間の遷移回数を K 回更新する。

同じ分類内のマスは終点に対して対称で、各分類への遷移先数が等しいため、分類全体への到達通り数だけで次の値を計算できる。

棄却する候補: H×W の全マスごとの到達通り数を K 回更新する。

盤面サイズを直接状態数にすると制約内で処理できず、対称なマスを重複計算する。

座標そのものではなく、終点の行・列との一致関係が遷移に関する十分統計量になる。

各状態には分類全体への到達通り数を持つ。例えば「終点と同じ行・異なる列」からは、終点へ 1 通り、同じ分類へ W-2 通り、行も列も異なる分類へ H-1 通り移れる。

状態を A=終点、B=同じ行だけ、C=同じ列だけ、D=どちらも異なる、とする。次の値は A'=B+C、B'=(W-1)A+(W-2)B+D、C'=(H-1)A+(H-2)C+D、D'=(H-1)B+(W-1)C+(H+W-4)D であり、開始位置の分類を 1 として K 回更新した A を答える。

## 典型の発動条件

### 対称性による状態圧縮 DP

発動条件: 多数の具体状態が目標との同じ関係を持ち、遷移先数も等しいとき。

終点との行・列一致だけを状態として同値なマスをまとめる。

### 遷移先個数による重み付き DP

発動条件: 同値類間の遷移が、具体的な行先の個数だけで決まるとき。

4 分類それぞれから各分類へ移れるマス数を係数として、分類全体の通り数を更新する。

## 問題固有の要素

終点との関係だけを残すと、開始位置がどの分類かも同じ 4 状態で統一できる。

別の問題へ持ち帰る視点: 盤面 DP で座標を持つ前に、遷移と目的に対して区別不能な位置を同値類へまとめる。

## 正当性

終点相対の同一分類にある各マスは分類ごとの遷移先数が等しい。各分類への到達総数だけで次の到達総数を求められ、座標ごとDPの厳密な商となる。開始分類へ1を置きK回後の終点状態Aが目的数。

## 実装上の注意

- 制約は H,W≥2 なので負の遷移係数は現れない。H=2 または W=2 では H-2・W-2 が 0 になる遷移を含め、開始点と終点の行・列一致から初期 4 状態を取り違えない。

## 復習の核

- 4 分類の各状態から 1 手後の行先個数を数え直し、H=2 または W=2 で係数 0 になる遷移と、開始点=終点を含む 4 通りの初期状態を確認する。

## 計算量と制約

### 時間

H×W、手数K。四対称状態で O(K)。

### 空間

四状態と次行だけ O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H, W \leq 10^9; 1 \leq K \leq 10^6; 1 \leq x_1, x_2 \leq H; 1 \leq y_1, y_2 \leq W

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc232/tasks/abc232_e) — source-abc232-e-problem-b3df9d137295d16f98ee6f59073e45ed18b647cf2dbdf82a892ff22347388b46
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc232/editorial/3148) — source-abc232-editorial-3148-7f04beda538197092502af948e67959fcd409b195b755f175d65a00bb8b05c5d
