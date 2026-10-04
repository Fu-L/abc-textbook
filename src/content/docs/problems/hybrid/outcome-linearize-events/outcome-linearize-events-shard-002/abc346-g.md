---
title: "ABC346-G — Alone"
draft: true
authoringUnit: {"problemId":"abc346-g","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc346-g.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-actions"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-lazy-segment-action"],"sourceRevisionIds":["source-abc346-editorial-9638-0c7ad27ddd09787f39cd8190b177d312d9985eb4ad674bf527389b86e9030751","source-abc346-g-problem-8855088ceb0c5e93d97fc9dce94136b20fc688c72cb4aa09706db39c292d13a0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"固定Lでactive rectangleがcoverするR区間へ+1した配列Cを持てば、条件を満たすsubarray数はC_R>0の位置数である。Cは常に非負なので、segment treeが全体min値とその出現数を持てばzero数はmin=0の時のcountMin、positive数はN-zeroCountとなる。 同じsubarrayが複数のunique値を持つ重複をunionとして一度だけ数え、O(N log N)で処理できる。","sourceRevisionIds":["source-abc346-editorial-9638-0c7ad27ddd09787f39cd8190b177d312d9985eb4ad674bf527389b86e9030751","source-abc346-g-problem-8855088ceb0c5e93d97fc9dce94136b20fc688c72cb4aa09706db39c292d13a0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

先に読む単元:

- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md) — 結合的な区間要約を設計した後、更新作用の合成順と要約への適用を遅延評価する。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

位置iの値A_iがsubarray[L,R]内でちょうど一度現れる条件は、同値の直前位置p_iと次位置n_iに対しp_i<L≤i≤R<n_iである。したがってiは(L,R)平面上の長方形[p_i+1,i]×[i,n_i-1]をcoverする。

採用する候補: N個のrectangle unionの格子点数をL方向sweep＋range-add lazy segment treeで求める

同じsubarrayが複数のunique値を持つ重複をunionとして一度だけ数え、O(N log N)で処理できる。

棄却する候補: 各iのrectangle面積を単純加算する

一つのsubarrayにunique値が複数あると重複計数し、包除を直接行うのも指数的になる。

固定Lでactive rectangleがcoverするR区間へ+1した配列Cを持てば、条件を満たすsubarray数はC_R>0の位置数である。Cは常に非負なので、segment treeが全体min値とその出現数を持てばzero数はmin=0の時のcountMin、positive数はN-zeroCountとなる。

各iのprev/next same-valueを前後走査で求め、L=p_i+1でR区間[i,n_i-1]へ+1、L=iの回答後に-1するeventを作る。L=1…Nでadd events、positive R数をsegment rootの(min,countMin)から答えへ加算、remove eventsの順に処理する。range add lazy treeでminとcountを維持する。

## 典型の発動条件

### rectangle unionのsweep line

発動条件: 存在条件が(L,R)二次元grid上の複数長方形のunionとして表せる。

一軸Lを走査し、active rectangleのもう一軸interval cover countを維持する。

### range add・global minimum count

発動条件: 非負cover count列で0の位置数、すなわちunion外の点数を知りたい。

nodeにminimumとminimum個数を持ち、lazy range addition後もrootからzero数を得る。

## 問題固有の要素

求めるのは「exactly onceの値が存在する」subarrayなので、occurrenceごとのrectangleの和でなくunionを数えることが本質である。

別の問題へ持ち帰る視点: 存在量化された候補条件は各候補の適合集合を作り、そのunion measureとして重複を消す。

## 正当性

固定Lでactive rectangleがcoverするR区間へ+1した配列Cを持てば、条件を満たすsubarray数はC_R>0の位置数である。Cは常に非負なので、segment treeが全体min値とその出現数を持てばzero数はmin=0の時のcountMin、positive数はN-zeroCountとなる。 同じsubarrayが複数のunique値を持つ重複をunionとして一度だけ数え、O(N log N)で処理できる。

## 実装上の注意

- rectangle端は両方inclusiveなのでremoveはL=iのcountを加えた後に行う。R<Lの位置はactive intervalに覆われずzeroのままでpositive数へ入らないことを確認する。

## 復習の核

- 全要素distinct、全要素同値、複数unique値を持つsubarray、同値出現が交互の列をO(N^2)frequency真値と比較する。

## 計算量と制約

### 時間

O(N log N)、各indexが定数rectangle eventを作る。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc346/editorial/9638) — source-abc346-editorial-9638-0c7ad27ddd09787f39cd8190b177d312d9985eb4ad674bf527389b86e9030751
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc346/tasks/abc346_g) — source-abc346-g-problem-8855088ceb0c5e93d97fc9dce94136b20fc688c72cb4aa09706db39c292d13a0
