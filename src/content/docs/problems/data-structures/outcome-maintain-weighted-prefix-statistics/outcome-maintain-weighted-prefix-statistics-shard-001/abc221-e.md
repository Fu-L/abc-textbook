---
title: "ABC221-E — LEQ"
draft: true
authoringUnit: {"problemId":"abc221-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-weighted-prefix-statistics/outcome-maintain-weighted-prefix-statistics-shard-001/abc221-e.md","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-coordinate-compression","unit-modular-arithmetic","unit-prefix-aggregate"],"excludedTopics":["一般のモノイドによるSegment Treeの区間要約。"],"tagIds":["tag-fenwick-weighted-prefix","tag-contribution-reordering","tag-coordinate-compression","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc221-e-problem-31553d7a955139b88a89f7b7d5fad0702844b013338cca84806192fbbced4d37","source-abc221-editorial-2718-e8b624442e68a1112412ccfd31e488070b6bb0a6f415fd1a8ecbb260e8dad138"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"部分列全体を DP 状態にせず、最初と最後だけを固定すると中間選択が独立な二択になり、その個数が端点間距離だけの冪になる。 値条件を Fenwick Tree の prefix query、index 間隔の重みを左右端へ分離し、全ての端点対の寄与をまとめられる。","sourceRevisionIds":["source-abc221-e-problem-31553d7a955139b88a89f7b7d5fad0702844b013338cca84806192fbbced4d37","source-abc221-editorial-2718-e8b624442e68a1112412ccfd31e488070b6bb0a6f415fd1a8ecbb260e8dad138"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

- 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 一般のモノイドによるSegment Treeの区間要約。

## 考察

部分列の最初と最後の index を i<j に固定すると、その間の j-i-1 要素はそれぞれ選ぶ・選ばないを自由に決められる。したがって端点が A_i≤A_j を満たす一組の寄与は 2^{j-i-1} である。

端点対を直接列挙できないが、2^{j-i-1}=2^{j-1}·2^{-i} と分離できるため、右端 j を走査すると必要なのは A_i≤A_j である過去 i の重み 2^{-i} の prefix 和だけになる。

採用する候補: A を座標圧縮し、Fenwick Tree に過去 index i の重み 2^{-i} を値 A_i の位置へ加え、各 j で A_j 以下の総和へ 2^{j-1} を掛ける。

棄却する候補: 全ての i<j を調べ、A_i≤A_j なら 2^{j-i-1} を加える。

端点対が二乗個あり、N=3×10^5 では列挙できない。

2 の冪と逆冪を法 998244353 で前計算する。j を左から走査し、Fenwick Tree の rank(A_j) 以下を query して 2^{j-1} 倍を答えへ加えた後、同じ rank に 2^{-j} を add する。

## 典型の発動条件

### 端点固定による部分列数え上げ

発動条件: 部分列の条件が最初と最後だけに依存し、中間要素の採否が自由なとき。

端点対ごとの中間二択を 2 の冪で数え、端点寄与の総和へ変える。

### 座標圧縮付き Fenwick Tree

発動条件: 左からの走査中に、値が現在値以下または以上の過去要素の重み和が必要なとき。

値 rank 上の prefix sum と一点加算で不等号条件を処理する。

## 問題固有の要素

指数重み 2^{j-i-1} を右端だけの係数と左端だけの係数へ分離すると、単なる個数ではなく重み付き prefix query になる。

別の問題へ持ち帰る視点: 二 index の差に指数が付く和では、a^{j-i}=a^j a^{-i} と分離してオンライン集計できないか試す。

## 正当性

部分列全体を DP 状態にせず、最初と最後だけを固定すると中間選択が独立な二択になり、その個数が端点間距離だけの冪になる。 値条件を Fenwick Tree の prefix query、index 間隔の重みを左右端へ分離し、全ての端点対の寄与をまとめられる。

## 実装上の注意

- query を add より先に行って i<j を保証し、A_i=A_j も条件に含むので同じ rank まで query する。2^{-i} は浮動小数でなく法上の逆元を使う。

## 復習の核

- 三要素で端点 (1,3) を固定し、中間を入れる・入れない二通りを数えてから、一般の 2^{j-i-1} を再導出する。

## 計算量と制約

### 時間

O(N log N)、値圧縮とFenwick。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3 \times 10^5; 1 \leq A_i \leq 10^9; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc221/tasks/abc221_e) — source-abc221-e-problem-31553d7a955139b88a89f7b7d5fad0702844b013338cca84806192fbbced4d37
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc221/editorial/2718) — source-abc221-editorial-2718-e8b624442e68a1112412ccfd31e488070b6bb0a6f415fd1a8ecbb260e8dad138
