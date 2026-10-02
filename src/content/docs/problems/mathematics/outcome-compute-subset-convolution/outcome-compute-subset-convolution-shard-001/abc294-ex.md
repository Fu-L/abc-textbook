---
title: "ABC294-EX — K-Coloring"
draft: true
authoringUnit: {"problemId":"abc294-ex","docPath":"src/content/docs/problems/mathematics/outcome-compute-subset-convolution/outcome-compute-subset-convolution-shard-001/abc294-ex.md","learningOutcomeIds":["outcome-compute-subset-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-deletion-contraction","unit-subset-transforms"],"excludedTopics":["subset convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-convolution","tag-deletion-contraction"],"sourceRevisionIds":["source-abc294-editorial-5999-b882666d9441fb8009a2dee7f54d8c44d8f95e980d538ff9a700d23c9da2a6e0","source-abc294-ex-problem-4feda50eb7e9fd0479a4ac69c9ef45ba9cc9d354325370e13bfff87fde54d521"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"辺eの両端が異色の彩色は、eを消した全彩色から両端同色の彩色を引く。後者は縮約graphの彩色と全単射なので削除縮約式が成立する。低次数頂点の消去も隣接色関係に分けて同じ数を保存する。coreでは独立な色classの互いに素な分割をsubset convolutionで数えるので、各頂点にK色を割り当てた適正彩色全てに対応する。","sourceRevisionIds":["source-abc294-editorial-5999-b882666d9441fb8009a2dee7f54d8c44d8f95e980d538ff9a700d23c9da2a6e0","source-abc294-ex-problem-4feda50eb7e9fd0479a4ac69c9ef45ba9cc9d354325370e13bfff87fde54d521"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [subset convolution](src/content/docs/learn/combinatorics-algebra/subset-convolution.md)

- 互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [削除・縮約recurrence](src/content/docs/learn/combinatorics-algebra/deletion-contraction.md)
- [subset zeta・Möbius変換](src/content/docs/learn/combinatorics-algebra/subset-transforms.md)

対象外:

- subset convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

辺数M≤30が小さい一方Nも30で、低次数頂点を削除・縮約すると指数探索の規模をさらに抑えられる。

採用する候補: 低次数頂点の削除縮約再帰とsubset convolution

次数0,1,2を閉形式で除去し、残る頂点数を2M/3以下にして独立集合関数のK乗を部分集合畳み込みで数えられる。

棄却する候補: K^N彩色を列挙

Kは10^9で不可能。

棄却する候補: 辺包除を全2^M列挙

2^30に各状態処理を掛けると8秒では重い。

彩色多項式の削除縮約F(G)=F(G-e)-F(G/e)と、独立集合への色クラス分割という二表現を疎グラフの次数に応じて使い分ける。

次数0,1,2頂点を係数付き再帰で消し、最小次数3以上になった小頂点グラフでは独立集合指示関数のsubset-convolution K乗を全頂点集合で評価する。

## 典型の発動条件

### 削除縮約

発動条件: グラフ彩色数を辺削除と端点縮約へ分解する。

低次数頂点で同型枝をまとめ分岐数を減らす。

### subset convolution

発動条件: 頂点集合を独立な色クラスへ分割する。

独立集合関数のK乗をranked zeta変換で求める。

## 問題固有の要素

Mが小さい制約では、最小次数3以上なら頂点数≤2M/3という握手補題が指数部を縮める。

別の問題へ持ち帰る視点: 疎グラフ指数算法は低次数簡約と残核の頂点数上界を組み合わせる。

## 正当性

辺eの両端が異色の彩色は、eを消した全彩色から両端同色の彩色を引く。後者は縮約graphの彩色と全単射なので削除縮約式が成立する。低次数頂点の消去も隣接色関係に分けて同じ数を保存する。coreでは独立な色classの互いに素な分割をsubset convolutionで数えるので、各頂点にK色を割り当てた適正彩色全てに対応する。

## 実装上の注意

- 次数2頂点vの隣接点a,bが異なるとき、F(G)=(K−2)F(G−v)+F((G−v)/(a=b))。a=bへの縮約でloopができた枝は0とする。並行辺は一辺へまとめる。
- 小さいcoreでは空集合も独立集合としてg(∅)=1とし、gのsubset convolution K乗を全頂点集合で評価する。色はラベル付きなので、空の色クラスも含める。
- 二分累乗をそのまま行うならO(log K)が別途掛かる。上記の計算量はranked zeta領域で各点の次数n打切り多項式を直接K乗し、g(∅)=1を使う係数再帰O(n²)を用いた場合である。

## 復習の核

- 小Nで全彩色と比較し、孤立点・木・三角形・縮約で多重辺が生じる例を確認する。

## 計算量と制約

### 時間

O(N+M²2^(2M/3))。次数0/1を単一路で除去し、次数2の各分岐で辺数を少なくとも2減らす。深さdの分岐は高々2^d個、残り辺数m≤M−2d。最小次数≥3の葉は頂点数n≤2m/3なのでranked subset convolutionの冪にO(n²2^n)。各深さの総費用はO(M²2^(2M/3)2^(−d/3))となり、その和は幾何級数で同じ上界。M≤30ではn≤20。

### 空間

O(N+M2^(2M/3))。再帰葉を順に処理し、ranked subset convolutionの表を葉同士で再利用する。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 30; 0 \leq M \leq \min \left(30, \frac{N(N-1)}{2} \right); 1 \leq K \leq 10^9; 1 \leq u_i \lt v_i \leq N; The given graph is simple.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc294/editorial/5999) — source-abc294-editorial-5999-b882666d9441fb8009a2dee7f54d8c44d8f95e980d538ff9a700d23c9da2a6e0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc294/tasks/abc294_h) — source-abc294-ex-problem-4feda50eb7e9fd0479a4ac69c9ef45ba9cc9d354325370e13bfff87fde54d521
