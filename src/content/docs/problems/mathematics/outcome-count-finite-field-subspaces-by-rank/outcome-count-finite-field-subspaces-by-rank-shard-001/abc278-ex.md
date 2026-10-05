---
title: "ABC278-EX — make 1"
draft: true
authoringUnit: {"problemId":"abc278-ex","docPath":"src/content/docs/problems/mathematics/outcome-count-finite-field-subspaces-by-rank/outcome-count-finite-field-subspaces-by-rank-shard-001/abc278-ex.md","learningOutcomeIds":["outcome-count-finite-field-subspaces-by-rank"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-polynomial-convolution"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-finite-field-subspace-counting","tag-combinatorial-coefficients","tag-convolution","tag-stirling-transform"],"sourceRevisionIds":["source-abc278-editorial-5210-0f1a56156ff30245ba49db87069bf35c61ea37eecc6e019379bf06fedd2ac83b","source-abc278-ex-problem-49227ad1d2ec3968bf08a7cbc0c1fab87d217b52980f2097766caae5bfd774f7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"目標を含まない部分空間は、商空間 V/〈e〉 内の r 次元部分空間とその線形 lift の組に一意に対応し、個数は 2^r[B−1 choose r]_2。固定空間を張る s 列は座標行列の全行独立条件で ∏(2^s−2^j) 通り。両者の積が rank 別 G(s,r) で、q階乗による因子分離と畳み込みはその和を変形しただけである。等値位置の集合分割で結ぶ Stirling 反転は span 条件を保ち、distinct bad 数 F を復元する。good の吸収性から、長さ N−1 で既に good な列の全未使用値 extension を引けば初回 good だけが残る。","sourceRevisionIds":["source-abc278-editorial-5210-0f1a56156ff30245ba49db87069bf35c61ea37eecc6e019379bf06fedd2ac83b","source-abc278-ex-problem-49227ad1d2ec3968bf08a7cbc0c1fab87d217b52980f2097766caae5bfd774f7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 生成ベクトルのspan条件をrank別の部分空間数へ変換し、有限体上のGaussian binomial係数で各rankの寄与を数えられる。

先に読む単元:

- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md) — 係数積和を多項式積へ写し、NTT・FFTで畳み込みや反転した列との相互相関を高速に求める。

この解説で扱わないこと:

- 重なりを交互加減する包除・Möbius反転。

## 考察

整数を B 次元の F_2 ベクトルとみなす。選んだカードの部分集合 xor で1を作れることは、非零の目標 e=1 がその span に属することと同値である。一度 good になれば追加しても good のままなので、初めて長さ N で good となる列数は Good(N)−(2^B−N+1)Good(N−1)。後者の係数は残っている未使用カード数である。

distinct なカード列の bad 個数を F(s)、重複を許した列の bad 個数を G(s) とする。重複ありの列を「同じ値が現れる位置」の集合分割で分類すれば G(s)=Σ_{t≤s}{s brace t}F(t)。各 block を最初の出現順に並べると distinct 値列に一意に対応し、span も保つ。signed 第一種 Stirling 数 c(s,t) による反転 F(s)=Σ_t c(s,t)G(t) が使える。F(0)=G(0)=1。

G(s) を rank r ごとに数えよう。V=〈e〉⊕U、dim U=B−1 と分ける。e を含まない r 次元部分空間は、U 内の r 次元部分空間 T と、T→〈e〉 の線形写像のグラフに一意に対応する。T の選び方は Gaussian binomial [B−1 choose r]_2、線形写像は2^r通り。

固定した r 次元空間を張る s 個の順序付きベクトル列は、r×s 座標行列の全行が独立であるものの個数。行を一本ずつ選ぶと ∏_{j=0}^{r−1}(2^s−2^j) 通りになる。したがって

```text
G(s,r)=2^r [B−1 choose r]_2 ∏_{j=0}^{r−1}(2^s−2^j)
0≤r≤min(s,B−1),  G(s)=Σ_r G(s,r)
```

「部分空間を選ぶ」と「その空間を張る列を選ぶ」を分けることが、この典型の中心である。

q階乗を Q_n=∏_{j=1}^n(2^j−1)、Q_0=1 と置くと、積の式は

```text
G(s,r)=2^{r(r+1)/2} · (Q_{B−1}/Q_{B−1−r}) · Q_s/(Q_r Q_{s−r})
```

になる。B までの階乗を作らず、R_0=1、R_{r+1}=R_r(2^{B−1−r}−1) として比 R_r=Q_{B−1}/Q_{B−1−r} を min(N,B−1) まで計算する。NTT に渡す二列は

```text
u_r=2^{r(r+1)/2}R_r/Q_r  (r≤min(N,B−1))、それ以外は0
v_t=1/Q_t  (0≤t≤N)
w=convolution(u,v)
G(s)=Q_s w_s
```

である。r>B−1 では u_r=0 とし、負の添字の階乗を読まない。Q_n と逆数は N までだけ必要。法998244353で2の乗法位数は 499122176 なので、この問題の N≤20万、B≤10^7 に現れる正の指数の 2^j−1 は0にならない。

反転に必要なのは F(N) と F(N−1) の二つだけ。c(s,t) は積 C_s(x)=∏_{j=0}^{s−1}(x−j) の t 次係数なので、一次因子の product tree で C_N,C_{N−1} を作り、G(t) との内積を取る。Good(s)=(2^B)_{s}−F(s) とし、降順階乗 (2^B)_s=∏_{j=0}^{s−1}(2^B−j) は掛け算だけで求める。Good(0)=0 だから N=1 にも同じ最終式が使える。

## 典型の発動条件

### 線形span条件への翻訳

発動条件: subset xorで特定vectorを作れるかを数えるとき。

整数をF_2 vectorとみなし、targetがrow spanに属するかで分類する。

### q-binomial coefficient

発動条件: 有限体上のrank・部分空間の個数を数え、q^n-q^mの積が現れるとき。

q-factorialを前計算してdimension別部分空間数とrank行列数を評価する。

### Stirling変換

発動条件: with-replacement列とdistinct要素列を、等値位置のpartition数を介して変換するとき。

second-kindで集約し、signed first-kindで反転する。

## 問題固有の要素

『初めてgood』はgood N列からgood prefixの自由extensionを引け、bad列のdistinct制約はreplacement列とのStirling変換で外せる。

別の問題へ持ち帰る視点: 停止時刻付き列数え上げでは、吸収性を使ったprefix差と、distinct/repetitionのpartition変換を別々に検討する。

## 正当性

目標を含まない部分空間は、商空間 V/〈e〉 内の r 次元部分空間とその線形 lift の組に一意に対応し、個数は 2^r[B−1 choose r]_2。固定空間を張る s 列は座標行列の全行独立条件で ∏(2^s−2^j) 通り。両者の積が rank 別 G(s,r) で、q階乗による因子分離と畳み込みはその和を変形しただけである。等値位置の集合分割で結ぶ Stirling 反転は span 条件を保ち、distinct bad 数 F を復元する。good の吸収性から、長さ N−1 で既に good な列の全未使用値 extension を引けば初回 good だけが残る。

## 実装上の注意

- rank r=0 の積は1、F(0)=G(0)=1、Good(0)=0。N=1 と B=1 もこの境界で扱える。
- Q_s と 1/Q_s は N まで、B 側の比 R_r は積で直接作る。u_r は r>B−1 なら0。
- signed 第一種 Stirling 係数は ∏(x−j) から得る。第二種の係数や無符号の第一種と混同しない。
- 降順階乗は逆元を使わず積で求め、Good(N)−(2^B−N+1)Good(N−1) を非負剰余へ正規化する。

## 復習の核

- B=2,N=2でbad spanがunit vector1を含まない列を手で分類し、distinct版Fとreplacement版Gの違いを確認する。

## 計算量と制約

### 時間

O(N log²N+log B)。G 全係数の q階乗畳み込みは O(N log N)、二本の Stirling 係数列を一次因子積木で作る費用は O(N log²N)。2^B の高速冪を O(log B) で求め、R_r を O(min(N,B)) で逐次計算する。

### 空間

O(N)。q係数列と畳み込み領域、および子の積を解放する深さ優先の product tree。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq B \leq 10^7; N \leq 2^B; N and B are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/editorial/5210) — source-abc278-editorial-5210-0f1a56156ff30245ba49db87069bf35c61ea37eecc6e019379bf06fedd2ac83b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/tasks/abc278_h) — source-abc278-ex-problem-49227ad1d2ec3968bf08a7cbc0c1fab87d217b52980f2097766caae5bfd774f7
