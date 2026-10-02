---
title: "ABC237-G — Range Sort Query"
draft: true
authoringUnit: {"problemId":"abc237-g","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc237-g.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc237-editorial-3341-f1734dda5225fe9572d62a871f0596aa63175e765d3694aba5ea9aad6315712b","source-abc237-g-problem-394b01373d29124e425a5c4ce66eeb9a2319483372e6457161698094c1e7c9ab"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間の 1 の個数を S とすれば、昇順ソート後は末尾 S 個だけが 1、降順ソート後は先頭 S 個だけが 1 になる。 X−1 以下と X 以下の分類差は値 X 一個だけなので、同じソート列を施した後も二つの 01 列の差分は X の現在位置だけに残る。 昇順なら 0 群の後に 1 群、降順なら 1 群の後に 0 群を一括代入でき、二列が最後に異なる唯一の位置が X の位置になる。","sourceRevisionIds":["source-abc237-editorial-3341-f1734dda5225fe9572d62a871f0596aa63175e765d3694aba5ea9aad6315712b","source-abc237-g-problem-394b01373d29124e425a5c4ce66eeb9a2319483372e6457161698094c1e7c9ab"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

最終順列全体は不要で、値 X がどこへ移ったかだけを特定すればよい。

任意の閾値 x について P_i≤x を 0、それ以外を 1 とすると、区間ソートは区間内の 0 と 1 の個数だけで決まる。

棄却する候補: 各クエリで指定区間の実際の値を取り出して昇順または降順に並べ直す。

区間長に比例する処理が繰り返され、N、Q が 20 万では最悪二乗時間になる。

採用する候補: 閾値 x=X−1 と x=X の二つの 01 列を作り、区間和と区間 0/1 代入が可能な遅延セグメント木で全ソートを再現する。

昇順なら 0 群の後に 1 群、降順なら 1 群の後に 0 群を一括代入でき、二列が最後に異なる唯一の位置が X の位置になる。

区間の 1 の個数を S とすれば、昇順ソート後は末尾 S 個だけが 1、降順ソート後は先頭 S 個だけが 1 になる。

X−1 以下と X 以下の分類差は値 X 一個だけなので、同じソート列を施した後も二つの 01 列の差分は X の現在位置だけに残る。

順列の値を order-preserving な閾値写像で二値化し、range sort を range count と range assign の遅延セグメント木操作へ落とす。

## 典型の発動条件

### 順序操作の閾値二値化

発動条件: 大小関係だけを使う更新後に、特定値の順位上の位置だけを追いたいとき。

隣接する二閾値の 01 列を並行して更新し、その差分から対象値を復元する。

### 区間代入・区間和の遅延セグメント木

発動条件: 二値列の区間内個数を求め、その個数に応じた連続区間を同じ値へ塗る操作が続くとき。

各ノードに 1 の個数と 0/1/未設定の lazy tag を持たせ、ソート一回を和取得と高々二回の代入で処理する。

## 問題固有の要素

x=X−1 の列では X は 1、x=X の列では X は 0 であり、順列なのでこの差を持つ要素は一つだけである。

別の問題へ持ち帰る視点: 特定キーを追跡するとき、キーの直前と直後の threshold projection の差分を指示関数として使える。

## 正当性

区間の 1 の個数を S とすれば、昇順ソート後は末尾 S 個だけが 1、降順ソート後は先頭 S 個だけが 1 になる。 X−1 以下と X 以下の分類差は値 X 一個だけなので、同じソート列を施した後も二つの 01 列の差分は X の現在位置だけに残る。 昇順なら 0 群の後に 1 群、降順なら 1 群の後に 0 群を一括代入でき、二列が最後に異なる唯一の位置が X の位置になる。

## 実装上の注意

- 1 の個数が 0 または区間長のときは空区間への更新を避け、実在する側だけ代入する。
- lazy tag は 0、1、未設定を区別し、0 の代入を未設定と混同しない。

## 復習の核

- 更新が値の大小関係だけに依存するなら、必要な出力を分離できる最少数の閾値へ射影する。
- 区間ソートを直接データ構造へ載せる前に、同値な「個数を数えて二つの一様区間へ塗る」操作へ言い換える。

## 計算量と制約

### 時間

O(N+Q log N)、二本の二値遅延木。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq Q \leq 2\times 10^5; 1 \leq X \leq N; (P_1,P_2,\ldots,P_N) is a permutation of (1,2,\ldots,N).; 1 \leq C_i \leq 2; 1 \leq L_i \leq R_i \leq N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/editorial/3341) — source-abc237-editorial-3341-f1734dda5225fe9572d62a871f0596aa63175e765d3694aba5ea9aad6315712b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/tasks/abc237_g) — source-abc237-g-problem-394b01373d29124e425a5c4ce66eeb9a2319483372e6457161698094c1e7c9ab
