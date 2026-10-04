---
title: "ABC233-EX — Manhattan Christmas Tree"
draft: true
authoringUnit: {"problemId":"abc233-ex","docPath":"src/content/docs/problems/hybrid/outcome-share-threshold-checks-by-parallel-binary-search/outcome-share-threshold-checks-by-parallel-binary-search-shard-001/abc233-ex.md","learningOutcomeIds":["outcome-share-threshold-checks-by-parallel-binary-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-geometry-primitives","unit-monotone-search","unit-prefix-aggregate","unit-weighted-prefix-fenwick"],"excludedTopics":["parallel binary search・多数境界の判定共有の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-parallel-binary-search","tag-event-sweep","tag-fenwick-weighted-prefix","tag-geometry-orientation-transform","tag-prefix-difference"],"sourceRevisionIds":["source-abc233-editorial-3168-0c1d165e93d68d3bf3499da6e2d8b3e121078becbde551ea0e8a2b64167288e9","source-abc233-ex-problem-f04ff824ef976aa10b24fb65f3c09e6e23d13bd4fb674bd11610f90e72dcb0be"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"長方形内点数は x≤u＋r の prefix 個数から x＜u−r の prefix 個数を引き、各 prefix を y 区間和で求められる。 距離判定を軸平行長方形数え上げへ変換し、全クエリを各反復でまとめて点・イベントの一走査にできる。","sourceRevisionIds":["source-abc233-editorial-3168-0c1d165e93d68d3bf3499da6e2d8b3e121078becbde551ea0e8a2b64167288e9","source-abc233-ex-problem-f04ff824ef976aa10b24fb65f3c09e6e23d13bd4fb674bd11610f90e72dcb0be"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [parallel binary search・多数境界の判定共有](src/content/docs/learn/modeling/parallel-binary-search.md)

- 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。

先に読む単元:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md) — 判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

## 考察

座標を u＝x＋y、v＝x−y へ 45 度回転すると、元のマンハッタン距離は max(|Δu|,|Δv|) というチェビシェフ距離になる。

距離 r 以下の木は回転後の軸平行長方形 [u−r,u＋r]×[v−r,v＋r] 内の点であり、その個数が K 以上かは r に対して単調である。

棄却する候補: 各クエリについて全 N 本の木とのマンハッタン距離を計算し、K 番目を選ぶ。

N と Q がともに 10 万で、全点対距離を調べられない。

採用する候補: 各クエリの答えを並列二分探索し、同じ反復の全長方形内点数を x sweep と y 座標 Fenwick tree でオフライン計算する。

距離判定を軸平行長方形数え上げへ変換し、全クエリを各反復でまとめて点・イベントの一走査にできる。

長方形内点数は x≤u＋r の prefix 個数から x＜u−r の prefix 個数を引き、各 prefix を y 区間和で求められる。

K 番目距離を単調な個数判定へ変え、回転座標の矩形問合せを二つの x-prefix イベントへ分解して、parallel binary search と BIT sweep を重ねる。

## 典型の発動条件

### マンハッタン距離の 45 度回転

発動条件: 二次元の |Δx|＋|Δy| 距離球を範囲数え上げへ変換したいとき。

x＋y と x−y を座標にし、距離 r の菱形を軸平行正方形へ写す。

### 並列二分探索とオフライン矩形計数

発動条件: 多数のクエリがそれぞれ単調な閾値を持ち、一つの候補値集合を一括 sweep で判定できるとき。

各クエリの mid 長方形を左右二イベントにし、x 順に点を追加しながら BIT の y 区間和を取る。

## 問題固有の要素

K 番目の距離そのものを選択する代わりに、「半径 r 内の木が K 本以上」という累積個数へ置くと二分探索可能になる。

別の問題へ持ち帰る視点: 順序統計量の幾何クエリは、閾値内の要素数を返す counting oracle を設計して答えの二分探索へつなげる。

## 正当性

長方形内点数は x≤u＋r の prefix 個数から x＜u−r の prefix 個数を引き、各 prefix を y 区間和で求められる。 距離判定を軸平行長方形数え上げへ変換し、全クエリを各反復でまとめて点・イベントの一走査にできる。

## 実装上の注意

- v＝x−y は負になり得るので全点と問合せ端点を圧縮し、長方形の上下端を非厳密に含める。
- 左境界イベントは x＜u−r、右境界イベントは x≤u＋r となるよう、同じ x の点と問合せイベントの処理順を揃える。

## 復習の核

- K 番目の幾何距離を見たら、半径内個数の単調性と、その距離球を数えやすい図形へ変える座標変換を探す。
- オフライン矩形数え上げでは、開区間・閉区間をイベントの座標と同値時の順序まで含めて検証する。

## 計算量と制約

### 時間

O(log C·(N+Q)log(N+Q))、C距離域、parallel binary search各roundで一BIT sweep。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 7 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 10^5; 0\leq x_i\leq 10^5; 0\leq y_i\leq 10^5; (x_i,y_i) \neq (x_j,y_j) if i\neq j.; 1\leq Q \leq 10^5; 0\leq a_i\leq 10^5; 0\leq b_i\leq 10^5; 1\leq K_i\leq N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc233/editorial/3168) — source-abc233-editorial-3168-0c1d165e93d68d3bf3499da6e2d8b3e121078becbde551ea0e8a2b64167288e9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc233/tasks/abc233_h) — source-abc233-ex-problem-f04ff824ef976aa10b24fb65f3c09e6e23d13bd4fb674bd11610f90e72dcb0be
