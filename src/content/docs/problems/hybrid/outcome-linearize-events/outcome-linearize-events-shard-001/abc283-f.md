---
title: "ABC283-F — Permutation Distance"
draft: true
authoringUnit: {"problemId":"abc283-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc283-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-range-monoid-aggregation"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-geometry-orientation-transform","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc283-editorial-5429-265733246d92900746fb904ca503345a78237200e139aec78840cf3ccc46297a","source-abc283-f-problem-ddedbccc58b75b633702cef20a7efe1e20c558840ee7a6a098a9930490417307"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"j<i,P_j<P_iではdistance=P_i+i-(P_j+j)なので、P_j<P_i上のP_j+j最大値だけが必要である。 他の3caseもP_j-jのmax/minや反対向きsweepへ変わるだけで、座標反転・値反転を使えば同じhelperを再利用できる。 全pair比較を、各pointあたり定数回のvalue range queryへ変えられる。","sourceRevisionIds":["source-abc283-editorial-5429-265733246d92900746fb904ca503345a78237200e139aec78840cf3ccc46297a","source-abc283-f-problem-ddedbccc58b75b633702cef20a7efe1e20c558840ee7a6a098a9930490417307"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

(i,P_i)を平面上のpointと見ると、D_iは他pointへのManhattan distance最小値で、絶対値はindex左右×value上下の4quadrantに分けられる。

各quadrantでは式が±i±P_iと、条件付きの過去/未来pointのmaxまたはminへ分離する。

採用する候補: indexを左右からsweepし、Pをkeyとするsegment treeでP_j±jのrange max/minをqueryして4quadrantの候補を更新する。

全pair比較を、各pointあたり定数回のvalue range queryへ変えられる。

棄却する候補: 各i,jのManhattan distanceを計算して最小を取る。

N≤2×10^5に対してN² pairは多すぎる。

j<i,P_j<P_iではdistance=P_i+i-(P_j+j)なので、P_j<P_i上のP_j+j最大値だけが必要である。

他の3caseもP_j-jのmax/minや反対向きsweepへ変わるだけで、座標反転・値反転を使えば同じhelperを再利用できる。

左→右sweepでvalue range [1,P_i)と(P_i,N]から対応するP_j+j/P_j-j extremumをqueryしD_iを更新後、P_i位置へ値を登録する。右→左でも対称な2caseを処理し、4候補のminを出力する。

## 典型の発動条件

### Manhattan distanceのquadrant分解

発動条件: 点集合で|x-x'|+|y-y'|のnearest/farthestを条件付きに処理するとき。

符号4通りへ絶対値を外し、linear formのextremum queryにする。

### sweep line＋value segment tree

発動条件: 片方の座標の大小を走査順で固定し、もう片方の範囲条件付きextremumが必要なとき。

index順にpointを追加し、P区間のmax/minを取得する。

## 問題固有の要素

Pがpermutationなのでvalueをそのまま1…Nのsegment tree indexにでき、同値処理や座標圧縮が不要である。

別の問題へ持ち帰る視点: 一方座標がpermutationなら、2D dominance queryの残り軸を直接dense indexとして使う。

## 正当性

j<i,P_j<P_iではdistance=P_i+i-(P_j+j)なので、P_j<P_i上のP_j+j最大値だけが必要である。 他の3caseもP_j-jのmax/minや反対向きsweepへ変わるだけで、座標反転・値反転を使えば同じhelperを再利用できる。 全pair比較を、各pointあたり定数回のvalue range queryへ変えられる。

## 実装上の注意

- j≠iを保証するためqueryしてから現在pointをupdateし、空rangeはINF/−INFとして候補に使わない。
- 4caseの符号を個別に書く場合はA_i=P_i+i,B_i=P_i-iのどちらをmax/minするか照合する。

## 復習の核

- 1つのiについて他pointを4quadrantに分け、各distance式からqueryすべきlinear formとmax/minを手で導く。

## 計算量と制約

### 時間

O(N log N)、四象限sweepと値域extremum。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times10^5; 1 \leq P _ i \leq N\ (1\leq i\leq N); i\neq j\implies P _ i\neq P _ j; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc283/editorial/5429) — source-abc283-editorial-5429-265733246d92900746fb904ca503345a78237200e139aec78840cf3ccc46297a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc283/tasks/abc283_f) — source-abc283-f-problem-ddedbccc58b75b633702cef20a7efe1e20c558840ee7a6a098a9930490417307
