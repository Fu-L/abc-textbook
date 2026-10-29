# S1：接頭辞・接尾辞・文字列automaton・圧縮文字列の本文調査

2026-10-29、[調査Issue #180](https://github.com/Fu-L/abc-textbook/issues/180)の14単元・29問を、main
`a5e443ce`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)へ具体的な改稿と残範囲を渡す文書であり、**教材改稿の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・fullと短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

homeの`directProblemIds`を既存順で記す。分類・難易度順を再計算する表ではない。問題本文は`src/content/docs/problems/`配下の同名Markdownへ一意に対応する。

| 対象単元                                                                                                 | 担当Problem ID                                                           |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [index.md](../../src/content/docs/learn/string/index.md)                                                 | 直接配置なし                                                             |
| [trie-prefix.md](../../src/content/docs/learn/string/trie-prefix.md)                                     | `abc287-e`, `abc353-e`, `abc437-e`, `abc377-g`                           |
| [string-prefix-automata.md](../../src/content/docs/learn/string/string-prefix-automata.md)               | 直接配置なし                                                             |
| [z-algorithm.md](../../src/content/docs/learn/string/z-algorithm.md)                                     | `abc430-e`, `abc284-f`, `abc257-g`                                       |
| [string-periodicity.md](../../src/content/docs/learn/string/string-periodicity.md)                       | `abc312-ex`                                                              |
| [palindrome-radius.md](../../src/content/docs/learn/string/palindrome-radius.md)                         | `abc398-f`, `abc349-g`                                                   |
| [suffix-lcp-index.md](../../src/content/docs/learn/string/suffix-lcp-index.md)                           | `abc362-g`, `abc272-f`, `abc213-f`, `abc452-g`, `abc268-ex`, `abc280-ex` |
| [string-automata.md](../../src/content/docs/learn/string/string-automata.md)                             | 直接配置なし                                                             |
| [finite-pattern-automaton.md](../../src/content/docs/learn/string/finite-pattern-automaton.md)           | `abc305-g`, `abc264-g`, `abc301-f`, `abc418-g`                           |
| [aho-corasick.md](../../src/content/docs/learn/string/aho-corasick.md)                                   | `abc419-f`, `abc458-f`                                                   |
| [automaton-subset-construction.md](../../src/content/docs/learn/string/automaton-subset-construction.md) | `abc228-g`                                                               |
| [suffix-automaton.md](../../src/content/docs/learn/string/suffix-automaton.md)                           | `abc433-g`                                                               |
| [run-length-dynamics.md](../../src/content/docs/learn/string/run-length-dynamics.md)                     | `abc313-e`                                                               |
| [recursive-compressed-string.md](../../src/content/docs/learn/string/recursive-compressed-string.md)     | `abc450-e`, `abc350-f`, `abc346-f`, `abc417-g`                           |

全43原稿の主要な説明、正当性、境界・計算量と記法を一次確認した。**代表5問（ABC312 Ex・ABC213
F・ABC264 G・ABC346 F・ABC417 G）は、同居claimと公式問題文・個別公式解説まで再照合した。**
全原稿の詳細な数学監査・ブラウザー表示確認とは区別する。

関連先の範囲外5問（ABC240 Ex・ABC268 G・ABC343 G・ABC403 E・ABC434
F）は接続する考察・正当性を読んだ。担当29問と関連5問は全て`full`、`primaryProblemId: null`で、追加で読む短縮形式の参照元はない。担当29問の正当性と同居claimのtextは一致するが、一致を数学的正しさの保証とはしない。

ABC349 Gの存在を仮定した制約圧縮と最終全照合、ABC272 Fの同値な巡回列をS側先行にするpadding、ABC452
Gの種類と出現の区別、ABC280 ExのLCP木の枝と順位復元、ABC301 Fの29状態と集計方向、ABC418
Gの表と文法方程式による検証、ABC313 Eの寿命、ABC450
Eの代表列K≥2は既に補強されている。これらを欠落扱いせず、条件・式・手順をつなぐ残課題を選んだ。

## 詳しく確認した代表5問

公式根拠の再照合日は全て2026-10-29。引用は現稿の短い抜粋、以下の小例・補完論証は独自案である。

### ABC417 G：含有長が半分でも、参照先node全体が半分とは限らない

[現稿](../../src/content/docs/problems/string-geometry/outcome-query-recursively-defined-string/outcome-query-recursively-defined-string-shard-001/abc417-g.md)の「正当性」とclaimは「lightへ移るたび残長が半減する」とする。上限をC=10へ縮め、左長6・右長10の連結を先頭10文字に切ると、右の含有長4がlightだが、右nodeの保存長は10のままである。位置B=8は右のB'=2へ移る。**計算量の証明の誤りであり、この例が算法の誤答例という意味ではない。**

[公式問題](https://atcoder.jp/contests/abc417/tasks/abc417_g)・[個別公式解説](https://atcoder.jp/contests/abc417/editorial/13580)は、未飽和なら参照先長の半減、飽和から飽和へのlightならBがC/2以下、飽和かつB≤C/2から次のlightなら参照先長がC/2以下、という場合分けを使う。Bは途中でも増えないため、後は通常の半減へ接続できる。

[#399](https://github.com/Fu-L/abc-textbook/issues/399)で、二つの長さの区別とこの論証を訂正し、heavy先・累積offsetのdoubling式、包含判定、基底での停止まで一問でつなぐ。右の含有長0・同長tieも確認する。全DAG・doubling実装の検証は後続に残す。

### ABC312 Ex：候補を飛ばす回数と、使用済み判定一回の費用を分ける

[現稿](../../src/content/docs/problems/string-geometry/outcome-normalize-string-to-primitive-period/outcome-normalize-string-to-primitive-period-shard-001/abc312-ex.md)の「考察」は「最終指数は総入力長L以下」「Σ
L/n」とするが、上界と複数groupの合算を導かない。「使用済み指数set」の実装も未指定で、「時間」のO(L
log L)を最悪時間として読める前提が不足している。

root
Rのgroupで`S_i=R^{n_i}`、`W_R=Σn_i`とする。新しい指数mは、以前の最大使用指数Mを超える最初のn_iの倍数以下なので`m≤M+n_i`。帰納法で`m≤処理済みの指数和≤W_R`となる。同じnのpointerは`O(W_R/n)`回しか進まず、`Σ_R W_R≤L`から全groupの試行回数を評価できる。例えばn=(1,2,1,2)ではm=(1,2,3,4)、出力k=(1,1,3,2)となる。

[公式問題](https://atcoder.jp/contests/abc312/tasks/abc312_h)・[個別公式解説](https://atcoder.jp/contests/abc312/editorial/6837)はsetの費用込みでO(L(log
L)²)を示す。現稿のO(L log
L)を保つならgroup別の真偽配列などO(1)の使用済み判定を具体化する必要があり、hashなら期待時間とする。現状を算法自体の誤りとはしない。[#400](https://github.com/Fu-L/abc-textbook/issues/400)でnext[n]の初期値、rootの同一性取得、配列初期化・領域までそろえる。

### ABC213 F：LCPの隣接性から、stack一回の更新を組み立てる

[現稿](../../src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc213-f.md)の「考察」は「値と個数」「総和を差分更新」で止まる。「正当性」のgroup不変量、自己LCPの別加算、元位置への復元は既にあるが、読者が走査を書くにはpop時の減算と左右の添字が要る。

stackを値昇順の(v,c)、sumを現在終端の全区間最小値の和とする。新値xに対しcount=1から始め、末尾v≥xをpopしてsumからv·cを引き、countへcを加える。最後に(x,count)を積みsumへx·countを足すと、古い各区間の最小値をmin(旧値,x)へ置き換え、新しい長さ1の区間も加えられる。

独自例ababaのSA=(4,2,0,3,1)、隣接LCP=(1,3,0,2)で、0による全popと左右の集計を追う。左の順位rはLCP[r−1]、右はLCP[r]を取り込み、自己長を足して元位置へ戻すと答えは(9,6,7,4,3)。[公式問題](https://atcoder.jp/contests/abc213/tasks/abc213_f)・[個別公式解説](https://atcoder.jp/contests/abc213/editorial/2391)の集約と照合し、[#401](https://github.com/Fu-L/abc-textbook/issues/401)で具体化する。公式例には空接尾辞があり、現Unitの非空接尾辞の規約との差も明示する。

### ABC346 F：周期境界をまたぐk番目を、次探索位置の式で決める

[現稿](../../src/content/docs/problems/string-geometry/outcome-query-recursively-defined-string/outcome-query-recursively-defined-string-shard-001/abc346-f.md)は「周期内indexを算術とbinary
searchで求めてposをk個目の直後へ」とするが、その更新式がない。g(T,k)は各文字の反復という区別と最早照合の証明は保持する。

posを0-indexの次探索位置、`s=|S|`、`P_c`を一周期のcの出現位置列とする。`q=floor(pos/s)`、`r=pos mod s`、`j=lower_bound(P_c,r)`、`m=|P_c|`、`t=j+k−1`なら、次位置は`(q+floor(t/m))s+P_c[t mod m]+1`。j=mも次周期への移動として扱える。S=abaca、pos=4、c=a、k=3なら使用位置4,5,7、次位置8になる。k=0とc不在は先に分ける。

[公式問題](https://atcoder.jp/contests/abc346/tasks/abc346_f)・[個別公式解説](https://atcoder.jp/contests/abc346/editorial/9644)の周期照合と比較した。公式問題は非連続の部分列と明記する。[#402](https://github.com/Fu-L/abc-textbook/issues/402)で二分探索の両端、周期境界、小kの要求列を大kから削除できる単調性へつなぐ。Ns≤10^17でも、不可能な候補のjump途中の積まで64bitに収まるとは限らず、乗算前の上限判定も具体化する。

### ABC264 G：二文字状態から非空の最大値・Infinityの回収へ進む

[現稿](../../src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc264-g.md)は末尾二文字の辺重みを示すが、初期距離から全辺を反復して有限解・正閉路判定へ進む手順がない。非空制約、未到達の−INF、始点到達性、未指定語0点の既存注意は保つ。

[公式問題](https://atcoder.jp/contests/abc264/tasks/abc264_g)・[個別公式解説](https://atcoder.jp/contests/abc264/editorial/4580)の末尾三項の増分・重み付きwalkへの帰着と全文を照合した。a,ab,abaを追加する小例から、各出現が完成時に一度だけ加点されることを示す。二layerならV−1辺までの有限最大値とV回目の改善を区別し、零・負閉路をInfinityにしない理由、始点の空列を出力候補から除く手順まで[#403](https://github.com/Fu-L/abc-textbook/issues/403)でつなぐ。

初期ダミー二文字の裸の`$$`は数式区切りにも見えるが、現行`renderPublicDocument`で文字として残ることを確認した。記号そのものをインラインコードへ整える対象であり、未変換TeXエラーや共通renderer不具合とは扱わない。

## 単元の入口に補う小例

次の5単元は一次確認からの具体化であり、代表5問と同じ深さの公式再照合済みとはしない。各Issueに後続で照合する公式問題・個別公式解説を記した。式や手順が既にある箇所へ、その意味を理解する小例を補う。

- **string-prefix-automata・z-algorithm**：親から子までZ-boxを写す文字位置の小例がない。aabaaabで[3,5)からi=4へ1文字を再利用し外へ伸ばしてZ[4]=3、次のi=5は鏡像の不一致が区間内にありZ[5]=1で確定する二場合を[#404](https://github.com/Fu-L/abc-textbook/issues/404)で追う。初期化・minで切る理由・線形時間の既存証明は残す。
- **string-automata・finite-pattern-automaton**：親は未来の受理による同値化の紹介、子はsuffixと部分列進行の式が中心。pattern
  abでacを読むと、部分文字列一致は状態0、部分列進行は状態1になる。何を忘れてよいかが目的で変わる小例から、初期・全文字遷移・禁止完成・DP値へ[#405](https://github.com/Fu-L/abc-textbook/issues/405)でつなぐ。既存ABC301
  Fの補強と別担当DP章の[#312](https://github.com/Fu-L/abc-textbook/issues/312)は重複改稿しない。
- **automaton-subset-construction**：集合遷移・ε閉包・空集合・BFS・2^s上界はあるが、一語の複数経路が合流する小例がない。二初期状態から同じ文字aでwへ至る二経路も、語aと集合{w}は一つ。異なる語が同じ集合へ来る場合のDP加算と区別し、全マス1の2×2盤面で数字列11を一つと数える例へ[#406](https://github.com/Fu-L/abc-textbook/issues/406)で接続する。

## 後続改稿と優先順

5問・5単元を次の8件へ分けた。各Issueに編集path、症状、補う説明、公式根拠、個別検算、既存検証、依存を記し、編集path10本は重複しない。

| 優先する課題               | 後続Issue                                               | 編集対象                                  |
| -------------------------- | ------------------------------------------------------- | ----------------------------------------- |
| 飽和後の計算量の証明       | [#399](https://github.com/Fu-L/abc-textbook/issues/399) | ABC417 G                                  |
| 使用済み判定込みの計算量   | [#400](https://github.com/Fu-L/abc-textbook/issues/400) | ABC312 Ex                                 |
| 隣接LCPから具体的な走査へ  | [#401](https://github.com/Fu-L/abc-textbook/issues/401) | ABC213 F                                  |
| 周期上の位置と整数境界     | [#402](https://github.com/Fu-L/abc-textbook/issues/402) | ABC346 F                                  |
| 初期状態から非空解の回収へ | [#403](https://github.com/Fu-L/abc-textbook/issues/403) | ABC264 G                                  |
| 一致区間を再利用する入口   | [#404](https://github.com/Fu-L/abc-textbook/issues/404) | string-prefix-automata・z-algorithm       |
| 目的によって異なる有限状態 | [#405](https://github.com/Fu-L/abc-textbook/issues/405) | string-automata・finite-pattern-automaton |
| 経路と語を区別する集合状態 | [#406](https://github.com/Fu-L/abc-textbook/issues/406) | automaton-subset-construction             |

各1 Issue＝1 PR、必須先行mergeなし。ABC417
Gの位置と飽和の論証は一問に限定する。#180・他分野の調査・#141・#142の全完了を待たない。全8件を#180の標準Sub-issueに登録し、#140
→ #180 →
#399〜#406の階層からたどれる。共通生成器・reader・rendererが原因となる再現は実証しておらず、基盤改修・一括再生成は追加しない。

## 一次確認のみの残範囲

代表5問以外の**24問・未予約9単元**は一次確認のみで、その詳細確認を#140の未完了として残す。下表は既存説明と次に調べる内容であり、修正不要・品質確認済みの一覧ではない。全件の改稿を一律に予約しない。

| 残る範囲                                                             | 既存の説明と次の詳細確認                                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 章入口・trie-prefix、ABC287 E・ABC353 E・ABC437 E・ABC377 G          | 通過/終端数、prefix先の辞書順、深さごとの確定、LCPの寄与、親node直接参照、最小過去長はある。重複と終端の小例、root空列、query前の自己未登録、prefix共有の上界評価を公式と検算する。ABC377 Gは固定prefixを共有する相手の実LCPがさらに長い場合も、全深さで最小を取ればよい理由を丁寧に確認する。                 |
| ABC430 E・ABC284 F・ABC257 G                                         | 二重化とZ、二本の連結列の添字、区間frontierはある。空比較i=0,N、case総長、各BFS層の境界を小例・公式で詳細確認する。ABC257 Gの最長断片greedyの反例aba/ababaはあるが、復習欄が検算指示中心なので発動条件の定着も確認する。二つのZ Unitは予約済み。                                                               |
| string-periodicity                                                   | 欠けを許す周期と整数回反復、ababaとababab、約数条件、borderとの対応はある。primitive rootの一意性・異rootの反復が一致しない理由を問題への接続と合わせて詳細確認する。ABC312 Exは予約済み。                                                                                                                     |
| palindrome-radius、ABC398 F・ABC349 G                                | 奇偶の半径・鏡像・区間判定、最長回文suffixへの帰着、構成での厳密なskipと最終照合は具体的。境界の等号・不整合入力の仕事量・不等成分彩色の辞書順最小性を公式・直接法で詳細確認する。既存の重い補強を省略版へ戻さない。                                                                                           |
| suffix-lcp-index、ABC362 G・ABC272 F・ABC452 G・ABC268 Ex・ABC280 Ex | SA/rank/LCPの規約、prefix一致の上下境界、長さで切る比較、distinctと出現の違い、padding、0-free変換、最短禁止区間と右端貪欲、LCP木の枝と多重度はある。番兵横断、同値suffix・深さ0の枝・出現任意順、RMQ前処理費用と順位復元を小例・公式まで詳細確認する。ABC213 Fは予約済み。                                    |
| ABC305 G・ABC301 F・ABC418 G                                         | 保存長5と禁止長6、29状態の初期値と固定大文字の分数係数、16演算のDFA表と文法方程式の有限比較はある。対称性の適用範囲、法上の分母、全substringの最小開始位置、表の受理と言語の一致を検算する。ABC418 Gは候補の推測だけで証明したとは書かれておらず、既存の全長保証を保持する。親・構成UnitとABC264 Gは予約済み。 |
| aho-corasick、ABC419 F・ABC458 F                                     | child/goの区別、BFS、failure出力のOR、出現maskと禁止状態の除去、同じ遷移先へ行く文字数の行列加算はある。suffix側の同時検出、重複pattern、空patternは別扱いであること、rootから長さL/N回進める小例を公式と詳細確認する。                                                                                        |
| ABC228 G                                                             | 経路数と語数の区別、行/列集合の交互遷移、全行初期状態・非空受理・lowbit前計算はある。各mask遷移の具体例、2N段の添字、同じ語の複数経路を直接列挙と比較する。subset Unitだけ予約済み。                                                                                                                           |
| suffix-automaton、ABC433 G                                           | endpos・len区間、abbのclone、遷移付替え、線形構築の償却出典、cntの初期値、len降順の勝敗判定はある。同じendposが全ての右拡張を共有する理由、cloneを含む順序、terminalとゲーム終了の区別、全caseの合計長を公式・直接ゲームと詳細確認する。                                                                       |
| run-length-dynamics、ABC313 E                                        | 固定座標mapのsplit/mergeとdeque、生成消滅への課金、非1隣接の無限判定、右からの寿命式と仮想一操作はある。run数だけから一操作log時間とはしていない。元runの寿命とmod値を終了判定に使わない条件、全1・非1端点を実操作・公式まで確認する。                                                                         |
| recursive-compressed-string、ABC450 E・ABC350 F                      | 連結・反復・反転の位置変換、飽和長を反転へ誤用しない例、括弧jump、K≥2の基底、prefix差はある。totalを加える分岐だけ未飽和である理由、二つのcase反転方式、jump後の一歩と全体の訪問回数を小例・公式まで確認する。ABC346 F・ABC417 Gは予約済み。                                                                   |

関連5問は接続確認だけで、担当29問・残24問・新たな改稿予約へ含めない。残範囲の英語混在、未定義記号、分類文の反復、復習が検算指示だけの箇所も、文脈に即して詳細確認する。空見出しだけを独立した確定不具合として予約したページはない。

## 検証と限界

- Node.js 26.12.1 / npm
  11.20.0で`npm run notation:report -- <対象14単元・29問の実path>`を実行し、**43原稿・158候補・明示数式エラー0件**、exit
  0。npmは指定版11.21.1との差を警告した。依存・lockfileは変更していない。内訳は29問題の「制約との対応」の未区切りTeX154候補と、ABC264
  Gのダミー表記の曖昧なドル記号4候補。同一文中の複数コマンドも別候補に含む。表示不具合158件とは数えず、ダミーは上記の文脈・renderer確認で判定し、制約は該当ページの改稿時に式の範囲を確かめる。
- 一時検算で、ABC213
  Fの二文字alphabetの全1,022語（長さ1〜9）のstack集計を全接尾辞対の直接LCP和と照合した。ABC346
  Fの27,040件の出現jumpを直接照合、ABC312
  Exの21,844通りの指数列でpointer探索と毎回最初からの探索・指数上界を照合した。Z小例も直接比較で全値を確認した。
- ABC417
  Gは上限2〜32の59,432通りのlight移動で上記三場合を確認した。これは局所の論証の検算であり、全DAG・doubling実装の正しさや実制約での性能の検証ではない。ABC264
  Gは既存rendererでダミー表記を確認したが、重み付きgraphの実装検証は後続に残す。
- 既存の文書checkerで変更Markdownの書式・ローカルリンク22件・既存の比較画像参照133件を確認した。14単元・29問の存在とhome対応、関連5問、Issue間の編集path重複と残範囲も一時スクリプトで検査した。教材本文・分類JSON・共通表示は変更せず、文書PRとしてbuild・E2Eは実行していない。後続改稿では公式根拠・本文/claim・必要なschema/reader・本番subpathでのbuild/内部リンク・対象の文章と表示を確認する。

この調査の完了・mergeは後続8件の本文改稿や残24問・9単元の詳細確認の完了を意味しない。これらを#140の未完了として追い、#180だけの完了でEpicを閉じない。
