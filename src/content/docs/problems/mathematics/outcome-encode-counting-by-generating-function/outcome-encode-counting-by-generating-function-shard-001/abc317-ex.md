---
title: "ABC317-EX — Walk"
draft: true
authoringUnit: {"problemId":"abc317-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc317-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-formal-power-series","tag-generating-functions","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc317-editorial-7013-2e538661c5fbeb428b89076ae6a976e45249a07e838732eab8d9a027635950d9","source-abc317-ex-problem-fbd59b0227a3f35072f9dd14298cbff3e9f5554bf780ea7bdea114628041de95"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"1への全辺を除いた graph では前進辺と n≥2 の自己ループだけが残り、F_0=0,F_1=1 と局所漸化式が全 walk を一意に数える。3×3 行列は F の二階遷移と G の prefix 和を同時に合成する。初回帰還の末尾 n→1 を加えた xG_N の区間列と、最後の帰還なし N 行き区間への分解は一意なので母関数は F_N/(1−xG_N)。頂点1の自己ループは帰還側だけに含める。多項式行列 L_n=d_n M_n の積は共通分母 D を掛けた同じ状態を与え、答え U/(D−xV) は元の式と等しい。歩数は非負なので次数 K の打切りは目的係数を変えない。","sourceRevisionIds":["source-abc317-editorial-7013-2e538661c5fbeb428b89076ae6a976e45249a07e838732eab8d9a027635950d9","source-abc317-ex-problem-fbd59b0227a3f35072f9dd14298cbff3e9f5554bf780ea7bdea114628041de95"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md) — pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

辺は自己ループ、1・2頂点先への前進、頂点1への帰還からなる。K歩ごとの頂点 DP は O(NK) で大きすぎる。大きく後退する先が1に限られるので、まず1への全辺を消した walk を数え、その後で帰還区間を組み合わせる。

F_n(x) を帰還辺を使わない 1→n walk の歩数母関数とする。頂点1の自己ループも消すので F_0=0,F_1=1 と固定する。元の A_1=D_1 は帰還側だけで数える。

n≥2、C_0=0 として

```text
d_n=1−xA_n,  P_n=1/d_n,  Q_n=xB_{n−1},  R_n=xC_{n−2}
F_n=P_n(Q_nF_{n−1}+R_nF_{n−2})
G_n=Σ_{i=1}^n D_iF_i=G_{n−1}+D_nF_n
```

とする。直前二頂点から来る最後の前進辺を選び、n の自己ループを0回以上繰り返すので P_n が掛かる。S_n=(F_n,F_{n−1},G_n)^T、初期 S_1=(1,0,D_1)^T に対し、S_n=M_n S_{n−1} の行列は

```text
M_n = [[P_n Q_n,     P_n R_n,     0],
       [1,           0,           0],
       [D_n P_n Q_n, D_n P_n R_n, 1]]
```

である。積の順序は M_N…M_2。逆順に合成すると別の walk を数えてしまう。

帰還 walk の最後の辺が n→1 であるものの母関数は xD_nF_n。したがって初めて1へ戻る非空区間の母関数は xG_N である。任意 walk は、この帰還区間を0回以上並べ、最後に戻らず N に達する区間を付けたものに一意に分解できる。答えの母関数は F_N/(1−xG_N)。頂点1の自己ループは xD_1F_1=xD_1 として一度だけ数える。例えば N=2、辺1→1,1→2だけなら F_2=x,G_2=1、x/(1−x) の x² 係数は1である。

有理式を各節点で展開すると歩数 K に比例する大きな積を多数行うことになる。分母を先に払う。L_n=d_n M_n とすれば、全成分が次数2以下の多項式になる。

```text
L_n = [[Q_n,     R_n,     0],
       [d_n,     0,       0],
       [D_n Q_n, D_n R_n, d_n]]
```

product tree で L_N…L_2 を区間の右積×左積の順に求め、S_1 に作用させる。得た第1・第3成分を U,V とする。共通分母 D=∏_{n=2}^N d_n=(1−x)^m、m は n≥2 の A_n=1 の個数なので、F_N=U/D、G_N=V/D。従って最後の母関数は U/(D−xV) になり、U と V を個別に割り算する必要もない。

すべて x^{K+1} で打ち切り、D−xV の FPS inverse を求め U を掛け、その x^K 係数を出す。D−xV の定数項は1なので逆元が存在する。行列積の節点の次数は区間長に比例し、ここでは K まで展開した有理行列を最初から掛けるのではない。

## 典型の発動条件

### walk の first-return 分解

発動条件: 特定頂点へ何度も戻れる walk を数え、戻らない区間は扱いやすいとき。

primitive return を atom とし、任意回連結を生成関数の幾何級数へ変える。

### 多項式係数行列の product tree

発動条件: 位置方向の低階漸化式を持つ生成関数を、多数位置にわたり高速合成するとき。

各位置を小行列にし、分割統治と NTT で全積を求める。

## 問題固有の要素

唯一の大きな後退先が頂点1なので、一般 graph walk ではなく renewal process と前向き DP の積として分離できる。

別の問題へ持ち帰る視点: 遷移がほぼ単調で少数の reset edge だけを持つなら、reset 間の excursion を生成関数化する。

## 正当性

1への全辺を除いた graph では前進辺と n≥2 の自己ループだけが残り、F_0=0,F_1=1 と局所漸化式が全 walk を一意に数える。3×3 行列は F の二階遷移と G の prefix 和を同時に合成する。初回帰還の末尾 n→1 を加えた xG_N の区間列と、最後の帰還なし N 行き区間への分解は一意なので母関数は F_N/(1−xG_N)。頂点1の自己ループは帰還側だけに含める。多項式行列 L_n=d_n M_n の積は共通分母 D を掛けた同じ状態を与え、答え U/(D−xV) は元の式と等しい。歩数は非負なので次数 K の打切りは目的係数を変えない。

## 実装上の注意

- F_0=0,F_1=1,G_1=D_1 とし、A_1 の自己ループを F に含めない。C_0=0 の境界も用意する。
- 行列積は M_N…M_2、区間合成は右×左。L の第1・第3成分 U,V と D から U/(D−xV) を計算する。
- D=(1−x)^m は二項係数で作れる。D−xV の定数項1と次数 K での打切りを確認する。

## 復習の核

- まず戻り辺を消した graph で F_n の二階漸化式を書く。その後、任意 walk を「最後に1を出た区間」とそれ以前の return 区間へ一意に切る。

## 計算量と制約

### 時間

O(N log²N+K log K)。次数2以下の固定3×3行列を均衡積木で掛ける費用は O(N log²N)。D−xV の K 次までの FPS 逆元と U の積は O(K log K)。

### 空間

O(N+K)。深さ優先で積木の子の多項式を解放し、次数 K までの逆元計算領域を使い回す。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5 \times 10^4; 1 \leq K \leq 5 \times 10^5; A_i, B_i, C_i, D_i \in \lbrace 0, 1 \rbrace; A_1 = D_1; B_N = C_{N-1} = C_N = 0

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/editorial/7013) — source-abc317-editorial-7013-2e538661c5fbeb428b89076ae6a976e45249a07e838732eab8d9a027635950d9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/tasks/abc317_h) — source-abc317-ex-problem-fbd59b0227a3f35072f9dd14298cbff3e9f5554bf780ea7bdea114628041de95
