---
title: "ABC231-F — Jealous Two"
draft: true
authoringUnit: {"problemId":"abc231-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc231-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-weighted-prefix-fenwick"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-coordinate-compression","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc231-editorial-3059-2800894ed0012eda3c59d85ce01046fba8bf0c21479cd2c0c4e8eb9298de0bc3","source-abc231-f-problem-37c3e1fabb258af6c0177d00752d792cedf5ab67a0ea32e2697bfe540ba9a2d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A が同値の点では B の大きい順に置くことで条件を満たす向きが処理済み側に現れるが、完全に同じ点の複数個はまとめて双方向を数える必要がある。 一方の不等式をソート順へ吸収し、他方を一次元の動的な範囲和へ落とせる。","sourceRevisionIds":["source-abc231-editorial-3059-2800894ed0012eda3c59d85ce01046fba8bf0c21479cd2c0c4e8eb9298de0bc3","source-abc231-f-problem-37c3e1fabb258af6c0177d00752d792cedf5ab67a0ea32e2697bfe540ba9a2d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

喧嘩しない順序付き点対は `A_i≥A_j` かつ `B_i≤B_j`。A昇順、同じAではB降順に処理すると、前側の点にA条件を吸収でき、現在B以上の頻度をsuffix queryで数えられる。

完全一致する点がc個なら群として扱う。未登録の群に対してFenwickのsuffix queryを行い、外部点との寄与 `c×query` と群内の順序付き寄与 `c²` を加えてから、その群の頻度cを登録する。

採用する候補: Aでsweepし、圧縮B上のsuffix頻度をFenwickで求める。

群をまとめてquery後に登録することで、同一群の点を誤って片方向だけ数えるのを避ける。

棄却する候補: 全ての順序付き組を二重ループで調べる。

点対がN²個ある。

## 典型の発動条件

### 二次元半順序の sweep line

発動条件: 点対に x の一方向不等式と y の逆方向不等式が同時に課されるとき。

x をソート順で満たし、処理済み点の y 頻度から現在閾値以上の個数を取得する。

### 座標圧縮と Fenwick tree

発動条件: 座標値は大きいが、挿入と prefix・suffix 個数問合せだけを行うとき。

B の順位へ一点加算し、全挿入数から B_i 未満の prefix 和を引く。

## 問題固有の要素

同じ品を二人へ渡すことも許されるため i＝j を含み、同一座標が c 個ならその群内だけで c² 個の順序付き組が有効になる。

別の問題へ持ち帰る視点: dominance counting では、不等号が非厳密か、組が順序付きか、同一点と自己対を含むかをグループ単位で確認する。

## 正当性

A が同値の点では B の大きい順に置くことで条件を満たす向きが処理済み側に現れるが、完全に同じ点の複数個はまとめて双方向を数える必要がある。 一方の不等式をソート順へ吸収し、他方を一次元の動的な範囲和へ落とせる。

## 実装上の注意

- 同一点群のサイズをcとし、登録前にsuffix queryを取り `c×query+c²` を加えてから頻度cをFenwickへ反映する。
- 答えは最大N²なので64ビット整数で持ち、`B_j≥B_i` の等号を含める。

## 復習の核

- 二変数の不等式対が出たら、一方をソートで自動的に満たし、残る一方をデータ構造の問合せにする。
- タイブレークは適当に決めず、同じ第一座標で有効な第二座標の向きが処理済み側へ来る順を選ぶ。

## 計算量と制約

### 時間

O(N log N)、A sortとB Fenwick。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 0 \leq A_i \leq 10^9; 0 \leq B_i \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/editorial/3059) — source-abc231-editorial-3059-2800894ed0012eda3c59d85ce01046fba8bf0c21479cd2c0c4e8eb9298de0bc3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/tasks/abc231_f) — source-abc231-f-problem-37c3e1fabb258af6c0177d00752d792cedf5ab67a0ea32e2697bfe540ba9a2d2
