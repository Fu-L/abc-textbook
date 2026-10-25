# D3：確率・ゲーム・遷移高速化と発展DPの本文調査

2026-10-26、[調査Issue #175](https://github.com/Fu-L/abc-textbook/issues/175)の10単元・62問を、main
`06cee12f`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)のうち、この文書は調査と後続改稿の範囲を具体化するもの。**教材改稿の完了ではない。**
[憲章](../../.specify/memory/constitution.md)、[更新マニュアル](update-manual.md)、[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)、full・短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

次表はhomeの`directProblemIds`を既存順で記した担当範囲であり、難易度の再評価・並べ替えではない。問題本文は`src/content/docs/problems/`配下で各IDと同名のMarkdownに一意に対応する。

| 対象単元                                                                                                                | 担当Problem ID                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [dp-stochastic.md](../../src/content/docs/learn/dynamic-programming/dp-stochastic.md)                                   | `abc266-e`, `abc360-e`, `abc275-e`, `abc323-e`, `abc298-e`, `abc326-e`, `abc300-e`, `abc350-e`, `abc402-e`, `abc263-e`, `abc382-e`, `abc314-e`, `abc333-f`, `abc412-f`, `abc421-e`, `abc342-f`, `abc404-f`, `abc450-g`, `abc277-g`, `abc226-h`, `abc242-ex`, `abc299-ex`, `abc270-ex` |
| [dp-game.md](../../src/content/docs/learn/dynamic-programming/dp-game.md)                                               | `abc354-e`, `abc368-f`, `abc278-f`, `abc380-f`, `abc297-g`, `abc278-g`, `abc255-g`                                                                                                                                                                                                    |
| [dp-game-value.md](../../src/content/docs/learn/dynamic-programming/dp-game-value.md)                                   | `abc349-e`, `abc303-g`                                                                                                                                                                                                                                                                |
| DP遷移高速化：単元本文は[#160](https://github.com/Fu-L/abc-textbook/issues/160)の担当                                   | `abc442-f`, `abc224-e`, `abc408-f`, `abc358-g`, `abc224-f`, `abc353-g`, `abc334-f`, `abc249-e`, `abc243-g`, `abc457-f`, `abc265-f`, `abc282-g`, `abc435-g`, `abc338-g`, `abc221-h`                                                                                                    |
| [linear-recurrence.md](../../src/content/docs/learn/dynamic-programming/linear-recurrence.md)                           | `abc293-e`, `abc256-g`, `abc271-g`, `abc258-ex`                                                                                                                                                                                                                                       |
| [cyclic-minimax-game.md](../../src/content/docs/learn/dynamic-programming/cyclic-minimax-game.md)                       | `abc413-f`, `abc261-ex`                                                                                                                                                                                                                                                               |
| [frontier-profile-dp.md](../../src/content/docs/learn/dynamic-programming/frontier-profile-dp.md)                       | `abc248-f`, `abc379-g`, `abc296-ex`                                                                                                                                                                                                                                                   |
| [steiner-tree-dp.md](../../src/content/docs/learn/dynamic-programming/steiner-tree-dp.md)                               | `abc364-g`, `abc395-g`                                                                                                                                                                                                                                                                |
| [eventual-unbounded-knapsack.md](../../src/content/docs/learn/dynamic-programming/eventual-unbounded-knapsack.md)       | `abc415-g`, `abc310-ex`                                                                                                                                                                                                                                                               |
| [additive-expectation-potential.md](../../src/content/docs/learn/dynamic-programming/additive-expectation-potential.md) | `abc249-ex`                                                                                                                                                                                                                                                                           |
| [conway-number-games.md](../../src/content/docs/learn/dynamic-programming/conway-number-games.md)                       | `abc229-h`                                                                                                                                                                                                                                                                            |

10単元の主配置は47問。予約済みDP遷移高速化単元の15問も#175の固定リストに含まれるため、合計62問を読む。単元本文まで追加で予約しない。ABC253
E・ABC370 Eは[#167](https://github.com/Fu-L/abc-textbook/issues/167)、ABC372
Fは[#163](https://github.com/Fu-L/abc-textbook/issues/163)、ABC212
Eは既存改稿の担当として照合だけ行った。

全対象の主要な説明・正当性・実装上の注意・復習・計算量と記法を一次確認した。**代表5問（ABC350
E・ABC338 G・ABC379 G・ABC364 G・ABC415 G）は、同居claimと公式問題文・個別公式解説まで再照合した。**
改稿する2単元も、下記の小例・手順・費用の内訳まで具体化した。

**残る57問・8単元は一次確認のみ**であり、修正不要・品質確認済みとは扱わない。対象62問と10単元の関連先にある範囲外15問は全て`full`、`primaryProblemId: null`だった。短縮解説の参照元を追加して読む対象はない。関連15問の考察・正当性は接続確認として読んだが、担当件数や詳細診断へ加えない。

## 詳しく確認した代表5問

以下の公式根拠の再照合日は2026-10-26。既存の正しい式・証明を残し、実装を誤らせる食い違いと、説明を補う課題を区別する。

### ABC364 G：都市番号と端点bitを分ける

[現稿](../../src/content/docs/problems/dynamic-programming/outcome-solve-steiner-tree-by-subset-dp/outcome-solve-steiner-tree-by-subset-dp-shard-001/abc364-g.md)の「考察」は固定端点を`i=1..K−1`としながら`dp[1<<i][i]=0`とする。計算量欄の`k=K−1`個のbitと、通常の全端点maskに一致しない。K=2では唯一の端点・都市1にmask2を割り当て、長さ2のmask配列の範囲外になる。

都市を1始まりで説明するならbitは`i−1`とし、`dp[1<<(i−1)][i]=0`、`full=(1<<(K−1))−1`へ統一する。K=3なら都市1→bit0、都市2→bit1、全端点はmask3。この対応から集合merge→同maskの多始点最短路→`dp[full][v]`の出力をつなぐ。公式sample1の追加都市3,4は答え3,6で、singletonにも最短路閉包が必要である。集合mergeと辺の延長の証明、重複辺が過小候補を作らない説明は既にあるため残す。[公式問題](https://atcoder.jp/contests/abc364/tasks/abc364_g)・[個別公式解説](https://atcoder.jp/contests/abc364/editorial/10547)。

### ABC379 G：二行にまたがるfrontierを一行の配色にしない

[現稿](../../src/content/docs/problems/dynamic-programming/outcome-design-frontier-profile-dp/outcome-design-frontier-profile-dp-shard-001/abc379-g.md)の「考察」は「有効な一行状態は3·2^(W−1)程度」「横隣接条件を満たす幅Wの色状態だけを列挙」とする。一方、計算量・制約欄には、途中のfrontierが二本の水平pathに分かれ、状態数は`S≤9·2^(W−2)`という補強が既にある。冒頭の説明だけを実装すると合法状態を落とす。

2×2の固定盤面「12 /
21」は合法で答え1だが、下段左を処理した直後の直近二色は(2,2)になる。この二マスは対角なので、同色でもよい。走査位置と上・左の取り出しを定義し、完全な一行と二本に分かれる途中を図か短い追跡で分ける。空状態、固定色、行頭の左判定、shiftと終層の全状態和までつなぐ。既存の正しい状態数評価を考察へ接続し、有効状態を疎に処理する方法と全3進状態の走査を混同しない。[公式問題](https://atcoder.jp/contests/abc379/tasks/abc379_g)・[個別公式解説](https://atcoder.jp/contests/abc379/editorial/11331)。

### ABC350 E：自己ループ後に行動を選び直せることから式を導く

[現稿](../../src/content/docs/problems/dynamic-programming/outcome-optimize-stochastic-actions/outcome-optimize-stochastic-actions-shard-001/abc350-e.md)は未定義の`f`と「die操作の期待値E」から始め、`E=Y+(E+Σf)/6`を解いて`f=min(決定候補,E)`とする。最終式は正しいが、原問題では出目1の後にも行動を選び直せる。Eを「状態が変わるまで同じ操作を繰り返す候補」と定義する理由が必要である。

`f(n)`を最小期待費用とし、決定候補を`D=X+f(floor(n/A))`、自己項以外を`B=Y+Σ_{b=2}^6 f(floor(n/b))/6`とする。一歩式は`f(n)=min(D,B+f(n)/6)`。Dと6B/5の大小で場合分けすると`f(n)=min(D,6B/5)`となり、同じ状態で同じ最適行動を繰り返してよいことまで説明できる。N=3,A=2,X=Y=20ならf(1)=20、二候補40と32で公式sample2へ接続する。現稿のO(log⁴
N)は安全な上界だが、A≤6も2,3,5の素因数へ閉じるため三指数のO(log³
N)へ整理できる。安全な上界を誤りとは数えない。[公式問題](https://atcoder.jp/contests/abc350/tasks/abc350_e)・[個別公式解説](https://atcoder.jp/contests/abc350/editorial/9812)。

### ABC338 G：演算子直後の待機状態と、新しい左端の追加を追う

[現稿](../../src/content/docs/problems/dynamic-programming/outcome-compress-dp-sufficient-aggregates/outcome-compress-dp-sufficient-aggregates-shard-001/abc338-g.md)には確定加算`pre`、係数`mul`、現在項`term`の集計式がある。一方、`cnt/startCount`の初期化・加算時点と、+の後もtermを0へ戻すことが手順として明確でない。「+では…、*では…となりtermSumを0」という一文は、リセットの対象が読み取りにくい。

全集計値を0で始め、digit
dでは旧値から`term'=10term+d·mul+d`、`mul'=mul+1`、`cnt'=cnt+1`とする。最後の+dと+1が、その数字から始まる新しい左端である。+では`pre'=pre+term,mul'=cnt,term'=0`、*では`pre'=pre,mul'=term,term'=0`。演算子直後は次の数を待つ状態なので答えへ加えず、digitの追加後だけpre+termを足す。

sample1の`1+2*34`なら、数字右端ごとの寄与は1,5,16,175で合計197。preを*で確定しない理由と、34の途中の4も新しい左端になることを説明する。公式解説は左右の寄与分解を使うため、四集計値方式の不変条件は本稿の論証として確認する。解法全体の誤りという診断ではない。[公式問題](https://atcoder.jp/contests/abc338/tasks/abc338_g)・[個別公式解説](https://atcoder.jp/contests/abc338/editorial/9174)。

### ABC415 G：初動を保護した交換と、合法なtailを接続する

[現稿](../../src/content/docs/problems/dynamic-programming/outcome-stabilize-unbounded-knapsack-by-best-density/outcome-stabilize-unbounded-knapsack-by-best-density-shard-001/abc415-g.md)の「開始xを自由に選べる基底0」「limit=K(K+1)付近」「各DP
state
xから…反復」は、逆向きのxの意味と具体的な範囲へつながっていない。自己ループのない通常knapsackへ帰着した後の密度交換はあるが、x<Kの初動を残す理由を本文とclaimで補う必要がある。

順向きでは全て飲んだ後の空き瓶xから、x≥A_iでx−D_iへ進みB_i本を追加する。逆向きは残った空き瓶数から戻り、x≥B_iかつx+D_i≤Nでだけ進める。初期残量を選べるので、逆向きDPの全xの基底は0。T=K(K+1)として範囲内の合法遷移を昇順に更新し、N<TならN+dp[N]、大きいNならK≤x<Tからだけ基準品物の反復を足す手順へそろえる。

N=5、交換(5,4)だけなら逆向きはx=4→5で答え9。x=0から密度だけで5回反復すると25になり、開始条件を無視できない。初めてKへ達する値が2K未満になる開始部分を保持し、その後だけで非基準品物の剰余交換と基準品物の末尾への移動を行う。[単元](../../src/content/docs/learn/dynamic-programming/eventual-unbounded-knapsack.md)にはこの区別が既にあるため、問題本文へ整合させる。独自論証の重さを考慮し、一問で改稿する。[公式問題](https://atcoder.jp/contests/abc415/tasks/abc415_g)・[個別公式解説](https://atcoder.jp/contests/abc415/editorial/13491)。

## 単元で補う説明

- **固定線形遷移**：一般のcompanion行列と特性多項式剰余法の導出は既にある。その手前で、列ベクトルなら`T[to][from]`とし、`a'=3a+1`を(a,1)へ写し、一歩1・二歩4・四歩40となる小例を置く。K=13なら1,4,8歩の作用を合成する。現稿の「ベクトル適用はO(d²
  log K)」は、冪行列が既にある場合の適用費用であり、密行列の二乗を含む全体はO(d³
  log(K+1))。既存のO(d²
  log(K+1))特性式法と区別する。[ABC293 E公式問題](https://atcoder.jp/contests/abc293/tasks/abc293_e)・[個別公式解説](https://atcoder.jp/contests/abc293/editorial/5955)のアフィン更新の行列化を再照合した。
- **minimax・得点差**：固定Left基準と手番側基準の式は既にある。独自の両端取得例(2,7)で、空のD=0、一袋のDはその値、二袋ではmax(2−7,7−2)=5と追い、相手基準の次のDを引く理由を示す。固定Left基準ならRightの取得額は負のrewardにし、Right手番はminとなる。同じ例で二表現を照合してから、ABC349
  Eの「三目成立を先に判定し、満杯時だけ得点比較」へ案内する。[ABC349 E公式問題](https://atcoder.jp/contests/abc349/tasks/abc349_e)・[個別公式解説](https://atcoder.jp/contests/abc349/editorial/9780)の終端と最適応答を再照合した。

両単元の公式根拠の再照合日も2026-10-26。小例はUnitのための独自例であり、接続先問題の設定そのものとは区別する。

## 後続の改稿と優先順

全7件に実path・症状・補う説明・公式根拠・検証・依存を記した。各1 Issue＝1
PRで、編集する5問・2単元のpathは相互に重複しない。

| 優先                 | 後続Issue                                               | 編集対象と到達点                                                    |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| 実装を誤らせる添字   | [#319](https://github.com/Fu-L/abc-textbook/issues/319) | ABC364 G：都市番号と端点bitを統一し、初期値から全端点の出力まで接続 |
| 合法状態の取りこぼし | [#321](https://github.com/Fu-L/abc-textbook/issues/321) | ABC379 G：二行にまたがるfrontierと既存の正しい状態数評価を統一      |
| 手順と前提           | [#322](https://github.com/Fu-L/abc-textbook/issues/322) | ABC415 G：逆向きDPの意味、初動を保護した交換、合法tailの開始範囲    |
| 基礎への導線         | [#320](https://github.com/Fu-L/abc-textbook/issues/320) | ABC350 E：行動の選び直しを含む一歩式から自己ループを消去            |
| 基礎への導線         | [#325](https://github.com/Fu-L/abc-textbook/issues/325) | dp-game-value：同じ小例で固定基準と手番側基準を比較                 |
| 前処理込みの評価     | [#324](https://github.com/Fu-L/abc-textbook/issues/324) | linear-recurrence：一歩の行列化、bit累乗、行列作成と適用の費用      |
| 独自の集約法を具体化 | [#323](https://github.com/Fu-L/abc-textbook/issues/323) | ABC338 G：四集計値の初期化・同時更新と演算子直後の意味              |

必須の先行mergeはない。#175のmerge、他分野の全調査、#141・#142の完了を待たず、具体化したものから着手できる。ABC415
Gの交換論とABC338 Gの集約不変条件は各一問に分けた。#160・#163・#167・既存ABC212
Eの担当や他分野へ重複予約しない。#140にも後続7件と残範囲を反映し、7件をGitHub標準のSub-issueに登録した。

共通生成器・reader・rendererが原因という再現は実証していない。本文の添字・状態・説明順の課題を基盤の不具合へ置き換えず、共通基盤Issueや一括再生成を追加しない。

## 一次確認のみの残範囲

上の担当表から予約5問・2単元を除いた**57問・8単元**は、代表と同じ深さの公式再照合・数学監査を済ませていない。次の着眼点を#140の未完了範囲に残す。既にある式・証明を未実装と扱って書き直さない。

| 範囲                                                          | 既存の説明と、次に詳しく確認する着眼点                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 確率・期待値：ABC350 Eを除く22問、dp-stochastic               | 確率伝播・期待費用・観測後の最適化の区別は単元にある。ABC333 Fの隣接row式、ABC412 Fの総数順の方策証明、ABC242 Exの選択数降順、ABC450 Gの相関、ABC299 Exの六残差方程式、ABC270 Exの降順ジャンプも具体化済み。出目と旧状態の対応、法上の可逆性、最大不足量への圧縮が到達可能状態で閉じる理由を小例・公式まで追う。 |
| ゲーム：9問、dp-game                                          | 有限性・不偏性・独立和・XORの証明と誤用条件は単元にある。ABC297 Gのmex二方向、ABC255 Gの値頻度差分、ABC278 Gのmirrorと例外枝もある。手番が局面から復元できる条件、実際の合法手の列挙、対話の応答と終了までを詳細確認する。dp-game-valueの改稿予約はこの9問の予約を意味しない。                                   |
| 遷移高速化：ABC338 Gを除く14問                                | 同値batch、eligible集合、差分費用、二段遷移の集計、対角累積和のclip、倍率0のepoch、affineの基底まで既存の補強がある。ABC282 Gの配る長方形と受け取る長方形の端点、ABC221 Hの反転差分の添字、ABC435 Gの偶奇別イベントと実値化を公式・小例へ接続して確認する。親単元の再改稿は追加しない。                          |
| 固定線形遷移：4問                                             | ABC293 Eの定数1、ABC256 Gのtrace、ABC271 Gの設置直後の分布とTの23時の行、ABC258 Exの相対偶奇とS必須の終端まである。一般Unitの改稿と照合しつつ、円環の閉条件、行/列ベクトル、指数0、確率の法上の分母を詳細確認する。                                                                                              |
| 循環ゲーム：2問、cyclic-minimax-game                          | 単元はOR/AND・未確定の∞・候補のheap確定・0重み・計算量まで具体化済み。ABC413 Fの二番目の隣接値と盤外、ABC261 Exの全出辺待ちがある。手番展開後の辺数と確定時点、無限継続を累積重みの極限と混同しないことを公式まで確認する。                                                                                      |
| frontier：ABC379 Gを除く2問、frontier-profile-dp              | ABC248 Fは局所8通りと係数3,2、ABC296 Exは閉成分の完了flag・未処理必須黒・最終一成分の受理まである。単元のdominoのmask規約、幅1、連結ラベル統合と正規化、到達可能状態数・状態処理費用を実例で詳細確認する。関連ABC309 Gは別担当。                                                                                 |
| Steiner：ABC395 G、steiner-tree-dp                            | subset merge→最短路閉包の順と木の分解は既にある。可変sを一方の集合へだけ含める遷移、tを根として読む共有、密グラフの閉包・前処理・全表保持の費用を小グラフ・公式で再照合する。                                                                                                                                    |
| 巨大容量：ABC310 Ex、eventual-unbounded-knapsack              | 単元の例外上界・復元式、ABC310 Exの局所交換の合法性→停止量→基本列→短いコンボ→密度交換は既に詳しい。これらを欠落と数えず、切り出したゼロ収支列の巡回、コンボ連結、到達不能長、ceilと整数幅を公式・検算まで詳細確認する。                                                                                          |
| 加法的ポテンシャル：ABC249 Ex、additive-expectation-potential | 一色分布の生成、tを平均へ置く理由、一行ごとのO(N²)計算とO(N)空間、終端較正・有限期待時間はある。周辺遷移の対称性と独立性を混同せず、全色和の期待ドリフトを小Nの全状態方程式へつないで詳細確認する。                                                                                                              |
| 数ゲーム：ABC229 H、conway-number-games                       | 数になるL<Rの条件、最も単純な二進有理数の選択、共通分母と符号判定はある。列の操作交換・干渉の全場合、負数のfloor/ceil、分母の上界と和の安全な手を公式・小局面で詳細確認する。関連ABC265 Exの数成分とNim成分の混合は別担当。                                                                                      |

空見出しや分類用の反復を新たな確定不具合として予約したページはない。ただし、英語混在や記法の読みづらさが残る原稿もあり、上の一次確認だけで全ページの文体・表示を保証しない。

## 検証と記法候補の扱い

- `npm run notation:report -- <対象10単元と62問の実path>`：Node.js 26.12.1 / npm
  11.21.1で**72原稿、432候補、明示数式エラー0件**。全候補は`UNDELIMITED_TEX`。431件は「制約との対応」、1件はABC278
  F「考察」の集合差`mask\{i}`だった。コマンドの出現数を独立した表示不具合数へ数えない。
- 制約欄の`\leq`・`\times`等とABC278
  Fの集合差は、後続の各対象で式の意味と範囲を読んで明示数式化する候補に残す。予約5問以外は上の未予約57問の詳細確認に含め、一括置換や候補数0を目的にした改稿はしない。
- 小例は一時的な検算で確認した。ABC350 Eは7,350状態で一歩Bellman式と消去後の値が一致。ABC338
  Gは長さ7以下の合法文字列2,406件で全substring直接評価と一致し、sample1は197。ABC379
  Gは固定盤面の答え1と途中の(2,2)、幅2〜6の二本pathの配色数を確認した。ABC364
  GはK=2の一本の辺とsample1の3,6を確認。ABC415
  Gは小さい二交換の全105組・計7,392件で順向きDP、逆向きDP、有限prefixと合法tailが一致した。これらを一般証明の代用にしない。
- 対象62
  IDの一致・重複なし、homeと既存順、10単元・62問の実path、範囲外の関連15問、full形式と参照元、後続7件の編集pathの重複なしを確認した。検算コード・取得結果・新しい台帳はcommitしない。
- 変更Markdownの書式・ローカルリンクを既存の`.github/actions/nonpublic-docs/check.mjs --files`で確認し、19ローカル参照が通過した。差分は`git diff --check`で確認した。教材・分類・共通表示を変更しない文書PRなので、build・E2Eは実行対象にしない。後続の改稿では公式根拠・本文とclaim、対象のschema/reader検証、本番subpathのbuild・内部リンク・文章と表示を確認する。
