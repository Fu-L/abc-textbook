---
title: "ABC422-G — Balls and Boxes"
draft: true
authoringUnit: {"problemId":"abc422-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc422-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc422-editorial-13823-688787088bbacb5a2bcde2cad5c97b46a3aed6338d6c6ec3d9525f651765d20a","source-abc422-g-problem-876fa801bc8143fe0c7ab2505b22d0f0dc02ce66aca804ceae4404b1a3c30de9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各box数は独立で、multiple条件を満たす次数だけ置けば積のN次係数が総数Nの全tupleを一度表す。区別しないballは係数1、区別するballは1/n!で正規化した後N!を掛けて各tupleのlabel割当て多項係数を回復する。0個の定数項1が空boxも含める。","sourceRevisionIds":["source-abc422-editorial-13823-688787088bbacb5a2bcde2cad5c97b46a3aed6338d6c6ec3d9525f651765d20a","source-abc422-g-problem-876fa801bc8143fe0c7ab2505b22d0f0dc02ce66aca804ceae4404b1a3c30de9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

box別ball数の制約は独立で、総数Nだけが三boxを結合する。indistinguishable ballsにはordinary generating function、labeled ballsにはfactorial重みのexponential generating functionが対応する。

採用する候補: 三つのsparse OGF/EGFをNTT convolutionする

各boxの許容個数を係数列にし、productのN次係数で分配数をO(N log N)計算できる。

棄却する候補: aA+bB+cC=Nを全三重loopする

各変数がO(N)候補を持ち最悪O(N^3)になる。

Problem1のbox A列はΣx^{iA}、Problem2はΣx^{iA}/(iA)!である。三積のx^N係数は前者で個数tuple数、後者でlabel分割のmultinomialをN!倍した数になる。

次数NまでのF_A,F_B,F_Cでmultiple位置を1、G_A,G_B,G_Cでmultiple位置をinverseFactorialにする。各三積を二回のNTTで畳み込み、Problem1はcoeff N、Problem2はcoeff N×N!を出す。

## 典型の発動条件

### OGFとEGFの使い分け

発動条件: 同じsize分割でも部品がindistinguishableかlabeledかで結合係数が異なる。

unlabeled countにOGF、label集合分割に1/n!係数のEGFを使う。

### sparse polynomial convolution

発動条件: 三boxの許容size列から総size Nの組合せを求める。

各列を次数Nで切りNTT productのN次係数を取る。

## 問題固有の要素

EGF積のfactorial denominatorが、N個のballを三box sizeへ割り当てるmultinomial係数を自動的に生成する。

別の問題へ持ち帰る視点: label付き直積はEGF convolutionでlabel partition数を吸収できる。

## 正当性

各box数は独立で、multiple条件を満たす次数だけ置けば積のN次係数が総数Nの全tupleを一度表す。区別しないballは係数1、区別するballは1/n!で正規化した後N!を掛けて各tupleのlabel割当て多項係数を回復する。0個の定数項1が空boxも含める。

## 実装上の注意

- 全多項式をN次でtruncateし、0個は各boxで許されるため定数項1を入れる。

## 復習の核

- N小でsize triple列挙と3^N assignment列挙を各係数結果と比較する。

## 計算量と制約

### 時間

O(N log N)。三box多項式の二回NTT積と階乗表。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3 \times 10^5; 1 \leq A \leq 3 \times 10^5; 1 \leq B \leq 3 \times 10^5; 1 \leq C \leq 3 \times 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc422/editorial/13823) — source-abc422-editorial-13823-688787088bbacb5a2bcde2cad5c97b46a3aed6338d6c6ec3d9525f651765d20a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc422/tasks/abc422_g) — source-abc422-g-problem-876fa801bc8143fe0c7ab2505b22d0f0dc02ce66aca804ceae4404b1a3c30de9
