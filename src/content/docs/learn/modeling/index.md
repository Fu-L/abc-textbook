---
title: "モデル変換とアルゴリズム設計"
description: "「モデル変換とアルゴリズム設計」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 0
---

# モデル変換とアルゴリズム設計

導入対象の目安: **緑色（800–1199）**。探索・集計・貪欲法を選ぶ前に、保存すべき条件を言葉にする習慣を付ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 本書の読み方

分野別の目次は概念の親子関係を表します。初めから学ぶときは下の標準履修順に沿い、各単元の「次」へ進んでください。この経路では必要な技能を先に学び、分野をまたぐ複合問題は全前提を履修した後に提示します。

「習得対象の目安」は、その色付近の読者がUnitの中心概念を道具として身につける時期を示します。習得とは、標準形の発動条件・不変量・計算量を説明し、実装またはライブラリへの還元ができることです。掲載問題のDifficulty、全問正解に必要なレート、初見で発展解法を発見する難しさは評価に含めません。

色と数値の境界は[AtCoder公式のAlgorithmレーティング区分](https://info.atcoder.jp/overview/contest/rating)に合わせています。各Unitへの割当ては、前提知識の量、標準形の実装・正当化に必要な理解、他分野への応用範囲を共通基準にした本書の編集判断です。AtCoder公式の履修基準ではありません。

| 習得対象 | レーティング | 本書での判断の軸・代表例 |
| --- | --- | --- |
| 茶色 | 400–799 | 基本操作を直接使う。累積和・差分、要素索引と連結リスト。 |
| 緑色 | 800–1199 | 状態・順序・計算量を明示する。基本DP、DSU、最短路、二分探索。 |
| 水色 | 1200–1599 | 標準的な抽象化と不変量を使う。Fenwick Tree、LIS、桁DP、SCC。 |
| 青色 | 1600–1999 | 複数の標準技能をつなぎ、作用や還元を設計する。遅延Segment Tree、2-SAT、HLD。 |
| 黄色 | 2000–2399 | 代数的表現や構造定理を使う。畳み込み、母関数、最小費用流、重心分解。 |
| 橙色 | 2400–2799 | 複雑な合成や償却・双対性まで理解する。FPS、Segment Tree Beats、Aliens trick。 |
| 赤色 | 2800以上 | 専門理論を必要に応じて習得する。一般重み付きmatching、FPS合成、線形matroid交差。 |

章や案内節の「導入対象」は、その見取り図を理解する目安です。子Unitには独立した対象色を付けています。親を読んだ後、高い色の子をいったん飛ばして次のまとまりへ進んで構いません。赤色の専門Unitも、全てを習得することがその色になる条件という意味ではありません。

既習の単元は飛ばして構いません。問題の主題と提示先は別です。関連問題のリンクは分野から探すためのもので、標準履修順では前提の説明が終わった単元で演習します。各問題には主題と既習技能を示します。

ARC・AGC・CF Div. 1・UCUPなどの難問へ進む際には、解法を再現した後で、成立条件を一つ外すと何が壊れるか、他の章の表現へ写せるかを考えてください。たとえばDP遷移を区間要約・行列・多項式へ写す、割当てをmatching・flowへ写す、といった接続を自分で導けるようにすることが目標です。

## 全体の構成

1. [モデル変換とアルゴリズム設計](/learn/modeling/)
2. [データ構造と問い合わせ](/learn/query/)
3. [動的計画法](/learn/dynamic-programming/)
4. [グラフアルゴリズム](/learn/graph/)
5. [木構造](/learn/tree/)
6. [文字列アルゴリズム](/learn/string/)
7. [数論](/learn/number-theory/)
8. [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)
9. [幾何・凸最適化](/learn/geometry-optimization/)

## 標準履修順

1. [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)
2. [単調境界を証明して探索する](/learn/modeling/monotone-search/)
3. [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)
4. [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)
5. [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)
6. [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)
7. [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)
8. [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)
9. [同値な状態を正規化する](/learn/modeling/normalization/)
10. [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)
11. [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)
12. [交換論から選択順を導く](/learn/modeling/greedy-exchange/)
13. [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)
14. [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)
15. [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)
16. [素因数分解と約数構造](/learn/number-theory/prime-divisor/)
17. [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)
18. [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)
19. [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)
20. [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)
21. [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)
22. [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)
23. [DAGのtopological processing](/learn/graph/dag-topological-processing/)
24. [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)
25. [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)
26. [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)
27. [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)
28. [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)
29. [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)
30. [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)
31. [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)
32. [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)
33. [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)
34. [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)
35. [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)
36. [Z algorithmによるprefix matching](/learn/string/z-algorithm/)
37. [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)
38. [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)
39. [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)
40. [event順にactive集合を更新する](/learn/modeling/event-sweep/)
41. [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)
42. [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)
43. [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)
44. [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)
45. [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)
46. [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)
47. [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)
48. [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)
49. [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)
50. [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)
51. [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)
52. [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)
53. [bit列をTrieで索引化する](/learn/query/binary-trie/)
54. [推移閉包](/learn/graph/transitive-closure/)
55. [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)
56. [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)
57. [有向cycle検出・sink/source peeling](/learn/graph/directed-core-peeling/)
58. [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)
59. [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)
60. [doubling・binary lifting](/learn/graph/binary-lifting/)
61. [有限関数・作用の合成](/learn/query/finite-function-composition/)
62. [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)
63. [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)
64. [graph core・leaf peeling](/learn/graph/graph-core/)
65. [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)
66. [potential・weighted DSU](/learn/graph/potential-dsu/)
67. [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)
68. [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)
69. [区間monoid要約](/learn/query/range-monoid-aggregation/)
70. [区間更新を要約へ作用させる](/learn/query/range-actions/)
71. [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)
72. [rerooting・全方位木DP](/learn/tree/rerooting/)
73. [値軸のbucket分割と区間集約](/learn/query/value-bucket-aggregation/)
74. [最短路モデル](/learn/graph/weighted-shortest-path/)
75. [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)
76. [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)
77. [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)
78. [Euler trail・circuit](/learn/graph/euler-trail-circuit/)
79. [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)
80. [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)
81. [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)
82. [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)
83. [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)
84. [最大流・最小カット](/learn/graph/max-flow-min-cut/)
85. [monoid exponentiation・連結演算doubling](/learn/combinatorics-algebra/monoid-exponentiation/)
86. [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)
87. [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/)
88. [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)
89. [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)
90. [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)
91. [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)
92. [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)
93. [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)
94. [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)
95. [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)
96. [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)
97. [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)
98. [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)
99. [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)
100. [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)
101. [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)
102. [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)
103. [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/)
104. [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)
105. [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)
106. [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/)
107. [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)
108. [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)
109. [文字列周期・primitive word](/learn/string/string-periodicity/)
110. [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)
111. [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)
112. [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)
113. [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)
114. [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)
115. [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)
116. [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/)
117. [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)
118. [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)
119. [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)
120. [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)
121. [動的・implicit Segment Tree](/learn/query/dynamic-segment-tree/)
122. [rollback・DFS入退場の状態復元](/learn/query/rollback/)
123. [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/)
124. [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)
125. [永続data structure・structural sharing](/learn/query/persistence/)
126. [2-SAT・含意グラフ](/learn/graph/two-sat/)
127. [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)
128. [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/)
129. [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)
130. [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)
131. [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)
132. [virtual tree・auxiliary tree](/learn/tree/virtual-tree/)
133. [Aho–Corasick](/learn/string/aho-corasick/)
134. [SWAG・two-stack queue aggregation](/learn/query/swag/)
135. [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)
136. [半平面制約・凸領域の共通部分](/learn/geometry-optimization/half-plane-constraints/)
137. [Baby-Step Giant-Step・可逆作用の反復到達探索](/learn/number-theory/baby-step-giant-step/)
138. [二進操作の木へのモデル化と祖先マッチング](/learn/modeling/binary-tree-ancestor-matching/)
139. [上位bitの支配関係によるXOR minimax](/learn/query/bitwise-minimax-partition/)
140. [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)
141. [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)
142. [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)
143. [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)
144. [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)
145. [最小費用流・circulation](/learn/graph/min-cost-flow/)
146. [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)
147. [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)
148. [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)
149. [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)
150. [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)
151. [run-length状態の動的遷移](/learn/string/run-length-dynamics/)
152. [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)
153. [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)
154. [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)
155. [slope trick](/learn/geometry-optimization/slope-trick/)
156. [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/)
157. [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/)
158. [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)
159. [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)
160. [Segment Tree Beats](/learn/query/segment-tree-beats/)
161. [削除・縮約recurrence](/learn/combinatorics-algebra/deletion-contraction/)
162. [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)
163. [鏡像法・reflection principle](/learn/combinatorics-algebra/reflection-principle/)
164. [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)
165. [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)
166. [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)
167. [平面graph双対・cut/path対応](/learn/graph/planar-duality/)
168. [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)
169. [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)
170. [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)
171. [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)
172. [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/)
173. [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)
174. [Prüfer code・次数制約付きlabel木](/learn/combinatorics-algebra/prufer-code/)
175. [subset convolution](/learn/combinatorics-algebra/subset-convolution/)
176. [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/)
177. [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/)
178. [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/)
179. [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)
180. [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)
181. [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)
182. [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)
183. [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)
184. [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)
185. [Gaussian整数・二平方和](/learn/number-theory/gaussian-integers-two-squares/)
186. [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)
187. [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)
188. [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)
189. [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)
190. [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)
191. [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)
192. [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)
193. [Min_25・Lucy DP型の総和篩](/learn/number-theory/min25-sieve/)
194. [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)
195. [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)
196. [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)

## 概要

問題を既知の算法へ写すための共通言語を学ぶ。状態の同一視と寄与の分解から始め、探索空間の分割、交換論による貪欲法、単調性による探索へ進む。後半では処理順と総仕事量を設計し、乱択・対話によって使える情報そのものを考える。以後の各章でも、何を保存する変換なのか、候補を捨ててよい理由は何かをこの章へ戻って確認する。

### モデル変換

問題固有の操作を再利用可能な構造・順序・境界の問題へ変換する。

観察: 球iの行き先は整数x_i∈[L_i,R_i]であり、異なる球に同じ整数を使えない。

候補の比較: 配置順をすべて試す前に、球を単位時間の仕事、整数を時刻、区間を実行可能時間窓へ写す。

不変量: 各球と各仕事、各箱と各時刻が一対一に対応し、同時刻に二仕事を割り当てない条件が箱の重複禁止と一致する。

確認: [1,1]の球が二個なら一枠に二仕事が必要で不可能。[1,2]が二個なら時刻1,2への割当てが配置を与える。変換はO(N)で、値域全体を列挙する必要はない。

### 習得する技能

- 問題固有の語を再利用可能な対象・操作・不変量に置き換えられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

問題文の操作を再利用可能な対象・不変量へ言い換え、探索・貪欲・分割手法を選ぶ共通の視点を最初に作る。

### このUnitでは扱わないもの

- なし

## 章の構成

- [同値な状態を正規化する](/learn/modeling/normalization/) — 水色
- [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/) — 緑色
- [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/) — 緑色
- [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/) — 緑色
- [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/) — 緑色
- [探索空間を分けて照合・再帰分割する](/learn/modeling/divide-enumeration/) — 水色（導入）
  - [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/) — 水色
  - [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/) — 水色
- [交換論から選択順を導く](/learn/modeling/greedy-exchange/) — 水色
- [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/) — 水色
- [二進操作の木へのモデル化と祖先マッチング](/learn/modeling/binary-tree-ancestor-matching/) — 青色
- [成立証明から構成解を復元する](/learn/modeling/constructive-witness/) — 水色
- [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/) — 青色
- [単調境界を証明して探索する](/learn/modeling/monotone-search/) — 緑色
- [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/) — 緑色
- [event順にactive集合を更新する](/learn/modeling/event-sweep/) — 水色
  - [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/) — 橙色
- [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/) — 水色
- [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/) — 青色
- [軽重分類と償却解析で総仕事量を抑える](/learn/modeling/decomposition-amortization/) — 水色（導入）
  - [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/) — 水色
  - [small-to-large・DSU on Tree](/learn/modeling/small-to-large/) — 青色
  - [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/) — 青色
- [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/) — 青色
  - [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/) — 黄色
- [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/) — 緑色
- [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 H「Stroll」](https://atcoder.jp/contests/abc213/tasks/abc213_h) — 主題: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC215 G「Colorful Candies 2」](https://atcoder.jp/contests/abc215/tasks/abc215_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h) — 主題: [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC220 E「Distance on Large Perfect Binary Tree」](https://atcoder.jp/contests/abc220/tasks/abc220_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。
- [ABC220 G「Isosceles Trapezium」](https://atcoder.jp/contests/abc220/tasks/abc220_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。
- [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e) — 主題: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC221 F「Diameter set」](https://atcoder.jp/contests/abc221/tasks/abc221_f) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC223 E「Placing Rectangles」](https://atcoder.jp/contests/abc223/tasks/abc223_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC223 H「Xor Query」](https://atcoder.jp/contests/abc223/tasks/abc223_h) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 dp_i=1+max_{a_j>a_i,同じ行または列}dp_j型の遷移を行別・列別最大へ圧縮する。遷移先がなければ0。同値のbatchでは全取得を済ませてから更新し、狭義不等号を保つ。sort後の集約はO(N)。
- [ABC225 E「7」](https://atcoder.jp/contests/abc225/tasks/abc225_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。
- [ABC226 E「Just one」](https://atcoder.jp/contests/abc226/tasks/abc226_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC226 F「Score of Permutations」](https://atcoder.jp/contests/abc226/tasks/abc226_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h) — 主題: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h) — 主題: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC231 F「Jealous Two」](https://atcoder.jp/contests/abc231/tasks/abc231_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC232 G「Modulo Shortest Path」](https://atcoder.jp/contests/abc232/tasks/abc232_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。
- [ABC234 Ex「Enumerate Pairs」](https://atcoder.jp/contests/abc234/tasks/abc234_h) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f) — 主題: [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)。既習技能: 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC246 F「typewriter」](https://atcoder.jp/contests/abc246/tasks/abc246_f) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 集合のbitmask表現から全部分集合と共通要素を列挙し、集合間のDP遷移を必要としない計数に利用できる。 非空の行集合Sをbitmaskで列挙し、共通文字数c(S)を求める。和集合の大きさはΣ_{S≠∅}(−1)^{|S|+1}c(S)^L。重複を交互に打ち消す包除原理が主題であり、subset間のDP遷移はない。
- [ABC246 G「Game on Tree 3」](https://atcoder.jp/contests/abc246/tasks/abc246_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC248 E「K-colinear Line」](https://atcoder.jp/contests/abc248/tasks/abc248_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC252 Ex「K-th beautiful Necklace」](https://atcoder.jp/contests/abc252/tasks/abc252_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。
- [ABC252 F「Bread」](https://atcoder.jp/contests/abc252/tasks/abc252_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h) — 主題: [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)。既習技能: 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。 / 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC257 F「Teleporter Setting」](https://atcoder.jp/contests/abc257/tasks/abc257_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。
- [ABC258 F「Main Street」](https://atcoder.jp/contests/abc258/tasks/abc258_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC258 G「Triangle」](https://atcoder.jp/contests/abc258/tasks/abc258_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC259 F「Select Edges」](https://atcoder.jp/contests/abc259/tasks/abc259_f) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC261 F「Sorting Color Balls」](https://atcoder.jp/contests/abc261/tasks/abc261_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC262 F「Erase and Rotate」](https://atcoder.jp/contests/abc262/tasks/abc262_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 次数条件を満たさない頂点をqueueで反復削除し、cycle core・k-coreと削除順を得る。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC267 Ex「Odd Sum」](https://atcoder.jp/contests/abc267/tasks/abc267_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h) — 主題: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h) — 主題: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f) — 主題: [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。
- [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC277 G「Random Walk to Millionaire」](https://atcoder.jp/contests/abc277/tasks/abc277_g) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f) — 主題: [上位bitの支配関係によるXOR minimax](/learn/query/bitwise-minimax-partition/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)。既習技能: 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC283 Ex「Popcount Sum」](https://atcoder.jp/contests/abc283/tasks/abc283_h) — 主題: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h) — 主題: [推移閉包](/learn/graph/transitive-closure/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC287 G「Balance Update Query」](https://atcoder.jp/contests/abc287/tasks/abc287_g) — 主題: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。
- [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC293 Ex「Optimal Path Decomposition」](https://atcoder.jp/contests/abc293/tasks/abc293_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。
- [ABC293 F「Zero or One」](https://atcoder.jp/contests/abc293/tasks/abc293_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC295 E「Kth Number」](https://atcoder.jp/contests/abc295/tasks/abc295_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g) — 主題: [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC296 F「Simultaneous Swap」](https://atcoder.jp/contests/abc296/tasks/abc296_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC299 G「Minimum Permutation」](https://atcoder.jp/contests/abc299/tasks/abc299_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC300 F「More Holidays」](https://atcoder.jp/contests/abc300/tasks/abc300_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h) — 主題: [DAGのtopological processing](/learn/graph/dag-topological-processing/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC309 F「Box in Box」](https://atcoder.jp/contests/abc309/tasks/abc309_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h) — 主題: [文字列周期・primitive word](/learn/string/string-periodicity/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC313 G「Redistribution of Piles」](https://atcoder.jp/contests/abc313/tasks/abc313_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 二部matchingを既習として、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。周期的な候補時刻の圧縮とmatchingによる可否を組み合わせ、単調な判定を二分探索へ接続する。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC322 G「Two Kinds of Base」](https://atcoder.jp/contests/abc322/tasks/abc322_g) — 主題: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)。既習技能: 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC326 E「Revenge of "The Salary of AtCoder Inc."」](https://atcoder.jp/contests/abc326/tasks/abc326_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC327 F「Apples」](https://atcoder.jp/contests/abc327/tasks/abc327_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC328 G「Cut and Reorder」](https://atcoder.jp/contests/abc328/tasks/abc328_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f) — 主題: [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC346 G「Alone」](https://atcoder.jp/contests/abc346/tasks/abc346_g) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g) — 主題: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g) — 主題: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC351 E「Jump Distance Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC351 F「Double Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_f) — 主題: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC359 G「Sum of Tree Distance」](https://atcoder.jp/contests/abc359/tasks/abc359_g) — 主題: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC360 E「Random Swaps of Balls」](https://atcoder.jp/contests/abc360/tasks/abc360_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC360 F「InterSections」](https://atcoder.jp/contests/abc360/tasks/abc360_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC361 E「Tree and Hamilton Path 2」](https://atcoder.jp/contests/abc361/tasks/abc361_e) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 / 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。
- [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。
- [ABC376 E「Max × Sum」](https://atcoder.jp/contests/abc376/tasks/abc376_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC378 E「Mod Sigma Problem」](https://atcoder.jp/contests/abc378/tasks/abc378_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。 拡大体・畳み込み・等比点評価を既習として接続する。拡大体で数列の一般項を指数の式へ変換し、周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g) — 主題: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC384 E「Takahashi is Slime 2」](https://atcoder.jp/contests/abc384/tasks/abc384_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC392 F「Insert」](https://atcoder.jp/contests/abc392/tasks/abc392_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC396 F「Rotated Inversions」](https://atcoder.jp/contests/abc396/tasks/abc396_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g) — 主題: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC401 F「Add One Edge 3」](https://atcoder.jp/contests/abc401/tasks/abc401_f) — 主題: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC404 F「Lost and Pound」](https://atcoder.jp/contests/abc404/tasks/abc404_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC407 E「Most Valuable Parentheses」](https://atcoder.jp/contests/abc407/tasks/abc407_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 dp[p_h]=1+max_{|j−p_h|≤R,H_j≤h−D}dp[j]。高さ順にeligibleな点だけを有効化し、残る位置条件を区間最大にする。二条件の全点走査がsortとO(N log N)の更新・取得になる。
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC411 G「Count Cycles」](https://atcoder.jp/contests/abc411/tasks/abc411_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 総数順の最適方策を証明し、自己loopを移項する。dp_i=(1+Σ_{j>i}A_j dp_j/S)/(1−Σ_{j<i}A_j/S)。prefix Aと降順の重み付きsuffix和で、一状態の全色走査を定数時間へ落とす。
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g) — 主題: [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g) — 主題: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。
- [ABC418 E「Trapezium」](https://atcoder.jp/contests/abc418/tasks/abc418_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。
- [ABC421 E「Yacht」](https://atcoder.jp/contests/abc421/tasks/abc421_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC424 E「Cut in Half」](https://atcoder.jp/contests/abc424/tasks/abc424_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。
- [ABC425 F「Inserting Process」](https://atcoder.jp/contests/abc425/tasks/abc425_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g) — 主題: [bit列をTrieで索引化する](/learn/query/binary-trie/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g) — 主題: [Segment Tree Beats](/learn/query/segment-tree-beats/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC431 F「Almost Sorted 2」](https://atcoder.jp/contests/abc431/tasks/abc431_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。既習技能: 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC433 F「1122 Subsequence 2」](https://atcoder.jp/contests/abc433/tasks/abc433_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC434 E「Distribute Bunnies」](https://atcoder.jp/contests/abc434/tasks/abc434_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。
- [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。
- [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e) — 主題: [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC436 E「Minimum Swap」](https://atcoder.jp/contests/abc436/tasks/abc436_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC436 F「Starry Landscape Photo」](https://atcoder.jp/contests/abc436/tasks/abc436_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 二部彩色と整数最大流を既習とする。頂点・色組の使用回数A_{v,k}を容量に置き、流量N−1から各木辺の削除時の色対を固定する。一対一matchingではない。次に、実行可能な辺がないと仮定して葉から根へ条件を伝播させると矛盾することを示す。一辺削除した後も残りの回数制約が保たれるため、この存在証明を帰納的に繰り返して操作列を復元できる。静的な割当の可否と時系列の実行可能性を別々に証明する。
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。
- [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g) — 主題: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC440 F「Egoism」](https://atcoder.jp/contests/abc440/tasks/abc440_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC444 F「Half and Median」](https://atcoder.jp/contests/abc444/tasks/abc444_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。
- [ABC446 G「221 Subsequence」](https://atcoder.jp/contests/abc446/tasks/abc446_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 各値列の辞書順最小添字列だけを数える正準化から、直前位置の開区間L_p<j<R_pを導く。dp[p]=Σ dp[j]をrange sumとpoint addへ写し、O(N²)をO(N log N)へ減らす。
- [ABC447 E「Divide Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC447 G「Div. 1 & Div. 2」](https://atcoder.jp/contests/abc447/tasks/abc447_g) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。
- [ABC449 E「A += v」](https://atcoder.jp/contests/abc449/tasks/abc449_e) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC450 G「Random Subtraction」](https://atcoder.jp/contests/abc450/tasks/abc450_g) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e) — 主題: [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC452 F「Interval Inversion Count」](https://atcoder.jp/contests/abc452/tasks/abc452_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 N=2を別扱いし、元の木の葉に重み1、他に0を置いて一点だけ均衡分離点を選ぶ。各成分の葉数が全葉数の半分以下になることを使い、残数最大の異なるgroupへ色を配る。削除後に生じた葉を数え直したり、各成分を再帰的に重心分解したりしない。
- [ABC455 F「Merge Slimes 2」](https://atcoder.jp/contests/abc455/tasks/abc455_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)。既習技能: 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC463 F「Senshuraku」](https://atcoder.jp/contests/abc463/tasks/abc463_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC465 G「Sum of Mex of Mod of Linear」](https://atcoder.jp/contests/abc465/tasks/abc465_g) — 主題: [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC466 E「Range Flip」](https://atcoder.jp/contests/abc466/tasks/abc466_e) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

## 根拠

- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-chapter-modeling`
