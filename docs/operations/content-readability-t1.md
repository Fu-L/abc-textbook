# T1：木の距離・集約・分解と発展の本文調査

2026-10-29、[調査Issue #179](https://github.com/Fu-L/abc-textbook/issues/179)の19単元・44問を、main
`637dde90`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)へ具体的な改稿と残範囲を渡す文書であり、**教材改稿の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・fullと短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

homeの`directProblemIds`を既存順で記す。分類・難易度順を再計算する表ではない。問題本文は`src/content/docs/problems/`配下の同名Markdownへ一意に対応する。

| 対象単元                                                                                                           | 担当Problem ID                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [index.md](../../src/content/docs/learn/tree/index.md)                                                             | 直接配置なし                                                                                                                                                                                                |
| [tree-metric.md](../../src/content/docs/learn/tree/tree-metric.md)                                                 | `abc303-e`, `abc361-e`, `abc428-e`, `abc401-f`, `abc267-f`, `abc221-f`                                                                                                                                      |
| [tree-aggregation.md](../../src/content/docs/learn/tree/tree-aggregation.md)                                       | 直接配置なし                                                                                                                                                                                                |
| [rooted-tree-aggregation.md](../../src/content/docs/learn/tree/rooted-tree-aggregation.md)                         | `abc309-e`, `abc409-e`, `abc239-e`, `abc391-e`, `abc459-e`, `abc378-f`, `abc447-f`, `abc397-e`, `abc394-f`, `abc312-g`, `abc259-f`, `abc287-f`, `abc263-f`, `abc416-f`, `abc248-g`, `abc264-ex`, `abc329-g` |
| [rerooting.md](../../src/content/docs/learn/tree/rerooting.md)                                                     | `abc220-f`, `abc348-e`, `abc223-g`                                                                                                                                                                          |
| [tree-decomposition.md](../../src/content/docs/learn/tree/tree-decomposition.md)                                   | 直接配置なし                                                                                                                                                                                                |
| [tree-euler-flattening.md](../../src/content/docs/learn/tree/tree-euler-flattening.md)                             | `abc240-e`, `abc406-f`, `abc294-g`, `abc337-g`                                                                                                                                                              |
| [tree-ancestor-lca.md](../../src/content/docs/learn/tree/tree-ancestor-lca.md)                                     | `abc298-ex`                                                                                                                                                                                                 |
| [heavy-light-decomposition.md](../../src/content/docs/learn/tree/heavy-light-decomposition.md)                     | 直接配置なし                                                                                                                                                                                                |
| [virtual-tree.md](../../src/content/docs/learn/tree/virtual-tree.md)                                               | `abc340-g`                                                                                                                                                                                                  |
| [implicit-binary-tree.md](../../src/content/docs/learn/tree/implicit-binary-tree.md)                               | `abc321-e`                                                                                                                                                                                                  |
| [laminar-interval-containment-tree.md](../../src/content/docs/learn/tree/laminar-interval-containment-tree.md)     | `abc405-f`                                                                                                                                                                                                  |
| [dsu-merge-tree.md](../../src/content/docs/learn/tree/dsu-merge-tree.md)                                           | `abc314-f`, `abc235-ex`                                                                                                                                                                                     |
| [tree-balanced-separators.md](../../src/content/docs/learn/tree/tree-balanced-separators.md)                       | `abc291-ex`, `abc359-g`                                                                                                                                                                                     |
| [additive-tree-metric-reconstruction.md](../../src/content/docs/learn/tree/additive-tree-metric-reconstruction.md) | `abc451-e`                                                                                                                                                                                                  |
| [tree-precedence-contraction.md](../../src/content/docs/learn/tree/tree-precedence-contraction.md)                 | `abc376-g`                                                                                                                                                                                                  |
| [heavy-path-tree-dp.md](../../src/content/docs/learn/tree/heavy-path-tree-dp.md)                                   | `abc269-ex`                                                                                                                                                                                                 |
| [static-top-tree.md](../../src/content/docs/learn/tree/static-top-tree.md)                                         | `abc351-g`, `abc460-g`                                                                                                                                                                                      |
| [heavy-light-recursive-dp.md](../../src/content/docs/learn/tree/heavy-light-recursive-dp.md)                       | `abc311-ex`                                                                                                                                                                                                 |

tree-metricの直接配置には別担当のABC222
Fもある。表では固定44問から除き、[既存改稿](https://github.com/Fu-L/abc-textbook/issues/164)の補助葉・自己葉の除外を整合確認した。改稿・重複Issue化はしない。

全63原稿の主要な説明、正当性、境界・計算量と記法を一次確認した。**代表5問（ABC337 G・ABC223
G・ABC376 G・ABC287 F・ABC460 G）は同居claimと公式問題文・個別公式解説まで再照合した。** ABC378
Fは復習欄の次数、ABC351
Gは構築時間の接続だけを追加で公式再照合した。全原稿の詳細な数学監査・表示確認とは区別する。

関連先の範囲外11問（ABC220 E・ABC246 G・ABC293 Ex・ABC362 F・ABC369 G・ABC387 F・ABC424 E・ABC435
F・ABC438 F・ABC453 F・ABC460
F）は接続する考察と正当性を読んだ。対象44問・関連11問は全て`full`、`primaryProblemId: null`で、追加で読む短縮形式の参照元はない。対象44問の正当性と同居claimのtextは一致するが、一致を数学的正しさの保証とはしない。

根付き独立集合の二状態、rerootingのprefix/suffix除外、HLDの非可換順序、virtual
treeの隣接LCAとサイズ上界、重心の同成分除外は既に具体的。ABC235 Exの同重み処理とO(NK)償却、ABC264
Exの根限定出力、ABC291 Exの十分な構成、ABC298 Exの同一点分岐、ABC311
Exの根必須と全path先頭の計算量などの既存補強も欠落扱いしない。

## 詳しく確認した代表5問

公式根拠の再照合日は全て2026-10-29。引用は現稿の節からの短い抜粋、小例と補完論証は独自案である。

### ABC337 G：自己根を別に足すなら、他の更新先から除く

[現稿](../../src/content/docs/problems/graph-search/outcome-flatten-tree-by-euler-order/outcome-flatten-tree-by-euler-order-shard-001/abc337-g.md)の「考察」「正当性」は、自己根wへw−1を先に足し、各方向成分の外側へも寄与を足す。「外側」にwを含めると自己寄与が二重になる。2頂点1–2では正解は(0,1)だが、そのまま実装すると(0,2)になる。自己根を除く具体的な更新式を補うか、別加算をしない規約へ統一する必要がある。

固定根の部分木S_w内でlabel<wの個数をq_w、子cの同個数をk_cとする。別加算をしないなら、子方向ごとに全体へ+k_c、S_cへ−k_c、親方向についてS_wへ+(w−1−q_w)と更新する。wには全方向から合計w−1が自然に届く。label順BITへwを登録する前の個数照会、Euler半開区間の差分、最後のprefix集計までつなげれば、O(N)回の照会・更新になる。

[公式問題](https://atcoder.jp/contests/abc337/tasks/abc337_g)・[個別公式解説](https://atcoder.jp/contests/abc337/editorial/9128)の寄与先分解と照合した。公式の経路条件も端点u=wを含む。既存の自己根への注意を削るだけで終わらず、二つの更新規約を混ぜない理由を説明する。[#389](https://github.com/Fu-L/abc-textbook/issues/389)で扱う。

### ABC223 G：白は一つの完成matchingの未使用フラグではない

[現稿](../../src/content/docs/problems/graph-search/outcome-reroot-tree-aggregation/outcome-reroot-tree-aggregation-shard-001/abc223-g.md)は「白黒状態を木DPで求め」「rerootして」で手順を終え、「正当性」の葉交換から削除判定の必要十分性へ飛ぶ。各部分木から親へ渡す白と、一つの完成matchingでの使用状態を分ける必要がある。4頂点starでは三葉とも削除可能だが、一つの最大matchingで未使用なのは二葉だけである。

辺を切った片側で、境界根を使わない最大matchingがある状態を白とする。子側の最大値の和を基準に、白い子があれば根との辺を足して+1、なければ根を使う際に子側の辺を一本外すため増分0。この二場合を証明すると、送信先を除く白い入message数が0のときだけ白、という式が得られる。全隣接方向で同じ判定をすれば削除可能性が分かる。

[公式問題](https://atcoder.jp/contests/abc223/tasks/abc223_g)・[個別公式解説](https://atcoder.jp/contests/abc223/editorial/2775)の白黒貪欲を、有向messageの定義・二走査・除外個数・葉の空集合から再構成する。[#390](https://github.com/Fu-L/abc-textbook/issues/390)で一問に限定する。

### ABC376 G：根0の「1」を含めるかで最終回収式が変わる

[現稿](../../src/content/docs/problems/graph-search/outcome-optimize-tree-order-by-cluster-contraction/outcome-optimize-tree-order-by-cluster-contraction-shard-001/abc376-g.md)の「考察」は「最後の転倒数から期待値を作る」で止まる。根0の統計、内部転倒数の初期値、法上の除算まで必要である。「復習の核」の定数差も規約を固定しなければ計算できない。

a_0=0、根0を(C0,C1)=(0,1)として含め、各blockの内部転倒数を0にすれば、全転倒数IはΣ
i·a[q_i]そのものになる。根を含めないならΣaの補正が必要である。N=2、p=(0,1)、a=(1,3)では、2を1へ縮約して交差寄与3、できたblockを0へ縮約して4、合計I=7。S=4で答えは法上の7·S^{-1}となる。

[公式問題](https://atcoder.jp/contests/abc376/tasks/abc376_g)・[個別公式解説](https://atcoder.jp/contests/abc376/editorial/11196)の帰着と照合した。親先行制約の交換論は既に[Unit](../../src/content/docs/learn/tree/tree-precedence-contraction.md)にある。問題では、未発見時の戦略を一本の順序へ表せる理由、非根だけのheap、現在親とDSU代表、古い統計の無効化、IとSの回収をつなぐ。[#391](https://github.com/Fu-L/abc-textbook/issues/391)で扱う。

### ABC287 F：併合一回の二重ループを、全頂点対へ課金する

[現稿](../../src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc287-f.md)には初期値とj+k−(b∧c)の遷移がある。「時間」の「子併合の状態対は全体O(N²)」だけでは、子ごとの二重ループをさらにN倍しなくてよい理由が分からない。

処理済み集合のサイズをa、次の子をbとする。各併合を互いに素な頂点集合の二分合成へ展開すると、異なる二頂点が初めて同じ塊になるのは一度だけなのでΣab=N(N−1)/2。ゼロ成分の添字を含めても(a+1)(b+1)≤4abであり、配列の確保・初期化も含め二乗に収まる。ループ上限を実在する処理済みサイズへ制限することが前提である。

[公式問題](https://atcoder.jp/contests/abc287/tasks/abc287_f)・[個別公式解説](https://atcoder.jp/contests/abc287/editorial/5632)のサイズ制限に、この課金の説明を補う。2頂点の四選択から境界bitを確認し、子配列解放時だけのO(N)作業空間、空集合を出力しない規約も保つ。[#392](https://github.com/Fu-L/abc-textbook/issues/392)で扱う。

### ABC460 G：境界色表から、一回の合成・更新・任意点照会へ進む

[現稿](../../src/content/docs/problems/graph-search/outcome-compose-dynamic-tree-clusters/outcome-compose-dynamic-tree-clusters-shard-001/abc460-g.md)は境界色表・内部重み・所有nodeまで定義するが、「定数サイズgraphを作る」「兄弟clusterを再合成」の間に、基底・成分ID・照会の開始状態が必要である。[公式問題](https://atcoder.jp/contests/abc460/tasks/abc460_g)・[個別公式解説](https://atcoder.jp/contests/abc460/editorial/21012)は動的rerootingと両方向の情報を示すが、この境界色表をそのまま提示してはいない。教材独自の具体化として検証する。

道a–w–b、重み(2,3,5)、全色0で、両境界a,bから見える内部和3は同じ成分なので二重加算しない。色010なら各点が別成分になる。共有頂点wを内部化するときだけC_wを固定しW_wを一度加え、境界のままなら色は変数・重みは未加算とする。この小例から通常の高々二境界の表を定義する。

任意点vの照会では、vの所有nodeを通常表として読むだけでは足りない。vを内部化する前の部品からvを境界へ残し、祖先ごとの兄弟をどう合成するか、照会用の追加境界と一時的な接点、閉成分を捨ててよい時点、最後のC_v固定とW_v加算を具体化する。所有箇所への一点更新が高次数の全辺更新にならない理由も示す。独自論証が重いため[#393](https://github.com/Fu-L/abc-textbook/issues/393)は一問だけ。**境界表実装と任意点照会の完全検証は後続に残り、調査時点では完了としていない。**

## 追加で具体化した訂正とUnitの入口

- **ABC378
  F**：[現稿](../../src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc378-f.md)の「復習の核」は端点・path内部でそれぞれ次数が1増えるとする。実際は端点だけ2→3、内部は3のままで、同居する考察・正当性の正しい説明と矛盾する。辺1–2,2–3,3–4,4–5,3–6へ2–4を加える例で訂正する。[公式問題](https://atcoder.jp/contests/abc378/tasks/abc378_f)・[個別公式解説](https://atcoder.jp/contests/abc378/editorial/11293)を2026-10-29に追加照合した。[#394](https://github.com/Fu-L/abc-textbook/issues/394)は復習欄と必要な整合箇所だけを扱う。
- **ABC351
  G**：[現稿](../../src/content/docs/problems/graph-search/outcome-compose-dynamic-tree-clusters/outcome-compose-dynamic-tree-clusters-shard-001/abc351-g.md)の「時間」は構築O(N)だが、説明から線形構築までは導けない。参照する[Unit](../../src/content/docs/learn/tree/static-top-tree.md)のprefix重み＋二分探索はO(N
  log N)。高さと構築時間を分け、その手順なら全体をO(N log N+Q log
  N)へそろえるか、線形構築の具体手順を示す。[公式問題](https://atcoder.jp/contests/abc351/tasks/abc351_g)・[個別公式解説](https://atcoder.jp/contests/abc351/editorial/9868)を2026-10-29に追加照合した。公式の説明もO((N+Q)log
  N)を掲げ、現稿の線形構築を保証する根拠にはならない。[#395](https://github.com/Fu-L/abc-textbook/issues/395)で既存の葉(0,A)・合成順・零積の扱いを保って補う。
- **tree-metric**：「考え方」の「分岐する三pathの長さの比較」から直径端点の代表性へ飛ぶ。射影と枝長の上界を小例から説明し、二回探索の保証とは分けて証明する。[既存ABC460 F](../../src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc460-f.md)の補題も参照できる。零辺・同率・一頂点・非負辺長を確認し、指定距離・中心・番号tieへの追加条件を区別する。[#396](https://github.com/Fu-L/abc-textbook/issues/396)でUnitだけを編集し、ABC222
  Fは照合のみ。
- **tree-aggregation・tree-decomposition**：親の「考え方」はmessageや変換先の紹介が中心で、下位手法を選ぶ小例がない。4頂点r–a,a–b,r–cで、rへ渡す{a,b}の(count,sumDist)=(2,3)、DFS順(r,a,b,c)でのsubtree(a)=[1,3)、path(b,c)=b,a,r,c、指定点{b,c}に必要なLCA=rを比べる。何を保存したいときにどの子へ進むかを[#397](https://github.com/Fu-L/abc-textbook/issues/397)で示し、下位の詳しい証明を複写しない。

Unitの2件は一次確認からの具体化であり、代表5問と同じ深さの公式再照合済みとはしない。後続Issueに公式再照合先を記した。空見出し・分類文の反復だけを独立の確定不具合として予約したページはない。

## 後続改稿と優先順

7問・3単元を9件へ分け、全件に実path・症状・補う説明・公式根拠・個別検算・検証・依存を記した。編集path10本は重複しない。

| 優先する課題           | 後続Issue                                               | 編集対象                             |
| ---------------------- | ------------------------------------------------------- | ------------------------------------ |
| 寄与の二重計上         | [#389](https://github.com/Fu-L/abc-textbook/issues/389) | ABC337 G                             |
| 次数変化の誤記         | [#394](https://github.com/Fu-L/abc-textbook/issues/394) | ABC378 F                             |
| 境界状態と必要十分性   | [#390](https://github.com/Fu-L/abc-textbook/issues/390) | ABC223 G                             |
| 根の統計と最終出力     | [#391](https://github.com/Fu-L/abc-textbook/issues/391) | ABC376 G                             |
| 全併合の計算量         | [#392](https://github.com/Fu-L/abc-textbook/issues/392) | ABC287 F                             |
| 構築時間の整合         | [#395](https://github.com/Fu-L/abc-textbook/issues/395) | ABC351 G                             |
| 独自の合成・任意点照会 | [#393](https://github.com/Fu-L/abc-textbook/issues/393) | ABC460 G                             |
| 距離の代表性の証明     | [#396](https://github.com/Fu-L/abc-textbook/issues/396) | tree-metric                          |
| 下位手法を選ぶ入口     | [#397](https://github.com/Fu-L/abc-textbook/issues/397) | tree-aggregation・tree-decomposition |

各1 Issue＝1 PR、必須先行mergeなし。#179・他分野の調査・#141・#142の全完了を待たない。ABC351
GとABC460
Gは同じ構築の計算量を照合するが、編集pathと完了条件を分ける。#140の直接Sub-issue数の上限を増やさず、全9件を#179の標準Sub-issueへ登録した。#140
→ #179 → 後続9件と親Epic本文からたどれる。調査の完了は配下の改稿完了を意味しない。

共通生成器・reader・rendererが原因となる再現は実証していない。未区切りの原稿記法や説明不足を基盤不具合へ置き換えず、基盤改修・一括再生成は追加しない。

## 一次確認のみの残範囲

代表5問以外の39問は一次確認が中心で、うちABC378 F・ABC351
Gの上記の点だけを追加照合した。予約7問・3単元を除く**37問・16単元**の詳細確認を#140の未完了として残す。未予約のページを修正不要・品質確認済みとはしない。

| 残る範囲                                                                                                     | 既存の説明と次の詳細確認                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 章入口、tree-metricの担当6問                                                                                 | ABC303 Eの距離mod 3、ABC361 Eの辺横断下界、ABC428 Eの補助葉と番号tie、ABC401 Fの境界集計、ABC267 Fの二根DFS stack、ABC221 Fの中心別選択はある。一般modの誤用、同率、中心の半径の必要性、単頂点とsort・出力込み評価を公式・小例まで確認する。tree-metric本文は予約済み。 |
| rooted-tree-aggregation、ABC309 E・ABC409 E・ABC239 E・ABC391 E・ABC459 E                                    | max残量と−1、cut保存量、重複を残す上位20、majorityの最小反転、postorder選択積と巨大上側二項係数はある。契約重複・零辺・指数入力長・法をまたぐ分子・不可能な部分木、復習欄の再利用性を詳細確認する。                                                                     |
| 同Unit、ABC447 F・ABC397 E・ABC394 F・ABC312 G・ABC259 F・ABC263 F                                           | 元次数と採用次数、完成時だけの二枝、親辺の予約、三方向係数、枠の機会費用、勝者賞金の確定はある。基底から終了判定、次数不足、負利得、winnerのround添字・根の賞金回収まで小例と公式で確認する。ABC287 F・ABC378 Fは予約済み。                                             |
| 同Unit、ABC416 F・ABC248 G・ABC264 Ex・ABC329 G                                                              | path数と次数四状態、gcd別count/長さ和と償却、旧値を除く差分、portのpickup/dropとentry loadは具体的。計数対象の重複、枝刈り、更新前後・整数幅・全呼出し量を公式と独自検算まで確認する。                                                                                  |
| rerooting、ABC220 F・ABC348 E                                                                                | 距離和の差N−2subと重み版、messageの頂点追加・辺変換・prefix/suffixはある。辺向き・空の隣接集合・非可換順、頂点重みと辺長の区別、全体計算量を小例と確認する。ABC223 Gは予約済み。                                                                                        |
| tree-euler-flattening・tree-ancestor-lca・heavy-light-decomposition、ABC240 E・ABC406 F・ABC294 G・ABC298 Ex | 入場一回の半開区間、葉番号、辺の子側、符号付きtour、祖先表、中央辺での二分はある。tourの二規約とBITのprefix端点、初期構築の費用、非可換path順序を詳細確認する。ABC298 Exの考察の`sz\[M]`は未区切り記法候補であり、式の範囲を読んで修正する。ABC337 Gは予約済み。        |
| virtual-tree・implicit-binary-tree・laminar-interval-containment-tree、ABC340 G・ABC321 E・ABC405 F          | LCA追加の十分性、色ごとのopen/closed、祖先caseの排他性、巨大shift防止、端点eventと祖先集合の対称差はある。長い圧縮辺の選択対応、singleton、上限Nでの切詰め、dummy根・端点の開閉を公式と確認する。                                                                       |
| dsu-merge-tree・tree-balanced-separators、ABC314 F・ABC235 Ex・ABC291 Ex・ABC359 G                           | DSU代表と履歴節点、同重みの多子化、重心選択、全体から同成分を除く集計は具体的。期待値の加算、同重み中間成分を作らない補正、葉数重心と頂点数重心の違い、ラベル初期化・作業空間を詳細確認する。                                                                           |
| additive-tree-metric-reconstruction・tree-precedence-contraction、ABC451 E                                   | 全頂点・正辺長・追加頂点なしのモデル、祖先等式からの一意親と全距離検証、block交換と復元はある。加法性だけでの誤受理、同点・距離上限、現在親の引き方と交差積を小例・公式で確認する。ABC376 Gは予約済み。                                                                 |
| heavy-path-tree-dp・static-top-tree・heavy-light-recursive-dp、ABC269 Ex・ABC311 Ex                          | affine合成順と末端入力1、次数予算、重み付きpivot、HLRecDPの外部配列・heavy一回/light二回・根必須回収はある。一般max-plusへNTTを誤用せず、保持配列・零重さ・全path先頭の指数評価を詳細確認する。ABC351 G・ABC460 Gは予約済み。                                           |

上記16単元には章入口も含む。関連11問と別担当ABC222
Fは接続確認だけで、担当数・残37問・新たな改稿予約に含めない。英語混在・未定義記号・復習欄が検算指示だけの箇所も次の詳細確認へ含める。

## 検証と限界

- Node.js 26.12.1 / npm
  11.20.0で`npm run notation:report -- <対象19単元・44問の実path>`を実行し、**63原稿・366候補・明示数式エラー0件**、exit
  0。npmは指定版11.21.1との差を警告した。依存・lockfileは変更していない。全候補は`UNDELIMITED_TEX`で、365件が44問題の「制約との対応」、1件がABC298
  Exの考察の`\[`。同じ文中の複数コマンドも別候補であり、表示不具合366件とは数えない。
- 一時検算では、2〜6頂点の全1,441ラベル付き木で、ABC337 Gの上記更新案と全根の経路包含真値、ABC223
  Gの白判定と頂点削除前後の全辺subset最大matchingが一致。ABC287
  Fは全87,228頂点subsetの成分数分布と一致し、全併合のΣab=C(N,2)も確認した。ABC376
  GはN≤6の600例（固定seed179）で全合法順列の目的値と、ダミー根を含む比率縮約値が一致。ABC378
  Fは非隣接頂点対13,761件で追加後の閉路次数条件と元木の2/3条件が一致した。一般証明・heap実装・後続改稿の公式例と表示検証の代用にはしない。
- 固定44
  IDの一致・重複なし、19単元のpath・homeと既存順、対象と関連先の形式、後続9件の編集path10本の存在・重複なしを確認した。公式再照合は今回の調査日として記録し、教材のsource
  ID・fingerprint・過去の確認日時を書き換えない。一時検算コード・取得結果・管理台帳はcommitしない。
- 変更Markdownの書式・ローカルリンクを既存の`.github/actions/nonpublic-docs/check.mjs --files`、差分を`git diff --check`で確認した。文書のみのPRなのでbuild・E2Eは対象にしない。後続では公式根拠・本文とclaim・必要なschema/reader検証、本番subpathのbuild・内部リンク・文章と表示まで確認する。
