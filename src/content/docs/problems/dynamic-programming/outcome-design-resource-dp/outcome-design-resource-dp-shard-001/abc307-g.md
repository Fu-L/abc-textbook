---
title: "ABC307-G — Approximate Equalization"
draft: true
authoringUnit: {"problemId":"abc307-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc307-g.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-prefix-aggregate"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource","tag-prefix-difference"],"sourceRevisionIds":["source-abc307-g-problem-1a12f13209e3432c1289d0ccb8cb009ce4c0ffaeffa3f6e1b117a7eb37df511f","source-abc307-editorial-6660-a4e66cfdc5fb09ee57b8249e20af372e6a1ce6b3f60e1c1a3fc0c84b5e8de237"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"均等化後の各値はqまたはq+1で高値がr個。辺iを跨ぐ移送量は元prefixと目標prefixの差で費用は絶対値。iまでの高値個数jだけで目標prefix iq+jが定まり、低/高の二遷移で全配置のL1費用を最小化する。","sourceRevisionIds":["source-abc307-g-problem-1a12f13209e3432c1289d0ccb8cb009ce4c0ffaeffa3f6e1b117a7eb37df511f","source-abc307-editorial-6660-a4e66cfdc5fb09ee57b8249e20af372e6a1ce6b3f60e1c1a3fc0c84b5e8de237"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

隣接transferはprefix sum S_i (1≤i<N)を±1する操作に一致するため、固定target Bへのminimum operationsはΣ_{i<N}|S_i−T_i|である。 total sumをNq+r (0≤r<N)とfloor divisionすると、valid Bはq+1をちょうどr positions、qを残りに置く列に限られる。 boundary iを跨ぐnet transport量はS_i−T_iで、そのabsolute value以上の操作が必要かつ実際にその量をedge iで移せるためcost式がtightである。 dp[i][j]=min(dp[i−1][j],dp[i−1][j−1])+|iq+j−S_i|で、jの範囲だけがtarget arrangement historyを要約する。

棄却する候補: C(N,r)通りのtarget arrangementsを列挙してprefix-distance costを比較する。

target候補数が指数的である。

採用する候補: dp[i][j]を先頭i positionsにq+1をj個置いたminimum prefix costとして、次をq/q+1の二択で遷移する。

target prefix T_i=iq+jだけでcostが決まり、O(Nr)≤O(N^2)で全配置を圧縮できる。

boundary iを跨ぐnet transport量はS_i−T_iで、そのabsolute value以上の操作が必要かつ実際にその量をedge iで移せるためcost式がtightである。

dp[i][j]=min(dp[i−1][j],dp[i−1][j−1])+|iq+j−S_i|で、jの範囲だけがtarget arrangement historyを要約する。

adjacent mass transfersをprefix imbalanceのL1 costへ変換し、balanced targetのhigh-value positionsをcount DPで最適配置する。

## 典型の発動条件

### 隣接移動とprefix imbalance

発動条件: 隣接要素間で単位量を移し、初期列から固定target列へのminimum movesを求めるとき。

各boundaryを通る必要net flowをprefix sums差として絶対値合計する。

### 個数制約付き二値列DP

発動条件: target entriesが二値で、一方を置く総個数だけが固定されているとき。

processed positionsとhigh-value countをstateにしてprefix-dependent costを加える。

## 問題固有の要素

A_iが負でもq=floor(sum/N)、r=sum−Nqを0≤r<Nと定義すればq/q+1構造が崩れない。

別の問題へ持ち帰る視点: negative totalのquotient/remainderはlanguage truncationではなくmathematical floor divisionへ正規化する。

## 正当性

均等化後の各値はqまたはq+1で高値がr個。辺iを跨ぐ移送量は元prefixと目標prefixの差で費用は絶対値。iまでの高値個数jだけで目標prefix iq+jが定まり、低/高の二遷移で全配置のL1費用を最小化する。

## 実装上の注意

- DP infinityとprefix sums/costには64 bitを使い、j≤min(i,r)かつr−j≤N−iとなるreachable statesだけ処理する。
- i=Nのcost termはtotal sumsが等しく0だが、含めても同じ答えになるようindex規約を統一する。

## 復習の核

- 隣接transfer問題は各boundaryを横切るnet amountをprefix sums差で表す。
- 総和保存と均等化条件からtarget valuesと各個数を先に一意化する。

## 計算量と制約

### 時間

N、総和S、平均q=floor(S/N)、r=S−Nq。DP O(N(r+1))⊆O(N²)。

### 空間

rolling high値個数 O(r+1)、prefix和O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5000; \lvert A_i \rvert \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/tasks/abc307_g) — source-abc307-g-problem-1a12f13209e3432c1289d0ccb8cb009ce4c0ffaeffa3f6e1b117a7eb37df511f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/editorial/6660) — source-abc307-editorial-6660-a4e66cfdc5fb09ee57b8249e20af372e6a1ce6b3f60e1c1a3fc0c84b5e8de237
