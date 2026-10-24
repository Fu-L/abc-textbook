# 区間作用・静的／動的索引・永続化の一次調査（Q2）

[調査 #172](https://github.com/Fu-L/abc-textbook/issues/172)、親は[本文改修 #140](https://github.com/Fu-L/abc-textbook/issues/140)。2026-10-24、main
`49eb3559` の
**19単元・40問を一次確認し、5問・3単元の改稿を7件へ分けた**。このPRは調査文書だけを追加する。調査の完了を教材改稿の完了とは数えない。

[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)、[full](../../.agents/skills/abc-explanation-author/templates/full-explanation.md)・[短縮形式](../../.agents/skills/abc-explanation-author/templates/abbreviated-explanation.md)を基準に、作用の時間順と可逆性、索引の構築・取得、履歴の復元・共有、前処理と保持領域を読んだ。目指すのはデータ構造の操作名を覚える文章ではなく、未知問で必要な要約と操作を作り直せる文章である。

## 範囲と確認の深さ

単元は `src/content/docs/learn/query/` 以下。問題は `src/content/docs/problems/`
以下の各IDと同名のMarkdownを一意に確認した。下表は各home Unitの `directProblemIds`
の既存順で、所属・順序の照合用である。難易度順を再計算していない。

| 対象単元                                                                                                              | 主配置の対象Problem ID                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [range-actions.md](../../src/content/docs/learn/query/range-actions.md)                                               | `abc340-e`, `abc382-f`, `abc417-f`, `abc455-f`, `abc389-f`, `abc332-f`, `abc357-f`, `abc322-f`, `abc397-f`, `abc426-f`, `abc441-g`, `abc237-g`, `abc371-f`, `abc265-g` |
| [finite-function-composition.md](../../src/content/docs/learn/query/finite-function-composition.md)                   | `abc261-e`                                                                                                                                                             |
| [idempotent-overlap-range-query.md](../../src/content/docs/learn/query/idempotent-overlap-range-query.md)             | `abc282-f`                                                                                                                                                             |
| [swag.md](../../src/content/docs/learn/query/swag.md)                                                                 | `abc456-f`                                                                                                                                                             |
| [segment-tree-canonical-decomposition.md](../../src/content/docs/learn/query/segment-tree-canonical-decomposition.md) | `abc342-g`                                                                                                                                                             |
| [static-sorted-range-index.md](../../src/content/docs/learn/query/static-sorted-range-index.md)                       | `abc339-g`                                                                                                                                                             |
| [dynamic-segment-tree.md](../../src/content/docs/learn/query/dynamic-segment-tree.md)                                 | `abc403-g`                                                                                                                                                             |
| [ordered-interval-partition.md](../../src/content/docs/learn/query/ordered-interval-partition.md)                     | `abc435-e`, `abc380-e`, `abc255-ex`, `abc465-g`                                                                                                                        |
| [value-bucket-aggregation.md](../../src/content/docs/learn/query/value-bucket-aggregation.md)                         | なし（関連先は `abc405-g`）                                                                                                                                            |
| [mo-offline-range.md](../../src/content/docs/learn/query/mo-offline-range.md)                                         | `abc242-g`, `abc293-g`, `abc384-g`, `abc405-g`                                                                                                                         |
| [bitset-word-parallel.md](../../src/content/docs/learn/query/bitset-word-parallel.md)                                 | `abc258-g`, `abc348-f`, `abc221-g`                                                                                                                                     |
| [binary-trie.md](../../src/content/docs/learn/query/binary-trie.md)                                                   | `abc425-g`                                                                                                                                                             |
| [bitwise-minimax-partition.md](../../src/content/docs/learn/query/bitwise-minimax-partition.md)                       | `abc281-f`                                                                                                                                                             |
| [string-hash.md](../../src/content/docs/learn/query/string-hash.md)                                                   | なし（関連先は `abc331-f`）                                                                                                                                            |
| [sequence-fingerprint.md](../../src/content/docs/learn/query/sequence-fingerprint.md)                                 | `abc274-ex`                                                                                                                                                            |
| [persistence-rollback.md](../../src/content/docs/learn/query/persistence-rollback.md)                                 | なし（子はrollback・persistence）                                                                                                                                      |
| [rollback.md](../../src/content/docs/learn/query/rollback.md)                                                         | `abc218-g`, `abc302-ex`, `abc363-g`                                                                                                                                    |
| [persistence.md](../../src/content/docs/learn/query/persistence.md)                                                   | `abc273-e`, `abc453-g`                                                                                                                                                 |
| [segment-tree-beats.md](../../src/content/docs/learn/query/segment-tree-beats.md)                                     | `abc430-g`                                                                                                                                                             |

代表の **ABC371 F・ABC221 G・ABC363 G・ABC357 F・ABC273 E**
は本文・同居claimを詳しく読み、出典の公式問題文・個別公式解説を同日に再照合した。改稿予約した3単元も説明を具体化した。残る
**35問・16単元は一次確認のみ**であり、品質確認済み・修正不要とは扱わない。

対象40問はすべて `full`、`primaryProblemId: null`
だった。短縮形式の参照元不足を理由にする対象はない。範囲外の関連21問も接続を読んだ。ABC248
Ex・ABC256 Ex・ABC262 Ex・ABC327 F・ABC346 G・ABC360 F・ABC450 F、ABC282 Ex・ABC244 Ex・ABC414
G、ABC251 Ex・ABC428 F・ABC449 F、ABC463 G、ABC276 Ex・ABC287 Ex・ABC366 G、ABC252 Ex・ABC254
Ex・ABC451 G、ABC331 Fであり、これらもfullだった。対象内のABC363 G・ABC405 G・ABC430
Gへの関連参照は二重計上しない。関連21問は今回の改稿予約に含めず、特にABC256 Exの既存改稿とABC331
Fの#165を重複Issue化しない。

## 詳しく確認した代表5問

### ABC371 F：変換後の目標と、全用事を通した最適性

「考察」の手順には「G-Tのずれを同じ座標系へ直し」とある一方、直後は「値がGをまたぐ端を探し」「区間全体をGに代入」となる。末尾の注意には目標をG-Tへ変換する説明が既にあるが、主手順で元座標と変換後の目標が混ざる。正当性は一用事の押し出しを述べ、先に余分に動かしておく方法より全用事の総移動量が悪化しない理由へはつながっていない。

人番号を1始まり、変換列を $$Y_i=X_i-i$$、目標を $$g=G-T$$ と分ける。右へ動くときはT以降の
$$Y_i<g$$、左へ動くときはT以前の $$Y_i>g$$ だけを揃えればよい。例えば $$X=(1,3,4)$$、$$T=1,G=3$$
では $$Y=(0,1,1),g=2$$ となり、全員の変換値を2へ揃えて実座標は
$$(3,4,5)$$、費用は4。等号の人は動かさなくてよい。探索条件・半開区間・旧和と長さからの費用をこの記号で一貫させ、必要移動の下界と、その場で必要な人だけ動かす方針の総費用の最適性を別々に補う。公式も座標変換と区間代入・和へ帰着しているが、教材の逐次最適性の説明は補う必要がある。[公式問題](https://atcoder.jp/contests/abc371/tasks/abc371_f)・[個別公式解説](https://atcoder.jp/contests/abc371/editorial/10926)。

### ABC221 G：到達判定から操作列の復元へ

座標変換、二つのtarget、四方向との対応は既にある。省略は「prefix履歴または分割統治で各targetの採否列を復元」の部分である。時間・空間欄はprefix履歴を採用しているため、まずその方式の逆追跡を完成させる。

$$dp_i$$ を先頭i個の到達bitset、復元中の残りを $$t$$ とする。$$i=N$$ から戻り、$$dp_{i-1}[t]$$
が真なら不採用、偽なら $$D_i$$ を採用して $$t\leftarrow t-D_i$$
とする。後者が可能な理由は、$$dp_i[t]$$
が真で、今回を使わない経路がないからである。二targetは履歴を共有して別々に戻す。例えば
$$D=(1,2),P=1,Q=2$$ は採否が $$(1,0)$$ と $$(0,1)$$、方向がU,D、到着点が $$(0,-1)$$
になる。約900MBの履歴は既に注意されているので、$$dp_0$$ とbit
Sを含むword数・一時領域・出力も含めて採用方式と結び付ける。公式の分割統治復元は代替案として区別する。[公式問題](https://atcoder.jp/contests/abc221/tasks/abc221_g)・[個別公式解説](https://atcoder.jp/contests/abc221/editorial/2724)。

### ABC363 G：実行可能性の回復と報酬最適性を分ける

「正当性」の「入れ子の容量制約を持つmatroid」「matroidの交換性」が未定義のまま最適性の根拠になっている。挿入前のslackで最初の0となる
$$t^*$$ を探し、期限が $$t^*$$
以下の最小報酬を交換候補にする説明は既にある。「候補探索がない」と診断して作り直さない。

必要なのは、期限順の割当からslack非負の必要十分性を説明した上で、一回の最小報酬交換で**最適報酬も**維持する根拠をつなぐことである。例えば選択済み仕事が
$$(D,P)=(1,4),(2,7)$$、新仕事が $$(1,6)$$
なら、最初の飽和期限1に属する報酬4の仕事を交換し、総報酬を11から13にできる。報酬3なら棄却する。こうした小例から交換補題を説明するか、公式の費用流の論証への橋を架ける。時間DFSでは旧versionと新versionの有効期間、slack・期限別multiset・最小値木・総報酬の変更と逆順復元まで一つの履歴で追う。公式は時間区間分解・費用流・Hall条件を段階的に導いており、教材のmatroid経由の短縮証明は独自に補う部分として扱う。[公式問題](https://atcoder.jp/contests/abc363/tasks/abc363_g)・[個別公式解説](https://atcoder.jp/contests/abc363/editorial/10451)。

空のslackの初期値、初期N仕事と更新versionの登録、現在生きる履歴を分けて費用を数え、Q=1でも意味を持つ表記へ整える。既存の交換式の誤りを確定したという診断ではない。独自論証が重いため一問だけの改稿にする。

### ABC357 F：更新式から保持量を再発見できる順序にする

「考察」冒頭は `sumAB+y·sumA+x·sumB+len·xy`
という完成した式から始まる。四保持量・mapping・tag加算合成・旧sum使用の注意は既にあり、式が欠けているわけではない。ただし、なぜその補助量を足すのかを読者自身が再現しにくい。「正当性」も更新順と定数時間の説明が中心になっている。

Aだけへの加算で増えるのは $$xB_i$$
だからB和、Bへの加算にはA和、その和の更新には長さが要る、と順に導く。次に $$(A_i+x)(B_i+y)$$
を展開して区間総和を取り、二配列を更新するtagには交差項も必要になる理由を示す。例えば
$$A=(1,2),B=(3,4)$$ の積和11は、Aへ1、続いてBへ2を足すと28になる。合成tag $$(1,2)$$ でも
$$11+2\cdot3+1\cdot7+2\cdot1\cdot2=28$$
となる。旧和を使う理由をこの二操作と対応させ、要約の意味から結合・作用・合成の整合性へ進む。[公式問題](https://atcoder.jp/contests/abc357/tasks/abc357_f)・[個別公式解説](https://atcoder.jp/contests/abc357/editorial/10186)。

### ABC273 E：四操作と保存した版の不変性を一箇所で追う

「考察」はimmutable nodeを作る候補で終わり、DELETE/LOADの式は「正当性」へ分散している。「value
−1のsentinel root」なら空DELETEを分岐なしにできると述べるが、それには `parent[root]=root`
も必要である。未保存ページやrootだけ保存する説明は既にある。

番兵の値・親・currentを初期化し、ADDのnode新設とcurrent移動、DELETEの親移動、SAVEの上書き、LOADの保存rootまたは番兵への移動をまとめる。`ADD 3 → SAVE 1 → ADD 4 → LOAD 1 → ADD 5 → LOAD 1`
なら末尾は
`3,3,4,3,5,3`。4と5のnodeは同じ3のnodeを親に持ち、保存済みの道を書き換えないので再LOADは3に戻る。この小例から共有prefixと不変条件を説明し、hash
mapの期待時間と平衡木の最悪時間、各操作後の出力も保つ。[公式問題](https://atcoder.jp/contests/abc273/tasks/abc273_e)・[個別公式解説](https://atcoder.jp/contests/abc273/editorial/5023)。

## 後続の改稿と優先順

全7件を作成し、#140の標準Sub-issueに登録した。各Issueに編集path、症状、補う説明、公式根拠、検証、依存を記載している。全件1
Issue＝1 PRで、編集対象は相互に重複しない。

| 優先         | 後続Issue                                               | 編集対象と到達点                                                                          |
| ------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 先に         | [#272](https://github.com/Fu-L/abc-textbook/issues/272) | ABC371 F：変換後の目標・左右境界・逐次最適性                                              |
| 先に         | [#273](https://github.com/Fu-L/abc-textbook/issues/273) | ABC221 G：共有bitset履歴から二targetを具体的に復元                                        |
| 独立して着手 | [#274](https://github.com/Fu-L/abc-textbook/issues/274) | ABC363 G：交換最適性と時間DFSの全補助状態の復元。一問で扱う                               |
| 次に         | [#275](https://github.com/Fu-L/abc-textbook/issues/275) | ABC357 F：一要素の展開から四保持量・作用を導く                                            |
| 次に         | [#276](https://github.com/Fu-L/abc-textbook/issues/276) | ABC273 E：四操作と保存後の分岐・番兵の親                                                  |
| 次に         | [#277](https://github.com/Fu-L/abc-textbook/issues/277) | range-actions・finite-function-compositionの2単元：非可換な小例から合成順・非可逆性を読む |
| 次に         | [#278](https://github.com/Fu-L/abc-textbook/issues/278) | persistence-rollbackの親単元：同じ履歴で復元と版保存を比較する                            |

区間作用の単元には準同型の条件、長さ付き和、affine合成、push・部分区間取得が既にある。不足は「なぜ和に長さを足すか」と、加算→代入と代入→加算を手で追う小例である。有限関数の単元にも
`combine(F,G)[x]=G[F[x]]`
と一般には逆写像を使えない注意がある。定数写像と反転を二入力の表で追い、結合則・可換性・可逆性を区別する。接続先の[ABC332 F問題](https://atcoder.jp/contests/abc332/tasks/abc332_f)・[個別公式解説](https://atcoder.jp/contests/abc332/editorial/7890)、[ABC261 E問題](https://atcoder.jp/contests/abc261/tasks/abc261_e)・[個別公式解説](https://atcoder.jp/contests/abc261/editorial/4451)も同日に再照合した。これら二問の本文は#277で編集しない。

保存・復元の親単元は「stack順か、任意の版へ分岐するかで選ぶ」という一段落と、変更記録数・コピー節点数の案内にとどまる。状態AからB、Aから別のCへ進む例で、rollbackはBの変更を戻してCへ進み、永続化は各rootを残す違いを補う。rollbackでもoffline
DFSで分岐を巡れるため、「分岐するなら必ず永続化」とはしない。undoに数学的な逆演算は要らず旧値の記録でもよいこと、同時に生きる履歴と保存全版の領域も区別する。子単元のDSUやpath
copyingの詳細は重複再掲しない。

必須の先行mergeはなく、#172のmergeや他分野の調査完了を待たず着手できる。#140には7件と未予約の35問・16単元の詳細確認を未完了として残す。

## 一次確認にとどまる範囲と次の読み方

**未予約35問は範囲表の40問から代表5問を除いた集合、未予約16単元は19単元から#277の2単元と#278の1単元を除いた集合**である。以下の既存の補強を保ち、必要が具体化した範囲だけ次の改稿にする。

- 区間作用の残り12問：ABC340
  Eには周回の商余分解があるが、最後の各point取得と計算量欄の線形葉展開を実装方式と詳しく照合したい。ABC382
  Fには下からの確定と同じ行の非交差、ABC417 F・ABC332 Fには条件付き期待値と代入／affine作用、ABC455
  Fにはpair寄与と二乗和の展開がある。ABC389
  Fは単調写像の逆像を使うが、管理する初期rating域と値の上限、木上探索の要約・述語を詳しく確かめる。ABC322
  Fは0/1両run、ABC397 Fは直前出現と新しい切れ目の有効化、ABC426
  Fは過大販売の補正と一度だけの除去、ABC441 Gは反転の有無と奇偶、ABC237 Gは二閾値、ABC265
  Gはpair表と多対一写像まで既に説明されている。これらを名前だけの雛形へ戻さず、成立条件・合成順・範囲と全体費用を再照合する。
- 静的索引・窓・動的索引の6問：ABC261
  Eはprefix操作を前回の状態へ再適用する問題設定を明記している。単に新操作を一回適用する問題へ読み替えない。ABC282
  Fは二冪長の登録と重複許容、ABC456 Fは有料休日の間隔・窓外の初期状態・列vector用の積の向き、ABC342
  Gは区間登録と取消ID、ABC339 Gは前回答での復号・upper_bound・prefix和、ABC403
  Gはオンライン値域・局所順位の偶奇・重複葉まである。構築と最終出力も含む費用、heap方式とmultiset方式の点取得の違い、動的木の実node数とメモリを次に詳しく読む。
- 区間集合の4問：ABC435 Eの直前区間・右端確認、ABC255
  Exのsplitと最後の収穫日の式は具体化されている。ABC380
  Eの左右merge・色別個数は全操作と初期set構築の方式を、ABC465
  Gの合同式・円環run・全周への出入りは全状態の検算を今後詳しく行う。後者には既に長い導出があり、独自論証の修正が必要なら一問に分ける。
- Moの4問：ABC242 GとABC293 Gには頻度差分とblock幅、ABC384 Gには反対prefixへの絶対差寄与、ABC405
  Gには逆階乗積と値prefixがある。端点更新の順・全queryのsort・圧縮や階乗の前処理・出力領域まで実装と合わせる。Unitの
  `QB+N²/B` の評価も読む。小さいQで空blockを数える上界と、更新側／取得側の非対称な費用を混同しない。
- bitset・Trie・列指紋の5問：ABC258 Gには三辺による三重計数、ABC348 Fには値maskの初期化費用、ABC281
  Fには最大側だけが残る再帰、ABC425
  Gには全域和とprefix和を同時に返して二重再帰を避ける手順がある。ABC274
  ExにはNim積の二次拡大とtableの底まであるので、単なる「Nim積を使う」へ短縮しない。体構成の参照先、LCPの衝突評価、固定幅の乗法費用は別途詳しく検証する。
- 復元・永続化・Beatsの4問：ABC218 Gにはpath中央値と手番、ABC302 Exには自己loop・平行辺を含む
  `min(V,E)` の達成構成と同根の辺追加のundo、ABC453
  Gには版数Nと位置数M・共有初期木・コピー後の片側更新がある。ABC430
  Gにも成功条件・写像合成・曖昧度potentialの証明があり、計算量欄の保守的上界を誤りと断定しない。今回の有限検算でこれら全問の論証を検証済みとはしていない。

一次確認のみの16単元も一律に書き換えない。Sparse
Tableは重なり部分の冪等性、SWAGは二stackの逆向きの積、canonical分解は点のpathとの一意対応、静的索引はmerge構築と値境界、動的木は未生成区間の初期要約と単位元の違いを既に説明している。ODTはrun更新・被覆数付きunion長・削除の償却を区別し、Moと値bucketは分割対象と操作回数を分けている。**値bucketの具体的な更新・取得・逆元の条件は概要内にある**ため、「考え方」節の短さだけで欠落と判定しない。bitsetのword境界と旧状態、binary
Trieの閾値分岐、bit minimaxの最大側の支配も保つ。

string-hashは子sequence-fingerprintへの入口として読み、子にはprefix初期化・連結・LCP探索・固定経路での衝突評価がある。rollbackはcheckpoint規約とno-op、persistenceは初期木の共有・位置数と版数・更新時のコピーを説明済み。Beatsはchminの成功条件・失敗下降のpotential・集合への転用を扱っている。今後はこれらの小例・適用条件・問題への接続を詳しく確認する。

19単元の主要節に空見出しは見つからなかった。問題一覧の分類文の反復、本文の未定義記号、式の導出不足、未区切りTeXは別の症状として扱う。今回、共通生成器・reader・rendererが原因であると実証した不具合はなく、#107の再実装や基盤Issue、一括再生成は追加しない。

## 検証と限界

19単元のpath、40問のpathの存在・一意性、homeの主配置集合・既存順、7件の編集対象の重複なしを照合した。記法報告は
**59原稿に452候補、明示数式エラー0件**。全て `UNDELIMITED_TEX`
で40問題にあり、19単元にはない。多くは制約のTeXで、本文の添字・冪にもある。素の `f_1`
等はこの候補数にすべて現れるわけではない。452件の表示不具合や、全40問の改稿必須を示す数ではなく、式の範囲を文脈で決めて後続改稿で整える。

```sh
# Node 26.12.1。範囲表の19単元・40問の実pathを渡す。
npm run notation:report -- <対象Markdownの実path...>
npm run verify:fast -- --base origin/main
```

notation CLIはsandbox内のtsx IPC作成で失敗したため、同じ検査本体を
`node --import tsx scripts/validate/document-notation.ts <実path...>`
で実行して上記結果を得た。npmは11.20.0で指定版への警告が出たが、依存の変更・再インストールは行っていない。

診断の具体化のため、独立した短い検算も行った。ABC371
Fは2人・初期座標0..3・目標0..3の二用事384組を、他人の先行移動も許す幅−2..6の状態BFSと比較した。ABC221
Gは長さ1..5・距離1..3の到達する二targetの34,320組を共有prefix履歴から復元し、元座標を確認。ABC363
Gは期限1..3・報酬1..3の四仕事の全挿入列で26,244個のprefixを全subset最適値と比較した。ABC357
Fは長さ1..3・値0..2・加算0..2の7,371組で要素ごとの更新とmapping・tag合成を比較。ABC273
EはADD二値・DELETE・SAVE二page・LOAD二pageの長さ5の16,807列を全copy方式と比較した。いずれも一致したが、有限域の検算であり一般の証明、全補助構造のrollback、改稿後の実装検証の代用にはしない。

既存のverify:fast本体を `node --import tsx scripts/verify/fast.ts --base origin/main`
で実行し、文書のみの検証が選ばれ成功した。Prettier、ローカル参照22件、対象pathと主配置順の照合、`git diff --check`も通過した。後続Issueから調査元への参照と、#140へのSub-issue登録を確認した。

教材本文・データ・共通表示を変更しないため、build・E2E・全教材の数学監査はこのPRの実施対象外。後続PRでは各Issueに記した公式再照合、本文とclaim、既存schema/reader検証、本番subpathのbuild・内部リンク、対象の文章と表示を確認する。7件の改稿と未予約35問・16単元の詳細確認を#140の未完了として残す。
