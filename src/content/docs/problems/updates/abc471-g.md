---
title: "ABC471 G — Caeser Syllables"
draft: true
authoringUnit: {"problemId":"abc471-g","docPath":"src/content/docs/problems/updates/abc471-g.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-convolution"],"sourceRevisionIds":["source-abc471-g-problem-4fd12b99389cc79a8f46878f70b5369d265b587ea77e4139578ff55308688744","source-abc471-editorial-24208-e5329f62b49434bd86ae80921e88d51251a1bc043331f32e55d34004698b4e02"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各母音runには開始位置が一つあり、先頭または非母音→母音の隣接対に一対一対応する。記号対頻度でまとめても各位置の寄与は同じであり、反転添字の巡回畳み込みはシフト後の分類条件を正確に集計する。求める同じシフトは二軸結果の対角成分に一致する。","sourceRevisionIds":["source-abc471-g-problem-4fd12b99389cc79a8f46878f70b5369d265b587ea77e4139578ff55308688744","source-abc471-editorial-24208-e5329f62b49434bd86ae80921e88d51251a1bc043331f32e55d34004698b4e02"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

## 考察

母音runの個数は、先頭が母音なら1、以後は『非母音から母音へ変わる隣接対』の個数である。N個の列をK回走査するとNKが大きすぎるため、隣接記号対(a,b)の頻度C[a,b]だけを一度集計する。

Vの母音集合を使い、巡回畳み込みを二軸で行う。F[s,t]=Σ_{a,b}C\[a,b](1−V_{a+s mod K})V_{b+t mod K} とすると求める隣接run数はF[k,k]。入力頻度の添字を反転したD[−a mod K,−b mod K]=C[a,b]を作れば、Dと非母音指示U、母音指示Vの二軸巡回畳み込みになる。

まず各b列でa方向にUを畳み込み、次に各s行でb方向にVを畳み込む。巡回畳み込みは長さKの通常の線形畳み込みをNTTで求め、次数zとz+Kを足して折り返せばよい。各段はK本の長さ O(K) の畳み込みなので O(K² log K)。最後にF[k,k]+V_{A_1+k mod K}を出力する。

K≤2300なら線形畳み込みの長さは2K−1、変換長は高々8192。998244353を使え、各集計値はN以下でN<法なので整数値をそのまま復元できる。全列Aを保持せず、公式の64 bit生成器を走らせながら前記号との対を加算すればよい。

## 典型の発動条件

列の長さに依存する全シフト計算を、局所隣接対の頻度と巡回相関へ変える。二変数の分離した指示関数なら一次元畳み込みを行・列ごとに適用できる。

## 問題固有の要素

求めるシフトが両記号で共通なので、二軸の畳み込み全体の対角だけを読む。

## 正当性

各母音runには開始位置が一つあり、先頭または非母音→母音の隣接対に一対一対応する。記号対頻度でまとめても各位置の寄与は同じであり、反転添字の巡回畳み込みはシフト後の分類条件を正確に集計する。求める同じシフトは二軸結果の対角成分に一致する。

## 実装上の注意

生成器はunsigned 64 bitの巻戻りと32 bit回転を厳密に再現する。相関の符号と巡回折返しを小例で確認する。

## 復習の核

runは境界で数える。全シフトへ同じ計算をする問題では、頻度化した後に相関へ変換できないか考える。

## 計算量と制約

### 時間

入力生成・頻度集計 O(N)、二軸畳み込み O(K² log K)。

### 空間

頻度行列と畳み込み結果 O(K²)、一変換 O(K)。

### 制約との対応

Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 7 \times 10^6; 1 \leq K \leq 2300; 0 \leq A_i \leq K-1 (1 \leq i \leq N); V_j \in \{0,1\} (0 \leq j \leq K-1); 0 \leq \mathrm{seed} \leq 2^{60} - 1; 1 \leq M \leq \min(N, 10^5); 0 \leq b_i \leq K-1 (1 \leq i \leq M); All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc471/tasks/abc471_g)
- [公式解説](https://atcoder.jp/contests/abc471/editorial/24208)
