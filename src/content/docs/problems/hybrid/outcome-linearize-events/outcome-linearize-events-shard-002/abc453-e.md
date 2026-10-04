---
title: "ABC453-E — Team Division"
draft: true
authoringUnit: {"problemId":"abc453-e","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc453-e.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc453-e-problem-5276be267ede9295b1edc8470b3f5597b9e8474e370a0c596e1d6df7ed36c6e3","source-abc453-editorial-18528-5d59bcb8d3f9485abd9c2bedb149674683490235cf50160ba36c6a713036ab67"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"Aのみ人数 X_2>i、Bのみ人数 X_3>N-i、または不可 group が非空なら分割は存在しない。 それ以外は両方可 X_1 人から A に i-X_2 人を選べば、B側人数も自動的に一致する。 各選手の A 可否は i∈[L_j,R_j]、B 可否は N-i∈[L_j,R_j] の区間指示であり、sweep 中の状態変化総数が O(N) に限られる。","sourceRevisionIds":["source-abc453-e-problem-5276be267ede9295b1edc8470b3f5597b9e8474e370a0c596e1d6df7ed36c6e3","source-abc453-editorial-18528-5d59bcb8d3f9485abd9c2bedb149674683490235cf50160ba36c6a713036ab67"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

team A の人数 i を固定すると各選手は A/B両方、Aのみ、Bのみ、どちらも不可の四 group に分類され、両方 group から不足分を選ぶ組合せだけが自由度になる。

採用する候補: i=1..N-1 を sweep し、各選手の所属可否が変わる高々四つの event で group 人数を更新して、valid なら二項係数 C(X_1,i-X_2) を加える。

棄却する候補: 各 i ごとに全 N 選手を走査して四 group を数え直す。

N-1個の team size それぞれに O(N) かかり二乗時間となる。

階乗・逆階乗を前計算し、各選手の A/B 可否が反転する i=L,R+1,N-R,N-L+1 に event を登録する。i を昇順に進め group count を更新し、valid 条件を満たす C(X_1,i-X_2) を答えへ加える。

## 典型の発動条件

### 分類状態の event sweep

発動条件: parameter を動かすと各要素の bool 条件が少数境界でだけ変わるとき。

境界 event だけで四分類の人数を増分更新する。

### 強制選択を除いた二項係数

発動条件: 二群分割で一方のみ可の要素と両方可の要素があるとき。

強制人数を引き、自由要素から残り枠を選ぶ。

## 問題固有の要素

全 parameter ごとの再分類を避け、各要素が分類を変える境界を event として転置する。

別の問題へ持ち帰る視点: 割当数え上げは不可・強制・自由の三役に整理すると単一の二項係数になる。

## 正当性

Aのみ人数 X_2>i、Bのみ人数 X_3>N-i、または不可 group が非空なら分割は存在しない。 それ以外は両方可 X_1 人から A に i-X_2 人を選べば、B側人数も自動的に一致する。 各選手の A 可否は i∈[L_j,R_j]、B 可否は N-i∈[L_j,R_j] の区間指示であり、sweep 中の状態変化総数が O(N) に限られる。

## 実装上の注意

- A可否とB可否の event位置を N-i の反転込みで正しく登録する。同時 event は全部適用してから i の値を評価する。

## 復習の核

- 固定 i の四分類と C(X_1,i-X_2) を先に導き、各可否区間の開始・終了eventを数直線上で確認する。

## 計算量と制約

### 時間

O(N)、各選手定数eventと階乗前計算、i=0..N sweep。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; 1\leq L_i\leq R_i\leq N-1; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc453/tasks/abc453_e) — source-abc453-e-problem-5276be267ede9295b1edc8470b3f5597b9e8474e370a0c596e1d6df7ed36c6e3
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc453/editorial/18528) — source-abc453-editorial-18528-5d59bcb8d3f9485abd9c2bedb149674683490235cf50160ba36c6a713036ab67
