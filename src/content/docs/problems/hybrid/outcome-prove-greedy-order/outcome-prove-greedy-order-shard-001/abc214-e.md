---
title: "ABC214-E — Packing Under Range Regulations"
draft: true
authoringUnit: {"problemId":"abc214-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-001/abc214-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-priority-queue-best-first"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-event-sweep","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc214-e-problem-d1fdaec6de4fed3cfd86ef4c32a8db6296592dd2110c1212c04889a965286ec2","source-abc214-editorial-2431-b96a04cf27a43abcbda6cae609842210c4be15e77860a2a3a3d666ce872f3028"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"貪欲で処理済みの箱まで一致する実現可能な割当てがある、と帰納する。現在箱番号をxとし、解禁済みのうち右端が最小のボールaを選ぶ。その実現可能解でaの箱をy≥xとする。xが空ならaをyからxへ移してよい。xに別のボールbがあるならa,bの箱を交換する。aにはL_a≤x≤y≤R_a、bにはL_b≤x≤yかつy≤R_a≤R_bが成り立つので、両方とも合法であり、以前に確定した箱は変わらない。従ってxで最早締切を選ぶ解を常に残せる。\n\nもし最小右端R_a<xなら、未割当てのaに残る箱は全てx以上で、どこにも入れられない。この時点で実現可能解はない。候補が空なら、次の未解禁ボールの最小左端まで残るどのボールも置けず、その区間を飛ばしても可能性を失わない。全ボールを処理できたときは構成した割当て自体が実現可能解なので、判定は必要十分である。","sourceRevisionIds":["source-abc214-e-problem-d1fdaec6de4fed3cfd86ef4c32a8db6296592dd2110c1212c04889a965286ec2","source-abc214-editorial-2431-b96a04cf27a43abcbda6cae609842210c4be15e77860a2a3a3d666ce872f3028"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- 対称操作による状態の正規化。

## 考察

各ボール i は整数番号 L_i 以上 R_i 以下の箱のどれか一つへ入り、異なるボールは異なる箱を使わなければならない。

箱番号を小さい順に見たとき、現在の箱へ入れられるボールのうち右端 R が最小のものは、将来使える箱が最も少ない。

棄却する候補: 区間に含まれる全ての箱を頂点として二部グラフを作り、完全マッチングの有無を調べる。

箱番号は 10 億まであり、区間内の各整数を頂点として生成できない。

採用する候補: 箱番号を昇順に走査し、左端を迎えた区間を優先度付きキューへ入れ、右端が最小の区間を現在の箱へ割り当てる。

締切が早いボールを先に使う交換法が成立し、明示する箱は実際に割り当てる位置だけでよい。

ある割当てが現在選んだ区間より右端の遅い区間を先に使っていても、両者を交換すれば可否を悪化させない。

候補キューが空なら、次の区間の左端までの箱にはどのボールも入れられないため、その位置へ直接ジャンプできる。

区間の左端を解禁時刻、右端を締切とみなし、疎な整数軸をイベント間で飛ばしながら最早締切優先で単位ジョブを配置する。

## 典型の発動条件

### 区間割当ての最早締切優先

発動条件: 各要素へ区間内の相異なる整数を一つずつ割り当て、実行時刻を選べるとき。

現在位置までに開始した区間から右端が最小のものを min-heap で選び、箱を一つ消費する。

### 疎な座標のイベント走査

発動条件: 座標範囲は巨大だが、状態が変化する入力端点と実際の処理回数だけは少ないとき。

候補が空の区間を一つずつ進まず、次に未処理の L_i へ現在位置を移す。

## 問題固有の要素

箱番号の上限は大きいが、一個のボールを置くたびに現在位置は一つだけ増え、空白区間は左端イベントへ飛ばせる。

別の問題へ持ち帰る視点: 巨大な整数軸でも、各座標で処理せず「次に候補が生じる座標」と「実際に資源を消費する回数」だけを追う。

## 正当性

貪欲で処理済みの箱まで一致する実現可能な割当てがある、と帰納する。現在箱番号をxとし、解禁済みのうち右端が最小のボールaを選ぶ。その実現可能解でaの箱をy≥xとする。xが空ならaをyからxへ移してよい。xに別のボールbがあるならa,bの箱を交換する。aにはL_a≤x≤y≤R_a、bにはL_b≤x≤yかつy≤R_a≤R_bが成り立つので、両方とも合法であり、以前に確定した箱は変わらない。従ってxで最早締切を選ぶ解を常に残せる。

もし最小右端R_a<xなら、未割当てのaに残る箱は全てx以上で、どこにも入れられない。この時点で実現可能解はない。候補が空なら、次の未解禁ボールの最小左端まで残るどのボールも置けず、その区間を飛ばしても可能性を失わない。全ボールを処理できたときは構成した割当て自体が実現可能解なので、判定は必要十分である。

## 実装上の注意

- キューの最小右端が現在位置より小さくなった時点で、その区間には割り当て可能な箱が残っていないため直ちに不可能とする。
- テストケースごとに区間列とキューを初期化し、キューが空のときだけ現在位置を次の左端へ進める。

## 復習の核

- 区間から異なる整数を選ぶ問題では、左から場所を埋め、候補の中で将来の余裕が最小の右端を優先する。
- 座標上限を見て配列化を諦めるだけでなく、候補集合が空の区間を安全に飛ばせる理由まで確認する。

## 計算量と制約

### 時間

O(N log N)、区間sortと締切heap。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 2 \times 10^5; 1 \le N \le 2 \times 10^5; 1 \le L_i \le R_i \le 10^9; The sum of N across the test cases in one input is at most 2 \times 10^5.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/tasks/abc214_e) — source-abc214-e-problem-d1fdaec6de4fed3cfd86ef4c32a8db6296592dd2110c1212c04889a965286ec2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/editorial/2431) — source-abc214-editorial-2431-b96a04cf27a43abcbda6cae609842210c4be15e77860a2a3a3d666ce872f3028
