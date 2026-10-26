# G1：探索・到達・連結性・ポテンシャルの本文調査

2026-10-26、[調査Issue #176](https://github.com/Fu-L/abc-textbook/issues/176)の10単元・32問を、main
`534cc9a5`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)に対し、改稿対象と残範囲を具体化する調査であり、**教材改稿の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・fullと短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

次表はhomeの`directProblemIds`を既存順で記した担当範囲。分類・問題順を再評価する表ではない。問題本文は`src/content/docs/problems/`配下で各IDと同名のMarkdownに一意に対応する。

| 対象単元                                                                                              | 担当Problem ID                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [index.md](../../src/content/docs/learn/graph/index.md)                                               | 直接配置なし                                                                                                                                                                       |
| [graph-search.md](../../src/content/docs/learn/graph/graph-search.md)                                 | 直接配置なし                                                                                                                                                                       |
| [state-graph-search.md](../../src/content/docs/learn/graph/state-graph-search.md)                     | `abc446-e`, `abc289-e`, `abc429-e`, `abc302-f`, `abc305-f`, `abc394-e`, `abc446-f`, `abc244-f`, `abc427-e`, `abc241-f`, `abc443-f`, `abc319-g`, `abc355-e`, `abc414-f`, `abc361-g` |
| [transitive-closure.md](../../src/content/docs/learn/graph/transitive-closure.md)                     | `abc292-e`, `abc287-ex`                                                                                                                                                            |
| [directional-grid-effect-scan.md](../../src/content/docs/learn/graph/directional-grid-effect-scan.md) | `abc317-e`                                                                                                                                                                         |
| [bipartite-structure.md](../../src/content/docs/learn/graph/bipartite-structure.md)                   | `abc451-f`                                                                                                                                                                         |
| [connectivity.md](../../src/content/docs/learn/graph/connectivity.md)                                 | 直接配置なし                                                                                                                                                                       |
| [dsu-components.md](../../src/content/docs/learn/graph/dsu-components.md)                             | `abc420-e`, `abc304-e`, `abc372-e`, `abc276-e`, `abc392-e`, `abc401-e`, `abc434-e`, `abc335-e`, `abc238-e`, `abc279-f`                                                             |
| [graph-potential-propagation.md](../../src/content/docs/learn/graph/graph-potential-propagation.md)   | `abc396-e`, `abc280-f`                                                                                                                                                             |
| [potential-dsu.md](../../src/content/docs/learn/graph/potential-dsu.md)                               | `abc328-f`                                                                                                                                                                         |

全42原稿の主要な説明、正当性、境界、計算量と記法を一次確認した。**代表5問（ABC427 E・ABC446
F・ABC392 E・ABC328 F・ABC396 E）は、同居claimと公式問題文・個別公式解説まで再照合した。**
改稿する5単元も、下記の小例・手順まで具体化した。

**残る27問・5単元は一次確認のみ（うちABC372
Eは順位の訂正へ予約）**で、修正不要・品質確認済みとは扱わない。対象32問と、10単元の関連先にある範囲外72問は全て`full`、`primaryProblemId: null`だった。短縮形式の参照元を追加で読む対象はない。関連72問は形式・正当性を接続確認として読み、担当や詳細診断の件数へ加えていない。初期改稿や他分野の担当へ重複予約しない。

## 詳しく確認した代表5問

公式根拠の再照合日は全て2026-10-26。以下は主に、正しい方針を読者が具体的な手順へ落とせるようにする課題であり、解法全体の誤りという診断ではない。

### ABC427 E：消滅を記録する矩形と、現在の変位を分ける

[現稿](../../src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc427-e.md)の「考察」は六変数とTの逆像による禁止判定を持つが、「端行または端列を矩形から縮める」だけでは更新式が定まらない。「実装上の注意」の空端行・端列の正規化も、必須か、各遷移O(1)と両立するかが未説明である。

0始まりで、生き残り得る初期座標を半開矩形`[lx,rx)×[ly,ry)`、現在座標を`(x+dx,y+dy)`と定義する。次の変位`dx',dy'`に対して`lx'=max(lx,−dx')`、`rx'=min(rx,H−dx')`、列も同様に交差を取る。風を戻しても消えたごみは戻らない。Tの逆像に生存するごみがあれば遷移禁止、矩形内のごみ数が0なら終端とする。同じ配置を表す六変数が複数あっても探索できるので、空端の走査を必須にしない。状態数評価では非空状態の変位の範囲と、空になった時点で終了することを結ぶ。[公式問題](https://atcoder.jp/contests/abc427/tasks/abc427_e)・[個別公式解説](https://atcoder.jp/contests/abc427/editorial/14197)の六変数によるBFSを根拠とする。

### ABC446 F：到達と「一歩先に現れた」を別の配列で持つ

[現稿](../../src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc446-f.md)の「考察」は必要十分条件と増分探索を説明するが、「集合/最小前駆集計へ反映」「reachableCount=iなら境界数」では、保持情報と更新時点が曖昧である。特に未有効頂点に辺が伸びていても、その先へ直ちに探索してよいわけではない。

prefix誘導グラフで1から届く集合をR、R自身とその全出辺先の和集合をCとし、`seen`と`covered`を分ける一案へ具体化する。`covered[1]=true`から始め、段階iでcovered[i]なら、iから番号≤iの未到達頂点だけを展開する。新規到達頂点の全出辺先をCへ重複なく加え、|R|=iなら|C|−i、そうでなければ−1。sample1ではi=3で未到達だった3へ、i=4の4→3で届く。入辺だけの頂点、自己ループ、多重辺でも区別を保つ。有向到達性を無向DSUへ置き換えない。[公式問題](https://atcoder.jp/contests/abc446/tasks/abc446_f)・[個別公式解説](https://atcoder.jp/contests/abc446/editorial/16384)の二つの集合と線形時間の更新を再照合した。

### ABC392 E：別成分の選び方も全体計算量へ含める

[現稿](../../src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc392-e.md)には、余剰辺のglobal
listと`M−N+C≥C−1`の十分な資源量の証明がある。一方、「別成分へ一端をつなぎ替える」で接続先の選び方が止まる。毎回全頂点を探す実装では、現稿のO((N+M)α(N))へつながらない。

現在のDSU根を双方向リストで保つ一案なら、余剰辺の残す端点の根sと、リスト先頭（それがsなら次）の根tを結べる。併合で吸収された根をO(1)でリストから外す。辺を`(edgeID,u,v)`で保存しv側をtへ移すなら、出力は`(edgeID,v,t)`。元のforestを一度も取り除かないので、未使用余剰辺も安全に残る。ordered
setを使うならlog因子も反映する。[公式問題](https://atcoder.jp/contests/abc392/tasks/abc392_e)・[個別公式解説](https://atcoder.jp/contests/abc392/editorial/12146)は余剰辺による最小回数の構成を確認する根拠であり、このglobal
listと根リストの具体化は本稿の独自補足として検算した。

### ABC328 F：問題の差の向きを、親差の式へ代入する

[現稿](../../src/content/docs/problems/graph-search/outcome-maintain-potential-differences/outcome-maintain-potential-differences-shard-001/abc328-f.md)は同成分の採用判定を持つが、異成分では「root間potentialを逆算」「符号を小例で統一」に留まる。[親Unit](../../src/content/docs/learn/graph/potential-dsu.md)は逆向きの制約`p[v]−p[u]=w`について既に式を導いているので、その説明を欠落扱いせず対応付ける。

`diff[v]=X_v−X_parent[v]`とし、圧縮後の`pa=X_a−X_ra`、`pb=X_b−X_rb`を使う。問題の`X_a−X_b=d`から`X_rb−X_ra=pa−pb−d`となり、rbをraへ付けるならこれを親差にする。逆向きの併合では符号反転する。旧親のfind後に差を加える圧縮と、同根ならpa−pb=dという判定を一つの例で追う。棄却は採用辺を増やさないことであり、findの圧縮まで戻す必要はない。[公式問題](https://atcoder.jp/contests/abc328/tasks/abc328_f)・[個別公式解説](https://atcoder.jp/contests/abc328/editorial/7656)の親差は親−子なので、本稿の子−親と混ぜない。a=b、根の大小逆転、棄却後の次の制約、64bitを確認する。

### ABC396 E：根を0にした伝播と、根の最適化は別の段階

[現稿](../../src/content/docs/problems/graph-search/outcome-propagate-static-graph-potentials/outcome-propagate-static-graph-potentials-shard-001/abc396-e.md)には全解`A_v=p_v XOR t`、各bitの多数決、矛盾検査と計算量が既にある。ここを再導出だけで長くせず、根を0にした仮の解から実際に総和が減る一例でつなぐ。

独自例`p=(0,1,1)`では、t=0の総和2に対しt=1なら`(1,0,0)`で総和1となる。根の値は増えても全体では改善する。各bitの重み2^b、同数ならどちらでもよいこと、高位bitを立てる利点がないこと、孤立点は0、矛盾時は−1を、探索→自由度の最適化→出力へ接続する。[公式問題](https://atcoder.jp/contests/abc396/tasks/abc396_e)・[個別公式解説](https://atcoder.jp/contests/abc396/editorial/12390)のbit独立な最小化と整合する。次の静的ポテンシャル単元と合わせて一つの改稿にする。

## 単元で補う説明

- **graph-search・state-graph-search**：親はDFS/BFSの用途、子はABC244
  Fのmaskが増減することまで書かれている。親へ、s-a-c-tとs-b-tの独自例から、DFSの到達とFIFOの距離層を区別する説明を補う。子では二頂点のwalk1→2→1を、頂点1を下位bitとして`(01,1)→(11,2)→(10,1)`と追い、位置だけでは目標判定が変わることを示す。global
  visitedと単純経路列挙時のpath内だけの訪問禁止も分ける。singleton距離1・空walk=0の既存説明は残す。[ABC244 F公式問題](https://atcoder.jp/contests/abc244/tasks/abc244_f)・[個別公式解説](https://atcoder.jp/contests/abc244/editorial/3599)を再照合した。問題本文の改稿は予約しない。
- **connectivity・dsu-components**：親の「必要な情報が違う」を、無向の静的探索・辺追加・頂点間差のどれを問うかへ具体化する。子には初期化・併合式・辺数更新・縮約が既にある。4頂点へ1-2、2-3、1-3を追加し、最後はsizeと成分数が変わらず辺数だけ増える小例を添える。黒の存在を個数で持つとtoggleへ対応できる理由は[ABC420 E公式問題](https://atcoder.jp/contests/abc420/tasks/abc420_e)・[個別公式解説](https://atcoder.jp/contests/abc420/editorial/13740)、削除への限界は[ABC229 E公式問題](https://atcoder.jp/contests/abc229/tasks/abc229_e)・[個別公式解説](https://atcoder.jp/contests/abc229/editorial/2958)と照合した。DSUの親linkを元グラフの道としない既存の注意は残す。
- **graph-potential-propagation**：概要は未定義の演算⊙で加法・XORを共通化するが、その後は加法の逆辺−wと閉路和0だけである。加法は一般解p+t、逆辺−w、閉路和0、XORは一般解p
  XOR t、逆辺もw、閉路XOR=0と、小さい三頂点例から説明する。ABC280
  Fの非零閉路→infは、往復可能なwalkの利得最大化という問題固有の意味付けであり、等式系に解があるという意味ではない。[公式問題](https://atcoder.jp/contests/abc280/tasks/abc280_f)・[個別公式解説](https://atcoder.jp/contests/abc280/editorial/5303)とも再照合した。ABC280
  F・ABC352 Fは照合のみ。

上記の公式再照合日も2026-10-26。小例は説明のための独自例で、接続先問題の入力例そのものと区別する。

## 後続改稿と優先順

6問・5単元を8件へ具体化した。ABC372
Eは一次確認からの順位の訂正予約であり、代表5問と同じ深さの公式再照合済みとは扱わない。各Issueに実path、症状、補う説明、公式根拠、検証、依存を記した。編集pathは相互に重複しない。

| 優先             | 後続Issue                                               | 編集対象と到達点                                                   |
| ---------------- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| 順位境界の訂正   | [#345](https://github.com/Fu-L/abc-textbook/issues/345) | ABC372 E：「B位以下」を「B位より下」へ統一し、保持境界を小例で確認 |
| 状態・操作の対応 | [#338](https://github.com/Fu-L/abc-textbook/issues/338) | ABC427 E：初期座標の生存矩形、変位、四方向の交差更新と終端         |
| 到達と境界の区別 | [#339](https://github.com/Fu-L/abc-textbook/issues/339) | ABC446 F：RとC、未有効頂点、頂点有効化と線形時間                   |
| 加法・XORの区別  | [#342](https://github.com/Fu-L/abc-textbook/issues/342) | 静的ポテンシャル単元＋ABC396 E：逆辺、閉路整合性、根の自由度       |
| 基礎への導線     | [#343](https://github.com/Fu-L/abc-textbook/issues/343) | graph-search・state-graph-search：距離層、状態の十分性、訪問範囲   |
| 基礎への導線     | [#344](https://github.com/Fu-L/abc-textbook/issues/344) | connectivity・dsu-components：併合、同根辺、成分属性の小例         |
| 符号を導く       | [#341](https://github.com/Fu-L/abc-textbook/issues/341) | ABC328 F：問題の差から親差、併合方向、圧縮と棄却後の扱い           |
| 全操作の費用     | [#340](https://github.com/Fu-L/abc-textbook/issues/340) | ABC392 E：別成分の選択、根リスト、辺の出力と資源の不変条件         |

ABC372
Eの「正当性」にある「成分内B位以下の頂点には既にB個の大きい頂点があり」は、B位では大きい頂点がB−1個なので前後の上位B個保持と食い違う。捨てる範囲はB位より下であり、B=2の列(9,7,4)なら7を残して4を捨てる。既存のk−1参照と上位10個の手順は保ち、[#345](https://github.com/Fu-L/abc-textbook/issues/345)で公式再照合と訂正を行う。

全件1 Issue＝1
PR、必須の先行mergeなし。#176のmergeや、他分野の全調査、#141・#142の完了を待たない。ABC427
Eの状態圧縮、ABC392
Eの構成は各一問に分けた。関連先の初期改稿・他分野の担当を重複予約しない。#140へこの8件と残範囲を反映し、8件を標準Sub-issueへ登録した。

共通生成器・reader・renderer起因の再現は実証していない。本文の定義・手順・説明不足を共通基盤の不具合へ置き換えず、基盤改修Issueや一括再生成を追加しない。

## 一次確認のみの残範囲

担当表から予約6問・5単元を除く**26問・5単元**は、代表と同じ深さの公式再照合・数学監査を済ませていない。次の範囲と着眼点を#140の未完了として残す。既にある説明を未実装扱いして書き直さない。

| 範囲                                               | 既存の説明と、次の詳細確認の着眼点                                                                                                                                                                                                                                                                  |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 状態グラフ：ABC427 E・ABC446 Fを除く13問           | ABC289 Eの次数和、ABC394 Eの0/1中心の順と自己loop、ABC443 Fの桁走査打切りの証明、ABC319 Gの走査償却、ABC414 Fの二到着、ABC361 Gの区間長方形の構築と境界証明はある。逆到達の目標集合、同時移動の色、補助辺数から元操作数への変換、対話の受信・終了、木のjump境界などを公式・小例へ接続して確認する。 |
| 推移閉包：2問、transitive-closure                  | 単元には対角初期化・k最外・in-place・初回段階と距離の区別がある。ABC292 Eの始点除外と元辺数、ABC287 Exの端点番号もthresholdへ含める条件はある。正長到達との違い、bitsetのword数・質問走査の費用を詳細確認する。                                                                                     |
| 方向別走査：ABC317 E、directional-grid-effect-scan | 壁・人は遮るが監視済み普通マスは遮らず、S/Gも光を通す説明がある。四方向の開始・解除・方向更新の順と、原盤面を通行禁止印で上書きしないことを小例・公式で確認する。                                                                                                                                   |
| 二部構造：ABC451 F、bipartite-structure            | 二色反転の自由度、孤立点、成分ごとの寄与、small-to-largeの倍増論証はある。同成分の奇閉路判定、色反転時の個数更新、根とmember容器の対応、非二部化後の出力を公式まで確認する。関連の彩色数補正・ゲーム問題は別担当。                                                                                  |
| DSU：ABC392 E・ABC372 Eを除く8問                   | 黒数、独立query、S除去、prefix境界、木/非木、等値縮約、累積和差分、箱と球の間接参照は既に具体化されている。同根更新、到達不能の出力、空箱と新しい代表などを小例・公式へつなぐ。                                                                                                                     |
| 静的差：ABC280 F                                   | nan/inf/有限差の分類、逆辺の符号、非零closed walkの反復と全queryへの波及はある。静的単元の改稿と照合し、自己loop・多重辺・x=y・他成分のbadが影響しないことを公式と小例で詳細確認する。                                                                                                              |
| 重み付きDSU：potential-dsu                         | 子−親差、旧親find後の加算、根間差、逆向きの符号、同根判定、badのORまで式がある。式がないという理由で予約しない。ABC328 Fへの向きの接続と、矛盾追加を棄却する運用・矛盾を保持する運用の違いを小例で詳細確認する。                                                                                    |
| 章入口：index                                      | 読書順と分野の見取り図はある。各手法の英語名が密な導入を、探索・連結・距離・向きという問いから読めるか、子単元改稿後に読み直す。章全体の再設計は予約しない。                                                                                                                                        |

空見出しや分類用の反復を、今回の独立した確定不具合として予約したページはない。英語混在・記号の読みづらさが残る原稿を含み、一次確認だけで全ページの文章・表示を保証しない。

## 検証と記法候補

- `npm run notation:report -- <対象10単元と32問の実path>`：Node.js 26.12.1 / npm
  11.21.1で**42原稿、313候補、明示数式エラー0件**。全313件は問題の「制約との対応」の`UNDELIMITED_TEX`で、同じ文中の複数コマンドを別候補として数える。表示不具合313件とは扱わない。各改稿で範囲・記号の意味を読んで明示数式化する候補に残し、未予約分は上の詳細確認へ含める。
- 改稿案の検算：ABC427 Eは333小盤面で直接ごみ集合BFSと六変数BFSが一致し、公式例の3と−1も確認。ABC446
  Fは1,328小グラフで削除集合全探索と全prefixの答えが一致。ABC392
  Eは自己loopへ余剰が偏る場合を含む1,213グラフで根リスト方式の操作を実グラフへ適用し、合法な端点変更・最終連結性・C−1回を確認。ABC328
  Fは600列・18,000制約を採用辺の探索と比較し、公式例の採用1,2,4,5も一致。ABC396
  Eは600成分で8通りの根mask全探索とbit別最小化を照合した。これらを一般証明の代用にしない。
- 対象32
  IDの一致・重複なし、homeの既存順、10単元・32問の実path、関連72問の形式、後続8件の編集pathの重複なしを確認した。一時的な取得結果・検算コード・管理台帳はcommitしない。
- 変更Markdownの書式・19ローカル参照は既存の`.github/actions/nonpublic-docs/check.mjs --files`、差分は`git diff --check`で確認した。教材・分類・表示を変更しない文書PRなのでbuild・E2Eは対象にしない。後続の改稿では公式根拠・論証、本文とclaim、必要なschema/reader検証、本番subpathのbuild・内部リンク・文章と表示を確認する。
