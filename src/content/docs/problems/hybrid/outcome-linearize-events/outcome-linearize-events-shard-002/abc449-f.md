---
title: "ABC449-F — Grid Clipping"
draft: true
authoringUnit: {"problemId":"abc449-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc449-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-interval-partition"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-dynamic-interval-union"],"sourceRevisionIds":["source-abc449-editorial-17255-6fd682baa90baf074010360d09d0a80654a34ffb17c7ac564f6a460f8a1daf80","source-abc449-f-problem-c9b7085ff7a09e8e38747fb18533e3d4dcc619eb39292a2eb76476305b7c0dc3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"黒マス (R,C) を含む開始位置は [R-h+1,R]×[C-w+1,C] で、合法開始範囲との共通部分だけを残す。 rectangle は上端で列 interval を追加し下端+1で削除する差分 event になり、同じ行の event はまとめてから次区間面積へ進む。 行座標間では active interval 集合が変わらず、union 長×行幅を加算すれば全 rectangle 和集合を O(N log N) で数えられる。","sourceRevisionIds":["source-abc449-editorial-17255-6fd682baa90baf074010360d09d0a80654a34ffb17c7ac564f6a460f8a1daf80","source-abc449-f-problem-c9b7085ff7a09e8e38747fb18533e3d4dcc619eb39292a2eb76476305b7c0dc3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-linearize-events"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"3×3盤面、2×2窓、黒マス(1,1)。","procedure":["合法窓開始は(1,1),(1,2),(2,1),(2,2)。","黒を含むのは(1,1)だけ。"],"executionTarget":null,"expectedResult":"黒を含まない窓3個。","verificationStatus":"not_applicable","learningUnitIds":["unit-event-sweep"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-linearize-events"],"prerequisiteIds":["unit-ordered-interval-partition"],"attainmentCondition":"二つの黒マスが同じ開始位置rectangleを覆うと二回引くか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"union面積として一回だけ引く。重複被覆頻度と被覆長を分けて管理する。"},"answer":{"reasoningOrVerification":"union面積として一回だけ引く。重複被覆頻度と被覆長を分けて管理する。","procedure":["具体例の各状態・寄与を再計算する。","union面積として一回だけ引く。重複被覆頻度と被覆長を分けて管理する。"],"expectedResult":"union面積として一回だけ引く。重複被覆頻度と被覆長を分けて管理する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

切り出し開始位置 (r_0,c_0) が黒マスを含む条件は、各黒マスが開始位置平面上に作る axis-aligned rectangle の和集合へ入ることと同値である。

採用する候補: 各黒マスの開始位置 rectangle を有効範囲で clip し、行方向の追加・削除 event を sort して、active 列 interval の union 長を保つ sweep line で被覆面積を求める。

行座標間では active interval 集合が変わらず、union 長×行幅を加算すれば全 rectangle 和集合を O(N log N) で数えられる。

棄却する候補: 全 (H-h+1)(W-w+1) 個の切り出し位置で、内部に黒マスがあるか走査する。

盤面寸法が巨大で開始位置を列挙できず、各窓検査も重複が大きい。

黒マス (R,C) を含む開始位置は [R-h+1,R]×[C-w+1,C] で、合法開始範囲との共通部分だけを残す。

rectangle は上端で列 interval を追加し下端+1で削除する差分 event になり、同じ行の event はまとめてから次区間面積へ進む。

各 rectangle を clip して (rL,+interval),(rR+1,-interval) を作る。r 昇順に走査し、前行との差×現在union長を加算してから event を multiset/map構造へ反映する。全合法窓数からunion面積を引く。

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

- 開始位置の合法範囲へ両軸を clip し、空 rectangle は捨てる。閉区間を rR+1 の event と半開区間長へ一貫変換する。

## 復習の核

- 一つの黒マスで開始位置 rectangle を導き、複数 rectangle の重複を inclusion-exclusion でなく union sweep が処理することを確認する。

## 計算量と制約

### 時間

O(N log N)、N黒マスのrectangle eventと圧縮列union長segment tree。

### 空間

O(N)、event・列圧縮。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\le h\le H\le 10^9; 1\le w\le W\le 10^9; 0\le N\le 2\times 10^5; 1\le R_k\le H; 1\le C_k\le W; (R_{k_1},C_{k_1}) \neq (R_{k_2},C_{k_2}) (k_1 \neq k_2); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

3×3盤面、2×2窓、黒マス(1,1)。

1. 合法窓開始は(1,1),(1,2),(2,1),(2,2)。
2. 黒を含むのは(1,1)だけ。

期待される結果: 黒を含まない窓3個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

二つの黒マスが同じ開始位置rectangleを覆うと二回引くか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

union面積として一回だけ引く。重複被覆頻度と被覆長を分けて管理する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/editorial/17255) — source-abc449-editorial-17255-6fd682baa90baf074010360d09d0a80654a34ffb17c7ac564f6a460f8a1daf80
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/tasks/abc449_f) — source-abc449-f-problem-c9b7085ff7a09e8e38747fb18533e3d4dcc619eb39292a2eb76476305b7c0dc3
