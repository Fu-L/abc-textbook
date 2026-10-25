# LIS・値域・区間・部分集合・有限状態DPの一次調査（D2）

[調査 #174](https://github.com/Fu-L/abc-textbook/issues/174)、親は[本文改修 #140](https://github.com/Fu-L/abc-textbook/issues/140)。2026-10-25、main
`83a7fd86` の
**10単元・48問を一次確認し、6問・3単元の改稿を8件へ分けた**。このPRは調査文書だけを追加する。調査完了を本文改稿の完了とは数えない。

[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)、[full](../../.agents/skills/abc-explanation-author/templates/full-explanation.md)・[短縮形式](../../.agents/skills/abc-explanation-author/templates/abbreviated-explanation.md)を基準に、区間の分割と拡張、各bitの意味、遷移の網羅性・重複、桁上限・automaton・carryの状態と境界を読んだ。未知問で状態や式を再構成できるかを重視し、既にある導出や補強は改稿案でも残す。

## 範囲と確認の深さ

単元は `src/content/docs/learn/dynamic-programming/` 以下。問題は `src/content/docs/problems/`
以下を再帰的に探した各IDと同名のMarkdownであり、直下にはない。実pathとfrontmatterの
`problemId`・`docPath` を照合した。下表はhome Unitの `directProblemIds`
の既存順であり、所属と範囲の確認用である。難易度順の再計算・並べ替えは行っていない。

| 対象単元                                                                                                  | 主配置の対象Problem ID                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [dp-lis.md](../../src/content/docs/learn/dynamic-programming/dp-lis.md)                                   | `abc439-e`, `abc393-f`, `abc369-f`                                                                                                                                                 |
| [dp-value-range.md](../../src/content/docs/learn/dynamic-programming/dp-value-range.md)                   | `abc339-e`, `abc354-f`, `abc360-g`, `abc410-g`, `abc240-ex`                                                                                                                        |
| [dp-prefix-partition.md](../../src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)         | `abc466-e`, `abc285-e`, `abc288-f`, `abc374-f`, `abc230-f`, `abc262-ex`                                                                                                            |
| [dp-interval-composition.md](../../src/content/docs/learn/dynamic-programming/dp-interval-composition.md) | `abc217-f`, `abc252-g`, `abc400-f`, `abc292-g`, `abc325-g`, `abc233-g`, `abc298-g`, `abc261-g`, `abc262-g`                                                                         |
| [dp-interval-expansion.md](../../src/content/docs/learn/dynamic-programming/dp-interval-expansion.md)     | `abc273-f`, `abc219-h`                                                                                                                                                             |
| [dp-subset-state.md](../../src/content/docs/learn/dynamic-programming/dp-subset-state.md)                 | `abc274-e`, `abc301-e`, `abc338-f`, `abc381-f`, `abc232-f`, `abc332-e`, `abc425-f`, `abc310-f`, `abc352-f`, `abc343-g`, `abc411-g`, `abc328-g`, `abc396-g`, `abc432-f`, `abc319-f` |
| [dp-digit-string.md](../../src/content/docs/learn/dynamic-programming/dp-digit-string.md)                 | なし                                                                                                                                                                               |
| [digit-dp.md](../../src/content/docs/learn/dynamic-programming/digit-dp.md)                               | `abc406-e`, `abc465-e`, `abc336-e`, `abc235-f`, `abc317-f`, `abc288-ex`                                                                                                            |
| [automaton-dp.md](../../src/content/docs/learn/dynamic-programming/automaton-dp.md)                       | なし                                                                                                                                                                               |
| [dp-carry-mixed-radix.md](../../src/content/docs/learn/dynamic-programming/dp-carry-mixed-radix.md)       | `abc231-e`, `abc466-g`                                                                                                                                                             |

全48問の考察・正当性・実装上の注意・復習・計算量と記法を一次確認した。代表の **ABC261 G・ABC328
G・ABC319 F・ABC235 F・ABC466 G**
は同居claimと公式問題文・個別公式解説まで同日に再照合した。改稿する3単元も小例と補う手順を具体化し、接続先ABC274
E・ABC305 G・ABC419 Fの個別公式解説を再照合した。

**残る43問・7単元は一次確認のみ**である。そのうちABC393
Fの添字規約を追加予約したため、**未予約は42問・7単元**となる。品質確認済み・修正不要とは扱わず、下記の着眼点から詳細確認を続ける。対象48問と、10単元の
`relatedProblemIds` にある範囲外24問は全て `full`、`primaryProblemId: null`
であり、短縮形式の参照元を追加して読む対象はなかった。関連24問の考察も接続の確認として読んだが、担当・詳細診断の件数に加えない。ABC321
G・subset変換などの初期改稿、他分野の担当を重複Issue化しない。

## 詳しく確認した代表5問

以下の公式根拠の再照合日は2026-10-25。解法全体を誤りとする診断ではなく、現稿にある式と不足する説明を分けて記す。

### ABC328 G：有効遷移数と、候補を調べる時間を分ける

「考察」には長さ別の有効遷移数の評価がある。一方、手順の「全original
interval」「disjointならappend」は、全区間を調べてから不採用とする実装にも読める。その場合は判定だけで O(N²2^N) となり、掲げた O(N2^N+N³) につながらない。

公式実装のように、maskと左端を固定して右端を伸ばし、使用済みbitへ当たったらそこで打ち切る。費用も伸ばすごとに一要素分を加算する。有効遷移の総数は
`Σ_k (N−k+1)2^(N−k) = 2^N(N−1)+1`。不採用の検査も各(mask,左端)で高々一回なので O(N2^N) へ収まる。調査では N=1..8 で両者を数えて確認した。A=(1,2,3)、B=(3,1,2)、C=1 の回転なら [3]、[1,2] の順に追加して費用1になる例で、maskと出力先を接続する。前計算を残す方式と累積方式のどちらを採るかを決め、時間・空間を手順へそろえる。[公式問題](https://atcoder.jp/contests/abc328/tasks/abc328_g)・[個別公式解説](https://atcoder.jp/contests/abc328/editorial/7644)。

### ABC261 G：「最初の規則」と、同じ区間を閉じる順序をそろえる

「正当性」とclaimは「長さ2以上の右辺を使う最後の規則」「文字間の最短路閉包を先に取る」とする。「考察」「実装上の注意」では多文字規則の候補を作ってから同一区間の単項閉包を取る。導出木の根と時系列の最後の操作が混ざり、説明同士の計算順が合わない。

文字cから目標区間を作る最初の規則を固定する、と説明する。多文字右辺は非空の短区間へ分かれ、単項規則だけが同長依存を作る。各区間で、一致基底0と多文字の分割候補→逆向きの単項辺による多点始点Dijkstra→長さ1の規則prefix補助値、の順をそろえる。S=a、T=bc、規則a→d、d→bcなら、dの費用1からaの費用2へ伝播する。公式解説の一致基底に1とある文章は、掲載コードの0および無操作で一致する問題条件と区別して読む。最後のSの連結分割、到達不能−1、claimも同じ説明にする。[公式問題](https://atcoder.jp/contests/abc261/tasks/abc261_g)・[個別公式解説](https://atcoder.jp/contests/abc261/editorial/4485)。

### ABC319 F：強い固定点が弱い固定点の訪問集合も含む理由を補う

「考察」「正当性」の「同maskで強い状態は弱い状態の討伐と到達を全て再現できる」が状態圧縮の核心である。しかし強さの大小から討伐集合まで比較する説明と、heap方式で保存・複製するものに行間がある。「または再simulation」も実装方式を決める手順には足りない。

まず未使用薬を跨がず、倒せる敵を全て倒した状態を固定点と呼ぶ。弱い固定点の訪問敵の閾値はその最終強さ以下であり、強い固定点では同じ使用済み薬の経路からその敵集合も回収できることを示す。heap方式なら強さ・討伐済み・到達済み・候補heapを一組で保存し、コピー→薬→子の解禁→敵を尽くす→改善時だけ一組で置換、と具体化する。根の子に敵(s=1,g=2)と薬(×2)、薬の子に敵(s=6,g=5)があれば、初期固定点3→薬6→子敵11となる。既討伐敵の二重加算と未使用薬の子の先取りを防ぎ、capも説明する。公式の前処理付き O(N)
simulation と、現稿のheapによる O(N log
N) を混ぜない。[公式問題](https://atcoder.jp/contests/abc319/tasks/abc319_f)・[個別公式解説](https://atcoder.jp/contests/abc319/editorial/7116)。

### ABC235 F：空prefixの「一通り、総和0」から手順を始める

状態の十分性と
`sum'=10sum+d·count`、先頭0の注意は既にある。しかし初期値・合法digit・次層の初期化・終端集計が一続きの手順になっていない。空prefixのcountとsumをともに1へ初期化する誤用を防ぐ説明が必要である。

tight=1、started=0、mask=0に(count,sum)=(1,0)、他は(0,0)を置く。上限以下のdigitを選び、未開始0だけmaskに入れず、実桁の0はbit0を立てる。旧層から次層へ個数と総和を加算し、最後はstartedかつ必須maskを包含する両tightを集計する。N=20・必須数字{0}なら、010と020が10と20を表して総和30となり、001のpaddingは0の出現ではない。公式sample1の総和520にも接続する。法を998244353と明示し、DP作業領域 O(2^10) と上限文字列込み O(D+2^10) を区別する。[公式問題](https://atcoder.jp/contests/abc235/tasks/abc235_f)・[個別公式解説](https://atcoder.jp/contests/abc235/editorial/3247)。

### ABC466 G：独立式が少ないことだけでは、1024状態は導けない

非負化、抽出右辺の負値検査、30bit後のcarry0、存在boolと剰余個数の分離は既にある。一方、「考察」の「carryは0..ℓ_j−1」「高々1024通り」には導出がない。単に式がN本以下だから小さい、と誤解させないことが重要である。

b桁後のcarryを `C_j=(Σ(u_i mod 2^b)−(S'_j mod 2^b))/2^b` と定義する。合同条件の下で整数かつ
`0≤C_j<ℓ_j`
となることから、一桁の偶奇検査と次carryを導く。状態数は、prefixの同一成分内で隣り合う添字のgap長の積に抑えられる。調査では9位置の全21,147集合分割を重複なく列挙し、最大1024を確認した。成分番号(0,1,2,3,0,1,2,3,0)では五つのgapが全て4となり、積は4^5=1024である。これは本問の有限条件の検算であり、一般のq本の式へ転用する上界ではない。後続では場合分けまたは再現可能な有限列挙で根拠を本文へ与え、一式の小例からvectorへ進む。既存の負の抽出右辺の反例とInfinity判定を残す。[公式問題](https://atcoder.jp/contests/abc466/tasks/abc466_g)・[個別公式解説](https://atcoder.jp/contests/abc466/editorial/22603)。

## 単元で補う説明

- **部分集合・bitmask状態DP**：「答えは全maskの終点別最小値から取る」は全てのmaskの走査にも読める。頂点0,1,2と001→011→111の小例を置き、Hamilton
  pathは `ALL=(1<<N)−1`
  の終点別最小、任意回収では必須bitを含む複数mask、と分ける。submask列挙もmaskから開始し、0で止める条件まで書く。既存の非循環性・3^Nの説明を残し、標準形の全遷移 O(N²2^N) へつなぐ。[ABC274 Eの公式解説](https://atcoder.jp/contests/abc274/editorial/5020)と接続を照合した。
- **有限状態DPの親・automatonの2単元**：親の「考え方」はcarryを列挙する一方、「範囲」ではcarryを除外している。別単元への比較参照と明示する。automaton単元には一文字更新式があるが、行列は「半環上の行列累乗などへ発展」の一文で終わる。禁止11の二状態で長さ2は3通り・長さ3は5通りを追い、列vectorなら
  `T[to][from]` を文字数、`v_L=T^L v_0`
  とする。全pattern充足のmaskを含む完全状態数、禁止時の即時除外と終端受理の違い、通常DPと密行列の計算量を説明する。構築方法は既存の直接前提へ戻す。[ABC305 G](https://atcoder.jp/contests/abc305/editorial/6540)・[ABC419 F](https://atcoder.jp/contests/abc419/editorial/13623)の個別公式解説と接続を照合した。

## 後続の改稿と優先順

各Issueに実path・症状・補う説明・公式出典・検証・依存を記載した。全8件は各1 Issue＝1
PRで、編集pathは相互に重複しない。

| 優先                   | 後続Issue                                               | 編集対象と到達点                                                                  |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 先に直す手順と評価     | [#307](https://github.com/Fu-L/abc-textbook/issues/307) | ABC328 G：未使用区間を打ち切って列挙し、判定費用も含む計算量へ接続                |
| 先にそろえる依存順     | [#306](https://github.com/Fu-L/abc-textbook/issues/306) | ABC261 G：導出木の最初の規則、多文字候補・単項閉包・補助値の順を本文とclaimで統一 |
| 基礎への導線           | [#311](https://github.com/Fu-L/abc-textbook/issues/311) | dp-subset-state：bitの小例、全訪問の終端、submaskの開始・停止                     |
| 基礎への導線           | [#309](https://github.com/Fu-L/abc-textbook/issues/309) | ABC235 F：空prefixから次層・先頭0・最終和までを実装できる手順へ                   |
| 基礎への導線           | [#312](https://github.com/Fu-L/abc-textbook/issues/312) | dp-digit-string・automaton-dp：二状態の小例から受理・直積状態・行列へ             |
| 一次確認からの記法訂正 | [#313](https://github.com/Fu-L/abc-textbook/issues/313) | ABC393 F：dp[j]の長さjとtails[j]の長さj+1を統一し、質問の返り値へ接続             |
| 一問で深く扱う         | [#308](https://github.com/Fu-L/abc-textbook/issues/308) | ABC319 F：固定点の支配性、補助状態を一緒に引き継ぐ具体手順                        |
| 一問で深く扱う         | [#310](https://github.com/Fu-L/abc-textbook/issues/310) | ABC466 G：carryの式・範囲・1024状態の根拠と有限検算                               |

必須の先行mergeはない。具体化したものから着手でき、#174のmerge、他分野の全調査、#141・#142の完了を待たない。独自論証を伴うABC319
F・ABC466 Gは各一問に分けた。ABC393
Fは「考察」と「正当性」の異なる添字規約を直す予約であり、代表5問と同じ深さの公式再照合済みとは扱わない。#140にも8件と残範囲を反映し、GitHub標準のSub-issueに登録した。共通生成器・reader・renderer起因の再現は実証していないため、基盤修正Issueや一括再生成を追加しない。

## 一次確認のみの残範囲

以下は代表5問と同じ深さの公式再照合・数学監査を済ませていない。上の対象表から予約6問・3単元を除いた
**42問・7単元** が未予約であり、今回の文書PRを閉じても#140の未完了範囲に残す。

| 範囲                                                     | 一次確認で読めた説明と、次に詳しく確認する着眼点                                                                                                                                                                                              |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LIS・値域：予約ABC393 Fを除く7問、dp-lis・dp-value-range | strict/非strict、二次元の同値順、左右長の所属条件、ABC360 Gの変更値正規化と更新前の全検索は既にある。ABC240 Exの候補長交換、ABC410 Gの円の切断を小例・公式根拠まで追う。                                                                      |
| prefix分割：6問、dp-prefix-partition                     | ABC466 Eの空phaseと全0基底、ABC230 Fの異なる部分列、ABC374 Fの最終出荷は具体化済み。最後の切れ目による対象の一意性、ABC262 Exのlevel分離とlast状態、前計算込みの評価を詳細確認する。                                                          |
| 区間合成：予約ABC261 Gを除く8問、dp-interval-composition | ABC217 Fの操作列の混ぜ方、ABC252 Gの森の定義、ABC400 Fのepと更新順、ABC292 Gの数字別補助式、ABC233 Gの分離線証明は既にある。ABC325 Gの最後の操作の網羅性、ABC262 Gの最大値pivotと値境界、ABC298 Gの切断木と下限固定の保証を公式と再照合する。 |
| 区間拡張：2問、dp-interval-expansion                     | ABC273 Fは壁判定が拡張前の区間、初到達の端点集計まである。ABC219 Hは残り選択本数による距離課金と区間長降順を持つ。合成DPの長さ昇順と混同せず、0距離・終了・残件数の境界を小例で確認する。                                                     |
| 部分集合：予約ABC328 G・ABC319 Fを除く13問               | 訪問集合、最早終了、位置集合、可能和集合、使用済み成分などbitの意味が異なる。ABC338 Fの代表訪問、ABC425 Fの同文字runの代表化、ABC396 GのHamming分布、ABC432 Fの0prefix分割を、数える対象・履歴の同値性まで詳細確認する。                      |
| 桁：予約ABC235 Fを除く5問、digit-dp                      | ABC465 Eは0・三条件の真偽和、ABC317 Fは下位比較flag、ABC288 Exは奇偶block・空列基底まで具体化済み。MSBのtightをLSBへ流用せず、ABC406 Eの自由下位bitとN自身、各集約の多重度・全体計算量を公式と再照合する。                                    |
| carry：ABC231 E、dp-carry-mixed-radix                    | 支払いの床/天井二状態と最上位基底がある。二carryの硬貨問題と複数加算式のcarry範囲を区別し、端数0・最上位への繰り上がりを小例で確認する。                                                                                                      |

ここにある既存の式や証明を、調査時点で未実装と扱って書き直さない。特にABC360 G・ABC400 F・ABC273
F・ABC317 F・ABC288
Exなどには既存の具体化がある。空見出しや分類文の反復を新たな確定不具合として予約したページはないが、これは全原稿の文体・表示を保証する判定ではない。

## 検証と記法候補の扱い

- `npm run notation:report -- <対象10単元と48問の実path>`：**58原稿、321候補、明示数式エラー0件**。全候補は
  `UNDELIMITED_TEX` で、節を文脈確認すると320件が「制約との対応」、1件がABC432
  F「考察」の集合記法だった。320件のコマンドを320個の表示不具合や別個の改稿課題へ数えない。
- 制約欄の `\leq`・`\times` 等とABC432
  Fの集合記法は、後続の対象ページで式の範囲と意味を読んで明示数式化する候補として残す。予約6問は各改稿で扱い、それ以外は上記未予約42問の詳細確認に含める。一括置換や、候補が0であることを完成条件にする修正はしない。
- 対象IDの48件一致・重複なし、10単元のhome配列と既存順、実path、full形式と参照元、後続8件の編集対象の重複なしを確認した。ABC328
  Gの遷移数、ABC235 Fの小例、ABC466
  Gの状態数を一時的な検算で確認した。検算コード・取得HTML・新しい台帳はcommitしない。
- 変更Markdownの書式・ローカルリンクは既存の
  `.github/actions/nonpublic-docs/check.mjs --files`、差分は `git diff --check`
  で確認する。教材・分類・共通表示は変更しない文書PRのため、build・E2Eは実行対象にしない。後続の本文改稿では公式根拠・本文とclaim、必要なschema/reader検証、本番subpathのbuild・内部リンク・対象の文章と表示を確認する。
