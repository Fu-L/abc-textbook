# 逆順・event・償却・対話・乱択の一次調査（M3）

[調査 #170](https://github.com/Fu-L/abc-textbook/issues/170)、親は[本文改修 #140](https://github.com/Fu-L/abc-textbook/issues/140)。2026-10-23、`9261a2f6`を基準に、**15単元・56問の主要な説明と記法を一次確認し、8問・3単元を8件の後続改稿Issueへ割り当てた**。この文書PRでは教材本文・分類JSON・共通表示を変更していない。調査の完了と教材改稿の完了は別である。

[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)、[full](../../.agents/skills/abc-explanation-author/templates/full-explanation.md)・[短縮形式](../../.agents/skills/abc-explanation-author/templates/abbreviated-explanation.md)を基準に、観察から手順を選ぶ理由、定義、正当性、境界、全体計算量を読んだ。短さや検索候補数だけを不具合としない。

## 対象範囲と確認の深さ

単元は `src/content/docs/learn/modeling/` 以下。問題は `src/content/docs/problems/`
配下で各IDと同名のMarkdownを一意に確認した。下表は正本の `directProblemIds`
の既存順で、担当範囲の照合用である。難易度順や所属を再計算していない。

| 単元                                                                                                                 | 主配置の対象Problem ID                                                                                                                                                              | 件数 |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: |
| [reverse-offline.md](../../src/content/docs/learn/modeling/reverse-offline.md)                                       | `abc229-e`、`abc346-e`、`abc464-e`、`abc264-e`、`abc392-f`、`abc329-e`、`abc375-f`、`abc253-f`、`abc249-f`、`abc238-ex`                                                             |   10 |
| [event-sweep.md](../../src/content/docs/learn/modeling/event-sweep.md)                                               | `abc320-e`、`abc363-e`、`abc453-e`、`abc231-f`、`abc309-f`、`abc327-f`、`abc283-f`、`abc449-e`、`abc449-f`、`abc368-e`、`abc346-g`、`abc311-g`、`abc274-f`、`abc360-f`、`abc266-ex` |   15 |
| [decomposition-amortization.md](../../src/content/docs/learn/modeling/decomposition-amortization.md)                 | なし                                                                                                                                                                                |    0 |
| [amortized-monotone-progress.md](../../src/content/docs/learn/modeling/amortized-monotone-progress.md)               | `abc217-e`、`abc302-e`、`abc403-e`、`abc368-g`、`abc466-f`、`abc428-f`、`abc256-ex`                                                                                                 |    7 |
| [small-to-large.md](../../src/content/docs/learn/modeling/small-to-large.md)                                         | `abc329-f`、`abc411-f`、`abc454-g`、`abc324-g`                                                                                                                                      |    4 |
| [threshold-heavy-light.md](../../src/content/docs/learn/modeling/threshold-heavy-light.md)                           | `abc335-f`、`abc350-g`、`abc219-g`、`abc365-g`、`abc259-ex`                                                                                                                         |    5 |
| [parallel-binary-search.md](../../src/content/docs/learn/modeling/parallel-binary-search.md)                         | `abc394-g`、`abc233-ex`                                                                                                                                                             |    2 |
| [change-impact-localization.md](../../src/content/docs/learn/modeling/change-impact-localization.md)                 | `abc279-e`、`abc218-f`                                                                                                                                                              |    2 |
| [game-parity-invariant.md](../../src/content/docs/learn/modeling/game-parity-invariant.md)                           | `abc398-e`、`abc398-g`                                                                                                                                                              |    2 |
| [interactive-protocol.md](../../src/content/docs/learn/modeling/interactive-protocol.md)                             | なし                                                                                                                                                                                |    0 |
| [information-theoretic-query-design.md](../../src/content/docs/learn/modeling/information-theoretic-query-design.md) | `abc337-e`                                                                                                                                                                          |    1 |
| [randomized-algorithms.md](../../src/content/docs/learn/modeling/randomized-algorithms.md)                           | `abc422-e`、`abc272-g`                                                                                                                                                              |    2 |
| [randomized-algebraic-fingerprint.md](../../src/content/docs/learn/modeling/randomized-algebraic-fingerprint.md)     | `abc367-f`、`abc339-f`、`abc238-g`、`abc455-g`                                                                                                                                      |    4 |
| [kinetic-order-maintenance.md](../../src/content/docs/learn/modeling/kinetic-order-maintenance.md)                   | `abc344-g`                                                                                                                                                                          |    1 |
| [xor-threshold-matching.md](../../src/content/docs/learn/modeling/xor-threshold-matching.md)                         | `abc304-g`                                                                                                                                                                          |    1 |

全71原稿の主要な説明を一次確認した。以下の**5問を公式問題文・個別公式解説まで詳しく再照合**した：ABC392
F・ABC360 F・ABC256 Ex・ABC367 F・ABC339
F。単元は後述の償却の親・単調進行・対話protocolの3件を詳しく診断した。**残る51問・12単元は一次確認のみ**で、全論証・実装・表示を確認済みとはしない。51問には追加予約したABC253
F・ABC249 F・ABC365 Gの3問を含む。

56問は全て `full` で、短縮形式・参照元fullへの依存はなかった。正当性節と同居するcorrectness
claimは全56問で空白正規化後に一致した。これは本文とclaimの同期確認であり、正しさや説明の十分性を保証しない。

関連問題のうち別担当の59問は、考察・正当性の要点と単元での役割を接続確認として読んだ。例えばABC224
Eの同値batch、ABC255 Exの区間生成数、ABC305 Fの対話DFS、ABC257
Exの同時交差は照合先である。全節・公式根拠・表示の詳細監査や改稿予約はしていない。初期改稿・M1・M2、改稿済みの#121との編集対象の重複はない。

## 公式根拠まで再照合した代表5問

以下の公式問題文・個別公式解説は2026-10-23に再確認した。診断と補う論証は本調査の判断である。公式解説の簡潔さ自体を誤りとするものではない。

### ABC392 F：順位が存在することと、最終位置になることを結ぶ

[abc392-f](../../src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-002/abc392-f.md)の「考察」は「現在空いているP_i番目の枠が要素iの最終位置」と述べる。「正当性」は空きがi個だから順位が存在すると説明するが、挿入位置と最終枠の対応が省かれている。

後から挿入した値i+1..Nを最終列から取り除くと、残る値1..iの相対順はi回目直後の列と一致する。従ってiの順位P_iは、未確定枠を左から数えた順位である。例えばP=(1,1,2,1)なら、逆に4を枠1、3を残る枠の2番目である枠3、2を枠2、1を枠4へ入れ、最終列は(4,2,3,1)になる。

Fenwick
kthも名前だけでなく、読み飛ばしたprefixと残り順位を定義し、木の区間個数が残り順位未満なら飛ばせることを説明する。prefix和を外側から二分探索する O(log²N) と、木の内部を降りる O(log
N) の差までつなぐ。

[公式問題](https://atcoder.jp/contests/abc392/tasks/abc392_f)・[個別公式解説](https://atcoder.jp/contests/abc392/editorial/12145)。[改稿 #241](https://github.com/Fu-L/abc-textbook/issues/241)。

### ABC360 F：「端点の直前・直後など」を実装可能な領域へする

[abc360-f](../../src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc360-f.md)の「考察」「正当性」は二長方形・区間加算・最左argmaxを述べるが、圧縮候補は「など」で終わる。どの座標集合で全候補と辞書順最小性を保つかが未確定である。

座標上限をU=10^9とすると、一入力区間の二領域は次の整数閉長方形になる。

- [L_i+1,R_i−1] × [R_i+1,U]
- [0,L_i−1] × [L_i+1,R_i−1]

例えば[1,4]なら[2,3]×[5,U]と{0}×[2,3]。空領域を捨てれば両者でl<rは自動的に成立する。各軸の開始と終了+1を使って半開セルを作り、被覆数が一定のセルでは最小実座標を代表にする理由を示す。lの全差分を適用した後に最小rを読み、最大被覆0の既定解(0,1)とU+1の番兵を別に扱えば復元規約まで定まる。これは既存解法の具体化であり、誤答する反例を確認したという診断ではない。

[公式問題](https://atcoder.jp/contests/abc360/tasks/abc360_f)・[個別公式解説](https://atcoder.jp/contests/abc360/editorial/10323)。[改稿 #237](https://github.com/Fu-L/abc-textbook/issues/237)。

### ABC256 Ex：半減する区間が分裂する場合の予算を数える

[abc256-ex](../../src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc256-ex.md)は非零同値区間のsetと遅延木、値の半減を説明する。しかし「一つの生成区間が除算で処理される回数は値の対数回」という説明だけでは、部分更新で区間が分裂したときに課金をどう継ぐか分からない。

初期値と全代入値の上限をU=10^5とし、各正区間の `1+floor(log2(value))`
の総和をpotentialにする案がある。初期量はO(N
log(U+1))。一更新の境界splitは高々二回で、増加量はO(log(U+1))。代入は旧区間の量を捨て、新区間一個の量を足す。各正区間への除算は量を少なくとも1減らす。従って全除算訪問数はO((N+Q)log(U+1))となり、分裂・消滅・再代入を同じ予算で扱える。同値統合も量を増やさない。

setと遅延木の操作費用、代入での大量erase、前処理と和照会も別に数える。各配列要素が何度も大きな値へ戻されることと、一区間への一括代入が新しい予算を少量だけ作ることを区別する。独自の総量証明は一問のPRで扱う。

[公式問題](https://atcoder.jp/contests/abc256/tasks/abc256_h)・[個別公式解説](https://atcoder.jp/contests/abc256/editorial/4113)のset解法。[改稿 #238](https://github.com/Fu-L/abc-textbook/issues/238)。

### ABC367 F：加算hashの成立と全queryの保証を分ける

[abc367-f](../../src/content/docs/problems/hybrid/outcome-compare-algebraic-objects-by-random-fingerprint/outcome-compare-algebraic-objects-by-random-fingerprint-shard-001/abc367-f.md)は多重集合の頻度を加算へ写し、XORでは同値二個が消えることを説明する。一方「十分広いrandom
hash」「必要なら独立hashを複数」のままで、誤り確率がない。注意欄のunsigned加算と素数modは、同じ証明で保証できる方式ではない。

素数p>N、値ごとに独立一様な体元を割り当てるモデルなら、異なる頻度の差に非零係数が一つ残る。他の乱数を固定すると衝突させる値はただ一つなので、一比較は1/p以下。乱数に依存しないQ
query全体はunion
boundでQ/p以下、独立t組ならQ/p^t以下となる。親の乱択代数fingerprint単元には既にこの根拠があるので、本問の上限・整数幅に具体化する。

対してW-bit unsigned加算では、{x,x}と{y,y}の一致条件は2(h_x−h_y)=0 mod
2^W。衝突確率は2^{−(W−1)}で、体上の一様性をそのまま移せない。現原稿が2^{−W}と誤記しているという指摘ではなく、採用モデルと保証の欠落である。

[公式問題](https://atcoder.jp/contests/abc367/tasks/abc367_f)・[個別公式解説](https://atcoder.jp/contests/abc367/editorial/10692)。[改稿 #239](https://github.com/Fu-L/abc-textbook/issues/239)。

### ABC339 F：悪い素数222個から、答え全体の誤り上界へ進む

[abc339-f](../../src/content/docs/problems/hybrid/outcome-compare-algebraic-objects-by-random-fingerprint/outcome-compare-algebraic-objects-by-random-fingerprint-shard-001/abc339-f.md)の「正当性」は、非零整数差が持つ大素因数の個数を説明している。「広い範囲」「極小」の先に必要なのは、素数の抽出方法・候補集合の大きさ・比較総数である。

D=A_iA_j−A_k≠0なら|D|<10^2000。Dを割る10^9以上の相異なる素数がa個あれば10^{9a}≤|D|なのでa≤222。候補素数集合の個数をK、抽出回数をRとすると、独立復元抽出の一偽等式は(222/K)^R以下。distinctを要求する一様非復元抽出では超幾何比を使い、同じ保守的上界へつなげられる。Kの根拠と実際の抽出分布も必要である。

処理するpairはN²個でも、偽等式はN³個まである。frequency mapで比較をまとめたことを根拠にunion
boundをN²へ減らさない。全体のN³(222/K)^RからRを選び、桁走査・tuple照合に加えて素数生成と判定も費用へ含める。重い確率評価を一問に分け、親単元は照合のみとする。

[公式問題](https://atcoder.jp/contests/abc339/tasks/abc339_f)・[個別公式解説](https://atcoder.jp/contests/abc339/editorial/9206)。[改稿 #240](https://github.com/Fu-L/abc-textbook/issues/240)。

## 作成した後続Issueと優先順

優先順は学習への影響の目安で、必須の直列依存ではない。全件に編集path、症状、直す説明、公式根拠、検証、互換性、依存を記した。編集対象8問・3単元は相互に重複しない。

| 優先 | Issue                                                   | 編集対象と焦点                                                         |
| ---- | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| 先行 | [#237](https://github.com/Fu-L/abc-textbook/issues/237) | ABC360 F：二長方形、圧縮セル、辞書順最小解                             |
| 先行 | [#238](https://github.com/Fu-L/abc-textbook/issues/238) | ABC256 Ex：split・代入を含むpotential。一問で扱う                      |
| 先行 | [#239](https://github.com/Fu-L/abc-textbook/issues/239) | ABC367 F：乱数モデル、非零係数、Q比較の誤り                            |
| 先行 | [#240](https://github.com/Fu-L/abc-textbook/issues/240) | ABC339 F：素数抽出、N³のunion bound。一問で扱う                        |
| 続く | [#241](https://github.com/Fu-L/abc-textbook/issues/241) | ABC392 F・ABC253 F・ABC249 F：逆順の順位対応、上書き差分、計算量の境界 |
| 続く | [#242](https://github.com/Fu-L/abc-textbook/issues/242) | ABC365 G：前計算表の初期化・保持費用と閾値                             |
| 続く | [#243](https://github.com/Fu-L/abc-textbook/issues/243) | 償却の親・単調進行の2単元：課金先と総仕事量の小例                      |
| 続く | [#244](https://github.com/Fu-L/abc-textbook/issues/244) | 対話protocolの1単元：送受信・手番・終了の具体例                        |

追加予約3問は一次確認から特定した課題で、代表5問と同じ深さの診断済みとはしない。次の問題・個別解説も2026-10-23に再照合した。

- [abc253-f](../../src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc253-f.md)は
  `x+S_now−S_set`
  と二走査が既にあるが、「最大4×10^5同士」は公式N,M≤2×10^5と食い違う。時間欄は行lastのO(N)初期化を含まず、M=1でのlogの規約も必要。加算5→代入7→加算2なら9という小例と、O(N+M+Q
  log(M+1))等の全体評価へつなぐ。[問題](https://atcoder.jp/contests/abc253/tasks/abc253_f)・[解説](https://atcoder.jp/contests/abc253/editorial/4025)。
- [abc249-f](../../src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc249-f.md)には仮想代入と評価順の補強がある。時間欄のO(N
  log K)はK=0で未定義なので、常時走査とheapの一時サイズまで含むO(N
  log(K+2))等へ整える。[問題](https://atcoder.jp/contests/abc249/tasks/abc249_f)・[解説](https://atcoder.jp/contests/abc249/editorial/3789)。解説はweb
  cache miss後に通常HTTP取得で日本語本文を確認した。
- [abc365-g](../../src/content/docs/problems/hybrid/outcome-balance-heavy-light-threshold/outcome-balance-heavy-light-threshold-shard-001/abc365-g.md)のheavy時計は追える。一方、N人全員の表を作る手順に対し、時間O(T²/C+QC)と空間O(T+Q+NT/C)にはN長配列の初期化・保存や人別listの固定費用がない。T=Mはevent数で、Nとの大小関係はない。dense表ならheavy人数Hを用いて時間O(N+T+Q+H(N+T)+QC)、空間O(N+T+Q+HN)等へ整える。記録のある人だけを圧縮する方式なら、その人数がT/2以下であることと圧縮費用を示す。公式本文のN/Cを転記せず、区間総数からH≤T/(2(C+1))を導く。[問題](https://atcoder.jp/contests/abc365/tasks/abc365_g)・[解説](https://atcoder.jp/contests/abc365/editorial/10584)。

予約単元では既存の説明を保ち、次を補う。

- 償却の親単元は資源の列挙、単調進行単元は「一度追加され一度消える」という一般論に留まり、操作列の小例がない。queue→heapの移動や辺の削除を表で追い、重い一操作と全期間の仕事量を区別する。同じ辺の再追加は別実体であること、log因子・空操作の固定費用まで数える。[ABC217 E解説](https://atcoder.jp/contests/abc217/editorial/2577)・[ABC302 E解説](https://atcoder.jp/contests/abc302/editorial/6410)を接続照合した。両問題本文は改稿しない。
- 対話単元は候補不変量とflushの注意があるが、送る行・読む行・手番を追う例がない。[ABC269 Eの質問応答](https://atcoder.jp/contests/abc269/tasks/abc269_e)、[ABC337 Eの一括符号化](https://atcoder.jp/contests/abc337/tasks/abc337_e)、[ABC398 Eの交互手番](https://atcoder.jp/contests/abc398/tasks/abc398_e)を区別した短い会話例を置く。全問題に同じ終了信号や出力形式を一般化しない。情報量単元には下界・構成・合法性の注意が既にあり、そちらと各問題は照合のみとする。

共通生成器・reader・renderer起因の再現は得ていない。上記の導出不足・評価の不整合は正本にあるので、基盤改修Issueや全件再生成は追加しない。`## 概要`配下の小見出しや主配置0件の案内を、空の本文・欠落問題として数えていない。

## 一次確認のみの残範囲

**未予約は、範囲表の56問から予約8問を除く48問、15単元から予約3単元を除く12単元**。下記は次に詳しく読む観点であり、修正必須または品質確認済みという判定ではない。

- 逆順の残り7問：ABC229 E・ABC346 E・ABC464 E・ABC264
  Eは状態対応と集計がある。追加前後の答え、未塗色0、timestamp0、未通電同士の併合を再照合する。ABC329
  Eはwildcardの意味と文字一度の変化への課金、ABC375 Fは旧距離とin-place更新の関係、ABC238
  Exは二空隙と最後の二人の接続を優先して詳しく検算する。
- eventの残り14問：ABC320 E・ABC363 E・ABC453 E・ABC231 F・ABC309 F・ABC327 F・ABC346 G・ABC368
  Eには同時刻・同値・開閉境界の説明がある。同じ内容を再追加せず、初期状態・不変条件と照合する。ABC283
  Fは四象限の式、ABC449 Eはstage終端・最終無限周期、ABC449 Fは被覆長木への接続、ABC311
  Gは高さbucketの初期化費用、ABC274 Fは有理端点のクリップ、ABC266
  Exは同一y内のdominance順と到達不能を詳しく読む。
- 単調進行の残り6問：ABC217 E・ABC302 E・ABC403
  Eは移動・辺の生成・接頭辞登録への課金がある。重複登録と固定費用を確認する。ABC368
  Gの最初の加算と倍増、ABC466 Fの共通終端と余り系列、ABC428 Fのprefix
  blockと二段探索を詳しく読む。ABC466 F・ABC428 Fには具体的な補強があり、一律改稿を予約しない。
- small-to-largeの4問：ABC329 Fには重複消滅への課金、ABC411 Fには次数減少を含む対数potential、ABC454
  Gにはlight edge半減、ABC324
  Gには分割時の半減がある。既存の補強を削らず、容器の所有権、反転・削除、rank取得の実装、巨大Nでの配列とstackまで詳細確認する。
- 閾値の残り4問：ABC335 F・ABC350 G・ABC219 G・ABC259
  Exには二手法の総量評価がある。剰余bucketの自己参照、online復号とblock再構築、M=0の基底、長さ0の経路を、境界と全費用まで再確認する。
- 並列二分探索の2問：ABC394 Gは同一cellでの閾値、初期lo/hi、mid降順とedge追加の対応。ABC233
  Exは二つのprefix
  event、開閉のtie順、各roundの座標圧縮と初期化を詳しく確認する。単元には番兵とround手順が既にある。
- 局所化の2問：ABC279 Eは交換されるlabelと最終位置の対応、ABC218
  Fは最短路の存続と上下界がある。単元には改善方向の変更の反例まであり、独立変更と累積変更の違いを保つ。
- 偶奇の2問と情報量の1問：ABC398 Eは合法手が独立という根拠と通信終了、ABC398
  GはEE/OO/EO/Iの全合法手と勝敗の帰納、ABC337
  Eは全0符号とbit順・配布形式を詳細確認する。戦略と情報量の説明は既にあり、一律に書き直さない。
- 乱択候補生成の2問：ABC422 E・ABC272
  Gは多数派からの二点抽出と厳密認証がある。非復元二点の確率、偶数/奇数N、独立試行と打切りの解釈、約数候補の検証費用を詳しく確認する。
- fingerprintの残り2問：ABC238 Gには三周期のprefix位相とQ/2^64、ABC455
  Gには集合変更時の再構築・独立2指紋・全候補のunion
  boundがある。位相更新と係数、許容左端範囲の互いに素性を詳細検算する。
- kinetic・XOR matchingの各1問：ABC344 Gは同時交差の再登録まで説明済みで、event
  heapの実容量・生成queryの費用を確認する。ABC304
  Gにはf/g・交換・二集合の表があり、独自の最大性証明と中央値の必要組数を全matching列挙で詳しく検算する。

未予約12単元は、逆順・event・small-to-large・閾値・並列二分探索・局所化・偶奇・情報量・乱択・fingerprint・kinetic・XOR
matchingである。操作、不変条件、成立条件に相当の説明があり、今回は具体化した3単元以外へ改稿を一律に課さない。数値例や基本から発展への段差、問題との一致、数式の表示を後続の詳細確認に残す。残範囲を巨大な改稿Issueにまとめない。

## 検証と限界

対象pathの存在・一意性、15単元の主配置56件と#170の固定集合、関連参照、後続8件の編集対象の範囲と重複を照合した。notation
reportは**71原稿、573候補、明示数式エラー0件**。候補は56問にあり、15単元にはなかった。制約欄の未区切りTeXに加え、本文の式も含む。573件を表示不具合数とせず、候補がないことも品質保証としない。改稿時に意味と区切りを確認する。

調査用の独立した短い検算では、ABC392 FのN≤8の全46,233挿入列、ABC360
Fの上限6・1〜3区間の1,561組で、素朴処理と提案する対応・圧縮候補の答えが一致した。ABC367
Fの係数2の例は素数5/7/11と3-bit環で全乱数割当てを確認した。ABC256 ExのpotentialとABC339
Fの確率上界は上記の論証を確認したが、掲載実装・全制約での検証は後続に残る。

```sh
# 範囲表の15単元と56問の実pathを渡す。
npm run notation:report -- <対象Markdownの実path...>
npm run verify:fast -- --base origin/main
```

Node 26.12.1 / npm 11.21.1でnotation reportと
`verify:fast -- --base origin/main`が成功した。変更文書の書式・相対リンク26件・見出しと対象範囲を確認した。公開本文を変更しない文書PRなのでbuild・E2E・全教材の数学監査は実施対象外。後続では各Issueの公式再照合、本文とclaim、既存schema/reader、本番subpathのbuild・内部リンク・対象の文章と表示を確認する。

後続8件は#140へ関連付け、改稿8問・3単元と未予約48問・12単元の詳細確認を親Epicの未完了範囲に残す。一次確認のみの51問・12単元を「修正不要」「品質確認済み」と扱わず、調査#170の完了だけで#140を閉じない。
