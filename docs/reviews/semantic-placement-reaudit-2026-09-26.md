# Inventory 起点の semantic placement 再監査（2026-09-26）

## 範囲と判定方法

`problem-placements.json`
の868問（ABC212–466、各回のE/F/G/Ex/H枠）について、対応する868件のInventoryに戻り、観察・却下案・採用案・key
insight・algorithm
connection・典型技法・前提条件を読み直した。採用解法をタグとOutcomeの定義に照らして意味的に判定した。Inventoryは真として扱った。機械的な語句一致を判定には使っていない。集計や記録への転記だけを機械的に行った。

supportingは、採用解法を理解・実装するために独立して必要となる技術が載っているかを判定した。通常の算術や一般的なheap操作をすべて列挙する基準にはしていない。一方、InventoryがNTTを前提とし、解法の制約成立に高速多項式積を実際に使う場合は、FPSや多点評価のタグがあるだけで畳み込みの学習成果まで表現済みとはみなしていない。

**現行868問中、修正が必要な配置は15問。**
以前の監査で指摘された10問は現行placementで修正済みである。残る853問については、Inventoryを真とする条件で今回新たな修正理由を認めなかった。

## 要修正の15問

### 生成関数・多点評価で畳み込みのprimaryまたはsupportingが欠けている

#### ABC225 H — 畳み込みをco-primaryに加える

- **現状**：primary `tag-generating-functions`、supporting `tag-combinatorial-coefficients`。
- **Inventory上の解法**：固定席で独立した区間に分け、区間ごとの人数別スコアを多項式にする。総人数に対応する係数をNTT畳み込みで求める。
- **誤り**：生成関数による区間独立化だけでは制約内で係数を得る計算手段が表されていない。
- **修正**：`tag-convolution` / `outcome-compute-convolution-or-correlation`
  をco-primaryに加え、生成関数をhomeにする。

#### ABC247 Ex — 畳み込みの欠落とfunctional graphの誤分類

- **現状**：primary `tag-generating-functions`、supporting `tag-functional-graph-decomposition` と
  `tag-recursive-divide-and-conquer`。
- **Inventory上の解法**：色条件を満たす順列をcycle数別に数え、`D_{n+1}(z)=(z+a_n)D_n(z)`
  から得る一次式群の積をproduct treeとNTTで計算する。
- **誤り**：NTT畳み込みがsupportingにもprimaryにもない。また、固定された後続関数のcycle・treeを分解しておらず、functional
  graph decompositionは使っていない。
- **修正**：GFをhomeのまま`tag-convolution`をco-primaryに加える。`tag-functional-graph-decomposition`と`outcome-decompose-functional-graph`を外し、分割統治と畳み込みを残す。

#### ABC267 Ex — parity生成関数の積を計算する畳み込みが欠落

- **現状**：primary `tag-generating-functions`、supporting `tag-recursive-divide-and-conquer`。
- **Inventory上の解法**：偶数・奇数選択の二多項式を持ち、併合時の4つの多項式積をbalanced product
  treeとNTTで求める。
- **誤り**：分割統治だけでは積の係数を高速に求める操作が分類されていない。
- **修正**：GFをhomeにして`tag-convolution` /
  `outcome-compute-convolution-or-correlation`をco-primaryに加える。

#### ABC269 Ex — heavy-path polynomial DPに必要なNTT畳み込みが欠落

- **現状**：primary `tag-heavy-path-tree-dp`、supportingはGF・再帰分割・rooted tree集約。
- **Inventory上の解法**：antichainの木DPをheavy pathへ分解し、light-child積とpath
  recurrenceをNTT付きの分割統治積で処理する。
- **誤り**：複雑度を成立させる高速多項式積がsupportingにない。
- **修正**：`tag-convolution` / `outcome-compute-convolution-or-correlation`をsupportingに加える。

#### ABC272 Ex — 多点評価の実装基盤である畳み込みが欠落

- **現状**：primary GF・多項式多点評価、supportingは係数・包除・再帰分割。
- **Inventory上の解法**：EGFでDPを対角化し、`h(j)=∏(j+C_i)`を全整数点で評価する。subproduct/remainder
  treeをNTTで構築している。
- **誤り**：多点評価は正しくprimaryだが、Inventoryの前提と計算量に必要な畳み込み基盤がsupportingにない。
- **修正**：畳み込みをsupportingに加える。

#### ABC381 G — chirp-z評価に必要な畳み込みが欠落

- **現状**：primary `tag-finite-field-extension`、supporting多項式多点評価と再帰分割。
- **Inventory上の解法**：有限体拡大上で一般項を求め、baby-step/giant-stepで指数を分割し、chirp-z変換とNTTで等比点評価を計算する。
- **誤り**：多点評価はsupportingにあるが、その計算を実現する畳み込みがない。
- **修正**：`tag-convolution` / `outcome-compute-convolution-or-correlation`をsupportingに加える。

#### ABC260 Ex — EGF合成・二項反転・FPSに必要な畳み込みが欠落

- **現状**：primary FPS・GF、supportingは係数・包除・modular arithmetic・再帰分割。
- **Inventory上の解法**：EGFで指定事象数を数え、二項反転で正確な分布へ戻し、FPS逆元から全冪モーメントを求める。InventoryはNTT多項式積を前提にしている。
- **誤り**：FPS操作だけでは高速積の独立した学習成果が反映されていない。
- **修正**：畳み込みをsupportingに加える。

#### ABC297 Ex — FPS逆元を高速化する畳み込みが欠落

- **現状**：primary FPS・GF、supportingは包除・modular arithmetic。
- **Inventory上の解法**：`H/(1-G)^2`の係数をNewton法・NTTで計算する。
- **誤り**：FPS逆元に必要なNTT畳み込みがsupportingにない。
- **修正**：畳み込みをsupportingに加える。

#### ABC318 Ex — FPS expのNTT畳み込みが欠落

- **現状**：primary FPS・labeled component decomposition、supporting GF。
- **Inventory上の解法**：cycle typeをEGFへ整理し、`exp(f)`をNewton法とNTTで計算する。
- **誤り**：指数型生成関数とFPS expは分類されているが、次数25万級の高速積がsupportingにない。
- **修正**：畳み込みをsupportingに加える。

#### ABC387 G — FPS composition・Newton法の高速積が欠落

- **現状**：primary FPS・FPS composition/power projection・GF、supportingなし。
- **Inventory上の解法**：暗黙EGF方程式をKinoshita–Li compositionとFPS Newton
  iteration（または逆関数）で解く。前提にはBostan–Moriと転置原理を含む。
- **誤り**：高次FPS合成・Newton反復を制約内で行う多項式積が分類されていない。
- **修正**：畳み込みをsupportingに加える。

#### ABC439 G — power projection・有理関数マージの畳み込みが欠落

- **現状**：primary FPS・power projection・GF、supportingは再帰分割。
- **Inventory上の解法**：power
  projection後、多数の有理関数の分子・分母を積木状にmergeし、FPS逆元で係数を得る。
- **誤り**：分割統治はあるが、積木mergeとFPS逆元の高速多項式積がsupportingにない。
- **修正**：畳み込みをsupportingに加える。

### primaryの中心が解法の本質からずれている

#### ABC304 Ex — EDFの交換法がprimaryでない

- **現状**：primary `tag-dag-topological-processing` /
  `outcome-process-dag-in-topological-order`。greedy exchangeとpriority queueはsupporting。
- **Inventory上の解法**：任意のtopological
  orderは明示的に却下されている。後続のdeadlineを逆伝播し、その時点で配置可能な頂点からdeadline最小のものを選ぶEDF規則を交換法で正当化する。
- **誤り**：DAG処理は前提伝播に必要だが、任意のtopological順に処理するのでは解けない。解を成立させる選択規則がprimaryから外れている。
- **修正**：`tag-greedy-exchange-order` /
  `outcome-prove-greedy-order`をprimary/homeにし、DAGのdeadline伝播をsupportingにする。priority
  queueはこの選択規則の実装詳細である。旧`tag-ordered-set-heap`はretiredで、残る
  `tag-priority-queue-best-first`のOutcomeはfrontier列挙を表すため、ここにheapのsupporting分類を流用しない。

#### ABC304 G — bitwise maximum-matching oracleを分類できていない

- **現状**：primary `tag-monotone-threshold-search`、supporting `tag-recursive-divide-and-conquer`。
- **Inventory上の解法**：閾値xごとに、XORがx以上となるpairの最大matching数を `f_d(C,x)` と
  `g_d(C,D,x)` のbit分割再帰で求める。
- **誤り**：単調二分探索は外側の最適化である。genericな再帰分割だけでは同一集合内・二集合間のmatching数をbitごとに合成する核心を表せていない。既存の`tag-bitwise-minimax-partition`は最大XORを最小化する別問題なので代用できない。
- **修正**：bitwise XOR threshold matchingの再帰を表すprimary
  Tag/Outcomeを追加するか、意味が一致する分類を整備してprimaryにする。単調閾値探索はsupportingに移す。

#### ABC308 F — max-heap選択をbest-first列挙としている

- **現状**：primary `tag-priority-queue-best-first` /
  `outcome-enumerate-frontier-best-first`。greedy exchangeはsupporting。
- **Inventory上の解法**：price順に商品を見て解禁couponをheapへ入れ、現在使える最大割引を使う。安全性は、現在のcouponをより高価な将来商品へ交換しても適用可能性を失わないというmatchingの交換法で証明する。
- **誤り**：heapで候補を列挙する問題ではなく、nested-threshold
  matchingに対するgreedyの正当性が中心。best-first列挙のOutcomeは学習成果とずれている。
- **修正**：`tag-greedy-exchange-order` /
  `outcome-prove-greedy-order`をprimary/homeにし、couponの解禁を管理する値順sweepをsupportingにする。heapは実装詳細であり、best-first列挙のTag/Outcomeは学習成果が異なるため外す。

#### ABC458 G — slope-trick feasibility DPがsupportingに留まっている

- **現状**：primary `tag-monotone-threshold-search` /
  `outcome-prove-and-search-threshold`、supporting `tag-slope-trick`。
- **Inventory上の解法**：人数mの単調性による二分探索の各判定で、残人数上のconcave
  DPを一次関数加算・domain切り詰め・傾きclosureで維持する。線形時間判定を可能にするのはslope-trickの折れ線管理である。
- **誤り**：二分探索だけでは判定器を作れず、一般的な外側探索がprimaryになって問題固有の計算技術をsupportingへ押し下げている。
- **修正**：`tag-slope-trick`をprimaryに昇格し、`outcome-maintain-piecewise-linear-convex-function`をhomeにする（concave
  DPは符号反転して扱う）。人数の単調二分探索をsupportingにする。

## 集計

| 分類                         | 問題数 | 主な修正                                             |
| ---------------------------- | -----: | ---------------------------------------------------- |
| 畳み込みTag/Outcomeの欠落    |     11 | 3問はGFとco-primary、8問はsupportingに畳み込みを追加 |
| supporting Tagの誤り         |      1 | ABC247 Exのfunctional graphを除去                    |
| primaryの役割・Outcomeのずれ |      4 | ABC304 Ex / G、ABC308 F、ABC458 G                    |
| **修正が必要な問題数**       | **15** | ABC247 Exは畳み込み欠落と誤supportが重複             |

既知の修正済み10問（ABC244 Ex、ABC308 Ex、ABC352 G、ABC355 F、ABC392 G、ABC398 E/G、ABC422 G、ABC451
G、ABC457 G）は現行placementでも再確認し、今回の誤り件数には含めていない。

## 修正反映状況

本監査の15件をtaxonomy claim decisionへ反映した。ABC225 H・247 Ex・267
Exは生成関数をhomeに保ったまま畳み込みをco-primaryに追加し、ABC247 Exのfunctional-graph
supportingは除去した。NTTが計算量上必要な8件では、Inventoryの該当技法または前提claimに畳み込みsupportingを結び付けた。

ABC304 Ex・308 Fは交換法で正当化される貪欲をprimaryにし、DAG
deadline伝播・値順sweepをsupportingへ整理した。priority
queueは実装詳細として扱った。旧`tag-ordered-set-heap`はretiredであり、現行のbest-first
Outcomeを代用するのも意味が違うためsupportingには加えていない。ABC304 Gは既存のXOR minimaxやbitwise
feasibilityと異なる専用のXOR閾値matching
Tag/Outcomeを追加してprimaryにし、単調二分探索をsupportingへ移した。ABC458 Gはslope
trickによる凹折れ線DPをprimaryにし、人数の単調二分探索をsupportingにした。
