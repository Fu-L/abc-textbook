---
title: "ABC300-EX — Fibonacci: Revisited"
draft: true
authoringUnit: {"problemId":"abc300-ex","docPath":"src/content/docs/problems/mathematics/outcome-extract-rational-series-coefficient/outcome-extract-rational-series-coefficient-shard-001/abc300-ex.md","learningOutcomeIds":["outcome-extract-rational-series-coefficient"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-linear-recurrence","unit-polynomial-convolution"],"excludedTopics":["Bostan–Mori・有理生成関数の係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bostan-mori","tag-convolution","tag-linear-recurrence-matrix"],"sourceRevisionIds":["source-abc300-editorial-6269-8ee6c801cc635135e368a145e5422f67ea6f3b84bb1f84c9a3d8abdbe3e9c62f","source-abc300-ex-problem-a4193e2c6420fe848a52d2fcde204ca005b9263c25643e305fd3a0f5154a481f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"P/QへQ(−x)を掛けると分母が偶関数になるため、偶係数列と奇係数列は同じ圧縮分母で表される。submaskのbitが0なら偶列だけ、1なら0/1どちらの選択も許すので偶列と奇列を足す。各bit後の分子は未処理上位bitに対応する係数和を表す不変条件を保ち、最後に定数項比が全submaskの係数和になる。","sourceRevisionIds":["source-abc300-editorial-6269-8ee6c801cc635135e368a145e5422f67ea6f3b84bb1f84c9a3d8abdbe3e9c62f","source-abc300-ex-problem-a4193e2c6420fe848a52d2fcde204ca005b9263c25643e305fd3a0f5154a481f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Bostan–Mori・有理生成関数の係数抽出](src/content/docs/learn/combinatorics-algebra/bostan-mori.md)

- P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- Bostan–Mori・有理生成関数の係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

K-bonacciは有理母関数P/Qを持ち、求めるsubmask m⊆Nの係数和はBostan–Moriのbit選択を0/1両枝の和へ置き換えると追跡できる。

採用する候補: submask和へ拡張したBostan–Mori

Nの各bitで0なら偶数係数、1なら偶数＋奇数係数を残し、indexを半減しながら次数Kの有理式を保てる。

棄却する候補: 全submask mを列挙してK-bonacciを計算

popcount(N)が大きいと2^60候補になる。

棄却する候補: K×K行列を各候補へ累乗

候補数に加え一回O(K^3 logN)でK=5×10^4を扱えない。

Q(x)Q(-x)が偶多項式になるため、係数の偶数/奇数抽出後も次数K以下の有理式としてNTT畳み込みで更新できる。

K-bonacciのP,Qを構成し、Nを下位bitから処理する。Q(-x)を掛けて分母を偶次数へ圧縮し、N bitが0なら分子偶部、1なら偶部＋奇部を選び、最後の定数係数比を出す。

初期値が a_0=…=a_{K−1}=1 なので、Q(x)=1−x−…−x^K、P(x)=Σ_{n=0}^{K−1}(1−n)x^n となる。Q·a の n<K の係数は 1−n、それ以降は元の漸化式で0だからである。

各段で U=P(x)Q(−x)、V=Q(x)Q(−x) を畳み込みし、P_new[t]=U[2t]+(Nの最下位bitが1 ? U[2t+1] : 0)、Q_new[t]=V[2t] とする。Nを一bit右へずらして繰り返し、N=0になったら P[0]/Q[0] を返す。Pの次数はK未満、Qの次数はK以下を保つが、積 U,V は抽出前に十分な次数まで計算する。次数Kで先に積を切ると必要な上位係数を失う。

通常の一係数[N次]だけを求めるBostan–Moriでは、Nが奇数なら奇係数だけを選ぶ。本問ではNの1-bitに対してsubmaskのbitを0にも1にもできるため、偶係数と奇係数の両方を足す。例えばK=2,N=1ならa_0+a_1=2を求め、a_1=1だけを抽出する更新とは異なる。包絡や典型の更新式を使う際にも、求める対象が単一値か集合上の和かを先に固定する。

## 典型の発動条件

### Bostan–Mori

発動条件: 線形漸化式の巨大index項を高速取得する。

P/QへQ(-x)を掛け偶奇係数を抽出する。

### bit DPと母関数

発動条件: indexの各bitが0/1の選択制約を持つ。

submask条件を偶部または偶奇和の作用素として合成する。

## 問題固有の要素

単一係数を選ぶBostan–Moriの分岐を線形結合に替えるだけで、全submask係数和を同じ有理式更新で扱える。

別の問題へ持ち帰る視点: 係数index集合がbitごとの正則言語ならdigit抽出作用素を母関数へ作用させる。

## 正当性

P/QへQ(−x)を掛けると分母が偶関数になるため、偶係数列と奇係数列は同じ圧縮分母で表される。submaskのbitが0なら偶列だけ、1なら0/1どちらの選択も許すので偶列と奇列を足す。各bit後の分子は未処理上位bitに対応する係数和を表す不変条件を保ち、最後に定数項比が全submaskの係数和になる。

## 実装上の注意

- P,Qを次数Kにtruncateし、N=0とK=1、偶奇抽出後の正規化を確認する。

- 初期 a_0,…,a_{K−1} は全て1。P,Qの係数をこの初期値から構成する。
- 偶奇抽出後の P の次数は K 未満、Q は K 以下。積を先に K 次でtruncateしてはいけない。
- N=0 は a_0=1、K=1 は a_n=1 なので答えは 2^{popcount(N)}。この二つはbit分岐の検査にもなる。

## 復習の核

- 小K,Nで漸化式を直接生成し全submask和と比較し、N=0、bitが連続1、最高bit処理を確認する。

## 計算量と制約

### 時間

O(K log K·log(N+1))。各bitでBostan–Mori型の積と偶奇抽出を行う。

### 空間

O(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq 5 \times 10^4; 0 \leq N \leq 10^{18}; N and K are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/editorial/6269) — source-abc300-editorial-6269-8ee6c801cc635135e368a145e5422f67ea6f3b84bb1f84c9a3d8abdbe3e9c62f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/tasks/abc300_h) — source-abc300-ex-problem-a4193e2c6420fe848a52d2fcde204ca005b9263c25643e305fd3a0f5154a481f
