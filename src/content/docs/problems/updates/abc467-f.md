---
title: "ABC467 F — Email Scheduling Optimization"
draft: true
authoringUnit: {"problemId":"abc467-f","docPath":"src/content/docs/problems/updates/abc467-f.md","learningOutcomeIds":["outcome-design-associative-range-summary","outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-range-monoid-aggregation","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc467-f-problem-e472ff52dad07a04e9e23553076bbfb0c0aa1c37fd489ffd92ce1ca7c2951645","source-abc467-editorial-23181-84f8d864317f3bfeff965c128e7e622f8280f19e82635482ff820229ad4158e3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"隣接するBの逆転を交換しても最大返信時刻は増えず、後続会社の開始時刻も変わらない。従ってソート順で最適解が存在する。ブロック要約の連結は右側の返信全体を左側の筆記時間だけ遅らせる式そのものであり、Segment Treeの根は全会社の最大返信時刻を表す。","sourceRevisionIds":["source-abc467-f-problem-e472ff52dad07a04e9e23553076bbfb0c0aa1c37fd489ffd92ce1ca7c2951645","source-abc467-editorial-23181-84f8d864317f3bfeff965c128e7e622f8280f19e82635482ff820229ad4158e3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

先に読む単元:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

## 考察

返信を待つ時間Bが長い会社を先に処理したいが、筆記時間Aの大小も絡むので交換で確かめる。B_u<B_vでu,vを続けて書くと、二社の最大返信時刻は開始時刻+ A_u+A_v+B_v。順序をv,uに変えた後の二つの返信は、いずれもこの値以下になる。よってB降順が最適で、同じBの順序は任意。

この順序を各更新のたびに走査すると O(NQ)。一つの連続ブロックについて、筆記時間の総和sと、時刻0から始めた最大返信時刻tだけを持つ。左ブロックLの後にRを書くと、要約は (s_L+s_R, max(t_L,s_L+t_R)) になる。ブロックの連結に対応するので結合則が成り立ち、Segment Treeに載せられる。

全クエリを先読みし、B更新後も含む各会社の状態に (−B,会社ID) のキーを与えて座標圧縮する。同じ会社の同じBは同じ葉を再利用してよく、同じBの別会社には別の葉を与える。現状態だけ (A,A+B)、他の葉は空要約 (0,−∞)。A更新は一葉の変更、B更新は旧葉を消して新葉を設定する。根のtが答えである。

## 典型の発動条件

順序付きブロックを『総所要時間と最悪完了時刻』で要約する。貪欲順を証明してから、その順序の連結演算をmonoidとして保守する。

## 問題固有の要素

待ち時間Bの降順が更新で変わるため、会社番号順の木では要約を結合できない。キー空間には将来のBも含める。

## 正当性

隣接するBの逆転を交換しても最大返信時刻は増えず、後続会社の開始時刻も変わらない。従ってソート順で最適解が存在する。ブロック要約の連結は右側の返信全体を左側の筆記時間だけ遅らせる式そのものであり、Segment Treeの根は全会社の最大返信時刻を表す。

## 実装上の注意

空要約のtを0とするとA=B=0以外の一般化で誤るので−∞を使う。最大返信時刻は64 bit整数。

## 復習の核

局所交換で最適順を作り、その順で連結できる最小要約を探す。交換論とデータ構造は別の役割を担う。

## 計算量と制約

### 時間

キーの前処理とN+Q回の更新で O((N+Q) log(N+Q))。

### 空間

圧縮キーとSegment Treeに O(N+Q)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq Q \leq 10^5; 1 \leq A_j,B_j \leq 10^9; In each query, 1 \leq i \leq N.; In each query, 1 \leq x \leq 10^9.; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc467/tasks/abc467_f)
- [公式解説](https://atcoder.jp/contests/abc467/editorial/23181)
