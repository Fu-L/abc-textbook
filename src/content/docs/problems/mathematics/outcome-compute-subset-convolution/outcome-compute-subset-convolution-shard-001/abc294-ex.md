---
title: "ABC294-EX — K-Coloring"
draft: true
authoringUnit: {"problemId":"abc294-ex","docPath":"src/content/docs/problems/mathematics/outcome-compute-subset-convolution/outcome-compute-subset-convolution-shard-001/abc294-ex.md","learningOutcomeIds":["outcome-compute-subset-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-deletion-contraction","unit-subset-transforms"],"excludedTopics":["subset convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-convolution","tag-deletion-contraction"],"sourceRevisionIds":["source-abc294-editorial-5999-b882666d9441fb8009a2dee7f54d8c44d8f95e980d538ff9a700d23c9da2a6e0","source-abc294-ex-problem-4feda50eb7e9fd0479a4ac69c9ef45ba9cc9d354325370e13bfff87fde54d521"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"低次数の式は隣接点の色を固定したvの合法色数から導かれ、空graphを基底に再帰は彩色数を保存する。縮約で生じるloopは同色と異色を同時に要求するのでその枝は0、並行辺は同じ異色条件の重複なので一本へまとめてよい。\n\n各SのA_S^Kは、K個の独立集合T_1,…,T_K⊆Sに対してΠg(T_i)を、Σ|T_i|の次数へ足す。A_SB'=K A_S'Bとb_0=1から導いた係数再帰は、各jが可逆なのでこのK乗の低次係数を一意に求める。rankごとのMöbius反転はunionがS未満の寄与を除き、unionが正確にSの組だけを残す。その上でΣ|T_i|=|S|なら、各頂点は少なくとも一回かつ合計で|S|回現れるため、全頂点がちょうど一回現れる。従って互いに素な色クラス分割であり、ラベル付きK色の適正彩色と全単射になる。","sourceRevisionIds":["source-abc294-editorial-5999-b882666d9441fb8009a2dee7f54d8c44d8f95e980d538ff9a700d23c9da2a6e0","source-abc294-ex-problem-4feda50eb7e9fd0479a4ac69c9ef45ba9cc9d354325370e13bfff87fde54d521"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [subset convolution](src/content/docs/learn/combinatorics-algebra/subset-convolution.md)

- 互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [削除・縮約recurrence](src/content/docs/learn/combinatorics-algebra/deletion-contraction.md) — 辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [subset zeta・Möbius変換](src/content/docs/learn/combinatorics-algebra/subset-transforms.md) — 集合上の包除原理・部分集合・bitmask状態DPで得た考え方と実装を再利用し、subset zeta・Möbius変換の発動条件・正当化・境界を重複なく学ぶ。

## 考察

N,M≤30だがK≤10^9なので、頂点ごとのK色全探索はできない。辺への包除は2^M個あり、まず低次数頂点を消して指数部分を小さくする。彩色数をF(G)とすると、孤立点vではF(G)=K F(G−v)、次数1のvではF(G)=(K−1)F(G−v)。次数2で隣接点a,bを持つvでは、H=G−vとして

```text
F(G) = (K−2)F(H) + F(H/(a=b))
```

となる。a,bが異色ならvの色はK−2通り、同色ならK−1通りだから、Hの全彩色へK−2を掛けた後、同色の彩色を一回補う。a,bに辺がある場合は縮約でloopができ、この補正枝は0。並行辺は一本へまとめる。空graphの彩色数は1を基底とする。

次数0,1,2をなくすと、残るcoreの頂点数n、辺数mは3n≤2mを満たす。m≤30なのでn≤20となり、ここで頂点subsetを使える。独立集合Tならg(T)=1、そうでなければ0とし、空集合にもg(∅)=1を置く。K個のラベル付き色クラスへ頂点を互いに素に割り振る数は、subset convolutionのK乗g^{*K}(V)である。空クラスは未使用色に対応する。

単純な二分累乗ではO(n²2^n log K)になる。log Kを消すには、ranked zeta領域で各集合Sの普通の多項式を一度だけK乗する。rank rの初期配列は|T|=rのときg(T)、他は0とし、各rankへsubset zeta変換を行う。得られた係数a_r=Σ_{T⊆S,|T|=r}g(T)から

```text
A_S(x) = Σ_{r=0}^n a_r x^r,  a_0=1
B_S(x) = A_S(x)^K mod x^(n+1) = Σ_{j=0}^n b_j x^j
```

を計算する。微分したA_SB_S'=K A_S'B_Sのx^(j−1)係数を比較すると

```text
j b_j + Σ_{i=1}^j (j−i)a_i b_{j−i}
    = K Σ_{i=1}^j i a_i b_{j−i}
b_0 = 1
b_j = inv(j) Σ_{i=1}^j ((K+1)i−j)a_i b_{j−i}  (j=1,…,n)
```

を得る。右辺はb_0,…,b_{j−1}だけなので次数昇順に求められ、一集合あたりO(n²)。n≤20<998244353だからinv(1),…,inv(n)は存在する。Kは式の係数として法上で使うだけで、K回のループも二分累乗も不要である。

全Sで求めたb_j[S]に、rank jごとのsubset Möbius反転を施す。結果はunionがちょうどSで、選択したK集合のサイズ総和がjである組の重み和。j=|S|なら頂点の重複がなくなり、互いに素なK色クラス分割になる。全頂点Vでrank nの係数を読めばcoreの彩色数を得て、低次数再帰の係数と合わせられる。

例えば辺一本のcore候補ではA_{ {1,2} }=1+2x、singletonでは1+x。rank2の反転は4C(K,2)−2C(K,2)=K(K−1)となり、両端異色の数に一致する。K=1で辺を含む集合の答えが0になることも、この反転とrank抽出で説明できる。

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

低次数の式は隣接点の色を固定したvの合法色数から導かれ、空graphを基底に再帰は彩色数を保存する。縮約で生じるloopは同色と異色を同時に要求するのでその枝は0、並行辺は同じ異色条件の重複なので一本へまとめてよい。

各SのA_S^Kは、K個の独立集合T_1,…,T_K⊆Sに対してΠg(T_i)を、Σ|T_i|の次数へ足す。A_SB'=K A_S'Bとb_0=1から導いた係数再帰は、各jが可逆なのでこのK乗の低次係数を一意に求める。rankごとのMöbius反転はunionがS未満の寄与を除き、unionが正確にSの組だけを残す。その上でΣ|T_i|=|S|なら、各頂点は少なくとも一回かつ合計で|S|回現れるため、全頂点がちょうど一回現れる。従って互いに素な色クラス分割であり、ラベル付きK色の適正彩色と全単射になる。

## 実装上の注意

- 次数2の補正ではvを消したH上のa,bを縮約する。loop枝を0、並行辺を一辺とし、次数0,1の単一路と空graphの値1も処理する。
- g(∅)=1は空の色クラスに必要。各Sの多項式をn次まで求め、rank jをSのサイズだけで早期に打ち切らない。|S|<jの係数も他集合のMöbius反転で参照する。
- 冪の再帰はj昇順。jで割る逆元と((K+1)i−j)を法上で正規化する。二分累乗を使う実装には別途log Kが掛かる。

## 復習の核

- 巨大なKは、色クラスへの集合分割を変換領域の多項式冪へ移すと係数に吸収できる。
- log Kを外す根拠はA B'=K A' Bの係数比較であり、単に「直接K乗」と宣言しない。
- Möbius反転はunion、rank条件は重複を除く。この二段を区別する。

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
