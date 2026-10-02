---
title: "ABC318-EX — Count Strong Test Cases"
draft: true
authoringUnit: {"problemId":"abc318-ex","docPath":"src/content/docs/problems/mathematics/outcome-count-labeled-structures-by-components/outcome-count-labeled-structures-by-components-shard-001/abc318-ex.md","learningOutcomeIds":["outcome-count-labeled-structures-by-components","outcome-apply-formal-power-series-operations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-polynomial-convolution"],"excludedTopics":["label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-formal-power-series","tag-labeled-component-decomposition","tag-convolution","tag-generating-functions"],"sourceRevisionIds":["source-abc318-editorial-7055-a1f2d8b4d9b9838ad9251dd3361dbbe4bd442b52fdea27a26a15f6e6f648ff84","source-abc318-ex-problem-db3d1678c216e1f2e2683df3ed9ead14ec7bd4a4487fb5f6b659e6ac4b66ef01"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"cycle typeを固定するとlabel割当・cycle順序・重み順序の積がN!²Π(1/i²)^{C_i}/C_i!になる。独立cycle集合を全て合計するEGFはexp(Σx^i/i²)。これが片方のAC分類を数え、対称な二分類の包除と全1cycleの共通分N!を戻すことで公式式になる。係数ごとのexpが全cycle分割を一度ずつ数える。","sourceRevisionIds":["source-abc318-editorial-7055-a1f2d8b4d9b9838ad9251dd3361dbbe4bd442b52fdea27a26a15f6e6f648ff84","source-abc318-ex-problem-db3d1678c216e1f2e2683df3ed9ead14ec7bd4a4487fb5f6b659e6ac4b66ef01"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [label付き連結成分分解・exponential formula](src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md)

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

入力の permutation graph は互いに独立な有向 cycle の集合で、Alice/Bob の正誤も cycle ごとに分類できる。全体入力の数え上げは labeled cycle components の組合せになる。

サイズ i の許容 cycle 一個の寄与を整理すると 1/i² になり、個数 C_i 個の同型 component を持つ係数 1/C_i! は exponential generating function exp でまとめられる。

採用する候補: cycle type ごとの組合せ係数を EGF に整理し、f(x)=Σx^i/i² の FPS exp の x^N 係数から各正誤caseを包除する。

全 cycle partition の和を一つの exp 係数へ圧縮し、FPS exp を O(N log N) で計算できる。

棄却する候補: permutation と辺重み permutation をそれぞれ全列挙し、二解法の出力を比較する。

テストケース総数は (N!)² で、N=2×10^5 に対し列挙の余地がない。

両者正しい cycle は1-cycle、Aliceのみ正しい i≥2 cycle は最小頂点から出る辺重みが cycle 内最大のものとして 1/i の割合になる。

cycle partition C に対する頂点割当・cycle 内順序・重み割当を掛けると N!²∏(1/i²)^{C_i}/C_i! となり、Σ_C は exp(f) の係数そのものになる。

mod 上で f_i=1/i² (1≤i≤N) を作り、FPS E=exp(f) mod x^{N+1} を Newton 法で求める。AliceのみAC/BobのみAC/両者AC の重複を対称性と1-cycleのみのケースで整理し、公式式 N!²(1−2[x^N]E)+N! を計算する。

## 典型の発動条件

### labeled components の指数型生成関数

発動条件: 順列の cycle 分解など、ラベル付き対象が独立 component の集合として構成されるとき。

component size i の重みを f_i に置き、任意個の unordered components を exp(f) で数える。

### FPS exp の Newton 法

発動条件: N 次までの exp(f) 係数が必要で N が大きいとき。

微分・積分・inverse/log を使う doubling で次数を倍化する。

## 問題固有の要素

解法の誤り方を直接数えるのでなく、functional graph の各 cycle で正誤を分類すると独立 component の積へ分離する。

別の問題へ持ち帰る視点: アルゴリズム判定のテストケース数え上げでは、入力構造の connected components ごとに判定が独立かを探す。

## 正当性

cycle typeを固定するとlabel割当・cycle順序・重み順序の積がN!²Π(1/i²)^{C_i}/C_i!になる。独立cycle集合を全て合計するEGFはexp(Σx^i/i²)。これが片方のAC分類を数え、対称な二分類の包除と全1cycleの共通分N!を戻すことで公式式になる。係数ごとのexpが全cycle分割を一度ずつ数える。

## 実装上の注意

- f の定数項は0で exp の前提を満たす。最後の全体 case の包除符号と、全 cycle が1-cycleの N! 通りを何回足し戻すかを式から確認する。

## 復習の核

- cycle size ごとの4分類を先に表にし、component 一個の重みを導出してから exp を使う。最終包除は N=1,2 の手計算で検算する。

## 計算量と制約

### 時間

O(N log N)。次数NのFPS expと階乗表。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc318/editorial/7055) — source-abc318-editorial-7055-a1f2d8b4d9b9838ad9251dd3361dbbe4bd442b52fdea27a26a15f6e6f648ff84
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc318/tasks/abc318_h) — source-abc318-ex-problem-db3d1678c216e1f2e2683df3ed9ead14ec7bd4a4487fb5f6b659e6ac4b66ef01
