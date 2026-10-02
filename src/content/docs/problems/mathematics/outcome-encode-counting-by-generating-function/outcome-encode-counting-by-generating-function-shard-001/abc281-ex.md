---
title: "ABC281-EX — Alchemy"
draft: true
authoringUnit: {"problemId":"abc281-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc281-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-generating-functions","tag-relaxed-convolution","tag-convolution","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc281-editorial-5371-9181c75b8affe7e82abcf348c4ceb3daa99b80b33dfdc9aec716746006dc6ada","source-abc281-ex-problem-238a900be791f6707698c0e4a18061f323afa9e96776892761c7304380778746"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"level1はA種類から相異なる材料を選ぶので(1+z)^A、各既知level j≥2は同levelから高々一個選ぶので1+a_jzを掛ける。材料個数iの係数がa_iでありj<iの係数だけに依存する。CDQは左側の既知factorだけを右側の必要bandへ送り、各係数が確定する前に必要な全factor寄与を反映するため、次数順の素朴母関数と同じ値になる。","sourceRevisionIds":["source-abc281-editorial-5371-9181c75b8affe7e82abcf348c4ceb3daa99b80b33dfdc9aec716746006dc6ada","source-abc281-ex-problem-238a900be791f6707698c0e4a18061f323afa9e96776892761c7304380778746"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

level i gemは合計i個の異種gemから作り、level≥2は各levelを高々1個なので、材料選択はlevel1の個数と過去level gemのsubsetに分かれる。

level1のx種類選択はC(A,x)、level j gemを使う/使わないはfactor(1+a_j z)で表せるため、a_iは生成多項式のz^i係数になる。

採用する候補: a_i=\[z^i](1+z)^A∏_{j=2}^{i-1}(1+a_jz)というonline係数recurrenceを、次数区間を切るCDQ divide-and-conquerとNTTで評価する。

逐次決まるa_iを左半分から確定して右へconvolutionで反映し、二次のlinear-factor更新をまとめられる。

棄却する候補: iを昇順に求めるたび現在polynomialへ(1+a_i z)を愚直に掛ける。

各回O(N)係数を更新して全体O(N²)となり、N≤2×10^5に間に合わない。

(1+z)^Aの係数がlevel1材料の選択を、∏(1+a_jz)が各過去level gemを0/1個選ぶことを表し、次数が材料個数になる。

CDQ区間[l,r)では右側a_iへ影響する既知factorが左側にそろった後にまとめて畳み込める。

各再帰でglobal polynomial全体を掛けず、その区間が参照する次数bandだけを切り出すことで、同じ大配列の再計算を防ぐ。

N=1ならAを返す。f_k=C(A,k)をNまで用意し、CDQで左区間のaとlinear factorsを確定、product/convolutionの必要次数sliceだけを右区間の係数へ加える。998244353のNTTを用い、最終a_Nを出力する。

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

level1はA種類から相異なる材料を選ぶので(1+z)^A、各既知level j≥2は同levelから高々一個選ぶので1+a_jzを掛ける。材料個数iの係数がa_iでありj<iの係数だけに依存する。CDQは左側の既知factorだけを右側の必要bandへ送り、各係数が確定する前に必要な全factor寄与を反映するため、次数順の素朴母関数と同じ値になる。

## 実装上の注意

- Aがmod以上でもk≤N<modなのでC(A,k)はfalling productとk! inverseで法上計算でき、途中のA-jを正規化する。
- 再帰ごとに必要なdegree intervalを明確にし、g全体とのconvolutionを繰り返して計算量を悪化させない。

## 復習の核

- N=2でa_2=C(A,2)、N=3でC(A,3)+C(A,2)a_2をfactor展開から導き、CDQが確定済みa_2だけを右へ使うことを確認する。

## 計算量と制約

### 時間

O(N log²N)。次数bandを限定したCDQ積とNTTを行う。

### 空間

O(N log N)の再帰保持、解放を工夫すればO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A \leq 10^9; N and A are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/editorial/5371) — source-abc281-editorial-5371-9181c75b8affe7e82abcf348c4ceb3daa99b80b33dfdc9aec716746006dc6ada
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/tasks/abc281_h) — source-abc281-ex-problem-238a900be791f6707698c0e4a18061f323afa9e96776892761c7304380778746
