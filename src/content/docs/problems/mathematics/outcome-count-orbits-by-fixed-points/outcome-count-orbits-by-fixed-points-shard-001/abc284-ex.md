---
title: "ABC284-EX — Count Unlabeled Graphs"
draft: true
authoringUnit: {"problemId":"abc284-ex","docPath":"src/content/docs/problems/mathematics/outcome-count-orbits-by-fixed-points/outcome-count-orbits-by-fixed-points-shard-001/abc284-ex.md","learningOutcomeIds":["outcome-count-orbits-by-fixed-points"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-inclusion-exclusion","unit-modular-arithmetic","unit-normalization"],"excludedTopics":["群作用・軌道数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-group-action-orbit-counting","tag-combinatorial-coefficients","tag-inclusion-exclusion","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc284-editorial-5481-9da01d2a70042d0bd7a43951bbdc27a4e2a956c0b0fe0efa9a7e4d96bfa4a14d","source-abc284-ex-problem-62d52e6971d664c1fb7b8660b662c70437b217e7e263ea460b197a5a07453028"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Burnsideでは各置換が固定する彩色graphを平均する。頂点色は各巡回で一定なのでc^m通り、辺は同巡回内floor(d/2)と異巡回間gcd(d_i,d_j)のorbit単位に採否を選ぶので2^E通り。cycle typeの置換数で重み付けしN!で割るとunlabeled数になる。最後の色集合包除で指定K色全てを実際に用いたものだけ残す。","sourceRevisionIds":["source-abc284-editorial-5481-9da01d2a70042d0bd7a43951bbdc27a4e2a956c0b0fe0efa9a7e4d96bfa4a14d","source-abc284-ex-problem-62d52e6971d664c1fb7b8660b662c70437b217e7e263ea460b197a5a07453028"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [群作用・軌道数え上げ](src/content/docs/learn/combinatorics-algebra/orbit-counting.md)

- 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 群作用・軌道数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

頂点置換で同一視するunlabeled graphは、各graphを一律N!で割れないため、置換群S_Nの作用に対するBurnsideの補題で固定点を平均する。

置換のcycleごとに頂点色は一定でなければならず、edge集合もunordered pair上の置換orbitごとに採用・不採用が一定になる。

最初にc色を使用可能とする固定点数F(c)を数え、全K色を実際に使う条件は色集合の包含排除で課せる。

採用する候補: S_Nの置換をcycle typeでまとめ、固定される頂点彩色数とedge subset数をBurnsideで加算してから、使用色について包含排除する。

N≤30ではinteger partitionだけを列挙すればよく、自己同型によるorbit sizeの差も正確に扱える。

棄却する候補: label付きの彩色graph数を数えてN!で割る。

graphごとに自己同型群の大きさが異なり、labelingの個数が一律N!ではない。

棄却する候補: N!個の頂点置換を1つずつ列挙して固定点を数える。

同じcycle typeの置換は固定点数が等しいのに、N!列挙はN≤30で不可能である。

cycle長列d_1..d_mに対し、固定されるc色彩色は各cycleの色を選ぶc^m通りである。

edge orbit数は、同一cycle d_i内がfloor(d_i/2)、異なる2cycle d_i,d_j間がgcd(d_i,d_j)なので、その総和Eに対してedge集合は2^E通りである。

長さdのcycleがm_d個あるcycle typeの置換数はN!/(∏d^{m_d}m_d!)である。

Nの各integer partitionをcycle長列として列挙する。cycle数m、edge orbit数E、type内の置換数を求め、各c=0..KのF(c)へtypeCount·c^m·2^Eを加える。全typeの和へ(N!)^{-1}を掛けてBurnside平均を取り、答えをΣ_c(-1)^(K-c) C(K,c)F(c)で求める。P>Nの素数なので必要なfactorial inverseが存在する。

## 典型の発動条件

### Burnsideの補題

発動条件: labelの置換で同一視した構造を数え、自己同型の大きさが対象ごとに異なるとき。

各頂点置換が固定する彩色graph数を平均する。

### cycle typeによる群要素圧縮

発動条件: 置換の固定点数がcycle構造だけで決まるとき。

N!個の置換をinteger partitionごとの重み付き和へ置き換える。

### 包含排除

発動条件: K種類すべてを少なくとも1回使うsurjectiveな割当を数えるとき。

使用可能色をc色に制限したF(c)から欠けた色を除く。

## 問題固有の要素

undirected edgeはunordered pairなので、1本のcycle内の距離rとd-rが同じorbitになりfloor(d/2)個、異なるcycle間では位相差がgcd個残る。

別の問題へ持ち帰る視点: 置換で不変な部分集合を数えるときは、基礎要素上に誘導された作用のorbit数を求め、各orbitを丸ごと選ぶ2択へ変える。

## 正当性

Burnsideでは各置換が固定する彩色graphを平均する。頂点色は各巡回で一定なのでc^m通り、辺は同巡回内floor(d/2)と異巡回間gcd(d_i,d_j)のorbit単位に採否を選ぶので2^E通り。cycle typeの置換数で重み付けしN!で割るとunlabeled数になる。最後の色集合包除で指定K色全てを実際に用いたものだけ残す。

## 実装上の注意

- cycle typeの個数はmultiplicityごとにd^{m_d}m_d!で割り、同じpartitionを重複生成しない。
- 同一cycle内のedge orbit数にloopは含めずfloor(d/2)とし、異なるcycle対は各unordered pairを一度だけ加える。
- 包含排除の負値は都度Pを足して正規化する。

## 復習の核

- N=3のcycle type 1+1+1、2+1、3で、3-cycle内の3辺が1orbitになることと各typeの置換数の総和が3!になることを照合する。

## 計算量と制約

### 時間

O(Π(N)(N²+K log N))を上界とする。Π(N)は整数分割数。

### 空間

O(N+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq N \leq 30; 10^8 \leq P \leq 10^9; P is a prime.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/editorial/5481) — source-abc284-editorial-5481-9da01d2a70042d0bd7a43951bbdc27a4e2a956c0b0fe0efa9a7e4d96bfa4a14d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/tasks/abc284_h) — source-abc284-ex-problem-62d52e6971d664c1fb7b8660b662c70437b217e7e263ea460b197a5a07453028
