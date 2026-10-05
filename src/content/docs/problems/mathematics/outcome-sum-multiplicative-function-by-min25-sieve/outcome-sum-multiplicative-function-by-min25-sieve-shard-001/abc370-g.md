---
title: "ABC370-G — Divisible by 3"
draft: true
authoringUnit: {"problemId":"abc370-g","docPath":"src/content/docs/problems/mathematics/outcome-sum-multiplicative-function-by-min25-sieve/outcome-sum-multiplicative-function-by-min25-sieve-shard-001/abc370-g.md","learningOutcomeIds":["outcome-sum-multiplicative-function-by-min25-sieve"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-integer-boundary-blocks","unit-prime-divisor"],"excludedTopics":["Min_25・Lucy DP型の総和篩の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min25-sieve","tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc370-editorial-10869-b805b19b481f5f6449220fab8a2c5502e7d0135bdecba7ae5c67b32de475acd1","source-abc370-g-problem-24d3314149c61d48b68d9a4609bdb987c7c7fd4e495ed430aa041d2f82f6562f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"gの指数配分とσの積の零判定から、g−hが求める重みになる。Lucy DPは、消去する整数をその最小素因数pで一度分類し、mod3のクラスを掛け算で移す。逆方向のTの遷移は最小素因数pの次数cを一意に取り出し、残りの因子がpより大きい素数だけを持つ場合を加える。純粋な素数冪は別項で一度足し、c=1の純粋なpは初期素数prefixに既に含まれる。したがって篩の逆順で全整数の重みを漏れなく復元する。商集合の閉性と降順更新により、圧縮・in-place処理でも同じ遷移になる。","sourceRevisionIds":["source-abc370-editorial-10869-b805b19b481f5f6449220fab8a2c5502e7d0135bdecba7ae5c67b32de475acd1","source-abc370-g-problem-24d3314149c61d48b68d9a4609bdb987c7c7fd4e495ed430aa041d2f82f6562f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Min_25・Lucy DP型の総和篩](src/content/docs/learn/number-theory/min25-sieve.md)

- 素数和を定数個のLucy DPで求められる乗法的関数について、floor(N/i)の商集合上で素数冪を逆順に追加する簡略版Min_25でprefix sumを求める。素数冪の評価がO(1)なら、O(N^(3/4)/log N)時間・O(√N)空間。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md) — floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

## 考察

積がnになる長さMの正整数列の個数は、各素因数の指数をM箇所へ配分してg(p^e)=C(e+M−1,e)を掛け合わせる乗法的関数になる。σも乗法的で、法3は体なので、σ(n)≡0とは少なくとも一つの素数冪でσ(p^e)≡0になること。h(p^e)を、その場合0、それ以外g(p^e)として乗法的に延長すれば答えはΣ_{n≤N}(g(n)−h(n))。

素数冪の判定はp≡0 mod3なら常にσ≡1、p≡1ならσ≡e+1、p≡2ならeが奇数のとき0、偶数なら1である。特にg(p)=M、h(p)=M（p=3またはp≡1）、h(p)=0（p≡2）。

上限をQ={⌊N/i⌋}に圧縮する。|Q|=O(√N)で、qをさらに整数で割った上限もQに属する。Lucy DPではr=1,2についてS_r(q)を「2..qの整数のうちmod3がrで、処理済み素数でまだ消されていない個数」とする。初期値はr=1なら⌊(q+2)/3⌋−1、r=2なら⌊(q+1)/3⌋。3の倍数は最初から除き、素数3だけを最後に別加算する。

p≠3の素数を昇順、qを降順に処理し、q≥p²で

S_r(q)←S_r(q)−S_t(⌊q/p⌋)+S_t(p−1)、t≡r p^(−1) mod3

と更新する。消す数はp×m、m≥pであり、pより小さい素数だけからなるmを除く補正がS_t(p−1)。最後にP_g(q)=M(S_1(q)+S_2(q)+[q≥3])、P_h(q)=M(S_1(q)+[q≥3])という素数重みprefixを得る。

次にf=g,hそれぞれで配列T(q)=P_f(q)を初期化する。素数p≤√Nを降順に、qを降順に、p^{c+1}≤qとなるc≥1について

T(q)←T(q)+f(p^c)(T(⌊q/p^c⌋)−P_f(p))+f(p^{c+1})

を加える。右辺のTは「pより小さい素数を除いた数」の和で、素数p以下を引くと残りの因子mの最小素因数がpより大きくなる。p^c mと純粋なp^{c+1}を追加する遷移である。qを降順にするため、右辺の小さい上限は同じpでまだ更新されていない。最後はΣf=1+T(N)、二関数の差では定数1が打ち消される。

## 典型の発動条件

### 条件indicatorの乗法的関数差分化

発動条件: 乗法的量の積が0となるprime-power factorを少なくとも一つ含む対象を数えるとき。

全重みgからbad factorを一つも含まない乗法的重みhを引く。

### Lucy DPとMin_25型乗法的prefix sum

発動条件: Nが巨大でprime-power値が容易に計算できる乗法的関数の総和。

floor quotient集合上でprime prefixを篩い、prime-powerを最小素因数順に追加する。

## 問題固有の要素

σ(n)%3=0というglobal条件が、mod3が体でσの積のどれかが0というlocal prime-power条件へ分解する。

別の問題へ持ち帰る視点: 乗法的関数の零判定では、法が素数なら積が零となるfactor条件を補集合化できる。

## 正当性

gの指数配分とσの積の零判定から、g−hが求める重みになる。Lucy DPは、消去する整数をその最小素因数pで一度分類し、mod3のクラスを掛け算で移す。逆方向のTの遷移は最小素因数pの次数cを一意に取り出し、残りの因子がpより大きい素数だけを持つ場合を加える。純粋な素数冪は別項で一度足し、c=1の純粋なpは初期素数prefixに既に含まれる。したがって篩の逆順で全整数の重みを漏れなく復元する。商集合の閉性と降順更新により、圧縮・in-place処理でも同じ遷移になる。

## 実装上の注意

- p=3を逆向きの乗法的DPでは処理する。Lucyの剰余クラスでは倍数3を初期除外し、素数3だけを別に残す。
- Lucyのpは昇順、復元のpは降順。両者のqは降順であり、誤って同じpの更新済み値を右辺に使わない。
- C(e+M−1,e)はe≤⌊log₂N⌋だけ必要。巨大Mまでの階乗表は作らず、小さいeについて積と逆元で前計算する。

## 復習の核

- prime powerごとにp mod3とeからσ(p^e)を手計算しhを検証する。汎用prefix-sum routineへg,hのprime-power callbackを渡し、両者の初期値差を比較する。

## 計算量と制約

### 時間

O(N^(3/4)/log N)の簡略Min_25篩とLucy DP。p≤N^(1/4)では各pでO(√N)上限、p>N^(1/4)ではq≥p²の上限がO(N/p²)個。素数密度を用いて両範囲を合計するとこの上界になる。c≥2の素数冪項はp^{c+1}≤qでさらに範囲が減る。素数列挙のO(√N log log N)も含める。

### 空間

O(√N)。商集合の配列、素数列、mod3クラスの二配列と二関数のDP。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{10}; 1 \leq M \leq 10^5; N and M are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc370/editorial/10869) — source-abc370-editorial-10869-b805b19b481f5f6449220fab8a2c5502e7d0135bdecba7ae5c67b32de475acd1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc370/tasks/abc370_g) — source-abc370-g-problem-24d3314149c61d48b68d9a4609bdb987c7c7fd4e495ed430aa041d2f82f6562f
