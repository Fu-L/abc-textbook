---
title: "ABC281-EX — Alchemy"
draft: true
authoringUnit: {"problemId":"abc281-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc281-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-generating-functions","tag-relaxed-convolution","tag-convolution","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc281-editorial-5371-9181c75b8affe7e82abcf348c4ceb3daa99b80b33dfdc9aec716746006dc6ada","source-abc281-ex-problem-238a900be791f6707698c0e4a18061f323afa9e96776892761c7304380778746"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"材料の選択をlevel1の二項係数と既知levelの0/1因子で表すと、材料数iの係数がa_iになる。solve(l,r,g)の不変条件の下で、左再帰は左のaを確定しその全因子積Qを返す。Qの次数はm−l以下なので、右が必要とする次数[m,r)へ元の次数l未満は寄与しない。従って局所畳み込み(g*Q)[m−l:r−l]は右の不変条件を満たす。葉は全ての過去因子を反映した係数を読み、返り値は左右の積から正しい区間積になる。帰納的に素朴な母関数更新と一致する。","sourceRevisionIds":["source-abc281-editorial-5371-9181c75b8affe7e82abcf348c4ceb3daa99b80b33dfdc9aec716746006dc6ada","source-abc281-ex-problem-238a900be791f6707698c0e4a18061f323afa9e96776892761c7304380778746"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

level iの宝石を作るには、材料をi個選ぶ。level1はA種類から何個でも選べるが、level j≥2は同じlevelを高々一つ選ぶ。a_iをlevel iの生成方法数とすると、

a_i=\[z^i](1+z)^A∏_{2≤j<i}(1+a_j z)

となる。各因子の次数は材料の個数、係数はその材料の生成方法数である。N=1ならAを返す。

a_iが決まるたびに長さNの係数列へ一次因子を掛けるとO(N²)。既知の一次因子なら積木でまとめられるが、本問は積の係数が次の因子を作るので、左の答えを確定してから右へ進む必要がある。

区間再帰solve(l,r,g)を次の不変条件で定義する。引数は長さr−lの局所配列で、

g[t]=\[z^(l+t)](1+z)^A∏_{2≤j<l}(1+a_j z) （0≤t<r−l）

である。返り値はQ_{l,r}(z)=∏_{l≤j<r}(1+a_j z)。初回はsolve(2,N+1,g)で、g[t]=C(A,2+t)とする。C(A,k)はC(A,0)=1からC(A,k)=C(A,k−1)(A−k+1)/kでNまで求める。

葉r=l+1ではa_l=g[0]を確定し、[1,a_l]を返す。内部ではm=floor((l+r)/2)として、以下を行う。

1. gの先頭m−l個を渡して左を解き、積Q=Q_{l,m}を得る。
2. 局所配列の畳み込みh=g*Qを計算し、hの添字[m−l,r−l)を右への配列として渡す。
3. 右の返り値Q_{m,r}とQを畳み込み、Q_{l,r}を返す。

手順2で求める元の次数は[m,r)。Qの次数は高々m−lなので、元の次数l未満の係数は掛けてもm未満にしか届かない。従ってgを[l,r)に切ってよい。右へ渡すのは更新後の係数そのものであり、左因子の寄与を加法的に一回送るだけのCDQではない。Qの積に含まれる複数因子の交差項も、通常の多項式積で全て入る。

各長さsの呼出しは長さO(s)の畳み込みを定数回行う。NTTでO(s log s)、同一階層のsの和はO(N)、階層数はO(log N)なので全体O(N log²N)。

## 典型の発動条件

### 組合せ選択の生成関数

発動条件: 複数categoryから0/1個または任意個選び、総材料数別の重み和を求めるとき。

level1をbinomial polynomial、各高level種類をlinear factorで表す。

### online CDQ convolution

発動条件: 列a_iが過去a_jからなる畳み込み/多項式係数で順次定まり、全prefixを高速化したいとき。

左半分を確定してその寄与をNTTで右半分へ一括反映する。

## 問題固有の要素

各level≥2から材料を高々1個という制約が、未知係数a_jを持つlinear factor(1+a_jz)を生み、online product問題になる。

別の問題へ持ち帰る視点: 自己生成される種類数が後続の0/1選択factorになる再帰では、動的生成関数をCDQで確定順に処理する。

## 正当性

材料の選択をlevel1の二項係数と既知levelの0/1因子で表すと、材料数iの係数がa_iになる。solve(l,r,g)の不変条件の下で、左再帰は左のaを確定しその全因子積Qを返す。Qの次数はm−l以下なので、右が必要とする次数[m,r)へ元の次数l未満は寄与しない。従って局所畳み込み(g*Q)[m−l:r−l]は右の不変条件を満たす。葉は全ての過去因子を反映した係数を読み、返り値は左右の積から正しい区間積になる。帰納的に素朴な母関数更新と一致する。

## 実装上の注意

- Aは法998244353を超え得るが、k≤N<法なのでkの逆元が存在し、二項係数の漸化式を法上で使える。
- gの添字は元の次数からlを引いたもの。返す因子積の添字は通常の次数であり、両者を混同しない。
- 各畳み込み後は次の呼出しに必要な区間を切り出す。全次数配列を各葉へ持ち込まない。

## 復習の核

- N=2でa_2=C(A,2)、N=3でC(A,3)+C(A,2)a_2をfactor展開から導き、CDQが確定済みa_2だけを右へ使うことを確認する。

## 計算量と制約

### 時間

二項係数の前計算O(N)。長さsの再帰でO(s log s)のNTTを定数回行い、階層ごとの総和O(N log N)をO(log N)階層分足すので、全体O(N log²N)。

### 空間

O(N log N)の再帰保持、解放を工夫すればO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A \leq 10^9; N and A are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/editorial/5371) — source-abc281-editorial-5371-9181c75b8affe7e82abcf348c4ceb3daa99b80b33dfdc9aec716746006dc6ada
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/tasks/abc281_h) — source-abc281-ex-problem-238a900be791f6707698c0e4a18061f323afa9e96776892761c7304380778746
