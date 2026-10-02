---
title: "ABC327-G — Many Good Tuple Problems"
draft: true
authoringUnit: {"problemId":"abc327-g","docPath":"src/content/docs/problems/mathematics/outcome-count-labeled-structures-by-components/outcome-count-labeled-structures-by-components-shard-001/abc327-g.md","learningOutcomeIds":["outcome-count-labeled-structures-by-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-combinatorial-coefficients","unit-generating-functions","unit-inclusion-exclusion","unit-modular-arithmetic"],"excludedTopics":["label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-labeled-component-decomposition","tag-bipartite-structure","tag-combinatorial-coefficients","tag-inclusion-exclusion","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc327-editorial-7557-0fcf35f1e484448d15834cb135cc88d160f0ab24b20f773c61b5421416b61648","source-abc327-g-problem-e15ba600d96ccb73f7b9a4c04dce5db974afc7a1b7f89aaccede41e988ce5d05"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"tupleの制約はunderlying graphが二部であることと同値。supportの各辺へM本のlabel付き辺を全射割当てする数をb(M,k)とすれば、同supportの多重辺を正確に復元できる。彩色二部graphからanchor成分でconnected数を抽出し、その2色交換の倍率2を除くとuncolored connected数になる。再び成分を組立て、各辺の向き2^Mを戻せば全tupleを一度数える。","sourceRevisionIds":["source-abc327-editorial-7557-0fcf35f1e484448d15834cb135cc88d160f0ab24b20f773c61b5421416b61648","source-abc327-g-problem-e15ba600d96ccb73f7b9a4c04dce5db974afc7a1b7f89aaccede41e988ce5d05"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-labeled-structures-by-components"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、M=2。","procedure":["loopは禁止、各labelのedgeは1→2か2→1。","二辺が平行でもgraphは二部。"],"executionTarget":null,"expectedResult":"2²=4tuple。","verificationStatus":"not_applicable","learningUnitIds":["unit-labeled-component-decomposition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-labeled-structures-by-components"],"prerequisiteIds":["unit-bipartite-structure","unit-combinatorial-coefficients","unit-generating-functions","unit-inclusion-exclusion","unit-modular-arithmetic"],"attainmentCondition":"孤立singletonのcolored connected数を2で割ってよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"c(1,0)=1。"},"answer":{"reasoningOrVerification":"色は黒/白の2択なのでh(1,0)=2、uncoloredは1。辺数0状態を落とすと孤立頂点を失う。","procedure":["具体例の各状態・寄与を再計算する。","色は黒/白の2択なのでh(1,0)=2、uncoloredは1。辺数0状態を落とすと孤立頂点を失う。"],"expectedResult":"c(1,0)=1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [label付き連結成分分解・exponential formula](src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md)

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md)
- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各pair(S_i,T_i)をlabel iのdirected edgeと見ると、条件を満たす0/1頂点彩色が存在することはunderlying multigraphがbipartiteであることと同値である。

bipartite multigraphにはloopがなく、各undirected labeled edgeの向きが2通りなので、原問題の答えはundirected edge-labeled bipartite multigraph数a(N,M)の2^M倍になる。

parallel edgeを1本へ潰したsupportがk-edge simple bipartite graphなら、M labeled edgeをk support edgeへsurjectiveに割り当てる通り数b(M,k)だけ元multigraphが対応する。

採用する候補: simple bipartite graphをedge数別にconnected-component DPで数え、surjection数を掛けてmultigraphへ戻す。

巨大Mはi^Mの高速冪だけへ閉じ込め、N≤30のsimple support edge上限L≤225で全計数を行える。

棄却する候補: 頂点の2-coloringを選びcross edge列を数えて全coloring数で割る。

同じdisconnected bipartite graphのvalid coloring数はcomponent数で変わり、一律な係数では重複を除けない。

棄却する候補: N^{2M}個のendpoint sequence pairを列挙してbipartite判定する。

Mが10^9で列挙不能である。

colored simple bipartite graph数はg(n,m)=Σ_{i=0}^n C(n,i)C(i(n-i),m)で、i black・n-i white間のedgeを選ぶ。

anchor頂点を含むconnected componentで分ける除原理により、colored connected数hをgから抽出し、connected uncolored bipartite graph数はh/2になる。

uncolored graph fはconnected componentをanchor付きで組み立て直し、最後にa(N,M)=Σ_k f(N,k)b(M,k)とする。

L=floor(N/2)ceil(N/2)までbinomialを前計算しg(n,m)を作る。h(n,m)=g(n,m)−Σ_{i<n,j}C(n-1,i-1)h(i,j)g(n-i,m-j)でcolored connected数を求め、c=h/2とする。f(0,0)=1から、vertex 1を含むconnected componentを選ぶ標準漸化式f(n,m)=Σ_{i=1..n,j}C(n-1,i-1)c(i,j)f(n-i,m-j)でsimple bipartite graphを数える。b(M,k)=Σ_{i=0}^k(-1)^{k-i}C(k,i)i^Mを求め、2^MΣ_{k=0}^L f(N,k)b(M,k)を出力する。

## 典型の発動条件

### multigraphのsimple support化

発動条件: parallel edgeを許すlabel付きgraphを数え、異なるedge種類数が小さいとき。

support graphとedge labelのsurjectionへ分解する。

### connected構造の除原理DP

発動条件: 全labelled構造gからconnected構造hを抽出し、再びcomponent集合を組み立てたいとき。

anchor vertexのcomponentを固定してconvolutionする。

### surjectionの包含排除

発動条件: M labeled要素をk個の箱すべてへ少なくとも1個入れるとき。

Σ(-1)^{k-i}C(k,i)i^Mで数える。

### proper coloringの重複補正

発動条件: connected bipartite graphをproper 2-coloring付きで数えたとき。

connectedならcolor swapの2通りなので2で割る。

## 問題固有の要素

Mが巨大でも、bipartite simple supportのedge種類数は最大floor(N²/4)なので、M依存はsupport edgeへのsurjectionだけに分離できる。

別の問題へ持ち帰る視点: 巨大個数の反復要素を持つ構造は、distinct supportとlabel付きmultiplicity割当へ分けると小dimension DP＋高速冪になる。

## 正当性

tupleの制約はunderlying graphが二部であることと同値。supportの各辺へM本のlabel付き辺を全射割当てする数をb(M,k)とすれば、同supportの多重辺を正確に復元できる。彩色二部graphからanchor成分でconnected数を抽出し、その2色交換の倍率2を除くとuncolored connected数になる。再び成分を組立て、各辺の向き2^Mを戻せば全tupleを一度数える。

## 実装上の注意

- singleton zero-edge componentではh(1,0)=2、c(1,0)=1となるため、m=0をDP tableから落とさない。
- fのcomponent recurrenceはvertex 1を含むconnected componentを一意に選び、binomial係数とi,n-iの向きを揃える。
- M≥1なのでb(M,0)=0とし、包含排除の負値とinv2をmod 998244353で正規化する。

## 復習の核

- N=3,m=0でempty graphがf=1になるcomponent recurrenceと、1本edge supportへM labeled parallel edgeを割り当てるb(M,1)=1を確認する。

## 計算量と制約

### 時間

O(N²E²+E² log M)を上界とする。E=⌊N²/4⌋、成分DPを辺数ごとに素朴合成する。

### 空間

O(NE)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 30; 1 \leq M \leq 10^9; N and M are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、M=2。

1. loopは禁止、各labelのedgeは1→2か2→1。
2. 二辺が平行でもgraphは二部。

期待される結果: 2²=4tuple。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

孤立singletonのcolored connected数を2で割ってよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

色は黒/白の2択なのでh(1,0)=2、uncoloredは1。辺数0状態を落とすと孤立頂点を失う。

確認結果: c(1,0)=1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc327/editorial/7557) — source-abc327-editorial-7557-0fcf35f1e484448d15834cb135cc88d160f0ab24b20f773c61b5421416b61648
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc327/tasks/abc327_g) — source-abc327-g-problem-e15ba600d96ccb73f7b9a4c04dce5db974afc7a1b7f89aaccede41e988ce5d05
