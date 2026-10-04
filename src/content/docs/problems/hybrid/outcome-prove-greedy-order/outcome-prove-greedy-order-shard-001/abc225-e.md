---
title: "ABC225-E — 7"
draft: true
authoringUnit: {"problemId":"abc225-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-001/abc225-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc225-e-problem-0d3017b2dfe2abfe833608265208285af613540490d3cb26da28ae4fc8171c52","source-abc225-editorial-2853-f719138f91644e50bd53db2ad2f5a40a6b475c4e83da9cb3be6b5dad7d6632f1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"二つの7がともに完全に見えるための条件は対応する偏角開区間が交わらないことで、平面上の遮蔽関係を一次元区間へ落とせる。 選べる区間のうち右端が最小のものを先に選んでも、最適解の最初の区間と交換して残りの実行可能性を悪化させない。 全体可視性が偏角区間の非交差と同値になり、最も早く終わる区間を選ぶ交換論法をそのまま適用できる。","sourceRevisionIds":["source-abc225-e-problem-0d3017b2dfe2abfe833608265208285af613540490d3cb26da28ae4fc8171c52","source-abc225-editorial-2853-f719138f91644e50bd53db2ad2f5a40a6b475c4e83da9cb3be6b5dad7d6632f1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

先に読む単元:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

見えない7を全て削除しても見えている個数は減らないので、残す7を全て原点から見えるように選ぶ問題と考えられる。各7が遮る方向は二端点の偏角の間の開区間で表せる。

採用する候補: 各7を偏角開区間 [angle(x_i,y_i-1),angle(x_i-1,y_i)] とみなし、右端が小さい順の区間スケジューリングで交わらない最大集合を選ぶ。

棄却する候補: 原点から近い7、または中心の偏角が小さい7から順に残す。

可視性を決めるのは距離や中心角ではなく区間全体の重なりであり、終了角を遅く残すと後続の選択肢を不必要に失う。

浮動小数の角度を使わず端点方向を外積で比較して右端順にsortし、次の左端が直前に選んだ右端以上なら選択する。

## 典型の発動条件

### 偏角区間への幾何変換

発動条件: 原点から図形が占める方向の重なりが可視性・干渉を決めるとき。

各図形の二本の境界半直線を区間端点とし、二次元の遮蔽を偏角上の区間非交差へ変換する。

### 区間スケジューリング

発動条件: 同数の価値を持つ区間から、互いに重ならない最大個数を選ぶとき。

右端の早い順に見て、現在の右端以降に始まる区間を貪欲に採用する。

## 問題固有の要素

現時点で見えない7を残す意味はないため、『削除後に見えるものの個数』を『残したものが全て見える最大集合』へ言い換えられる。

別の問題へ持ち帰る視点: 削除問題では目的へ寄与しない残存要素を全て除いても目的値が変わらないかを確認し、選択集合問題へ単純化する。

## 正当性

二つの7がともに完全に見えるための条件は対応する偏角開区間が交わらないことで、平面上の遮蔽関係を一次元区間へ落とせる。 選べる区間のうち右端が最小のものを先に選んでも、最適解の最初の区間と交換して残りの実行可能性を悪化させない。 全体可視性が偏角区間の非交差と同値になり、最も早く終わる区間を選ぶ交換論法をそのまま適用できる。

## 実装上の注意

- x_i-1 または y_i-1 が0になる端点も外積で比較できるよう軸方向を扱い、座標積は64 bit整数で保持する。開区間なので端点が一致する二区間は同時に選べる。

## 復習の核

- 可視性が『方向の幅』で決まる図形では、距離を追う前に原点から張る二本の境界線を区間端点として描く。

## 計算量と制約

### 時間

O(N log N)、外積による角度比較。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq x_i,y_i \leq 10^9; (x_i,y_i) \neq (x_j,y_j)\ (i \neq j); All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc225/tasks/abc225_e) — source-abc225-e-problem-0d3017b2dfe2abfe833608265208285af613540490d3cb26da28ae4fc8171c52
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc225/editorial/2853) — source-abc225-editorial-2853-f719138f91644e50bd53db2ad2f5a40a6b475c4e83da9cb3be6b5dad7d6632f1
