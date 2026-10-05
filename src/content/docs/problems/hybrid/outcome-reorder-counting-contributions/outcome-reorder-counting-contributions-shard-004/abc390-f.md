---
title: "ABC390-F — Double Sum 3"
draft: true
authoringUnit: {"problemId":"abc390-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-004/abc390-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc390-editorial-11968-0c7d3bbe1f4c2e8e21d96a1bb4669821ced94dc24d3daee43b319ad13b71951d","source-abc390-f-problem-22049aa8f88e5498af5eabbf879fd7dc80c3bbfeeb8675feed9cdc0c73c0f25c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"位置X_1<…<X_tを含まないsubarray数は、sentinel0,N+1を加え各gap長d=X_{k+1}-X_k-1のd(d+1)/2の和である。 全cについてpos[c-1]とpos[c]のmerge量の総和は各位置が定数回しか現れず線形に抑えられる。 指定値集合が出ないsubarray数は、その出現位置で区切られたgap長の三角数和で計算でき、c-1単独とc-1∪cのlist mergeを全体O(N)またはO(N log N)で処理できる。","sourceRevisionIds":["source-abc390-editorial-11968-0c7d3bbe1f4c2e8e21d96a1bb4669821ced94dc24d3daee43b319ad13b71951d","source-abc390-f-problem-22049aa8f88e5498af5eabbf879fd7dc80c3bbfeeb8675feed9cdc0c73c0f25c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

multiset内の存在値集合を連続整数成分ごとに消すのが最小で、各操作はその成分の最小値cを一度だけ左端lとして使う。

subarray Sでcが操作左端になる条件はcが存在しc-1が存在しないことだけなので、g(c)=#(c-1不在)-#(c-1,cとも不在)と数えられる。

採用する候補: 値ごとの出現位置listを用い、禁止位置集合を避けるsubarray数の差を全cで足す

棄却する候補: 全O(N²) subarrayについて存在値を作りf(L,R)をsimulationする

N=3×10^5でsubarray列挙自体が不可能である。

各値のsorted出現位置を作る。c=1..Nについてavoid(pos[c-1])を計算し、二listをmergeしたpos[c-1]∪pos[c]のavoidを引いてg(c)とし、総和へ加える。c=1では値0のlistを空とする。

## 典型の発動条件

### 操作回数の寄与分解

発動条件: 最適操作がcomponentごとに一回で、各componentを代表するkeyが一意なとき。

f(L,R)を左端値cのindicator和へ変える。

### 出現禁止subarrayのgap counting

発動条件: 特定値群を含まないsubarray数を数えるとき。

禁止位置間の連続gapの三角数を足す。

## 問題固有の要素

値の連続component数という一見subarray全体依存の量が、「cはあるがc-1はない」という隣接値二つの局所indicator和になる。

別の問題へ持ち帰る視点: 集合のcomponent数は各要素がcomponent開始かどうかのindicatorへ分解すると数えやすい。

## 正当性

位置X_1<…<X_tを含まないsubarray数は、sentinel0,N+1を加え各gap長d=X_{k+1}-X_k-1のd(d+1)/2の和である。 全cについてpos[c-1]とpos[c]のmerge量の総和は各位置が定数回しか現れず線形に抑えられる。 指定値集合が出ないsubarray数は、その出現位置で区切られたgap長の三角数和で計算でき、c-1単独とc-1∪cのlist mergeを全体O(N)またはO(N log N)で処理できる。

## 実装上の注意

- gapの三角数と総答えは64 bit整数で持つ。c=1のc-1不在は常に真で、duplicate出現位置は値ごとのlistにそのまま全て必要。

## 復習の核

- N≤9で全subarrayのdistinct setからcomponent数を直接数え、欠番、同値連続、値1/N、cが不在の寄与0を比較する。

## 計算量と制約

### 時間

O(N)、隣接値の出現列merge総長O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 3 \times 10^5; 1 \le A_i \le N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc390/editorial/11968) — source-abc390-editorial-11968-0c7d3bbe1f4c2e8e21d96a1bb4669821ced94dc24d3daee43b319ad13b71951d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc390/tasks/abc390_f) — source-abc390-f-problem-22049aa8f88e5498af5eabbf879fd7dc80c3bbfeeb8675feed9cdc0c73c0f25c
