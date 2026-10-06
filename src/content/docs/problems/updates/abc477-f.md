---
title: "ABC477 F — Count Cells in a Window"
draft: true
authoringUnit: {"problemId":"abc477-f","docPath":"src/content/docs/problems/updates/abc477-f.md","learningOutcomeIds":["outcome-linearize-events","outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-event-sweep","tag-lazy-segment-action"],"sourceRevisionIds":["source-abc477-f-problem-32551768cb7a990424f9a1bc33ef93ac02eb27a0082a0b7d78eb8b4581aae77e","source-abc477-editorial-26406-3d9dfe3ad111763a28ecfba66e219662eb99ca92d66ee12ea1daed99026fddae"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"掃引境界xで各葉の値は行[0,x)にある、その列の黒マス数に等しい。初期は全て0であり、一行の区間加算がこの不変条件を保つ。従って列区間和はF(x,l,r)と一致し、二つの行prefixの差は目的矩形だけを数える。","sourceRevisionIds":["source-abc477-f-problem-32551768cb7a990424f9a1bc33ef93ac02eb27a0082a0b7d78eb8b4581aae77e","source-abc477-editorial-26406-3d9dfe3ad111763a28ecfba66e219662eb99ca92d66ee12ea1daed99026fddae"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

先に読む単元:

- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

## 考察

各行の黒マスは一区間だが、質問矩形と重なる黒マス数を行ごとに足すと O(NQ)。二次元累積和を全セルに作ることも O(NM) で大きすぎる。ここでは行のprefixを一つずつ伸ばすとき、変わる列が一区間であることを使う。

半開区間へ変換し、F(x,l,r)を行[0,x)、列[l,r)内の黒マス数とする。質問[A,B)×[C,D)の答えはF(B,C,D)−F(A,C,D)。各質問を行境界Bに符号+1、Aに−1を付けた二つのイベントへ分ける。境界が0..Nなので、ソートをせず行ごとの配列へイベントを置いてもよい。

現在までに取り込んだ黒マス数を列ごとに保持する。行xを取り込む操作は列[L_x,R_x)の各値へ1を加えるだけである。列区間和を答えられるLazy Segment Treeを使い、各ノードの要約を(和s,長さlen)、加算aの作用を(s+a len,len)にする。行境界xでは先にF(x,…)のイベントに答え、その後で行xを追加する。この順序にすれば上下端の扱いが明瞭になる。

入力は行・列とも1-based閉区間なので、[L,R]は0-basedの[L−1,R)へ変換する。イベントには質問IDと符号を保存して、二回の区間和を同じ回答へ蓄積する。二次元の巨大な面を保存せず、掃引済み行の列別集約だけを残す。

## 典型の発動条件

二次元の静的矩形クエリを一軸のprefixの差にし、一軸を伸ばす差分を残る軸の区間更新で保守する。

## 問題固有の要素

一行にある黒マスが連続することから、行の追加が一回のrange addになる。一般の矩形更新を扱う追加構造は要らない。

## 正当性

掃引境界xで各葉の値は行[0,x)にある、その列の黒マス数に等しい。初期は全て0であり、一行の区間加算がこの不変条件を保つ。従って列区間和はF(x,l,r)と一致し、二つの行prefixの差は目的矩形だけを数える。

## 実装上の注意

行を加える前にその境界の質問へ答える。答えはNMまであるので64 bit整数。木の単位元の長さは0、各実葉の長さは1とする。

## 復習の核

平面走査では『次の行を取り込む差分』を先に書く。その差分に合う区間データ構造を選ぶ。

## 計算量と制約

### 時間

行境界にイベントを配置すれば O((N+Q) log M)。イベントをソートする実装なら追加で O(Q log Q)。

### 空間

列の木 O(M)、境界イベント O(N+Q)。

### 制約との対応

Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N,M,Q \le 2\times10^5; 1 \le L_i \le R_i \le M; For each query, 1 \le A \le B \le N.; For each query, 1 \le C \le D \le M.; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc477/tasks/abc477_f)
- [公式解説](https://atcoder.jp/contests/abc477/editorial/26406)
