---
title: "ABC431-G — One Time Swap 2"
draft: true
authoringUnit: {"problemId":"abc431-g","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc431-g.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset","tag-coordinate-compression","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc431-editorial-14517-99b426921794d7dec8960aeb826e802ebc66208b43ff209034a76585df924bcf","source-abc431-g-problem-233e542369d4b3006247612b2a6220f1dd6906f5101cc22696f475f0da480beb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A_l>A_r の小さい側では f(l,r) の順序が (l,A_r,-r) の辞書順と一致する。l が先、次に交換後の先頭値、同値なら元の大値が現れる位置を遅らせる r 降順になる。 大きい側では対称に (-l,A_r,r) の順で比較できる。 各 l に属する有効な r の個数を累積すれば k 番目が属する l を決め、残りは suffix の値の順序統計で選べる。 列全体を生成せず swap 対 (l,r) の key だけで順序統計を処理でき、Fenwick 木等で O((N+Q)log N) 規模になる。","sourceRevisionIds":["source-abc431-editorial-14517-99b426921794d7dec8960aeb826e802ebc66208b43ff209034a76585df924bcf","source-abc431-g-problem-233e542369d4b3006247612b2a6220f1dd6906f5101cc22696f475f0da480beb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一回 swap した列 f(l,r) と元列 A の辞書順比較は、最初に変わる位置 l だけで決まり、A_l>A_r なら小さく、等しければ同じ、大なら逆になる。

採用する候補: 元列より小さい・等しい・大きい swap を個数で三分し、両側では辞書順を決める小さな key 順にクエリをオフライン選択する。

列全体を生成せず swap 対 (l,r) の key だけで順序統計を処理でき、Fenwick 木等で O((N+Q)log N) 規模になる。

棄却する候補: 全 N(N-1)/2 個の swap 後列を構築して辞書順ソートする。

列の構築だけで三乗規模となり、候補数も大きすぎる。

A_l>A_r の小さい側では f(l,r) の順序が (l,A_r,-r) の辞書順と一致する。l が先、次に交換後の先頭値、同値なら元の大値が現れる位置を遅らせる r 降順になる。

大きい側では対称に (-l,A_r,r) の順で比較できる。

各 l に属する有効な r の個数を累積すれば k 番目が属する l を決め、残りは suffix の値の順序統計で選べる。

転倒対数と昇順対数を Fenwick 木で数え、各質問 k を小・同一・大の区間へ分類する。同一なら A を返す。小側質問を k 昇順に処理し、所属 l、suffix 中 A_r<A_l の k' 番目の値、同値 r の降順を順序統計構造で求める。大側も左右の key を反転して対称処理し、選んだ一組だけ swap して出力する。

## 典型の発動条件

### 辞書順の最初の相違点

発動条件: 大きな列候補同士の順序が、変更された最初の少数位置だけで決まるとき。

swap 後列を (l,A_r,±r) という定数長 key へ圧縮する。

### オフライン順序統計

発動条件: 多数の k 番目候補質問を、走査に合わせて集合を更新しながら答えるとき。

Fenwick 木または kth 対応集合で suffix 値の個数と k-th を得る。

### 対称ケース分解

発動条件: 基準列より小さい・等しい・大きい候補で比較規則が単純化するとき。

転倒対、等値対、昇順対を分離し、両端の群を反転した key で処理する。

## 問題固有の要素

一箇所 swap 後の辞書順は列全体でなく、最初の変更位置とそこへ来る値、同値時の二つ目の変更位置で決まる。

別の問題へ持ち帰る視点: 巨大な派生オブジェクト集合の k 番目は、比較を生成パラメータの短い key に落として順序統計を取る。

## 正当性

A_l>A_r の小さい側では f(l,r) の順序が (l,A_r,-r) の辞書順と一致する。l が先、次に交換後の先頭値、同値なら元の大値が現れる位置を遅らせる r 降順になる。 大きい側では対称に (-l,A_r,r) の順で比較できる。 各 l に属する有効な r の個数を累積すれば k 番目が属する l を決め、残りは suffix の値の順序統計で選べる。 列全体を生成せず swap 対 (l,r) の key だけで順序統計を処理でき、Fenwick 木等で O((N+Q)log N) 規模になる。

## 実装上の注意

- 問題の k の 1-index/0-index と同一列を生む A_l=A_r の範囲境界を統一する。小側の r は降順、大側の r は昇順という tie-break を逆にしない。

## 復習の核

- 小側・大側それぞれの key を実際の最初の相違位置で証明し、k の群内 offset と r の tie-break を確認する。

## 計算量と制約

### 時間

選択計算O((N+Q)log N)、列全体の出力を含めO((N+Q)log N+NQ)。

### 空間

O(N+Q)、出力を逐次生成する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; 1\leq Q\leq 2\times 10^5; 1\leq A_i\leq N; 1\leq k\leq \frac{N(N-1)}{2}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/editorial/14517) — source-abc431-editorial-14517-99b426921794d7dec8960aeb826e802ebc66208b43ff209034a76585df924bcf
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/tasks/abc431_g) — source-abc431-g-problem-233e542369d4b3006247612b2a6220f1dd6906f5101cc22696f475f0da480beb
