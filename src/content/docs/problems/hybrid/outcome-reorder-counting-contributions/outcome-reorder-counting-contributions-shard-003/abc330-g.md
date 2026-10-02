---
title: "ABC330-G — Inversion Squared"
draft: true
authoringUnit: {"problemId":"abc330-g","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-003/abc330-g.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-prefix-aggregate"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-modular-arithmetic","tag-prefix-difference"],"sourceRevisionIds":["source-abc330-editorial-7743-75b295b2b27227610092fa695ea99440e8b479574687a9365b727193c93cb23e","source-abc330-g-problem-253e1f6725532d08590375dc5679214a715482cb9c47a9d4eb020640e1e340a8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未確定位置pへ未使用値の順位vを置いたときの確定値とのinversion数をw[p][v]=左の確定値>u_vの個数＋右の確定値<u_vの個数とすると、B=Σ_p w[p][π_p]になる。 Uの既知momentはE[U]=q(q-1)/4、Var(U)=q(q-1)(2q+5)/72で、E[U²]=Var+E[U]²である。 π_p=vで条件付けたUの期待値はC(q-1,2)/2+((p-1)(q-v)+(q-p)(v-1))/(q-1)となり、Σw[p][v]との積でE[UB]を二次loopだけで求められる。 公式のindicator積の型分けをmoment計算へ整理し、4 index全列挙を避けながら共有endpointの依存も条件付き期待値で扱える。","sourceRevisionIds":["source-abc330-editorial-7743-75b295b2b27227610092fa695ea99440e8b479574687a9365b727193c93cb23e","source-abc330-g-problem-253e1f6725532d08590375dc5679214a715482cb9c47a9d4eb020640e1e340a8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、全位置未確定で1,2,3の全順列。","procedure":["反転数は0,1,1,2,2,3。","二乗和は0+1+1+4+4+9。"],"executionTarget":null,"expectedResult":"総和19。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-modular-arithmetic","unit-prefix-aggregate"],"attainmentCondition":"未確定数q=1でも1/(q(q−1))を計算するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"二つの異なる未知位置pairがないのでその項を省く。分母0の逆元を呼んではならない。"},"answer":{"reasoningOrVerification":"二つの異なる未知位置pairがないのでその項を省く。分母0の逆元を呼んではならない。","procedure":["具体例の各状態・寄与を再計算する。","二つの異なる未知位置pairがないのでその項を省く。分母0の逆元を呼んではならない。"],"expectedResult":"二つの異なる未知位置pairがないのでその項を省く。分母0の逆元を呼んではならない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

inversion数I=Σ_{l<r}1[P_l>P_r]なので、I²はorderedなindex-pair2本のindicator積の和へ展開できる。

未確定位置数をq、未使用値を昇順u_1..u_qとすると、補完は未使用値の順位の一様ランダム順列πを未確定位置へ割り当てることと同じで、総和はq!倍の期待値になる。

Iは確定位置同士のinversion定数a、未確定位置同士のinversion U(π)、確定位置と未確定位置の寄与B(π)の和に分けられる。

採用する候補: I=a+U+Bへ分解し、一様ランダム順列上のU・Bの二次momentとcross momentをO(N^2)集計してq!倍する。

公式のindicator積の型分けをmoment計算へ整理し、4 index全列挙を避けながら共有endpointの依存も条件付き期待値で扱える。

棄却する候補: 全q!個の未使用値割当を列挙して各inversion数を数える。

qは最大3000でpermutation列挙不能である。

棄却する候補: 各inversion indicatorの確率だけを足して期待inversionを求め、その値を二乗する。

求めるのはE[I²]であり(E[I])²ではなく、indicator間の相関を含むcross termが必要である。

未確定位置pへ未使用値の順位vを置いたときの確定値とのinversion数をw[p][v]=左の確定値>u_vの個数＋右の確定値<u_vの個数とすると、B=Σ_p w[p][π_p]になる。

Uの既知momentはE[U]=q(q-1)/4、Var(U)=q(q-1)(2q+5)/72で、E[U²]=Var+E[U]²である。

π_p=vで条件付けたUの期待値はC(q-1,2)/2+((p-1)(q-v)+(q-p)(v-1))/(q-1)となり、Σw[p][v]との積でE[UB]を二次loopだけで求められる。

確定位置同士のinversion aと、各未確定位置p・未使用値の順位vのw[p][v]をposition/value prefix countで作る。S_p=Σ_vw[p][v]、value列方向のsumも集計し、E[B]=(ΣS_p)/q、E[B²]=Σw²/q＋((ΣS)^2−ΣS_p²−Σ_v((Σ_pw)^2−Σ_pw²))/(q(q-1))を求める。q≥2なら条件付きU式を全p,vへ掛けてE[UB]=(1/q)Σw[p][v]E[U|π_p=v]とする。E[I²]=a²+E[U²]+E[B²]+2a(E[U]+E[B])+2E[UB]をmod 998244353で組み、q!を掛ける。q=0,1は分母0の項を個別に省く。

## 典型の発動条件

### indicator積への展開

発動条件: count Iの二乗総和を求めたいとき。

I²をevent pairの同時成立数または二次momentへ変換する。

### 一様ランダム順列のmoment

発動条件: 未確定位置へ未使用値を一様bijectionで割り当てる全補完を集計するとき。

全和をq!倍の期待値として計算する。

### 条件付き期待値でcross term計算

発動条件: permutation inversion数と位置別assignment costの相関を求めるとき。

1位置のrankを固定した残りpermutationのexpected inversionを閉形式化する。

### without-replacementな二次和の集約

発動条件: Σ_p w_p(V_p)の二乗momentを一様bijectionで求めるとき。

row sum・column sum・二乗和から同値割当を除く。

## 問題固有の要素

type A/B/Cのpair case splitは、確定値由来の定数a、未確定部分のpermutation自身のinversion U、position-value cost matrix Bへまとめると、依存がU-B cross moment1つに集約される。

別の問題へ持ち帰る視点: 複雑なindicator pair分類は、ランダム補完上の既知統計量とassignment costへ分解してmoment公式に再編できる場合がある。

## 正当性

未確定位置pへ未使用値の順位vを置いたときの確定値とのinversion数をw[p][v]=左の確定値>u_vの個数＋右の確定値<u_vの個数とすると、B=Σ_p w[p][π_p]になる。 Uの既知momentはE[U]=q(q-1)/4、Var(U)=q(q-1)(2q+5)/72で、E[U²]=Var+E[U]²である。 π_p=vで条件付けたUの期待値はC(q-1,2)/2+((p-1)(q-v)+(q-p)(v-1))/(q-1)となり、Σw[p][v]との積でE[UB]を二次loopだけで求められる。 公式のindicator積の型分けをmoment計算へ整理し、4 index全列挙を避けながら共有endpointの依存も条件付き期待値で扱える。

## 実装上の注意

- q=0なら補完は1つでanswer=a²、q=1ではq(q-1)の逆元を使うoff-diagonal項とE[UB]を0として分岐する。
- wのrow/column sum式ではorderedなp≠r cross termを使い、B²の係数2を別に重ねない。
- 4,72,q,q-1のdivisionはmodular inverseで行い、最後にfactorial q!を掛けて期待値を全補完の総和へ戻す。

## 復習の核

- q=2の2補完を直接列挙し、E[UB]がw[1][2]+w[2][1]の半分になることと、E[B²]のwithout-replacement除外を確認する。

## 計算量と制約

### 時間

O(N²)、重みw[p][v]と二次moment・共分散を二重loopで集計。

### 空間

O(N²)、重み表。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 3000; A_i = -1 or 1\leq A_i \leq N.; Each integer from 1 to N is contained at most once in A.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、全位置未確定で1,2,3の全順列。

1. 反転数は0,1,1,2,2,3。
2. 二乗和は0+1+1+4+4+9。

期待される結果: 総和19。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

未確定数q=1でも1/(q(q−1))を計算するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

二つの異なる未知位置pairがないのでその項を省く。分母0の逆元を呼んではならない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc330/editorial/7743) — source-abc330-editorial-7743-75b295b2b27227610092fa695ea99440e8b479574687a9365b727193c93cb23e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc330/tasks/abc330_g) — source-abc330-g-problem-253e1f6725532d08590375dc5679214a715482cb9c47a9d4eb020640e1e340a8
