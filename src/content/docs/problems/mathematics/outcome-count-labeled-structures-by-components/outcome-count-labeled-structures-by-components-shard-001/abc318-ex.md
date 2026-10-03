---
title: "ABC318-EX — Count Strong Test Cases"
draft: true
authoringUnit: {"problemId":"abc318-ex","docPath":"src/content/docs/problems/mathematics/outcome-count-labeled-structures-by-components/outcome-count-labeled-structures-by-components-shard-001/abc318-ex.md","learningOutcomeIds":["outcome-count-labeled-structures-by-components","outcome-apply-formal-power-series-operations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-polynomial-convolution"],"excludedTopics":["label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-formal-power-series","tag-labeled-component-decomposition","tag-convolution","tag-generating-functions"],"sourceRevisionIds":["source-abc318-editorial-7055-a1f2d8b4d9b9838ad9251dd3361dbbe4bd442b52fdea27a26a15f6e6f648ff84","source-abc318-ex-problem-db3d1678c216e1f2e2683df3ed9ead14ec7bd4a4487fb5f6b659e6ac4b66ef01"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"cycle から辺を一本も削除しなければ閉路が残る。一方、最小重みの一本だけを削除すれば閉路が消えるので、最適値は cycle ごとの最小重みの和である。Alice の最初の処理頂点はその cycle の最小番号頂点で、その出辺を削除すると残りは閉路でなくなる。Bob は最大番号頂点の出辺を削除する。各 cycle の選択重みは最小重み以上なので、誤差の相殺はなく、全体が AC であることと全 cycle の選択が最小重みであることは同値である。\n\ncycle 数を C_i、ΣiC_i=N と固定する。P の選び方は N!/∏(i^{C_i}C_i!)。各 cycle の指定された一辺が最小重みとなる Q の選び方は N!∏i^{−C_i} で、互いに素な cycle 内の相対順位条件は独立である。積は (N!)²∏(i^{−2C_i}/C_i!)。全 C_i を足すと (N!)²[x^N]exp(Σx^i/i²) となり、Alice が AC の全入力を数える。\n\n長さ 2 以上では最小番号頂点と最大番号頂点は異なり、重みも相異なるので両者が同時に最小辺を選べない。したがって両者 AC は P が恒等順列の N! 入力だけ。Alice/Bob の AC 数は番号反転で等しいため、包除で両者 WA の式を得る。","sourceRevisionIds":["source-abc318-editorial-7055-a1f2d8b4d9b9838ad9251dd3361dbbe4bd442b52fdea27a26a15f6e6f648ff84","source-abc318-ex-problem-db3d1678c216e1f2e2683df3ed9ead14ec7bd4a4487fb5f6b659e6ac4b66ef01"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

順列 P の辺 i→P_i は独立な有向 cycle に分かれる。各 cycle を壊すには少なくとも一本の辺を削除し、最適値は各 cycle の最小辺重みの和である。まず Alice/Bob がどの辺を削除するかを操作順から特定する。Alice は番号の昇順に頂点を処理するので cycle の最小番号頂点から出る辺を、Bob は降順なので最大番号頂点から出る辺を削除する。

採用する候補: Alice が全 cycle で最小重み辺を選ぶ入力数を、ラベル付き cycle の集合として EGF で数える。

長さ i の cycle で Alice が正しい確率は 1/i。順列の cycle の組合せ係数にも 1/i が現れるので、f(x)=Σ_{i≥1}x^i/i²、E(x)=exp(f(x)) を得る。Alice が AC になる入力数は (N!)²[x^N]E である。これは Alice のみ AC の数ではなく、両者 AC の入力も含む。

棄却する候補: P と重み順列 Q を全列挙する。

入力は (N!)² 通りあり、N≤2×10^5 では列挙できない。

両者が同時に正しい cycle は長さ 1 に限る。全 cycle が長さ 1、すなわち P が恒等順列のときだけ両者 AC で、Q の選び方は N! 通り。対称性と包除により両者 WA の数は (N!)²(1−2[x^N]E)+N! となる。

f_i=1/i² を法上で作り、FPS exp を次数 N まで計算する。公式解説にある「最大重み」は問題の最適化方向と逆であり、ここでは操作と最小化条件から導いた「最小重み」を使う。

## 典型の発動条件

### labeled components の指数型生成関数

発動条件: 順列の cycle 分解など、ラベル付き対象が独立 component の集合として構成されるとき。

component size i の重みを f_i に置き、任意個の unordered components を exp(f) で数える。

### FPS exp の Newton 法

発動条件: N 次までの exp(f) 係数が必要で N が大きいとき。

微分・積分・inverse/log を使う doubling で次数を倍化する。

## 問題固有の要素

判定に必要なのは各 cycle の最小重みである。P=(2,3,1), Q=(3,2,1) では最適値 1 に対し Alice は 3、Bob は 1 を選び、Alice は WA、Bob は AC になる。最大重みという誤条件でも対称性で総数だけは一致し得るため、個々の入力の判定から検証する。

別の問題へ持ち帰る視点: 成分ごとの最適値に対する誤差がすべて非負なら、全体の正解条件を各成分の正解条件へ分解できる。

## 正当性

cycle から辺を一本も削除しなければ閉路が残る。一方、最小重みの一本だけを削除すれば閉路が消えるので、最適値は cycle ごとの最小重みの和である。Alice の最初の処理頂点はその cycle の最小番号頂点で、その出辺を削除すると残りは閉路でなくなる。Bob は最大番号頂点の出辺を削除する。各 cycle の選択重みは最小重み以上なので、誤差の相殺はなく、全体が AC であることと全 cycle の選択が最小重みであることは同値である。

cycle 数を C_i、ΣiC_i=N と固定する。P の選び方は N!/∏(i^{C_i}C_i!)。各 cycle の指定された一辺が最小重みとなる Q の選び方は N!∏i^{−C_i} で、互いに素な cycle 内の相対順位条件は独立である。積は (N!)²∏(i^{−2C_i}/C_i!)。全 C_i を足すと (N!)²[x^N]exp(Σx^i/i²) となり、Alice が AC の全入力を数える。

長さ 2 以上では最小番号頂点と最大番号頂点は異なり、重みも相異なるので両者が同時に最小辺を選べない。したがって両者 AC は P が恒等順列の N! 入力だけ。Alice/Bob の AC 数は番号反転で等しいため、包除で両者 WA の式を得る。

## 実装上の注意

- f の定数項は0で exp の前提を満たす。最後の全体 case の包除符号と、全 cycle が1-cycleの N! 通りを何回足し戻すかを式から確認する。

## 復習の核

- cycle ごとの削除辺を処理順から求め、最小重みと比較する。EGF が数えるのは片方が AC の全入力であることを確認してから包除する。

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
