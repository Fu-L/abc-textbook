---
title: "ABC360-G — Suitable Edit for LIS"
draft: true
authoringUnit: {"problemId":"abc360-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-aggregate-subsequence-transitions-by-value/outcome-aggregate-subsequence-transitions-by-value-shard-001/abc360-g.md","learningOutcomeIds":["outcome-aggregate-subsequence-transitions-by-value"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-dp-sequence","unit-range-monoid-aggregation"],"excludedTopics":["値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-value-range-dp","tag-coordinate-compression","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc360-editorial-10311-f2bf65622d7fe204fadcbd584906d7e0f8de510da599308200d58d73cee9d109","source-abc360-g-problem-afcb71f00ad3f3e54a1b1614aaa8488b7f197aba168ef8042cad3a714f6d0a41"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一要素変更で長さは高々 L+1、変更しない選択で L は保証される。L+1 を作る増加列から変更要素を外すと元列の LIS が残る。変更位置を、その LIS で直前に採った位置のすぐ後へ移しても順序を保てる。変更値をその直前値+1 に下げれば次の採用値より小さい。直前要素なしなら正の元値より小さい0を位置1へ置く。したがって位置 i の候補を i=1なら0、他は A_{i−1}+1 に限定してよい。各候補を通常採用・変更を今使う・既使用の三遷移で調べる DP はこの限定解を全て網羅する。","sourceRevisionIds":["source-abc360-editorial-10311-f2bf65622d7fe204fadcbd584906d7e0f8de510da599308200d58d73cee9d109","source-abc360-g-problem-afcb71f00ad3f3e54a1b1614aaa8488b7f197aba168ef8042cad3a714f6d0a41"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [値域集約による部分列DP](src/content/docs/learn/dynamic-programming/dp-value-range.md)

- 末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

通常 LIS 長 L と L+1 の可否へ整理する。追加要素を直前に採った元 LIS 要素のすぐ後へ移し、その値+1 とする交換により、位置 i の変更候補を A_{i−1}+1（先頭は0）へ限定できる。この有限候補を未変更・既変更の二状態で値 DP に載せる。

## 典型の発動条件

### フラグ付きLIS DP

発動条件: 列への操作回数が小さく、操作前後で通常の部分列DPを接続できるとき。

操作未使用・使用済みを別layerにし、値のstrict順序をprefix maximumで課す。

### 変更値候補の正規化

発動条件: 変更後の整数が任意で直接列挙できないとき。

増加部分列の隙間を作る役割だけ残し、境界直後の代表値へ寄せる。

## 問題固有の要素

最適値そのものより「元のLISに一要素を挿入できるか」という二択へ落とすと、変更操作の影響が局所的になる。

別の問題へ持ち帰る視点: 一要素編集で目的値がどこまで変わり得るか先に上界を示し、達成判定問題へ変える。

## 正当性

一要素変更で長さは高々 L+1、変更しない選択で L は保証される。L+1 を作る増加列から変更要素を外すと元列の LIS が残る。変更位置を、その LIS で直前に採った位置のすぐ後へ移しても順序を保てる。変更値をその直前値+1 に下げれば次の採用値より小さい。直前要素なしなら正の元値より小さい0を位置1へ置く。したがって位置 i の候補を i=1なら0、他は A_{i−1}+1 に限定してよい。各候補を通常採用・変更を今使う・既使用の三遷移で調べる DP はこの限定解を全て網羅する。

## 実装上の注意

圧縮座標は元値だけでなく0と A_{i−1}+1も含める。位置 i の両状態更新前に全必要な検索値を取得し、同一要素の再使用を防ぐ。比較は狭義なので候補値未満を検索する。

## 復習の核

- 変更要素を最終LISが使う場合・使わない場合を分け、一変更で増える上限を証明する。strict条件と同一iteration内更新の順序を重点的に確認する。

## 計算量と制約

### 時間

列長 N。未変更・変更済みの値 DP を二本の tree に置き、候補値を圧縮して O(N log N)。

### 空間

元値、A_{i−1}+1、0 の O(N) 個の座標と二本の tree で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc360/editorial/10311) — source-abc360-editorial-10311-f2bf65622d7fe204fadcbd584906d7e0f8de510da599308200d58d73cee9d109
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc360/tasks/abc360_g) — source-abc360-g-problem-afcb71f00ad3f3e54a1b1614aaa8488b7f197aba168ef8042cad3a714f6d0a41
