---
title: "ABC449-F — Grid Clipping"
draft: true
authoringUnit: {"problemId":"abc449-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc449-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-interval-partition"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-dynamic-interval-union"],"sourceRevisionIds":["source-abc449-editorial-17255-6fd682baa90baf074010360d09d0a80654a34ffb17c7ac564f6a460f8a1daf80","source-abc449-f-problem-c9b7085ff7a09e8e38747fb18533e3d4dcc619eb39292a2eb76476305b7c0dc3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"黒マス (R,C) を含む開始位置は [R-h+1,R]×[C-w+1,C] で、合法開始範囲との共通部分だけを残す。 rectangle は上端で列 interval を追加し下端+1で削除する差分 event になり、同じ行の event はまとめてから次区間面積へ進む。 行座標間では active interval 集合が変わらず、union 長×行幅を加算すれば全 rectangle 和集合を O(N log N) で数えられる。","sourceRevisionIds":["source-abc449-editorial-17255-6fd682baa90baf074010360d09d0a80654a34ffb17c7ac564f6a460f8a1daf80","source-abc449-f-problem-c9b7085ff7a09e8e38747fb18533e3d4dcc619eb39292a2eb76476305b7c0dc3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

先に読む単元:

- [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md) — 順序付きのrun分割をdequeや連結リストで保持し、両端からの削除・分割・追加を行う。左端順setを使うODTとは区別する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

黒マスごとに、そのマスを含む切り出し開始位置の長方形を作る。求めるのはその和集合の面積なので、行方向にrectangle eventをsweepし、activeな列区間の被覆長を保つ。

列区間の追加・削除は、前提単元の座標圧縮した被覆長segment treeでrange更新する。各行eventの間ではactive集合が変わらないため、被覆長×行幅を加えればよい。

採用する候補: 開始位置rectangleの和集合をsweepし、被覆長segment treeで面積を数える。

開始位置の全組合せを列挙せず、黒マスごとの禁止範囲だけを処理できる。

棄却する候補: 全ての切り出し位置について内部の黒マスを走査する。

窓数が盤面面積に比例し、盤面の座標も大きい。

## 典型の発動条件

### rectangle union の sweep line

発動条件: 疎な点が巨大な座標平面上の長方形領域を被覆するとき。

一軸を event 化し、他軸 interval の union 長を動的管理する。

### 逆像としての窓位置数え上げ

発動条件: 各対象物を含む sliding window の開始位置を数えたいとき。

対象物ごとの開始位置 rectangle の和集合へ写す。

## 問題固有の要素

窓を盤面上で動かす代わりに、一つの黒マスから見た『このマスを含む窓の左上』領域へ視点を反転する。

別の問題へ持ち帰る視点: 巨大座標の面積は座標を全走査せず、状態が変わる境界 event 間を幅付きでまとめる。

## 正当性

黒マス (R,C) を含む開始位置は [R-h+1,R]×[C-w+1,C] で、合法開始範囲との共通部分だけを残す。 rectangle は上端で列 interval を追加し下端+1で削除する差分 event になり、同じ行の event はまとめてから次区間面積へ進む。 行座標間では active interval 集合が変わらず、union 長×行幅を加算すれば全 rectangle 和集合を O(N log N) で数えられる。

## 実装上の注意

- rectangleの列範囲を座標圧縮し、前提単元の被覆長segment treeでrange addを行う。mapやmultisetの全走査ではO(N log N)にならない。
- 開始位置の合法範囲へ両軸をclipし、閉区間の下端+1 eventと半開区間長を一貫して扱う。

## 復習の核

- 一つの黒マスで開始位置 rectangle を導き、複数 rectangle の重複を inclusion-exclusion でなく union sweep が処理することを確認する。

## 計算量と制約

### 時間

O(N log N)、N黒マスのrectangle eventと圧縮列union長segment tree。

### 空間

O(N)、event・列圧縮。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\le h\le H\le 10^9; 1\le w\le W\le 10^9; 0\le N\le 2\times 10^5; 1\le R_k\le H; 1\le C_k\le W; (R_{k_1},C_{k_1}) \neq (R_{k_2},C_{k_2}) (k_1 \neq k_2); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/editorial/17255) — source-abc449-editorial-17255-6fd682baa90baf074010360d09d0a80654a34ffb17c7ac564f6a460f8a1daf80
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/tasks/abc449_f) — source-abc449-f-problem-c9b7085ff7a09e8e38747fb18533e3d4dcc619eb39292a2eb76476305b7c0dc3
