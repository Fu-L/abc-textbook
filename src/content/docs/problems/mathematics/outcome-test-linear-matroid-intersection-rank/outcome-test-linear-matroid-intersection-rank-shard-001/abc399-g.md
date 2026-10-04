---
title: "ABC399-G — Colorful Spanning Tree"
draft: true
authoringUnit: {"problemId":"abc399-g","docPath":"src/content/docs/problems/mathematics/outcome-test-linear-matroid-intersection-rank/outcome-test-linear-matroid-intersection-rank-shard-001/abc399-g.md","learningOutcomeIds":["outcome-test-linear-matroid-intersection-rank"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-linear-system-rank","unit-matroid-greedy","unit-randomized-algorithms"],"excludedTopics":["線形matroid交差の乱択rank判定の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-linear-matroid-intersection","tag-linear-system-rank","tag-randomized-algorithm"],"sourceRevisionIds":["source-abc399-editorial-12546-fc4c117409e2577675560e62f6e1d2eec87d7bb3a6f9dcab3241262e0c07220b","source-abc399-g-problem-64dc201e99aaace0c2f4335a95713fce174bc105a9d26e74927fd75ff7e1ef77"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"森林独立性はincidence列の線形独立、色上限はcolor別Vandermonde列のpartition matroid独立性で表せる。random diagonalを挟む行列のsymbolic rankはcommon independent rankに等しく、有限体代入では非零minorが消えない限り保持される。色区間row blockのrank N−1がtree存在と同値。Rを増やすとrankは減らないため最初の成立R以降を全て数えられる。","sourceRevisionIds":["source-abc399-editorial-12546-fc4c117409e2577675560e62f6e1d2eec87d7bb3a6f9dcab3241262e0c07220b","source-abc399-g-problem-64dc201e99aaace0c2f4335a95713fce174bc105a9d26e74927fd75ff7e1ef77"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [線形matroid交差の乱択rank判定](src/content/docs/learn/combinatorics-algebra/linear-matroid-intersection.md)

- 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。

先に読む単元:

- [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md) — 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [matroid greedy](src/content/docs/learn/combinatorics-algebra/matroid-greedy.md) — Matroidの独立集合族と交換公理を定義した後、重み順greedyが最適基底を作る必要十分な構造を証明する。
- [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md) — 乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。

## 考察

color上限はpartition matroid、cycleを含まないedge集合はgraphic matroidであり、colorful spanning tree存在は両matroidのcommon independent set rankがN-1かに等しい。

両matroidを有限体上の線形表現A_1,A_2へ写すと、random diagonal Dを挟むM=A_1DA_2^Tのrankが高確率でintersection rankになる。color interval[L,R]はA_1の対応row blockだけを残すことに一致する。

採用する候補: partition/graphic matroidの線形表現からrandomized intersection matrixを作り、連続row区間のrank N-1可否をbasis sweepで数える

ΣA_c≤300,N≤150なので、各Lからrowを追加するGaussian basisまたはABC223H型offline basisで最小Rを求め、可否の単調性から全interval数を多項式時間で集計できる。

棄却する候補: 各(L,R)で一般matroid intersectionを独立に実行する

O(C²)区間×大きなedge集合で重く、colorが連続row blockになる線形構造を捨てている。

graphic matroidはoriented incidence columns、color cのpartition matroidはA_c行のVandermonde columnsで線形表現できる。

Schwartz–Zippelにより各edge変数へ大きな有限体の乱数を代入したrankは真のsymbolic rankを高確率で保つ。

A_1のcolor別row blockとincidence A_2からrandomized Mを構成する。各Lについてrow S_L..をcolor順にbasisへ追加しrankが初めてN-1になるRを記録し、それ以降のRを加算する。必要ならoffline sliding-basis techniqueでO(N²ΣA)へ高速化する。

## 典型の発動条件

### linear matroid intersectionのrandom rank

発動条件: 二つの線形matroidの最大common independent sizeだけが必要なとき。

A_1 diag(random) A_2^Tのrankを計算する。

### Vandermonde representation of partition matroid

発動条件: group cから高々A_c列を独立に選ばせたいとき。

color blockのA_c行へedge indexの冪を置く。

### 連続row区間rank query

発動条件: color interval制約がmatrixの連続row選択に対応するとき。

basis追加と可否単調性で最小右端を求める。

## 問題固有の要素

color容量制約とspanning-tree制約を別々に満たすedge選択が、一枚のrandom matrixのrow interval rankへ圧縮される。

別の問題へ持ち帰る視点: matroid intersectionで両matroidが線形表現できるなら、構成不要のrank判定をrandomized matrix algebraへ落とす。

## 正当性

森林独立性はincidence列の線形独立、色上限はcolor別Vandermonde列のpartition matroid独立性で表せる。random diagonalを挟む行列のsymbolic rankはcommon independent rankに等しく、有限体代入では非零minorが消えない限り保持される。色区間row blockのrank N−1がtree存在と同値。Rを増やすとrankは減らないため最初の成立R以降を全て数えられる。

## 実装上の注意

- 有限体と乱数を十分大きくし、再現可能性が必要ならseedを固定または複数回検査する。incidence rankはN-1なので一rowを落とし、color prefix S_cのoff-by-oneを確認する。

## 復習の核

- N≤7,C≤5でedge subsetから全spanning treeを列挙し、各intervalの真値と複数seedのrank判定・最小R単調性を比較する。

## 計算量と制約

### 時間

O(M·S+CN²S)を単純実装の上界とする。S=ΣA_c≤300、各左色端でrow基底を作り直す。offline基底更新ならO(MS+N²S)。

### 空間

O(NS+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 150; N - 1 \leq M \leq \min\left(\frac{C N (N-1)}{2}, 5 \times 10^5\right); 1 \leq C \leq 300; 1 \leq A_i \leq N-1; \sum_{i=1}^C A_i \leq 300; 1 \leq u_i < v_i \leq N; 1 \leq c_i \leq C; If i \neq j, then (u_i, v_i, c_i) \neq (u_j, v_j, c_j); The given graph is connected.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/editorial/12546) — source-abc399-editorial-12546-fc4c117409e2577675560e62f6e1d2eec87d7bb3a6f9dcab3241262e0c07220b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/tasks/abc399_g) — source-abc399-g-problem-64dc201e99aaace0c2f4335a95713fce174bc105a9d26e74927fd75ff7e1ef77
