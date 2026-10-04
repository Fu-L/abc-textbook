---
title: "ABC459-E — Select from Subtrees"
draft: true
authoringUnit: {"problemId":"abc459-e","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-003/abc459-e.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc459-e-problem-2ce3291f70c35bf35627556054a7895416f364b01dc308ebe180bb1ed76f59a5","source-abc459-editorial-20979-e81283aaf0c48dc74a735d7a8400a7359b35f32fd57640a4263ccb09478c828f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"postorderでは各頂点iより先に選ぶ部分木内の頂点がちょうどT_i−D_i個の飴を使うため、iの選択肢数はS_i−T_i+D_iに固定される。そこからD_i個選ぶ二項係数は子孫の具体的な選び方に依存せず、全頂点の選択を一意に掛け合わせて数える。さらにD_i<Pなので分母D_i!は法の逆元を持ち、falling productとinvfact[D_i]で二項係数を計算できる。","sourceRevisionIds":["source-abc459-e-problem-2ce3291f70c35bf35627556054a7895416f364b01dc308ebe180bb1ed76f59a5","source-abc459-editorial-20979-e81283aaf0c48dc74a735d7a8400a7359b35f32fd57640a4263ccb09478c828f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

postorderに処理順を固定すると、頂点iの前に選ばれるのは部分木内の子孫だけで、その個数はT_i−D_iで固定される。部分木の飴総数をS_i、要求総数をT_iとすれば、iの番に残る候補はS_i−T_i+D_i個である。したがってiで選ぶ方法数はC(S_i−T_i+D_i,D_i)となり、各頂点の係数を掛ければよい。S_i<T_iの部分木があれば供給不足なので答えは0。

ただし上側n=S_i−T_i+D_iは大きくても2×10^14程度で、n!を前計算できない。D_iは総和でも10^6以下なので、n(n−1)…(n−D_i+1)にinvfact[D_i]を掛ける。

## 典型の発動条件

### 選択順固定による独立化

発動条件: subtree内resourceを祖先・子孫が選び、順序によらず最終条件だけが決まるとき。

postorderに固定して各頂点時点の既消費総数を確定する。

### subtree総和と二項係数

発動条件: 各頂点が残resourceから所定数を選ぶ方法数を数えるとき。

供給総和と需要総和の差から候補数を作る。

## 問題固有の要素

選択結果そのものが後続へ影響して見えても、必要数だけが影響するなら順序を固定して総数へ圧縮できる。

別の問題へ持ち帰る視点: tree上の組合せ積ではsubtree feasibilityと頂点ごとの自由選択数を分離する。

## 正当性

postorderでは各頂点iより先に選ぶ部分木内の頂点がちょうどT_i−D_i個の飴を使うため、iの選択肢数はS_i−T_i+D_iに固定される。そこからD_i個選ぶ二項係数は子孫の具体的な選び方に依存せず、全頂点の選択を一意に掛け合わせて数える。さらにD_i<Pなので分母D_i!は法の逆元を持ち、falling productとinvfact[D_i]で二項係数を計算できる。

## 実装上の注意

- S_i、T_i、上側nは64 bitで保持する。n!は前計算せず、n(n−1)…(n−D_i+1)·invfact[D_i]を計算する。
- ΣD_i≤10^6<PなのでD_i!は法で可逆。分子の積が法の倍数なら結果0のまま扱う。

## 復習の核

- postorderの頂点i直前に何個が必ず消費済みかを小木で追い、具体的subsetによらないことを確認する。

## 計算量と制約

### 時間

N 頂点、D=ΣD_i。逆階乗前計算と falling product なら O(N+D)。

### 空間

木、部分和で O(N)、逆階乗表で O(D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq P_i \leq N; 1 \leq C_i \leq 10^9; 1 \leq D_i; D_1 + D_2 + \cdots + D_N \leq 10^6; All input values are integers.; T is a rooted tree with vertex 1 as the root.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/tasks/abc459_e) — source-abc459-e-problem-2ce3291f70c35bf35627556054a7895416f364b01dc308ebe180bb1ed76f59a5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/editorial/20979) — source-abc459-editorial-20979-e81283aaf0c48dc74a735d7a8400a7359b35f32fd57640a4263ccb09478c828f
