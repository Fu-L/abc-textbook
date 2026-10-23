# 累積集約・候補管理・区間monoidの一次調査（Q1）

[調査 #171](https://github.com/Fu-L/abc-textbook/issues/171)、親は[本文改修 #140](https://github.com/Fu-L/abc-textbook/issues/140)。2026-10-23、`9aad4d83`を基準に、**9単元・51問の主要な説明と記法を一次確認し、7問・1単元を8件の後続改稿Issueへ割り当てた**。このPRの変更は調査文書のみで、教材本文・分類JSON・共通表示は変更していない。調査完了と教材改稿完了を区別する。

[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)、[full](../../.agents/skills/abc-explanation-author/templates/full-explanation.md)・[短縮形式](../../.agents/skills/abc-explanation-author/templates/abbreviated-explanation.md)を基準に、何を保持するか、候補を消せる理由、式の導出、単位元・結合則・順序、境界と全体計算量を読んだ。典型名を覚えるだけでなく、未知問で必要な要約を作り直せる説明を目指す。

## 範囲と確認の深さ

単元は`src/content/docs/learn/query/`以下。問題原稿は`src/content/docs/problems/`以下の各IDと同名のMarkdownを一意に確認した。以下のIDはhome
Unitの`directProblemIds`の既存順であり、担当範囲の照合用である。難易度順・配置を再計算していない。

| 対象単元                                                                                    | この単元に主配置された対象Problem ID                                                                       | 件数 |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---: |
| [index.md](../../src/content/docs/learn/query/index.md)                                     | なし                                                                                                       |    0 |
| [prefix-aggregate.md](../../src/content/docs/learn/query/prefix-aggregate.md)               | `abc441-e`、`abc278-e`、`abc341-e`、`abc430-f`、`abc410-f`、`abc465-f`、`abc268-e`、`abc454-f`、`abc260-g` |    9 |
| [linked-list-index.md](../../src/content/docs/learn/query/linked-list-index.md)             | `abc344-e`、`abc421-f`                                                                                     |    2 |
| [ordered-set-heap.md](../../src/content/docs/learn/query/ordered-set-heap.md)               | なし（子のbest-firstは下表）                                                                               |    0 |
| [ordered-set-multiset.md](../../src/content/docs/learn/query/ordered-set-multiset.md)       | `abc330-e`、`abc306-e`、`abc281-e`、`abc308-g`、`abc356-f`、`abc314-g`、`abc431-g`                         |    7 |
| [monotone-stack-queue.md](../../src/content/docs/learn/query/monotone-stack-queue.md)       | `abc359-e`、`abc379-f`、`abc228-f`、`abc234-g`、`abc248-ex`                                                |    5 |
| [cartesian-tree.md](../../src/content/docs/learn/query/cartesian-tree.md)                   | `abc435-f`、`abc420-f`                                                                                     |    2 |
| [weighted-prefix-fenwick.md](../../src/content/docs/learn/query/weighted-prefix-fenwick.md) | `abc351-f`、`abc221-e`、`abc276-f`、`abc461-e`、`abc256-f`、`abc287-g`                                     |    6 |
| [monoid-segment-tree.md](../../src/content/docs/learn/query/monoid-segment-tree.md)         | なし（子の区間要約は下表）                                                                                 |    0 |

残る20問のhomeは次の2単元。**この2単元の本文は初期改稿の担当で、今回の9単元に含めず照合のみ**とする。問題本文の担当は#171の固定IDに従う。

| 照合するhome Unit                                                                                       | 担当するProblem ID                                                                                                                                                                   | 件数 |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---: |
| [priority-queue-best-first.md](../../src/content/docs/learn/query/priority-queue-best-first.md)（#161） | `abc384-e`、`abc331-e`、`abc305-e`、`abc409-f`、`abc440-e`                                                                                                                           |    5 |
| [range-monoid-aggregation.md](../../src/content/docs/learn/query/range-monoid-aggregation.md)（#162）   | `abc432-e`、`abc343-f`、`abc223-f`、`abc415-f`、`abc424-f`、`abc285-f`、`abc429-f`、`abc460-f`、`abc440-f`、`abc292-ex`、`abc447-g`、`abc418-f`、`abc365-f`、`abc246-ex`、`abc434-g` |   15 |

全60原稿の主要な説明・記法を一次確認した。そのうち、後述の**ABC314 G・ABC359 E・ABC430 F・ABC460
F・ABC256
Fの5問を公式問題文・個別公式解説と再照合して詳しく診断**した。単元は区間分解・合成の親1件を読書順と小例まで診断した。残る46問・8単元は一次確認のみで、全論証・実装・表示の品質確認済みではない。46問には追加予約したABC308
G・ABC306 Eを含む。

51問の`authoringUnit.kind`は全て`full`で、短縮形式・参照元fullへの依存はない。全51問の正当性節と同居するcorrectness
claimは空白正規化後に一致した。これは同期の確認で、数学的正しさや説明の十分性を保証しない。

対象9単元の関連先にある別担当109問は、考察冒頭・正当性の要点を接続確認として読んだ。ABC213
FのLCP最小値和、ABC218 Hのheap縮約とlink、ABC275 ExのCartesian tree、ABC423
Eの三つの静的moment、ABC265 G・ABC322 F・ABC357
Fの要約と作用などを、主配置の手法と区別した。全節・公式根拠・表示の詳細監査や重複した改稿予約はしていない。ABC297
E・ABC391 F・ABC331 F、および#161・#162の既存改稿は照合のみ。ABC331 Fは#165の担当を維持する。

## 代表5問の詳しい診断

以下の公式問題文・個別公式解説は2026-10-23に再照合した。診断と補足する論証は本調査の判断であり、公式解説の簡潔さそのものを誤りとはしない。

### ABC314 G：和と順序だけでは最大個数にならない

[abc314-g](../../src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc314-g.md)の「考察」は、未所持側Tについて`sum(T)<H`かつ`max(T)≤min(S)`なら個数最大とする。しかし、`C=(1,2,3), H=5, T={1}, S={2,3}`は両条件を満たしても2を追加できる。必要なのはさらに、**Sが空、または次の最小値を追加すると和がH以上になる**という最大性条件である。

末尾の手順には「戻せる間は戻す」が既にある。これを削るのではなく、順序・生存・最大性の三条件を更新後に同時に満たす規則として説明する。境界交換の前後に和判定を置く意味を明確にし、単に「正規化する」と済ませない。

定数回の移動も理由を補う。一種類の被害だけが増えるため、最適な未所持個数は増えない。一方、更新前の最適集合から変えた一種類を除けば残りは依然選べるので、新しい個数は元の個数か一つ少ない個数である。一つのkeyの順位移動とこの個数変化を組み合わせ、具体的な更新規則の費用を示す。`sum=H`では倒せないこと、未登場typeの0、重複keyとID、全Kへの逆引きも接続する。

[公式問題](https://atcoder.jp/contests/abc314/tasks/abc314_g)・[個別公式解説](https://atcoder.jp/contests/abc314/editorial/6952)。[改稿 #255](https://github.com/Fu-L/abc-textbook/issues/255)。

### ABC359 E：水量からsuffix最大値へ進む根拠を残す

[abc359-e](../../src/content/docs/problems/data-structures/outcome-prune-dominated-candidates-once/outcome-prune-dominated-candidates-once-shard-001/abc359-e.md)の「考察」冒頭は、次の容器へ水が届く直前の水量がsuffix最大値だと述べる。「正当性」はその後のblock
stackを証明しており、水の逐次伝播からこの形を得る説明がない。**既存のstackによる計算式の誤りではない**。

まず水量を`A_0,…,A_N`、板を`H_1,…,H_N`と定義する。操作後の`A_{i−1}≤max(H_i,A_i)`という不変条件と、一杯の追加が最初の未充足位置まで進むことを説明する。`A_n`へ初めて水が届く直前は、`0≤i<n`で`A_i=max(H_{i+1},…,H_n)`。添字0の水量も総和に入るため、保存される総水量と次の一杯から`1+Σ_{j=1}^n max(H_j,…,H_n)`を得る。

例えば`H=(2,1)`なら、二つ目の容器へ届く直前の水量は`(2,1,0)`で初到達は4回目。この状態と、高さ・個数のblockが何を圧縮しているかを対応させる。既存の同高併合・64bit・各block一度の償却は保つ。

[公式問題](https://atcoder.jp/contests/abc359/tasks/abc359_e)・[個別公式解説](https://atcoder.jp/contests/abc359/editorial/10262)。[改稿 #256](https://github.com/Fu-L/abc-textbook/issues/256)。

### ABC430 F：区間の両端と、内部の実現可能性を分ける

[abc430-f](../../src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc430-f.md)の「正当性」は四つのrunから順位の両端を求めた後、「外側の列はiの左右どちらへも挿入できる」として内部の全順位を実現する。**両端が分かっただけでは穴がないことは示せず**、外側の数を制約を無視して独立に置けると誤解しやすい。

iは位置でなく整数のラベルであることを先に明示する。L/Rを先行関係の有向pathと見て、iの前後が強制される要素をrunから数える。その後、外側の列の内部順序を保ってmergeする公式の構成を小例で説明し、任意個数を左右へ振り分けても境界の制約を守れることを示す。別の線形拡張の論証を採用する場合も、最小・最大順位の間を一段ずつ埋められる根拠まで必要である。

`S=RL`ではラベル1・3が順位1/2、ラベル2が順位3を取る。この集合を順位別の個数`(2,2,1)`へ変える最後の差分処理までつなぐ。重い論証を他問と束ねず1問のIssueにした。

[公式問題](https://atcoder.jp/contests/abc430/tasks/abc430_f)・[個別公式解説](https://atcoder.jp/contests/abc430/editorial/14331)。[改稿 #257](https://github.com/Fu-L/abc-textbook/issues/257)。

### ABC460 F：直径の両端が外部点にも十分な理由

[abc460-f](../../src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc460-f.md)の「正当性」は、任意の外部点からの最遠候補が集合の直径両端にある補題を結論として使う。木全体の直径と似ているというだけで、任意の頂点subsetへ適用した理由は説明されていない。

集合Uの直径端をa,bとし、wからpath
a–bへ下ろした位置をpとする。wの枝の長さはpからa,bの距離の両方以下である（超えると直径より長い対を作る）。外部点xの射影qがpのどちら側にあるかで、反対側の直径端までの距離がx–w以上となることを示せる。この補題を二集合へ二回適用すると、左右の四端点だけでunionの直径を決められる。

「実装上の注意」の黒0/1個の出力規約は具体化する。**公式入力では全体の黒頂点は常に2個以上**だが、木の内部nodeは空・一点になり得る。空なら相手を返し、一点なら`(v,v)`でよい。根の新たな出力規約は作らない。同率の代表端点が異なっても距離と次のmergeに十分なことと、端点tuple自体の一致を混同しない。LCA呼出しを含む既存の二方式の計算量は保つ。

[公式問題](https://atcoder.jp/contests/abc460/tasks/abc460_f)・[個別公式解説](https://atcoder.jp/contests/abc460/editorial/21029)。[改稿 #258](https://github.com/Fu-L/abc-textbook/issues/258)。

### ABC256 F：三角数から三本のmomentを導く

[abc256-f](../../src/content/docs/problems/data-structures/outcome-maintain-weighted-prefix-statistics/outcome-maintain-weighted-prefix-statistics-shard-001/abc256-f.md)の「考察」は係数`(x−i+1)(x−i+2)/2`を示し、「正当性」は二項係数として数えると要約する。係数・展開式・更新手順はあるので、欠落を全文の雛形で置き換えない。

固定した`A_i`が`C_t`へ`t−i+1`回寄与するため、`D_x`への係数は`Σ_{t=i}^x(t−i+1)`となる、と一段入れる。`A=(1,2,3)`では`D_3=6A_1+3A_2+A_3=15`。係数をiの二次式へ展開してから、iの0/1/2次で重み付けしたprefix和を三本持つ理由へ進む。

時間欄の`O(N+Q log N)`も採用する構築法と合わせる。通常の点addで全初期値を入れるなら前処理は`O(N log N)`、線形構築ならその方法を明記する。代入の負差分・法上の逆元2・乗算の整数幅を保ち、公式の短い展開式をそのまま導出の代用にしない。

[公式問題](https://atcoder.jp/contests/abc256/tasks/abc256_f)・[個別公式解説](https://atcoder.jp/contests/abc256/editorial/4131)。[改稿 #259](https://github.com/Fu-L/abc-textbook/issues/259)。

## 優先順と後続の担当

以下は学習への影響による着手の推奨順であり、問題の掲載順や必須merge順ではない。各Issueに実path・症状・直す説明・公式出典・検算・既存の検証と互換性を記した。全調査の終了を待つ依存はない。

| 優先 | 後続Issue                                               | 編集する本文と到達点                                                   |
| ---- | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| 先行 | [#255](https://github.com/Fu-L/abc-textbook/issues/255) | ABC314 G。最大性の不変条件と、一種類の増加で境界移動が定数回になる理由 |
| 先行 | [#262](https://github.com/Fu-L/abc-textbook/issues/262) | `monoid-segment-tree.md`。非可換な区間取得のL/Rとpaddingを小例で追う   |
| 次   | [#256](https://github.com/Fu-L/abc-textbook/issues/256) | ABC359 E。水の不変条件から総水量・suffix最大値和への導出               |
| 次   | [#257](https://github.com/Fu-L/abc-textbook/issues/257) | ABC430 F。可能順位区間の内部まで実現する構成                           |
| 次   | [#258](https://github.com/Fu-L/abc-textbook/issues/258) | ABC460 F。四端点の十分性の補題と空・一点の内部node                     |
| 続く | [#259](https://github.com/Fu-L/abc-textbook/issues/259) | ABC256 F。三重和の係数・三moment・初期化費用の接続                     |
| 続く | [#260](https://github.com/Fu-L/abc-textbook/issues/260) | ABC308 G。最高相違bitの既存の核から隣接候補の完全性へ                  |
| 続く | [#261](https://github.com/Fu-L/abc-textbook/issues/261) | ABC306 E。二集合の挿入・一個削除・balance・和の同期を具体化            |

ABC308
Gには「問題固有の要素」に最高相違bitの説明の核がある。「証明がない」とはせず、中間値の共通上位prefixと、非隣接対を最小候補から除ける理由を考察・正当性へつなぐ。[公式問題](https://atcoder.jp/contests/abc308/tasks/abc308_g)・[個別公式解説](https://atcoder.jp/contests/abc308/editorial/6707)も同日に再照合した。

ABC306
Eはサイズ・順序の不変条件がある一方、更新を「境界要素を移してbalance」と要約する。新値の追加先、サイズ回復だけでは残る順序逆転、旧値一個の削除、集合間移動時の和を手順にする。初期の0の配置は既に「問題固有の要素」にあるので残す。時間欄の線形初期化は構築方式と照合する。[公式問題](https://atcoder.jp/contests/abc306/tasks/abc306_e)・[個別公式解説](https://atcoder.jp/contests/abc306/editorial/6607)も同日に再照合した。追加2問は代表5問と同じ深さで更新列を検証済みとはしない。

親Unitは葉・padding・二累積L/Rの具体的な手順が既にある。足りないのは順序付きfoldを手で追う小例と、結合則が変えてよいのは括る位置だけであるという導入である。非2冪長の文字列連結などで、Lは後ろへ、Rは前へ足す過程を見せる。文字列を実際に保持する実装の演算費用を定数とはしない。子の要約設計は#162の既存改稿を参照し、親から重複再掲しない。接続先ABC223
Fの[公式問題](https://atcoder.jp/contests/abc223/tasks/abc223_f)・[個別公式解説](https://atcoder.jp/contests/abc223/editorial/2774)も同日に再照合した。問題本文・子Unitは#262の編集対象外。

空見出し、分類文の反復、未区切りTeXの症状を同一視しない。9単元の主要節に空見出しは見つからず、概要直下の小見出しも内容がある。問題一覧の分類文は原稿に多いが、共通表示が既に整理する部分なので、それだけで新しい基盤Issueを作らない。今回、reader・renderer・共通生成器の不具合として再現したものはない。

## 一次確認にとどまる範囲と次の読み方

**未予約の44問は範囲表の51問から予約7問を除いた集合**。全44問へ一律の改稿を課すのではなく、既存の説明を保ちながら次の観点で詳細確認する。記法候補の少なさや文章量だけで修正不要としない。

- 累積集約：ABC441 E・ABC278 E・ABC341
  Eは端点変換・補集合・境界更新の手順がある。前提案内と使う動的構造の役割まで再照合する。ABC410
  Fは触れた頻度だけの消去、短辺と全test面積の評価を保つ。ABC465
  Fは十進各軸の昇順累積と二進部分集合zetaを混同しない補強、ABC268 Eは奇偶・二倍展開、ABC454
  Fは減少側の個数と輸送、ABC260
  Gは斜め伝播と余白の具体式がある。これらを雛形に戻さず、式・整数幅・境界と全体費用を公式根拠・小例で確かめる。
- 局所linkと候補heap：ABC344 Eは四linkと番兵、ABC421
  Fは両端から同速に進む費用と末尾停止まで説明済み。ABC384
  Eは厳密不等号・128bit相当の比較・最終集合の最適性、ABC331 Eは降順列mergeと禁止数の上界、ABC305
  Eは最大残り体力、ABC409 Fは同距離batch、ABC440
  Eは一意親と二子まである。残る課題は無条件の全文改稿ではなく、候補の登録・失効・多重度と列挙量の詳細照合である。
- 順序集合：ABC330 Eの欠損集合、ABC281 Eの挿入先と窓移動、ABC356 Fのinactive葉と切断edge、ABC431
  Gの同値swapの多重度は具体化されている。ABC356 Fの木上境界探索、ABC431
  Gの値と位置の二段の順位選択は、手順どおりの実装と費用を詳しく検算する余地がある。
- 単調stackとCartesian tree：ABC379 Fはquery前に更新しない理由、ABC228
  Fは正値と白長方形の切詰め、ABC234 Gは二stackの重み・初期値・擬似コードまである。ABC248
  Exは有効左端の非負slackと最小K+1個の要約、ABC420 Fは同高の担当と台形分布、ABC435
  Fは極大到達区間と二子の支配を説明している。後者の長い独自論証は既に存在し、詳細確認や修正が必要なら別の1問Issueへ分ける。
- 重み付きprefix：ABC351 F・ABC221 E・ABC276
  Fは寄与を二つの統計や左右端の重みへ分ける説明がある。ABC461 Eは初回行と最新時刻のdistinct、ABC287
  Gはquotaの境界bucketと木上順位探索を重点に再照合する。通常のprefix二分探索を木上探索と取り違えてlog因子を落とさない。
- 区間要約：ABC432 E・ABC343 F・ABC223 F・ABC415 F・ABC424 F・ABC285
  Fには三領域・distinct上位二値・括弧prefix・runの境界・端点列・文字blockの判定がある。ABC429
  Fの三行で左戻りを除く証明、ABC440 Fの適合集合を実現する構成、ABC292 Exの非空prefix、ABC447
  Gのtop4とイベント復元、ABC418 Fの短区間行列、ABC365 Fのclamp合成、ABC246 Exの重複除去、ABC434
  Gの子探索を使う要約補完も既存の補強を保つ。全状態・全入力で検証済みとはせず、特にABC434
  Gは単純な自己完結monoidと区別して部分値探索の仕事量・大きいNのメモリを詳しく読む。

一次確認のみの8単元は、章index、prefix、link、heapの入口、multiset、単調stack/queue、Cartesian
tree、Fenwick。章index・heapは構造を選ぶ入口として読み、無理に個別解法を増やさない。prefixの2D包除、linkの番兵と辞書費用、multisetの二集合更新、stackの支配・同値・範囲外削除、Cartesian
treeの全順序と最悪高さ、Fenwickのlowbit・二本の重み付き和は既に説明がある。今後は小例の必要性と問題への接続を詳細確認するが、今回の改稿予約はしない。

## 検証と限界

pathの存在・一意性、9単元と照合用2単元の主配置集合（除外3問を除いて51問）、一覧の既存順、後続Issueの編集対象の重複・範囲を照合した。記法報告は**60原稿に512候補、明示数式エラー0件**。候補は全て`UNDELIMITED_TEX`で51問題にあり、9単元にはない。多くは制約のTeXで、本文の添字・冪・式にもある。512件の表示不具合や、51問の修正必須という意味ではない。

```sh
# Node 26.12.1。範囲表の9単元・51問の実pathを渡す。
npm run notation:report -- <対象Markdownの実path...>
npm run verify:fast -- --base origin/main
```

最初のnotation CLIはsandbox内のtsx
IPC作成で失敗したため、同じ検査本体を`node --import tsx scripts/validate/document-notation.ts <実path...>`で実行して上記結果を得た。候補は文脈で読み、自動置換しない。

調査中の独立した小検算では、ABC359 Eの長さ1..5・高さ1..3の363列を逐次操作と式で比較、ABC430
FはN=2..7の全順列をL/R別に分類した768個のラベル別順位集合を区間式と比較した。ABC256
Fは長さ1..8・値0..2の9,840列の全prefixを三回の愚直累積と係数式で比較。ABC460
FはN=2..6で各頂点が小番号の親を持つ木の全非空subsetについて、全ての直径端点と外部点の127,370比較が一致した。ABC314
Gは一種類の正の増加後に最大未所持数がkまたはk−1となる172,044ケース、ABC308
Gは0..63の全distinct三つ組41,664組の不等式も確認した。有限検算は一般の証明・改稿後の実装検証の代用にはしない。

既存のverify:fast本体も`node --import tsx scripts/verify/fast.ts --base origin/main`で実行し、文書のみの検証が選ばれた。変更Markdownの書式、相対参照19件、対象範囲・主配置順・後続8件の重複なし、`git diff --check`を確認した。後続Issueから調査元への参照と、#140の未完了一覧へのリンクも反映した。

公開本文を変更しない文書PRなのでbuild・E2E・全教材の数学監査は実施対象外。後続PRでは各Issueに記した公式再照合・本文とclaim・既存schema/reader・本番subpathのbuild/内部リンク・対象の文章と表示を確認する。8件の改稿と未詳細確認範囲は#140の未完了として残す。
