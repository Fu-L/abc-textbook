---
title: "ABC399-G — Colorful Spanning Tree"
draft: true
authoringUnit: {"problemId":"abc399-g","docPath":"src/content/docs/problems/mathematics/outcome-test-linear-matroid-intersection-rank/outcome-test-linear-matroid-intersection-rank-shard-001/abc399-g.md","learningOutcomeIds":["outcome-test-linear-matroid-intersection-rank"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-linear-system-rank","unit-matroid-greedy","unit-randomized-algorithms"],"excludedTopics":["線形matroid交差の乱択rank判定の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-linear-matroid-intersection","tag-linear-system-rank","tag-randomized-algorithm"],"sourceRevisionIds":["source-abc399-editorial-12546-fc4c117409e2577675560e62f6e1d2eec87d7bb3a6f9dcab3241262e0c07220b","source-abc399-g-problem-64dc201e99aaace0c2f4335a95713fce174bc105a9d26e74927fd75ff7e1ef77"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"森林独立性はincidence列の線形独立、色上限はcolor別Vandermonde列のpartition matroid独立性で表せる。random diagonalを挟む行列のsymbolic rankはcommon independent rankに等しく、有限体代入では非零minorが消えない限り保持される。色区間row blockのrank N−1がtree存在と同値。Rを増やすとrankは減らないため最初の成立R以降を全て数えられる。\n\n同じpivotで新しいvectorを優先しても、古いvectorは新しいvectorとの差として消去を続けるので全体のspanは保存される。さらに古い位置のvectorで新しいvectorを消さないため、どのsuffixについてもその範囲内のvectorだけで消去が完結する。この不変量から位置≥Lのpivot数が区間rankに等しく、rank N−1を保てる最大左行端は保持位置の最小値となる。","sourceRevisionIds":["source-abc399-editorial-12546-fc4c117409e2577675560e62f6e1d2eec87d7bb3a6f9dcab3241262e0c07220b","source-abc399-g-problem-64dc201e99aaace0c2f4335a95713fce174bc105a9d26e74927fd75ff7e1ef77"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [線形matroid交差の乱択rank判定](src/content/docs/learn/combinatorics-algebra/linear-matroid-intersection.md)

- 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。

先に読む単元:

- [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md) — 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [matroid greedy](src/content/docs/learn/combinatorics-algebra/matroid-greedy.md) — Matroidの独立集合族と交換公理を定義した後、重み順greedyが最適基底を作る必要十分な構造を証明する。
- [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md) — 乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。

## 考察

色ごとの上限はpartition matroid、閉路を持たない条件はgraphic matroidである。共通独立集合の最大サイズがN−1なら、条件を満たす全域木がある。

採用する候補: 線形表現を作り、乱択した交差行列の連続行区間rankを数える。

graphic matroidの表現A_2は一頂点分を除いた向き付き接続行列。partition matroidのA_1は色cにA_c行を割り当て、その色の辺eの列を(1,e,…,e^{A_c−1})とする。色外の行は0。相異なる評価点ならVandermondeの性質で上限個数まで独立になる。A_1 diag(random) A_2^TをBと置くと、色区間[L,R]はBの連続行blockを選ぶことに対応する。

棄却する候補: 全C(C+1)/2区間で一般matroid intersectionを解き直す。

辺集合が大きく、色制約が連続行選択になる構造を使えていない。各左色から基底を作り直す方法はO(CN²ΣA)で、さらに一度の右端走査へまとめられる。

### 新しい位置を優先する基底

Bの行を上から加える。各pivotには正規化したvectorと生成位置posを持たせる。新しいvector(v,r)を左から消去するとき、同じpivotの既存位置が古ければ、vectorと位置を組ごとswapし、新しい側をpivot係数で割って正規化して残す。その後、追い出した古いvectorからそのpivot成分を消して次の列へ進む。空pivotへ達したら正規化して格納し、0になれば追加しない。

こうすると、位置がL以上のpivotだけで行区間[L,r]のspanを表せる。左端を進めるたびに基底から削除する必要はなく、位置で使うpivotを選べばよい。例えば行(1,0)を位置1、(0,1)を位置2、(1,1)を位置3へ加えると、位置3が第一pivotを置き換え、古い行の消去結果は位置2の第二pivotに吸収される。位置≥2の二本だけで区間[2,3]もrank2と判定できる。

色Rの全行を加えた時点でrankがN−1なら、保持位置の最小値mまでを左行端にできる。色Lの開始行がm以下であるLの個数を加算する。rankが足りないRは0。右色端は順に増やし、左色境界もpointerで進めれば、O(N²ΣA)で全区間を集計できる。

乱数設定の例はp=998244353、独立2試行とし、各区間のrankは二試行の最大を使う。p>Mなので辺番号の評価点も相異なる。全体の誤り上界はC(C+1)/2·((N−1)/p)^2で、最大制約でも約1.1×10^−9。rankは真値を超えず、独立試行は見落としだけを減らす。

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

同じpivotで新しいvectorを優先しても、古いvectorは新しいvectorとの差として消去を続けるので全体のspanは保存される。さらに古い位置のvectorで新しいvectorを消さないため、どのsuffixについてもその範囲内のvectorだけで消去が完結する。この不変量から位置≥Lのpivot数が区間rankに等しく、rank N−1を保てる最大左行端は保持位置の最小値となる。

## 実装上の注意

- 有限体と乱数を十分大きくし、再現可能性が必要ならseedを固定または複数回検査する。incidence rankはN-1なので一rowを落とし、color prefix S_cのoff-by-oneを確認する。

## 復習の核

- N≤7,C≤5でedge subsetから全spanning treeを列挙し、各intervalの真値と複数seedのrank判定・最小R単調性を比較する。

## 計算量と制約

### 時間

独立試行を定数回とし、S=ΣA_c≤300。行列構築O(MS)、一行のswap付き消去O(N²)、全行O(N²S)。色境界集計O(C+S)を加え、全体O(MS+N²S)。

### 空間

O(NS+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 150; N - 1 \leq M \leq \min\left(\frac{C N (N-1)}{2}, 5 \times 10^5\right); 1 \leq C \leq 300; 1 \leq A_i \leq N-1; \sum_{i=1}^C A_i \leq 300; 1 \leq u_i < v_i \leq N; 1 \leq c_i \leq C; If i \neq j, then (u_i, v_i, c_i) \neq (u_j, v_j, c_j); The given graph is connected.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/editorial/12546) — source-abc399-editorial-12546-fc4c117409e2577675560e62f6e1d2eec87d7bb3a6f9dcab3241262e0c07220b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/tasks/abc399_g) — source-abc399-g-problem-64dc201e99aaace0c2f4335a95713fce174bc105a9d26e74927fd75ff7e1ef77
