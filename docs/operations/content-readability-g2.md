# G2：最短路・有向構造・関数グラフ・全域木の本文調査

2026-10-26、[調査Issue #177](https://github.com/Fu-L/abc-textbook/issues/177)の18単元・58問を、main
`c53a493c`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)へ具体的な改稿と残範囲を渡す調査であり、**教材改稿の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・fullと短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

次表はhomeの`directProblemIds`を既存順で記した担当範囲。分類や難易度順を再計算する表ではない。問題本文は`src/content/docs/problems/`配下の同名Markdownへ一意に対応する。

| 対象単元                                                                                                  | 担当Problem ID                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [shortest-path-certificates.md](../../src/content/docs/learn/graph/shortest-path-certificates.md)         | 直接配置なし                                                                                                                                                                                                                                                 |
| [weighted-shortest-path.md](../../src/content/docs/learn/graph/weighted-shortest-path.md)                 | `abc395-e`, `abc325-e`, `abc286-e`, `abc463-e`, `abc277-e`, `abc237-e`, `abc271-e`, `abc213-e`, `abc431-e`, `abc246-e`, `abc291-f`, `abc416-e`, `abc342-e`, `abc243-e`, `abc257-f`, `abc307-f`, `abc245-g`, `abc232-g`, `abc308-ex`, `abc414-g`, `abc243-ex` |
| [shortest-path-reconstruction.md](../../src/content/docs/learn/graph/shortest-path-reconstruction.md)     | `abc252-e`                                                                                                                                                                                                                                                   |
| [difference-constraints.md](../../src/content/docs/learn/graph/difference-constraints.md)                 | `abc216-g`, `abc404-g`                                                                                                                                                                                                                                       |
| [directed-condensation.md](../../src/content/docs/learn/graph/directed-condensation.md)                   | 直接配置なし                                                                                                                                                                                                                                                 |
| [dag-topological-processing.md](../../src/content/docs/learn/graph/dag-topological-processing.md)         | `abc315-e`, `abc291-e`, `abc277-f`                                                                                                                                                                                                                           |
| [directed-core-peeling.md](../../src/content/docs/learn/graph/directed-core-peeling.md)                   | `abc456-e`, `abc245-f`                                                                                                                                                                                                                                       |
| [scc-condensation.md](../../src/content/docs/learn/graph/scc-condensation.md)                             | 直接配置なし                                                                                                                                                                                                                                                 |
| [two-sat.md](../../src/content/docs/learn/graph/two-sat.md)                                               | `abc277-ex`                                                                                                                                                                                                                                                  |
| [functional-graph.md](../../src/content/docs/learn/graph/functional-graph.md)                             | 直接配置なし                                                                                                                                                                                                                                                 |
| [functional-graph-decomposition.md](../../src/content/docs/learn/graph/functional-graph-decomposition.md) | `abc436-e`, `abc296-e`, `abc256-e`, `abc241-e`, `abc357-e`, `abc377-e`, `abc387-f`, `abc399-e`, `abc284-g`                                                                                                                                                   |
| [binary-lifting.md](../../src/content/docs/learn/graph/binary-lifting.md)                                 | `abc367-e`, `abc438-e`, `abc212-f`, `abc310-g`, `abc254-g`                                                                                                                                                                                                   |
| [spanning-tree-optimization.md](../../src/content/docs/learn/graph/spanning-tree-optimization.md)         | `abc218-e`, `abc352-e`, `abc282-e`, `abc270-f`, `abc364-f`, `abc355-f`                                                                                                                                                                                       |
| [kruskal-threshold-sweep.md](../../src/content/docs/learn/graph/kruskal-threshold-sweep.md)               | `abc235-e`, `abc383-e`, `abc250-ex`                                                                                                                                                                                                                          |
| [lowlink-critical-structure.md](../../src/content/docs/learn/graph/lowlink-critical-structure.md)         | `abc375-g`, `abc334-g`, `abc301-ex`                                                                                                                                                                                                                          |
| [euler-degree.md](../../src/content/docs/learn/graph/euler-degree.md)                                     | 直接配置なし                                                                                                                                                                                                                                                 |
| [euler-trail-circuit.md](../../src/content/docs/learn/graph/euler-trail-circuit.md)                       | `abc286-g`                                                                                                                                                                                                                                                   |
| [degree-parity-subgraph.md](../../src/content/docs/learn/graph/degree-parity-subgraph.md)                 | `abc345-f`                                                                                                                                                                                                                                                   |

全76原稿の主要な説明、正当性、境界・計算量と記法を一次確認した。**代表5問（ABC307 F・ABC277
F・ABC438 E・ABC364 F・ABC375 G）は同居claimと公式問題文・個別公式解説まで再照合した。** ABC404
Gは反復回数の境界だけを追加で公式再照合し、二単元は下記の小例と索引の費用まで具体化した。これを全原稿の詳細な数学監査・表示確認とは扱わない。

対象58問と、18単元の関連先にある範囲外31問はすべて`full`、`primaryProblemId: null`で、追加で読む短縮形式の参照元はない。関連31問は接続する考察・正当性を読み、担当数や改稿予約へ加えていない。ABC261
G・ABC364 G・ABC393 G・ABC371
Gなどの既存の補強を、未実装扱いしない。初期改稿・他分野の編集対象と重複予約しない。

## 詳しく確認した代表5問

公式根拠の再照合日は全て2026-10-26。解法全体が誤りという診断ではなく、現稿の方針から具体的な操作・論証へ進む際の課題である。小例は特記のない限り独自例。

### ABC307 F：当日中に累積する距離を、その日の途中でリセットしない

[現稿](../../src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-002/abc307-f.md)の「考察」は二キューを持つが、「future
boundaryにはfresh distance
w」と、新しい境界候補を取り出してよい時点の接続が弱い。同居claimは次の日に距離0へ戻すと述べているため、手順もこの時点へ揃える。

日の開始時に共有キューのキー≤X_iを当日キューへ移し、**この移送を閉じてから**局所Dijkstraを完了する。距離dで新感染vを確定したら、未感染隣接へのd+wは当日用（≤X_iのみ）、wは翌日以降用へ入れる。同日の途中で新しい共有候補を取り出さない。重み3,3の鎖1–2–3、初期感染1、X=(4,3)なら感染日は(0,1,2)。距離を同日にリセットすると3も1日目に感染してしまう。

[公式問題](https://atcoder.jp/contests/abc307/tasks/abc307_f)・[個別公式解説](https://atcoder.jp/contests/abc307/editorial/6665)の前夜集合と二キューに対応する。古い候補を捨て、各頂点の感染時だけ辺を展開することで、現稿の全日償却とO((N+M)log(N+M+1)+D)時間へつなぐ。[#347](https://github.com/Fu-L/abc-textbook/issues/347)で一問に限定する。

### ABC277 F：値群の間へ置く補助頂点の入辺・出辺を決める

[現稿](../../src/content/docs/problems/graph-search/outcome-process-dag-in-topological-order/outcome-process-dag-in-topological-order-shard-001/abc277-f.md)の「考察」は「隣り合うgroupの間へ補助頂点を置けば」で止まり、辺の向き・群内の自由度を読者が補う必要がある。「時間」は非零数Lの整列などを数えるが、入力HWの走査が抜けている。

一行の非零列を値でまとめG_1,…,G_rとし、隣接群ごとに新しいb_kを作ってG_kの全列→b_k→G_{k+1}の全列を張る。(2,2,5,0)なら最初の二列の間は自由で、両方から5の列への順序だけが必要になる。推移性によって離れた値群の比較も表せる。補助頂点を除いたtopological順が実列の順になることを説明する。

行の(min,max)順・同minのtie処理は既にある。これを保ち、全零行を先頭へ置き、非零値が非減少になった列の先頭の0は1、以後の0は直前値で埋める構成を添える。入力込みでO(HW+L
log W+H log
H+W+L)時間とする。[公式問題](https://atcoder.jp/contests/abc277/tasks/abc277_f)・[個別公式解説](https://atcoder.jp/contests/abc277/editorial/5205?lang=ja)の圧縮DAGと0補完を根拠に、[#348](https://github.com/Fu-L/abc-textbook/issues/348)で扱う。

### ABC438 E：水を入れる人は、受け渡し前の所有者である

[現稿](../../src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc438-e.md)にはP,Qの倍化式がある。一方、「一回遷移からP[0][i]とQ[0][i]を作る」「currentとwaterを初期化」では、注水の前後と質問の初期値が具体化されていない。

人iがiだけ注いでからA_iへ渡すので、P[0][i]=A_i、Q[0][i]=i。バケツBの質問はcurrent=B、water=0から始め、旧currentのQを足してからPへ移る。A=(2,3,2)では、バケツ1の所有者は1→2→3→2、注水累計は0→1→3→6。最初の二回は1+2であり、移動後の2+3ではない。所有者が合流しても、バケツやその水量を一つへ足し合わせない。

[公式問題](https://atcoder.jp/contests/abc438/tasks/abc438_e)・[個別公式解説](https://atcoder.jp/contests/abc438/editorial/14964)と一致する。既存の二半分の合成を残し、30段（0..29）、最大水量NT≤2×10^14と64bitまで理由をつなぐ。[#349](https://github.com/Fu-L/abc-textbook/issues/349)で扱う。

### ABC364 F：setで消すgapは、連続成分という不変条件から得られる

[現稿](../../src/content/docs/problems/graph-search/outcome-construct-optimal-spanning-tree/outcome-construct-optimal-spanning-tree-shard-001/abc364-f.md)には(k+1)C・setの範囲・各境界一度の償却がある。「正当性」とclaimの「区間成分は連続で」を、なぜ保てるかまで説明する改稿である。

元頂点に注目すると、初期成分はsingleton区間。一区間へ新hubを接続すると、その区間に交わる旧成分を全てまとめるので、成分は引き続き区間になる。従って[L,R]内の未接続gapがk個なら、接続する旧成分はk+1個である。未処理hubは孤立しており、各成分へ一本ずつのKruskal辺を採用する。

N=4、区間(1,2,2),(2,4,5),(3,3,7)なら、gap集合は{1,2,3}→{2,3}→{}→{}、寄与は4,15,7で計26。最後のhubはgapを消さなくても一辺必要となる。[公式問題](https://atcoder.jp/contests/abc364/tasks/abc364_f)・[個別公式解説](https://atcoder.jp/contests/abc364/editorial/10546)の隣接連結判定を、この不変条件と小例で接続する。[#350](https://github.com/Fu-L/abc-textbook/issues/350)で扱う。

### ABC375 G：無向の迂回を、そのまま代替最短路と呼ばない

[現稿](../../src/content/docs/problems/graph-search/outcome-identify-bridges-and-articulations/outcome-identify-bridges-and-articulations-shard-001/abc375-g.md)の「正当性」とclaimにある「対象辺を消しても両端がつながるなら代替最短pathがあり」は、距離の増加方向を守る理由が省略されている。最短路辺を抽出して無向橋を調べる方針は維持する。

例えば全辺長1で1→a→b→t、1→c→d→t、c→bを持つ最短路DAGを考える。a→bの無向迂回a–1–c–bは距離を後戻りする。これを直接向き付き最短路へ変換する説明では足りない。

ここでは「全抽出辺がどれかの1→N最短路上にある」ことを使う。正重みなので最短路は距離順に進み、任意の頂点prefix
cutを一度だけ跨ぐ。必須辺eの始点直後で切ったとき別の抽出辺も跨ぐなら、その別辺を含む最短路はeを使えず矛盾する。従ってeだけが跨ぐcutがあり、eは無向橋。逆に橋なら、それを通る最短路の両側に1とNが分かれ、必須となる。これは[公式問題](https://atcoder.jp/contests/abc375/tasks/abc375_g)・[個別公式解説](https://atcoder.jp/contests/abc375/editorial/11133)の距離順cutの条件を現稿の橋判定へ接続する補足論証である。独自論証は[#351](https://github.com/Fu-L/abc-textbook/issues/351)の一問で完結させる。

## 追加の境界訂正と単元の接続

- **ABC404
  G**：[現稿](../../src/content/docs/problems/graph-search/outcome-solve-difference-constraints/outcome-solve-difference-constraints-shard-001/abc404-g.md)の「考察」は頂点0..Nの後に「N回後にも更新があれば−1」とする。N回目の更新を負閉路の証拠と読めるため、有限距離を得るN段と、負閉路検出の追加一段を分ける。N=1、制約(1,1,1)では最初の緩和でdist[0]=−1へ改善するが、合法解A=(1)・答え1である。[公式問題](https://atcoder.jp/contests/abc404/tasks/abc404_g)・[個別公式解説](https://atcoder.jp/contests/abc404/editorial/12867)を2026-10-26に境界について再照合した。同期版は高々k辺のwalk、in-place版は全辺走査と追加判定の回数を明示する。Nからj→j−1で全頂点に届くことも負閉路検査へ接続する。これは代表5問と同じ深さの全面診断ではなく、[#352](https://github.com/Fu-L/abc-textbook/issues/352)で扱う。
- **functional-graph-decomposition・binary-lifting**：peeling逆順、cycle位置、jump/aggの式、K=0と計算量は既にある。f=(2,3,2,3)のcycle2→3→2と木1→2・4→3を使い、1からK=0,1,2,3で1,2,3,2となることを示す。入次数peelingが一般有向graphではcycle外も残す一方、出次数1なら残存各点の入出次数が1になる理由を説明する。出発点の寄与w=(10,20,30,40)も付けると、1から5回後は頂点2・累積110。最初の1回と続く4回で、aggを足してからjumpする意味を確かめられる。分解O(N)と木部分query用の追加索引の費用を区別する。[ABC241 E問題](https://atcoder.jp/contests/abc241/tasks/abc241_e)・[個別公式解説](https://atcoder.jp/contests/abc241/editorial/3472)の有限状態と累積値、上記ABC438
  Eを2026-10-26に接続確認した。二単元は[#353](https://github.com/Fu-L/abc-textbook/issues/353)で同じ小例からつなぐ。問題本文は照合のみ。

ABC367
Eも一次確認から用語訂正へ予約した。[現稿](../../src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc367-e.md)の棄却候補にある「permutation写像」は、Xの相異性が保証されない入力と合わない。X=(2,2)なら一操作後は(A_2,A_2)で、payloadの一対一の並べ替えではない。一般写像として既に成立しているdoubling・source
indexの定義を保ち、[#354](https://github.com/Fu-L/abc-textbook/issues/354)で呼び分けを直す。代表5問と同じ深さの公式再照合はしていない。

## 後続改稿と優先順

7問・2単元を8件へ分けた。各Issueに実path、症状、補う説明、公式根拠、個別の検算、既存検証と互換性を記した。編集pathの重複はない。

| 優先         | 後続Issue                                               | 編集対象と到達点                                   |
| ------------ | ------------------------------------------------------- | -------------------------------------------------- |
| 判定境界     | [#352](https://github.com/Fu-L/abc-textbook/issues/352) | ABC404 G：N段の有限距離と負閉路を調べる追加段      |
| 距離の意味   | [#347](https://github.com/Fu-L/abc-textbook/issues/347) | ABC307 F：共有キューの移送を閉じる時点と翌日の更新 |
| 操作から基底 | [#349](https://github.com/Fu-L/abc-textbook/issues/349) | ABC438 E：出発時注水、P/Qの初期値、質問の開始状態  |
| 同値性の証明 | [#351](https://github.com/Fu-L/abc-textbook/issues/351) | ABC375 G：距離順cutから無向橋と必須最短路を結ぶ    |
| 具体的な辺   | [#348](https://github.com/Fu-L/abc-textbook/issues/348) | ABC277 F：値群間の補助辺、0補完、入力込み計算量    |
| 不変条件     | [#350](https://github.com/Fu-L/abc-textbook/issues/350) | ABC364 F：連続成分、gap数、各hubの一辺分           |
| 用語の訂正   | [#354](https://github.com/Fu-L/abc-textbook/issues/354) | ABC367 E：一般写像と置換、source参照の区別         |
| 基礎への導線 | [#353](https://github.com/Fu-L/abc-textbook/issues/353) | 関数グラフ分解・doubling：tail/cycleと累積値の小例 |

全件1 Issue＝1
PR、必須先行mergeなし。#177のmerge、他分野の全調査、#141・#142の完了を待たない。#349と#353は寄与を足す時点を照合するが、相互の完了を着手条件にしない。#140へこの8件と残範囲を反映し、標準Sub-issueとして登録した。

共通生成器・reader・rendererが原因となる再現は実証していない。未区切りの原稿記法や本文の説明不足を基盤不具合へ置き換えず、基盤改修・一括再生成を追加しない。

## 一次確認のみの残範囲

予約済み7問・2単元を除く**51問・16単元**は、代表と同じ深さの公式再照合・数学監査を済ませていない。既存の説明と次の詳細確認の着眼点を#140の未完了として残す。一次確認だけで修正不要・品質確認済みとはしない。

| 範囲                                                                           | 既存の説明と次に詳しく確認する点                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 最短路の章入口・weighted-shortest-path・shortest-path-reconstruction、ABC252 E | 距離確定、0-1 BFSの古い候補、Bellman–Ford同期緩和、Floydの中継集合、tight辺探索と零閉路回避はある。章入口のd[s]=0・有限距離の意味を明示し、三角不等式と実現経路の二方向を小例へ結ぶ。単純/多重graphのheap評価、親復元の停止を公式まで詳細確認する。                                                 |
| weighted-shortest-pathのABC307 Fを除く20問                                     | 二層・方向状態、potential、辺列順、前後距離、空港hub、最新出発、二国ラベル、円周疎化、根閉路、range graph、平面separatorの説明はある。ABC431 E・ABC308 Ex・ABC243 Exには独自論証の補強もあるため欠落扱いせず、実操作への復元、端点、全計算量とclaimを個別に公式再照合する。                         |
| difference-constraints、ABC216 G                                               | 全点初期値0、全系の可否、基準固定の極値・非有界、0prefixの辺方向とbit復元はある。具体解と極値の違い、整数性、最大値を同時達成する条件を小例で詳細確認する。ABC404 Gの段数は予約済み。                                                                                                               |
| directed-condensation・dag-topological-processing、ABC315 E・ABC291 E          | Kahnの残入次数、DFS postorderと前提辺の逆向き、各段の候補数と一意性はある。共有前提の完了と訪問、順序から順位への逆対応、DAG保証を具体例・公式と結ぶ。ABC277 Fは予約済み。                                                                                                                          |
| directed-core-peeling、ABC456 E・ABC245 F                                      | 三色、source/sink剥離の残集合の違い、周期phase、無限walkの双方向はある。自己loop、曜日wrap、空辺、開始点自由/固定を公式と確認する。関数グラフだけのcycle抽出と混同しない。                                                                                                                          |
| scc-condensation・two-sat、ABC277 Ex                                           | Kosaraju終了順の証明、ACL番号、二項節から含意、割当の大小、整数thresholdの有限範囲・定数簡約まである。これを欠落扱いせず、小さい充足割当、範囲外threshold、A=B、状態・辺数の上限と公式を詳細確認する。                                                                                              |
| functional-graph、関数グラフ分解の9問                                          | ABC387 Fの辺方向・prefix DP、ABC399 Eの純cycle/流入木の構成、ABC284 Gの合成数mod処理などは既に具体化されている。swapの分割、反復像、tailの寄与、指数2^K、全写像の分類を公式・小例で確認する。二子単元の小例は予約済み。                                                                             |
| binary-liftingのABC438 E・ABC367 Eを除く3問                                    | source indexとpayload、バスの半整数境界、分布作用と区間和、エレベーターの元の階差を戻す説明はある。ABC367 Eの用語訂正は予約済み。合成方向、別buffer、番兵、端点正規化と索引構築を公式まで確認する。                                                                                                 |
| spanning-tree-optimization、ABC364 Fを除く5問                                  | cut交換、層別成分数、負辺を残す例外、cliqueのstar証明、操作列と最大木、任意hubの4ケースはある。最短路を保存する木との違い、同重み・非連結・負辺、全処理と空間の評価を小例で確認する。                                                                                                               |
| kruskal-threshold-sweep、3問                                                   | strict/non-strict、queryをunionしない、pairing交換、token重複、最寄り家の境界証明はある。ABC383 EのA_i≠B_jは[公式問題文](https://atcoder.jp/contests/abc383/tasks/abc383_e)にあり（2026-10-26確認）、本文・claimと矛盾しない。ABC250 Exの元頂点DSUとVoronoi領域の接続、同距離の処理を詳細確認する。 |
| lowlink-critical-structure、ABC334 G・ABC301 Ex                                | 橋の>・関節点の≥、根の子数、親辺ID、削除後C−1+parts、同重み二回sweepと局所番号化はある。根/非根・孤立点、非連結、縮約後の平行辺、tin/toutとbatch順を公式・小例まで確認する。ABC375 Gの同値性は予約済み。                                                                                            |
| euler-degree・euler-trail-circuit・degree-parity-subgraph、ABC286 G・ABC345 F  | 辺支持の連結性、Hierholzerのcursorと辺ID、自由辺縮約、成分ごとの偶奇、途中停止の0/2増分はある。必要条件から十分性、根の残要求、E=0の規約、始点と出力列を小例と公式へつなぐ。                                                                                                                        |

未定義記号・英語混在・式の読みづらさは上記の詳細確認にも含める。空見出しや分類文の反復だけを理由に、今回の独立した確定不具合として予約したページはない。

## 検証と限界

- Node.js 26.12.1 / npm
  11.21.1で`npm run notation:report -- <対象18単元・58問の実path>`を実行し、**76原稿・704候補・明示数式エラー0件**。全704件は57問題の「制約との対応」にある`UNDELIMITED_TEX`。同一文中の複数コマンドを別候補として数える。表示不具合704件とは扱わず、各改稿で式の範囲・記号を読んで明示数式化する候補に残す。
- 改稿案の一時的な検算：ABC307
  Fは600小グラフで毎日前夜集合から再計算する素朴解と感染日が一致。ABC277
  Fは700小行列で行列の全置換後の非零列単調性と圧縮DAG判定が一致。ABC364
  Fは700区間グラフで全辺を明示したKruskalと一致。ABC375
  Gは700生成グラフのうち1からNへ届くものについて、各辺削除の最短距離と抽出部分グラフの橋判定が一致。ABC438
  Eは700写像の全始点で小さいランダムTの直接操作とjump/注水和が一致。ABC404
  Gの合法な最終段更新、二単元の到着2・累積110も確認した。一般証明や後続改稿の公式例・表示検証の代用にはしない。
- Issueの固定58
  IDとの一致・重複なし、18単元の実pathとhomeの既存順、関連31問の形式、後続8件の編集path9本の存在・重複なしを確認した。公式再照合は今回の調査日として記録し、教材のsource
  ID・fingerprint・過去の確認日時を書き換えない。一時取得結果・検算コード・管理台帳はcommitしない。
- 変更Markdownの書式・ローカルリンクを既存の`.github/actions/nonpublic-docs/check.mjs --files`、差分を`git diff --check`で確認した。文書のみのPRなのでbuild・E2Eは対象にしない。後続の改稿では公式根拠・本文とclaim・必要なschema/reader検証、本番subpathのbuild・内部リンク・文章と表示まで確認する。
