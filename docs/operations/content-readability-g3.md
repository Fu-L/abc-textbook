# G3：matching・flow・core・グラフの発展の本文調査

2026-10-26、[調査Issue #178](https://github.com/Fu-L/abc-textbook/issues/178)の15単元・37問を、main
`50a45974`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)へ具体的な改稿と残範囲を渡す調査であり、**教材改稿の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・fullと短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

homeの`directProblemIds`を既存順で記す。分類・難易度順を再計算する表ではない。問題本文は`src/content/docs/problems/`配下の各IDと同名のMarkdownへ一意に対応する。

| 対象単元                                                                                                            | 担当Problem ID                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [flow-matching.md](../../src/content/docs/learn/graph/flow-matching.md)                                             | 直接配置なし                                                                                                                                   |
| [bipartite-matching.md](../../src/content/docs/learn/graph/bipartite-matching.md)                                   | `abc401-g`, `abc274-g`, `abc445-g`, `abc461-g`, `abc320-g`, `abc374-g`, `abc317-g`, `abc215-h`                                                 |
| [max-flow-min-cut.md](../../src/content/docs/learn/graph/max-flow-min-cut.md)                                       | `abc318-g`, `abc239-g`, `abc241-g`, `abc259-g`, `abc326-g`, `abc225-g`, `abc263-g`, `abc332-g`, `abc437-g`, `abc347-g`, `abc397-g`, `abc227-h` |
| [graph-core-peeling.md](../../src/content/docs/learn/graph/graph-core-peeling.md)                                   | 直接配置なし                                                                                                                                   |
| [graph-core.md](../../src/content/docs/learn/graph/graph-core.md)                                                   | `abc226-e`, `abc266-f`                                                                                                                         |
| [cycle-space-basis.md](../../src/content/docs/learn/graph/cycle-space-basis.md)                                     | 直接配置なし                                                                                                                                   |
| [monotone-path-contraction.md](../../src/content/docs/learn/graph/monotone-path-contraction.md)                     | `abc295-g`                                                                                                                                     |
| [near-tree-kernelization.md](../../src/content/docs/learn/graph/near-tree-kernelization.md)                         | `abc419-g`                                                                                                                                     |
| [directed-walk-periodicity.md](../../src/content/docs/learn/graph/directed-walk-periodicity.md)                     | `abc306-g`                                                                                                                                     |
| [flow-lower-bounds.md](../../src/content/docs/learn/graph/flow-lower-bounds.md)                                     | `abc285-g`                                                                                                                                     |
| [min-cost-flow.md](../../src/content/docs/learn/graph/min-cost-flow.md)                                             | `abc247-g`, `abc407-g`, `abc421-g`, `abc231-h`, `abc224-h`, `abc214-h`                                                                         |
| [weighted-bipartite-matching.md](../../src/content/docs/learn/graph/weighted-bipartite-matching.md)                 | `abc373-g`                                                                                                                                     |
| [planar-duality.md](../../src/content/docs/learn/graph/planar-duality.md)                                           | `abc413-g`                                                                                                                                     |
| [path-matching-contraction.md](../../src/content/docs/learn/graph/path-matching-contraction.md)                     | `abc464-g`, `abc218-h`                                                                                                                         |
| [min-weight-general-perfect-matching.md](../../src/content/docs/learn/graph/min-weight-general-perfect-matching.md) | `abc412-g`                                                                                                                                     |

全52原稿の主要な説明、正当性、境界・計算量と記法を一次確認した。**代表5問（ABC445 G・ABC285
G・ABC332 G・ABC413 G・ABC464 G）は、同居claimと公式問題文・個別公式解説まで再照合した。** ABC247
Gは全人数出力とライブラリの呼出し契約、coreの二単元とflowの親単元は下記の小例・接続を追加確認した。全原稿の詳細な数学監査・表示確認とは区別する。

対象37問と、関連先の範囲外8問（ABC237 Ex・ABC313 Ex・ABC318 F・ABC354 G・ABC363 G・ABC393 G・ABC424
G・ABC451
G）は全て`full`、`primaryProblemId: null`。短縮形式の参照元を追加で読む必要はなかった。関連8問は接続する考察・正当性を読み、担当数や改稿予約には加えていない。各対象の正当性と同居claimのtextは一致しているが、同じ文章であることを論証の正しさの保証とはしない。

Hallの十分性・Kőnigの復元、DAGの元辺と推移閉包の区別、最小費用流の全残余辺でのpotential更新、下限の符号、near-treeの成分別縮約、一般matchingのTutte評価・補間などは既に詳しく書かれている。ABC215
H・ABC263 G・ABC295 G・ABC347 G・ABC437 G・ABC218 H・ABC412
G等の既存補強も欠落扱いしない。初期改稿・他分野の担当と編集pathを重複予約しない。

## 詳しく確認した代表5問

公式根拠の再照合日は全て2026-10-26。以下は現稿の方針を保って、読者が式・操作・逆対応を再構成できるようにする改稿案である。小例は独自例。

### ABC445 G：gcdで変えるのは色の式であり、マスの頂点数ではない

[現稿](../../src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc445-g.md)の「考察」の「gcd
blockへ縮約」「公式のparity規則」では、座標の写し方が未定義で、同じblockのマスを一頂点へ併合する手順とも読める。

座標を0始まりに固定し、g=gcd(A,B)>0、a=A/g、b=B/gとする。a,bが両奇なら色はfloor(i/g) mod
2、一方だけ奇なら(floor(i/g)+floor(j/g)) mod
2。変位がgの整数倍なので、床関数の差が±a,±bになることから攻撃辺で色が反転する。A=B=2では通常の市松模様が失敗する理由を示せる。A=0,B=2でもg>0で、後者の式を使える。空きマスは元の別々の頂点として残す。

[公式問題](https://atcoder.jp/contests/abc445/tasks/abc445_g)・[個別公式解説](https://atcoder.jp/contests/abc445/editorial/15902)の彩色から、配置↔独立集合、被覆の補集合、空きマス数−最大matchingへつなぐ。盤面走査N²、全壁・孤立点も計算量へ含める。[#356](https://github.com/Fu-L/abc-textbook/issues/356)で扱う。

### ABC285 G：下限を先に流すと、どちら向きへ補修するのか

[現稿](../../src/content/docs/problems/graph-search/outcome-solve-flow-with-lower-bounds/outcome-solve-flow-with-lower-bounds-shard-001/abc285-g.md)の「考察」は「需要超過頂点」「供給超過頂点」への補助辺と述べるが、balanceの定義式がなく、符号統一を実装上の注意へ委ねている。[下限付きflow Unit](../../src/content/docs/learn/graph/flow-lower-bounds.md)には既に正しい収支の導出がある。

x=l+f、b(v)=下限流入−下限流出と置くと、追加の流出−流入がb(v)になる。従ってb>0へSS→v、b<0へv→TTを張る。1×2の「2?」を左・右とすれば、s→左の下限1でb(s)=−1、b(左)=+1。SS→左→右→t→s→TTが不足を補修する。「?2」「22」「21」「??」も並べ、左右の必須性・不能・D=0を区別する。飽和したflowから全2を含むmatching、残る?と1の1×1タイルへ戻す。

[公式問題](https://atcoder.jp/contests/abc285/tasks/abc285_g)・[個別公式解説](https://atcoder.jp/contests/abc285/editorial/5500)に対応する。現稿の一般上界O((HW)^3)だけではHW=90000への適合が分からないため、実際の変換後network・算法に即した評価も必要。公式の単位容量評価を、大容量のt→s辺を含む網へ無説明で転用しない。[#357](https://github.com/Fu-L/abc-textbook/issues/357)で一問に限定する。

### ABC332 G：cutの式から、DPとbucketの一回の更新へ進む

[現稿](../../src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-002/abc332-g.md)にはcut式とk=Σiによる圧縮がある。「dp[k]=min
cutの色側寄与を0/1 knapsackで計算」「切替点をbucket化」の間に、初期値・処理順・評価時点を補う。

Pをsource側色集合とし、箱jをどちら側へ置くかでmin(jk,B_j)を得る。DPは全供給和から選択色の供給を引く表現ならdp[0]=ΣA、他∞。色iごとにkを降順にdp[k]=min(dp[k],dp[k−i]−A_i)とする。到達不能値は演算しない。箱jはq_j=floor(B_j/j)+1で切り替え、kの評価前にq_j=kの箱を傾きから外し、B_jを定数へ加える。k=0、B_j=0、q_j>Lを含める。

N=2、A=(5,4)、M=2、B=(3,5)なら、dp=(9,4,5,0)、F=(0,3,6,8)、和=(9,7,11,8)、答え7。最小cutそのものが最大収納数であり、さらにΣAから引かない。[公式問題](https://atcoder.jp/contests/abc332/tasks/abc332_g)・[個別公式解説](https://atcoder.jp/contests/abc332/editorial/7889)の式を、O(NL+M+L)の具体手順へつなぐ。[#358](https://github.com/Fu-L/abc-textbook/issues/358)で扱う。

### ABC413 G：faceの位置と、外周のどちら側かを定義する

[現稿](../../src/content/docs/problems/graph-search/outcome-dualize-planar-cut-to-path/outcome-dualize-planar-cut-to-path-shard-001/abc413-g.md)の「考察」の「boundary側faceはU/Dへ対応」では、faceの座標規約がない。H=1/W=1への注意も、どの二端子をunionするかへ接続する必要がある。

primal頂点を1始まりのマス(i,j)、四頂点(i,j),(i+1,j),(i,j+1),(i+1,j+1)の内側をface
F(i,j)とする。横辺(i,j)–(i,j+1)はF(i−1,j)とF(i,j)、縦辺(i,j)–(i+1,j)はF(i,j−1)とF(i,j)を結ぶ。仮想faceはi=0またはj=WならU（上・右）、j=0またはi=HならD（左・下）。始終点が障害物でないことと有効なprimal辺だけの処理により、両規則が衝突する角を問い合わせない。

3×3の障害物(1,2),(2,1)は始点を囲ってNo、(1,2),(2,3)は上・右だけをつなぎYes。斜めの連結だけでなく、どの外周を結ぶかを読む。H=W=1は移動0回でYesとし、同一始終点へ「最大流が正」をそのまま使わない。[公式問題](https://atcoder.jp/contests/abc413/tasks/abc413_g)・[個別公式解説](https://atcoder.jp/contests/abc413/editorial/13403)の座標変換・疎なDSUを、[平面双対Unit](../../src/content/docs/learn/graph/planar-duality.md)のcut/path対応から具体化する。[#359](https://github.com/Fu-L/abc-textbook/issues/359)で扱う。

### ABC464 G：noncrossingと、隣接0だけでよいことを分けて示す

[現稿](../../src/content/docs/problems/graph-search/outcome-optimize-path-matching-by-contraction/outcome-optimize-path-matching-by-contraction-shard-001/abc464-g.md)の正当性・claimの「最適増加操作をzero二つのpairingへ正規化」「noncrossing最適は隣接zero間path
matching」は、核心を結論だけで済ませている。固定端とa=(b−1)/2、費用c_tから予算別回答へ戻す既存の補強は保持する。

補足する独自論証では、最終的に反転する文字集合を連続区間へ分ける。同じ文字の二回反転は不要で、一区間は差分の両端だけを反転する。両端00なら1が二個増え、01/10なら不変、11なら二個減る。高々k回で増加量t以上を求めるなら、増やさない区間は除ける。費用は両端の位置の距離であり、間に別の0があれば隣接する0二個まで区間を縮め、区間同士の非重複と増加量を保って費用を下げられる。ここからgap列の隣接選択禁止へ進める。単にnoncrossingと呼ぶだけでは隣接0への限定は導けない。

[公式問題](https://atcoder.jp/contests/abc464/tasks/abc464_g)・[個別公式解説](https://atcoder.jp/contests/abc464/editorial/22263)の操作順の正規化と照合し、独自のflip区間の論証は[#360](https://github.com/Fu-L/abc-textbook/issues/360)の一問で完結させる。後半の縮約の双方向対応は既存の[path matching Unit](../../src/content/docs/learn/graph/path-matching-contraction.md)へつなぐ。予算への変換を未実装扱いしない。

## 追加の操作契約と単元の接続

- **ABC247
  G**：[現稿](../../src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc247-g.md)の「1
  flowずつmin-cost
  flowを進め」は自前の逐次増加法として正しいが、ACLの`flow(s,t,1)`を繰り返す手順とも読める。[公式問題](https://atcoder.jp/contests/abc247/tasks/abc247_g)・[個別公式解説](https://atcoder.jp/contests/abc247/editorial/3729)の全人数出力と、[ACL公式仕様](https://atcoder.github.io/ac-library/production/document_ja/mincostflow.html)の複数回呼出し未定義・同一直線上の中間点省略を2026-10-26に追加照合した。ACLなら一回のslopeを取り、隣接端点間の全整数流量を線形補間してi×BIG−cost(i)を出す。別々の大学・分野の強さ5の二人、BIG=10では端点が(0,0),(2,10)だけでも、人数1の答え5を出す必要がある。既存の[min-cost flow Unit](../../src/content/docs/learn/graph/min-cost-flow.md)の契約へ接続する。[#361](https://github.com/Fu-L/abc-textbook/issues/361)で扱い、代表5問と同じ深さの全面診断済みとはしない。
- **graph-core-peeling・graph-core**：親はcycle
  rankを予告するが式の導出がなく、子にはE−V+1・葉刈り・複数cycle時の注意がある。三角形1–2–3–1に枝3–4–5を付けたV=E=5の例で、全域木からの余剰一辺、剥離5→4、残る三角形と根ラベルを追う。二つの三角形を一本の橋で結ぶ反例は全点が2-coreに残り、橋はcycle上にない。coreとcycle上頂点集合、独立cycle数と単純cycle総数を分ける。[ABC226 E問題](https://atcoder.jp/contests/abc226/tasks/abc226_e)・[個別公式解説](https://atcoder.jp/contests/abc226/editorial/2889)、[ABC266 F問題](https://atcoder.jp/contests/abc266/tasks/abc266_f)・[個別公式解説](https://atcoder.jp/contests/abc266/editorial/4698)を2026-10-26に接続確認した。[#362](https://github.com/Fu-L/abc-textbook/issues/362)は二単元だけを編集し、問題本文は照合のみ。
- **flow-matching**：「考え方」の抽象説明へ、二仕事p,q、受け手a,b、許可p→a,bとq→aの独自例を補う。p→aを選んだ後の残余path
  s→q→a→p→b→tが割当の付替えになる。逆辺a→pは元の許可関係の逆ではなく取り消しである。上記ABC247
  G・ABC285
  Gの割当模型を根拠とし、元の選択↔整数flow、容量・費用・cutの問いの違いを小例から下位Unitへつなぐ。[#363](https://github.com/Fu-L/abc-textbook/issues/363)は親単元だけを編集し、下位の詳しい証明を複写しない。

## 後続改稿と優先順

6問・3単元を8件へ分けた。全件に実path・症状・補う説明・公式根拠・検証・依存を記した。編集path9本は重複しない。

| 優先する学習上の課題    | 後続Issue                                               | 編集対象                       |
| ----------------------- | ------------------------------------------------------- | ------------------------------ |
| 彩色式と元頂点の区別    | [#356](https://github.com/Fu-L/abc-textbook/issues/356) | ABC445 G                       |
| 収支の符号と必須頂点    | [#357](https://github.com/Fu-L/abc-textbook/issues/357) | ABC285 G                       |
| 端点と退化盤面          | [#359](https://github.com/Fu-L/abc-textbook/issues/359) | ABC413 G                       |
| 初期値・降順・評価時点  | [#358](https://github.com/Fu-L/abc-textbook/issues/358) | ABC332 G                       |
| 独自論証の補完          | [#360](https://github.com/Fu-L/abc-textbook/issues/360) | ABC464 G                       |
| 一回のslopeと全人数出力 | [#361](https://github.com/Fu-L/abc-textbook/issues/361) | ABC247 G                       |
| rankとcoreを分ける小例  | [#362](https://github.com/Fu-L/abc-textbook/issues/362) | graph-core-peeling・graph-core |
| 入口の付替えの小例      | [#363](https://github.com/Fu-L/abc-textbook/issues/363) | flow-matching                  |

各1 Issue＝1
PR、必須先行mergeなし。#178や他分野の調査、#141・#142の全完了を待たない。親単元・問題は説明を照合するが、編集を相互の完了条件にはしない。#140はGitHubの直接Sub-issue数100件の上限に達したため、今回の8件は#178の標準Sub-issueにまとめ、#140本文からも一覧と残範囲をたどれるようにする。#178の調査完了は配下の改稿完了を意味しない。

共通生成器・reader・rendererが原因となる再現は実証していない。未区切りの原稿記法や説明不足を基盤不具合へ置き換えず、基盤改修・一括再生成は追加しない。

## 一次確認のみの残範囲

代表5問以外の32問は一次確認が中心で、そのうちABC247
Gの呼出し契約だけを追加照合した。予約6問・3単元を除く**31問・12単元**の詳細確認を#140の未完了として残す。今回予約しなかったページを修正不要・品質確認済みとはしない。

| 残る範囲                                                                                  | 既存の説明と次の詳細確認                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bipartite-matching、ABC445 G以外の7問                                                     | Hallの双方向・被覆復元、ABC401 Gの距離候補、ABC274 Gのrun被覆、ABC461 Gの上下界、ABC320 Gの先頭N候補への交換、ABC374 Gのwalkと推移閉包、ABC317 Gの正則分解、ABC215 Hの注文あり集合と台集合の変換はある。候補生成・精度・変換方向・全計算量を公式と小例まで確認する。                                                                               |
| max-flow-min-cut、ABC332 G以外の11問                                                      | 残余更新、頂点分割、closureの費用等式はある。ABC318 Gの二終点、ABC239 Gの復元、ABC241 Gの既決結果、ABC259 G・ABC225 Gの四場合と盤外、ABC326 Gの共有upgrade、ABC263 Gの一辺容量、ABC437 Gの木辺総流量と順序、ABC347 Gの平方差の向き、ABC397 Gのdistance label、ABC227 Hの連結supportをそれぞれ再照合する。一般Dinic上界だけで制約適合を済ませない。 |
| ABC226 E・ABC266 F                                                                        | 向きの強制、成分別V=E、唯一cycleと根ラベルはある。単元の小例は予約済みだが問題本文は予約していない。成分ごとの条件・cycleへの進入/退出・queryの一意性を公式の境界と確認する。                                                                                                                                                                      |
| cycle-space-basis・monotone-path-contraction・near-tree-kernelization、ABC295 G・ABC419 G | 成分別XOR spanとwalk、単純pathの単射、top属性とDSU代表、terminalを残す剥離・chainの双方向・核のサイズは既に補強済み。別成分・自己loop・平行chain・DFSの未完了prefixを含む全費用を詳細確認する。                                                                                                                                                    |
| directed-walk-periodicity、ABC306 G                                                       | edge差分gcdの両方向、十分大きい長さの明示cutoffと例外範囲はUnitにある。問題の「必要十分」は巨大長に依存するため、そのcutoffと2・5除去への接続、G=0、始点SCCの限定を公式と小例まで確認する。                                                                                                                                                        |
| flow-lower-bounds                                                                         | bの定義・SS/TTの符号・復元・s-tの閉鎖辺・最大化時の残余逆辺の除去はある。ABC285 Gは別予約。D=0・固定F・上下限・補助辺除去後の下限保存を小例で確認する。                                                                                                                                                                                            |
| min-cost-flow、ABC247 G以外の5問                                                          | 全残余辺のpotential非負性、初期負閉路、slope、cycle cancelingはある。ABC407 Gの全濃度、ABC421 Gの差分indexと境界供給、ABC231 Hの仮補完費用からの双方向、ABC224 Hの整数化と固定F、ABC214 Hの飛ばす区間費用と一回報酬を公式まで再照合する。ABC224 Hの空間欄N,Mと入力L,Rの呼び分けも確認候補。                                                        |
| weighted-bipartite-matching・planar-duality、ABC373 G                                     | Hungarianの双対下界・tight・slack、一般dualのhalf-edgeと共通face条件はある。浮動小数の交差除去、禁止辺、非連結/零重み、外側face・橋と同一face上端点の条件を確認する。ABC413 Gは別予約。                                                                                                                                                            |
| path-matching-contraction・min-weight-general-perfect-matching、ABC218 H・ABC412 G        | 縮約の両方向・全cardinality・端処理・逆展開、stubの重複交換、Tutte最小次数・固定乱数・補間・誤り方向はある。ABC218 Hの少数色孤立化の端例外、ABC412 Gの不存在と係数消失、全次数上限・全費用・整数幅を公式と独自例まで確認する。ABC464 Gは別予約。                                                                                                   |

上記12単元は、bipartite-matching・max-flow-min-cut・cycle-space-basis・monotone-path-contraction・near-tree-kernelization・directed-walk-periodicity・flow-lower-bounds・min-cost-flow・weighted-bipartite-matching・planar-duality・path-matching-contraction・min-weight-general-perfect-matching。未定義記号、英語混在、復習欄が検算指示だけになっている箇所も個別の詳細確認へ含める。空見出し・分類文反復だけを独立した確定不具合として予約したページはない。

## 検証と限界

- Node.js 26.12.1 / npm
  11.20.0で`npm run notation:report -- <対象15単元・37問の実path>`を実行し、**52原稿・365候補・明示数式エラー0件**。npmは指定版11.21.1との相違を警告したが、検査はexit
  0。依存・lockfileは変更していない。全365件は36問題の「制約との対応」の`UNDELIMITED_TEX`。同じ文中の複数コマンドも別候補であり、表示不具合365件とは数えない。改稿時に式の範囲と記号を読んで明示数式化する候補である。
- 改稿案の一時検算：ABC445 GはN≤8の変位から12,096攻撃辺の異色性を確認。ABC285
  Gは849小盤面で全タイル配置と下限変換の可否が一致。ABC332
  Gは700例で全色subsetのcut・明示最大流・DPとbucket走査が一致。ABC413
  Gは退化盤面を含む16,545障害物集合でdual DSUと通常BFSが一致。ABC464
  Gは長さ2〜9の全1,020文字列で、全最終文字列へのHamming距離による予算別最適値とgapの固定個数matchingが一致。一般証明、heap実装、後続改稿の公式例・表示検証の代用にはしない。
- 固定37
  IDとの一致・重複なし、15単元のpathとhomeの既存順、関連8問の形式、後続8件の編集path9本の存在・重複なしを確認した。source
  ID・fingerprint・過去の確認日時・教材・分類・問題順は変更しない。一時取得結果・検算コード・管理台帳はcommitしない。
- 変更Markdownの書式・ローカルリンクを既存の`.github/actions/nonpublic-docs/check.mjs --files`、差分を`git diff --check`で確認した。文書のみのPRなのでbuild・E2Eは対象にしない。後続改稿では公式根拠・本文とclaim・必要なschema/reader検証、本番subpathのbuild・内部リンク・文章と表示まで確認する。
