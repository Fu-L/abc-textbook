---
title: "ABC463-G — Random Walk Distance"
draft: true
authoringUnit: {"problemId":"abc463-g","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-003/abc463-g.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-mo-offline-range","unit-modular-arithmetic"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-mo-offline-range","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc463-editorial-21928-7cb7a2903038e719ee66fd28ee67e398c989ec8e7b146012e0b46809e6fae2ea","source-abc463-g-problem-f75d039216a6beaa35699c1575f005d1b00bca4a677f7fbc81a351e9b32dbf46"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"終点2i−Nのbinomial確率で、閾値より下の距離だけ符号を反転すると−X+2((N+X)f−2g)/2^Nになる。f,gはbinomialの部分和とindex重み部分和。Pascal則の四方向更新は同じ部分和を境界項で増減する恒等式なので、Moで移動しても値を正確に保つ。|X|≥Nでは符号固定のため平均終点0から|X|に即決できる。","sourceRevisionIds":["source-abc463-editorial-21928-7cb7a2903038e719ee66fd28ee67e398c989ec8e7b146012e0b46809e6fae2ea","source-abc463-g-problem-f75d039216a6beaa35699c1575f005d1b00bca4a677f7fbc81a351e9b32dbf46"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [Moの順序で区間問い合わせの差分を更新する](src/content/docs/learn/query/mo-offline-range.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

N歩の位置x'=2i-Nはbinomial分布で、求める値はE|x'-X|である。|X|≥Nなら符号が固定され期待値は|X|に即決する。

採用する候補: 内部caseでは閾値 M=ceil((N+X)/2) 以下のbinomial prefix和 f(N,M)=ΣC(N,i) と一次moment g(N,M)=ΣiC(N,i) を使う式へ変形し、全queryを(N,M)平面のMo順で更新する。

NまたはMを1変えるf,gの更新式がPascal恒等式からO(1)で得られ、Mo順なら全query間の座標移動量を平方根分割で抑えられる。

棄却する候補: 各queryでi=0..Nの全位置確率を列挙し、絶対距離を総和する。

一query O(N) となり、多数queryで総Nが大きい制約を超える。

x'<X側だけ絶対値の符号を反転することで、答えは-X+2Σ_{i<M}(N+X-2i)C(N,i)/2^Nになる。

f(N+1,M)=2f(N,M)-C(N,M-1)、gにもfと境界binomだけを使う類似更新があり、逆方向更新も代数的に解ける。

階乗・逆階乗・2冪を最大Nまで用意し、内部queryを(N,M)に変換してMo block順にsortする。current N,M,f,gを四方向のO(1)式で移動し、-X+2((N+X)f-2g)/2^Nを各queryへ保存する。

## 典型の発動条件

### binomial prefix moment

発動条件: 二項分布のthreshold付き絶対値期待値を多数求めたいとき。

確率prefixの0次和と1次momentへ展開する。

### parameter平面上のMo法

発動条件: 二parameter関数が各座標±1でO(1)更新でき、多数点queryがあるとき。

query点をblock順に巡回して総移動量を抑える。

## 問題固有の要素

絶対値期待値はthresholdの片側prefix probabilityとprefix first momentだけで表せる。

別の問題へ持ち帰る視点: Mo法はarray区間だけでなく、局所更新式を持つ二次元parameter query全般に適用できる。

## 正当性

終点2i−Nのbinomial確率で、閾値より下の距離だけ符号を反転すると−X+2((N+X)f−2g)/2^Nになる。f,gはbinomialの部分和とindex重み部分和。Pascal則の四方向更新は同じ部分和を境界項で増減する恒等式なので、Moで移動しても値を正確に保つ。|X|≥Nでは符号固定のため平均終点0から|X|に即決できる。

## 実装上の注意

- Mのceilとstrict x'<Xの境界をparity込みで計算し、N±1更新式の適用順を誤らない。|X|≥Nの即決caseを先に除く。

## 復習の核

- 絶対値を片側indicatorで分解し、f/gのM方向・N方向更新式をPascal恒等式から両向きに導く。

## 計算量と制約

### 時間

O(Nmax√T+T log T+Nmax)をMo block幅Nmax/√Tの上界とする。各座標更新は定数時間。

### 空間

O(Nmax+T)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 2 \times 10^5; 1 \leq N \leq 2 \times 10^5; |X| \leq 2 \times 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc463/editorial/21928) — source-abc463-editorial-21928-7cb7a2903038e719ee66fd28ee67e398c989ec8e7b146012e0b46809e6fae2ea
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc463/tasks/abc463_g) — source-abc463-g-problem-f75d039216a6beaa35699c1575f005d1b00bca4a677f7fbc81a351e9b32dbf46
