---
title: "ABC260-EX — Colorfulness"
draft: true
authoringUnit: {"problemId":"abc260-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc260-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-inclusion-exclusion","unit-modular-arithmetic","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-formal-power-series","tag-generating-functions","tag-combinatorial-coefficients","tag-convolution","tag-inclusion-exclusion","tag-modular-arithmetic","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc260-ex-problem-d07c2253eb6027bf7537a67461899f6ac61aac2cd22b86e9deb1c82ea83807fd","source-abc260-editorial-4434-864dffceff26d14b00bdc9dbe05af08146c10a71c91bc9ab5b65db1d57ee1a40"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同色境界を指定した数q_nはexact分布p_dの二項変換であり、色内runの縮約とEGF積がその交差項を数える。二項反転でp_dを復元しt=N−1−dへ移せば異色境界分布a_tを得る。Σa_t/(1−tx)のk次係数はΣa_tt^kなので、分数の合成と定数項1の分母逆元で全momentを正確に生成できる。 ここでq,pは色列を数えるので、元の球番号の割当L=∏m_c!をa_tへ一度掛ける。q_n=(N−n)!G_{N−n}の次数反転とpへの符号付き畳み込みは二項反転に一致し、最終出力は母関数の1,…,M次係数である。","sourceRevisionIds":["source-abc260-ex-problem-d07c2253eb6027bf7537a67461899f6ac61aac2cd22b86e9deb1c82ea83807fd","source-abc260-editorial-4434-864dffceff26d14b00bdc9dbe05af08146c10a71c91bc9ab5b65db1d57ee1a40"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

全 k について C(P)^k を直接足す代わりに、C(P)=t となる順列数 a_t を先に得れば F(k)=Σ_t a_t t^k と分離できる。

異色境界数 C と同色境界数 D は C＋D=N−1 なので、同色境界を指定して満たす列を数える包除原理が使える。

棄却する候補: 色の多重集合順列を DP で列挙し、遷移回数ごとの分布を色数・個数状態で数える。

色ごとの残数を状態にすると次元が色数に依存し、N=25 万では扱えない。

採用する候補: 指定した同色隣接を満たす数 q を色ごとのブロック EGF の積で求め、二項反転で正確な分布 a を復元した後、Σ_t a_t/(1−tx) を FPS 展開する。

分布計算と全冪モーメント生成の双方を多項式積・畳み込みへ落とせ、NTT と積木、FPS 逆元を一貫して利用できる。

p_dを同じ色の球を区別しない色列のうち同色境界が正確にd個あるものの数、q_nを色列とその同色境界から指定したn箇所の組の数とする。一つの色列にはC(d,n)通りの指定があるので、q_n=Σ_{d≥n}C(d,n)p_d。色cのm_c個の出現を出現順に見て、その間のm_c−1箇所からm_c−k個を「同色で隣接すると指定」して縮約すればk blockになる。blockの長さの選び方はC(m_c−1,m_c−k)、同色blockの順序は固定なので、各色のk_c blockを混ぜる順序数は(N−n)!/∏k_c!である。

使用色（m_c>0）だけについてg_c(x)=Σ_{k=1}^{m_c} C(m_c−1,m_c−k)x^k/k!を作る。未使用色の因子は1。G=∏g_cとすると、0≤n≤N−1で

```text
q_n = (N−n)! · G_{N−n}
p_d = Σ_{n=d}^{N−1} (−1)^{n−d} C(n,d)q_n
```

となる。二項反転を二重loopで計算しないため、U_j=q_{N−1−j}(N−1−j)!、V_j=(−1)^j/j!（0≤j<N）を畳み込み、p_d=(U*V)_{N−1−d}/d!とする。

元の球は相異なるのでL=∏m_c!を掛け、a_t=L·p_{N−1−t}（0≤t<N）を異色境界数t別の順列数にする。このLはqを色列として計算した分を戻すもので、一度だけ掛ける。

分数leafを(a_t,1−tx)とし、二組(A,B),(C,D)の和を(AD+CB,BD)として均衡した積木で合成する。得た分子S・分母TはT(0)=1。T^{-1}をM次までNewton倍化で求め、S·T^{-1}の1,…,M次係数を出力する。0次はF(0)=N!であり出力しない。t=0の項も分母1として含めれば、0^0の扱いを個別の冪計算へ持ち込む必要がない。

N=2で同色二球ならq=(1,1)、p=(0,1)、a_0=2、F(k)=0（k≥1）。異色二球ならq=(2,0)、p=(2,0)、a_1=2、F(k)=2。この対比で次数反転と色内階乗の両方を確認できる。

## 典型の発動条件

### 指定事象数から正確事象数への二項反転

発動条件: ちょうど d 個成立する対象は数えにくいが、指定した n 個が全て成立する対象なら数えやすいとき。

q_n=Σ binom(d,n)p_d を作り、階乗で正規化した畳み込みとして p を復元する。

### 指数型母関数によるラベル付き合成

発動条件: 独立な種類ごとの部品数を合成するときに、多項係数で配置順を混ぜる必要があるとき。

係数を階乗で割った色別多項式を掛け、最終係数へ階乗を戻す。

### 有理型母関数と FPS 逆元

発動条件: 有限分布 a_t の全冪モーメント Σa_t t^k を多数の k について求めるとき。

Σa_t/(1−tx) の分子・分母を積木でbalancedにまとめ、Newton 法で総分母を反転して必要次数まで展開する。

## 問題固有の要素

同色の球は色列を数える段階では同一視でき、最後に各色内の球番号の並べ方 ∏m_c! を掛けて元の球の順列数へ戻せる。

別の問題へ持ち帰る視点: 評価値が属性列だけで決まるラベル付き順列は、属性列の数え上げと属性内ラベルの置換を分離する。

## 正当性

同色境界を指定した数q_nはexact分布p_dの二項変換であり、色内runの縮約とEGF積がその交差項を数える。二項反転でp_dを復元しt=N−1−dへ移せば異色境界分布a_tを得る。Σa_t/(1−tx)のk次係数はΣa_tt^kなので、分数の合成と定数項1の分母逆元で全momentを正確に生成できる。 ここでq,pは色列を数えるので、元の球番号の割当L=∏m_c!をa_tへ一度掛ける。q_n=(N−n)!G_{N−n}の次数反転とpへの符号付き畳み込みは二項反転に一致し、最終出力は母関数の1,…,M次係数である。

## 実装上の注意

- 色別多項式や分数は次数の小さいものから priority queue で併合し、極端に偏った逐次積を避ける。
- 同色境界数 d と異色境界数 N−1−d の添字反転、および色内ラベル置換の階乗係数を落とさない。
- FPS 逆元は定数項が 1 の分母に対し u←2u−tu^2 を必要次数で切り詰めながら倍化する。
- m_c=0は因子1、m_c>0はk=1..m_c。q_nへ(N−n)!を掛けてから二項反転し、色内階乗Lはa_tへ一度だけ掛ける。

## 復習の核

- 同じ統計量の多数の冪和を求めるなら、まず統計量の値別分布へ問題を分離する。
- 多項係数を伴う独立部品の合成では、階乗正規化により通常の畳み込みへ変わるか確認する。
- 有限分布の moment sequence は各値の等比級数を足した有理関数になる、という変換を候補にする。

## 計算量と制約

### 時間

O((N+M)log²(N+M))。色別積、二項反転、分数積木とFPS展開を用いる。

### 空間

O((N+M)log(N+M))の積木保持、逐次解放でO(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2.5 \times 10^5; 1 \leq M \leq 2.5 \times 10^5; 1 \leq a_i \leq N; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/tasks/abc260_h) — source-abc260-ex-problem-d07c2253eb6027bf7537a67461899f6ac61aac2cd22b86e9deb1c82ea83807fd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/editorial/4434) — source-abc260-editorial-4434-864dffceff26d14b00bdc9dbe05af08146c10a71c91bc9ab5b65db1d57ee1a40
