---
title: "ABC252-G — Pre-Order"
draft: true
authoringUnit: {"problemId":"abc252-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc252-g.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp"],"sourceRevisionIds":["source-abc252-editorial-3999-5b2717dd1df94942cb59daa50c900cd1837cc938ecd38742b5a848ceacf25e6b","source-abc252-g-problem-228c5b0b2f3d0d7de2e819e38eedfdb28c3778d3434903e386bc3b0ec241e3ad"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"非空の森で仮想根の最初の子は必ず P_l である。他の子がない場合と、次の子が P_k の場合は排他的で、後者の k は先行順から一意に決まる。P_l の子孫と残りの森はそれぞれ連続区間で独立に選べ、P_l<P_k が子の昇順条件になる。各完成木はこの分解を一通りだけ持つため漸化式は全てを一度ずつ数える。空の森の初期値1から区間長の帰納で正しく、元の根1を除いた [1,N) の森が答えと全単射になる。","sourceRevisionIds":["source-abc252-editorial-3999-5b2717dd1df94942cb59daa50c900cd1837cc938ecd38742b5a848ceacf25e6b","source-abc252-g-problem-228c5b0b2f3d0d7de2e819e38eedfdb28c3778d3434903e386bc3b0ec241e3ad"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

深さ優先探索の先行順では、一つの部分木が連続区間になる。列 P の区間 [l,r) に仮想根0を付け、その子部分木の根を頂点番号順に訪れる森の個数を F(l,r) とする。「森・部分木」のどちらを数えるのかを曖昧にせず、仮想根に付いた森を一貫して数える。

F(l,l)=1。非空区間の最初の頂点 P_l は、仮想根の最初の子である。仮想根に他の子がなければ、P_l の子に付く森が [l+1,r) なので F(l+1,r) 通り。他の子があるなら次の子の先行順位置 k は一意であり、P_l の子孫が [l+1,k)、残りの仮想根の子が [k,r) を占める。子の番号順から P_l<P_k が必要である。

```text
F(l,r) = F(l+1,r)
       + Σ_{l+1≤k<r, P_l<P_k} F(l+1,k)F(k,r)
```

区間長が短いものから埋める。0-based で P_0=1 は元の根であり、求める木と仮想根を1に置き換えた森は一対一なので答えは F(1,N)。全演算は法998244353。各区間から切る位置 k を O(N) 個試すため O(N³)、状態数 O(N²)。

棄却する親の全列挙は指数個の候補を持つ。持ち帰る典型は、DFS順の連続性を使って部分木を区間へ変換し、兄弟間の大小条件を分割位置の条件にすることである。

## 典型の発動条件

### 先行順の区間性

発動条件: 木の巡回列から部分木の境界を復元・数え上げたい。

各部分木を先行順上の連続区間として区間DPの状態にする。

### 区間分割DP

発動条件: 列の先頭を含む構造と残りが境界位置で独立になる。

子部分木の終端を列挙し、部分問題の積を加算する。

## 問題固有の要素

子を番号昇順で訪れる規則は、巡回列そのものの単調性ではなく、連続する子部分木の根同士の条件として区間分割時に検査する。

別の問題へ持ち帰る視点: 巡回順制約付き木の数え上げでは、部分木の連続性と兄弟順の局所条件を組み合わせて区間DPへ落とす。

## 正当性

非空の森で仮想根の最初の子は必ず P_l である。他の子がない場合と、次の子が P_k の場合は排他的で、後者の k は先行順から一意に決まる。P_l の子孫と残りの森はそれぞれ連続区間で独立に選べ、P_l<P_k が子の昇順条件になる。各完成木はこの分解を一通りだけ持つため漸化式は全てを一度ずつ数える。空の森の初期値1から区間長の帰納で正しく、元の根1を除いた [1,N) の森が答えと全単射になる。

## 実装上の注意

- F は仮想根付きの森の個数。半開区間、空区間 F(l,l)=1、元の根を除いた答え F(1,N) を統一する。
- k=r は「次の子がない」項 F(l+1,r) と分ける。兄弟の条件は P_l<P_k であり、親子の大小条件ではない。

## 復習の核

- N≤8で全親配列を列挙した答えと比較し、単調な順列、根直下に複数子がある木、深い一本鎖、分割端が空になる場合を確認する。

## 計算量と制約

### 時間

O(N³)、区間数N²×最初の子の終端N。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 500; 1 \leq P_i\leq N; P_1=1; All P_i are distinct.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc252/editorial/3999) — source-abc252-editorial-3999-5b2717dd1df94942cb59daa50c900cd1837cc938ecd38742b5a848ceacf25e6b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc252/tasks/abc252_g) — source-abc252-g-problem-228c5b0b2f3d0d7de2e819e38eedfdb28c3778d3434903e386bc3b0ec241e3ad
