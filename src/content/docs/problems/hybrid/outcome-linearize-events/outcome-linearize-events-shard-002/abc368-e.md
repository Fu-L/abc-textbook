---
title: "ABC368-E — Train Delay"
draft: true
authoringUnit: {"problemId":"abc368-e","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc368-e.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep"],"sourceRevisionIds":["source-abc368-e-problem-a673d6063dad671766e37586e3e23d2657d837232a96ac44de45dc425b6544ed","source-abc368-editorial-10752-c1d6c5155d2d9890f4506e2f637995f79c644f04162ceeb29059e816a897901b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"発車eventではX_i=max(0,lastArrival[A_i]−S_i)だが、列車1だけは与えられたX_1を固定条件として反映する。 到着eventではlastArrival[B_i]をmax(current,T_i+X_i)で更新する。同じ時刻では到着を発車より先に処理して接続可能にする。 因果関係が時刻表時刻順に流れ、過去の到着を駅ごとのmax一値へ集約できる。","sourceRevisionIds":["source-abc368-e-problem-a673d6063dad671766e37586e3e23d2657d837232a96ac44de45dc425b6544ed","source-abc368-editorial-10752-c1d6c5155d2d9890f4506e2f637995f79c644f04162ceeb29059e816a897901b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

列車は接続可能性を保つために必要な最小限だけ遅らせればよく、余分に遅らせても後続列車を早めることはない。

列車iの遅延を決める時に必要なのは、時刻表上でS_iまでに駅A_iへ到着する列車の実到着時刻の最大値だけである。

採用する候補: 時刻表上の発着eventをsortし、駅別の最大実到着時刻を持って発車時に遅延を確定する。

棄却する候補: 遅延値が変わるたび、接続する全後続列車へqueueで伝播させる。

同じ列車の遅延を多数回更新し得て、駅・時刻による一方向順序を利用していない。

全列車の(S_i,departure,i)と(T_i,arrival,i)を作り、時刻昇順・同時刻はarrival優先でsortする。駅別lastArrivalを初期化し、departureで最小遅延X_iを決定し、arrivalでT_i+X_iを到着駅のmaxへ反映する。列車2..MのXを出力する。

## 典型の発動条件

### 因果event sweep

発動条件: 時刻表上の順序で依存が過去から未来にだけ向くsimulation。

発車と到着をevent化し、必要な状態を時刻順に確定する。

### 地点別max集約

発動条件: ある地点への過去の到着のうち最も厳しい時刻だけが将来制約になるとき。

全履歴を捨て、駅ごとの最新実到着時刻だけを保持する。

## 問題固有の要素

実時刻順では遅延未確定のためsortできないが、影響可否は時刻表上のT≤Sで決まり、固定event順を使える。

別の問題へ持ち帰る視点: dynamicな実時刻が絡む問題でも、依存edgeを決める静的keyが別にないか探す。

## 正当性

発車eventではX_i=max(0,lastArrival[A_i]−S_i)だが、列車1だけは与えられたX_1を固定条件として反映する。 到着eventではlastArrival[B_i]をmax(current,T_i+X_i)で更新する。同じ時刻では到着を発車より先に処理して接続可能にする。 因果関係が時刻表時刻順に流れ、過去の到着を駅ごとのmax一値へ集約できる。

## 実装上の注意

- 同時刻のarrival-before-departure tie-breakを必ず入れる。X_1を通常式で上書きせず、その実到着を後続へ反映する。

## 復習の核

- 到着T_iと別列車の発車S_jが等しい接続例でevent順を確認する。各駅状態が「遅延」ではなく「実到着時刻」であることを統一する。

## 計算量と制約

### 時間

O(M log M+N)、2M時刻event。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 2 \leq M \leq 2\times 10^5; 1 \leq A_i,B_i \leq N; A_i \neq B_i; 0 \leq S_i < T_i \leq 10^9; 1 \leq X_1 \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc368/tasks/abc368_e) — source-abc368-e-problem-a673d6063dad671766e37586e3e23d2657d837232a96ac44de45dc425b6544ed
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc368/editorial/10752) — source-abc368-editorial-10752-c1d6c5155d2d9890f4506e2f637995f79c644f04162ceeb29059e816a897901b
