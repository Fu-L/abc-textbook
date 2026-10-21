# 列挙・正規化・寄与分解・探索空間の分割の一次調査（M1）

[調査 #168](https://github.com/Fu-L/abc-textbook/issues/168)、親は[本文改修 #140](https://github.com/Fu-L/abc-textbook/issues/140)。2026-10-21、`9d80fe9a`（#167反映後）を基準に調べた。**73問・9単元の一次確認を終え、10問・2単元を8件の改稿Issueへ割り当てた。教材本文の改稿は未実施**である。

[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)と[full](../../.agents/skills/abc-explanation-author/templates/full-explanation.md)・[短縮形式](../../.agents/skills/abc-explanation-author/templates/abbreviated-explanation.md)を基準に、着想から手順・正当性・境界・全体計算量を追えるかを読んだ。分類・問題順・出典の履歴・共通表示は変更しない。

## 範囲と確認の深さ

下表は担当範囲の照合用であり、難易度評価や承認表ではない。IDは各単元の`directProblemIds`の既存順。問題原稿は`src/content/docs/problems/`以下の`<ID>.md`を一意に探して確認した。単元の一覧・関連先も正本と照合した。

| 単元（`learn/modeling/`）                                                                                | 主配置の対象Problem ID                                                                                                                                                                                                                                                                                                                                                                                                 | 件数 |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---: |
| [index.md](../../src/content/docs/learn/modeling/index.md)                                               | なし                                                                                                                                                                                                                                                                                                                                                                                                                   |    0 |
| [bounded-enumeration.md](../../src/content/docs/learn/modeling/bounded-enumeration.md)                   | `abc234-e`、`abc254-e`、`abc328-e`、`abc369-e`、`abc272-e`、`abc386-e`、`abc219-e`、`abc343-e`、`abc312-e`、`abc260-f`、`abc347-f`、`abc227-f`、`abc442-g`、`abc313-f`                                                                                                                                                                                                                                                 |   14 |
| [backtracking-search.md](../../src/content/docs/learn/modeling/backtracking-search.md)                   | `abc284-e`                                                                                                                                                                                                                                                                                                                                                                                                             |    1 |
| [normalization.md](../../src/content/docs/learn/modeling/normalization.md)                               | `abc462-e`、`abc242-e`、`abc250-e`、`abc323-f`、`abc296-f`、`abc302-g`、`abc446-g`、`abc463-f`、`abc313-g`、`abc219-f`、`abc427-g`、`abc382-g`                                                                                                                                                                                                                                                                         |   12 |
| [coordinate-compression.md](../../src/content/docs/learn/modeling/coordinate-compression.md)             | なし                                                                                                                                                                                                                                                                                                                                                                                                                   |    0 |
| [contribution-reordering.md](../../src/content/docs/learn/modeling/contribution-reordering.md)           | `abc233-e`、`abc371-e`、`abc318-e`、`abc308-e`、`abc365-e`、`abc324-e`、`abc347-e`、`abc423-e`、`abc379-e`、`abc247-e`、`abc334-e`、`abc280-e`、`abc418-e`、`abc436-f`、`abc411-e`、`abc378-e`、`abc396-f`、`abc290-e`、`abc255-e`、`abc306-f`、`abc261-f`、`abc220-e`、`abc269-f`、`abc439-f`、`abc407-f`、`abc390-f`、`abc438-f`、`abc380-g`、`abc295-e`、`abc362-f`、`abc215-g`、`abc268-g`、`abc295-f`、`abc231-g` |   34 |
| [divide-enumeration.md](../../src/content/docs/learn/modeling/divide-enumeration.md)                     | なし                                                                                                                                                                                                                                                                                                                                                                                                                   |    0 |
| [recursive-divide-and-conquer.md](../../src/content/docs/learn/modeling/recursive-divide-and-conquer.md) | `abc413-e`、`abc426-g`、`abc282-ex`                                                                                                                                                                                                                                                                                                                                                                                    |    3 |
| [meet-in-the-middle.md](../../src/content/docs/learn/modeling/meet-in-the-middle.md)                     | `abc271-f`、`abc427-f`、`abc402-f`、`abc326-f`、`abc336-f`、`abc464-f`、`abc300-g`、`abc252-ex`、`abc220-h`                                                                                                                                                                                                                                                                                                            |    9 |

全82原稿の主要な説明・記法を一次確認した。そのうち下記5問は公式問題文・個別公式解説と再照合して詳しく診断し、分割の入口と分割統治の2単元は読書順まで診断した。残る68問・7単元は一次確認のみで、論証・実装・表示の品質確認済みではない。

73問の`authoringUnit.kind`は全て`full`で、短縮形式・参照元fullへの依存はなかった。全73問の正当性節と同居するcorrectness
claimは空白を正規化すると一致したが、これは数学的正しさの保証ではない。関連するABC374
F（候補時刻の発見と圧縮）、ABC419 G（経路数と探索費用）、正規化Unitが参照するABC399 E・ABC452
Gの対応も照合した。これらは別担当で改稿を予約しない。ABC330
Gは#159の改稿済み本文との整合確認だけとし、73問に含めない。

## 公式根拠まで再照合した代表5問

以下の公式問題・個別解説は2026-10-21に再照合した。式の補足と診断は本調査の判断で、公式解説の記述をそのまま誤りとするものではない。

### ABC379 E：部分文字列の右端と桁係数の添字が混ざる

「考察」冒頭は右端を`i`としながら`j·S_j·10^{N-i}`を寄与とし、「正当性」も固定右端の総和を`A_i`と呼ぶ。最後の式は正しいが、その係数の添字は右端ではない。例えば`S=123`で元の一桁目が右端1の部分文字列へ寄与する値は1であり、`10^{3-1}=100`ではない。

元の桁位置を`j`、右端を`r`とすれば寄与は`j·s_j·10^{r-j}`。10冪の指数`t`で集め直した係数は`Σ_{j≤N-t}j·s_j`であり、ここで初めて既存の`A_k=Σ_{j≤k}j·s_j`へ接続できる。`S=123`の全6部分文字列の和164と係数列`(1,5,14)`の筆算を添える。carryの手順を削らず、正当性claimもこの導出に合わせる。

[公式問題](https://atcoder.jp/contests/abc379/tasks/abc379_e)・[個別公式解説](https://atcoder.jp/contests/abc379/editorial/11311)。[改稿 #195](https://github.com/Fu-L/abc-textbook/issues/195)では、関連するABC233
Eの右揃え筆算も一緒に説明する。

### ABC336 F：6 bitが表すものと探索の完結した手順

「実装上の注意」の「HW≤64なので各値を6bitでpackできる」は、入力値が1..64のままでは成り立たない。6
bit化するなら`v−1`を0..63へ写す必要があり、盤面全体は最大384
bitである。配列・文字列のキーを基本に説明すれば、この補助的な圧縮を必須にする必要もない。

自己逆操作と10+10の証明は既にある。四つの回転による遷移生成→両側の最短距離保存→共通盤面で距離和の最小→共通状態がなければ−1、という手順までつなぐ。単に「両端BFS」と名付けるだけで実装を読者へ委ねない。

[公式問題](https://atcoder.jp/contests/abc336/tasks/abc336_f)・[個別公式解説](https://atcoder.jp/contests/abc336/editorial/9077)。[改稿 #196](https://github.com/Fu-L/abc-textbook/issues/196)。

### ABC272 E：有効時刻の両端と、空bucketを含めた総量

「考察」は`0≤A_i+ij<N`と一要素あたり`⌈N/i⌉`を述べるが、上端式と区間が空になる条件を示さない。「正当性」の「scan総量もbucket
sizesの総和に比例する」も、空bucketでmex=0を確定する一回分を落としている。最終的な時間欄`O(N log N+M)`は保つ。

1始まりの要素番号`i`、操作番号`j`に対して、下端は`max(1,ceil(−A_i/i))`、上端は`min(M,floor((N−1−A_i)/i))`。両端を不等式から導き、負数除算・空区間を説明する。長さNだからmex≤Nであり、N自体を保存せず0..N−1の存在だけで判定できることも補う。bucketの要素数を`s_j`とすると走査は`O(s_j+1)`、全体は調和級数で界したイベント数にMを足す。

[公式問題](https://atcoder.jp/contests/abc272/tasks/abc272_e)・[個別公式解説](https://atcoder.jp/contests/abc272/editorial/4982)。[改稿 #197](https://github.com/Fu-L/abc-textbook/issues/197)。

### ABC220 E：整数区間と向きの係数を作る理由

「正当性」には有効な分割区間と`2^{D−1}`が既にある。欠けているのは結論そのものではなく、その二つを初見で導く説明である。まずLCAを「最も深い共通祖先」と定義する。

LCAから両端への距離を`k,D−k`、残り高さをHとすると、`1≤k≤D−1`、`k≤H`、`D−k≤H`を交差させて既存の区間を得る。左部分木側の候補`2^{k−1}`と右側の`2^{D−k−1}`に、端点の左右割当2通りを掛けて`2^{D−1}`となる。`k=D/2`でも順序付き対の二方向は異なる。片端=LCAの`2·2^D`は別に数え、深さdの頂点数`2^d`を最後に掛ける。既存のN=3,D=2の14対も式の内訳までつなぐ。

[公式問題](https://atcoder.jp/contests/abc220/tasks/abc220_e)・[個別公式解説](https://atcoder.jp/contests/abc220/editorial/2679)。[改稿 #198](https://github.com/Fu-L/abc-textbook/issues/198)。

### ABC427 F：空列と位置の多重度を読者の判断に残さない

「実装上の注意」は「空部分列を答えに含める条件を問題文と合わせる」としている。公式サンプル1も明示する通り、空列を含める。各半分の空選択を剰余0・境界未選択として一度記録する。N=1,A=(0)なら空列と一要素列の2通りになる。

同じ値列でも位置が異なれば別なので、保存するものは剰余の集合ではなく多重度である。右側の全頻度と「先頭を選んだ頻度」を分け、左末尾を選んだ場合だけ両境界選択分を除く。Mが巨大なので剰余を長さMの配列へ展開しない。非隣接選択数の初期値1,2と二項の漸化式、N=1で片側が空の場合まで書けば、境界フラグを導入する理由も手順も明確になる。

[公式問題](https://atcoder.jp/contests/abc427/tasks/abc427_f)・[個別公式解説](https://atcoder.jp/contests/abc427/editorial/14195)。[改稿 #199](https://github.com/Fu-L/abc-textbook/issues/199)。

## 改稿の優先順と担当

順番は教材への影響による推奨であり、問題の掲載順や必須merge順ではない。各Issueに実path、直す説明、公式出典、検算・表示確認、互換性と依存を記した。独立に着手できる。

| 優先 | 後続Issue                                               | 予約する本文と到達点                                                                       |
| ---- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 先行 | [#195](https://github.com/Fu-L/abc-textbook/issues/195) | ABC379 E・ABC233 E。桁位置と係数を分け、右揃え筆算からcarryまで導く                        |
| 先行 | [#196](https://github.com/Fu-L/abc-textbook/issues/196) | ABC336 F。符号化の前提を訂正し、双方向探索を出力まで具体化する                             |
| 次   | [#197](https://github.com/Fu-L/abc-textbook/issues/197) | ABC272 E。有効時刻の両端、調和級数、mex走査総量を接続する                                  |
| 次   | [#198](https://github.com/Fu-L/abc-textbook/issues/198) | ABC220 E。LCA、分割の可動域、向きの係数を導く                                              |
| 次   | [#199](https://github.com/Fu-L/abc-textbook/issues/199) | ABC427 F。空列・剰余頻度・境界選択の結合を具体化する                                       |
| 次   | [#200](https://github.com/Fu-L/abc-textbook/issues/200) | `divide-enumeration.md`・`recursive-divide-and-conquer.md`。基本の分割・合成から発展へ進む |
| 続く | [#201](https://github.com/Fu-L/abc-textbook/issues/201) | ABC308 E・ABC347 F。中央固定の理由と、六分割へ至る導入を日本語で追えるようにする           |
| 続く | [#202](https://github.com/Fu-L/abc-textbook/issues/202) | ABC260 F・ABC386 E。候補数だけでなく初期化・外側走査・空選択を含む費用を示す               |

単元2件の課題は、親が「balancedな積木・remainder
tree・CDQ」と未説明の名前を並べ、子が基本例を挟まずCDQ・多項式積木へ進むこと。親ではMITMの「二群の結果の直積を照合する」と、再帰的に同形問題を解く分割統治を区別する。子ではABC413
Eの短い列などで葉→左右→合成を先に見せ、既存のCDQ更新順と積木の次数・解放規約は発展として保つ。[ABC413 E個別解説](https://atcoder.jp/contests/abc413/editorial/13406)・[ABC271 F個別解説](https://atcoder.jp/contests/abc271/editorial/4925)を同日に再照合した。両問題本文は#200では編集しない。

追加の一次症状として、ABC347 Fの考察は前提のない「従って」から始まり、ABC308
Eは冒頭から英語の操作要約が続く（#201）。ABC260
Fの時間欄はS頂点の外側走査を含めずUnitの説明と異なり、ABC386
Eは全体XORの前計算とr=0を全体評価へつないでいない（#202）。これらを代表5問と同じ深さで数学検証済みとはしない。ABC308
E・ABC260 F・ABC386 Eの個別公式解説は再照合した。ABC347
Fの同日のweb取得は429で、再照合完了として扱わず#201に引き継いだ。

共通生成器・reader・rendererの不具合を示す再現は得ていない。未区切り数式や文章の欠落は原稿にあるため、基盤改修Issueや全件再生成は追加しない。`## 概要`直下に小見出しがある形を、空の本文と誤判定しない。

## 一次確認にとどまる範囲と次の読み方

詳しく診断していない68問には、改稿を予約した5問（ABC233 E・ABC308 E・ABC347 F・ABC260 F・ABC386
E）も含む。**未予約の残り63問は、上の範囲表から予約10問を除いた集合**である。新たな改稿を一律に課すのではなく、次の観点で詳細確認する。記法候補の少なさや、説明が長いことだけで修正不要としない。

- 列挙：ABC234 E・ABC254 E・ABC328 E・ABC369 E・ABC219 E・ABC343 E・ABC312 E・ABC227
  Fには候補生成・境界の説明がある。ABC442
  Gも巨大な個数を展開しないrun処理まで書いてある。まずこれらを無理に書き換えず、内外連結と境界の対応、有限範囲の網羅性、同値の閾値、列挙器の費用を公式根拠と検算する。ABC313
  Fは確率のリセットから被覆への帰着、P/Qの定義、二つの探索の費用（入力Mも含む）を重点に残す。ABC284
  Eは現在pathの使用状態とundo、上限到達時の探索終了を詳細確認する。
- 正規化：ABC462 E・ABC296 F・ABC302 G・ABC446 G・ABC463 F・ABC313 G・ABC427 G・ABC382
  Gは構成・番兵・区間・表まで相当の説明がある。既存の補強を雛形へ戻さず、代表化の全単射と境界の検算を詳細確認する。ABC242
  E・ABC250 E・ABC323 F・ABC219
  Fでは、自由な半分、初出集合、押す方向、整数倍軌道のどの情報を保つかを確認する。
- 寄与分解：ABC371 E・ABC318 E・ABC365 E・ABC324 E・ABC347 E・ABC423 E・ABC247 E・ABC334 E・ABC280
  E・ABC418 Eは寄与式を追えるが、全入力の境界・整数幅まで検証してはいない。ABC436
  Fは最暗星がB最大である説明と「最小要素」という用語の対応、ABC396 Fは位置列からの差分式、ABC407
  Fは左右長の定義と台形の四点更新を優先して再照合する。残るABC411 E・ABC378 E・ABC290 E・ABC255
  E・ABC306 F・ABC261 F・ABC269 F・ABC439 F・ABC390 F・ABC438 F・ABC380 G・ABC295 E・ABC362
  F・ABC215 G・ABC268 G・ABC295 F・ABC231
  Gも一次確認のみ。確率の独立性と線形性、同値の担当、厳密不等号、前処理込みの総費用を中心に読む。
- 分割：ABC413 E・ABC426 G・ABC282 Exと、ABC271 F・ABC402 F・ABC326 F・ABC464 F・ABC300 G・ABC252
  Ex・ABC220 Hは一次確認のみ。葉の処理や結合式、停止境界など既にある補強を保つ。特にABC252
  Exの群分け手順と列挙サイズ保証、ABC220 Hのparity前計算とWHTの接続、ABC282
  Exの偏った再帰の深さは独立に詳しく確認する。重い独自論証の改稿が必要なら1問のIssueにする。

単元の一次確認のみは残り7件。章indexには対象色・読書順の案内、backtrackingにはmark/undoと経路の一意性、寄与分解には区間和と指示変数、MITMには頻度と補数検索の説明があり、今回新しい改稿を予約しない。bounded-enumerationは#202との費用表記を照合する。normalizationの既存補強は維持し、coordinate-compressionは順位差が距離でないことを元座標の小例でも示す必要があるかを次回判断する。7件とも全問題への接続や学習効果を確認済みとはしない。

## 実施した検証と限界

対象pathの存在と一意性、9単元の主配置集合（ABC330
Gを除いて73問）、問題一覧の順序・件数、後続Issueの対象重複と範囲を照合した。notation
reportは82原稿に**509候補、明示数式エラー0件**。候補は72問にあり、9単元にはなかった。主に制約の未区切りTeXで、本文にも集合差・添字・累乗がある。実表示の不具合509件、あるいは無修正でよい72問という意味ではない。原稿ごとの意味を確認して各改稿時に扱う。

```sh
# Node 24.18.0。範囲表の9単元と73問の実pathを渡す。
npm run notation:report -- <対象Markdownの実path...>
npm run verify:fast -- --base origin/main
```

調査中の短い独立検算では、ABC379 Eの123→164と係数列、ABC272 Eの有効時刻両端を8,036組、ABC220
EのN=2..6・D=1..2Nを全順序付き対のBFS距離と比較した。ABC427
Fの空列を含む最小例も確認した。これを各教材の改稿・掲載コードの検証成功の代用にはしない。

文書の書式・相対リンク・対象範囲の検証は成功した。公開本文を変更しない調査PRなのでbuild・E2E・全教材の数学監査は実施対象外。後続PRでは各Issueに記した公式再照合・本文とclaim・既存schema/reader・本番subpathのbuild/内部リンク・対象の文章と表示を確認する。後続8件と未詳細確認範囲は#140の未完了として残し、#168の完了と区別する。
