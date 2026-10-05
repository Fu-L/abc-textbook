---
title: "ABC272-EX — Flipping Coins 2"
draft: true
authoringUnit: {"problemId":"abc272-ex","docPath":"src/content/docs/problems/mathematics/outcome-evaluate-polynomial-at-many-points/outcome-evaluate-polynomial-at-many-points-shard-001/abc272-ex.md","learningOutcomeIds":["outcome-evaluate-polynomial-at-many-points","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-formal-power-series","unit-inclusion-exclusion","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["多項式の多点評価・補間の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-generating-functions","tag-polynomial-multipoint-evaluation","tag-combinatorial-coefficients","tag-convolution","tag-inclusion-exclusion","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc272-ex-problem-13a1b5608d7d4c4ef6a93585f42563a31743bd693135ae3e339b3dbcbf3657ba","source-abc272-editorial-4963-2fab3266c32ba5ad324a1e421e6f7965abecb00b9e8fbd6bf7be0ce24b25d477"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"回転の全単射で一枚の表向き確率を N 倍できる。選択条件 DP は閾値が単調減少する順に未使用の適格値を選び、未選択位置の (N−L)! 通りを掛けるので G を正確に数える。g=f e^x は微分遷移と同値で、初期係数 1/j! に積 h(j) を掛けたものを e^{−x} で戻せば元 DP が得られる。二項反転で復元した F(K) は正確な反転回数別の順列数であり、初期が表なので答えは N/N!·Σ_{K:偶数}F(K)。N=1,A=(0) は奇数反転だけなので0となる。","sourceRevisionIds":["source-abc272-ex-problem-13a1b5608d7d4c4ef6a93585f42563a31743bd693135ae3e339b3dbcbf3657ba","source-abc272-editorial-4963-2fab3266c32ba5ad324a1e421e6f7965abecb00b9e8fbd6bf7be0ce24b25d477"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [多項式の多点評価・補間](src/content/docs/learn/combinatorics-algebra/polynomial-multipoint-evaluation.md)

- 任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [FPS基本演算と多項式の多点評価を行う](src/content/docs/learn/combinatorics-algebra/formal-power-series.md) — 生成関数の係数解釈と高速畳み込みを再利用し、Newton法による逆数・log・expを次数制限付きで実装し、多点評価と補間へ進む。有理母関数の係数抽出と一般FPS合成は独立した節で学ぶ。
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md) — 単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md) — 係数積和を多項式積へ写し、NTT・FFTで畳み込みや反転した列との相互相関を高速に求める。
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md) — pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

コインはすべて表向きから始まる。操作で使う順列の全要素を円周上で同じだけずらすと、各コインの反転回数も同じだけ回転する。したがって表向き枚数の期待値は、一枚が表向きである確率の N 倍になる。

A を昇順に並べ、1-based の操作番号 i に対して B_i=N−1−A_i とする。注目するコイン N−1 が反転される条件は P_i≥B_i。この条件の成立数がちょうど K の順列数を F(K) とすれば、答えは N·(N!)^{-1}·Σ_{K:偶数}F(K) である。N=1,A=(0) では F(1)=1,F(0)=0 なので答えは0。初期が表なら偶数回の側を足す。

「ちょうど K 個」を直接数えるのは難しい。代わりに大きさ L の位置集合 S を選び、S 内の条件だけを強制した順列数を全 S について足して G(L) とする。K 条件を満たす順列は C(K,L) 回現れるので G(L)=Σ_{K≥L}C(K,L)F(K)。これは二項反転で戻せる。

まず O(N²) の DP を導く。dp[i][j] は先頭 i 位置のうち j 位置を選んで条件を強制し、選んだ位置にだけ異なる値を割り当てる方法数とする。dp[0][0]=1、範囲外は0。B は単調減少なので、既に割り当てた j−1 個の値は新しい条件でも使える値であり、選べる未使用値は N−B_i−(j−1) 個。よって

```text
dp[i][j] = dp[i−1][j] + (N−B_i−j+1)dp[i−1][j−1]
G(L) = dp[N]\[L](N−L)!
```

未選択位置には最後に残りの値を自由に割り当てる。dp の全状態を計算すると N=20万には間に合わない。

微分項を含む母関数 DP に変換するため、f_i(x)=Σ_{j=0}^i dp[i][i−j]x^j、C_i=N−B_i+1−i と置く。f_0=1 で、上の遷移は f_i=x(f_{i−1}+f'_{i−1})+C_i f_{i−1} になる。「関数＋微分」が現れたら (f e^x)' を試す。g_i=f_i e^x とすると g_i=xg'_{i−1}+C_i g_{i−1}、係数は g_{i,j}=(j+C_i)g_{i−1,j} と独立になる。

h(x)=∏_{i=1}^N(x+C_i) を積木で構築し、0,…,N で多点評価する。g_0=e^x だから g_{N,j}=h(j)/j! であり、h(j) をそのまま係数にしてはいけない。g_N e^{−x} の N 次までを求めれば f_N、そこから G(L)=(N−L)!·[x^{N−L}]f_N を得る。

最後の二項反転も畳み込みにする。a_i=(N−i)!G(N−i)、b_i=(N−i)!F(N−i) とすれば a_i=Σ_{j≤i}b_j/(i−j)!。a(x)e^{−x} の i 次係数が b_i なので F(N−i)=b_i/(N−i)!。復元した偶数 K の係数だけを合計して N/N! を掛ける。

## 典型の発動条件

### 多項式の多点評価

発動条件: 一つの高次polynomialを連続する多数の点で評価すればDP coefficientsを得られるとき。

subproduct treeでh(x)=∏(x+C_i)を作り、remainder treeでh(0),…,h(N)を求める。

### 指数母関数によるbinomial変換

発動条件: 二列がΣ C(K,L)F(K)型の包含count関係を持つとき。

factorial scaling後のgenerating functionsにe^xまたはe^{-x}を掛けてGとFを相互変換する。

## 問題固有の要素

coin N−1のflip回数Kが偶数ならface upなので、復元したFのeven coefficientsを合計しN/N!倍して期待値にする。

別の問題へ持ち帰る視点: 期待個数はindicatorの線形性と対称性で一対象の分布へ縮約し、最後に対象数を掛ける。

## 正当性

回転の全単射で一枚の表向き確率を N 倍できる。選択条件 DP は閾値が単調減少する順に未使用の適格値を選び、未選択位置の (N−L)! 通りを掛けるので G を正確に数える。g=f e^x は微分遷移と同値で、初期係数 1/j! に積 h(j) を掛けたものを e^{−x} で戻せば元 DP が得られる。二項反転で復元した F(K) は正確な反転回数別の順列数であり、初期が表なので答えは N/N!·Σ_{K:偶数}F(K)。N=1,A=(0) は奇数反転だけなので0となる。

## 実装上の注意

- 操作 i は1-based、コインのラベルは0-based とし、C_i=N−B_i+1−i をこの規約で作る。
- g_{N,j}=h(j)/j!、G(L)=(N−L)!·[x^{N−L}]f_N、F(N−i)=b_i/(N−i)! の各階乗を区別する。
- すべて法 998244353 で演算し、e^{±x} の係数 (±1)^j/j! と次数 N での打切りを使う。最後は偶数反転の側を足す。

## 復習の核

- 全要素が回転対称なら期待値の線形性で一要素のevent-count distributionへ落とす。
- derivativeを含むpolynomial DPはe^xを掛ける積の微分で係数ごとに独立化できないか試す。

## 計算量と制約

### 時間

O(N log²N)。一次因子積の多点評価と二回の二項反転を高速多項式演算で行う。

### 空間

O(N log N)の積木保持。

### 制約との対応

公式制約の確認範囲: Time limit: 10 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N\leq 2\times 10^5; 0\leq A_i \leq N-1; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/tasks/abc272_h) — source-abc272-ex-problem-13a1b5608d7d4c4ef6a93585f42563a31743bd693135ae3e339b3dbcbf3657ba
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/editorial/4963) — source-abc272-editorial-4963-2fab3266c32ba5ad324a1e421e6f7965abecb00b9e8fbd6bf7be0ce24b25d477
