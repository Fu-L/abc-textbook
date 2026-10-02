---
title: "ABC267-EX — Odd Sum"
draft: true
authoringUnit: {"problemId":"abc267-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc267-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc267-ex-problem-53fd370d715324cae8e3d5c9f315e45b9ce92b1b7e6b80ad84576f6b26bafb74","source-abc267-editorial-4736-2ddc26b1addb51230c1fb95dcc014fc02d67b3681e885e7b64b8c85277e8bbba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各要素は未選択をEの定数1、選択をOのx^{A_i}として表す。二群を併合すると選択数parityはXORなのでE=E_1E_2+O_1O_2、O=E_1O_2+O_1E_2。各subsetは葉の選択を一意に決め、積が合計値を次数へ加算する。全A_i>0なのでM超次数の打切りは目的係数へ影響しない。","sourceRevisionIds":["source-abc267-ex-problem-53fd370d715324cae8e3d5c9f315e45b9ce92b1b7e6b80ad84576f6b26bafb74","source-abc267-editorial-4736-2ddc26b1addb51230c1fb95dcc014fc02d67b3681e885e7b64b8c85277e8bbba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

通常のsubset-sum DPへ選択個数parityを追加すればよいが、N×M状態遷移は大きすぎる。

数列Xについて偶数個選ぶ生成多項式E_Xと奇数個選ぶ生成多項式O_Xを持つと、独立な二群の併合は多項式積四つで表せる。

棄却する候補: 要素を一つずつ処理し、sumとparityのDPを更新する。

各要素で0…Mを走査するためN=10万、M=100万に間に合わない。

採用する候補: 各要素aを(E,O)=(1,x^a)として始め、(E1E2+O1O2, E1O2+O1E2)でbalanced mergeし、積をNTTで計算する。

parity合成はZ/2Z畳み込み、sum合成は多項式畳み込みとなり、分割統治的な積で全要素を高速に統合できる。

併合集合で偶数選択は偶+偶または奇+奇、奇数選択は偶+奇または奇+偶からのみ生じる。

最終Oのx^M係数が求める選び方数で、途中のMを超える次数は将来戻らないため切り捨てられる。

knapsack generating functionをsum degree×selection parityのgroup algebraとして表し、product treeとfast convolutionで全因子を掛ける。

## 典型の発動条件

### parity別部分和生成関数

発動条件: 部分集合の重み和に加えて選択個数の偶奇を指定して数えるとき。

偶数・奇数の二多項式を持ち、parity XORに従って積を合成する。

### product treeによる多数多項式積

発動条件: 多数の短い生成多項式を掛け、必要次数までの係数を得たいとき。

サイズの近い多項式をbalancedに併合し、各積をNTTで計算して次数上限で切る。

## 問題固有の要素

形式変数yで選択個数を持つ∏(1+yx^{A_i})をy^2=1の下で計算した二成分が(E,O)に対応する。

別の問題へ持ち帰る視点: 個数mod kの条件は、重み生成関数の係数をZ/kZ成分へ分けた畳み込みとして扱える。

## 正当性

各要素は未選択をEの定数1、選択をOのx^{A_i}として表す。二群を併合すると選択数parityはXORなのでE=E_1E_2+O_1O_2、O=E_1O_2+O_1E_2。各subsetは葉の選択を一意に決め、積が合計値を次数へ加算する。全A_i>0なのでM超次数の打切りは目的係数へ影響しない。

## 実装上の注意

- 各多項式積の直後にdegree Mより大きい係数を切り、メモリと後続畳み込み長を抑える。
- 併合順はFIFOの完全二分的mergeまたはdegree優先queueとし、一つの巨大多項式へ葉を順次掛け続けない。

## 復習の核

- knapsackの要素数×和上限が大きいとき、独立要素の生成関数積を高速畳み込みできないか考える。
- 選択個数mod kは通常DPの追加次元ではなく、小さな巡回畳み込み成分として多項式積に組み込む。

## 計算量と制約

### 時間

O(D log²D+N)、D=min(M,ΣA_i)。product treeでM次打切りNTTを行う。

### 空間

O(D log N+N)の素朴保持、逐次解放でO(D+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 10^5; 1 \le M \le 10^6; 1 \le A_i \le 10; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/tasks/abc267_h) — source-abc267-ex-problem-53fd370d715324cae8e3d5c9f315e45b9ce92b1b7e6b80ad84576f6b26bafb74
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/editorial/4736) — source-abc267-editorial-4736-2ddc26b1addb51230c1fb95dcc014fc02d67b3681e885e7b64b8c85277e8bbba
