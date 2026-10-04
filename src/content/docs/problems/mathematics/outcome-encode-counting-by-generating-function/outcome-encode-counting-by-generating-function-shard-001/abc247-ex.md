---
title: "ABC247-EX — Rearranging Problem"
draft: true
authoringUnit: {"problemId":"abc247-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc247-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc247-editorial-3737-53eb270fb9b824e0ab78b864fba70dde4286e8a5ffa0f81bcdd209193c4b9159","source-abc247-ex-problem-043b96a4aefb5f879242b1db968a6d522ef59ab4457b1353713d23a225ecdbcb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"色内の順列へ新要素を入れると、独立巡回として置く1通りは巡回数+1、既存要素直後のa通りは巡回数を保つ。従って巡回分布はΠ(z+a)。巡回数cの最小swap数はN−cで、swap一回は符号を反転する。最小列へ同じ交換2回を追加できるので下限と偶奇は必要十分であり、該当係数だけ合計すればよい。","sourceRevisionIds":["source-abc247-editorial-3737-53eb270fb9b824e0ab78b864fba70dde4286e8a5ffa0f81bcdd209193c4b9159","source-abc247-ex-problem-043b96a4aefb5f879242b1db968a6d522ef59ab4457b1353713d23a225ecdbcb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md) — pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

最終 permutation p が色条件を満たすとは、各位置 i に同色の person p_i が来ることであり、色ごとの人集合の内部だけを置換することに等しい。

permutation の cycle 数を c とすると、identity から必要な最小 swap 回数は N-c で、1 swap ごとに cycle 数が ±1 変わるため到達可能性には回数の下限と偶奇だけが残る。

採用する候補: 色条件を満たす permutation を cycle 数別に数える DP を生成多項式へ変換し、一次式群を高速 convolution で積にする。最後に K swap で到達可能な cycle 数の係数を足す。

二次元 DP の遷移を多項式積へまとめ、N≤2×10^5 の全 cycle 数分布を得られる。

棄却する候補: dp[n][k] を表どおり全 n,k について更新する。

状態が N^2 個になり、N≤2×10^5 では時間・記憶量ともに扱えない。

n+1 を固定点 cycle として追加すれば cycle 数が 1 増え、既存の同色要素の直後へ挿入すれば cycle 数は不変である。

a_n を追加前に同じ色だった要素数とすると D_{n+1}(z)=(z+a_n)D_n(z) なので、cycle 数分布は ∏(z+a_n) の係数になる。

cycle 数 c の permutation がちょうど K swap で作れる条件は N-c≤K かつ (N-c)≡K mod 2 である。余分な偶数回は同じ swap を 2 回行って調整できる。

色ごとに出現順 j=0,…,m-1 の一次多項式 (z+j) を用意し、divide-and-conquer/priority merge と NTT で全積を求める。係数 [z^c] のうち N-c≤K かつ parity が一致するものを 998244353 で合計する。

## 典型の発動条件

### permutation の cycle 数と swap 距離

発動条件: 任意 2 点 swap を指定回数行った後の permutation 到達性を判定するとき。

最小回数 N-cycles と permutation parity から、ちょうど K 回で到達できる cycle 数を絞る。

### DP の生成多項式化

発動条件: dp[n+1][k]=dp[n][k-1]+a_n dp[n][k] のように添字 shift と定数倍で遷移するとき。

cycle 数 k を z の次数にし、各追加を一次式 z+a_n の乗算へ変える。

### 分割統治 convolution

発動条件: 多数の低次数多項式の全積が必要で、逐次乗算では二次になるとき。

一次多項式を balanced に merge し、998244353 上の NTT で積を構成する。

## 問題固有の要素

色制約付き permutation の cycle 分布は、各色で何人目かという値 j を係数に持つ一次式 (z+j) の積になる。

別の問題へ持ち帰る視点: Stirling 数型の挿入 DP が現れたら、cycle/成分数を多項式の次数にして積構造を探す。

## 正当性

色内の順列へ新要素を入れると、独立巡回として置く1通りは巡回数+1、既存要素直後のa通りは巡回数を保つ。従って巡回分布はΠ(z+a)。巡回数cの最小swap数はN−cで、swap一回は符号を反転する。最小列へ同じ交換2回を追加できるので下限と偶奇は必要十分であり、該当係数だけ合計すればよい。

## 実装上の注意

- 各色の最初の要素では a_n=0 なので因子は z となり、少なくとも色数個の cycle が必要という制約も係数へ自然に入る。
- 合計する c は 1≤c≤N のうち c≥N-K かつ c≡N-K (mod 2) とし、K>N のとき下限を配列範囲へ clamp する。

## 復習の核

- 同色 3 人の因子 z(z+1)(z+2) を展開し、各 cycle 数の個数と N-c swap の下限・偶奇を小例で照合する。

## 計算量と制約

### 時間

O(N log²N)。一次因子の積木をNTTで合成する。

### 空間

O(N log N)の素朴な積木保持、逐次解放すればO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 200000; 1 \leq K \leq 10^9; 1 \leq c_i \leq N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/editorial/3737) — source-abc247-editorial-3737-53eb270fb9b824e0ab78b864fba70dde4286e8a5ffa0f81bcdd209193c4b9159
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/tasks/abc247_h) — source-abc247-ex-problem-043b96a4aefb5f879242b1db968a6d522ef59ab4457b1353713d23a225ecdbcb
