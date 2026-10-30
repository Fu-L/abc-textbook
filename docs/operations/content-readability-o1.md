# O1：幾何・凸性・最適化の本文調査

2026-10-30、[調査Issue #184](https://github.com/Fu-L/abc-textbook/issues/184)の16単元・50問を、main
`47142423`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)へ具体的な改稿対象と残範囲を渡す文書であり、**教材改修の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・full/短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

次表は現homeの`directProblemIds`を既存順で記す。#184の固定50問と一致し、重複はない。難易度順の再計算には使わない。問題本文は`src/content/docs/problems/`配下の各IDと同名のMarkdownへ一意に対応する。

| 対象単元                                                                                                                                      | 現在の直接配置問題                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [index.md](../../src/content/docs/learn/geometry-optimization/index.md)                                                                       | 直接配置なし                                                                                                                                                                        |
| [geometry-primitives.md](../../src/content/docs/learn/geometry-optimization/geometry-primitives.md)                                           | `abc248-e`, `abc437-f`, `abc442-e`, `abc223-e`, `abc366-e`, `abc426-e`, `abc351-e`, `abc385-f`, `abc377-f`, `abc353-f`, `abc296-g`, `abc258-f`, `abc220-g`, `abc234-ex`, `abc301-g` |
| [cyclic-order-crossing.md](../../src/content/docs/learn/geometry-optimization/cyclic-order-crossing.md)                                       | `abc338-e`                                                                                                                                                                          |
| [convex-geometry.md](../../src/content/docs/learn/geometry-optimization/convex-geometry.md)                                                   | 直接配置なし                                                                                                                                                                        |
| [convex-boundary-hull.md](../../src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)                                         | `abc341-g`, `abc275-g`, `abc286-ex`, `abc244-ex`, `abc356-g`, `abc257-ex`                                                                                                           |
| [half-plane-constraints.md](../../src/content/docs/learn/geometry-optimization/half-plane-constraints.md)                                     | `abc251-g`                                                                                                                                                                          |
| [line-envelope.md](../../src/content/docs/learn/geometry-optimization/line-envelope.md)                                                       | `abc289-g`, `abc228-h`, `abc372-g`, `abc448-g`                                                                                                                                      |
| [discrete-convex.md](../../src/content/docs/learn/geometry-optimization/discrete-convex.md)                                                   | 直接配置なし                                                                                                                                                                        |
| [basic-convex-optimization.md](../../src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)                               | `abc224-g`, `abc314-ex`                                                                                                                                                             |
| [separable-convex-marginals.md](../../src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)                             | `abc216-e`, `abc359-f`, `abc389-e`, `abc373-f`, `abc369-g`, `abc383-g`                                                                                                              |
| [slope-trick.md](../../src/content/docs/learn/geometry-optimization/slope-trick.md)                                                           | `abc250-g`, `abc217-h`, `abc458-g`, `abc406-g`, `abc275-ex`                                                                                                                         |
| [fractional-parametric-search.md](../../src/content/docs/learn/geometry-optimization/fractional-parametric-search.md)                         | `abc324-f`, `abc294-f`, `abc236-e`                                                                                                                                                  |
| [isotonic-regression.md](../../src/content/docs/learn/geometry-optimization/isotonic-regression.md)                                           | `abc459-f`                                                                                                                                                                          |
| [lagrangian-relaxation.md](../../src/content/docs/learn/geometry-optimization/lagrangian-relaxation.md)                                       | `abc400-g`, `abc355-g`, `abc305-ex`, `abc393-g`                                                                                                                                     |
| [monge-optimization.md](../../src/content/docs/learn/geometry-optimization/monge-optimization.md)                                             | `abc348-g`                                                                                                                                                                          |
| [two-variable-convex-lattice-optimization.md](../../src/content/docs/learn/geometry-optimization/two-variable-convex-lattice-optimization.md) | `abc459-g`                                                                                                                                                                          |

66原稿の主要説明・記法・境界・計算量を読み、代表5問（ABC341 G・ABC258 F・ABC236 E・ABC314 Ex・ABC348
G）は同居claimと公式問題文・個別公式解説まで詳しく再照合した。ABC294
Fはscoreと濃度の単位だけを追加公式照合した。**残る44問は一次確認のみ**であり、公式との全面照合や実装受入が済んだとはしない。予約した5単元も、下記の具体例・導線を中心とした診断であり、全数学的主張の詳細監査ではない。

関連先の別担当25問も、幾何・凸性との接続に必要な考察・正当性を照合した。 `abc221-g`, `abc225-e`,
`abc229-g`, `abc233-ex`, `abc240-f`, `abc240-g`, `abc243-ex`, `abc250-f`, `abc263-ex`, `abc263-g`,
`abc266-ex`, `abc274-f`, `abc280-g`, `abc283-f`, `abc315-f`, `abc323-f`, `abc330-f`, `abc343-e`,
`abc405-f`, `abc410-g`, `abc418-e`, `abc422-e`, `abc424-f`, `abc457-g`,
`abc462-e`。これらをO1の改稿へ重複予約しない。対象50問は全てfullで、短縮形式から参照元fullを追加して診断するケースはなかった。

## 代表5問の診断と改稿案

以下の公式再照合日は全て**2026-10-30**。節・引用は調査時の本文を指し、補う式・小例はCodexによる具体化案である。解法の全面的な欠落と、既にある説明から実装へ接続する不足を区別する。

### ABC341 G：右から作る凸包の符号を固定する

[現原稿](../../src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc341-g.md)の「考察」末尾は「cross
productがupper-hullのconvexityを壊す間」で止まる。平均をprefix二点の傾きにする理由、隣接辺が最大を与える説明、償却O(N)は既にある。しかし挿入は右からなので、一般の左から作る凸包のpop条件をそのまま写せない。

[公式問題](https://atcoder.jp/contests/abc341/tasks/abc341_g)と[個別公式解説](https://atcoder.jp/contests/abc341/editorial/9326)の上側境界・逆順挿入を確認した。stackをx降順、末尾二点をa,b、新点をpと定め、`cross(b−a,p−b)≤0`の間bを除く規約を導く。共線の中点を除いても傾き最大を失わない。push後は新点と一つ前の点を読み、i=Nでは答えを取らない。A=(1,3,2)なら答え(2,3,2)となる例で、曲がり・pop・共線を追う。検算の指示だけだった復習欄も、平均→傾き、suffix→右から追加という着目点へ整える。後続は[#454](https://github.com/Fu-L/abc-textbook/issues/454)。

### ABC258 F：四射影から中央区間の距離式までつなぐ

[現原稿](../../src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc258-f.md)の「考察」には四入口×四出口と、同じ帯にある平行大通り間の通常横断・二迂回があるが、射影座標と距離式がない。「正当性」は二迂回のみを説明し、中央区間を大通りだけに限るか、通常道路も許すかがそろっていない。**最終回答の誤答を示した診断ではない。**
大通り限定の中央距離と直接経路を組み合わせる流儀も区別して扱う。

[公式問題](https://atcoder.jp/contests/abc258/tasks/abc258_f)と[個別公式解説](https://atcoder.jp/contests/abc258/editorial/4237)の入口正規化・同じ帯の分岐を確認した。通常横断も許す形なら、縦大通り上のp,qが同じ帯にある場合、d=|p_x−q_x|、t=p_y
mod B、u=q_y mod Bとし、 `min(Kd+|t−u|, d+t+u, d+2B−t−u)`
をそれぞれ通常横断・下側迂回・上側迂回として導く。同じ線では最初の式が縦の直進を表す。横向きは座標交換、交差する方向・交差点・別帯ではManhattan距離へ接続する。入口・出口へのK倍費用と、全通常経路の候補を含めて最小化する。

公式解説内の剰余表記に現れるNを未定義のまま転記せず、問題の周期Bへ対応させる。K=1の直接候補、同じ線、帯境界を本文とclaimの同じ規約で説明する。後続は[#455](https://github.com/Fu-L/abc-textbook/issues/455)。

### ABC236 E：閾値変換を実行できる二状態DPへ戻す

[現原稿](../../src/content/docs/problems/string-geometry/outcome-optimize-ratio-by-parametric-search/outcome-optimize-ratio-by-parametric-search-shard-001/abc236-e.md)には平均の非負判定と下側中央値の厳密な正判定が既にある。一方、「考察」は二状態DPの紹介で止まり、初期値・更新式・終了値を一組の手順として読めない。

[公式問題](https://atcoder.jp/contests/abc236/tasks/abc236_e)と[個別公式解説](https://atcoder.jp/contests/abc236/editorial/3279)で中央値の順位、N≥2、DPと平均の誤差条件を確認した。変換重みをw_i、i枚目を選ぶ最大和をf_i、選ばない最大和をg_iとし、`f_0=g_0=0`、
`f_i=max(f_(i−1),g_(i−1))+w_i`、`g_i=f_(i−1)`、終了値`max(f_N,g_N)`を旧二値から同時更新する。N≥2なら空選択は連続非選択禁止で除かれる。A=(1,2,1,1)、K=2の中央値側は最大和0で不成功となり、等号を許せない理由を追える。平均の1000倍整数探索を選ぶなら丸め・出力倍率・整数幅も説明する。後続は[#456](https://github.com/Fu-L/abc-textbook/issues/456)。

### ABC314 Ex：探索区間・近似値・誤差を区別する

[現原稿](../../src/content/docs/problems/string-geometry/outcome-optimize-univariate-convex-function/outcome-optimize-univariate-convex-function-shard-001/abc314-ex.md)の「十分広い座標区間」「約100回」は探索幅や必要精度とつながっていない。凸集合への距離、max、部分最小化の凸性は既にあるが、epigraphという語だけで通過している。「正当性」の「全線分へ接する」は、円周での接触を要求するようにも読める。

[公式問題](https://atcoder.jp/contests/abc314/tasks/abc314_h)は閉円盤と各線分の共有点を要求し、座標は0..1000、許容誤差は10^−5である。[個別公式解説](https://atcoder.jp/contests/abc314/editorial/6958)の凸性・部分最小化・探索区間を再確認した。中心を[0,1000]²へclampしても各線分への距離が増えない理由から探索域を固定する。内積による線分射影とclamp、二中心の最近点を結ぶ距離の凸性、maxと部分最小化を順につなぐ。真のF(x)と内側探索の近似値を分け、内側誤差が外側比較に入る点も含めて反復数を説明する。残幅だけで入れ子全体の誤差保証を済ませない。

平行な二線分(0,0)–(0,4)、(4,0)–(4,4)の最小半径2で、最小中心が線分状になる例も追える。独自の誤差評価の論証は一問の後続[#457](https://github.com/Fu-L/abc-textbook/issues/457)へ限定する。

### ABC348 G：両側から選ぶ結合の有効域を決める

[現原稿](../../src/content/docs/problems/string-geometry/outcome-optimize-monge-transitions/outcome-optimize-monge-transitions-shard-001/abc348-g.md)には、行i・列kの差から右選択数kの単調性を導く式が既にある。「実装上の注意」の「cross用x_0=0を許す範囲を明示する」が未完の指示として残り、solveの一要素基底も具体化されていない。Monge単元にある両側非空の範囲と読み合わせる必要がある。

[公式問題](https://atcoder.jp/contests/abc348/tasks/abc348_g)と[個別公式解説](https://atcoder.jp/contests/abc348/editorial/9707)で、B順の分割、片側のみ・両側の区別と凹な片側による積を確認した。左長L・右長R、左Aの上位j個の和x_j、右の非空答えy_kを定義する。両側非空なら合計iに対する列は`max(1,i−L)≤k≤min(R,i−1)`、一要素基底は0個−∞・1個A−Bとする。片側のみは別比較する。別流儀でx_0を使うなら、その有効域を全節で統一する。

B順の(3,0),(-2,1),(4,2)で答え(3,5,3)を追い、右列の凹性は仮定しない。中央行の左端argmaxを境に上下の候補範囲を絞る手順と全体O(N
log²N)までつなぐ。Monge単元は照合のみとし、編集は一問の[#458](https://github.com/Fu-L/abc-textbook/issues/458)に限定する。

ABC294
Fも[現原稿](../../src/content/docs/problems/string-geometry/outcome-optimize-ratio-by-parametric-search/outcome-optimize-ratio-by-parametric-search-shard-001/abc294-f.md)冒頭の未定義s,tと二種類のscoreに限って、同日に[公式問題](https://atcoder.jp/contests/abc294/tasks/abc294_f)・[個別公式解説](https://atcoder.jp/contests/abc294/editorial/6007)を追加照合した。砂糖s、水tとして、0≤x<1ではs−(s+t)xがs−t*x/(1−x)の正の1−x倍となり、符号は一致する。別々の手法ではなく、変形と百分率でないxの定義が省かれている。最後の100倍と探索精度を含めて[#461](https://github.com/Fu-L/abc-textbook/issues/461)へ予約した。代表5問と同じ深さの全面診断には数えない。

## 後続改稿と優先順

8件を#184の標準Sub-issueへ登録した。#140にも一覧と残範囲を反映する。**6問・5単元の編集path11本に重複はなく、必須先行mergeもない。**
優先は学習への影響に基づき、教材内の問題順を変える指示ではない。

| 優先   | Issue                                                   | 編集対象と到達点                                                                          |
| ------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 先     | [#454](https://github.com/Fu-L/abc-textbook/issues/454) | ABC341 G：逆順挿入の外積符号と回答位置を固定する。                                        |
| 先     | [#455](https://github.com/Fu-L/abc-textbook/issues/455) | ABC258 F：四射影・帯・中央距離を同じ候補集合で説明する。                                  |
| 先     | [#456](https://github.com/Fu-L/abc-textbook/issues/456) | ABC236 E：閾値から初期化・同時更新・終了判定までつなぐ。                                  |
| 次     | [#457](https://github.com/Fu-L/abc-textbook/issues/457) | ABC314 Ex：探索区間と入れ子の誤差を一問で論証する。                                       |
| 次     | [#458](https://github.com/Fu-L/abc-textbook/issues/458) | ABC348 G：基底・有効域・結合の小例を具体化する。                                          |
| 次     | [#461](https://github.com/Fu-L/abc-textbook/issues/461) | ABC294 F：二種類のscoreの関係・定義・濃度の単位をそろえる。                               |
| 並行可 | [#459](https://github.com/Fu-L/abc-textbook/issues/459) | index・convex-geometry・discrete-convex：変換、支持点、差分を小例でつなぐ。               |
| 並行可 | [#460](https://github.com/Fu-L/abc-textbook/issues/460) | basic-convex-optimization・separable-convex-marginals：一変数の差分と複数列の配分を追う。 |

親三単元は空見出しではなく、具体例のない分類的な説明が主症状である。座標変換のL1距離3、有界正方形の線形目的の最大6と二次凸目的の内部最小、f(x)=(x−2)²の差分−3,−1,1,3を、それぞれの役割へ置く。

基本・限界値の二単元には差分境界・平坦部、heap/閾値、衝突グラフの交換による凹性が既にある。そこへx_1²+2x_2²、x_1+x_2=3の増分1,2,3から配分(2,1)・費用6を得る例と、同値閾値の残数配分を補う。
[ABC224 G公式解説](https://atcoder.jp/contests/abc224/editorial/2816)・[ABC359 F公式解説](https://atcoder.jp/contests/abc359/editorial/10260)も同日に確認した。既存の証明を小例へ置換せず、対象外の問題本文を一緒に改稿しない。

## 一次確認にとどめ、詳細確認へ残す範囲

**未予約44問・11単元**の詳細確認を次のまとまりで#140へ残す。予約単元の未予約問題も含む。「既に説明がある」は修正不要・品質確認済みを意味しない。

| 残る範囲                                                                                                                                                                                    | 既にある説明と、次に確認すること                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 幾何基本単元と14問：`abc248-e`, `abc437-f`, `abc442-e`, `abc223-e`, `abc366-e`, `abc426-e`, `abc351-e`, `abc385-f`, `abc377-f`, `abc353-f`, `abc296-g`, `abc220-g`, `abc234-ex`, `abc301-g` | 外積・偏角・射影・格子parity、3D直線キーと残り座標検査まである。ABC442 Eの同方向blockとwrap、ABC296 Gの縦端辺、ABC366 Eの差分境界と実際の列長、ABC234 Exの密度による比較数を公式・小例へ照合する。ABC353 FのK=2、ABC385 Fの0/−1、ABC301 Gのねじれ・有理数統合などの既存補強を欠落扱いしない。 |
| 凸包単元と残り5問：`abc275-g`, `abc286-ex`, `abc244-ex`, `abc356-g`, `abc257-ex`                                                                                                            | Andrew法・共線・方向別の鎖選択と反例がある。ABC275 Gの整数丸めの極限、ABC286 Exの内部交差判定と接線、ABC244 Exのprefixと支持点、ABC356 Gの合法chain、ABC257 Exの同時交差を公式・小点集合で詳細確認する。支持点全周を単峰としない注意、モーメント補正・整数倍率などを保持する。                |
| 円環交差単元・`abc338-e`                                                                                                                                                                    | 厳密交互順・共有端点のquery先行・LIFO不一致の証明がある。切断位置の不変性と、対象問題の全端点distinctによる線形時間を照合する。関連ABC263 Exの円周同点・接線条件は別担当へ残す。                                                                                                              |
| 半平面単元・`abc251-g`                                                                                                                                                                      | 左半平面・固定左辺の最大右辺・境界を含む条件がある。時計回り反転、整数幅、空の共通部分を小多角形へ照合する。一般の半平面交差構築とは既に区別されている。                                                                                                                                      |
| 比率探索単元・`abc324-f`（ABC236 E・ABC294 Fは#456・#461で予約済み）                                                                                                                        | 正分母・DAGの−∞と頂点順がある。ABC324 Fの全辺の変換値と到達不能、成功/失敗端と反復数を公式・小DAGへ照合する。単元内の平均・中央値の区別は保持する。                                                                                                                                           |
| `abc224-g`（基本最適化単元は#460で予約済み）                                                                                                                                                | 閾値方策・期待値・連続最小点・直接増加候補がある。受理区間の端、S=T、T=1、floor/ceilの比較を小確率過程・公式へ照合する。                                                                                                                                                                      |
| PAV単元・`abc459-f`                                                                                                                                                                         | 実数二乗損失の最適性条件と、整数均し・負の床除算・右移送のprefix証明がある。実数平均と整数両端判定を混同しない小例、併合の到達性・最小操作数を再確認する。                                                                                                                                    |
| Lagrangian単元・4問：`abc400-g`, `abc355-g`, `abc305-ex`, `abc393-g`                                                                                                                        | 双対gapの反例・支持傾き・tie規約がある。matching交換、施設の仮想端点と因果順序、予算内だけの凸列一致、循環流potential・同一支持面での補間まで既存補強がある。各問を独立に公式と小全探索へ照合し、特にABC393 Gの有理探索・oracle総費用は別途深く確認する。                                     |
| 直線包絡単元・4問：`abc289-g`, `abc228-h`, `abc372-g`, `abc448-g`                                                                                                                           | 傾き・交点の向き、Li Chao、整数切替とstrict条件がある。購買人数の同値、完成面積から元面積を引く式、C−1とfloor_sumの接続、二列gameのbasisと最終三角形上の探索を公式・小例へ照合する。                                                                                                          |
| Monge単元（問題ABC348 Gは#458で予約済み）                                                                                                                                                   | 全単調性と通常のargmin単調性の差、SMAWK削減・補間・因果性・無効域の注意がある。行列例で列削除の不変量と同点規約を追い、帯状有効域を∞で埋めてもよいかを別に確認する。算法欠落として新実装を予約しない。                                                                                        |
| 限界値の6問：`abc216-e`, `abc359-f`, `abc389-e`, `abc373-f`, `abc369-g`, `abc383-g`（単元は#460で予約済み）                                                                                 | 閾値・残数、木の次数列の十分性、奇数倍価格、重さ群DP、木の初回bonus、等長barの交換証明がある。exact/at-most、0利得、同点価格、各DPの全体費用を小列・小木で照合する。凹列のmaxが一般には凹でないという既存注意を保つ。                                                                         |
| slope trick単元・5問：`abc250-g`, `abc217-h`, `abc458-g`, `abc406-g`, `abc275-ex`                                                                                                           | hinge恒等式・初期位置penalty・有限domainの整数端点、重み付きevent・定数項・復元・削除込み償却まである。売値二重挿入、射撃前のshift、日ごとの床と余り、clipの部分削除、同BのCartesian代表を各問の素朴DPへ照合する。基本二heapだけへ一括短文化しない。                                          |
| 二変数格子単元・`abc459-g`                                                                                                                                                                  | 交点候補と四方向のsublevel集合、距離2以内の整数解の論証がある。問題から係数への対応、偶奇・拡張Euclid、負有理数のfloor、連続最適点と列挙範囲を小歩数BFS・公式まで詳細確認する。一般の凸性だけで近傍を保証してはいけない。                                                                     |

英語混在、分類文の反復、検算を指示するだけの復習欄、未区切りTeXは改稿・詳細確認の中で文脈に即して扱う。一律に空節や例題を追加しない。共通生成器・reader・rendererが原因と実証した症状はなく、基盤修正Issue・#107の再実装・一括再生成は追加しない。

## 検証と限界

- Node.js 26.12.1 / npm
  11.20.0で`npm run notation:report -- <対象66原稿の実path>`を実行し、**66原稿・429候補・明示数式エラー0件**、exit
  0。全429候補は50問の「制約との対応」にある未区切りTeXで、一つの式中のコマンドも別々に数える。確定表示不具合429件とは数えず、数式区切りのない通常の式を全て検出する検査でもない。npm指定11.21.1との差は残し、依存・lockfileは変更していない。
- 対象50問と関連25問の正当性節は、既存validatorと同じ括弧escape正規化後に同居claimと一致した。一致を数学的正しさの保証とはしない。
- 一時検算でABC341 GはN=1..7、A_i=1..4の21,844列を全区間平均と有理数で比較した。ABC258
  FはB,K=1..4、始終点の各座標0..6の38,416件を小格子Dijkstraと比較した。
- ABC236
  EはN=2..6、A_i=1..3、閾値1/2..7/2の7,623組で全合法subsetの最大和・下側中央値と比較した。ABC348
  Gは固定seedでN=1..10各100例、計1,000例の全subset回答と左端argmax単調性を確認した。
- ABC294
  Fは砂糖・水の各量1..4と5閾値の1,280組で、二scoreの正の定数倍と実濃度判定の一致を有理数で確認した。
- ABC314
  Exは平行二線分の解析解2と入れ子100回の結果2.0が一致した。小例の一致は一般の誤差証明・最大制約の実装性能・完成教材の表示検証ではない。
- `npm run verify:fast -- --base origin/main`は文書のみの検証を選び成功した。Prettierとローカルリンク25件、既存比較画像への参照133件も通過した。変更Markdownの書式・ローカルリンク、16単元・50問の存在とhome、関連25問、後続Issueの編集pathの重複と残範囲を確認した。教材本文・分類JSON・共通表示を変更しない文書PRなのでbuild・E2Eは行わない。後続改稿では各Issueの公式根拠・論証・本文/claim・既存schema/reader、本番subpathのbuild/内部リンク、対象の文章と表示を確認する。

この調査の完成・merge後も、上記8件と未予約44問・11単元の詳細確認を#140の未完了範囲に残す。#184だけの完了でEpicを閉じない。
