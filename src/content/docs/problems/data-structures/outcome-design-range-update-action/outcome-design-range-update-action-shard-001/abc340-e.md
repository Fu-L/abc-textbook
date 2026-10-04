---
title: "ABC340-E — Mancala 2"
draft: true
authoringUnit: {"problemId":"abc340-e","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc340-e.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc340-e-problem-2739bd0ea499a6055ddfc9471834e0c70283a59edc35aa44e90e3ed93997dfa4","source-abc340-editorial-9251-d24f7d167cde6a7d6dd2df592eccc90228c4a02ac371153348ebba531655e07b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"q=floor(X/N)周では各箱が正確にq個受け取り、r=X mod N個だけがBの直後から連続する循環区間へ一つずつ入る。r<Nなのでwrapしても通常区間二つ以内に分割できる。 一操作を定数回の区間加算と一点更新へ変換し、M回をO(M log N)で処理できる。","sourceRevisionIds":["source-abc340-e-problem-2739bd0ea499a6055ddfc9471834e0c70283a59edc35aa44e90e3ed93997dfa4","source-abc340-editorial-9251-d24f7d167cde6a7d6dd2df592eccc90228c4a02ac371153348ebba531655e07b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 過去の版の保存・rollback・構造共有。

## 考察

箱BのX個を一球ずつ配る操作は、N個単位のfull lapと残りX mod N個へ分けられる。全箱へfloor(X/N)を加えた後、B+1から循環順にX mod N箱へ1を加えるだけである。

採用する候補: range add・point get/set可能なlazy segment treeで操作をまとめる

棄却する候補: ballを一個ずつ次箱へ移す

A_iや途中の箱内ball数は非常に大きく、総ball数に比例するsimulationはできない。

range-add lazy segment treeへ初期Aを入れる。各B_iでpoint queryしてXを得て、その点へ-Xを加えて0にする。全区間へq=X/Nを加え、r=X mod Nについて[B+1,B+1+r)をmod Nで一つまたは二つのrangeへ分けて+1する。最後に各pointを出力する。

## 典型の発動条件

### 周期操作の商と剰余分解

発動条件: 同じ順序でN箱を何周も巡って一個ずつ配る。

個数XをqN+rに分け、qを全体一括、rを一つの循環区間として処理する。

### range add・point query

発動条件: 更新が全体または連続区間への同値加算で、次操作では一点値が必要である。

lazy segment treeまたは差分Fenwick treeで区間加算し、指定箱の現在値を取得する。

## 問題固有の要素

循環区間の長さrは必ずN未満なので、開始indexをずらして末尾を超えた時だけ二区間へ割ればよい。

別の問題へ持ち帰る視点: cyclicな均等配布はfull cycleとresidual arcへ分けるとrange updateになる。

## 正当性

q=floor(X/N)周では各箱が正確にq個受け取り、r=X mod N個だけがBの直後から連続する循環区間へ一つずつ入る。r<Nなのでwrapしても通常区間二つ以内に分割できる。 一操作を定数回の区間加算と一点更新へ変換し、M回をO(M log N)で処理できる。

## 実装上の注意

- 箱番号は0-basedで、残り配布はB自身でなくB+1から始まる。一点を0にする更新は現在値を取得して-Xする形ならlazy値と整合する。

## 復習の核

- X=0、X<N、XがNの倍数、remainderがindex Nを跨ぐ場合を一球simulationと比較する。

## 計算量と制約

### 時間

O(N+M log N)、最終葉展開O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq M \leq 2\times 10^5; 0 \leq A_i \leq 10^9; 0 \leq B_i < N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc340/tasks/abc340_e) — source-abc340-e-problem-2739bd0ea499a6055ddfc9471834e0c70283a59edc35aa44e90e3ed93997dfa4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc340/editorial/9251) — source-abc340-editorial-9251-d24f7d167cde6a7d6dd2df592eccc90228c4a02ac371153348ebba531655e07b
