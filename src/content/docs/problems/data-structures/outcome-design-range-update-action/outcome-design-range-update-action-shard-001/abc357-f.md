---
title: "ABC357-F — Two Sequence Queries"
draft: true
authoringUnit: {"problemId":"abc357-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc357-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc357-editorial-10186-0ffc8702f9b8507bafcdee69c180255e62398d8223724386832f88075516947d","source-abc357-f-problem-a79b7aaa8ea4d464d60eeb53b25ebc4cbaa9cada5f4c8200d478058990ceb2c5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"sumABのcross term更新には更新前sumA,sumBを使うので、式を一括で評価してからsumA,sumBを更新する。 二lazy操作 (x1,y1),(x2,y2) の合成は (x1+x2,y1+y2) で、xy項はmapping時に現在nodeへ自動的に現れる。 mapping・composition・mergeがすべて定数時間で、各query O(log N)になる。","sourceRevisionIds":["source-abc357-editorial-10186-0ffc8702f9b8507bafcdee69c180255e62398d8223724386832f88075516947d","source-abc357-f-problem-a79b7aaa8ea4d464d60eeb53b25ebc4cbaa9cada5f4c8200d478058990ceb2c5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

区間へ A にx、Bにyを加えると積和は sumAB+y·sumA+x·sumB+len·xy へ変わる。sumABだけでは更新できず、一次の和二つも必要である。

操作 (x,y) は成分ごとの加算で合成が単なる加算となり、node情報 (len,sumA,sumB,sumAB) への作用も O(1) で閉じる。

採用する候補: 四集約をnodeに、(addA,addB)をlazy tagに持つ遅延segment treeで範囲加算・積和queryを処理する。

mapping・composition・mergeがすべて定数時間で、各query O(log N)になる。

棄却する候補: A,Bそれぞれのrange add用構造を持ち、type3で各要素積を取り直す。

個別値を得られても区間長分のpoint queryが必要で、一回O(N log N)になり得る。

sumABのcross term更新には更新前sumA,sumBを使うので、式を一括で評価してからsumA,sumBを更新する。

二lazy操作 (x1,y1),(x2,y2) の合成は (x1+x2,y1+y2) で、xy項はmapping時に現在nodeへ自動的に現れる。

leaf iを (1,A_i,B_i,A_iB_i) とする。opは各成分和。mapping(x,y,node)で sumAB+=y sumA+x sumB+len xy、sumA+=len x、sumB+=len y。lazy tagは加算合成する。type1/2をrange apply、type3でrange productのsumABを出す。

## 典型の発動条件

### 積のrange updateに必要なmoment拡張

発動条件: 複数配列の積和をqueryし、各配列へ独立な加算が来るとき。

0次len、一次sumA/sumB、二次sumABまで持って二項展開を閉じる。

### 遅延segment treeの作用設計

発動条件: 区間情報monoidへ更新monoidが準同型として作用するとき。

mapping・composition・identityを数式から定義する。

## 問題固有の要素

欲しい二次量だけでなく、更新式に現れる低次momentを一緒に持つとlazy作用が閉じる。

別の問題へ持ち帰る視点: range updateで統計量が閉じないとき、展開式に出る補助統計量を状態へ追加する。

## 正当性

sumABのcross term更新には更新前sumA,sumBを使うので、式を一括で評価してからsumA,sumBを更新する。 二lazy操作 (x1,y1),(x2,y2) の合成は (x1+x2,y1+y2) で、xy項はmapping時に現在nodeへ自動的に現れる。 mapping・composition・mergeがすべて定数時間で、各query O(log N)になる。

## 実装上の注意

- sumAB更新より先にsumA/sumBを書換えない。全入力・tag・積をmod正規化し、len xyの乗算幅を確保する。

## 復習の核

- mapping式を更新前変数で展開し、操作を二回適用した結果とtag合成結果が一致するか確認する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,Q\leq 2\times 10^5; 0\leq A_i,B_i\leq 10^9; 1\leq l\leq r\leq N; 1\leq x\leq 10^9; All input values are integers.; There is at least one query of the third type.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc357/editorial/10186) — source-abc357-editorial-10186-0ffc8702f9b8507bafcdee69c180255e62398d8223724386832f88075516947d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc357/tasks/abc357_f) — source-abc357-f-problem-a79b7aaa8ea4d464d60eeb53b25ebc4cbaa9cada5f4c8200d478058990ceb2c5
