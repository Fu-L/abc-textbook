---
title: "ABC253-EX — We Love Forest"
draft: true
authoringUnit: {"problemId":"abc253-ex","docPath":"src/content/docs/problems/mathematics/outcome-count-combinatorial-objects-by-determinant/outcome-count-combinatorial-objects-by-determinant-shard-001/abc253-ex.md","learningOutcomeIds":["outcome-count-combinatorial-objects-by-determinant"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-labeled-component-decomposition","unit-linear-system-rank","unit-modular-arithmetic"],"excludedTopics":["行列式による数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-determinant-counting","tag-labeled-component-decomposition","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc253-editorial-4023-366204e887abfce0e08e2692d2e2861877d7e000474c649f5be1fddbb290bf8a","source-abc253-ex-problem-403eda1a50e862876c0d2cf16a7969f8c8d764c1034b46e09454824b8ae3cabd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"森は木成分の頂点分割を一意に持ち、各成分の木数は平行辺本数を含むラプラシアン余因子の行列木定理で得られる。固定頂点を含む成分だけ選ぶ再帰で成分順の重複を除く。i辺の森では辺を全て一度ずつ選ぶ順序がi!通りなので、森数·i!/M^iがi回抽選で森になる確率になる。","sourceRevisionIds":["source-abc253-editorial-4023-366204e887abfce0e08e2692d2e2861877d7e000474c649f5be1fddbb290bf8a","source-abc253-ex-problem-403eda1a50e862876c0d2cf16a7969f8c8d764c1034b46e09454824b8ae3cabd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-combinatorial-objects-by-determinant"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、3本の辺が三角形、i=2。","procedure":["異なる2辺の3集合はいずれも木。","順序2!を掛けると6列、全抽選列は3²=9。"],"executionTarget":null,"expectedResult":"確率2/3。","verificationStatus":"not_applicable","learningUnitIds":["unit-determinant-counting"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-combinatorial-objects-by-determinant"],"prerequisiteIds":["unit-labeled-component-decomposition","unit-linear-system-rank","unit-modular-arithmetic"],"attainmentCondition":"同じ三角形でi=3では。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0。"},"answer":{"reasoningOrVerification":"三辺とも採用するとcycle、同じ辺の再抽選も辺を増やす森林列としては不適。N頂点の森は高々N−1辺。","procedure":["具体例の各状態・寄与を再計算する。","三辺とも採用するとcycle、同じ辺の再抽選も辺を増やす森林列としては不適。N頂点の森は高々N−1辺。"],"expectedResult":"0。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [行列式による数え上げ](src/content/docs/learn/combinatorics-algebra/determinant-counting.md)

- 辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [label付き連結成分分解・exponential formula](src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md)
- [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 行列式による数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

選ばれた辺が森であることは、頂点集合を互いに素な木成分へ分解できることと同値であり、各頂点部分集合上の木の個数は行列木定理で求められる。

採用する候補: 行列木定理と部分集合DP

各部分集合の全域木数を前計算し、固定頂点を含む成分を切り出す漸化式で成分順の重複なくi辺の森を数えられる。

棄却する候補: M本の辺から操作列を直接列挙

操作列はM^i通りあり、N≤14でも辺数と回数に対して指数的すぎる。

多重辺はラプラシアンの非対角成分へ本数を加えることで、行列木定理の木数に選んだ平行辺の違いまで反映できる。

部分集合Sの最小頂点など一つを固定し、その頂点を含む成分Tだけを列挙すると、同じ成分分割を並べ替えて数える重複を防げる。

全頂点部分集合Tについて多重辺ラプラシアンの余因子行列式からtree[T]を求める。固定頂点を含むTを列挙してforest[S][i]へtree[T]×forest[S\T][i-(|T|-1)]を加え、得た森の辺集合数にi!を掛けて全M^iで割る。

## 典型の発動条件

### 行列木定理

発動条件: 多重グラフの指定頂点集合上にある全域木数が必要になる。

誘導多重グラフのラプラシアン余因子の行列式を法上で計算する。

### 成分分解の部分集合DP

発動条件: 森を木成分の集合として数えたい。

固定頂点を含む木成分を一つ選び、残り頂点の森DPと結合する。

## 問題固有の要素

森の確率を操作順から直接追わず、まず順序なし辺集合を木成分へ分解して数え、最後に異なる辺の選択順i!を戻す。

別の問題へ持ち帰る視点: 小頂点数のグラフで「各連結成分に既知の数え上げ公式がある」なら、成分を部分集合DPで組み立てる。

## 正当性

森は木成分の頂点分割を一意に持ち、各成分の木数は平行辺本数を含むラプラシアン余因子の行列木定理で得られる。固定頂点を含む成分だけ選ぶ再帰で成分順の重複を除く。i辺の森では辺を全て一度ずつ選ぶ順序がi!通りなので、森数·i!/M^iがi回抽選で森になる確率になる。

## 実装上の注意

- 空集合の0辺森林を1とし、木Tの辺数は|T|-1としてDP添字を合わせる。平行辺の本数、i!、M^iの逆元を法998244353で正しく扱う。

## 復習の核

- N≤5で全操作列を列挙し、平行辺がある例、孤立頂点、i=0の基底、木数と森数の合計、i!による順序復元を確認する。

## 計算量と制約

### 時間

O(2^NN³+N3^N)。各subsetの行列式と辺数付き成分分割DP。

### 空間

O(N2^N+N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 14; N-1 \leq M \leq 500; 1 \leq u_i,v_i \leq N; u_i\neq v_i; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、3本の辺が三角形、i=2。

1. 異なる2辺の3集合はいずれも木。
2. 順序2!を掛けると6列、全抽選列は3²=9。

期待される結果: 確率2/3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ三角形でi=3では。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

三辺とも採用するとcycle、同じ辺の再抽選も辺を増やす森林列としては不適。N頂点の森は高々N−1辺。

確認結果: 0。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc253/editorial/4023) — source-abc253-editorial-4023-366204e887abfce0e08e2692d2e2861877d7e000474c649f5be1fddbb290bf8a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc253/tasks/abc253_h) — source-abc253-ex-problem-403eda1a50e862876c0d2cf16a7969f8c8d764c1034b46e09454824b8ae3cabd
