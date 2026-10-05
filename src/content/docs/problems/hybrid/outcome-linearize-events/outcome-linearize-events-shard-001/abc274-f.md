---
title: "ABC274-F — Fishing"
draft: true
authoringUnit: {"problemId":"abc274-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc274-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc274-f-problem-2fc534f53deab4a68e673f61f407eb17832df060862c7177163e534a96ea2933","source-abc274-editorial-5021-c2218204378652ca3ddfe2ed53d7212a742a711610e7d343c09631410bf41866"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"relative velocity ΔVが0ならrelative position ΔXが[0,A]かで全時刻/emptyを判定し、ΔV≠0なら二不等式からentry/exit timesを得る。 net endpointsはinclusiveなので同じtimeにentryとexitが重なる場合、その瞬間のweightを評価するためadd eventsをremove eventsより先に処理する。 固定anchorでは捕獲weightがinterval endpointsでのみ変化し、2N eventsの最大prefix weightを求めればよい。","sourceRevisionIds":["source-abc274-f-problem-2fc534f53deab4a68e673f61f407eb17832df060862c7177163e534a96ea2933","source-abc274-editorial-5021-c2218204378652ca3ddfe2ed53d7212a742a711610e7d343c09631410bf41866"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

先に読む単元:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

最適なlength-A netは、捕まえるfishのうち最左のものにleft endpointを合わせても捕獲集合を減らさない。

left endpointをfish iのposition X_i+V_i tへ追従させると、fish jがnet内にいる条件は0≤(X_j−X_i)+(V_j−V_i)t≤Aで、t≥0上の一intervalになる。

棄却する候補: timeとnet positionを連続量のまま探索する。

候補が無限にあり、任意時刻ごとのfish positionsを列挙できない。

採用する候補: anchor fish iを全列挙し、各fishのnet滞在time intervalのweighted add/remove eventsをsortしてsweepする。

## 典型の発動条件

### moving objectsの相対座標化

発動条件: moving windowを一objectへ固定すると、他objectsの所属条件がtimeの一次不等式になるとき。

fish iを静止anchorとみなし、各fish jのrelative position ΔX+ΔVtが[0,A]に入る区間を求める。

### 重み付きinterval event sweep

発動条件: 各対象が有効なtime rangeを一intervalで持ち、同時に有効なweight総和の最大を求めるとき。

entryで+W、exitで−Wのeventsを時刻順に処理してmaximum active weightを更新する。

## 問題固有の要素

net left endpointのanchorは捕獲時点の最左fishに選べるため、N anchorsで全optimal placementsを覆う。

別の問題へ持ち帰る視点: 連続位置の固定長window最適化では、optimal windowを含有objectの境界へslideして候補を離散化する。

## 正当性

relative velocity ΔVが0ならrelative position ΔXが[0,A]かで全時刻/emptyを判定し、ΔV≠0なら二不等式からentry/exit timesを得る。 net endpointsはinclusiveなので同じtimeにentryとexitが重なる場合、その瞬間のweightを評価するためadd eventsをremove eventsより先に処理する。 固定anchorでは捕獲weightがinterval endpointsでのみ変化し、2N eventsの最大prefix weightを求めればよい。

## 実装上の注意

- rational endpointの大小はcross multiplicationで比較してfloating errorを避け、negative-time portionをt=0でclipする。
- 同時刻eventのinclusive規約をsort tie-breakへ反映し、unbounded intervalにはremove eventを作らない。

## 復習の核

- 連続なwindow位置は、最適解を失わず端点をobjectへ合わせて有限候補にする。
- 移動体のwindow membershipはanchorとの相対位置に直し、有効time intervalのoverlapとして見る。

## 計算量と制約

### 時間

O(N² log N)、各anchorにN個の有効時刻区間をsort。

### 空間

O(N)、一anchorのevent。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2000; 1 \leq A \leq 10^4; 1 \leq W_i\leq 10^4; 0 \leq X_i\leq 10^4; 1 \leq V_i\leq 10^4; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/tasks/abc274_f) — source-abc274-f-problem-2fc534f53deab4a68e673f61f407eb17832df060862c7177163e534a96ea2933
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/editorial/5021) — source-abc274-editorial-5021-c2218204378652ca3ddfe2ed53d7212a742a711610e7d343c09631410bf41866
