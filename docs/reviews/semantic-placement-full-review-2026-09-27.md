# Inventory起点の全問題・意味分類再査読（2026-09-27）

全868問を確認した。現行配置に修正が必要と判断したのは **6問**。うち、primaryのOutcomeが採用解法より過大なものが1問、主技能の不足が1問、supportingの誤対応・不足が5問（重複あり）。既存co-primaryを持つ59問について、現行2技能間のhomeを逆転すべきと断定したものはない。ABC459 Gには新しい主技能の追加とhome再選定を提案する。

以下の全件表に、誤りを指摘しなかった862問も含め、868問それぞれの現行P/C/S、判断、解法上の根拠を記した。「○」はこの査読で意味的不整合を認めなかったことを表し、数学的な無謬保証を意味しない。

## 対象と判断方法

- Inventoryは真とした。公式解説の再検証、Inventory自体の正誤判定は対象外。
- 対象は [final-taxonomy-build.json](../../staging/taxonomy/initial/final-taxonomy-build.json) の全placementと、`src/content/technique-inventory/` の対応する全Inventory。
- 全問についてInventoryの `reasoningPath.algorithmConnection`、`typicalTechniques` の適用内容、`prerequisiteCandidates` を読み、保持状態・変換・不変量・計算量を成立させる操作から分類を判断した。不一致候補は観察・採用/棄却案・key insightと、実装上の注意・問題固有の洞察、およびTag/Outcomeの実際の定義まで戻って再読した。
- Pは解法を支配する再利用可能な技能、Cは追加で学ぶ主技能、Sは実際に使う既習技能として評価した。コード量や出現語の数でhomeを決めていない。既存の「全件問題なし」報告を根拠に判定を引き継いでいない。
- 普通の配列操作・探索・一次元prefix/imosなど、[baseline](../../src/lib/taxonomy/final-taxonomy-baseline.ts)の前提を全てSへ列挙することは要求しない。特殊手法内部の実装基盤と、別途説明すべき独立した技能を区別した。既習前提の明示には一定の冗長性を認め、上位・下位の概念が共存するだけでは誤りとしない。
- スクリプトはデータ抽出・表の整形・全件数の照合に使用した。分類の正誤や推奨修正は、個別解法を読んで判断した。
- 本報告は指摘のみ。Inventory、分類、homeは変更していない。

## 修正すべき6問

### F1 — ABC286 G：Euler存在判定をEuler構成のOutcomeに置いている

**P：要修正。Sの連結成分管理は適切。**

非指定辺で自由に移動できる成分をDSUで縮約し、指定辺だけの多重グラフで奇数次数頂点が0個または2個かを判定する。縮約による同値性とEuler路の存在条件が核心で、具体的な辺の使用順は作らない。

現行 `outcome-construct-euler-trail-or-circuit` は、存在条件の判定に加えて **「Hierholzer法でtrail/circuitを構成する」** まで要求する。この問題の採用解法でその学習成果を得たことにはならない。Eulerという分野選択は正しく、別分野への変更ではなくOutcomeの粒度の誤りである。

**修正案：** Euler路・閉路の存在条件を扱うOutcomeを構成Outcomeから分け、それをPにする。構成OutcomeはABC227 Hなど実際に復元する問題に残す。Sの `outcome-maintain-connectivity-components` は維持する。

根拠：Inventory `/reasoningPath/candidateApproaches/0`、`/reasoningPath/algorithmConnection`、`/typicalTechniques/1`。

### F2 — ABC295 Ex：frontierを忘れる証明がsupportingに表れていない

**Pのsubset zeta変換は妥当。S：不足・粒度不適切。**

全マスの選択集合ではなく「各列が上から伸長可能か」だけを残す幅Mの状態を作り、次行の候補をprefix全1と残部の部分集合へ分解する。その多数の部分集合和をzeta sweepで高速化する。

現行Sは `outcome-enumerate-subset-state-space` のみ。bitの意味と部分集合遷移は表しているが、処理済み領域を忘れ、指数を盤面全体から境界幅へ下げる正当性を表しきれていない。これはInventoryが独立して挙げる「bitmask frontier DP」であり、zeta変換自体に含まれる技能でもない。

**修正案：** Sを `outcome-design-frontier-profile-dp` へ具体化する。必要ならsubset-stateを既習前提として併記してよいが、frontierの省略は解消する。Pはzetaを維持する。

根拠：Inventory `/reasoningPath/observations/0`、`/reasoningPath/candidateApproaches/0`、`/typicalTechniques/0`。

### F3 — ABC300 Ex：submask条件を部分集合状態DPと誤認している

**PのBostan–Moriは妥当。Sのsubset-stateは不適切。**

採用法はP/QにQ(−x)を掛け、Nの下位bitが0なら分子の偶部、1なら偶部＋奇部を残してindexを半減するもの。状態は有理母関数であり、全submaskを状態にして集合間を遷移しない。Inventoryでは全submask列挙は明示的に棄却されている。

現行Sの `outcome-enumerate-subset-state-space` が教える「各bitに意味を与えた部分集合状態間の遷移」と、係数列を作用素で圧縮するこの手法は異なる。submaskという条件があるだけでsubset DPの技能を使ったとはいえない。

**修正案：** subset-stateをSから除く。bitごとの選択制約を偶奇抽出演算へ写す工夫はBostan–Moriの拡張として明記する。必要ならその拡張用Outcomeを設けるが、通常のtight付き桁DPへ機械的に付け替えるべきでもない。漸化式の有理式化とNTTの補助は維持する。

根拠：Inventory `/reasoningPath/candidateApproaches/0`・`/1`、`/reasoningPath/algorithmConnection`、`/typicalTechniques/1`。

### F4 — ABC336 G：Euler列の計数にHierholzer構成を要求している

**PのBEST定理は妥当。SのEuler構成Outcomeは過大。**

長さ4のpatternをde Bruijnグラフの辺へ変換し、始終点の次数条件を判定し、補助辺を加えたEuler閉路をBEST定理と有向行列木定理で数える。個別のEuler路を構成することはない。

現行Sの `outcome-construct-euler-trail-or-circuit` はF1と同様に、採用解法が用いないHierholzer構成を要求する。存在条件や閉路への帰着を知ることと、辺の列を復元することは別技能である。

**修正案：** このSをEulerの存在・次数条件のOutcomeへ置換する。法計算・組合せ係数・有向行列木のSは維持する。BESTをhomeにする優先順位も維持する。

根拠：Inventory `/reasoningPath/candidateApproaches/0`、`/reasoningPath/keyInsights/0`、`/reasoningPath/algorithmConnection`。

### F5 — ABC459 G：二変数格子最適化を一変数凸最適化へ押し込めている

**Pは必要な前半の技能を表すが核心全体には不足。Sは意味不一致。**

gcdと拡張Euclidで到達可能性を判定しても、最小移動回数はまだ得られない。parityを固定した全整数解を二つの自由parameter(n,m)で表し、二つのL∞ normの和を最小化する。折れ目直線の交点で連続最小候補を作り、その周囲5×5の格子点で整数最適解を覆う証明が、探索範囲を有限にする核心である。

現行Pは `outcome-characterize-integer-solvability`、Sは有限候補列挙と `outcome-optimize-univariate-convex-function`。採用法は一変数の差分単調性・三分探索ではなく、二変数の折れ目配置と整数近傍の保証を使う。単に「凸」「連続最小点の近傍」という共通語で一変数用Outcomeに載せると、必要な証明が抜け落ちる。

**修正案：** 二変数の区分線形凸目的について、折れ目交点と近傍格子への候補縮約を説明できるOutcomeを作り、主技能として扱う。homeはこの最適化を推奨し、整数方程式parameter化を追加primaryに置く。既存の一変数Outcomeは外す。有限候補の評価はSとして維持可能。homeの選択には編集上の裁量があるが、二変数最適化を一変数Sだけで済ませる現状は修正が必要。

根拠：Inventory `/reasoningPath/candidateApproaches/0`、`/reasoningPath/keyInsights/1`、`/reasoningPath/algorithmConnection`、`/typicalTechniques/1`。

### F6 — ABC464 G：XORによる境界表現を加法prefixのOutcomeに置いている

**Pのpath matching縮約は妥当。Sのprefix分類が不適切。**

文字をbitとみなし、隣接する文字が異なるかをd_i=s_i XOR s_(i+1)で表す。一文字flipが隣接二bitの反転になることから、0のpairを作るpath matchingへ帰着する。ここで必要なのは隣接XORによる表現変換と操作の局所化である。

現行Sの `outcome-linearize-static-range-information` は区間和をprefixの差で取り出すこと、多次元prefix、端点差分による一括加算を定義している。これでは、XOR境界における反転・run数の対応を学ぶ意味を表せない。末尾にcardinality別費用のprefixを取る通常の足し算も、この問題固有の補助Tagを正当化しない。

**修正案：** このSを外し、XOR境界表現の変換を問題固有の洞察として明記するか、操作を境界差分へ局所化するOutcomeを別に設ける。heapと双方向linkは現PのOutcomeに明記されており、Sにないことだけで欠落とは判定しない。matching縮約の交換論証に対するgreedyのSは維持可能。

根拠：Inventory `/reasoningPath/observations/0`、`/reasoningPath/keyInsights/0`・`/1`、`/typicalTechniques/0`。現placementもこのtypicalTechniques/0をprefixのsupportingへ結び付けている。

## 再読して誤りとしなかった境界事例

- **ABC253 F・ABC464 E：** `reverse-update-time` は逆走査だけでなくlast-write時刻による静的化も定義に含む。実際に時刻を逆転しないことだけでは誤りにならない。
- **ABC429 F・ABC456 F：** 半環遷移Outcomeは二分累乗に加えて区間積も含む。min-plusの区間積やSWAGでも意味は一致する。
- **ABC456 G：** `implementationConcerns/0` が「積の0因子やmod逆元更新を安全に扱う」と明記している。algorithmConnectionの積形成だけを見ると動的差替えのSは過剰に見えるが、Inventory全体には根拠があるため現配置を維持する。
- **ABC449 G：** algorithmConnectionには微分漸化式・FPS pow・畳み込み二分累乗の選択肢がある一方、採用案にFPSが明記されている。その枝ではGFをP、FPSをCとする現配置は成立する。微分漸化式の枝を採用解説に選ぶならCも変更すべきだが、現時点でFPSを誤分類とは断定しない。
- **ABC272 Ex：** EGFによる対角化は重要でCが適切。制約規模で必要な積多項式の一括評価を主題に多点評価へhomeを置く選択にも意味があり、GFへ逆転しなければ誤りとはしない。
- **ABC296 Ex・ABC379 G：** frontier自体と状態の十分性に重なりはある。既習技能として状態圧縮を明示することは誤った手法の追加ではないため、重複だけを理由に削除を要求しない。
- **ABC260 E：** 長さ軸imosは使うが、通常の一次元差分集計はbaselineに含まれる。Sへの追加を必須にはしない。

## 全868問の判定

P＝semantic primary、C＝追加primary。判定欄は **P / Cのhome優先順位 / S** の順。○＝整合、×＝修正が必要、△＝技能自体は正しいが主技能として不足、—＝Cなし。各問題名から査読元Inventoryを開ける。Outcome IDは共通接頭辞 `outcome-` を省略した。Cを持つ問題の○は、列挙した現行Pをhomeに置く判断を承認するもの。

| 問題 | 現行P | 現行C | 現行S | 判定 P/C/S | 解法からの判断 |
|---|---|---|---|---|---|
| [ABC212-E](../../src/content/technique-inventory/shard-04/abc212-e.json) | `subtract-exception-transitions` | — | — | ○ / — / ○ | 総和から自己・禁止辺だけを引く遷移圧縮が核心。 |
| [ABC212-F](../../src/content/technique-inventory/shard-00/abc212-f.json) | `jump-deterministic-transition` | — | — | ○ / — / ○ | 後継バスの反復合成が核心。lower_boundは配列検索の基礎。 |
| [ABC212-G](../../src/content/technique-inventory/shard-01/abc212-g.json) | `count-through-cyclic-exponents` | — | `decompose-by-prime-or-divisor`<br>`invert-divisor-lattice-by-mobius`<br>`reduce-integer-structure-by-gcd` | ○ / — / ○ | 巡回群の指数化でgcd別計数へ帰着し、約数反転が補助。 |
| [ABC212-H](../../src/content/technique-inventory/shard-04/abc212-h.json) | `factor-separable-linear-transform` | — | `classify-game-states`<br>`compute-in-modular-arithmetic` | ○ / — / ○ | XOR変換が列長全体の畳み込みを対角化。Nimと法計算が補助。 |
| [ABC213-E](../../src/content/technique-inventory/shard-00/abc213-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | 盤面履歴を0/1辺へ圧縮する最短路モデル。 |
| [ABC213-F](../../src/content/technique-inventory/shard-01/abc213-f.json) | `build-suffix-lcp-index` | — | `prune-dominated-candidates-once` | ○ / — / ○ | 接尾辞順位間のLCP最小値への変換が核心、単調スタックが総和を実現。 |
| [ABC213-G](../../src/content/technique-inventory/shard-00/abc213-g.json) | `count-labeled-structures-by-components` | — | `enumerate-subset-state-space` | ○ / — / ○ | 基準頂点の連結成分による一意分解が核心、部分集合列挙が補助。 |
| [ABC213-H](../../src/content/technique-inventory/shard-01/abc213-h.json) | `compute-online-relaxed-convolution` | — | `divide-search-space-recursively` | ○ / — / ○ | 因果順を守るオンライン畳み込みが核心。block NTTは当該手法の実装基盤に含まれる。 |
| [ABC214-E](../../src/content/technique-inventory/shard-00/abc214-e.json) | `prove-greedy-order` | — | `enumerate-frontier-best-first`<br>`linearize-events` | ○ / — / ○ | 最早締切の交換法が核心、候補heapとイベント走査が補助。 |
| [ABC214-F](../../src/content/technique-inventory/shard-02/abc214-f.json) | `design-order-preserving-dp` | — | `factor-and-accelerate-transitions` | ○ / — / ○ | 直前同文字位置で重複を排除する部分列DP、区間和が加速。 |
| [ABC214-G](../../src/content/technique-inventory/shard-00/abc214-g.json) | `correct-overlap-by-inversion` | — | `encode-counting-by-generating-function`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 禁止配置の包除が核心、次数2成分多項式と階乗が交差項を計算。 |
| [ABC214-H](../../src/content/technique-inventory/shard-05/abc214-h.json) | `model-min-cost-flow` | `condense-and-order-directed-graph` | — | ○ / ○ / ○ | SCCでDAG化した上で共有報酬を容量と費用へ写す。homeは最小費用流。 |
| [ABC215-E](../../src/content/technique-inventory/shard-02/abc215-e.json) | `design-minimal-sufficient-state` | — | `enumerate-subset-state-space` | ○ / — / ○ | 使用済み集合と末尾文字が十分状態。部分集合表現が補助。 |
| [ABC215-F](../../src/content/technique-inventory/shard-02/abc215-f.json) | `prove-and-search-threshold` | — | `maintain-monotone-window` | ○ / — / ○ | 距離閾値の単調判定が核心、候補集合を二ポインタで管理。 |
| [ABC215-G](../../src/content/technique-inventory/shard-02/abc215-g.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 色ごとの出現確率への寄与分解が核心。二項係数と法除算が補助。 |
| [ABC215-H](../../src/content/technique-inventory/shard-01/abc215-h.json) | `characterize-bipartite-feasibility-by-hall` | — | `apply-subset-zeta-mobius-transform` | ○ / — / ○ | Hall余裕が最小破壊数を決め、集合変換が計数を実現。 |
| [ABC216-E](../../src/content/technique-inventory/shard-00/abc216-e.json) | `allocate-by-convex-marginal-costs` | — | `evaluate-compressed-integer-blocks`<br>`prove-and-search-threshold` | ○ / — / ○ | 減少限界利益から上位K項を選ぶ。閾値探索と級数集計が補助。 |
| [ABC216-F](../../src/content/technique-inventory/shard-02/abc216-f.json) | `design-resource-dp` | — | `reorder-counting-contributions` | ○ / — / ○ | B和ナップサックに最大Aの証人固定を組み合わせる。 |
| [ABC216-G](../../src/content/technique-inventory/shard-04/abc216-g.json) | `solve-difference-constraints` | — | `linearize-static-range-information` | ○ / — / ○ | prefix差の不等式を最短距離へ写す。prefix表現が補助。 |
| [ABC216-H](../../src/content/technique-inventory/shard-05/abc216-h.json) | `count-nonintersecting-paths-by-lgv` | — | `compute-in-modular-arithmetic`<br>`enumerate-subset-state-space`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 非交差路のLGV行列式が核心。符号付きsubset展開と二項係数が補助。 |
| [ABC217-E](../../src/content/technique-inventory/shard-01/abc217-e.json) | `bound-monotone-total-work` | — | `enumerate-frontier-best-first` | ○ / — / ○ | 未整列queueからheapへの一方向移動により総移動数を抑える。 |
| [ABC217-F](../../src/content/technique-inventory/shard-05/abc217-f.json) | `design-interval-split-dp` | — | `formulate-combinatorial-coefficients` | ○ / — / ○ | 左端の相手による区間分割と、独立操作順の二項係数。 |
| [ABC217-G](../../src/content/technique-inventory/shard-03/abc217-g.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 配置詳細に依らない禁止群数により人数・群数だけへ状態圧縮。 |
| [ABC217-H](../../src/content/technique-inventory/shard-02/abc217-h.json) | `maintain-piecewise-linear-convex-function` | — | — | ○ / — / ○ | 凸DPの区間min更新とhinge追加をSlope Trickで表現。 |
| [ABC218-E](../../src/content/technique-inventory/shard-01/abc218-e.json) | `construct-optimal-spanning-tree` | — | `maintain-connectivity-components` | ○ / — / ○ | 負辺を残して正辺をKruskal選択。DSUが補助。 |
| [ABC218-F](../../src/content/technique-inventory/shard-05/abc218-f.json) | `localize-change-impact-by-witness` | `build-shortest-path-certificate` | `model-and-compute-shortest-path` | ○ / ○ / ○ | 固定した最短路証人により再計算する削除辺を限定。証人復元がco-primary。 |
| [ABC218-G](../../src/content/technique-inventory/shard-04/abc218-g.json) | `rollback-reversible-updates` | — | `evaluate-adversarial-game-value`<br>`maintain-ordered-set-statistics` | ○ / — / ○ | DFS入退場で経路状態を復元し、動的中央値とminimaxを組み合わせる。 |
| [ABC218-H](../../src/content/technique-inventory/shard-04/abc218-h.json) | `optimize-path-matching-by-contraction` | — | `enumerate-frontier-best-first`<br>`maintain-local-sequence-links`<br>`normalize-equivalent-states` | ○ / — / ○ | 隣接非選択の局所縮約が核心。heap・隣接リンク・色反転が補助。 |
| [ABC219-E](../../src/content/technique-inventory/shard-01/abc219-e.json) | `enumerate-bounded-candidates-or-cases` | — | — | ○ / — / ○ | 固定16セルの候補全探索。連結・外枠flood fillは基礎探索。 |
| [ABC219-F](../../src/content/technique-inventory/shard-05/abc219-f.json) | `normalize-equivalent-states` | — | — | ○ / — / ○ | 平行移動orbitを正規化して一次元区間和集合へ落とす。 |
| [ABC219-G](../../src/content/technique-inventory/shard-00/abc219-g.json) | `balance-heavy-light-threshold` | — | — | ○ / — / ○ | 次数別push/lazyの計算量バランスが核心。 |
| [ABC219-H](../../src/content/technique-inventory/shard-04/abc219-h.json) | `design-interval-expansion-dp` | — | `reorder-counting-contributions` | ○ / — / ○ | 訪問済み区間の両端拡張DP。未到着数で移動費を課金。 |
| [ABC220-E](../../src/content/technique-inventory/shard-00/abc220-e.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic`<br>`count-implicit-binary-tree-layers` | ○ / — / ○ | LCAと深さで対を一意分類。完全二分木の層数え上げが補助。 |
| [ABC220-F](../../src/content/technique-inventory/shard-00/abc220-f.json) | `reroot-tree-aggregation` | — | — | ○ / — / ○ | 根移動で距離総和がN-2subだけ変わる全方位DP。 |
| [ABC220-G](../../src/content/technique-inventory/shard-04/abc220-g.json) | `reduce-geometry-to-algebraic-predicates` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 垂直二等分線の整数不変量で点対を分類。点対列挙が補助。 |
| [ABC220-H](../../src/content/technique-inventory/shard-05/abc220-h.json) | `split-enumeration-space` | — | `factor-separable-linear-transform` | ○ / — / ○ | 左右集合の交差parityを半分全列挙し、WHTで内積符号和を求める。 |
| [ABC221-E](../../src/content/technique-inventory/shard-03/abc221-e.json) | `maintain-weighted-prefix-statistics` | — | `compress-sparse-keys`<br>`compute-in-modular-arithmetic`<br>`reorder-counting-contributions` | ○ / — / ○ | 端点寄与を逆冪で因数分解し、値prefixの重み和をBITで取得。 |
| [ABC221-F](../../src/content/technique-inventory/shard-01/abc221-f.json) | `use-tree-diameter-extrema` | — | `reorder-counting-contributions` | ○ / — / ○ | 直径中心が等距離集合を制約し、branchごとの独立選択を数える。 |
| [ABC221-G](../../src/content/technique-inventory/shard-04/abc221-g.json) | `accelerate-set-operations-with-bitsets` | — | `recover-valid-witness`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 座標変換後の二つの部分和をbitsetで計算し、採否を復元。 |
| [ABC221-H](../../src/content/technique-inventory/shard-02/abc221-h.json) | `factor-and-accelerate-transitions` | — | `design-grid-table-dp` | ○ / — / ○ | 差分列の重み付き分割DPを二方向の累積和で高速化。 |
| [ABC222-E](../../src/content/technique-inventory/shard-03/abc222-e.json) | `design-resource-dp` | — | `reorder-counting-contributions` | ○ / — / ○ | 辺使用回数の符号割当を部分和DPへ写す。 |
| [ABC222-F](../../src/content/technique-inventory/shard-03/abc222-f.json) | `use-tree-diameter-extrema` | — | — | ○ / — / ○ | 頂点報酬を補助葉へ移して直径両端の最遠点性質を利用。 |
| [ABC222-G](../../src/content/technique-inventory/shard-04/abc222-g.json) | `find-period-by-multiplicative-order` | — | `decompose-by-prime-or-divisor`<br>`reduce-integer-structure-by-gcd` | ○ / — / ○ | repdigit可除性を乗法的位数へ写し、gcd簡約と約数候補を利用。 |
| [ABC222-H](../../src/content/technique-inventory/shard-01/abc222-h.json) | `invert-generating-function-equation` | `derive-coefficient-recurrence-by-differentiation` | `compute-in-modular-arithmetic` | ○ / ○ / ○ | 暗黙母関数からの反転公式が主、微分恒等式の係数漸化式が追加主技能。 |
| [ABC223-E](../../src/content/technique-inventory/shard-00/abc223-e.json) | `reduce-geometry-to-algebraic-predicates` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 配置分離を有限な帯分割の寸法判定へ落とす。 |
| [ABC223-F](../../src/content/technique-inventory/shard-04/abc223-f.json) | `design-associative-range-summary` | — | — | ○ / — / ○ | 括弧列のsumとminPrefixの非可換結合が核心。 |
| [ABC223-G](../../src/content/technique-inventory/shard-02/abc223-g.json) | `reroot-tree-aggregation` | — | — | ○ / — / ○ | 有向辺側の白黒状態をrerootし全根の未使用性を判定。葉側matching貪欲はこの状態の正当性を支える。 |
| [ABC223-H](../../src/content/technique-inventory/shard-00/abc223-h.json) | `maintain-xor-linear-basis` | — | `linearize-events` | ○ / — / ○ | 最新添字付きXOR基底でsuffix spanを保持、右端sweepが補助。 |
| [ABC224-E](../../src/content/technique-inventory/shard-04/abc224-e.json) | `compress-dp-sufficient-aggregates` | — | `linearize-events`<br>`process-dag-in-topological-order` | ○ / — / ○ | 行列別最大値でDAG遷移を圧縮、同値batchと順序が補助。 |
| [ABC224-F](../../src/content/technique-inventory/shard-05/abc224-f.json) | `compress-dp-sufficient-aggregates` | — | `reorder-counting-contributions` | ○ / — / ○ | 個数・末尾総和・式総和で分岐をまとめ、寄与分解を使う。 |
| [ABC224-G](../../src/content/technique-inventory/shard-01/abc224-g.json) | `optimize-univariate-convex-function` | — | — | ○ / — / ○ | 閾値方策を一次元凸目的へ圧縮し連続最適値近傍を比較。 |
| [ABC224-H](../../src/content/technique-inventory/shard-05/abc224-h.json) | `model-min-cost-flow` | — | — | ○ / — / ○ | 双対整数割当を任意流量の費用流で実現。 |
| [ABC225-E](../../src/content/technique-inventory/shard-04/abc225-e.json) | `prove-greedy-order` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 偏角区間に写した後の終了時刻順交換法が核心。 |
| [ABC225-F](../../src/content/technique-inventory/shard-03/abc225-f.json) | `prove-greedy-order` | — | `design-order-preserving-dp` | ○ / — / ○ | 連結比較の交換法で標準順を作り、枚数制約は選択DP。 |
| [ABC225-G](../../src/content/technique-inventory/shard-01/abc225-g.json) | `model-max-flow-min-cut` | — | — | ○ / — / ○ | 斜線run開始の局所罰金を有向cut容量へ写す。 |
| [ABC225-H](../../src/content/technique-inventory/shard-04/abc225-h.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `formulate-combinatorial-coefficients` | ○ / ○ / ○ | 区間人数別の係数設計が主、次数制限NTT積が追加主技能。 |
| [ABC226-E](../../src/content/technique-inventory/shard-00/abc226-e.json) | `peel-graph-core` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 成分E=Vのcycle rank判定は現行coreタグの定義に含まれる。 |
| [ABC226-F](../../src/content/technique-inventory/shard-04/abc226-f.json) | `formulate-combinatorial-coefficients` | — | `compute-in-modular-arithmetic`<br>`enumerate-bounded-candidates-or-cases` | ○ / — / ○ | cycle typeごとの順列数が核心、整数分割列挙と法累乗が補助。 |
| [ABC226-G](../../src/content/technique-inventory/shard-03/abc226-g.json) | `prove-greedy-order` | — | — | ○ / — / ○ | 残余容量の断片化を防ぐbucket順を交換法で証明。 |
| [ABC226-H](../../src/content/technique-inventory/shard-03/abc226-h.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 成功個数分布を区分多項式として伝播しtail確率を積分。 |
| [ABC227-E](../../src/content/technique-inventory/shard-02/abc227-e.json) | `design-minimal-sufficient-state` | — | `prove-greedy-order` | ○ / — / ○ | 使用個数で残列が決まるDP。左端出現を選ぶ貪欲が補助。 |
| [ABC227-F](../../src/content/technique-inventory/shard-05/abc227-f.json) | `enumerate-bounded-candidates-or-cases` | — | `design-grid-table-dp` | ○ / — / ○ | K番目の値固定が経路の非加法目的をexact-k grid DPへ変える。 |
| [ABC227-G](../../src/content/technique-inventory/shard-02/abc227-g.json) | `decompose-by-prime-or-divisor` | — | — | ○ / — / ○ | 二項係数を素因数指数差に変え、区間篩で回収。 |
| [ABC227-H](../../src/content/technique-inventory/shard-02/abc227-h.json) | `model-max-flow-min-cut` | `construct-euler-trail-or-circuit` | `enumerate-bounded-candidates-or-cases` | ○ / ○ / ○ | 次数実現をflowで解くのが主、Euler復元が追加主技能、連結tree列挙が補助。 |
| [ABC228-E](../../src/content/technique-inventory/shard-04/abc228-e.json) | `exploit-modular-periodicity` | `compute-in-modular-arithmetic` | — | ○ / ○ / ○ | 指数周期の簡約を主とし、二重の法累乗を追加主技能とする。 |
| [ABC228-F](../../src/content/technique-inventory/shard-01/abc228-f.json) | `prune-dominated-candidates-once` | — | `linearize-static-range-information` | ○ / — / ○ | 二方向の単調dequeで矩形最大値、矩形和が補助。 |
| [ABC228-G](../../src/content/technique-inventory/shard-05/abc228-g.json) | `determinize-automaton-by-subsets` | `run-dp-on-finite-automaton` | `enumerate-subset-state-space` | ○ / ○ / ○ | 到達集合による決定化が主、決定的状態上の数え上げDPが追加主技能。 |
| [ABC228-H](../../src/content/technique-inventory/shard-01/abc228-h.json) | `optimize-by-line-envelope` | — | `design-prefix-partition-dp`<br>`prove-greedy-order` | ○ / — / ○ | 分割DPを直線最小化へ変形、交換法が連続群の正規形を保証。 |
| [ABC229-E](../../src/content/technique-inventory/shard-02/abc229-e.json) | `reverse-update-time` | — | `maintain-connectivity-components` | ○ / — / ○ | 削除の逆再生でDSU追加問題へ変換。 |
| [ABC229-F](../../src/content/technique-inventory/shard-04/abc229-f.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 環を切った先頭色と直前色が十分状態。 |
| [ABC229-G](../../src/content/technique-inventory/shard-04/abc229-g.json) | `prove-and-search-threshold` | — | `optimize-univariate-convex-function` | ○ / — / ○ | 順位補正後の中央値費用で長さの単調判定。 |
| [ABC229-H](../../src/content/technique-inventory/shard-05/abc229-h.json) | `add-conway-number-games` | — | — | ○ / — / ○ | partisan gameの二進有理数評価を直和で合成。 |
| [ABC230-E](../../src/content/technique-inventory/shard-04/abc230-e.json) | `partition-integer-parameter-ranges` | — | — | ○ / — / ○ | floor商が同一の整数区間へ集約。 |
| [ABC230-F](../../src/content/technique-inventory/shard-02/abc230-f.json) | `design-prefix-partition-dp` | — | — | ○ / — / ○ | 切れ目の正規形からprefix分割DPと最新重複境界を作る。 |
| [ABC230-G](../../src/content/technique-inventory/shard-04/abc230-g.json) | `invert-divisor-lattice-by-mobius` | — | `decompose-by-prime-or-divisor` | ○ / — / ○ | 二つのgcd条件のMöbius展開、square-free約数列挙が補助。 |
| [ABC230-H](../../src/content/technique-inventory/shard-03/abc230-h.json) | `derive-coefficient-recurrence-by-differentiation` | `compute-online-relaxed-convolution` | `divide-search-space-recursively` | ○ / ○ / ○ | 母関数微分で係数漸化式を作るのが主、因果畳み込みが追加主技能。 |
| [ABC231-E](../../src/content/technique-inventory/shard-05/abc231-e.json) | `design-carry-or-mixed-radix-dp` | — | — | ○ / — / ○ | 整除鎖の端数を払う・繰り上げる二択DP。 |
| [ABC231-F](../../src/content/technique-inventory/shard-05/abc231-f.json) | `linearize-events` | — | `compress-sparse-keys`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | 二次元dominanceを座標sweepし、圧縮BITで残る不等式を集計。 |
| [ABC231-G](../../src/content/technique-inventory/shard-04/abc231-g.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic`<br>`encode-counting-by-generating-function` | ○ / — / ○ | 積の期待値を単項式寄与へ分け、基本対称式を生成多項式で計算。 |
| [ABC231-H](../../src/content/technique-inventory/shard-05/abc231-h.json) | `model-min-cost-flow` | — | — | ○ / — / ○ | 辺被覆の差分利益を任意流量の費用matchingへ写す。 |
| [ABC232-E](../../src/content/technique-inventory/shard-04/abc232-e.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 終点との行列一致で遷移同値な四状態へ圧縮。 |
| [ABC232-F](../../src/content/technique-inventory/shard-04/abc232-f.json) | `enumerate-subset-state-space` | — | — | ○ / — / ○ | 使用集合で対応先と確定転倒費用が決まるsubset DP。 |
| [ABC232-G](../../src/content/technique-inventory/shard-00/abc232-g.json) | `model-and-compute-shortest-path` | — | `compress-sparse-keys` | ○ / — / ○ | 円周補助座標で密な辺を共有し非負最短路。 |
| [ABC232-H](../../src/content/technique-inventory/shard-00/abc232-h.json) | `recover-valid-witness` | — | `normalize-equivalent-states` | ○ / — / ○ | 境界を剥がす帰納構成、対称変換が補助。 |
| [ABC233-E](../../src/content/technique-inventory/shard-04/abc233-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 各出力桁への寄与をprefix digit sumにまとめる。 |
| [ABC233-EX](../../src/content/technique-inventory/shard-02/abc233-ex.json) | `share-threshold-checks-by-parallel-binary-search` | — | `linearize-events`<br>`linearize-static-range-information`<br>`maintain-weighted-prefix-statistics`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 距離判定の並列二分探索に回転座標・矩形prefix・BIT sweepを組み合わせる。 |
| [ABC233-F](../../src/content/technique-inventory/shard-01/abc233-f.json) | `recover-valid-witness` | — | `maintain-connectivity-components` | ○ / — / ○ | 木の葉を目標駒で固定する構成、DSUが実現可能性を判定。 |
| [ABC233-G](../../src/content/technique-inventory/shard-05/abc233-g.json) | `design-interval-split-dp` | — | `linearize-static-range-information` | ○ / — / ○ | 四境界の区間分割DP、累積和で空領域を判定。 |
| [ABC234-E](../../src/content/technique-inventory/shard-05/abc234-e.json) | `enumerate-bounded-candidates-or-cases` | — | — | ○ / — / ○ | 桁数・初項・公差で全候補を有限化。 |
| [ABC234-EX](../../src/content/technique-inventory/shard-01/abc234-ex.json) | `reduce-geometry-to-algebraic-predicates` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 空間hashの局所化と出力依存の候補数評価。現行幾何Outcomeは局所座標判定を包含。 |
| [ABC234-F](../../src/content/technique-inventory/shard-02/abc234-f.json) | `formulate-combinatorial-coefficients` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 同一文字の挿入位置の二項係数でmultiset列を数える。 |
| [ABC234-G](../../src/content/technique-inventory/shard-04/abc234-g.json) | `prune-dominated-candidates-once` | — | `design-prefix-partition-dp` | ○ / — / ○ | 分割DPの区間極値和を重み付き単調stackで更新。 |
| [ABC235-E](../../src/content/technique-inventory/shard-05/abc235-e.json) | `sweep-connectivity-by-kruskal-threshold` | — | `linearize-events`<br>`maintain-connectivity-components` | ○ / — / ○ | Kruskalの閾値連結性を独立queryへ切り出しDSU sweep。 |
| [ABC235-EX](../../src/content/technique-inventory/shard-04/abc235-ex.json) | `build-component-merge-tree` | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | ○ / ○ / ○ | 閾値成分階層のreconstruction treeが主、操作数多項式が追加主技能。 |
| [ABC235-F](../../src/content/technique-inventory/shard-03/abc235-f.json) | `count-prefix-constrained-objects` | — | — | ○ / — / ○ | tight・started・使用数字集合の桁DP。 |
| [ABC235-G](../../src/content/technique-inventory/shard-01/abc235-g.json) | `correct-overlap-by-inversion` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients`<br>`slide-transition-recurrence` | ○ / — / ○ | 空庭包除と打切り二項和の境界差分更新。 |
| [ABC236-E](../../src/content/technique-inventory/shard-01/abc236-e.json) | `optimize-ratio-by-parametric-search` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 平均・中央値を加重和判定へ変形、二状態選択DPが補助。 |
| [ABC236-EX](../../src/content/technique-inventory/shard-03/abc236-ex.json) | `correct-overlap-by-inversion` | — | `count-labeled-structures-by-components` | ○ / — / ○ | 等値事象の包除を集合分割・連結成分係数へまとめる。 |
| [ABC236-F](../../src/content/technique-inventory/shard-04/abc236-f.json) | `optimize-weighted-matroid-basis` | — | `maintain-xor-linear-basis` | ○ / — / ○ | 線形matroidの重み順独立選択、XOR基底がoracle。 |
| [ABC236-G](../../src/content/technique-inventory/shard-03/abc236-g.json) | `exponentiate-transition-over-semiring` | — | — | ○ / — / ○ | min-max半環の行列累乗で固定長bottleneck路。 |
| [ABC237-E](../../src/content/technique-inventory/shard-04/abc237-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | 標高potentialで辺を非負化してDijkstra。 |
| [ABC237-EX](../../src/content/technique-inventory/shard-03/abc237-ex.json) | `optimize-poset-antichain-by-dilworth` | — | `solve-bipartite-matching` | ○ / — / ○ | 包含半順序の最大反鎖をDilworthでmatchingへ帰着。 |
| [ABC237-F](../../src/content/technique-inventory/shard-01/abc237-f.json) | `design-minimal-sufficient-state` | — | `design-lis-frontier` | ○ / — / ○ | LIS tailsを数え上げの十分状態に転用。 |
| [ABC237-G](../../src/content/technique-inventory/shard-01/abc237-g.json) | `design-range-update-action` | — | — | ○ / — / ○ | 閾値01化したrange sortを区間和・区間代入にする。 |
| [ABC238-E](../../src/content/technique-inventory/shard-02/abc238-e.json) | `maintain-connectivity-components` | — | `linearize-static-range-information` | ○ / — / ○ | prefix差が既知になる条件を端点連結性へ写す。 |
| [ABC238-EX](../../src/content/technique-inventory/shard-04/abc238-ex.json) | `reverse-update-time` | — | `compute-in-modular-arithmetic`<br>`design-interval-split-dp`<br>`formulate-combinatorial-coefficients`<br>`reorder-counting-contributions` | ○ / — / ○ | 削除を逆転して区間分割、操作混合数と費用総和を計算。 |
| [ABC238-F](../../src/content/technique-inventory/shard-04/abc238-f.json) | `design-order-preserving-dp` | — | — | ○ / — / ○ | 一順位で整列し未選択者の最小順位だけを残す。 |
| [ABC238-G](../../src/content/technique-inventory/shard-00/abc238-g.json) | `compare-algebraic-objects-by-random-fingerprint` | — | `decompose-by-prime-or-divisor` | ○ / — / ○ | 素因数指数mod3の状態を乱択符号化してprefix等値判定。 |
| [ABC239-E](../../src/content/technique-inventory/shard-02/abc239-e.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | 各部分木の上位20だけをbottom-upで併合。 |
| [ABC239-EX](../../src/content/technique-inventory/shard-02/abc239-ex.json) | `partition-integer-parameter-ranges` | — | `compute-in-modular-arithmetic`<br>`solve-stochastic-recurrence` | ○ / — / ○ | floor商ごとの遷移集約と自己ループを解いた期待値再帰。 |
| [ABC239-F](../../src/content/technique-inventory/shard-01/abc239-f.json) | `recover-valid-witness` | — | `maintain-connectivity-components` | ○ / — / ○ | 成分stubの木次数列を葉から構成しDSUで成分管理。 |
| [ABC239-G](../../src/content/technique-inventory/shard-04/abc239-g.json) | `model-max-flow-min-cut` | — | — | ○ / — / ○ | 頂点分割cutを残余到達性から復元。cut復元は当該技能内。 |
| [ABC240-E](../../src/content/technique-inventory/shard-04/abc240-e.json) | `flatten-tree-by-euler-order` | — | `recover-valid-witness` | ○ / — / ○ | DFS葉順で部分木を連続区間化し最小幅を構成。 |
| [ABC240-EX](../../src/content/technique-inventory/shard-03/abc240-ex.json) | `aggregate-subsequence-transitions-by-value` | — | `design-associative-range-summary`<br>`enumerate-bounded-candidates-or-cases`<br>`index-shared-prefixes-with-trie`<br>`linearize-events`<br>`prove-greedy-order` | ○ / — / ○ | 辞書順候補のLIS型DP、長さ制限の交換法・trie・sweep・range maxが補助。 |
| [ABC240-F](../../src/content/technique-inventory/shard-05/abc240-f.json) | `evaluate-compressed-integer-blocks` | — | `optimize-univariate-convex-function` | ○ / — / ○ | 圧縮runの二重累積を閉形式化し離散凹の極値を評価。 |
| [ABC240-G](../../src/content/technique-inventory/shard-04/abc240-g.json) | `formulate-combinatorial-coefficients` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 座標回転で独立walkにし二項係数で時刻を混合。 |
| [ABC241-E](../../src/content/technique-inventory/shard-05/abc241-e.json) | `decompose-functional-graph` | — | — | ○ / — / ○ | 剰余状態のtail/cycle分解と周期gain。 |
| [ABC241-EX](../../src/content/technique-inventory/shard-02/abc241-ex.json) | `encode-counting-by-generating-function` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 有限幾何級数の母関数と部分分数が核心。分子のsubset展開は係数式の評価、巨大冪の法計算が補助。 |
| [ABC241-F](../../src/content/technique-inventory/shard-02/abc241-f.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 停止候補だけの状態graph BFS。静的lower_boundは基礎。 |
| [ABC241-G](../../src/content/technique-inventory/shard-05/abc241-g.json) | `model-max-flow-min-cut` | — | — | ○ / — / ○ | 試合の勝者割当と勝数上限を容量flowへ写す。 |
| [ABC242-E](../../src/content/technique-inventory/shard-03/abc242-e.json) | `count-symmetric-strings-under-lex-bound` | — | — | ○ / — / ○ | 回文の自由半分の基数値と境界候補で計数。 |
| [ABC242-EX](../../src/content/technique-inventory/shard-04/abc242-ex.json) | `solve-stochastic-recurrence` | — | `compute-in-modular-arithmetic`<br>`design-order-preserving-dp`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 新種類数ごとの滞在期待を主に、区間union DPで被覆確率を計算。 |
| [ABC242-F](../../src/content/technique-inventory/shard-01/abc242-f.json) | `correct-overlap-by-inversion` | — | `formulate-combinatorial-coefficients` | ○ / — / ○ | 使用行列supportを固定し空行空列を包除。 |
| [ABC242-G](../../src/content/technique-inventory/shard-05/abc242-g.json) | `schedule-range-query-updates` | — | — | ○ / — / ○ | Mo順で端点移動を抑え頻度関数を差分更新。 |
| [ABC243-E](../../src/content/technique-inventory/shard-02/abc243-e.json) | `compute-all-pairs-distance` | — | `localize-change-impact-by-witness` | ○ / — / ○ | APSPで端点間の同長代替路witnessを検査。 |
| [ABC243-EX](../../src/content/technique-inventory/shard-01/abc243-ex.json) | `model-and-compute-shortest-path` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 平面分離の交差parityを二層最短路へ写す。 |
| [ABC243-F](../../src/content/technique-inventory/shard-01/abc243-f.json) | `formulate-combinatorial-coefficients` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | カテゴリ別multinomial係数のDP、法確率が補助。 |
| [ABC243-G](../../src/content/technique-inventory/shard-00/abc243-g.json) | `compress-dp-sufficient-aggregates` | — | `partition-integer-parameter-ranges` | ○ / — / ○ | 二段先の小状態へ圧縮し、二種類の重みprefix和で回答。 |
| [ABC244-E](../../src/content/technique-inventory/shard-01/abc244-e.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 頂点と訪問parityを十分状態にする固定長walk DP。 |
| [ABC244-EX](../../src/content/technique-inventory/shard-00/abc244-ex.json) | `restrict-geometric-candidates-to-boundary` | — | `decompose-ranges-into-segment-tree-nodes` | ○ / — / ○ | 凸包支持点への候補限定が核心、segment treeは静的構造を分配。 |
| [ABC244-F](../../src/content/technique-inventory/shard-01/abc244-f.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 全訪問parityと現在点を状態にしたmulti-source BFS。 |
| [ABC244-G](../../src/content/technique-inventory/shard-04/abc244-g.json) | `recover-valid-witness` | — | — | ○ / — / ○ | 木の再帰walkに局所parity補正を加える構成。 |
| [ABC245-E](../../src/content/technique-inventory/shard-02/abc245-e.json) | `prove-greedy-order` | — | `linearize-events`<br>`maintain-ordered-set-statistics` | ○ / — / ○ | 二次元支配matchingの交換法が主、sweepとordered setが補助。 |
| [ABC245-EX](../../src/content/technique-inventory/shard-01/abc245-ex.json) | `solve-modular-constraints` | — | `accelerate-fixed-linear-transition`<br>`compute-in-modular-arithmetic`<br>`decompose-by-prime-or-divisor` | ○ / — / ○ | CRTで素数冪に独立化、p進指数状態の行列累乗。 |
| [ABC245-F](../../src/content/technique-inventory/shard-03/abc245-f.json) | `peel-directed-graph-toward-cycles` | — | — | ○ / — / ○ | sink反復削除でcycle到達coreを残す。 |
| [ABC245-G](../../src/content/technique-inventory/shard-01/abc245-g.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | 国ラベル付きmulti-source Dijkstraを異国二候補に制限。 |
| [ABC246-E](../../src/content/technique-inventory/shard-00/abc246-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | 直前方向を持つ0/1最短路モデル。 |
| [ABC246-EX](../../src/content/technique-inventory/shard-04/abc246-ex.json) | `design-associative-range-summary` | — | `design-order-preserving-dp` | ○ / — / ○ | 部分列DPのaffine遷移を非可換行列monoidで保持。 |
| [ABC246-F](../../src/content/technique-inventory/shard-00/abc246-f.json) | `correct-overlap-by-inversion` | — | `compute-in-modular-arithmetic`<br>`enumerate-subsets-by-mask` | ○ / — / ○ | 共通alphabetの冪を部分集合包除。 |
| [ABC246-G](../../src/content/technique-inventory/shard-04/abc246-g.json) | `prove-and-search-threshold` | — | `aggregate-rooted-tree` | ○ / — / ○ | 閾値化した木ゲームの必要資源DPを二分探索oracleにする。 |
| [ABC247-E](../../src/content/technique-inventory/shard-05/abc247-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 右端固定で必須値の直近位置と禁止境界から左端数を求める。 |
| [ABC247-EX](../../src/content/technique-inventory/shard-01/abc247-ex.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `divide-search-space-recursively` | ○ / ○ / ○ | cycle数の生成多項式が主、balanced NTT積が追加主技能。 |
| [ABC247-F](../../src/content/technique-inventory/shard-01/abc247-f.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 2正則成分ごとの円環被覆DP。汎用functional graphを重ねる必要なし。 |
| [ABC247-G](../../src/content/technique-inventory/shard-04/abc247-g.json) | `model-min-cost-flow` | — | — | ○ / — / ○ | 重み付き二部matchingを流量別費用流で解く。 |
| [ABC248-E](../../src/content/technique-inventory/shard-05/abc248-e.json) | `reduce-geometry-to-algebraic-predicates` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 二点候補の共線判定と整数直線正規化。 |
| [ABC248-EX](../../src/content/technique-inventory/shard-03/abc248-ex.json) | `prune-dominated-candidates-once` | — | `design-associative-range-summary`<br>`design-range-update-action` | ○ / — / ○ | 単調stackが極値更新範囲を決め、少数値lazy treeが集約。 |
| [ABC248-F](../../src/content/technique-inventory/shard-04/abc248-f.json) | `design-frontier-profile-dp` | — | — | ○ / — / ○ | 境界二頂点の接続partitionを持つfrontier DP。 |
| [ABC248-G](../../src/content/technique-inventory/shard-05/abc248-g.json) | `aggregate-rooted-tree` | — | `reduce-integer-structure-by-gcd` | ○ / — / ○ | 部分木gcd群ごとの個数と長さ和を併合。 |
| [ABC249-E](../../src/content/technique-inventory/shard-03/abc249-e.json) | `factor-and-accelerate-transitions` | — | — | ○ / — / ○ | 同じ圧縮長増分を持つrun長の区間和でDP加速。 |
| [ABC249-EX](../../src/content/technique-inventory/shard-03/abc249-ex.json) | `decompose-expectation-by-additive-potential` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients`<br>`solve-stochastic-recurrence` | ○ / — / ○ | 期待値を頻度別potentialの和へ分離、一段方程式と二項分布が補助。 |
| [ABC249-F](../../src/content/technique-inventory/shard-01/abc249-f.json) | `reverse-update-time` | — | `enumerate-frontier-best-first` | ○ / — / ○ | 最後の代入を逆順固定し、heapで無視する損失を維持。 |
| [ABC249-G](../../src/content/technique-inventory/shard-05/abc249-g.json) | `maintain-xor-linear-basis` | — | — | ○ / — / ○ | 連結した(A,B)のXOR空間を基底化し上限制約下で最大化。 |
| [ABC250-E](../../src/content/technique-inventory/shard-05/abc250-e.json) | `normalize-equivalent-states` | — | — | ○ / — / ○ | 初出列とdistinct数へ正規化し対称差で集合一致。 |
| [ABC250-EX](../../src/content/technique-inventory/shard-01/abc250-ex.json) | `sweep-connectivity-by-kruskal-threshold` | `model-and-compute-shortest-path` | `linearize-events`<br>`maintain-connectivity-components` | ○ / ○ / ○ | 多始点距離場を閾値連結へ変換。queryを解くKruskal sweepがhome。 |
| [ABC250-F](../../src/content/technique-inventory/shard-01/abc250-f.json) | `maintain-monotone-window` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 凸多角形面積の単調性による二点法と外積差分。 |
| [ABC250-G](../../src/content/technique-inventory/shard-01/abc250-g.json) | `maintain-piecewise-linear-convex-function` | — | `enumerate-frontier-best-first` | ○ / — / ○ | 株数DPの傾き境界をheapで置換するSlope Trick。 |
| [ABC251-E](../../src/content/technique-inventory/shard-00/abc251-e.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 先頭選択を固定した円環二状態DP。 |
| [ABC251-EX](../../src/content/technique-inventory/shard-05/abc251-ex.json) | `accelerate-iteration-by-characteristic-p-frobenius` | — | `formulate-combinatorial-coefficients`<br>`maintain-ordered-interval-partition` | ○ / — / ○ | Frobeniusで巨大反復を疎なshiftにしRLE区間を更新。 |
| [ABC251-F](../../src/content/technique-inventory/shard-05/abc251-f.json) | `recover-valid-witness` | — | — | ○ / — / ○ | DFS木・BFS木の辺性質を使った構成。 |
| [ABC251-G](../../src/content/technique-inventory/shard-02/abc251-g.json) | `represent-convex-intersection-by-halfplanes` | — | — | ○ / — / ○ | 平行な半平面不等式の最強定数だけを残す。 |
| [ABC252-E](../../src/content/technique-inventory/shard-00/abc252-e.json) | `build-shortest-path-certificate` | — | `model-and-compute-shortest-path` | ○ / — / ○ | 距離和の下界を達成する最短路木の証明と出力。 |
| [ABC252-EX](../../src/content/technique-inventory/shard-02/abc252-ex.json) | `split-enumeration-space` | — | `query-bitwise-order-with-trie` | ○ / — / ○ | 色選択の積を均衡化したMITM、XOR順位trieが補助。 |
| [ABC252-F](../../src/content/technique-inventory/shard-01/abc252-f.json) | `prove-greedy-order` | — | `enumerate-frontier-best-first` | ○ / — / ○ | Huffman交換法と二最小heap。 |
| [ABC252-G](../../src/content/technique-inventory/shard-02/abc252-g.json) | `design-interval-split-dp` | — | — | ○ / — / ○ | 先行順部分木の区間性による分割DP。 |
| [ABC253-E](../../src/content/technique-inventory/shard-05/abc253-e.json) | `factor-and-accelerate-transitions` | — | — | ○ / — / ○ | 絶対差条件の許可区間和でDP高速化。 |
| [ABC253-EX](../../src/content/technique-inventory/shard-05/abc253-ex.json) | `count-combinatorial-objects-by-determinant` | — | `compute-in-modular-arithmetic`<br>`count-labeled-structures-by-components` | ○ / — / ○ | 行列木定理で成分数を求め、集合分割DPで森を合成。 |
| [ABC253-F](../../src/content/technique-inventory/shard-01/abc253-f.json) | `reverse-update-time` | — | `linearize-static-range-information`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | 代入直前の累積値を差し引くlast-write静的化。Outcomeがlast-write時刻も含むため現配置でよい。 |
| [ABC253-G](../../src/content/technique-inventory/shard-02/abc253-g.json) | `evaluate-compressed-integer-blocks` | — | — | ○ / — / ○ | 完全な交換行群をsuffix回転にまとめ端だけ直接処理。 |
| [ABC254-E](../../src/content/technique-inventory/shard-05/abc254-e.json) | `enumerate-bounded-candidates-or-cases` | — | — | ○ / — / ○ | 次数と距離の上限で局所探索候補数を界す。 |
| [ABC254-EX](../../src/content/technique-inventory/shard-03/abc254-ex.json) | `prove-greedy-order` | — | `query-bitwise-order-with-trie` | ○ / — / ○ | 最深祖先matchingの交換法、二進trieで余剰を伝播。 |
| [ABC254-F](../../src/content/technique-inventory/shard-00/abc254-f.json) | `reduce-integer-structure-by-gcd` | — | `design-associative-range-summary` | ○ / — / ○ | gcdの差分不変性と静的range gcd。 |
| [ABC254-G](../../src/content/technique-inventory/shard-02/abc254-g.json) | `jump-deterministic-transition` | — | `compress-sparse-keys`<br>`linearize-events` | ○ / — / ○ | 最高到達階の反復をdoubling、区間sweep・圧縮が補助。 |
| [ABC255-E](../../src/content/technique-inventory/shard-02/abc255-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 初項の自由度へ各位置・目標値から投票。 |
| [ABC255-EX](../../src/content/technique-inventory/shard-02/abc255-ex.json) | `maintain-ordered-interval-partition` | — | `bound-monotone-total-work` | ○ / — / ○ | 一定値区間のsplit・置換、生成消滅で償却。 |
| [ABC255-F](../../src/content/technique-inventory/shard-03/abc255-f.json) | `recover-valid-witness` | — | — | ○ / — / ○ | 先行順根と中間順位置で再帰復元。 |
| [ABC255-G](../../src/content/technique-inventory/shard-00/abc255-g.json) | `classify-game-states` | — | — | ○ / — / ○ | 疎な例外でmexを更新するGrundy計算。 |
| [ABC256-E](../../src/content/technique-inventory/shard-02/abc256-e.json) | `decompose-functional-graph` | — | — | ○ / — / ○ | functional graph閉路ごとの最小違反費用。 |
| [ABC256-EX](../../src/content/technique-inventory/shard-05/abc256-ex.json) | `bound-monotone-total-work` | — | `design-range-update-action`<br>`maintain-ordered-interval-partition` | ○ / — / ○ | 除算の値減少が総仕事量を抑え、ODTとlazy treeを併用。 |
| [ABC256-F](../../src/content/technique-inventory/shard-00/abc256-f.json) | `maintain-weighted-prefix-statistics` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 多重累積の二次係数を三つのBIT momentへ分離。 |
| [ABC256-G](../../src/content/technique-inventory/shard-03/abc256-g.json) | `accelerate-fixed-linear-transition` | — | `formulate-combinatorial-coefficients` | ○ / — / ○ | 二色転送行列のtrace、内部配置二項係数が補助。 |
| [ABC257-E](../../src/content/technique-inventory/shard-05/abc257-e.json) | `prove-greedy-order` | — | — | ○ / — / ○ | 最大桁数固定後の実現可能性付き辞書順貪欲。 |
| [ABC257-EX](../../src/content/technique-inventory/shard-05/abc257-ex.json) | `restrict-geometric-candidates-to-boundary` | — | `maintain-order-through-crossing-events` | ○ / — / ○ | 凸な目的の支持点を順位交差イベントで列挙。 |
| [ABC257-F](../../src/content/technique-inventory/shard-02/abc257-f.json) | `model-and-compute-shortest-path` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 可変頂点使用の有限経路型と両端BFS。 |
| [ABC257-G](../../src/content/technique-inventory/shard-05/abc257-g.json) | `build-prefix-match-state` | — | `select-state-graph-search` | ○ / — / ○ | Z値から断片長を作り区間到達frontier BFS。 |
| [ABC258-E](../../src/content/technique-inventory/shard-03/abc258-e.json) | `maintain-monotone-window` | — | `decompose-functional-graph` | ○ / — / ○ | 円環尺取りで後継を作り周期参照で巨大回数を処理。 |
| [ABC258-EX](../../src/content/technique-inventory/shard-05/abc258-ex.json) | `accelerate-fixed-linear-transition` | — | — | ○ / — / ○ | 禁止点間をFibonacci転送行列でまとめる。 |
| [ABC258-F](../../src/content/technique-inventory/shard-05/abc258-f.json) | `reduce-geometry-to-algebraic-predicates` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 格子幹線への定数個射影と距離場合分け。 |
| [ABC258-G](../../src/content/technique-inventory/shard-01/abc258-g.json) | `accelerate-set-operations-with-bitsets` | — | `reorder-counting-contributions` | ○ / — / ○ | 隣接集合ANDで共通頂点、辺寄与の重複を除く。 |
| [ABC259-E](../../src/content/technique-inventory/shard-03/abc259-e.json) | `decompose-by-prime-or-divisor` | — | — | ○ / — / ○ | 素因数ごとのLCM最大指数の唯一達成者を抽出。 |
| [ABC259-EX](../../src/content/technique-inventory/shard-00/abc259-ex.json) | `balance-heavy-light-threshold` | — | `design-grid-table-dp`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 頻度により端点対の二項係数とgrid DPを使い分ける。 |
| [ABC259-F](../../src/content/technique-inventory/shard-03/abc259-f.json) | `aggregate-rooted-tree` | — | `prove-greedy-order` | ○ / — / ○ | 親辺余地の二状態木DP、子差分の上位採用が補助。 |
| [ABC259-G](../../src/content/technique-inventory/shard-02/abc259-g.json) | `model-max-flow-min-cut` | — | — | ○ / — / ○ | 二値選択の損失をcut容量に一致させる。 |
| [ABC260-E](../../src/content/technique-inventory/shard-03/abc260-e.json) | `maintain-monotone-window` | — | — | ○ / — / ○ | 全組被覆の最小右端を尺取りで追跡。長さ軸への通常の一次元imosはbaseline内。 |
| [ABC260-EX](../../src/content/technique-inventory/shard-04/abc260-ex.json) | `encode-counting-by-generating-function` | `apply-formal-power-series-operations` | `compute-convolution-or-correlation`<br>`compute-in-modular-arithmetic`<br>`correct-overlap-by-inversion`<br>`divide-search-space-recursively`<br>`formulate-combinatorial-coefficients` | ○ / ○ / ○ | EGF・二項反転からmomentsのFPSへ接続。係数意味がhome。 |
| [ABC260-F](../../src/content/technique-inventory/shard-02/abc260-f.json) | `enumerate-bounded-candidates-or-cases` | — | — | ○ / — / ○ | 共通隣接点の衝突を鳩ノ巣で有限回に抑える。 |
| [ABC260-G](../../src/content/technique-inventory/shard-04/abc260-g.json) | `linearize-static-range-information` | — | — | ○ / — / ○ | 方向別差分で三角形加算を復元。 |
| [ABC261-E](../../src/content/technique-inventory/shard-00/abc261-e.json) | `compose-finite-functions` | — | — | ○ / — / ○ | 各bitの真理値表を関数合成。 |
| [ABC261-EX](../../src/content/technique-inventory/shard-01/abc261-ex.json) | `solve-cyclic-minimax-game` | — | — | ○ / — / ○ | AND/OR後退解析とminimax距離確定は専用技能内。 |
| [ABC261-F](../../src/content/technique-inventory/shard-01/abc261-f.json) | `reorder-counting-contributions` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | 有料転倒寄与を全体から同色分を引いてBIT計数。 |
| [ABC261-G](../../src/content/technique-inventory/shard-04/abc261-g.json) | `design-interval-split-dp` | — | `model-and-compute-shortest-path` | ○ / — / ○ | 文法導出区間DPと単項規則の最短路閉包。 |
| [ABC262-E](../../src/content/technique-inventory/shard-04/abc262-e.json) | `formulate-combinatorial-coefficients` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | cut parityを次数属性へ写し二項係数で固定人数選択。 |
| [ABC262-EX](../../src/content/technique-inventory/shard-00/abc262-ex.json) | `design-prefix-partition-dp` | — | `compress-sparse-keys`<br>`design-range-update-action`<br>`reorder-counting-contributions` | ○ / — / ○ | 最終出現の分割DP。包絡上界・level圧縮が補助。 |
| [ABC262-F](../../src/content/technique-inventory/shard-02/abc262-f.json) | `prove-greedy-order` | — | `design-associative-range-summary` | ○ / — / ○ | 回転削除の正規形からrange min辞書順貪欲。 |
| [ABC262-G](../../src/content/technique-inventory/shard-01/abc262-g.json) | `design-interval-split-dp` | — | — | ○ / — / ○ | stack極値pivotの位置区間・値域分割DP。 |
| [ABC263-E](../../src/content/technique-inventory/shard-02/abc263-e.json) | `solve-stochastic-recurrence` | — | `compute-in-modular-arithmetic`<br>`factor-and-accelerate-transitions` | ○ / — / ○ | 自己ループ期待値を解きsuffix和で加速。 |
| [ABC263-EX](../../src/content/technique-inventory/shard-05/abc263-ex.json) | `prove-and-search-threshold` | — | `detect-crossing-by-cyclic-order`<br>`linearize-events`<br>`maintain-weighted-prefix-statistics`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 半径の単調探索、弦交差への変換とBIT sweep。 |
| [ABC263-F](../../src/content/technique-inventory/shard-01/abc263-f.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | 勝者別木DPを敗者最大値で合成。 |
| [ABC263-G](../../src/content/technique-inventory/shard-02/abc263-g.json) | `model-max-flow-min-cut` | — | `optimize-univariate-convex-function` | ○ / — / ○ | 例外自己辺固定後の容量matching、離散凹探索が補助。 |
| [ABC264-E](../../src/content/technique-inventory/shard-01/abc264-e.json) | `reverse-update-time` | — | `augment-components-with-metadata` | ○ / — / ○ | 削除逆再生と発電属性DSU。 |
| [ABC264-EX](../../src/content/technique-inventory/shard-00/abc264-ex.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | 深さ上限付き木DPの祖先差分伝播。 |
| [ABC264-F](../../src/content/technique-inventory/shard-02/abc264-f.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 単調pathの現在行列flipだけを十分状態にする。 |
| [ABC264-G](../../src/content/technique-inventory/shard-00/abc264-g.json) | `build-finite-string-automaton` | `detect-improving-cycles` | — | ○ / ○ / ○ | suffix automatonへの局所得点モデルが主、改善閉路が追加主技能。 |
| [ABC265-E](../../src/content/technique-inventory/shard-01/abc265-e.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 操作回数から座標を復元する状態圧縮。 |
| [ABC265-EX](../../src/content/technique-inventory/shard-01/abc265-ex.json) | `compute-convolution-or-correlation` | — | `add-conway-number-games`<br>`classify-game-states`<br>`factor-separable-linear-transform` | ○ / — / ○ | 加算・XOR群の混合畳み込みが核心。二種ゲーム評価が補助。 |
| [ABC265-F](../../src/content/technique-inventory/shard-02/abc265-f.json) | `factor-and-accelerate-transitions` | — | — | ○ / — / ○ | L1距離対DPの三本の対角遷移和を高速化。 |
| [ABC265-G](../../src/content/technique-inventory/shard-05/abc265-g.json) | `design-range-update-action` | — | `design-associative-range-summary` | ○ / — / ○ | alphabet写像のlazy作用と順序pair monoid。 |
| [ABC266-E](../../src/content/technique-inventory/shard-02/abc266-e.json) | `optimize-stochastic-actions` | — | — | ○ / — / ○ | 観測後の停止・継続を比較する確率Bellman最適化。 |
| [ABC266-EX](../../src/content/technique-inventory/shard-04/abc266-ex.json) | `linearize-events` | — | `compress-sparse-keys`<br>`design-associative-range-summary`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 座標変換でdominance DPにし疎二次元構造でsweep。 |
| [ABC266-F](../../src/content/technique-inventory/shard-03/abc266-f.json) | `peel-graph-core` | — | — | ○ / — / ○ | unicyclic core抽出と枝の所属label。 |
| [ABC266-G](../../src/content/technique-inventory/shard-05/abc266-g.json) | `formulate-combinatorial-coefficients` | — | — | ○ / — / ○ | pattern縮約後のmultiset順列とgap配分。 |
| [ABC267-E](../../src/content/technique-inventory/shard-00/abc267-e.json) | `prove-and-search-threshold` | — | `bound-monotone-total-work` | ○ / — / ○ | 最大削除費用の二分探索、適格頂点の一方向peeling。 |
| [ABC267-EX](../../src/content/technique-inventory/shard-04/abc267-ex.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `divide-search-space-recursively` | ○ / ○ / ○ | 偶奇別部分和母関数が主、balanced NTT積が追加主技能。 |
| [ABC267-F](../../src/content/technique-inventory/shard-05/abc267-f.json) | `use-tree-diameter-extrema` | — | `answer-tree-ancestor-queries` | ○ / — / ○ | 直径両端で距離witnessをcoverしlevel ancestorで取得。 |
| [ABC267-G](../../src/content/technique-inventory/shard-04/abc267-g.json) | `formulate-combinatorial-coefficients` | — | — | ○ / — / ○ | 値順gap挿入のascent計数。 |
| [ABC268-E](../../src/content/technique-inventory/shard-03/abc268-e.json) | `linearize-static-range-information` | — | — | ○ / — / ○ | 円環絶対距離の一次式を係数imosで全点評価。 |
| [ABC268-EX](../../src/content/technique-inventory/shard-01/abc268-ex.json) | `build-suffix-lcp-index` | — | `design-associative-range-summary`<br>`linearize-events`<br>`maintain-ordered-set-statistics`<br>`prove-greedy-order` | ○ / — / ○ | suffix順位の一致区間が主、短い順割当・RMQ・区間刺し貪欲が補助。 |
| [ABC268-F](../../src/content/technique-inventory/shard-01/abc268-f.json) | `prove-greedy-order` | — | — | ○ / — / ○ | 連結目的の交換差から比率比較順を導く。 |
| [ABC268-G](../../src/content/technique-inventory/shard-02/abc268-g.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic`<br>`index-shared-prefixes-with-trie` | ○ / — / ○ | 順位期待を比較相手の寄与に分けtrieでprefix関係計数。 |
| [ABC269-E](../../src/content/technique-inventory/shard-00/abc269-e.json) | `prove-and-search-threshold` | — | `maintain-interactive-query-protocol` | ○ / — / ○ | 欠損行列の二分探索とinteractive protocol。 |
| [ABC269-EX](../../src/content/technique-inventory/shard-00/abc269-ex.json) | `accelerate-tree-dp-by-heavy-path` | — | `aggregate-rooted-tree`<br>`compute-convolution-or-correlation`<br>`divide-search-space-recursively`<br>`encode-counting-by-generating-function` | ○ / — / ○ | heavy pathによる母関数木DP高速化、NTT・分割統治が補助。 |
| [ABC269-F](../../src/content/technique-inventory/shard-03/abc269-f.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 偶奇クラス別に各マス寄与を級数集約。 |
| [ABC269-G](../../src/content/technique-inventory/shard-04/abc269-g.json) | `design-resource-dp` | — | — | ○ / — / ○ | 同じflip差の個数制限knapsackを二進分割。 |
| [ABC270-E](../../src/content/technique-inventory/shard-05/abc270-e.json) | `prove-and-search-threshold` | — | — | ○ / — / ○ | 完全周の消費数を二分探索し端数scan。 |
| [ABC270-EX](../../src/content/technique-inventory/shard-02/abc270-ex.json) | `solve-stochastic-recurrence` | — | `accelerate-fixed-linear-transition`<br>`compute-in-modular-arithmetic` | ○ / — / ○ | 期待値再帰の区分一定係数を累乗で進める。 |
| [ABC270-F](../../src/content/technique-inventory/shard-01/abc270-f.json) | `construct-optimal-spanning-tree` | — | `enumerate-bounded-candidates-or-cases`<br>`maintain-connectivity-components` | ○ / — / ○ | hubの有無を列挙したMSTとDSU。 |
| [ABC270-G](../../src/content/technique-inventory/shard-05/abc270-g.json) | `find-orbit-hit-by-bsgs` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 可逆affine写像の到達時刻BSGS。 |
| [ABC271-E](../../src/content/technique-inventory/shard-04/abc271-e.json) | `relax-in-dependency-order` | — | — | ○ / — / ○ | 辺列順の依存を守る一辺ずつの距離緩和。 |
| [ABC271-EX](../../src/content/technique-inventory/shard-04/abc271-ex.json) | `characterize-integer-solvability` | — | `enumerate-bounded-candidates-or-cases`<br>`prove-greedy-order` | ○ / — / ○ | 整数二係数の可解性が主、交換法でsupportを限定。 |
| [ABC271-F](../../src/content/technique-inventory/shard-05/abc271-f.json) | `split-enumeration-space` | — | — | ○ / — / ○ | 反対角線でpathを一意に分割するXOR MITM。 |
| [ABC271-G](../../src/content/technique-inventory/shard-00/abc271-g.json) | `accelerate-fixed-linear-transition` | — | `compute-in-modular-arithmetic`<br>`propagate-probability-distribution` | ○ / — / ○ | 周期待ちを24状態遷移へ圧縮して行列累乗。 |
| [ABC272-E](../../src/content/technique-inventory/shard-03/abc272-e.json) | `enumerate-bounded-candidates-or-cases` | — | — | ○ / — / ○ | mex値域と調和級数で有効eventだけ列挙。 |
| [ABC272-EX](../../src/content/technique-inventory/shard-01/abc272-ex.json) | `evaluate-polynomial-at-many-points` | `encode-counting-by-generating-function` | `compute-convolution-or-correlation`<br>`correct-overlap-by-inversion`<br>`divide-search-space-recursively`<br>`formulate-combinatorial-coefficients` | ○ / ○ / ○ | EGFで微分遷移を対角化し、積多項式の全整数点評価へ落とす。大規模評価を実現する多点評価home、EGF追加主技能は妥当。 |
| [ABC272-F](../../src/content/technique-inventory/shard-03/abc272-f.json) | `build-suffix-lcp-index` | — | — | ○ / — / ○ | 二倍文字列のsuffix順位で回転文字列を比較。 |
| [ABC272-G](../../src/content/technique-inventory/shard-04/abc272-g.json) | `design-and-bound-randomized-algorithm` | — | `decompose-by-prime-or-divisor` | ○ / — / ○ | majority pairの乱択抽出と差の約数候補検証。 |
| [ABC273-E](../../src/content/technique-inventory/shard-00/abc273-e.json) | `persist-data-structure-versions` | — | — | ○ / — / ○ | 共有prefix nodeで永続stack。 |
| [ABC273-EX](../../src/content/technique-inventory/shard-05/abc273-ex.json) | `traverse-stern-brocot-ancestors` | — | `divide-search-space-recursively`<br>`maintain-ordered-set-statistics`<br>`merge-small-into-large` | ○ / — / ○ | Stern–Brocot祖先和を圧縮探索し位置setをsmall-to-large併合。 |
| [ABC273-F](../../src/content/technique-inventory/shard-00/abc273-f.json) | `design-interval-expansion-dp` | — | `compress-sparse-keys` | ○ / — / ○ | 壁の前提取得条件を訪問済み区間で判定する両端DP。 |
| [ABC273-G](../../src/content/technique-inventory/shard-02/abc273-g.json) | `design-minimal-sufficient-state` | — | `formulate-combinatorial-coefficients` | ○ / — / ○ | 列残量histogramを十分状態にし小人数配分を計数。 |
| [ABC274-E](../../src/content/technique-inventory/shard-00/abc274-e.json) | `enumerate-subset-state-space` | — | — | ○ / — / ○ | 宝箱速度をmaskから導くsubset TSP。 |
| [ABC274-EX](../../src/content/technique-inventory/shard-04/abc274-ex.json) | `compare-sequences-by-rolling-fingerprint` | `compute-in-finite-field-extension` | — | ○ / ○ / ○ | 列比較rolling hashが主、XOR線形な拡大体演算が追加主技能。 |
| [ABC274-F](../../src/content/technique-inventory/shard-01/abc274-f.json) | `linearize-events` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 相対運動から捕獲時間区間を作り重み最大重なりsweep。 |
| [ABC274-G](../../src/content/technique-inventory/shard-02/abc274-g.json) | `solve-bipartite-matching` | — | `prove-greedy-order` | ○ / — / ○ | 視界runへ正規化し二部頂点被覆matching。 |
| [ABC275-E](../../src/content/technique-inventory/shard-05/abc275-e.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 吸収確率を時刻ごとに伝播し到達分を加算。 |
| [ABC275-EX](../../src/content/technique-inventory/shard-05/abc275-ex.json) | `maintain-piecewise-linear-convex-function` | `build-cartesian-tree-decomposition` | `maintain-ordered-set-statistics`<br>`merge-small-into-large` | ○ / ○ / ○ | Cartesian区間で凸関数DPを合成。関数更新がhome、分解木が追加主技能。 |
| [ABC275-F](../../src/content/technique-inventory/shard-04/abc275-f.json) | `design-resource-dp` | — | — | ○ / — / ○ | 削除run開始を課金する和knapsack。 |
| [ABC275-G](../../src/content/technique-inventory/shard-04/abc275-g.json) | `restrict-geometric-candidates-to-boundary` | — | — | ○ / — / ○ | 密度正規化した凸結合の下側境界だけで最適化。 |
| [ABC276-E](../../src/content/technique-inventory/shard-01/abc276-e.json) | `maintain-connectivity-components` | — | — | ○ / — / ○ | 指定頂点除去後の異なる隣接点の連結性。 |
| [ABC276-EX](../../src/content/technique-inventory/shard-01/abc276-ex.json) | `solve-linear-system-and-rank` | — | `accelerate-set-operations-with-bitsets`<br>`compress-sparse-keys`<br>`linearize-static-range-information`<br>`recover-valid-witness` | ○ / — / ○ | 四corner変数のF2方程式を解きmatrix復元。bitset・圧縮・差分が補助。 |
| [ABC276-F](../../src/content/technique-inventory/shard-04/abc276-f.json) | `maintain-weighted-prefix-statistics` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 追加要素のmax pair和を個数・総和BITで集計。 |
| [ABC276-G](../../src/content/technique-inventory/shard-01/abc276-g.json) | `formulate-combinatorial-coefficients` | — | — | ○ / — / ○ | 差分の剰余patternと商のstars-and-bars。 |
| [ABC277-E](../../src/content/technique-inventory/shard-05/abc277-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | switch parity二層の0/1 BFS。 |
| [ABC277-EX](../../src/content/technique-inventory/shard-05/abc277-ex.json) | `encode-threshold-constraints-as-two-sat` | — | — | ○ / — / ○ | 単調threshold命題へ値域を符号化する専用2-SAT。 |
| [ABC277-F](../../src/content/technique-inventory/shard-05/abc277-f.json) | `process-dag-in-topological-order` | — | — | ○ / — / ○ | 補助頂点で疎化した列順序制約のDAG判定。 |
| [ABC277-G](../../src/content/technique-inventory/shard-01/abc277-g.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic`<br>`reorder-counting-contributions` | ○ / — / ○ | marker展開したcount二乗寄与を確率DPで伝播。 |
| [ABC278-E](../../src/content/technique-inventory/shard-01/abc278-e.json) | `linearize-static-range-information` | — | — | ○ / — / ○ | 値別の矩形prefix頻度で補集合distinct数。 |
| [ABC278-EX](../../src/content/technique-inventory/shard-02/abc278-ex.json) | `count-finite-field-subspaces-by-rank` | — | `apply-stirling-transform`<br>`compute-convolution-or-correlation`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 有限体rank別計数が主、q二項・Stirling反転・NTTが補助。 |
| [ABC278-F](../../src/content/technique-inventory/shard-04/abc278-f.json) | `classify-game-states` | — | `enumerate-subset-state-space` | ○ / — / ○ | 使用集合と接続文字のゲーム勝敗DP。 |
| [ABC278-G](../../src/content/technique-inventory/shard-00/abc278-g.json) | `classify-game-states` | — | `maintain-interactive-query-protocol`<br>`normalize-equivalent-states` | ○ / — / ○ | 一般ケースの鏡映と例外のGrundyをともに採用。 |
| [ABC279-E](../../src/content/technique-inventory/shard-01/abc279-e.json) | `localize-change-impact-by-witness` | — | — | ○ / — / ○ | 省略swapが影響する二labelだけを完全結果から交換。 |
| [ABC279-EX](../../src/content/technique-inventory/shard-01/abc279-ex.json) | `expand-euler-product-sparsely` | — | `compute-binomial-by-lucas`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | Euler積の疎な五角数展開、Lucasで係数評価。 |
| [ABC279-F](../../src/content/technique-inventory/shard-03/abc279-f.json) | `augment-components-with-metadata` | — | — | ○ / — / ○ | 箱とDSU代表の間接参照とmetadata。 |
| [ABC279-G](../../src/content/technique-inventory/shard-02/abc279-g.json) | `design-minimal-sufficient-state` | — | `factor-and-accelerate-transitions` | ○ / — / ○ | 色名を消し直前出現位置で状態圧縮、prefix和で加速。 |
| [ABC280-E](../../src/content/technique-inventory/shard-02/abc280-e.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic`<br>`propagate-probability-distribution` | ○ / — / ○ | 訪問levelのindicator和、補事象で確率を更新。 |
| [ABC280-EX](../../src/content/technique-inventory/shard-05/abc280-ex.json) | `build-suffix-lcp-index` | — | `prune-dominated-candidates-once` | ○ / — / ○ | 三座標極小面の被覆を包除。幾何埋込みが追加主技能。 |
| [ABC280-F](../../src/content/technique-inventory/shard-01/abc280-f.json) | `propagate-static-graph-potentials` | — | — | ○ / — / ○ | 成分内potentialの整合性と非零閉路による非有界性を判定。静的potentialが核心。 |
| [ABC280-G](../../src/content/technique-inventory/shard-04/abc280-g.json) | `correct-overlap-by-inversion` | `reduce-geometry-to-algebraic-predicates` | `linearize-events`<br>`reorder-counting-contributions` | ○ / ○ / ○ | 三座標の極小面被覆を包除するのが主。六角距離の幾何埋込みが追加主技能、sweepが補助。 |
| [ABC281-E](../../src/content/technique-inventory/shard-03/abc281-e.json) | `maintain-ordered-set-statistics` | — | `maintain-monotone-window` | ○ / — / ○ | 動的上位集合の二multiset、窓伸縮が補助。 |
| [ABC281-EX](../../src/content/technique-inventory/shard-00/abc281-ex.json) | `encode-counting-by-generating-function` | `compute-online-relaxed-convolution` | `compute-convolution-or-correlation`<br>`divide-search-space-recursively` | ○ / ○ / ○ | 再帰組合せの母関数が主、オンライン係数確定が追加主技能。 |
| [ABC281-F](../../src/content/technique-inventory/shard-00/abc281-f.json) | `minimize-maximum-xor-by-bit-partition` | — | — | ○ / — / ○ | 上位bitの支配でminimax XORを再帰partition。 |
| [ABC281-G](../../src/content/technique-inventory/shard-01/abc281-g.json) | `design-minimal-sufficient-state` | — | `formulate-combinatorial-coefficients` | ○ / — / ○ | BFS層サイズへ状態圧縮し非空辺集合を数える。 |
| [ABC282-E](../../src/content/technique-inventory/shard-03/abc282-e.json) | `construct-optimal-spanning-tree` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 操作列と木の双方向対応から最大全域木。 |
| [ABC282-EX](../../src/content/technique-inventory/shard-00/abc282-ex.json) | `divide-search-space-recursively` | — | `answer-idempotent-range-query`<br>`bound-monotone-total-work` | ○ / — / ○ | 最小位置pivot分割統治、短い側走査の償却とRMQ。 |
| [ABC282-F](../../src/content/technique-inventory/shard-05/abc282-f.json) | `answer-idempotent-range-query` | — | `maintain-interactive-query-protocol` | ○ / — / ○ | 重なる二冪区間で任意区間を表すsparse table原理。 |
| [ABC282-G](../../src/content/technique-inventory/shard-00/abc282-g.json) | `factor-and-accelerate-transitions` | — | `design-minimal-sufficient-state`<br>`linearize-static-range-information` | ○ / — / ○ | 順位DPの二次元遷移和をrectangle prefixで加速。 |
| [ABC283-E](../../src/content/technique-inventory/shard-03/abc283-e.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 直前二行のflipを保存し中央行を遅延検証。 |
| [ABC283-EX](../../src/content/technique-inventory/shard-04/abc283-ex.json) | `sum-affine-floors-by-euclid` | — | `reorder-counting-contributions` | ○ / — / ○ | bit寄与を等差列上のfloor差にしてEuclid floor_sum。 |
| [ABC283-F](../../src/content/technique-inventory/shard-05/abc283-f.json) | `linearize-events` | — | `design-associative-range-summary`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 四象限の線形形式をsweepとrange extremumで取得。 |
| [ABC283-G](../../src/content/technique-inventory/shard-04/abc283-g.json) | `maintain-xor-linear-basis` | — | — | ○ / — / ○ | 既約XOR基底の係数順と数値順を一致させる。 |
| [ABC284-E](../../src/content/technique-inventory/shard-03/abc284-e.json) | `enumerate-by-reversible-backtracking` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | path限定mark/unmarkのbacktrackingと件数打切り。 |
| [ABC284-EX](../../src/content/technique-inventory/shard-02/abc284-ex.json) | `count-orbits-by-fixed-points` | — | `compute-in-modular-arithmetic`<br>`correct-overlap-by-inversion`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | Burnside固定点をcycle typeで集約、全色使用を包除。 |
| [ABC284-F](../../src/content/technique-inventory/shard-03/abc284-f.json) | `build-prefix-match-state` | — | — | ○ / — / ○ | 反転後の二つのprefix一致条件をZ配列で検査。 |
| [ABC284-G](../../src/content/technique-inventory/shard-02/abc284-g.json) | `decompose-functional-graph` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients`<br>`normalize-equivalent-states` | ○ / — / ○ | functional graph軌道のtail・cycle分類と対称代表の計数。 |
| [ABC285-E](../../src/content/technique-inventory/shard-01/abc285-e.json) | `design-prefix-partition-dp` | — | — | ○ / — / ○ | 休日separatorごとの区間寄与を分割DP。 |
| [ABC285-EX](../../src/content/technique-inventory/shard-01/abc285-ex.json) | `correct-overlap-by-inversion` | — | `decompose-by-prime-or-divisor`<br>`encode-counting-by-generating-function`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 平方数位置の包除と素因数ごとの指数母関数。 |
| [ABC285-F](../../src/content/technique-inventory/shard-01/abc285-f.json) | `design-associative-range-summary` | — | — | ○ / — / ○ | 文字頻度range sumで整列block・全包含条件を検査。 |
| [ABC285-G](../../src/content/technique-inventory/shard-05/abc285-g.json) | `solve-flow-with-lower-bounds` | — | `model-max-flow-min-cut` | ○ / — / ○ | 必須domino頂点をlower-bound flowへ写す。 |
| [ABC286-E](../../src/content/technique-inventory/shard-05/abc286-e.json) | `compute-all-pairs-distance` | — | — | ○ / — / ○ | 距離最小・価値最大のpair Floyd–Warshall。 |
| [ABC286-EX](../../src/content/technique-inventory/shard-01/abc286-ex.json) | `restrict-geometric-candidates-to-boundary` | — | — | ○ / — / ○ | 凸障害物の支持境界に沿う二経路だけ比較。 |
| [ABC286-F](../../src/content/technique-inventory/shard-01/abc286-f.json) | `solve-modular-constraints` | `exploit-modular-periodicity` | `maintain-interactive-query-protocol` | ○ / ○ / ○ | cycle長へ剰余を符号化しCRTで値復元。CRTがhome。 |
| [ABC286-G](../../src/content/technique-inventory/shard-05/abc286-g.json) | `construct-euler-trail-or-circuit` | — | `maintain-connectivity-components` | × / — / ○ | 自由辺成分縮約後のEuler存在判定が核心。Hierholzerによる構成は行わないためPのOutcomeが過大。F1。 |
| [ABC287-E](../../src/content/technique-inventory/shard-02/abc287-e.json) | `index-shared-prefixes-with-trie` | — | — | ○ / — / ○ | 文字bucketの再帰はtrieのprefix分割そのもの。 |
| [ABC287-EX](../../src/content/technique-inventory/shard-03/abc287-ex.json) | `compute-transitive-closure` | — | `accelerate-set-operations-with-bitsets`<br>`linearize-events` | ○ / — / ○ | 中継頂点の段階追加でbitset推移閉包。 |
| [ABC287-F](../../src/content/technique-inventory/shard-05/abc287-f.json) | `aggregate-rooted-tree` | — | `design-resource-dp` | ○ / — / ○ | 根選択bit付き木knapsackで成分数を合成。 |
| [ABC287-G](../../src/content/technique-inventory/shard-01/abc287-g.json) | `maintain-weighted-prefix-statistics` | — | `compress-sparse-keys` | ○ / — / ○ | 個数・重みBITで動的順位境界と部分bucketを取得。 |
| [ABC288-E](../../src/content/technique-inventory/shard-04/abc288-e.json) | `design-resource-dp` | — | — | ○ / — / ○ | 選択個数で購入費が決まるprefix knapsack。 |
| [ABC288-EX](../../src/content/technique-inventory/shard-05/abc288-ex.json) | `count-prefix-constrained-objects` | — | `correct-overlap-by-inversion`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 複数要素の対称bit桁DPと重複除去・組合せ補正。 |
| [ABC288-F](../../src/content/technique-inventory/shard-03/abc288-f.json) | `design-prefix-partition-dp` | — | `compress-dp-sufficient-aggregates` | ○ / — / ○ | 最後のblockによる分割DPを前段と総和へ集約。 |
| [ABC288-G](../../src/content/technique-inventory/shard-05/abc288-g.json) | `factor-separable-linear-transform` | — | — | ○ / — / ○ | tensor積の逆変換を三要素ずつ各軸へ作用。 |
| [ABC289-E](../../src/content/technique-inventory/shard-05/abc289-e.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 二駒の位置直積を単位辺BFS。 |
| [ABC289-EX](../../src/content/technique-inventory/shard-00/abc289-ex.json) | `apply-formal-power-series-operations` | `compute-convolution-or-correlation`<br>`encode-counting-by-generating-function` | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients` | ○ / ○ / ○ | 初回到達renewalのFPS除算が主、kernel畳み込みと母関数が追加主技能。 |
| [ABC289-F](../../src/content/technique-inventory/shard-03/abc289-f.json) | `recover-valid-witness` | — | — | ○ / — / ○ | 反射対の平行移動でparityを保って構成。 |
| [ABC289-G](../../src/content/technique-inventory/shard-01/abc289-g.json) | `optimize-by-line-envelope` | — | — | ○ / — / ○ | 需要人数別の直線upper envelope。 |
| [ABC290-E](../../src/content/technique-inventory/shard-01/abc290-e.json) | `reorder-counting-contributions` | — | `maintain-monotone-window` | ○ / — / ○ | 対称位置対の寄与を固定し同値pairを二点法集約。 |
| [ABC290-EX](../../src/content/technique-inventory/shard-04/abc290-ex.json) | `prove-greedy-order` | — | `design-resource-dp` | ○ / — / ○ | 係数交換で並びを正規化、左右個数DPが補助。 |
| [ABC290-F](../../src/content/technique-inventory/shard-00/abc290-f.json) | `formulate-combinatorial-coefficients` | — | — | ○ / — / ○ | 木次数和の固定和列を二項係数で計数。 |
| [ABC290-G](../../src/content/technique-inventory/shard-04/abc290-g.json) | `prove-greedy-order` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 完全木サイズの構造付きcoin貪欲、根深さ列挙が補助。 |
| [ABC291-E](../../src/content/technique-inventory/shard-02/abc291-e.json) | `process-dag-in-topological-order` | — | — | ○ / — / ○ | 各段階の入次数零候補一個による一意topological順。 |
| [ABC291-EX](../../src/content/technique-inventory/shard-00/abc291-ex.json) | `build-balanced-separator-decomposition` | — | — | ○ / — / ○ | 重心separatorの再帰分解。 |
| [ABC291-F](../../src/content/technique-inventory/shard-00/abc291-f.json) | `relax-in-dependency-order` | — | — | ○ / — / ○ | 前後DAG距離を削除頂点を跨ぐ辺で結合。 |
| [ABC291-G](../../src/content/technique-inventory/shard-05/abc291-g.json) | `compute-convolution-or-correlation` | — | — | ○ / — / ○ | bit別の巡回相関を反転畳み込み。 |
| [ABC292-E](../../src/content/technique-inventory/shard-04/abc292-e.json) | `compute-transitive-closure` | — | — | ○ / — / ○ | 全始点到達集合が最終辺集合となる推移閉包。 |
| [ABC292-EX](../../src/content/technique-inventory/shard-02/abc292-ex.json) | `design-associative-range-summary` | — | — | ○ / — / ○ | sum・maxPrefix monoidと木上境界探索。 |
| [ABC292-F](../../src/content/technique-inventory/shard-04/abc292-f.json) | `prove-and-search-threshold` | — | — | ○ / — / ○ | 辺長の単調可否を角度境界で評価。 |
| [ABC292-G](../../src/content/technique-inventory/shard-02/abc292-g.json) | `design-interval-split-dp` | — | — | ○ / — / ○ | 同じ上位桁の行区間を数字blockへ分割。 |
| [ABC293-E](../../src/content/technique-inventory/shard-00/abc293-e.json) | `accelerate-fixed-linear-transition` | — | — | ○ / — / ○ | affine遷移を定数座標付き行列で累乗。 |
| [ABC293-EX](../../src/content/technique-inventory/shard-04/abc293-ex.json) | `prove-and-search-threshold` | — | `aggregate-rooted-tree` | ○ / — / ○ | 非支配木DP状態による単調閾値判定。 |
| [ABC293-F](../../src/content/technique-inventory/shard-00/abc293-f.json) | `partition-integer-parameter-ranges` | — | — | ○ / — / ○ | 桁数別に非交差な基数候補区間へ分離。 |
| [ABC293-G](../../src/content/technique-inventory/shard-05/abc293-g.json) | `schedule-range-query-updates` | — | — | ○ / — / ○ | Mo順と三つ組頻度の差分更新。 |
| [ABC294-E](../../src/content/technique-inventory/shard-05/abc294-e.json) | `maintain-monotone-window` | — | — | ○ / — / ○ | RLE二列の境界を同期する二ポインタ。 |
| [ABC294-EX](../../src/content/technique-inventory/shard-05/abc294-ex.json) | `compute-subset-convolution` | — | `recur-by-edge-deletion-contraction` | ○ / — / ○ | 低次数削除縮約後にsubset convolutionで彩色計数。 |
| [ABC294-F](../../src/content/technique-inventory/shard-05/abc294-f.json) | `optimize-ratio-by-parametric-search` | — | — | ○ / — / ○ | 濃度を線形scoreへ変換したparametric順位探索。 |
| [ABC294-G](../../src/content/technique-inventory/shard-02/abc294-g.json) | `flatten-tree-by-euler-order` | `answer-tree-ancestor-queries` | `maintain-weighted-prefix-statistics` | ○ / ○ / ○ | Euler差分で動的根距離が主、LCAが追加主技能。 |
| [ABC295-E](../../src/content/technique-inventory/shard-00/abc295-e.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 順序統計量のtail確率和と二項分布。 |
| [ABC295-EX](../../src/content/technique-inventory/shard-00/abc295-ex.json) | `apply-subset-zeta-mobius-transform` | — | `enumerate-subset-state-space` | ○ / — / × | subset zetaによる行遷移加速が核心。補助には幅境界のみ残すfrontier状態設計を明示すべき。F2。 |
| [ABC295-F](../../src/content/technique-inventory/shard-02/abc295-f.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | pattern出現位置固定でprefix個数を集計。 |
| [ABC295-G](../../src/content/technique-inventory/shard-00/abc295-g.json) | `contract-monotone-paths-with-jump-pointers` | — | `bound-monotone-total-work`<br>`maintain-connectivity-components` | ○ / — / ○ | 吸収済みpathをDSU代表で飛ばす単調縮約。 |
| [ABC296-E](../../src/content/technique-inventory/shard-04/abc296-e.json) | `decompose-functional-graph` | — | — | ○ / — / ○ | functional graphの閉路頂点だけ残す。 |
| [ABC296-EX](../../src/content/technique-inventory/shard-00/abc296-ex.json) | `design-frontier-profile-dp` | — | `design-minimal-sufficient-state` | ○ / — / ○ | frontierの連結partitionと完成成分を保持。ラベル名を忘れる同型状態正規化が補助状態圧縮を支える。 |
| [ABC296-F](../../src/content/technique-inventory/shard-00/abc296-f.json) | `normalize-equivalent-states` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | 多重集合と置換parityで操作同値類を判定。 |
| [ABC296-G](../../src/content/technique-inventory/shard-01/abc296-g.json) | `reduce-geometry-to-algebraic-predicates` | — | `linearize-events` | ○ / — / ○ | 凸多角形の上下chainに対する外積判定とx sweep。 |
| [ABC297-E](../../src/content/technique-inventory/shard-00/abc297-e.json) | `enumerate-frontier-best-first` | — | `model-and-compute-shortest-path` | ○ / — / ○ | 加算生成値のbest-first列挙と重複除去。 |
| [ABC297-EX](../../src/content/technique-inventory/shard-04/abc297-ex.json) | `encode-counting-by-generating-function` | `apply-formal-power-series-operations` | `compute-convolution-or-correlation`<br>`compute-in-modular-arithmetic`<br>`correct-overlap-by-inversion` | ○ / ○ / ○ | run包除母関数が主、FPS逆元が追加主技能。 |
| [ABC297-F](../../src/content/technique-inventory/shard-05/abc297-f.json) | `correct-overlap-by-inversion` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients`<br>`reorder-counting-contributions` | ○ / — / ○ | box包含の四方向包除、各点寄与と法確率が補助。 |
| [ABC297-G](../../src/content/technique-inventory/shard-01/abc297-g.json) | `classify-game-states` | — | — | ○ / — / ○ | 周期Grundyのmex証明と独立山xor。 |
| [ABC298-E](../../src/content/technique-inventory/shard-05/abc298-e.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 終端吸収確率を手番別に逆伝播。 |
| [ABC298-EX](../../src/content/technique-inventory/shard-04/abc298-ex.json) | `answer-tree-ancestor-queries` | — | `aggregate-rooted-tree` | ○ / — / ○ | LCA/LAでVoronoi境界を特定、部分木距離集約が補助。 |
| [ABC298-F](../../src/content/technique-inventory/shard-04/abc298-f.json) | `prove-greedy-order` | — | — | ○ / — / ○ | 上界順候補を最初の補正なしで打ち切る支配論。 |
| [ABC298-G](../../src/content/technique-inventory/shard-00/abc298-g.json) | `design-interval-split-dp` | — | `enumerate-bounded-candidates-or-cases`<br>`linearize-static-range-information` | ○ / — / ○ | 最小片和固定のguillotine分割DP、矩形和が補助。 |
| [ABC299-E](../../src/content/technique-inventory/shard-02/abc299-e.json) | `recover-valid-witness` | — | `model-and-compute-shortest-path` | ○ / — / ○ | 禁止球以外を全て黒にする最大許容集合構成。 |
| [ABC299-EX](../../src/content/technique-inventory/shard-02/abc299-ex.json) | `solve-stochastic-recurrence` | — | `accelerate-fixed-linear-transition`<br>`compute-in-modular-arithmetic`<br>`solve-linear-system-and-rank` | ○ / — / ○ | 周期出口分布のrenewal期待方程式、行列累乗と連立一次方程式が補助。 |
| [ABC299-F](../../src/content/technique-inventory/shard-05/abc299-f.json) | `design-order-preserving-dp` | — | — | ○ / — / ○ | 最左embeddingでdistinct部分列を二列同期計数。 |
| [ABC299-G](../../src/content/technique-inventory/shard-01/abc299-g.json) | `prove-greedy-order` | — | `design-associative-range-summary` | ○ / — / ○ | 最短deadlineまでの最小値を取る辞書順貪欲とRMQ。 |
| [ABC300-E](../../src/content/technique-inventory/shard-04/abc300-e.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 自己ループを消した疎状態の到達確率DP。 |
| [ABC300-EX](../../src/content/technique-inventory/shard-03/abc300-ex.json) | `extract-rational-series-coefficient` | — | `accelerate-fixed-linear-transition`<br>`compute-convolution-or-correlation`<br>`enumerate-subset-state-space` | ○ / — / × | 有理式の偶奇抽出でsubmask係数和を圧縮。部分集合を状態として列挙・遷移するDPは用いない。F3。 |
| [ABC300-F](../../src/content/technique-inventory/shard-04/abc300-f.json) | `prove-and-search-threshold` | — | `linearize-static-range-information` | ○ / — / ○ | 周期prefix個数で最遠端の単調探索。 |
| [ABC300-G](../../src/content/technique-inventory/shard-05/abc300-g.json) | `split-enumeration-space` | — | `maintain-monotone-window` | ○ / — / ○ | 素数群を分割した積MITMと二ポインタ。 |
| [ABC301-E](../../src/content/technique-inventory/shard-02/abc301-e.json) | `enumerate-subset-state-space` | — | `model-and-compute-shortest-path` | ○ / — / ○ | 重要点metric closure上のsubset TSP。 |
| [ABC301-EX](../../src/content/technique-inventory/shard-00/abc301-ex.json) | `identify-bridges-and-articulations` | `sweep-connectivity-by-kruskal-threshold` | `linearize-events`<br>`maintain-connectivity-components` | ○ / ○ / ○ | 軽辺縮約後のbridgeが必要性を決め、Kruskal閾値が追加主技能。 |
| [ABC301-F](../../src/content/technique-inventory/shard-01/abc301-f.json) | `build-finite-string-automaton` | `run-dp-on-finite-automaton` | `compute-in-modular-arithmetic`<br>`normalize-equivalent-states` | ○ / ○ / ○ | 禁止部分列の有限状態構築が主、状態DPが追加主技能。 |
| [ABC301-G](../../src/content/technique-inventory/shard-04/abc301-g.json) | `reduce-geometry-to-algebraic-predicates` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 視線一致の直線・交点を有理幾何で有限列挙。 |
| [ABC302-E](../../src/content/technique-inventory/shard-05/abc302-e.json) | `bound-monotone-total-work` | — | — | ○ / — / ○ | 削除隣接走査を追加辺へ課金する償却。 |
| [ABC302-EX](../../src/content/technique-inventory/shard-02/abc302-ex.json) | `rollback-reversible-updates` | — | `augment-components-with-metadata` | ○ / — / ○ | DFS pathのrollback DSUで二択割当成分量を維持。 |
| [ABC302-F](../../src/content/technique-inventory/shard-03/abc302-f.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 集合要素incidence graphの単位辺BFS。 |
| [ABC302-G](../../src/content/technique-inventory/shard-03/abc302-g.json) | `normalize-equivalent-states` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 4値誤配置行列への商約と24順列potential列挙。 |
| [ABC303-E](../../src/content/technique-inventory/shard-02/abc303-e.json) | `classify-tree-by-distance-residue` | — | — | ○ / — / ○ | 中心間距離3の剰余で役割復元。 |
| [ABC303-EX](../../src/content/technique-inventory/shard-03/abc303-ex.json) | `encode-labeled-trees-by-prufer-code` | — | `compute-convolution-or-correlation`<br>`compute-in-modular-arithmetic`<br>`encode-counting-by-generating-function`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | Prüfer次数対応が核心、EGFとNTT冪が補助。 |
| [ABC303-F](../../src/content/technique-inventory/shard-02/abc303-f.json) | `prove-and-search-threshold` | — | `sum-piecewise-linear-integer-ranges` | ○ / — / ○ | 区分線形包絡の累積が目標を跨ぐ時刻を探索。 |
| [ABC303-G](../../src/content/technique-inventory/shard-05/abc303-g.json) | `evaluate-adversarial-game-value` | — | `prune-dominated-candidates-once` | ○ / — / ○ | 得点差minimaxにsliding minimumを組み合わせる。 |
| [ABC304-E](../../src/content/technique-inventory/shard-00/abc304-e.json) | `maintain-connectivity-components` | — | — | ○ / — / ○ | 禁止pairをDSU成分pairへ縮約。 |
| [ABC304-EX](../../src/content/technique-inventory/shard-03/abc304-ex.json) | `prove-greedy-order` | — | `process-dag-in-topological-order` | ○ / — / ○ | deadline伝播後のEDF交換法が核心、DAGが補助。 |
| [ABC304-F](../../src/content/technique-inventory/shard-03/abc304-f.json) | `invert-divisor-lattice-by-mobius` | — | `compute-in-modular-arithmetic`<br>`decompose-by-prime-or-divisor` | ○ / — / ○ | 約数ごとの周期列から真の最小周期を反転。 |
| [ABC304-G](../../src/content/technique-inventory/shard-04/abc304-g.json) | `solve-xor-threshold-matching` | — | `divide-search-space-recursively`<br>`prove-and-search-threshold` | ○ / — / ○ | XOR閾値matching oracleが核心、再帰分割・二分探索が補助。 |
| [ABC305-E](../../src/content/technique-inventory/shard-05/abc305-e.json) | `enumerate-frontier-best-first` | — | `model-and-compute-shortest-path` | ○ / — / ○ | 最大残量のfrontier確定と多始点距離伝播。 |
| [ABC305-EX](../../src/content/technique-inventory/shard-03/abc305-ex.json) | `optimize-by-lagrangian-relaxation` | — | `design-prefix-partition-dp`<br>`prove-greedy-order` | ○ / — / ○ | Monge分割をpenalty付きAliens DPへ変形。 |
| [ABC305-F](../../src/content/technique-inventory/shard-01/abc305-f.json) | `select-state-graph-search` | `maintain-interactive-query-protocol` | `bound-monotone-total-work` | ○ / ○ / ○ | オンラインDFSの探索方針が主、protocolが追加主技能、往復数が補助。 |
| [ABC305-G](../../src/content/technique-inventory/shard-05/abc305-g.json) | `build-finite-string-automaton` | `run-dp-on-finite-automaton` | `accelerate-fixed-linear-transition` | ○ / ○ / ○ | 末尾有限automaton構築とDPが主、行列累乗で反復加速。 |
| [ABC306-E](../../src/content/technique-inventory/shard-05/abc306-e.json) | `maintain-ordered-set-statistics` | — | — | ○ / — / ○ | top-K境界を二multisetで維持。 |
| [ABC306-EX](../../src/content/technique-inventory/shard-01/abc306-ex.json) | `correct-overlap-by-inversion` | — | `enumerate-subset-state-space`<br>`process-dag-in-topological-order` | ○ / — / ○ | source集合の包除を3^N集合DPで評価。 |
| [ABC306-F](../../src/content/technique-inventory/shard-05/abc306-f.json) | `reorder-counting-contributions` | — | `compress-sparse-keys`<br>`linearize-events`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | 順位和をcross寄与へ分解し圧縮BITでsweep。 |
| [ABC306-G](../../src/content/technique-inventory/shard-02/abc306-g.json) | `compute-directed-walk-period` | — | `condense-and-order-directed-graph`<br>`reduce-integer-structure-by-gcd` | ○ / — / ○ | SCC内の辺potential差gcdで有向walk周期。 |
| [ABC307-E](../../src/content/technique-inventory/shard-01/abc307-e.json) | `design-minimal-sufficient-state` | — | `normalize-equivalent-states` | ○ / — / ○ | 先頭色に対する対称二状態の円環DP。 |
| [ABC307-EX](../../src/content/technique-inventory/shard-02/abc307-ex.json) | `compute-convolution-or-correlation` | — | — | ○ / — / ○ | 非負mismatch式の全shiftをNTT相関。 |
| [ABC307-F](../../src/content/technique-inventory/shard-05/abc307-f.json) | `model-and-compute-shortest-path` | — | `bound-monotone-total-work`<br>`enumerate-frontier-best-first` | ○ / — / ○ | 日別Dijkstraと共有frontier、辺処理の償却。 |
| [ABC307-G](../../src/content/technique-inventory/shard-00/abc307-g.json) | `design-resource-dp` | — | `linearize-static-range-information` | ○ / — / ○ | prefix imbalance費用を高値個数DPで最適化。 |
| [ABC308-E](../../src/content/technique-inventory/shard-04/abc308-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 中央固定で左右の小alphabet頻度積。 |
| [ABC308-EX](../../src/content/technique-inventory/shard-03/abc308-ex.json) | `find-rooted-cycle-by-shortest-path-branches` | — | `build-shortest-path-certificate` | ○ / — / ○ | 最短路木の異枝を結ぶ根付きcycle oracle。 |
| [ABC308-F](../../src/content/technique-inventory/shard-02/abc308-f.json) | `prove-greedy-order` | — | `linearize-events` | ○ / — / ○ | coupon交換法が核心、価格順解禁が補助。 |
| [ABC308-G](../../src/content/technique-inventory/shard-02/abc308-g.json) | `maintain-ordered-set-statistics` | — | — | ○ / — / ○ | 最小XORの数値順隣接性を局所gap更新で維持。 |
| [ABC309-E](../../src/content/technique-inventory/shard-01/abc309-e.json) | `aggregate-rooted-tree` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 親から最大残存効果を伝播。十分状態の補助は実際に発動。 |
| [ABC309-EX](../../src/content/technique-inventory/shard-02/abc309-ex.json) | `remove-boundaries-by-reflection` | — | `compute-convolution-or-correlation` | ○ / — / ○ | 鏡像相殺で壁を消し周期kernel畳み込み。 |
| [ABC309-F](../../src/content/technique-inventory/shard-02/abc309-f.json) | `linearize-events` | — | `compress-sparse-keys`<br>`design-associative-range-summary` | ○ / — / ○ | strict dominanceを同値batch付きsweep。 |
| [ABC309-G](../../src/content/technique-inventory/shard-02/abc309-g.json) | `correct-overlap-by-inversion` | — | `design-frontier-profile-dp`<br>`enumerate-subset-state-space`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 部分matching包除、帯幅frontierと階乗補完が補助。 |
| [ABC310-E](../../src/content/technique-inventory/shard-04/abc310-e.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | NAND結果別の末尾区間数へ集約。 |
| [ABC310-EX](../../src/content/technique-inventory/shard-05/abc310-ex.json) | `stabilize-unbounded-knapsack-by-best-density` | — | `design-resource-dp` | ○ / — / ○ | 最良密度の大量反復と有界例外knapsack。 |
| [ABC310-F](../../src/content/technique-inventory/shard-05/abc310-f.json) | `enumerate-subset-state-space` | — | `compute-in-modular-arithmetic`<br>`propagate-probability-distribution` | ○ / — / ○ | 部分和到達集合自体を確率DPのmask状態にする。 |
| [ABC310-G](../../src/content/technique-inventory/shard-02/abc310-g.json) | `jump-deterministic-transition` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 写像作用と区間寄与和をdoublingで同時合成。 |
| [ABC311-E](../../src/content/technique-inventory/shard-00/abc311-e.json) | `design-grid-table-dp` | `design-minimal-sufficient-state` | — | ○ / ○ / ○ | 三近傍の最大正方形grid DPが主、最大長で個数圧縮が追加主技能。 |
| [ABC311-EX](../../src/content/technique-inventory/shard-05/abc311-ex.json) | `pass-resource-dp-through-heavy-recursion` | — | `design-resource-dp` | ○ / — / ○ | heavy子のDP配列共有で再帰複製量を抑える。 |
| [ABC311-F](../../src/content/technique-inventory/shard-04/abc311-f.json) | `design-minimal-sufficient-state` | — | `factor-and-accelerate-transitions` | ○ / — / ○ | 強制黒閉包後の対角境界DP、suffix和が補助。 |
| [ABC311-G](../../src/content/technique-inventory/shard-05/abc311-g.json) | `linearize-events` | — | `linearize-static-range-information`<br>`maintain-connectivity-components` | ○ / — / ○ | 最小値thresholdと高さactivationで極大矩形を生成。 |
| [ABC312-E](../../src/content/technique-inventory/shard-03/abc312-e.json) | `enumerate-bounded-candidates-or-cases` | — | — | ○ / — / ○ | 小座標voxel空間で隣接所有者を有限走査。 |
| [ABC312-EX](../../src/content/technique-inventory/shard-02/abc312-ex.json) | `normalize-string-to-primitive-period` | — | `bound-monotone-total-work`<br>`build-prefix-match-state` | ○ / — / ○ | primitive root正規化、Z周期と次候補償却が補助。 |
| [ABC312-F](../../src/content/technique-inventory/shard-05/abc312-f.json) | `prove-greedy-order` | — | — | ○ / — / ○ | 種類別prefixと容量解禁の交換法。 |
| [ABC312-G](../../src/content/technique-inventory/shard-03/abc312-g.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | 三枝の一意な分岐点を部分木サイズから集計。 |
| [ABC313-E](../../src/content/technique-inventory/shard-04/abc313-e.json) | `evolve-run-length-encoded-state` | — | — | ○ / — / ○ | RLE消滅時刻と増幅の閉形式更新。 |
| [ABC313-EX](../../src/content/technique-inventory/shard-04/abc313-ex.json) | `design-minimal-sufficient-state` | — | `characterize-bipartite-feasibility-by-hall`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | path fragment数の挿入DP、sorted Hall条件が補助。 |
| [ABC313-F](../../src/content/technique-inventory/shard-04/abc313-f.json) | `enumerate-bounded-candidates-or-cases` | — | `enumerate-subset-state-space`<br>`reorder-counting-contributions` | ○ / — / ○ | 乱択後の期待寄与を被覆利益にし小さい側を指数化。 |
| [ABC313-G](../../src/content/technique-inventory/shard-04/abc313-g.json) | `normalize-equivalent-states` | — | `sum-affine-floors-by-euclid` | ○ / — / ○ | 相殺操作の正規形を数え、区分floor_sumで集計。 |
| [ABC314-E](../../src/content/technique-inventory/shard-04/abc314-e.json) | `optimize-stochastic-actions` | — | — | ○ / — / ○ | self-loopを実効費用にし行動選択のBellman最適化。 |
| [ABC314-EX](../../src/content/technique-inventory/shard-00/abc314-ex.json) | `optimize-univariate-convex-function` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 凸距離最大値の部分最小化を入れ子探索。 |
| [ABC314-F](../../src/content/technique-inventory/shard-02/abc314-f.json) | `build-component-merge-tree` | — | `aggregate-rooted-tree`<br>`augment-components-with-metadata`<br>`compute-in-modular-arithmetic`<br>`reorder-counting-contributions` | ○ / — / ○ | 併合履歴を木にして各葉へ期待寄与を伝播。 |
| [ABC314-G](../../src/content/technique-inventory/shard-03/abc314-g.json) | `maintain-ordered-set-statistics` | — | `maintain-monotone-window`<br>`prove-greedy-order` | ○ / — / ○ | 閾値を満たす最小個数境界を二集合で維持。 |
| [ABC315-E](../../src/content/technique-inventory/shard-05/abc315-e.json) | `process-dag-in-topological-order` | — | — | ○ / — / ○ | 依存到達閉包のpostorder出力。 |
| [ABC315-EX](../../src/content/technique-inventory/shard-02/abc315-ex.json) | `compute-online-relaxed-convolution` | — | `compute-convolution-or-correlation`<br>`encode-counting-by-generating-function` | ○ / — / ○ | 自己参照係数をrelaxed convolutionで因果順に確定。 |
| [ABC315-F](../../src/content/technique-inventory/shard-01/abc315-f.json) | `design-order-preserving-dp` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 指数penaltyでskip数を限定した選択位置DP。 |
| [ABC315-G](../../src/content/technique-inventory/shard-05/abc315-g.json) | `characterize-integer-solvability` | — | — | ○ / — / ○ | 一変数列挙後のBézout一般解を整数区間で数える。 |
| [ABC317-E](../../src/content/technique-inventory/shard-02/abc317-e.json) | `precompute-directional-grid-effects` | — | `select-state-graph-search` | ○ / — / ○ | 四方向ray前処理が主、静的BFSが補助。 |
| [ABC317-EX](../../src/content/technique-inventory/shard-03/abc317-ex.json) | `encode-counting-by-generating-function` | `apply-formal-power-series-operations`<br>`compute-convolution-or-correlation` | `divide-search-space-recursively` | ○ / ○ / ○ | first-return母関数が主、FPS逆元と行列NTT積が追加主技能。 |
| [ABC317-F](../../src/content/technique-inventory/shard-05/abc317-f.json) | `count-prefix-constrained-objects` | — | `correct-overlap-by-inversion` | ○ / — / ○ | 下位桁から上限比較を更新する同期桁DP。 |
| [ABC317-G](../../src/content/technique-inventory/shard-02/abc317-g.json) | `solve-bipartite-matching` | `characterize-bipartite-feasibility-by-hall` | — | ○ / ○ / ○ | 正則二部graphをmatchingで反復分解。存在のHall証明が追加主技能。 |
| [ABC318-E](../../src/content/technique-inventory/shard-01/abc318-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 中央固定と左右頻度内積の差分。 |
| [ABC318-EX](../../src/content/technique-inventory/shard-01/abc318-ex.json) | `count-labeled-structures-by-components` | `apply-formal-power-series-operations` | `compute-convolution-or-correlation`<br>`encode-counting-by-generating-function` | ○ / ○ / ○ | labeled成分分解が主、exp計算が追加主技能。 |
| [ABC318-F](../../src/content/technique-inventory/shard-01/abc318-f.json) | `partition-at-critical-integer-boundaries` | — | `characterize-bipartite-feasibility-by-hall`<br>`prove-greedy-order` | ○ / — / ○ | 成立する割当関係が変わる整数境界で区間圧縮。 |
| [ABC318-G](../../src/content/technique-inventory/shard-05/abc318-g.json) | `model-max-flow-min-cut` | — | — | ○ / — / ○ | 中心からの頂点素二経路を容量flowへ。 |
| [ABC319-E](../../src/content/technique-inventory/shard-01/abc319-e.json) | `exploit-modular-periodicity` | — | — | ○ / — / ○ | 全周期のLCM840で所要時間を前計算。 |
| [ABC319-F](../../src/content/technique-inventory/shard-04/abc319-f.json) | `enumerate-subset-state-space` | — | `enumerate-frontier-best-first`<br>`prove-greedy-order` | ○ / — / ○ | medicine subsetを主状態にし安全enemyをgreedy closure。 |
| [ABC319-G](../../src/content/technique-inventory/shard-02/abc319-g.json) | `select-state-graph-search` | — | `bound-monotone-total-work`<br>`maintain-ordered-set-statistics`<br>`subtract-exception-transitions` | ○ / — / ○ | 補graph BFSと前層総和の禁止分減算。 |
| [ABC320-E](../../src/content/technique-inventory/shard-04/abc320-e.json) | `linearize-events` | — | `enumerate-frontier-best-first`<br>`maintain-ordered-set-statistics` | ○ / — / ○ | 復帰時刻と配布時刻のevent順、heapとordered setが補助。 |
| [ABC320-F](../../src/content/technique-inventory/shard-01/abc320-f.json) | `design-resource-dp` | — | — | ○ / — / ○ | 往復fuelを同位置で同時に持つ資源DP。 |
| [ABC320-G](../../src/content/technique-inventory/shard-05/abc320-g.json) | `solve-bipartite-matching` | — | `compress-sparse-keys`<br>`exploit-modular-periodicity`<br>`prove-and-search-threshold`<br>`prove-greedy-order` | ○ / — / ○ | reel時刻matching oracleが主、候補打切り・周期・二分探索が補助。 |
| [ABC321-E](../../src/content/technique-inventory/shard-00/abc321-e.json) | `count-implicit-binary-tree-layers` | — | — | ○ / — / ○ | 暗黙二分木の層区間を祖先分岐ごとに計数。 |
| [ABC321-F](../../src/content/technique-inventory/shard-02/abc321-f.json) | `design-resource-dp` | — | — | ○ / — / ○ | subset-sum係数の追加・除去を逆依存順で更新。 |
| [ABC321-G](../../src/content/technique-inventory/shard-02/abc321-g.json) | `count-labeled-structures-by-components` | — | `compute-in-modular-arithmetic`<br>`enumerate-subset-state-space`<br>`formulate-combinatorial-coefficients`<br>`reorder-counting-contributions` | ○ / — / ○ | anchor成分の除原理で連結数を抽出し成分期待値を足す。 |
| [ABC322-E](../../src/content/technique-inventory/shard-05/abc322-e.json) | `design-resource-dp` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 多資源knapsackに閾値capで状態圧縮。 |
| [ABC322-F](../../src/content/technique-inventory/shard-01/abc322-f.json) | `design-range-update-action` | — | `design-associative-range-summary` | ○ / — / ○ | run monoidの両bit情報をflip作用でswap。 |
| [ABC322-G](../../src/content/technique-inventory/shard-00/abc322-g.json) | `decompose-by-prime-or-divisor` | — | `prove-greedy-order` | ○ / — / ○ | 基数差がXの約数、superincreasing digitの貪欲復号。 |
| [ABC323-E](../../src/content/technique-inventory/shard-03/abc323-e.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | renewal時刻確率から対象曲開始の排反事象を足す。 |
| [ABC323-F](../../src/content/technique-inventory/shard-01/abc323-f.json) | `normalize-equivalent-states` | — | `enumerate-bounded-candidates-or-cases`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | cargo原点の相対位置に正規化して必須stanceを有限評価。 |
| [ABC323-G](../../src/content/technique-inventory/shard-00/abc323-g.json) | `count-combinatorial-objects-by-determinant` | — | `shift-polynomial-by-factorial-convolution`<br>`solve-linear-system-and-rank` | ○ / — / ○ | 重み付き行列木定理の多項式行列式とTaylor shift。 |
| [ABC324-E](../../src/content/technique-inventory/shard-05/abc324-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | prefix/suffix match長の相手数を頻度和。 |
| [ABC324-F](../../src/content/technique-inventory/shard-00/abc324-f.json) | `optimize-ratio-by-parametric-search` | — | `process-dag-in-topological-order`<br>`prove-and-search-threshold` | ○ / — / ○ | 比率をbenefit−x·costへ変換しDAG最長路で判定。閾値探索は実際に使う既習手順として整合。 |
| [ABC324-G](../../src/content/technique-inventory/shard-03/abc324-g.json) | `merge-small-into-large` | — | `maintain-ordered-set-statistics` | ○ / — / ○ | 分割の小さい側だけ移す逆small-to-large。 |
| [ABC325-E](../../src/content/technique-inventory/shard-01/abc325-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | mode切替点の前後距離を二つのDijkstraで合成。 |
| [ABC325-F](../../src/content/technique-inventory/shard-00/abc325-f.json) | `design-resource-dp` | — | — | ○ / — / ○ | 一資源をindex、他資源最小量をvalueにするDP。 |
| [ABC325-G](../../src/content/technique-inventory/shard-03/abc325-g.json) | `design-interval-split-dp` | — | — | ○ / — / ○ | 最後の削除位置で区間を独立分割。 |
| [ABC326-E](../../src/content/technique-inventory/shard-05/abc326-e.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic`<br>`reorder-counting-contributions` | ○ / — / ○ | 報酬発生の到達確率をprefix和で伝播。 |
| [ABC326-F](../../src/content/technique-inventory/shard-01/abc326-f.json) | `split-enumeration-space` | — | `recover-valid-witness` | ○ / — / ○ | 独立軸の符号和MITMと回転操作復元。 |
| [ABC326-G](../../src/content/technique-inventory/shard-05/abc326-g.json) | `model-max-flow-min-cut` | — | — | ○ / — / ○ | threshold含意の最大closureをmincut。 |
| [ABC327-E](../../src/content/technique-inventory/shard-03/abc327-e.json) | `design-order-preserving-dp` | — | — | ○ / — / ○ | 選択個数別の減衰付きsubsequence DP。 |
| [ABC327-F](../../src/content/technique-inventory/shard-04/abc327-f.json) | `linearize-events` | — | `design-range-update-action` | ○ / — / ○ | 開始時刻・位置のrectangle被覆sweepとlazy max。 |
| [ABC327-G](../../src/content/technique-inventory/shard-05/abc327-g.json) | `count-labeled-structures-by-components` | — | `account-for-color-swap-in-connected-bipartite-counting`<br>`compute-in-modular-arithmetic`<br>`correct-overlap-by-inversion`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | connected成分抽出・色反転補正・surjection包除。 |
| [ABC328-E](../../src/content/technique-inventory/shard-05/abc328-e.json) | `enumerate-bounded-candidates-or-cases` | — | `maintain-connectivity-components` | ○ / — / ○ | mod目的なので小さい全tree候補を列挙しDSU検証。 |
| [ABC328-F](../../src/content/technique-inventory/shard-05/abc328-f.json) | `maintain-potential-differences` | — | — | ○ / — / ○ | potential差付きDSUで整合制約を追加。 |
| [ABC328-G](../../src/content/technique-inventory/shard-03/abc328-g.json) | `enumerate-subset-state-space` | — | — | ○ / — / ○ | 使用index集合に未使用blockをappendするsubset DP。 |
| [ABC329-E](../../src/content/technique-inventory/shard-02/abc329-e.json) | `reverse-update-time` | — | `bound-monotone-total-work` | ○ / — / ○ | 最後のstampを消す逆操作と局所固定点伝播。 |
| [ABC329-F](../../src/content/technique-inventory/shard-05/abc329-f.json) | `merge-small-into-large` | — | — | ○ / — / ○ | 小集合を大集合へ移し消滅・倍増で課金。 |
| [ABC329-G](../../src/content/technique-inventory/shard-04/abc329-g.json) | `aggregate-rooted-tree` | — | `answer-tree-ancestor-queries` | ○ / — / ○ | child tour順の資源木DP、LCAで順序制約を抽出。 |
| [ABC330-E](../../src/content/technique-inventory/shard-05/abc330-e.json) | `maintain-ordered-set-statistics` | — | — | ○ / — / ○ | 頻度零の値をordered setに保持しmex取得。 |
| [ABC330-F](../../src/content/technique-inventory/shard-05/abc330-f.json) | `prove-and-search-threshold` | — | `linearize-static-range-information`<br>`optimize-univariate-convex-function` | ○ / — / ○ | 辺長の単調探索、軸別clamp凸最小化とprefix費用。 |
| [ABC330-G](../../src/content/technique-inventory/shard-03/abc330-g.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic`<br>`linearize-static-range-information` | ○ / — / ○ | 転倒二次momentをindicator pairへ展開して集約。 |
| [ABC331-E](../../src/content/technique-inventory/shard-02/abc331-e.json) | `enumerate-frontier-best-first` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 降順候補列のk-way heap merge、禁止数で打切り上界。 |
| [ABC331-F](../../src/content/technique-inventory/shard-01/abc331-f.json) | `design-associative-range-summary` | — | `compare-sequences-by-rolling-fingerprint` | ○ / — / ○ | 双方向rolling hashを順序付きrange monoidにする。 |
| [ABC331-G](../../src/content/technique-inventory/shard-02/abc331-g.json) | `correct-overlap-by-inversion` | `encode-counting-by-generating-function` | `compute-convolution-or-correlation`<br>`compute-in-modular-arithmetic`<br>`divide-search-space-recursively` | ○ / ○ / ○ | 未完了確率の包除が主、符号付きsubset母関数が追加主技能。 |
| [ABC332-E](../../src/content/technique-inventory/shard-01/abc332-e.json) | `enumerate-subset-state-space` | — | — | ○ / — / ○ | 最後のgroupを切り出すsubset partition DP。 |
| [ABC332-F](../../src/content/technique-inventory/shard-00/abc332-f.json) | `design-range-update-action` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 期待値のaffine更新をlazy作用として合成。 |
| [ABC332-G](../../src/content/technique-inventory/shard-01/abc332-g.json) | `model-max-flow-min-cut` | — | `design-resource-dp`<br>`linearize-events` | ○ / — / ○ | cut容量へ双対化し可分構造をknapsackとbreakpointで評価。 |
| [ABC333-E](../../src/content/technique-inventory/shard-00/abc333-e.json) | `recover-valid-witness` | — | `linearize-static-range-information`<br>`prove-greedy-order` | ○ / — / ○ | 最新発見との対応を復元、交換法と保持数prefixが補助。 |
| [ABC333-F](../../src/content/technique-inventory/shard-03/abc333-f.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic`<br>`slide-transition-recurrence` | ○ / — / ○ | 除去位置の確率分布を等比級数とsliding recurrenceで更新。 |
| [ABC333-G](../../src/content/technique-inventory/shard-05/abc333-g.json) | `approximate-rational-by-euclid` | — | — | ○ / — / ○ | 連分数の途中係数を分母上限で切る近似。 |
| [ABC334-E](../../src/content/technique-inventory/shard-04/abc334-e.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 変更cellごとの成分数を近傍IDから求め平均。 |
| [ABC334-F](../../src/content/technique-inventory/shard-02/abc334-f.json) | `factor-and-accelerate-transitions` | — | `prune-dominated-candidates-once` | ○ / — / ○ | 補充境界DPを窓最小へ加速、dequeが補助。 |
| [ABC334-G](../../src/content/technique-inventory/shard-01/abc334-g.json) | `identify-bridges-and-articulations` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | lowlinkで頂点削除後の分離成分数を算出。 |
| [ABC335-E](../../src/content/technique-inventory/shard-05/abc335-e.json) | `maintain-connectivity-components` | `process-dag-in-topological-order` | — | ○ / ○ / ○ | 同値辺縮約が主、strict DAG最長路が追加主技能。 |
| [ABC335-F](../../src/content/technique-inventory/shard-00/abc335-f.json) | `balance-heavy-light-threshold` | — | — | ○ / — / ○ | 小step剰余bucket・大step直接配布の平方分割。 |
| [ABC335-G](../../src/content/technique-inventory/shard-00/abc335-g.json) | `count-through-cyclic-exponents` | `find-period-by-multiplicative-order` | `compute-in-modular-arithmetic`<br>`decompose-by-prime-or-divisor`<br>`invert-divisor-lattice-by-mobius` | ○ / ○ / ○ | 巡回群の部分群包含が主、位数抽出が追加主技能、約数zetaが補助。 |
| [ABC336-E](../../src/content/technique-inventory/shard-05/abc336-e.json) | `count-prefix-constrained-objects` | — | — | ○ / — / ○ | 最終桁和を固定した剰余・tight桁DP。 |
| [ABC336-F](../../src/content/technique-inventory/shard-02/abc336-f.json) | `split-enumeration-space` | — | `select-state-graph-search` | ○ / — / ○ | 20手を10+10へ分ける盤面MITM BFS。 |
| [ABC336-G](../../src/content/technique-inventory/shard-05/abc336-g.json) | `count-euler-circuits-by-best` | — | `compute-in-modular-arithmetic`<br>`construct-euler-trail-or-circuit`<br>`count-combinatorial-objects-by-determinant`<br>`formulate-combinatorial-coefficients` | ○ / — / × | BESTによる列数計算と有向行列木が中心。Euler存在条件は使うがHierholzer構成は不要。F4。 |
| [ABC337-E](../../src/content/technique-inventory/shard-04/abc337-e.json) | `design-query-code-by-information-bound` | — | `maintain-interactive-query-protocol` | ○ / — / ○ | 情報量下界に一致するbinary質問符号。 |
| [ABC337-F](../../src/content/technique-inventory/shard-02/abc337-f.json) | `maintain-monotone-window` | — | — | ○ / — / ○ | 円環窓の色別chance数を二ポインタ差分更新。 |
| [ABC337-G](../../src/content/technique-inventory/shard-05/abc337-g.json) | `flatten-tree-by-euler-order` | — | `linearize-events`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | Euler区間化とlabel閾値BIT sweep。 |
| [ABC338-E](../../src/content/technique-inventory/shard-00/abc338-e.json) | `detect-crossing-by-cyclic-order` | — | — | ○ / — / ○ | 弦の交互端点を括弧stack不一致で検出。 |
| [ABC338-F](../../src/content/technique-inventory/shard-00/abc338-f.json) | `enumerate-subset-state-space` | — | `compute-all-pairs-distance` | ○ / — / ○ | 負閉路なしのmetric closure上でsubset巡回DP。 |
| [ABC338-G](../../src/content/technique-inventory/shard-03/abc338-g.json) | `compress-dp-sufficient-aggregates` | — | — | ○ / — / ○ | 式評価のpre・mul・term総和が線形に閉じる。 |
| [ABC339-E](../../src/content/technique-inventory/shard-00/abc339-e.json) | `aggregate-subsequence-transitions-by-value` | — | `design-associative-range-summary` | ○ / — / ○ | 値域range maxによる部分列DP。 |
| [ABC339-F](../../src/content/technique-inventory/shard-00/abc339-f.json) | `compare-algebraic-objects-by-random-fingerprint` | — | `design-and-bound-randomized-algorithm` | ○ / — / ○ | 巨大整数積を乱択素数mod fingerprintで判定。 |
| [ABC339-G](../../src/content/technique-inventory/shard-00/abc339-g.json) | `build-static-sorted-range-index` | — | — | ○ / — / ○ | 静的sorted nodeとprefix和のmerge-sort tree。 |
| [ABC340-E](../../src/content/technique-inventory/shard-03/abc340-e.json) | `design-range-update-action` | — | — | ○ / — / ○ | 周期配布を全体加算と余り区間加算へ。 |
| [ABC340-F](../../src/content/technique-inventory/shard-00/abc340-f.json) | `characterize-integer-solvability` | — | — | ○ / — / ○ | 整数面積条件をBézout一次不定方程式へ。 |
| [ABC340-G](../../src/content/technique-inventory/shard-05/abc340-g.json) | `build-virtual-tree` | — | `aggregate-rooted-tree` | ○ / — / ○ | 色頂点virtual treeで境界degree木DP。 |
| [ABC341-E](../../src/content/technique-inventory/shard-02/abc341-e.json) | `linearize-static-range-information` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | 隣接差分で反転を二境界更新にしBIT判定。 |
| [ABC341-F](../../src/content/technique-inventory/shard-02/abc341-f.json) | `design-resource-dp` | — | `process-dag-in-topological-order` | ○ / — / ○ | 頂点weight順にneighbor knapsackを確定。 |
| [ABC341-G](../../src/content/technique-inventory/shard-04/abc341-g.json) | `restrict-geometric-candidates-to-boundary` | — | — | ○ / — / ○ | prefix点の最大傾きを凸包隣接点へ限定。 |
| [ABC342-E](../../src/content/technique-inventory/shard-01/abc342-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | latest-time版Dijkstraと時刻表floor計算。 |
| [ABC342-F](../../src/content/technique-inventory/shard-03/abc342-f.json) | `optimize-stochastic-actions` | — | `factor-and-accelerate-transitions` | ○ / — / ○ | dealer吸収分布に対する最適停止Bellman、窓和加速。 |
| [ABC342-G](../../src/content/technique-inventory/shard-04/abc342-g.json) | `decompose-ranges-into-segment-tree-nodes` | — | `maintain-ordered-set-statistics` | ○ / — / ○ | 取消可能なrange候補をcanonical nodeへ配布。 |
| [ABC343-E](../../src/content/technique-inventory/shard-03/abc343-e.json) | `enumerate-bounded-candidates-or-cases` | — | `correct-overlap-by-inversion`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | cube配置の有限列挙、体積のexact coverage包除。 |
| [ABC343-F](../../src/content/technique-inventory/shard-04/abc343-f.json) | `design-associative-range-summary` | — | — | ○ / — / ○ | 上位二distinct値と頻度のmonoid。 |
| [ABC343-G](../../src/content/technique-inventory/shard-00/abc343-g.json) | `enumerate-subset-state-space` | — | `build-prefix-match-state` | ○ / — / ○ | 冗長substring除去後のoverlap subset TSP。 |
| [ABC344-E](../../src/content/technique-inventory/shard-01/abc344-e.json) | `maintain-local-sequence-links` | — | — | ○ / — / ○ | 値からnodeを引き局所prev/nextを張替え。 |
| [ABC344-F](../../src/content/technique-inventory/shard-01/abc344-f.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 最良収入源と支配されない行動・資金pairへ圧縮。 |
| [ABC344-G](../../src/content/technique-inventory/shard-05/abc344-g.json) | `maintain-order-through-crossing-events` | — | `linearize-events` | ○ / — / ○ | 隣接crossingのkinetic順序更新、query sweepが補助。 |
| [ABC345-E](../../src/content/technique-inventory/shard-04/abc345-e.json) | `design-minimal-sufficient-state` | — | `design-order-preserving-dp` | ○ / — / ○ | 除外色に対するtop-2十分状態、削除数DPが補助。 |
| [ABC345-F](../../src/content/technique-inventory/shard-05/abc345-f.json) | `construct-degree-parity-subgraph` | — | `recover-valid-witness` | ○ / — / ○ | 木の葉から次数parityを確定し辺集合復元。 |
| [ABC345-G](../../src/content/technique-inventory/shard-04/abc345-g.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `balance-heavy-light-threshold`<br>`compute-in-modular-arithmetic`<br>`divide-search-space-recursively`<br>`formulate-combinatorial-coefficients` | ○ / ○ / ○ | survival係数の母関数が主、NTTが追加主技能、疎密使い分けが補助。 |
| [ABC346-E](../../src/content/technique-inventory/shard-03/abc346-e.json) | `reverse-update-time` | — | — | ○ / — / ○ | last-write-winsを逆順に確定。 |
| [ABC346-F](../../src/content/technique-inventory/shard-04/abc346-f.json) | `query-recursively-defined-string` | — | `prove-and-search-threshold` | ○ / — / ○ | 周期列のk-th occurrence jumpが主、答え探索が補助。 |
| [ABC346-G](../../src/content/technique-inventory/shard-04/abc346-g.json) | `linearize-events` | — | `design-range-update-action` | ○ / — / ○ | 一回出現のrectangle unionをrange cover sweep。 |
| [ABC347-E](../../src/content/technique-inventory/shard-04/abc347-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 要素のactive期間へ集合size寄与をprefix集約。 |
| [ABC347-F](../../src/content/technique-inventory/shard-01/abc347-f.json) | `enumerate-bounded-candidates-or-cases` | — | `design-grid-table-dp`<br>`linearize-static-range-information` | ○ / — / ○ | 三正方形のseparator型を列挙し方向別maxで評価。 |
| [ABC347-G](../../src/content/technique-inventory/shard-04/abc347-g.json) | `model-max-flow-min-cut` | — | — | ○ / — / ○ | 多値thresholdのsubmodular costをcutへ。 |
| [ABC348-E](../../src/content/technique-inventory/shard-01/abc348-e.json) | `reroot-tree-aggregation` | — | — | ○ / — / ○ | 根移動時の重み距離総和差分。 |
| [ABC348-F](../../src/content/technique-inventory/shard-03/abc348-f.json) | `accelerate-set-operations-with-bitsets` | — | — | ○ / — / ○ | 値一致集合のbitset XORでpair parity。 |
| [ABC348-G](../../src/content/technique-inventory/shard-01/abc348-g.json) | `optimize-monge-transitions` | — | `divide-search-space-recursively` | ○ / — / ○ | 凹max-plus convolutionのMonge最適化と分割統治。 |
| [ABC349-E](../../src/content/technique-inventory/shard-02/abc349-e.json) | `evaluate-adversarial-game-value` | — | — | ○ / — / ○ | 有限盤面のterminal勝敗からminimax。 |
| [ABC349-F](../../src/content/technique-inventory/shard-02/abc349-f.json) | `apply-subset-zeta-mobius-transform` | — | `compute-in-modular-arithmetic`<br>`decompose-by-prime-or-divisor` | ○ / — / ○ | 最大素数冪coverageを集合zeta・Möbiusで計数。 |
| [ABC349-G](../../src/content/technique-inventory/shard-03/abc349-g.json) | `characterize-palindrome-intervals` | — | `maintain-connectivity-components`<br>`recover-valid-witness` | ○ / — / ○ | Manacher mirrorで対称制約を圧縮、DSUと構成復元が補助。 |
| [ABC350-E](../../src/content/technique-inventory/shard-02/abc350-e.json) | `optimize-stochastic-actions` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 除算の疎状態でself-loopを解いた確率行動最適化。 |
| [ABC350-F](../../src/content/technique-inventory/shard-00/abc350-f.json) | `query-recursively-defined-string` | — | — | ○ / — / ○ | 括弧対応jumpと向き反転で展開せず出力。 |
| [ABC350-G](../../src/content/technique-inventory/shard-04/abc350-g.json) | `balance-heavy-light-threshold` | — | — | ○ / — / ○ | base forest再構築と少数pending辺の平方分割。 |
| [ABC351-E](../../src/content/technique-inventory/shard-02/abc351-e.json) | `reduce-geometry-to-algebraic-predicates` | — | `reorder-counting-contributions` | ○ / — / ○ | 45度変換とparityで軸別距離寄与へ分解。 |
| [ABC351-F](../../src/content/technique-inventory/shard-00/abc351-f.json) | `maintain-weighted-prefix-statistics` | — | `compress-sparse-keys`<br>`linearize-events` | ○ / — / ○ | 値prefixの個数・総和BITと座標圧縮。 |
| [ABC351-G](../../src/content/technique-inventory/shard-02/abc351-g.json) | `compose-dynamic-tree-clusters` | — | `apply-heavy-light-decomposition` | ○ / — / ○ | Static Top Treeのrake/compressで動的木DP。 |
| [ABC352-E](../../src/content/technique-inventory/shard-00/abc352-e.json) | `construct-optimal-spanning-tree` | — | `maintain-connectivity-components` | ○ / — / ○ | 同重みcliqueを疎な証明木にしてKruskal。 |
| [ABC352-F](../../src/content/technique-inventory/shard-04/abc352-f.json) | `enumerate-subset-state-space` | — | `propagate-static-graph-potentials` | ○ / — / ○ | potential成分のshift maskをexact cover subset DP。 |
| [ABC352-G](../../src/content/technique-inventory/shard-03/abc352-g.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `compute-in-modular-arithmetic`<br>`divide-search-space-recursively`<br>`formulate-combinatorial-coefficients`<br>`reorder-counting-contributions` | ○ / ○ / ○ | 無重複生存確率の係数設計が主、積のNTTが追加主技能。 |
| [ABC353-E](../../src/content/technique-inventory/shard-01/abc353-e.json) | `index-shared-prefixes-with-trie` | — | `reorder-counting-contributions` | ○ / — / ○ | LCPを共有prefix数へ分解しtrie頻度計数。 |
| [ABC353-F](../../src/content/technique-inventory/shard-02/abc353-f.json) | `reduce-geometry-to-algebraic-predicates` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 周期tileのgatewayと閉形式距離を有限比較。 |
| [ABC353-G](../../src/content/technique-inventory/shard-01/abc353-g.json) | `factor-and-accelerate-transitions` | — | `design-associative-range-summary` | ○ / — / ○ | 絶対値遷移を二符号range maxへ因数分解。 |
| [ABC354-E](../../src/content/technique-inventory/shard-02/abc354-e.json) | `classify-game-states` | — | `enumerate-subset-state-space` | ○ / — / ○ | 残存集合の勝敗DP。 |
| [ABC354-F](../../src/content/technique-inventory/shard-01/abc354-f.json) | `aggregate-subsequence-transitions-by-value` | — | `compress-sparse-keys`<br>`design-associative-range-summary` | ○ / — / ○ | 前後LISの値域DPを一点で接続。 |
| [ABC354-G](../../src/content/technique-inventory/shard-03/abc354-g.json) | `optimize-poset-antichain-by-dilworth` | — | `model-max-flow-min-cut` | ○ / — / ○ | 重み付きDilworthから容量mincutへ帰着。 |
| [ABC355-E](../../src/content/technique-inventory/shard-03/abc355-e.json) | `select-state-graph-search` | `maintain-interactive-query-protocol` | `build-shortest-path-certificate` | ○ / ○ / ○ | 最少質問の境界graph BFSが主、protocolが追加主技能。 |
| [ABC355-F](../../src/content/technique-inventory/shard-05/abc355-f.json) | `derive-mst-weight-from-threshold-components` | — | `maintain-connectivity-components` | ○ / — / ○ | MST重みを閾値成分数の層和にし並列DSU。 |
| [ABC355-G](../../src/content/technique-inventory/shard-00/abc355-g.json) | `optimize-by-lagrangian-relaxation` | `optimize-monge-transitions` | — | ○ / ○ / ○ | 個数制約のLagrange双対が主、Monge oracleが追加主技能。 |
| [ABC356-E](../../src/content/technique-inventory/shard-02/abc356-e.json) | `partition-integer-parameter-ranges` | — | — | ○ / — / ○ | 商一定区間を頻度prefixで集約。 |
| [ABC356-F](../../src/content/technique-inventory/shard-01/abc356-f.json) | `maintain-ordered-set-statistics` | — | `compress-sparse-keys`<br>`design-associative-range-summary` | ○ / — / ○ | active隣接gapの局所更新とrange境界探索。 |
| [ABC356-G](../../src/content/technique-inventory/shard-02/abc356-g.json) | `restrict-geometric-candidates-to-boundary` | — | — | ○ / — / ○ | 資源rateの凸混合境界を支持線query。 |
| [ABC357-E](../../src/content/technique-inventory/shard-04/abc357-e.json) | `decompose-functional-graph` | — | — | ○ / — / ○ | functional graph閉路長とtail suffix DP。 |
| [ABC357-F](../../src/content/technique-inventory/shard-03/abc357-f.json) | `design-range-update-action` | — | `design-associative-range-summary` | ○ / — / ○ | 積統計量のmomentを閉じるlazy作用。 |
| [ABC357-G](../../src/content/technique-inventory/shard-03/abc357-g.json) | `correct-overlap-by-inversion` | `compute-online-relaxed-convolution` | `divide-search-space-recursively`<br>`formulate-combinatorial-coefficients` | ○ / ○ / ○ | 障害物包除が主、因果畳み込みが追加主技能。 |
| [ABC358-E](../../src/content/technique-inventory/shard-05/abc358-e.json) | `formulate-combinatorial-coefficients` | — | — | ○ / — / ○ | 同一文字の挿入位置を二項係数DP。 |
| [ABC358-F](../../src/content/technique-inventory/shard-02/abc358-f.json) | `recover-valid-witness` | — | — | ○ / — / ○ | parityに合うsnake pathを先に作り壁へ変換。 |
| [ABC358-G](../../src/content/technique-inventory/shard-01/abc358-g.json) | `close-eventual-dp-tail` | — | `design-grid-table-dp` | ○ / — / ○ | 有限prefix後を最良報酬滞在tailに閉じる。 |
| [ABC359-E](../../src/content/technique-inventory/shard-05/abc359-e.json) | `prune-dominated-candidates-once` | — | — | ○ / — / ○ | suffix最大値blockの単調stack併合。 |
| [ABC359-F](../../src/content/technique-inventory/shard-00/abc359-f.json) | `allocate-by-convex-marginal-costs` | — | `enumerate-frontier-best-first`<br>`prove-greedy-order` | ○ / — / ○ | 次数総和下の凸限界費用をheap選択。 |
| [ABC359-G](../../src/content/technique-inventory/shard-01/abc359-g.json) | `build-balanced-separator-decomposition` | — | `reorder-counting-contributions` | ○ / — / ○ | 重心を通る同label pair寄与を一度ずつ集計。 |
| [ABC360-E](../../src/content/technique-inventory/shard-02/abc360-e.json) | `propagate-probability-distribution` | — | `compute-in-modular-arithmetic`<br>`normalize-equivalent-states` | ○ / — / ○ | 対称二状態の確率遷移。 |
| [ABC360-F](../../src/content/technique-inventory/shard-02/abc360-f.json) | `linearize-events` | — | `compress-sparse-keys`<br>`design-range-update-action` | ○ / — / ○ | 交差条件rectangleの最大被覆と最左argmax。 |
| [ABC360-G](../../src/content/technique-inventory/shard-02/abc360-g.json) | `aggregate-subsequence-transitions-by-value` | — | `compress-sparse-keys`<br>`design-associative-range-summary` | ○ / — / ○ | 変更有無layer付き値域LIS。 |
| [ABC361-E](../../src/content/technique-inventory/shard-04/abc361-e.json) | `use-tree-diameter-extrema` | — | — | ○ / — / ○ | 開いた木walkの節約最大が直径。 |
| [ABC361-F](../../src/content/technique-inventory/shard-05/abc361-f.json) | `invert-divisor-lattice-by-mobius` | — | `partition-integer-parameter-ranges` | ○ / — / ○ | 冪指数のMöbius重複除去と整数根計算。 |
| [ABC361-G](../../src/content/technique-inventory/shard-03/abc361-g.json) | `select-state-graph-search` | — | `linearize-events` | ○ / — / ○ | 疎な障害物周囲flood fillと内部depth sweep。 |
| [ABC362-E](../../src/content/technique-inventory/shard-03/abc362-e.json) | `design-order-preserving-dp` | — | — | ○ / — / ○ | 公差別の部分列先頭追加DP。 |
| [ABC362-F](../../src/content/technique-inventory/shard-05/abc362-f.json) | `reorder-counting-contributions` | — | `find-weighted-balanced-separator`<br>`recover-valid-witness` | ○ / — / ○ | 辺cut寄与の上界を重心半周pairingで達成。 |
| [ABC362-G](../../src/content/technique-inventory/shard-04/abc362-g.json) | `build-suffix-lcp-index` | — | — | ○ / — / ○ | suffix順位のpattern一致区間を二分探索。 |
| [ABC363-E](../../src/content/technique-inventory/shard-05/abc363-e.json) | `linearize-events` | — | — | ○ / — / ○ | 浸水時刻bucket順に境界から伝播。 |
| [ABC363-F](../../src/content/technique-inventory/shard-02/abc363-f.json) | `recover-valid-witness` | — | `decompose-by-prime-or-divisor` | ○ / — / ○ | reverse因子対を外側へ足す回文構成。 |
| [ABC363-G](../../src/content/technique-inventory/shard-05/abc363-g.json) | `rollback-reversible-updates` | — | `characterize-bipartite-feasibility-by-hall`<br>`decompose-ranges-into-segment-tree-nodes`<br>`design-range-update-action` | ○ / — / ○ | 仕事version生存区間のrollback、Hall slackが交換可否を判定。 |
| [ABC364-E](../../src/content/technique-inventory/shard-04/abc364-e.json) | `design-resource-dp` | — | — | ○ / — / ○ | 個数・甘さに対する塩分最小knapsack。 |
| [ABC364-F](../../src/content/technique-inventory/shard-04/abc364-f.json) | `construct-optimal-spanning-tree` | — | `bound-monotone-total-work`<br>`maintain-connectivity-components`<br>`maintain-ordered-set-statistics` | ○ / — / ○ | implicit Kruskalで未併合境界だけ削除走査。 |
| [ABC364-G](../../src/content/technique-inventory/shard-01/abc364-g.json) | `solve-steiner-tree-by-subset-dp` | — | `model-and-compute-shortest-path` | ○ / — / ○ | Steiner subset mergeと距離閉包。 |
| [ABC365-E](../../src/content/technique-inventory/shard-03/abc365-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | prefix XOR parityの異値pairをbit別寄与計数。 |
| [ABC365-F](../../src/content/technique-inventory/shard-04/abc365-f.json) | `design-associative-range-summary` | — | — | ○ / — / ○ | clampと費用関数の有限parameter合成monoid。 |
| [ABC365-G](../../src/content/technique-inventory/shard-04/abc365-g.json) | `balance-heavy-light-threshold` | — | `maintain-monotone-window` | ○ / — / ○ | heavy在室履歴を全相手前計算、lightは区間二点法。 |
| [ABC366-E](../../src/content/technique-inventory/shard-01/abc366-e.json) | `reduce-geometry-to-algebraic-predicates` | — | `maintain-monotone-window` | ○ / — / ○ | Manhattan軸分離後のcost pair数を二点法。 |
| [ABC366-F](../../src/content/technique-inventory/shard-00/abc366-f.json) | `prove-greedy-order` | — | `design-resource-dp` | ○ / — / ○ | affine交換差による順序固定と個数選択DP。 |
| [ABC366-G](../../src/content/technique-inventory/shard-00/abc366-g.json) | `solve-linear-system-and-rank` | — | `accelerate-set-operations-with-bitsets`<br>`recover-valid-witness` | ○ / — / ○ | GF2 kernel基底を復元し出力bitにpack。 |
| [ABC367-E](../../src/content/technique-inventory/shard-01/abc367-e.json) | `jump-deterministic-transition` | — | — | ○ / — / ○ | 後継写像のK乗doubling。 |
| [ABC367-F](../../src/content/technique-inventory/shard-04/abc367-f.json) | `compare-algebraic-objects-by-random-fingerprint` | — | `design-and-bound-randomized-algorithm` | ○ / — / ○ | 頻度vectorの乱択加法hashとprefix差。 |
| [ABC367-G](../../src/content/technique-inventory/shard-04/abc367-g.json) | `factor-separable-linear-transform` | — | `encode-counting-by-generating-function` | ○ / — / ○ | XOR character変換と長さ剰余母関数。 |
| [ABC368-E](../../src/content/technique-inventory/shard-01/abc368-e.json) | `linearize-events` | — | — | ○ / — / ○ | 予定時刻の因果event順に遅延を確定。 |
| [ABC368-F](../../src/content/technique-inventory/shard-02/abc368-f.json) | `classify-game-states` | — | `decompose-by-prime-or-divisor` | ○ / — / ○ | 素因数総数をNim heapへ写す。 |
| [ABC368-G](../../src/content/technique-inventory/shard-04/abc368-g.json) | `bound-monotone-total-work` | — | `maintain-ordered-set-statistics`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | 特殊更新の値倍増上界と通常区間和。 |
| [ABC369-E](../../src/content/technique-inventory/shard-04/abc369-e.json) | `enumerate-bounded-candidates-or-cases` | — | `compute-all-pairs-distance` | ○ / — / ○ | 指定橋の順・方向列挙、自由区間はAPSP。 |
| [ABC369-F](../../src/content/technique-inventory/shard-04/abc369-f.json) | `design-lis-frontier` | — | `recover-valid-witness` | ○ / — / ○ | 二座標chainのLNDSとpredecessor復元。 |
| [ABC369-G](../../src/content/technique-inventory/shard-00/abc369-g.json) | `allocate-by-convex-marginal-costs` | — | `aggregate-rooted-tree` | ○ / — / ○ | 木DPの凹限界利得をmergeして上位K和。 |
| [ABC370-E](../../src/content/technique-inventory/shard-04/abc370-e.json) | `subtract-exception-transitions` | — | — | ○ / — / ○ | 全分割遷移から禁止prefix classだけ減算。 |
| [ABC370-F](../../src/content/technique-inventory/shard-03/abc370-f.json) | `maintain-monotone-window` | — | `jump-deterministic-transition`<br>`prove-and-search-threshold` | ○ / — / ○ | 尺取りnextのK反復doublingを閾値探索に使う。 |
| [ABC370-G](../../src/content/technique-inventory/shard-05/abc370-g.json) | `sum-multiplicative-function-by-min25-sieve` | — | `partition-integer-parameter-ranges` | ○ / — / ○ | 乗法的関数差のprefixをLucy/Min25で求める。 |
| [ABC371-E](../../src/content/technique-inventory/shard-03/abc371-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 値ごとの非出現gapを余事象で集計。 |
| [ABC371-F](../../src/content/technique-inventory/shard-00/abc371-f.json) | `design-range-update-action` | — | — | ○ / — / ○ | index差の単調列へ変換し境界探索・区間代入。 |
| [ABC371-G](../../src/content/technique-inventory/shard-01/abc371-g.json) | `prove-greedy-order` | `solve-modular-constraints` | `decompose-functional-graph` | ○ / ○ / ○ | 辞書順貪欲が主、prefixを守る合同類更新が追加主技能。 |
| [ABC372-E](../../src/content/technique-inventory/shard-00/abc372-e.json) | `augment-components-with-metadata` | — | — | ○ / — / ○ | DSU rootへ上位10のmetadata。 |
| [ABC372-F](../../src/content/technique-inventory/shard-05/abc372-f.json) | `normalize-common-dp-action` | — | — | ○ / — / ○ | 共通cycle shiftをindex offsetに吸収し例外だけ更新。 |
| [ABC372-G](../../src/content/technique-inventory/shard-01/abc372-g.json) | `optimize-by-line-envelope` | — | `sum-affine-floors-by-euclid` | ○ / — / ○ | 下包絡線区間ごとの整数上限floor_sum。 |
| [ABC373-E](../../src/content/technique-inventory/shard-05/abc373-e.json) | `prove-and-search-threshold` | — | — | ○ / — / ○ | 最悪妨害票をoracleとする単調探索。 |
| [ABC373-F](../../src/content/technique-inventory/shard-03/abc373-f.json) | `allocate-by-convex-marginal-costs` | — | `design-resource-dp`<br>`enumerate-frontier-best-first`<br>`prove-greedy-order` | ○ / — / ○ | 凹限界利得で個数別価値を作り重さgroup knapsack。 |
| [ABC373-G](../../src/content/technique-inventory/shard-05/abc373-g.json) | `solve-weighted-bipartite-matching` | — | — | ○ / — / ○ | uncrossingを距離和最小matchingへ埋め込む。 |
| [ABC374-E](../../src/content/technique-inventory/shard-01/abc374-e.json) | `prove-and-search-threshold` | — | `prove-greedy-order` | ○ / — / ○ | 交換可能束で小候補判定を作る予算二分探索。 |
| [ABC374-F](../../src/content/technique-inventory/shard-03/abc374-f.json) | `design-prefix-partition-dp` | — | `compress-sparse-keys`<br>`design-minimal-sufficient-state` | ○ / — / ○ | batch完了日の候補を圧縮したprefix分割DP。 |
| [ABC374-G](../../src/content/technique-inventory/shard-00/abc374-g.json) | `solve-bipartite-matching` | — | `compute-transitive-closure`<br>`condense-and-order-directed-graph` | ○ / — / ○ | SCCと推移閉包から二部matchingによるwalk cover。 |
| [ABC375-E](../../src/content/technique-inventory/shard-01/abc375-e.json) | `design-minimal-sufficient-state` | — | `design-resource-dp` | ○ / — / ○ | 第三群の和を消す十分状態と資源DP。 |
| [ABC375-F](../../src/content/technique-inventory/shard-04/abc375-f.json) | `reverse-update-time` | — | `compute-all-pairs-distance` | ○ / — / ○ | 辺削除逆順処理と一辺追加APSP。 |
| [ABC375-G](../../src/content/technique-inventory/shard-04/abc375-g.json) | `identify-bridges-and-articulations` | — | `model-and-compute-shortest-path` | ○ / — / ○ | 最短路部分graphのbridgeが必須辺。 |
| [ABC376-E](../../src/content/technique-inventory/shard-04/abc376-e.json) | `prove-greedy-order` | — | `maintain-ordered-set-statistics` | ○ / — / ○ | 最大A固定後にprefix最小B集合を選ぶ。 |
| [ABC376-F](../../src/content/technique-inventory/shard-01/abc376-f.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 直前操作で固定されない手の位置だけを状態にする。 |
| [ABC376-G](../../src/content/technique-inventory/shard-02/abc376-g.json) | `optimize-tree-order-by-cluster-contraction` | — | `enumerate-frontier-best-first`<br>`maintain-connectivity-components`<br>`prove-greedy-order` | ○ / — / ○ | 比率最大clusterの木順序縮約、heap・DSUが補助。 |
| [ABC377-E](../../src/content/technique-inventory/shard-00/abc377-e.json) | `decompose-functional-graph` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | permutation cycle上で指数2^Kを剰余化。 |
| [ABC377-F](../../src/content/technique-inventory/shard-02/abc377-f.json) | `reduce-geometry-to-algebraic-predicates` | — | `correct-overlap-by-inversion` | ○ / — / ○ | 疎な攻撃直線長と整数交点の重複補正。 |
| [ABC377-G](../../src/content/technique-inventory/shard-01/abc377-g.json) | `index-shared-prefixes-with-trie` | — | — | ○ / — / ○ | trie prefixに過去最小文字列長を保持。 |
| [ABC378-E](../../src/content/technique-inventory/shard-00/abc378-e.json) | `reorder-counting-contributions` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | mod差のwrap寄与をBITで計数。 |
| [ABC378-F](../../src/content/technique-inventory/shard-05/abc378-f.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | 次数3内部の端点数を木DP合成。 |
| [ABC378-G](../../src/content/technique-inventory/shard-00/abc378-g.json) | `translate-sequences-by-rsk` | — | `design-minimal-sufficient-state` | ○ / — / ○ | RSKでLIS/LDS制約をYoung形へ写しideal DP。 |
| [ABC379-E](../../src/content/technique-inventory/shard-05/abc379-e.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 桁ごとの寄与係数をcarry筆算で出力。 |
| [ABC379-F](../../src/content/technique-inventory/shard-05/abc379-f.json) | `prune-dominated-candidates-once` | — | — | ○ / — / ○ | 可視候補の単調stackとindex順位参照。 |
| [ABC379-G](../../src/content/technique-inventory/shard-03/abc379-g.json) | `design-frontier-profile-dp` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 一行の色を残すfrontier DPが核心。未来に必要な状態の十分性を既習前提として参照するのは整合。 |
| [ABC380-E](../../src/content/technique-inventory/shard-03/abc380-e.json) | `maintain-ordered-interval-partition` | — | — | ○ / — / ○ | 同値run区間をordered setで塗替え併合。 |
| [ABC380-F](../../src/content/technique-inventory/shard-02/abc380-f.json) | `classify-game-states` | — | — | ○ / — / ○ | 三進所有状態のメモ化勝敗ゲーム。 |
| [ABC380-G](../../src/content/technique-inventory/shard-00/abc380-g.json) | `reorder-counting-contributions` | — | `compute-in-modular-arithmetic`<br>`maintain-monotone-window`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | 窓内転倒の期待差をBITと窓移動で計算。 |
| [ABC381-E](../../src/content/technique-inventory/shard-04/abc381-e.json) | `prove-and-search-threshold` | — | — | ○ / — / ○ | 最早部分列位置oracleで長さ二分探索。 |
| [ABC381-F](../../src/content/technique-inventory/shard-00/abc381-f.json) | `enumerate-subset-state-space` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 種類maskごとに最早終了位置だけ保持。 |
| [ABC381-G](../../src/content/technique-inventory/shard-01/abc381-g.json) | `compute-in-finite-field-extension` | — | `compute-convolution-or-correlation`<br>`divide-search-space-recursively`<br>`evaluate-at-geometric-points` | ○ / — / ○ | 拡大体一般項が主、chirp-z等比点評価とNTTが補助。 |
| [ABC382-E](../../src/content/technique-inventory/shard-00/abc382-e.json) | `solve-stochastic-recurrence` | — | `design-resource-dp` | ○ / — / ○ | パック枚数分布を使うself-loop期待値再帰。 |
| [ABC382-F](../../src/content/technique-inventory/shard-03/abc382-f.json) | `design-range-update-action` | — | — | ○ / — / ○ | 落下支持面をrange min・assignで保持。 |
| [ABC382-G](../../src/content/technique-inventory/shard-01/abc382-g.json) | `normalize-equivalent-states` | — | — | ○ / — / ○ | 周期幾何を対称標準形へ移しblock移動で再帰縮約。 |
| [ABC383-E](../../src/content/technique-inventory/shard-05/abc383-e.json) | `sweep-connectivity-by-kruskal-threshold` | — | `augment-components-with-metadata`<br>`prove-greedy-order` | ○ / — / ○ | bottleneck閾値でDSU tokenをgreedy相殺。 |
| [ABC383-F](../../src/content/technique-inventory/shard-04/abc383-f.json) | `design-resource-dp` | — | — | ○ / — / ○ | 色group初購入bonus付きknapsack。 |
| [ABC383-G](../../src/content/technique-inventory/shard-05/abc383-g.json) | `allocate-by-convex-marginal-costs` | — | `divide-search-space-recursively` | ○ / — / ○ | 境界制約付き分割DPの凹限界差分merge。 |
| [ABC384-E](../../src/content/technique-inventory/shard-01/abc384-e.json) | `enumerate-frontier-best-first` | — | `prove-greedy-order` | ○ / — / ○ | 境界最弱のbest-firstと単調吸収greedy。 |
| [ABC384-F](../../src/content/technique-inventory/shard-04/abc384-f.json) | `decompose-by-prime-or-divisor` | — | — | ○ / — / ○ | 2進valuationの層差分と剰余補数pair集約。 |
| [ABC384-G](../../src/content/technique-inventory/shard-05/abc384-g.json) | `schedule-range-query-updates` | — | `compress-sparse-keys`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | 二prefix端のMo順と個数・和BIT。 |
| [ABC385-E](../../src/content/technique-inventory/shard-00/abc385-e.json) | `prove-greedy-order` | — | — | ○ / — / ○ | 中心固定後の上位次数prefixでbottleneck最大化。 |
| [ABC385-F](../../src/content/technique-inventory/shard-05/abc385-f.json) | `reduce-geometry-to-algebraic-predicates` | — | — | ○ / — / ○ | 隣接傾き条件の有理幾何評価。 |
| [ABC385-G](../../src/content/technique-inventory/shard-04/abc385-g.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `divide-search-space-recursively` | ○ / ○ / ○ | 順列挿入の係数設計が主、balanced NTT積が追加主技能。 |
| [ABC386-E](../../src/content/technique-inventory/shard-00/abc386-e.json) | `enumerate-bounded-candidates-or-cases` | — | — | ○ / — / ○ | 補集合XORで小さい選択側を列挙。 |
| [ABC386-F](../../src/content/technique-inventory/shard-01/abc386-f.json) | `compute-edit-distance` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 編集距離の帯下界と閾値cap。 |
| [ABC386-G](../../src/content/technique-inventory/shard-02/abc386-g.json) | `count-labeled-structures-by-components` | `reorder-counting-contributions` | `formulate-combinatorial-coefficients` | ○ / ○ / ○ | 連結graphのanchor分解が主、MST閾値寄与の総和が追加主技能。 |
| [ABC387-E](../../src/content/technique-inventory/shard-04/abc387-e.json) | `recover-valid-witness` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 先頭桁の有限被覆で巨大整数を構成。 |
| [ABC387-F](../../src/content/technique-inventory/shard-02/abc387-f.json) | `decompose-functional-graph` | — | `aggregate-rooted-tree`<br>`factor-and-accelerate-transitions` | ○ / — / ○ | functional cycle縮約後の累積和木DP。 |
| [ABC387-G](../../src/content/technique-inventory/shard-05/abc387-g.json) | `compose-series-and-project-powers` | `apply-formal-power-series-operations`<br>`encode-counting-by-generating-function` | `compute-convolution-or-correlation` | ○ / ○ / ○ | 暗黙EGFの高速compositionが主、Newton FPSと係数モデルが追加主技能。 |
| [ABC388-E](../../src/content/technique-inventory/shard-04/abc388-e.json) | `prove-greedy-order` | — | `prove-and-search-threshold` | ○ / — / ○ | extreme sorted matchingへの交換、個数二分探索が補助。 |
| [ABC388-F](../../src/content/technique-inventory/shard-00/abc388-f.json) | `bound-reachability-in-numerical-semigroup` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 数値半群の到達閾値で巨大安全区間を圧縮。 |
| [ABC388-G](../../src/content/technique-inventory/shard-05/abc388-g.json) | `prove-and-search-threshold` | — | `design-associative-range-summary`<br>`maintain-monotone-window` | ○ / — / ○ | 適合位置offsetのrange maxを単調境界探索。 |
| [ABC389-E](../../src/content/technique-inventory/shard-01/abc389-e.json) | `allocate-by-convex-marginal-costs` | — | `prove-and-search-threshold` | ○ / — / ○ | 凸限界価格で購入個数を閾値集約。 |
| [ABC389-F](../../src/content/technique-inventory/shard-04/abc389-f.json) | `design-range-update-action` | — | — | ○ / — / ○ | 単調写像のpreimage区間へlazy加算。 |
| [ABC389-G](../../src/content/technique-inventory/shard-05/abc389-g.json) | `design-minimal-sufficient-state` | — | `encode-counting-by-generating-function`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | BFS層サイズ・偶奇の十分状態、辺数多項式が補助。 |
| [ABC390-E](../../src/content/technique-inventory/shard-00/abc390-e.json) | `design-resource-dp` | — | `prove-greedy-order` | ○ / — / ○ | カテゴリ別knapsack後に水位をそろえる配分。 |
| [ABC390-F](../../src/content/technique-inventory/shard-05/abc390-f.json) | `reorder-counting-contributions` | — | — | ○ / — / ○ | 成分左端値のindicatorと非出現gap差。 |
| [ABC390-G](../../src/content/technique-inventory/shard-02/abc390-g.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `formulate-combinatorial-coefficients`<br>`reorder-counting-contributions` | ○ / ○ / ○ | 連結桁寄与のcategory母関数が主、NTTが追加主技能。 |
| [ABC391-E](../../src/content/technique-inventory/shard-00/abc391-e.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | majority gateの最小反転費用木DP。 |
| [ABC391-F](../../src/content/technique-inventory/shard-00/abc391-f.json) | `enumerate-frontier-best-first` | — | — | ○ / — / ○ | 単調三次元候補のbest-first。 |
| [ABC391-G](../../src/content/technique-inventory/shard-01/abc391-g.json) | `design-minimal-sufficient-state` | — | `run-dp-on-finite-automaton` | ○ / — / ○ | LCS row差分をmaskへ圧縮しautomaton計数。 |
| [ABC392-E](../../src/content/technique-inventory/shard-02/abc392-e.json) | `augment-components-with-metadata` | — | `recover-valid-witness` | ○ / — / ○ | 成分の余剰辺metadataを使う付替え構成。 |
| [ABC392-F](../../src/content/technique-inventory/shard-02/abc392-f.json) | `reverse-update-time` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | 挿入の逆過程と空席k-th BIT。 |
| [ABC392-G](../../src/content/technique-inventory/shard-01/abc392-g.json) | `compute-convolution-or-correlation` | `encode-counting-by-generating-function` | `formulate-combinatorial-coefficients` | ○ / ○ / ○ | 加法pair和の自己畳み込みが主、係数解釈が追加主技能。 |
| [ABC393-E](../../src/content/technique-inventory/shard-01/abc393-e.json) | `decompose-by-prime-or-divisor` | — | — | ○ / — / ○ | 倍数篩で条件を満たす約数を配布。 |
| [ABC393-F](../../src/content/technique-inventory/shard-04/abc393-f.json) | `design-lis-frontier` | — | `linearize-events` | ○ / — / ○ | prefixのLIS tailsを共有し値上限query。 |
| [ABC393-G](../../src/content/technique-inventory/shard-02/abc393-g.json) | `optimize-by-lagrangian-relaxation` | — | `approximate-rational-by-euclid`<br>`detect-improving-cycles`<br>`model-min-cost-flow` | ○ / — / ○ | 予算のLagrange双対を費用流、有理探索、potentialで実現。 |
| [ABC394-E](../../src/content/technique-inventory/shard-03/abc394-e.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 回文中心から両端状態を伸ばすBFS。 |
| [ABC394-F](../../src/content/technique-inventory/shard-01/abc394-f.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | open端点・closed完成のdegree制約木DP。 |
| [ABC394-G](../../src/content/technique-inventory/shard-02/abc394-g.json) | `share-threshold-checks-by-parallel-binary-search` | — | `linearize-events`<br>`maintain-connectivity-components`<br>`prove-and-search-threshold` | ○ / — / ○ | threshold DSU判定を並列二分探索で共有。 |
| [ABC395-E](../../src/content/technique-inventory/shard-05/abc395-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | 向き反転parity二層Dijkstra。 |
| [ABC395-F](../../src/content/technique-inventory/shard-00/abc395-f.json) | `prove-and-search-threshold` | — | — | ○ / — / ○ | 許容高さ区間の伝播による答え二分探索。 |
| [ABC395-G](../../src/content/technique-inventory/shard-04/abc395-g.json) | `solve-steiner-tree-by-subset-dp` | — | `model-and-compute-shortest-path` | ○ / — / ○ | 共通terminalを共有するSteiner subset DP。 |
| [ABC396-E](../../src/content/technique-inventory/shard-00/abc396-e.json) | `propagate-static-graph-potentials` | — | `recover-valid-witness` | ○ / — / ○ | xor potentialの矛盾検査と成分共通bit最小化。 |
| [ABC396-F](../../src/content/technique-inventory/shard-00/abc396-f.json) | `reorder-counting-contributions` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | wrapする一値groupの転倒寄与を差分更新。 |
| [ABC396-G](../../src/content/technique-inventory/shard-02/abc396-g.json) | `enumerate-subset-state-space` | — | — | ○ / — / ○ | column maskごとのHamming距離分布DP。 |
| [ABC397-E](../../src/content/technique-inventory/shard-03/abc397-e.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | 葉側pathを閉じて未完成成分を木DP伝播。 |
| [ABC397-F](../../src/content/technique-inventory/shard-00/abc397-f.json) | `design-range-update-action` | — | — | ○ / — / ○ | last occurrenceのcut区間へlazy加算。 |
| [ABC397-G](../../src/content/technique-inventory/shard-00/abc397-g.json) | `model-max-flow-min-cut` | — | `prove-and-search-threshold` | ○ / — / ○ | threshold multi-label cutによる距離延長可否。 |
| [ABC398-E](../../src/content/technique-inventory/shard-01/abc398-e.json) | `solve-game-by-parity-invariant` | `color-and-classify-bipartite-components` | `maintain-interactive-query-protocol` | ○ / ○ / ○ | 残合法手のparityが主、二部彩色が追加主技能。 |
| [ABC398-F](../../src/content/technique-inventory/shard-05/abc398-f.json) | `characterize-palindrome-intervals` | — | — | ○ / — / ○ | 最長回文suffixをManacherで取得。 |
| [ABC398-G](../../src/content/technique-inventory/shard-02/abc398-g.json) | `solve-game-by-parity-invariant` | `color-and-classify-bipartite-components` | — | ○ / ○ / ○ | 成分彩色型から手数parityを決定。parityがhome。 |
| [ABC399-E](../../src/content/technique-inventory/shard-04/abc399-e.json) | `decompose-functional-graph` | — | — | ○ / — / ○ | 文字写像のfunctional graphと一時symbolでcycle解消。 |
| [ABC399-F](../../src/content/technique-inventory/shard-01/abc399-f.json) | `formulate-combinatorial-coefficients` | — | — | ○ / — / ○ | K乗をlabel選択分配としてbinomial計数。 |
| [ABC399-G](../../src/content/technique-inventory/shard-01/abc399-g.json) | `test-linear-matroid-intersection-rank` | — | `design-and-bound-randomized-algorithm`<br>`solve-linear-system-and-rank` | ○ / — / ○ | 線形matroid intersectionの乱択rank検査。 |
| [ABC400-E](../../src/content/technique-inventory/shard-04/abc400-e.json) | `decompose-by-prime-or-divisor` | — | — | ○ / — / ○ | 平方根の相異素因数数を篩う。 |
| [ABC400-F](../../src/content/technique-inventory/shard-05/abc400-f.json) | `design-interval-split-dp` | — | — | ○ / — / ○ | 円環消去過程の区間分割DP。 |
| [ABC400-G](../../src/content/technique-inventory/shard-04/abc400-g.json) | `optimize-by-lagrangian-relaxation` | — | `enumerate-subset-state-space` | ○ / — / ○ | penalty付きAlien DPを三種parity状態で評価。 |
| [ABC401-E](../../src/content/technique-inventory/shard-04/abc401-e.json) | `augment-components-with-metadata` | — | `linearize-events` | ○ / — / ○ | prefix成分のsizeと外部境界をDSU管理。 |
| [ABC401-F](../../src/content/technique-inventory/shard-02/abc401-f.json) | `use-tree-diameter-extrema` | — | `reorder-counting-contributions` | ○ / — / ○ | 二木のeccentricityを直径両端から得て寄与和。 |
| [ABC401-G](../../src/content/technique-inventory/shard-02/abc401-g.json) | `solve-bipartite-matching` | — | `prove-and-search-threshold` | ○ / — / ○ | 距離thresholdの完全二部matching。 |
| [ABC402-E](../../src/content/technique-inventory/shard-01/abc402-e.json) | `optimize-stochastic-actions` | — | `enumerate-subset-state-space` | ○ / — / ○ | 既solve集合と予算の確率行動DP。 |
| [ABC402-F](../../src/content/technique-inventory/shard-05/abc402-f.json) | `split-enumeration-space` | — | — | ○ / — / ○ | 反対角線でpath剰余MITM。 |
| [ABC402-G](../../src/content/technique-inventory/shard-01/abc402-g.json) | `sum-affine-floors-by-euclid` | — | — | ○ / — / ○ | 二つのfloor積を一般化floor_sumへ還元。 |
| [ABC403-E](../../src/content/technique-inventory/shard-00/abc403-e.json) | `bound-monotone-total-work` | — | `index-shared-prefixes-with-trie` | ○ / — / ○ | trie待機Yの一度だけの除外に課金。 |
| [ABC403-F](../../src/content/technique-inventory/shard-04/abc403-f.json) | `design-minimal-sufficient-state` | — | `decompose-by-prime-or-divisor`<br>`recover-valid-witness` | ○ / — / ○ | 構文カテゴリを十分状態にした式復元DP。 |
| [ABC403-G](../../src/content/technique-inventory/shard-04/abc403-g.json) | `maintain-sparse-domain-segment-tree` | — | — | ○ / — / ○ | 疎値域node生成とparity順序統計monoid。 |
| [ABC404-E](../../src/content/technique-inventory/shard-02/abc404-e.json) | `prove-greedy-order` | — | — | ○ / — / ○ | 豆の合流を安全な交換順へ正規化。 |
| [ABC404-F](../../src/content/technique-inventory/shard-03/abc404-f.json) | `optimize-stochastic-actions` | — | `normalize-equivalent-states` | ○ / — / ○ | ボタン対称性を消した有限期間確率行動DP。 |
| [ABC404-G](../../src/content/technique-inventory/shard-03/abc404-g.json) | `solve-difference-constraints` | — | `linearize-static-range-information` | ○ / — / ○ | prefix不等式の差分制約Bellman–Ford。 |
| [ABC405-E](../../src/content/technique-inventory/shard-00/abc405-e.json) | `formulate-combinatorial-coefficients` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 境界果物固定後の二項係数積。 |
| [ABC405-F](../../src/content/technique-inventory/shard-03/abc405-f.json) | `build-laminar-interval-containment-tree` | — | `answer-tree-ancestor-queries`<br>`detect-crossing-by-cyclic-order` | ○ / — / ○ | 弦のlaminar包含木とLCA距離。 |
| [ABC405-G](../../src/content/technique-inventory/shard-00/abc405-g.json) | `schedule-range-query-updates` | — | `aggregate-value-prefix-by-buckets`<br>`formulate-combinatorial-coefficients`<br>`maintain-modular-product-under-factor-updates` | ○ / — / ○ | Moで頻度を更新し値bucketの逆階乗積を照会。 |
| [ABC406-E](../../src/content/technique-inventory/shard-01/abc406-e.json) | `count-prefix-constrained-objects` | — | — | ○ / — / ○ | popcount制約の個数・数値和bit桁DP。 |
| [ABC406-F](../../src/content/technique-inventory/shard-05/abc406-f.json) | `flatten-tree-by-euler-order` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | Euler部分木区間と重みBIT。 |
| [ABC406-G](../../src/content/technique-inventory/shard-01/abc406-g.json) | `maintain-piecewise-linear-convex-function` | — | `maintain-ordered-set-statistics`<br>`recover-valid-witness` | ○ / — / ○ | 傾きclipのSlope Trickと最適座標復元。 |
| [ABC407-E](../../src/content/technique-inventory/shard-00/abc407-e.json) | `prove-greedy-order` | — | `enumerate-frontier-best-first` | ○ / — / ○ | 括弧prefixの必要枠を最大heap交換法で選ぶ。 |
| [ABC407-F](../../src/content/technique-inventory/shard-05/abc407-f.json) | `reorder-counting-contributions` | — | `linearize-events`<br>`linearize-static-range-information`<br>`maintain-ordered-set-statistics` | ○ / — / ○ | 最大値担当区間を値sweepで求め二階差分に寄与。 |
| [ABC407-G](../../src/content/technique-inventory/shard-04/abc407-g.json) | `model-min-cost-flow` | — | — | ○ / — / ○ | domino重みmatchingを任意流量費用曲線で評価。 |
| [ABC408-E](../../src/content/technique-inventory/shard-03/abc408-e.json) | `optimize-mask-by-bitwise-feasibility` | — | `maintain-connectivity-components`<br>`prove-greedy-order` | ○ / — / ○ | OR maskの上位bit可否greedyとDSU。 |
| [ABC408-F](../../src/content/technique-inventory/shard-04/abc408-f.json) | `factor-and-accelerate-transitions` | — | `design-associative-range-summary`<br>`linearize-events` | ○ / — / ○ | 高さでeligible化した位置range max遷移。 |
| [ABC408-G](../../src/content/technique-inventory/shard-04/abc408-g.json) | `approximate-rational-by-euclid` | — | — | ○ / — / ○ | 整数部分と逆数のEuclid再帰で最小分母。 |
| [ABC409-E](../../src/content/technique-inventory/shard-02/abc409-e.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | 木cut保存量の絶対値を部分木和で算出。 |
| [ABC409-F](../../src/content/technique-inventory/shard-02/abc409-f.json) | `enumerate-frontier-best-first` | — | `enumerate-bounded-candidates-or-cases`<br>`maintain-connectivity-components` | ○ / — / ○ | 距離pair heapの遅延削除とDSU併合。 |
| [ABC409-G](../../src/content/technique-inventory/shard-05/abc409-g.json) | `compute-convolution-or-correlation` | `encode-counting-by-generating-function` | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients`<br>`solve-stochastic-recurrence` | ○ / ○ / ○ | factorial分離した期待値kernelのNTTがhome。 |
| [ABC410-E](../../src/content/technique-inventory/shard-01/abc410-e.json) | `design-resource-dp` | — | — | ○ / — / ○ | 魔力ごと最大体力を残す資源DP。 |
| [ABC410-F](../../src/content/technique-inventory/shard-03/abc410-f.json) | `linearize-static-range-information` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 短辺二端固定後に零和prefix pairを計数。 |
| [ABC410-G](../../src/content/technique-inventory/shard-03/abc410-g.json) | `aggregate-subsequence-transitions-by-value` | — | `design-associative-range-summary`<br>`linearize-events`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 包含chainの値域DP、幾何区間化とsweepが補助。 |
| [ABC411-E](../../src/content/technique-inventory/shard-02/abc411-e.json) | `reorder-counting-contributions` | `maintain-modular-product-under-factor-updates` | `compute-in-modular-arithmetic`<br>`linearize-events` | ○ / ○ / ○ | CDF期待寄与が主、零因子込み動的積が追加主技能。 |
| [ABC411-F](../../src/content/technique-inventory/shard-03/abc411-f.json) | `merge-small-into-large` | — | — | ○ / — / ○ | 縮約頂点の駒・隣接をsmall-to-largeで移す。 |
| [ABC411-G](../../src/content/technique-inventory/shard-00/abc411-g.json) | `enumerate-subset-state-space` | — | `compute-in-modular-arithmetic`<br>`normalize-equivalent-states` | ○ / — / ○ | 最大頂点を固定したcycle subset DPと向き補正。 |
| [ABC412-E](../../src/content/technique-inventory/shard-04/abc412-e.json) | `decompose-by-prime-or-divisor` | — | — | ○ / — / ○ | LCM更新点を素数冪として区間篩。 |
| [ABC412-F](../../src/content/technique-inventory/shard-02/abc412-f.json) | `solve-stochastic-recurrence` | — | `compute-in-modular-arithmetic`<br>`factor-and-accelerate-transitions`<br>`prove-greedy-order` | ○ / — / ○ | 色順greedy方策のself-loop期待値をsuffix和で解く。 |
| [ABC412-G](../../src/content/technique-inventory/shard-01/abc412-g.json) | `solve-min-weight-general-perfect-matching` | — | — | ○ / — / ○ | degree stub展開後の一般重み付き完全matching。 |
| [ABC413-E](../../src/content/technique-inventory/shard-04/abc413-e.json) | `divide-search-space-recursively` | — | — | ○ / — / ○ | 二分区間の最適形を再帰合成。 |
| [ABC413-F](../../src/content/technique-inventory/shard-03/abc413-f.json) | `solve-cyclic-minimax-game` | — | `select-state-graph-search` | ○ / — / ○ | 妨害後の二番目値を後退解析、多源BFS順に確定。 |
| [ABC413-G](../../src/content/technique-inventory/shard-03/abc413-g.json) | `dualize-planar-cut-to-path` | — | `maintain-connectivity-components` | ○ / — / ○ | 平面cutを外周二arc間のdual pathへ変換。 |
| [ABC414-E](../../src/content/technique-inventory/shard-03/abc414-e.json) | `partition-integer-parameter-ranges` | — | — | ○ / — / ○ | 非倍数tuple数を商一定区間で集計。 |
| [ABC414-F](../../src/content/technique-inventory/shard-00/abc414-f.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 直前辺・step状態のBFSとincoming二候補制限。 |
| [ABC414-G](../../src/content/technique-inventory/shard-05/abc414-g.json) | `model-and-compute-shortest-path` | — | `decompose-ranges-into-segment-tree-nodes` | ○ / — / ○ | 区間辺をsegment tree graphで疎化してDijkstra。 |
| [ABC415-E](../../src/content/technique-inventory/shard-02/abc415-e.json) | `design-grid-table-dp` | — | — | ○ / — / ○ | 後続必要額から逆算するgrid DP。 |
| [ABC415-F](../../src/content/technique-inventory/shard-03/abc415-f.json) | `design-associative-range-summary` | — | — | ○ / — / ○ | prefix/suffix runの結合monoid。 |
| [ABC415-G](../../src/content/technique-inventory/shard-02/abc415-g.json) | `stabilize-unbounded-knapsack-by-best-density` | — | `prove-greedy-order` | ○ / — / ○ | 最良密度反復と有界例外DPの安定化。 |
| [ABC416-E](../../src/content/technique-inventory/shard-02/abc416-e.json) | `compute-all-pairs-distance` | — | — | ○ / — / ○ | hub疎化と一辺追加APSP更新。 |
| [ABC416-F](../../src/content/technique-inventory/shard-01/abc416-f.json) | `aggregate-rooted-tree` | — | `design-resource-dp` | ○ / — / ○ | 端点status付きpath数木knapsack。 |
| [ABC416-G](../../src/content/technique-inventory/shard-00/abc416-g.json) | `design-minimal-sufficient-state` | — | `prove-greedy-order` | ○ / — / ○ | 最小周期文字列上のphase DP、連結比較が補助。 |
| [ABC417-E](../../src/content/technique-inventory/shard-03/abc417-e.json) | `prove-greedy-order` | — | `select-state-graph-search` | ○ / — / ○ | 残graph到達性oracle付き辞書順貪欲。 |
| [ABC417-F](../../src/content/technique-inventory/shard-01/abc417-f.json) | `design-range-update-action` | — | `compute-in-modular-arithmetic`<br>`reorder-counting-contributions` | ○ / — / ○ | 期待総量の均等配分をlazy代入。 |
| [ABC417-G](../../src/content/technique-inventory/shard-01/abc417-g.json) | `query-recursively-defined-string` | — | `bound-monotone-total-work`<br>`jump-deterministic-transition` | ○ / — / ○ | concat DAGの位置query、heavy反復doublingとlight上界。 |
| [ABC418-E](../../src/content/technique-inventory/shard-03/abc418-e.json) | `reorder-counting-contributions` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 辺方向pairの寄与から平行四辺形二重計数を引く。 |
| [ABC418-F](../../src/content/technique-inventory/shard-02/abc418-f.json) | `design-associative-range-summary` | — | `maintain-ordered-set-statistics` | ○ / — / ○ | 動く制約間の転送行列積とordered neighbor更新。 |
| [ABC418-G](../../src/content/technique-inventory/shard-01/abc418-g.json) | `build-finite-string-automaton` | `run-dp-on-finite-automaton` | `design-interval-split-dp`<br>`design-minimal-sufficient-state` | ○ / ○ / ○ | Myhill–Nerode同値類からDFA構築が主、DPが追加主技能。 |
| [ABC419-E](../../src/content/technique-inventory/shard-03/abc419-e.json) | `design-resource-dp` | — | — | ○ / — / ○ | window差でindex剰余classへ分けmod knapsack。 |
| [ABC419-F](../../src/content/technique-inventory/shard-01/abc419-f.json) | `build-multi-pattern-automaton` | `run-dp-on-finite-automaton` | `enumerate-subset-state-space` | ○ / ○ / ○ | Aho–Corasick構築が主、生成DPが追加主技能、包含maskが補助。 |
| [ABC419-G](../../src/content/technique-inventory/shard-02/abc419-g.json) | `kernelize-near-tree-graph` | `use-cycle-space-basis` | `enumerate-bounded-candidates-or-cases`<br>`enumerate-by-reversible-backtracking` | ○ / ○ / ○ | near-tree kernelが主、cycle空間の候補数証明が追加主技能。 |
| [ABC420-E](../../src/content/technique-inventory/shard-01/abc420-e.json) | `augment-components-with-metadata` | — | — | ○ / — / ○ | DSU root黒数の加法metadata。 |
| [ABC420-F](../../src/content/technique-inventory/shard-02/abc420-f.json) | `build-cartesian-tree-decomposition` | — | `linearize-static-range-information`<br>`prune-dominated-candidates-once` | ○ / — / ○ | Cartesianの最小担当区間とfloor重みprefix。 |
| [ABC420-G](../../src/content/technique-inventory/shard-05/abc420-g.json) | `decompose-by-prime-or-divisor` | — | — | ○ / — / ○ | 平方差をsigned約数対へ変換。 |
| [ABC421-E](../../src/content/technique-inventory/shard-04/abc421-e.json) | `optimize-stochastic-actions` | — | `normalize-equivalent-states` | ○ / — / ○ | 保持出目multisetの確率行動DP。 |
| [ABC421-F](../../src/content/technique-inventory/shard-00/abc421-f.json) | `maintain-local-sequence-links` | — | `bound-monotone-total-work` | ○ / — / ○ | 局所linkと削除要素に課金する並行探索。 |
| [ABC421-G](../../src/content/technique-inventory/shard-04/abc421-g.json) | `model-min-cost-flow` | — | `linearize-static-range-information` | ○ / — / ○ | 差分端点の移送を費用flowにする。 |
| [ABC422-E](../../src/content/technique-inventory/shard-04/abc422-e.json) | `design-and-bound-randomized-algorithm` | — | `reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | majority直線を乱択二点から候補生成し全点検証。 |
| [ABC422-F](../../src/content/technique-inventory/shard-02/abc422-f.json) | `design-minimal-sufficient-state` | — | `reorder-counting-contributions` | ○ / — / ○ | 残stepでpath二重和の係数を固定した状態DP。 |
| [ABC422-G](../../src/content/technique-inventory/shard-04/abc422-g.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients` | ○ / ○ / ○ | OGF/EGFの使い分けがhome、NTT積が追加主技能。 |
| [ABC423-E](../../src/content/technique-inventory/shard-02/abc423-e.json) | `reorder-counting-contributions` | — | `linearize-static-range-information` | ○ / — / ○ | 各要素の包含回数を二次重みprefixへ分離。 |
| [ABC423-F](../../src/content/technique-inventory/shard-04/abc423-f.json) | `apply-subset-zeta-mobius-transform` | — | — | ○ / — / ○ | subset LCM条件のsuperset Möbius反転。 |
| [ABC423-G](../../src/content/technique-inventory/shard-03/abc423-g.json) | `solve-modular-constraints` | — | `enumerate-bounded-candidates-or-cases` | ○ / — / ○ | 連結整数の一次合同式と短い桁側列挙。 |
| [ABC424-E](../../src/content/technique-inventory/shard-02/abc424-e.json) | `prove-and-search-threshold` | — | `count-implicit-binary-tree-layers` | ○ / — / ○ | 分割深さの層数式で個数を評価する閾値探索。 |
| [ABC424-F](../../src/content/technique-inventory/shard-05/abc424-f.json) | `design-associative-range-summary` | — | `detect-crossing-by-cyclic-order` | ○ / — / ○ | 弦のlaminar条件を括弧monoidへ。 |
| [ABC424-G](../../src/content/technique-inventory/shard-05/abc424-g.json) | `design-resource-dp` | — | `characterize-bipartite-feasibility-by-hall` | ○ / — / ○ | 降順需要のHall prefix制約付きknapsack。 |
| [ABC425-E](../../src/content/technique-inventory/shard-02/abc425-e.json) | `formulate-combinatorial-coefficients` | — | — | ○ / — / ○ | 多項係数を二項係数の逐次積。 |
| [ABC425-F](../../src/content/technique-inventory/shard-03/abc425-f.json) | `enumerate-subset-state-space` | — | `normalize-equivalent-states` | ○ / — / ○ | 削除位置の同値遷移代表を選ぶsubset DP。 |
| [ABC425-G](../../src/content/technique-inventory/shard-00/abc425-g.json) | `query-bitwise-order-with-trie` | — | `divide-search-space-recursively` | ○ / — / ○ | 最高bitでquery領域とTrie候補を再帰分割。 |
| [ABC426-E](../../src/content/technique-inventory/shard-02/abc426-e.json) | `reduce-geometry-to-algebraic-predicates` | — | — | ○ / — / ○ | 相対運動を点線分距離へ写す。 |
| [ABC426-F](../../src/content/technique-inventory/shard-02/abc426-f.json) | `design-range-update-action` | — | `bound-monotone-total-work` | ○ / — / ○ | 在庫range減算と一度だけの負位置除去。 |
| [ABC426-G](../../src/content/technique-inventory/shard-02/abc426-g.json) | `divide-search-space-recursively` | — | `design-resource-dp` | ○ / — / ○ | queryを初分離nodeで処理するprefix/suffix knapsack分割統治。 |
| [ABC427-E](../../src/content/technique-inventory/shard-02/abc427-e.json) | `select-state-graph-search` | — | `design-minimal-sufficient-state`<br>`linearize-static-range-information` | ○ / — / ○ | 残る初期矩形・共通変位のBFS、矩形和で空判定。 |
| [ABC427-F](../../src/content/technique-inventory/shard-04/abc427-f.json) | `split-enumeration-space` | — | — | ○ / — / ○ | 非隣接集合のMITM、境界採否で結合制約。 |
| [ABC427-G](../../src/content/technique-inventory/shard-03/abc427-g.json) | `normalize-equivalent-states` | — | `bound-monotone-total-work`<br>`prove-and-search-threshold` | ○ / — / ○ | 列を同じ作用の標準形へ正規化し二進blockでmerge。 |
| [ABC428-E](../../src/content/technique-inventory/shard-02/abc428-e.json) | `use-tree-diameter-extrema` | — | — | ○ / — / ○ | 微小tie-breakを埋め込む木直径両端。 |
| [ABC428-F](../../src/content/technique-inventory/shard-01/abc428-f.json) | `bound-monotone-total-work` | — | `maintain-endpoint-run-partition` | ○ / — / ○ | 端の整列block消滅に課金する償却。 |
| [ABC428-G](../../src/content/technique-inventory/shard-02/abc428-g.json) | `count-orbits-by-fixed-points` | — | `compute-in-modular-arithmetic`<br>`decompose-by-prime-or-divisor`<br>`design-resource-dp` | ○ / — / ○ | 回転不動点のBurnsideと積DP。 |
| [ABC429-E](../../src/content/technique-inventory/shard-04/abc429-e.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 異なる始点labelを二件受理するmulti-source BFS。 |
| [ABC429-F](../../src/content/technique-inventory/shard-04/abc429-f.json) | `design-associative-range-summary` | — | `exponentiate-transition-over-semiring`<br>`relax-in-dependency-order` | ○ / — / ○ | 列のmin-plus区間積。半環Outcomeは区間積も含むため累乗不要。 |
| [ABC429-G](../../src/content/technique-inventory/shard-05/abc429-g.json) | `evaluate-compressed-integer-blocks` | — | `accelerate-fixed-linear-transition` | ○ / — / ○ | 剰余列の小差stepから等差指数blockを作り等比和。 |
| [ABC430-E](../../src/content/technique-inventory/shard-01/abc430-e.json) | `build-prefix-match-state` | — | — | ○ / — / ○ | 二倍文字列の回転一致をZで検査。 |
| [ABC430-F](../../src/content/technique-inventory/shard-05/abc430-f.json) | `linearize-static-range-information` | — | — | ○ / — / ○ | 順位可能区間をrun長から求め差分加算。 |
| [ABC430-G](../../src/content/technique-inventory/shard-01/abc430-g.json) | `prune-range-actions-by-node-invariant` | — | `accelerate-set-operations-with-bitsets`<br>`bound-monotone-total-work` | ○ / — / ○ | 混在bit減少をpotentialとする集合写像Beats。 |
| [ABC431-E](../../src/content/technique-inventory/shard-03/abc431-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | 鏡の入射出射を方向状態の0/1最短路。 |
| [ABC431-F](../../src/content/technique-inventory/shard-04/abc431-f.json) | `formulate-combinatorial-coefficients` | — | `maintain-monotone-window` | ○ / — / ○ | gap挿入の重複組合せと値頻度窓。 |
| [ABC431-G](../../src/content/technique-inventory/shard-02/abc431-g.json) | `maintain-ordered-set-statistics` | — | `compress-sparse-keys`<br>`linearize-events`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | swap結果の辞書順keyをsuffix順序統計で選択。 |
| [ABC432-E](../../src/content/technique-inventory/shard-00/abc432-e.json) | `design-associative-range-summary` | — | — | ○ / — / ○ | 値域count・sumで区分線形総和を取得。 |
| [ABC432-F](../../src/content/technique-inventory/shard-02/abc432-f.json) | `enumerate-subset-state-space` | — | `prove-greedy-order`<br>`recover-valid-witness` | ○ / — / ○ | 平均一致subsetの最大成分分割と送金復元。 |
| [ABC432-G](../../src/content/technique-inventory/shard-04/abc432-g.json) | `compute-convolution-or-correlation` | `encode-counting-by-generating-function` | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients` | ○ / ○ / ○ | factorial分離の二項和畳み込みがhome。 |
| [ABC433-E](../../src/content/technique-inventory/shard-00/abc433-e.json) | `prove-greedy-order` | — | `linearize-events` | ○ / — / ○ | 最大値の必須位置を降順に確定しbucket解禁。 |
| [ABC433-F](../../src/content/technique-inventory/shard-03/abc433-f.json) | `formulate-combinatorial-coefficients` | — | `reorder-counting-contributions` | ○ / — / ○ | 中央担当位置の二項和をVandermondeで閉じる。 |
| [ABC433-G](../../src/content/technique-inventory/shard-02/abc433-g.json) | `build-suffix-automaton` | — | `classify-game-states` | ○ / — / ○ | Suffix Automatonのright contextがゲーム局面を共有。 |
| [ABC434-E](../../src/content/technique-inventory/shard-00/abc434-e.json) | `augment-components-with-metadata` | — | `compress-sparse-keys` | ○ / — / ○ | 候補選択graphの成分V,Eをmetadata集計。 |
| [ABC434-F](../../src/content/technique-inventory/shard-00/abc434-f.json) | `prove-greedy-order` | — | `build-prefix-match-state` | ○ / — / ○ | 連結比較交換法と第二候補を絞るZ比較。 |
| [ABC434-G](../../src/content/technique-inventory/shard-02/abc434-g.json) | `design-associative-range-summary` | — | — | ○ / — / ○ | 削除正規形の区間積、不足summaryは子へ降下。 |
| [ABC435-E](../../src/content/technique-inventory/shard-00/abc435-e.json) | `maintain-ordered-interval-partition` | — | `bound-monotone-total-work` | ○ / — / ○ | 白runのsplit・eraseと消滅償却。 |
| [ABC435-F](../../src/content/technique-inventory/shard-01/abc435-f.json) | `build-cartesian-tree-decomposition` | — | `aggregate-rooted-tree`<br>`design-minimal-sufficient-state`<br>`prune-dominated-candidates-once` | ○ / — / ○ | Cartesian極大区間に状態を圧縮し木DP。 |
| [ABC435-G](../../src/content/technique-inventory/shard-00/abc435-g.json) | `normalize-common-dp-action` | — | — | ○ / — / ○ | DP共通affine作用を外へ出し対称差だけ補正。 |
| [ABC436-E](../../src/content/technique-inventory/shard-01/abc436-e.json) | `decompose-functional-graph` | — | — | ○ / — / ○ | 最短swapのcycle分割条件から同cycle pair数。 |
| [ABC436-F](../../src/content/technique-inventory/shard-05/abc436-f.json) | `reorder-counting-contributions` | — | `linearize-events`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | 一意最小の担当を固定し値sweepと位置BIT。 |
| [ABC436-G](../../src/content/technique-inventory/shard-05/abc436-g.json) | `encode-counting-by-generating-function` | `compute-convolution-or-correlation` | `factor-and-accelerate-transitions` | ○ / ○ / ○ | digit母関数の係数作用が主、NTTが追加主技能。 |
| [ABC437-E](../../src/content/technique-inventory/shard-02/abc437-e.json) | `index-shared-prefixes-with-trie` | — | — | ○ / — / ○ | 整数Trieの終端優先・兄弟順DFS。 |
| [ABC437-F](../../src/content/technique-inventory/shard-05/abc437-f.json) | `reduce-geometry-to-algebraic-predicates` | — | `design-associative-range-summary` | ○ / — / ○ | Manhattan回転後のrange四極値。 |
| [ABC437-G](../../src/content/technique-inventory/shard-02/abc437-g.json) | `model-max-flow-min-cut` | — | `color-and-classify-bipartite-components`<br>`recover-valid-witness` | ○ / — / ○ | 色回数割当のflowと木二部彩色・操作復元。 |
| [ABC438-E](../../src/content/technique-inventory/shard-05/abc438-e.json) | `jump-deterministic-transition` | — | — | ○ / — / ○ | 遷移先と重み和のdoubling。 |
| [ABC438-F](../../src/content/technique-inventory/shard-02/abc438-f.json) | `reorder-counting-contributions` | — | `aggregate-rooted-tree`<br>`answer-tree-ancestor-queries` | ○ / — / ○ | mex tail条件のpath包含をLCA・部分木sizeで計数。 |
| [ABC438-G](../../src/content/technique-inventory/shard-02/abc438-g.json) | `reduce-integer-structure-by-gcd` | — | `linearize-events`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | gcdで周期class分解し剰余置換後のBIT sweep。 |
| [ABC439-E](../../src/content/technique-inventory/shard-02/abc439-e.json) | `design-lis-frontier` | — | — | ○ / — / ○ | 同値軸逆順tie-break付き二次元LIS。 |
| [ABC439-F](../../src/content/technique-inventory/shard-05/abc439-f.json) | `reorder-counting-contributions` | — | `compress-sparse-keys`<br>`compute-in-modular-arithmetic`<br>`maintain-weighted-prefix-statistics` | ○ / — / ○ | 端点寄与の2冪を因数分解し重みBIT。 |
| [ABC439-G](../../src/content/technique-inventory/shard-05/abc439-g.json) | `compose-series-and-project-powers` | `apply-formal-power-series-operations`<br>`encode-counting-by-generating-function` | `compute-convolution-or-correlation`<br>`compute-in-modular-arithmetic`<br>`divide-search-space-recursively` | ○ / ○ / ○ | power projectionが主、確率母関数と有理FPSが追加主技能。 |
| [ABC440-E](../../src/content/technique-inventory/shard-00/abc440-e.json) | `enumerate-frontier-best-first` | — | — | ○ / — / ○ | 枚数vectorの単調best-first列挙。 |
| [ABC440-F](../../src/content/technique-inventory/shard-04/abc440-f.json) | `design-associative-range-summary` | — | `prove-greedy-order` | ○ / — / ○ | count・sum順序統計monoidと交換法。 |
| [ABC440-G](../../src/content/technique-inventory/shard-03/abc440-g.json) | `design-minimal-sufficient-state` | — | `augment-components-with-metadata` | ○ / — / ○ | 一回下降の境界状態DPと階内成分metadata。 |
| [ABC441-E](../../src/content/technique-inventory/shard-03/abc441-e.json) | `linearize-static-range-information` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | prefix差の大小pairをBITで計数。 |
| [ABC441-F](../../src/content/technique-inventory/shard-00/abc441-f.json) | `design-resource-dp` | — | — | ○ / — / ○ | prefix/suffix knapsackから要素有無の最適値分類。 |
| [ABC441-G](../../src/content/technique-inventory/shard-04/abc441-g.json) | `design-range-update-action` | — | — | ○ / — / ○ | 向きと追加量を合成するlazy作用。 |
| [ABC442-E](../../src/content/technique-inventory/shard-01/abc442-e.json) | `reduce-geometry-to-algebraic-predicates` | — | — | ○ / — / ○ | 整数偏角と同半直線blockの円環順位。 |
| [ABC442-F](../../src/content/technique-inventory/shard-04/abc442-f.json) | `factor-and-accelerate-transitions` | — | — | ○ / — / ○ | 単調行境界のsuffix minimum遷移。 |
| [ABC442-G](../../src/content/technique-inventory/shard-00/abc442-g.json) | `enumerate-bounded-candidates-or-cases` | — | — | ○ / — / ○ | LCM剰余36caseと共通重量group選択。 |
| [ABC443-E](../../src/content/technique-inventory/shard-03/abc443-e.json) | `design-grid-table-dp` | — | — | ○ / — / ○ | 最下壁を前計算して上向きgrid到達DP。 |
| [ABC443-F](../../src/content/technique-inventory/shard-04/abc443-f.json) | `select-state-graph-search` | — | `recover-valid-witness` | ○ / — / ○ | 剰余・末尾桁BFSの最短辞書順復元。 |
| [ABC443-G](../../src/content/technique-inventory/shard-04/abc443-g.json) | `sum-affine-floors-by-euclid` | — | — | ○ / — / ○ | 剰余条件のindicatorをfloor差として合計。 |
| [ABC444-E](../../src/content/technique-inventory/shard-04/abc444-e.json) | `maintain-monotone-window` | — | `maintain-ordered-set-statistics` | ○ / — / ○ | 窓内距離条件をordered neighborで検査する尺取り。 |
| [ABC444-F](../../src/content/technique-inventory/shard-02/abc444-f.json) | `prove-and-search-threshold` | — | `evaluate-compressed-integer-blocks` | ○ / — / ○ | 分割木の同長個数を圧縮した可否探索。 |
| [ABC444-G](../../src/content/technique-inventory/shard-02/abc444-g.json) | `represent-integers-as-two-squares` | — | `decompose-functional-graph` | ○ / — / ○ | Gaussian因子分配と有限剰余軌道の周期集計。 |
| [ABC445-E](../../src/content/technique-inventory/shard-00/abc445-e.json) | `decompose-by-prime-or-divisor` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 素数指数top2で除外LCMを法逆元補正。 |
| [ABC445-F](../../src/content/technique-inventory/shard-05/abc445-f.json) | `exponentiate-transition-over-semiring` | — | — | ○ / — / ○ | 固定歩数のmin-plus行列累乗。 |
| [ABC445-G](../../src/content/technique-inventory/shard-02/abc445-g.json) | `solve-bipartite-matching` | — | `color-and-classify-bipartite-components`<br>`reduce-integer-structure-by-gcd` | ○ / — / ○ | gcd尺度のparity彩色後に二部最大独立集合。 |
| [ABC446-E](../../src/content/technique-inventory/shard-05/abc446-e.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 目標集合から逆状態graph到達探索。 |
| [ABC446-F](../../src/content/technique-inventory/shard-05/abc446-f.json) | `select-state-graph-search` | — | — | ○ / — / ○ | 有効prefixの新規到達だけを増分展開。 |
| [ABC446-G](../../src/content/technique-inventory/shard-02/abc446-g.json) | `normalize-equivalent-states` | — | `factor-and-accelerate-transitions` | ○ / — / ○ | 辞書順最小embeddingの正準化と区間和DP。 |
| [ABC447-E](../../src/content/technique-inventory/shard-01/abc447-e.json) | `prove-greedy-order` | — | `maintain-connectivity-components` | ○ / — / ○ | 超増加重みの高位優先greedyとDSU。 |
| [ABC447-F](../../src/content/technique-inventory/shard-00/abc447-f.json) | `aggregate-rooted-tree` | — | — | ○ / — / ○ | 次数制約pathの上位二子木DP。 |
| [ABC447-G](../../src/content/technique-inventory/shard-00/abc447-g.json) | `design-associative-range-summary` | — | `linearize-events` | ○ / — / ○ | distinct category top4 summaryとparameter event更新。 |
| [ABC448-E](../../src/content/technique-inventory/shard-00/abc448-e.json) | `exponentiate-associative-composition` | — | `compute-in-modular-arithmetic` | ○ / — / ○ | 十進連結の結合則doublingと法拡張。 |
| [ABC448-F](../../src/content/technique-inventory/shard-05/abc448-f.json) | `recover-valid-witness` | — | — | ○ / — / ○ | strip蛇行で距離上界を満たす巡回列構成。 |
| [ABC448-G](../../src/content/technique-inventory/shard-05/abc448-g.json) | `optimize-by-line-envelope` | — | `localize-change-impact-by-witness` | ○ / — / ○ | 零和gameの線形包絡とsupport行だけの除外再計算。 |
| [ABC449-E](../../src/content/technique-inventory/shard-00/abc449-e.json) | `linearize-events` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | 頻度level eventをまとめoffline kth BIT。 |
| [ABC449-F](../../src/content/technique-inventory/shard-05/abc449-f.json) | `linearize-events` | — | `maintain-dynamic-interval-union-length` | ○ / — / ○ | 窓位置rectangle unionのsweep。 |
| [ABC449-G](../../src/content/technique-inventory/shard-01/abc449-g.json) | `encode-counting-by-generating-function` | `apply-formal-power-series-operations` | — | ○ / ○ / ○ | repunitを10冪和へ写し有界digit母関数を作るのが核心。Inventoryが採用案にFPSを明記しておりFPS追加主技能は成立。 |
| [ABC450-E](../../src/content/technique-inventory/shard-05/abc450-e.json) | `query-recursively-defined-string` | — | — | ○ / — / ○ | 再帰concatのprefix文字数query。 |
| [ABC450-F](../../src/content/technique-inventory/shard-03/abc450-f.json) | `design-minimal-sufficient-state` | — | `design-range-update-action` | ○ / — / ○ | 到達prefix最大だけのDPをlazy乗算で更新。 |
| [ABC450-G](../../src/content/technique-inventory/shard-03/abc450-g.json) | `solve-stochastic-recurrence` | — | `compute-in-modular-arithmetic`<br>`normalize-equivalent-states` | ○ / — / ○ | 交換対称なpair相関を期待値漸化式へ圧縮。 |
| [ABC451-E](../../src/content/technique-inventory/shard-04/abc451-e.json) | `reconstruct-tree-from-distance-matrix` | — | — | ○ / — / ○ | root距離加法から親復元し全距離検証。 |
| [ABC451-F](../../src/content/technique-inventory/shard-00/abc451-f.json) | `color-and-classify-bipartite-components` | — | `augment-components-with-metadata`<br>`merge-small-into-large` | ○ / — / ○ | 二部成分反転が核心、DSUとsmall-to-largeが補助。 |
| [ABC451-G](../../src/content/technique-inventory/shard-02/abc451-g.json) | `minimize-xor-coset-representative` | — | `map-graph-cycle-xor-to-span`<br>`query-bitwise-order-with-trie` | ○ / — / ○ | cycle XOR剰余類の最小代表が核心、spanとTrie計数が補助。 |
| [ABC452-E](../../src/content/technique-inventory/shard-03/abc452-e.json) | `partition-integer-parameter-ranges` | — | `linearize-static-range-information` | ○ / — / ○ | 商一定区間で重みprefix和を合成。 |
| [ABC452-F](../../src/content/technique-inventory/shard-01/abc452-f.json) | `maintain-monotone-window` | — | `maintain-weighted-prefix-statistics` | ○ / — / ○ | 転倒数付き尺取りとBIT差分。 |
| [ABC452-G](../../src/content/technique-inventory/shard-05/abc452-g.json) | `build-suffix-lcp-index` | — | — | ○ / — / ○ | RLEを短い記号列へ変えsuffix/LCP distinct計数。 |
| [ABC453-E](../../src/content/technique-inventory/shard-02/abc453-e.json) | `linearize-events` | — | `formulate-combinatorial-coefficients` | ○ / — / ○ | 四分類人数のevent sweepと自由枠二項係数。 |
| [ABC453-F](../../src/content/technique-inventory/shard-01/abc453-f.json) | `recover-valid-witness` | — | `find-weighted-balanced-separator`<br>`prove-greedy-order` | ○ / — / ○ | 葉重み重心とgroup均等化greedyによる彩色構成。 |
| [ABC453-G](../../src/content/technique-inventory/shard-05/abc453-g.json) | `persist-data-structure-versions` | — | `design-associative-range-summary` | ○ / — / ○ | path-copy永続segment treeとrange summary。 |
| [ABC454-E](../../src/content/technique-inventory/shard-03/abc454-e.json) | `recover-valid-witness` | — | `color-and-classify-bipartite-components` | ○ / — / ○ | 二部色数条件の後に外周stripを剥がす構成。 |
| [ABC454-F](../../src/content/technique-inventory/shard-05/abc454-f.json) | `linearize-static-range-information` | — | `prove-greedy-order` | ○ / — / ○ | 区間操作を差分移送へ写し方向別sort最適化。 |
| [ABC454-G](../../src/content/technique-inventory/shard-00/abc454-g.json) | `merge-small-into-large` | — | — | ○ / — / ○ | heavy tableを再利用するDSU on Tree。 |
| [ABC455-E](../../src/content/technique-inventory/shard-00/abc455-e.json) | `correct-overlap-by-inversion` | — | `linearize-static-range-information` | ○ / — / ○ | 三等値事象の包除とprefix差signature。 |
| [ABC455-F](../../src/content/technique-inventory/shard-03/abc455-f.json) | `design-range-update-action` | — | `compute-in-modular-arithmetic`<br>`reorder-counting-contributions` | ○ / — / ○ | pair不変寄与を二moment lazyで更新。 |
| [ABC455-G](../../src/content/technique-inventory/shard-01/abc455-g.json) | `compare-algebraic-objects-by-random-fingerprint` | — | `design-and-bound-randomized-algorithm`<br>`maintain-monotone-window` | ○ / — / ○ | 周期回数signatureの乱択hashと窓管理。 |
| [ABC456-E](../../src/content/technique-inventory/shard-03/abc456-e.json) | `peel-directed-graph-toward-cycles` | — | — | ○ / — / ○ | 場所phaseの有限有向cycle判定。 |
| [ABC456-F](../../src/content/technique-inventory/shard-02/abc456-f.json) | `maintain-queue-aggregate-with-swag` | — | `exponentiate-transition-over-semiring` | ○ / — / ○ | SWAGでmin-plus順序積。半環Outcomeに区間積が含まれる。 |
| [ABC456-G](../../src/content/technique-inventory/shard-04/abc456-g.json) | `correct-overlap-by-inversion` | — | `formulate-combinatorial-coefficients`<br>`maintain-modular-product-under-factor-updates` | ○ / — / ○ | run別包除とfrequency乗の積が核心。実装上の注意に零因子・mod逆元更新が明記され、動的積のSにも根拠がある。 |
| [ABC457-E](../../src/content/technique-inventory/shard-04/abc457-e.json) | `prove-greedy-order` | — | — | ○ / — / ○ | interval union候補を端点支配で有限caseへ絞る。 |
| [ABC457-F](../../src/content/technique-inventory/shard-01/abc457-f.json) | `normalize-common-dp-action` | — | `design-minimal-sufficient-state` | ○ / — / ○ | 相対rank DPの共通倍率lazyと二点補正。 |
| [ABC457-G](../../src/content/technique-inventory/shard-02/abc457-g.json) | `optimize-poset-antichain-by-dilworth` | — | `design-lis-frontier`<br>`reduce-geometry-to-algebraic-predicates` | ○ / — / ○ | 到達半順序のDilworthからLDS frontier。 |
| [ABC458-E](../../src/content/technique-inventory/shard-04/abc458-e.json) | `formulate-combinatorial-coefficients` | — | — | ○ / — / ○ | run数の正整数分割と残要素gap挿入。 |
| [ABC458-F](../../src/content/technique-inventory/shard-05/abc458-f.json) | `build-multi-pattern-automaton` | `run-dp-on-finite-automaton` | `accelerate-fixed-linear-transition` | ○ / ○ / ○ | Aho–Corasick構築と生成DPが主、行列累乗が補助。 |
| [ABC458-G](../../src/content/technique-inventory/shard-04/abc458-g.json) | `maintain-piecewise-linear-convex-function` | — | `prove-and-search-threshold` | ○ / — / ○ | 可否を成立させるSlope Trickが主、人数探索が補助。 |
| [ABC459-E](../../src/content/technique-inventory/shard-04/abc459-e.json) | `aggregate-rooted-tree` | — | `formulate-combinatorial-coefficients` | ○ / — / ○ | postorderで残供給を確定し二項係数を掛ける。 |
| [ABC459-F](../../src/content/technique-inventory/shard-04/abc459-f.json) | `solve-isotonic-regression-by-pav` | — | — | ○ / — / ○ | 整数PAVの違反block merge。 |
| [ABC459-G](../../src/content/technique-inventory/shard-04/abc459-g.json) | `characterize-integer-solvability` | — | `enumerate-bounded-candidates-or-cases`<br>`optimize-univariate-convex-function` | △ / 追加提案 / × | 整数解parameter化の後、二変数の折れ目交点と近傍格子で最小化する。この最適化の主技能化とSの修正が必要。F5。 |
| [ABC460-E](../../src/content/technique-inventory/shard-01/abc460-e.json) | `solve-modular-constraints` | — | — | ○ / — / ○ | 連結差を一次合同式にしgcdで解step取得。 |
| [ABC460-F](../../src/content/technique-inventory/shard-00/abc460-f.json) | `design-associative-range-summary` | — | `answer-tree-ancestor-queries`<br>`use-tree-diameter-extrema` | ○ / — / ○ | 直径端点のmerge monoidとLCA oracle。 |
| [ABC460-G](../../src/content/technique-inventory/shard-01/abc460-g.json) | `compose-dynamic-tree-clusters` | — | `reroot-tree-aggregation` | ○ / — / ○ | Static Top Treeで両向きreroot要約。 |
| [ABC461-E](../../src/content/technique-inventory/shard-04/abc461-e.json) | `maintain-weighted-prefix-statistics` | — | — | ○ / — / ○ | 行列last時刻のBITで上書き差分管理。 |
| [ABC461-F](../../src/content/technique-inventory/shard-04/abc461-f.json) | `design-resource-dp` | — | `decompose-by-prime-or-divisor` | ○ / — / ○ | 約数積stateのknapsackとscore総和。 |
| [ABC461-G](../../src/content/technique-inventory/shard-04/abc461-g.json) | `solve-bipartite-matching` | — | — | ○ / — / ○ | 二層変数複製で二部独立集合matching。 |
| [ABC462-E](../../src/content/technique-inventory/shard-05/abc462-e.json) | `normalize-equivalent-states` | — | `optimize-univariate-convex-function` | ○ / — / ○ | 対称正規化後のpiecewise-linear端点比較。 |
| [ABC462-F](../../src/content/technique-inventory/shard-00/abc462-f.json) | `design-minimal-sufficient-state` | — | — | ○ / — / ○ | 末尾pattern block採否の十分状態DP。 |
| [ABC462-G](../../src/content/technique-inventory/shard-00/abc462-g.json) | `correct-overlap-by-inversion` | — | `compute-convolution-or-correlation`<br>`compute-in-modular-arithmetic`<br>`encode-counting-by-generating-function` | ○ / — / ○ | 一致事象包除のclass多項式とNTT積。 |
| [ABC463-E](../../src/content/technique-inventory/shard-04/abc463-e.json) | `model-and-compute-shortest-path` | — | — | ○ / — / ○ | 完全辺costを超頂点へ分離しDijkstra。 |
| [ABC463-F](../../src/content/technique-inventory/shard-04/abc463-f.json) | `normalize-equivalent-states` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients` | ○ / — / ○ | 試合classの交換対称性と候補人数条件付け。 |
| [ABC463-G](../../src/content/technique-inventory/shard-01/abc463-g.json) | `formulate-combinatorial-coefficients` | — | `compute-in-modular-arithmetic`<br>`schedule-range-query-updates` | ○ / — / ○ | binomial prefix momentをparameter平面Moで共有。 |
| [ABC464-E](../../src/content/technique-inventory/shard-04/abc464-e.json) | `reverse-update-time` | — | `design-grid-table-dp` | ○ / — / ○ | last-write時刻のsuffix最大。逆走査だけでなく時刻静的化も定義内。 |
| [ABC464-F](../../src/content/technique-inventory/shard-00/abc464-f.json) | `split-enumeration-space` | — | `compute-in-modular-arithmetic`<br>`formulate-combinatorial-coefficients`<br>`reorder-counting-contributions` | ○ / — / ○ | prefix集合確率をMITM count・sumで集計。 |
| [ABC464-G](../../src/content/technique-inventory/shard-04/abc464-g.json) | `optimize-path-matching-by-contraction` | — | `linearize-static-range-information`<br>`prove-greedy-order` | ○ / — / × | XOR境界化後のpath matching縮約が核心。加法prefixによる区間和Outcomeは境界XOR操作の意味を表さない。F6。 |
| [ABC465-E](../../src/content/technique-inventory/shard-00/abc465-e.json) | `count-prefix-constrained-objects` | — | — | ○ / — / ○ | tight・使用digit集合・剰余の桁DP。 |
| [ABC465-F](../../src/content/technique-inventory/shard-04/abc465-f.json) | `linearize-static-range-information` | — | — | ○ / — / ○ | 鎖直積の六次元prefixと直方体隅の包除。 |
| [ABC465-G](../../src/content/technique-inventory/shard-03/abc465-g.json) | `maintain-ordered-interval-partition` | — | `compress-sparse-keys`<br>`linearize-static-range-information` | ○ / — / ○ | 円環runの局所split/mergeと固定weight moment。 |
| [ABC466-E](../../src/content/technique-inventory/shard-05/abc466-e.json) | `design-prefix-partition-dp` | — | `prove-greedy-order` | ○ / — / ○ | uncrossingで区間flipを交互segment DPへ。 |
| [ABC466-F](../../src/content/technique-inventory/shard-03/abc466-f.json) | `bound-monotone-total-work` | — | — | ○ / — / ○ | prefix区間端の商・余り変換と同類項集約。 |
| [ABC466-G](../../src/content/technique-inventory/shard-05/abc466-g.json) | `design-carry-or-mixed-radix-dp` | `maintain-potential-differences` | — | ○ / ○ / ○ | 加算carry DPが主、weighted DSUの差制約整理が追加主技能。 |

## 判定時のOutcome定義

全件表が参照するOutcomeの定義を、査読時点のbuildから以下に固定する。

| Outcome（接頭辞省略） | 定義 |
|---|---|
| `accelerate-fixed-linear-transition` | 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 |
| `accelerate-iteration-by-characteristic-p-frobenius` | 標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `accelerate-set-operations-with-bitsets` | 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 |
| `accelerate-tree-dp-by-heavy-path` | heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `account-for-color-swap-in-connected-bipartite-counting` | 連結二部グラフの二つの彩色が部の交換だけで対応することを使い、彩色付きの計数から同じグラフの重複を補正できる。 |
| `add-conway-number-games` | 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `aggregate-rooted-tree` | 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 |
| `aggregate-subsequence-transitions-by-value` | 末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `aggregate-value-prefix-by-buckets` | 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。 |
| `allocate-by-convex-marginal-costs` | 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。 |
| `answer-idempotent-range-query` | 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `answer-tree-ancestor-queries` | binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 |
| `apply-formal-power-series-operations` | 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。 |
| `apply-heavy-light-decomposition` | heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。 |
| `apply-stirling-transform` | 冪基底と下降階乗基底の係数をStirling数で変換し、目的のrank別計数列を構成できる。 |
| `apply-subset-zeta-mobius-transform` | Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `approximate-rational-by-euclid` | Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。 |
| `augment-components-with-metadata` | 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 |
| `balance-heavy-light-threshold` | 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `bound-monotone-total-work` | 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。 |
| `bound-reachability-in-numerical-semigroup` | 正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。 |
| `build-balanced-separator-decomposition` | 各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。 |
| `build-cartesian-tree-decomposition` | 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。 |
| `build-component-merge-tree` | 成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `build-finite-string-automaton` | 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。 |
| `build-laminar-interval-containment-tree` | laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。 |
| `build-multi-pattern-automaton` | 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。 |
| `build-prefix-match-state` | 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。 |
| `build-shortest-path-certificate` | 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。 |
| `build-static-sorted-range-index` | 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `build-suffix-automaton` | endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。 |
| `build-suffix-lcp-index` | 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。 |
| `build-virtual-tree` | 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。 |
| `characterize-bipartite-feasibility-by-hall` | 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 |
| `characterize-integer-solvability` | 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。 |
| `characterize-palindrome-intervals` | 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。 |
| `classify-game-states` | 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。 |
| `classify-tree-by-distance-residue` | 木の一つの基準点から全頂点への距離を求め、距離の剰余類と局所構造から各頂点の役割や周期的な部品構造を分類できる。 |
| `close-eventual-dp-tail` | 余分な歩行を訪問済みの最良状態での反復へ移す交換論を示し、有限prefix DPと閉形式のtailへ分離できる。 |
| `color-and-classify-bipartite-components` | 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 |
| `compare-algebraic-objects-by-random-fingerprint` | multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compare-sequences-by-rolling-fingerprint` | 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compose-dynamic-tree-clusters` | 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。 |
| `compose-finite-functions` | 小さな有限集合上の関数を遷移表として表し、適用順を保ってprefix・区間の作用を合成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compose-series-and-project-powers` | 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compress-dp-sufficient-aggregates` | 遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。 |
| `compress-sparse-keys` | 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 |
| `compute-all-pairs-distance` | 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。 |
| `compute-binomial-by-lucas` | 素数pのもとでn,kをp進展開し、Lucasの定理 C(n,k)=∏C(n_i,k_i) mod pで、n≥pでも階乗の零除算を避けて計算できる。 |
| `compute-convolution-or-correlation` | 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 |
| `compute-directed-walk-period` | 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。 |
| `compute-edit-distance` | 二つの列prefixを状態にし、一致・挿入・削除・置換の編集費用を最小化できる。閾値Kの判定では長さ差の下界から\|i-j\|≤Kの対角帯だけを計算できる。 |
| `compute-in-finite-field-extension` | 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。 |
| `compute-in-modular-arithmetic` | 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 |
| `compute-online-relaxed-convolution` | 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compute-subset-convolution` | 互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compute-transitive-closure` | 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。 |
| `condense-and-order-directed-graph` | 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。 |
| `construct-degree-parity-subgraph` | 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `construct-euler-trail-or-circuit` | 全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `construct-optimal-spanning-tree` | cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。 |
| `contract-monotone-paths-with-jump-pointers` | 一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `correct-overlap-by-inversion` | 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 |
| `count-combinatorial-objects-by-determinant` | 辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。 |
| `count-euler-circuits-by-best` | 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `count-finite-field-subspaces-by-rank` | 生成ベクトルのspan条件をrank別の部分空間数へ変換し、有限体上のGaussian binomial係数で各rankの寄与を数えられる。 |
| `count-implicit-binary-tree-layers` | 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。 |
| `count-labeled-structures-by-components` | 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。 |
| `count-nonintersecting-paths-by-lgv` | DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。 |
| `count-orbits-by-fixed-points` | 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。 |
| `count-prefix-constrained-objects` | 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。 |
| `count-symmetric-strings-under-lex-bound` | 鏡映対称な文字列を自由な前半で一意に表し、辞書順上限以下の個数を前半prefixの基数値と、等号境界の完成文字列一候補との比較で求められる。 |
| `count-through-cyclic-exponents` | 巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。 |
| `decompose-by-prime-or-divisor` | 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 |
| `decompose-expectation-by-additive-potential` | 対称な確率過程の期待費用を頻度別関数の和へ分離し、自己ループを含む一段方程式と終端の較正から吸収までの期待費用を求められる。 |
| `decompose-functional-graph` | 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 |
| `decompose-ranges-into-segment-tree-nodes` | 区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。 |
| `derive-coefficient-recurrence-by-differentiation` | 母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。 |
| `derive-mst-weight-from-threshold-components` | 重み閾値以下のグラフの成分数からMST重みを層別和として導き、辺追加時に各閾値の連結性を更新して最適重みを維持できる。 |
| `design-and-bound-randomized-algorithm` | 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 |
| `design-associative-range-summary` | 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 |
| `design-carry-or-mixed-radix-dp` | 整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。 |
| `design-frontier-profile-dp` | 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。 |
| `design-grid-table-dp` | グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。 |
| `design-interval-expansion-dp` | 訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `design-interval-split-dp` | 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 |
| `design-lis-frontier` | 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `design-minimal-sufficient-state` | 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 |
| `design-order-preserving-dp` | 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 |
| `design-prefix-partition-dp` | 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `design-query-code-by-information-bound` | 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。 |
| `design-range-update-action` | 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。 |
| `design-resource-dp` | 資源軸の上限と更新順を選び、選択の重複を避けられる。 |
| `detect-crossing-by-cyclic-order` | 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。 |
| `detect-improving-cycles` | 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。 |
| `determinize-automaton-by-subsets` | 同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `divide-search-space-recursively` | pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 |
| `dualize-planar-cut-to-path` | 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `encode-counting-by-generating-function` | 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 |
| `encode-labeled-trees-by-prufer-code` | Prüfer列とlabel付き木の全単射、および各labelの出現回数=次数-1を使って次数制約を係数条件へ変換できる。 |
| `encode-threshold-constraints-as-two-sat` | 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。 |
| `enumerate-bounded-candidates-or-cases` | 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 |
| `enumerate-by-reversible-backtracking` | 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。 |
| `enumerate-frontier-best-first` | 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `enumerate-subset-state-space` | bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 |
| `enumerate-subsets-by-mask` | 集合のbitmask表現から全部分集合と共通要素を列挙し、集合間のDP遷移を必要としない計数に利用できる。 |
| `evaluate-adversarial-game-value` | 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。 |
| `evaluate-at-geometric-points` | 評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。 |
| `evaluate-compressed-integer-blocks` | 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。 |
| `evaluate-polynomial-at-many-points` | 任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。 |
| `evolve-run-length-encoded-state` | 同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `expand-euler-product-sparsely` | Eulerの五角数定理により∏(1−x^i)を符号付きの疎な係数列へ展開し、必要次数までのO(√N)項で係数抽出できる。 |
| `exploit-modular-periodicity` | 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 |
| `exponentiate-associative-composition` | 反復対象を閉じた結合的要約へ持ち上げ、monoidの二分累乗で巨大な連結・合成を評価できる。 |
| `exponentiate-transition-over-semiring` | 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。 |
| `extract-rational-series-coefficient` | P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `factor-and-accelerate-transitions` | 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 |
| `factor-separable-linear-transform` | Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。 |
| `find-orbit-hit-by-bsgs` | 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる。 |
| `find-period-by-multiplicative-order` | 合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。 |
| `find-rooted-cycle-by-shortest-path-branches` | 根からの最短路木で第一枝の異なる頂点を結ぶ辺を列挙し、二本の木上経路と合わせて根を通る最小閉路を求められる。 |
| `find-weighted-balanced-separator` | 非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。 |
| `flatten-tree-by-euler-order` | Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。 |
| `formulate-combinatorial-coefficients` | 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 |
| `identify-bridges-and-articulations` | DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。 |
| `index-shared-prefixes-with-trie` | 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。 |
| `invert-divisor-lattice-by-mobius` | 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `invert-generating-function-equation` | F=xΦ(F)からLagrange反転 [x^n]F=[t^(n−1)]Φ(t)^n/nを導き、形式的条件と法上の除算可能性を確認して係数問題へ変換できる。 |
| `jump-deterministic-transition` | 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。 |
| `kernelize-near-tree-graph` | terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `linearize-events` | 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 |
| `linearize-static-range-information` | prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。 |
| `localize-change-impact-by-witness` | 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。 |
| `maintain-connectivity-components` | 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 |
| `maintain-dynamic-interval-union-length` | 区間の追加・削除に応じて重複被覆を管理し、active区間の和集合長を更新できる。具体的なbackendは採用解法が指定する場合に限って固定する。 |
| `maintain-endpoint-run-partition` | dequeなどの端点操作でrun分割を更新し、左右の境界からの削除・追加と各要素の償却回数を説明できる。 |
| `maintain-interactive-query-protocol` | judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。 |
| `maintain-local-sequence-links` | 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。 |
| `maintain-modular-product-under-factor-updates` | 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。 |
| `maintain-monotone-window` | 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。 |
| `maintain-order-through-crossing-events` | 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。 |
| `maintain-ordered-interval-partition` | 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-ordered-set-statistics` | 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-piecewise-linear-convex-function` | 区分線形凸関数を左右breakpointのheapと定数項で表し、\|x-a\|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-potential-differences` | DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。 |
| `maintain-queue-aggregate-with-swag` | queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-sparse-domain-segment-tree` | 巨大または疎な座標域で訪れたnodeだけを生成し、区間要約と境界探索をO(log U)で保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-weighted-prefix-statistics` | 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 |
| `maintain-xor-linear-basis` | 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `map-graph-cycle-xor-to-span` | spanning treeのroot-to-vertex XOR potentialで辺ラベルをfundamental cycleのXORへ変換し、cycle spaceの線形像が非木辺ごとのcycle XORのspanと一致することを示して、walkへ挿入できるXOR値をbasisで表せる。 |
| `merge-small-into-large` | 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `minimize-maximum-xor-by-bit-partition` | 最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `minimize-xor-coset-representative` | XOR部分空間の基底をpivot bitごとにreduced formへ整え、高位bitから基底を加減してaffine cosetの最小整数代表を一意に得る。正規化写像の線形性を示し、二値のXOR最小化を各値の正規化へ分離できる。 |
| `model-and-compute-shortest-path` | 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。 |
| `model-max-flow-min-cut` | 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `model-min-cost-flow` | 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `normalize-common-dp-action` | 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。 |
| `normalize-equivalent-states` | 対称操作で同値な状態の標準形と不変量を選べる。 |
| `normalize-string-to-primitive-period` | prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-by-lagrangian-relaxation` | 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-by-line-envelope` | 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。 |
| `optimize-mask-by-bitwise-feasibility` | 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-monge-transitions` | quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-path-matching-by-contraction` | 重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。 |
| `optimize-poset-antichain-by-dilworth` | 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。 |
| `optimize-ratio-by-parametric-search` | 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。 |
| `optimize-stochastic-actions` | 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。 |
| `optimize-tree-order-by-cluster-contraction` | 親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。 |
| `optimize-univariate-convex-function` | 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-weighted-matroid-basis` | 独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `partition-at-critical-integer-boundaries` | 成立判定が変わり得る整数境界を全て列挙し、隣り合う境界の間で判定が一定であることを示して、代表点判定と区間長で整数解の個数を求められる。 |
| `partition-integer-parameter-ranges` | floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。 |
| `pass-resource-dp-through-heavy-recursion` | 外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `peel-directed-graph-toward-cycles` | 三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。 |
| `peel-graph-core` | 連結成分のE−V+1から独立な閉路数を判定し、E=Vなら唯一のcycleを持つことを示せる。必要なら次数1以下の頂点を反復削除し、残るcoreと削除順を求められる。 |
| `persist-data-structure-versions` | 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `precompute-directional-grid-effects` | 各行・各列でactiveな向きだけを更新し、blockerと通行禁止条件を混同せず、定数方向へ伸びる全効果領域をgrid全体の線形時間で印付けられる。 |
| `process-dag-in-topological-order` | 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `propagate-probability-distribution` | 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。 |
| `propagate-static-graph-potentials` | 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。 |
| `prove-and-search-threshold` | 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 |
| `prove-greedy-order` | 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 |
| `prune-dominated-candidates-once` | 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。 |
| `prune-range-actions-by-node-invariant` | nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `query-bitwise-order-with-trie` | 整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。 |
| `query-recursively-defined-string` | 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。 |
| `reconstruct-tree-from-distance-matrix` | 加法的距離行列から正重み木の候補を復元し、全点対距離の再計算で存在を完全検証できる。 |
| `recover-valid-witness` | 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 |
| `recur-by-edge-deletion-contraction` | 辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `reduce-geometry-to-algebraic-predicates` | 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。 |
| `reduce-integer-structure-by-gcd` | gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。 |
| `relax-in-dependency-order` | DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。 |
| `remove-boundaries-by-reflection` | 最初に境界を破るpathとの鏡像対応を構成し、壁付きwalkの数え上げを符号付きの無境界問題へ変換できる。 |
| `reorder-counting-contributions` | 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。 |
| `represent-convex-intersection-by-halfplanes` | 凸多角形を向き付き辺の線形半平面制約へ変換し、平行移動後も左辺が同じ制約を最強の右辺へ集約して共通部分への包含を判定できる。 |
| `represent-integers-as-two-squares` | Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `reroot-tree-aggregation` | 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。 |
| `restrict-geometric-candidates-to-boundary` | 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。 |
| `reverse-update-time` | 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。 |
| `rollback-reversible-updates` | 更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `run-dp-on-finite-automaton` | 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `schedule-range-query-updates` | 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。 |
| `select-state-graph-search` | 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。 |
| `share-threshold-checks-by-parallel-binary-search` | 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。 |
| `shift-polynomial-by-factorial-convolution` | 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。 |
| `slide-transition-recurrence` | 隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。 |
| `solve-bipartite-matching` | 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-cyclic-minimax-game` | 終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-difference-constraints` | 差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。 |
| `solve-flow-with-lower-bounds` | 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-game-by-parity-invariant` | 合法手が独立な固定候補の消費に限られる場合や、成分分類から残手数の偶奇を求められる場合に、勝敗を決める偶奇量と応答戦略を証明し、局面ごとのDPなしで勝者を判定できる。 |
| `solve-isotonic-regression-by-pav` | 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-linear-system-and-rank` | 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-min-weight-general-perfect-matching` | 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。 |
| `solve-modular-constraints` | 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。 |
| `solve-steiner-tree-by-subset-dp` | terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-stochastic-recurrence` | 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。 |
| `solve-weighted-bipartite-matching` | assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-xor-threshold-matching` | 整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。 |
| `split-enumeration-space` | 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。 |
| `stabilize-unbounded-knapsack-by-best-density` | 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。 |
| `subtract-exception-transitions` | 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。 |
| `sum-affine-floors-by-euclid` | Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。 |
| `sum-multiplicative-function-by-min25-sieve` | floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `sum-piecewise-linear-integer-ranges` | 整数区間上の一次関数包絡を交点の前後で分け、各affine blockの値を等差数列和で合計できる。 |
| `sweep-connectivity-by-kruskal-threshold` | 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。 |
| `test-linear-matroid-intersection-rank` | 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。 |
| `translate-sequences-by-rsk` | 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `traverse-stern-brocot-ancestors` | 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `use-cycle-space-basis` | 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。 |
| `use-tree-diameter-extrema` | 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。 |

## 対象の固定と網羅性確認

- Git HEAD: `4738b88e3d16b65c578d2bbdfe064ac66198e030`
- build SHA-256: `8db7442948b428ea8e0ac1651fc91744dd73904d3146210114ba00e456405e1f`
- build generatedAt: `2026-09-26T13:38:56.577Z`
- placement: 868、Inventory: 868、個別査読行: 868。三者のproblemId集合が一致し、未掲載・重複は0。
- 現行Cあり: 59問。指摘あり: 6問。指摘なし: 862問。
- Inventory集合SHA-256（problemId順に相対path、NUL、file bytes、NULを連結）: `7290f388227f0c5a98c033a06eba63a1d2503a508a4c34ca34097093978e105b`
