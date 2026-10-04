---
title: "ABC266-EX — Snuke Panic (2D)"
draft: true
authoringUnit: {"problemId":"abc266-ex","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc266-ex.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-geometry-primitives","unit-range-monoid-aggregation"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-coordinate-compression","tag-geometry-orientation-transform","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc266-ex-problem-d42280e7018a1832423bfbe7980967b58fd966efa151456d572a7ccc05e30b6e","source-abc266-editorial-4664-3de16c26abac708494bcebe75ef4adbd62f02c063d34f554e601c77db6142193"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"開始状態(0,0,0)も変換後点(a,b,y)=(0,0,0)、dp=0として追加すれば、原点から直接到達可能なeventを同じ照会で扱える。 三座標が全て非減少なら変換の逆式から時刻も非減少なので、dominance順はdpの有向非巡回依存を保つ。 移動可能な全過去eventが直交prefix領域になり、座標圧縮した二次元dominance maxへ置き換えられる。","sourceRevisionIds":["source-abc266-ex-problem-d42280e7018a1832423bfbe7980967b58fd966efa151456d572a7ccc05e30b6e","source-abc266-editorial-4664-3de16c26abac708494bcebe75ef4adbd62f02c063d34f554e601c77db6142193"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

event p'=(t',x',y') から p=(t,x,y) へ移れる条件は y'≤y かつ |x−x'|+y−y'≤t−t' である。

a=t−x−y、b=t+x−y と変換すると、この条件は a'≤a、b'≤b、y'≤y の三次元dominanceになる。

棄却する候補: 時刻順に各eventから過去全eventを調べ、移動可能ならdp候補を更新する。

event対がN^2個あり、N=10万では比較できない。

採用する候補: 各eventを(a,b,y)へ写し、yでsweepしながら(a,b)prefix rectangleのdp最大値を疎な二次元BIT/segment treeで照会してpoint updateする。

移動可能な全過去eventが直交prefix領域になり、座標圧縮した二次元dominance maxへ置き換えられる。

開始状態(0,0,0)も変換後点(a,b,y)=(0,0,0)、dp=0として追加すれば、原点から直接到達可能なeventを同じ照会で扱える。

三座標が全て非減少なら変換の逆式から時刻も非減少なので、dominance順はdpの有向非巡回依存を保つ。

anisotropic movement coneをlinear coordinate transformでorthant orderへ変え、weighted event schedulingを3D dominance maximum DPとして解く。

## 典型の発動条件

### 移動可能領域の座標変換

発動条件: 時空間の到達条件が絶対値を含む複数の線形不等式で表されるとき。

絶対値を二不等式へ分け、それぞれを新座標の大小比較へ変換する。

### 三次元dominance最大値DP

発動条件: 前状態から現状態への遷移可否が三座標全ての非減少で、点重み最大chainを求めるとき。

一軸でsweepし、残る二軸のprefix rectangle maximumを動的データ構造で取得する。

### offline疎二次元データ構造

発動条件: point updateとprefix rectangle queryが必要だが、座標と更新点が事前に分かるとき。

外側BITの各nodeに現れる内側座標だけを集めて圧縮し、BIT on BITでmaxを持つ。

## 問題固有の要素

負のy方向禁止は独立な条件y'≤yとして残り、x方向の速度制限だけがa,bの二軸へ展開される。

別の問題へ持ち帰る視点: 移動制約の座標変換では、既に単調な軸を無理に混ぜずdominanceの一軸として保持する。

## 正当性

開始状態(0,0,0)も変換後点(a,b,y)=(0,0,0)、dp=0として追加すれば、原点から直接到達可能なeventを同じ照会で扱える。 三座標が全て非減少なら変換の逆式から時刻も非減少なので、dominance順はdpの有向非巡回依存を保つ。 移動可能な全過去eventが直交prefix領域になり、座標圧縮した二次元dominance maxへ置き換えられる。

## 実装上の注意

- y,a,bのdominanceに矛盾しない順で同一座標群を処理し、到達不能eventへ−INFからA_iを加えない。
- 変換座標と獲得量合計はいずれも64 bit整数で保持する。

## 復習の核

- 絶対値付き到達条件は符号ごとの線形不等式へ分け、全てが座標wise orderになる変数を探す。
- 高次元dominance DPでは、一軸を処理順に消して残りをrange query構造へ載せる。

## 計算量と制約

### 時間

O(N log²N)、三次元dominance DP、圧縮二次元BIT。

### 空間

O(N log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq T_i \leq 10^9; 0 \leq X_i,Y_i \leq 10^9; 1 \leq A_i \leq 10^9; The triples (T_i,X_i,Y_i) are distinct.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc266/tasks/abc266_h) — source-abc266-ex-problem-d42280e7018a1832423bfbe7980967b58fd966efa151456d572a7ccc05e30b6e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc266/editorial/4664) — source-abc266-editorial-4664-3de16c26abac708494bcebe75ef4adbd62f02c063d34f554e601c77db6142193
