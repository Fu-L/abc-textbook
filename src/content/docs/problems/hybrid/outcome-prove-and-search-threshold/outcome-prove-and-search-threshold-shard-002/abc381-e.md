---
title: "ABC381-E — 11/22 Subsequence"
draft: true
authoringUnit: {"problemId":"abc381-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc381-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc381-e-problem-33cedafc3567e1473c0e51edbdd900f5c65883362ce9fee2d93f8fe237eb25cc","source-abc381-editorial-11415-3458571d0da76b5f771a15322cf4692afdc4517e2b358800c44065039fe47699"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"m を固定すれば、左端以降の m 個目の1を最も早く取り、その後の最初の/、さらに m 個目の2を最も早く取る貪欲判定が必要十分である。 空でない 11/22 は必ず / を一つ含み、m=0 の文字列 / も答え候補なので slash 不在時だけ0になる。 出現位置への lower_bound で一判定 O(log N)、外側の二分探索を含めても O(log^2 N) で10^5 queryを処理できる。","sourceRevisionIds":["source-abc381-e-problem-33cedafc3567e1473c0e51edbdd900f5c65883362ce9fee2d93f8fe237eb25cc","source-abc381-editorial-11415-3458571d0da76b5f771a15322cf4692afdc4517e2b358800c44065039fe47699"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

この解説で扱わないこと:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

長さ2m+1の 11/22 部分列が区間に存在するなら、より小さい m でも存在するので m に単調性がある。中央の / を選び、その左に1がm個、右に2がm個あるかを位置列で判定できる。

採用する候補: 文字1,2,/の出現位置列を前計算し、各 query で m を二分探索して、必要な m 個目の1・次の/・m個目の2が区間内に収まるか判定する。

棄却する候補: 各 query の区間を走査し、全ての / を中央候補として左右の個数を調べる。

区間長の総和が O(NQ) になり、N,Q≤10^5 に間に合わない。

各文字の位置 vector を作る。query [L,R] の feasible(m) を三回の lower_bound/index 加算で実装し、最大 m を二分探索する。存在すれば2m+1、/すらなければ0を返す。

## 典型の発動条件

### 部分列長の二分探索

発動条件: 長さ parameter を小さくすると必ず成立し、固定長部分列を位置列で判定できるとき。

貪欲に最早位置を選ぶ判定で最大 m を探す。

## 問題固有の要素

部分列の中央記号が固定される形では、左右に必要な同文字数を parameter にすると単調判定になる。

別の問題へ持ち帰る視点: 存在判定では各段階を最も早く選ぶことが将来の余地を最大化する。

## 正当性

m を固定すれば、左端以降の m 個目の1を最も早く取り、その後の最初の/、さらに m 個目の2を最も早く取る貪欲判定が必要十分である。 空でない 11/22 は必ず / を一つ含み、m=0 の文字列 / も答え候補なので slash 不在時だけ0になる。 出現位置への lower_bound で一判定 O(log N)、外側の二分探索を含めても O(log^2 N) で10^5 queryを処理できる。

## 実装上の注意

- m=0 と slash 不在を区別し、vector の添字超過を都度確認する。query の L,R は閉区間である。

## 復習の核

- 固定 m の最早選択を実際の位置列で追い、遅い候補を選ぶ利点がないことを交換論法で確認する。

## 計算量と制約

### 時間

O(N+Q log N log N)、m二分探索ごとに三回の位置lower_bound。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq Q \leq 10^5; S is a string of length N consisting of 1, 2, and /.; 1 \leq L \leq R \leq N; N, Q, L, and R are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc381/tasks/abc381_e) — source-abc381-e-problem-33cedafc3567e1473c0e51edbdd900f5c65883362ce9fee2d93f8fe237eb25cc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc381/editorial/11415) — source-abc381-editorial-11415-3458571d0da76b5f771a15322cf4692afdc4517e2b358800c44065039fe47699
