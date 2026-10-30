# A1：組合せ・反転・線形代数・構造定理の本文調査

2026-10-30、[調査Issue #182](https://github.com/Fu-L/abc-textbook/issues/182)が指定する18単元・62問を、main
`b698f2c5`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)へ改稿対象と残範囲を渡す文書であり、**本文改稿の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・full/短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

以下は現在のhomeの`directProblemIds`を既存順で記す。分類や難易度順を再計算する表ではない。問題本文は`src/content/docs/problems/`配下の各IDと同名のMarkdownへ一意に対応する。

| 対象単元                                                                                                                  | 現在の直接配置問題                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [index.md](../../src/content/docs/learn/combinatorics-algebra/index.md)                                                   | 直接配置なし                                                                                                                                                                                                            |
| [combinatorial-coefficients.md](../../src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)         | `abc425-e`, `abc405-e`, `abc458-e`, `abc358-e`, `abc234-f`, `abc399-f`, `abc431-f`, `abc433-f`, `abc262-e`, `abc266-g`, `abc226-f`, `abc243-f`, `abc276-g`, `abc290-f`, `abc463-g`, `abc240-g`, `abc267-g`, `abc278-ex` |
| [inclusion-exclusion.md](../../src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)                       | `abc455-e`, `abc246-f`, `abc297-f`, `abc462-g`, `abc242-f`, `abc235-g`, `abc309-g`, `abc456-g`, `abc331-g`, `abc280-g`, `abc214-g`, `abc236-ex`, `abc357-g`, `abc285-ex`, `abc306-ex`                                   |
| [divisor-mobius-inversion.md](../../src/content/docs/learn/combinatorics-algebra/divisor-mobius-inversion.md)             | `abc304-f`, `abc361-f`, `abc230-g`                                                                                                                                                                                      |
| [reflection-principle.md](../../src/content/docs/learn/combinatorics-algebra/reflection-principle.md)                     | `abc309-ex`                                                                                                                                                                                                             |
| [monoid-exponentiation.md](../../src/content/docs/learn/combinatorics-algebra/monoid-exponentiation.md)                   | `abc448-e`                                                                                                                                                                                                              |
| [semiring-matrix-exponentiation.md](../../src/content/docs/learn/combinatorics-algebra/semiring-matrix-exponentiation.md) | `abc445-f`, `abc236-g`                                                                                                                                                                                                  |
| [linear-algebra-xor.md](../../src/content/docs/learn/combinatorics-algebra/linear-algebra-xor.md)                         | 直接配置なし                                                                                                                                                                                                            |
| [linear-system-rank.md](../../src/content/docs/learn/combinatorics-algebra/linear-system-rank.md)                         | `abc366-g`, `abc276-ex`                                                                                                                                                                                                 |
| [xor-linear-basis.md](../../src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)                             | `abc283-g`, `abc451-g`, `abc223-h`, `abc249-g`                                                                                                                                                                          |
| [separable-linear-transform.md](../../src/content/docs/learn/combinatorics-algebra/separable-linear-transform.md)         | `abc288-g`, `abc212-h`, `abc367-g`                                                                                                                                                                                      |
| [prufer-code.md](../../src/content/docs/learn/combinatorics-algebra/prufer-code.md)                                       | `abc303-ex`                                                                                                                                                                                                             |
| [orbit-counting.md](../../src/content/docs/learn/combinatorics-algebra/orbit-counting.md)                                 | `abc428-g`, `abc284-ex`                                                                                                                                                                                                 |
| [deletion-contraction.md](../../src/content/docs/learn/combinatorics-algebra/deletion-contraction.md)                     | 直接配置なし                                                                                                                                                                                                            |
| [determinant-counting.md](../../src/content/docs/learn/combinatorics-algebra/determinant-counting.md)                     | `abc253-ex`, `abc323-g`, `abc216-h`                                                                                                                                                                                     |
| [poset-dilworth-antichain.md](../../src/content/docs/learn/combinatorics-algebra/poset-dilworth-antichain.md)             | `abc457-g`, `abc237-ex`, `abc354-g`                                                                                                                                                                                     |
| [matroid-theory.md](../../src/content/docs/learn/combinatorics-algebra/matroid-theory.md)                                 | 直接配置なし                                                                                                                                                                                                            |
| [matroid-greedy.md](../../src/content/docs/learn/combinatorics-algebra/matroid-greedy.md)                                 | `abc236-f`                                                                                                                                                                                                              |

この18単元の現在の直接配置は59問である。指定62問の残り`abc423-f`・`abc349-f`・`abc295-ex`は現在[subset-transforms.md](../../src/content/docs/learn/combinatorics-algebra/subset-transforms.md)がhomeだが、**#182の固定範囲なので3問とも調査した。**
subset単元は[#166](https://github.com/Fu-L/abc-textbook/issues/166)で改稿済みであり、照合のみとし再予約しない。

全80原稿の主要な説明、状態・式、正当性、境界・全体計算量、記法を一次確認した。**代表5問（ABC458
E・ABC309 G・ABC306 Ex・ABC276 Ex・ABC428
G）は同居claimと公式問題文・個別公式解説まで再照合し、補完案を小規模全探索と比較した。**
後述の4単元は小例・親子の接続を具体化した改稿予約であり、全主張の数学監査済みとはしない。

範囲外の関連55問は、正当性節と本分野の典型へ接続する記述を照合した。章入口・組合せ係数などの広い関連集合について、全節・全公式出典を詳細確認したわけではない。担当62問・関連55問は全て`full`、`primaryProblemId: null`であり、追加でたどる短縮形式の参照元はない。正当性節と同居claimは既存validatorと同じ係数抽出括弧のMarkdown
escape正規化で一致した。一致を数学的正しさの保証とはしない。

既存の補強も保持する。ABC399 Fの開始候補とp=0、ABC431 Fの挿入の逆対応、ABC290
Fの直径上界達成、ABC463 Gの四方向更新、ABC456 Gの飽和runを含む総計算量、ABC214 Gの長さ1成分、ABC236
Exの連結符号和、ABC357 Gの四kernelと同時刻依存、ABC278
Exのq係数とStirling反転は既に具体的である。ABC223 Hの全suffix不変量、ABC249
Gのアフィン代表・非空条件、ABC451 Gのwalk実現と正規化、ABC323 GのHessenberg手順、ABC216
Hの終点DP、ABC237 Ex・ABC354 Gの推移性・重複補正・費用も欠落扱いしない。

## 詳しく確認した代表5問

公式根拠の再照合日は全て2026-10-30。引用は現稿の短い抜粋、補う式・小例は独自案である。以下は説明の不足を具体化する診断であり、既存の最終式が誤答を返すという判定ではない。

### ABC458 E：四つの端点caseから二項係数を作る

[現稿](../../src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc458-e.md)の「考察」は「四endpoint
caseそれぞれで可能iを走査」「その位置数が公式のbinomになる」とする。runの分割数はあるが、四caseの対応表と、必須2を除いた残りをどこへ配るかが省かれている。「実装上の注意」のX1=0/X3=0は[公式問題](https://atcoder.jp/contests/abc458/tasks/abc458_e)の正の制約外であり、必要な境界をぼかしている。[個別公式解説](https://atcoder.jp/contests/abc458/editorial/20463)の四分類と照合した。

[#438](https://github.com/Fu-L/abc-textbook/issues/438)では、Bを1・3だけの列、m=X1+X3とし、両端11ならrun数(r1,r3)=(i,i−1)、33なら(i−1,i)、13/31なら(i,i)と定める。異値境界数h=r1+r3−1だけ必須の2を置く。残りX2−h個をBの要素間・両端のm+1個のgapへ非負分配するため、係数はC(m+X2−h,m)となる。B=131ではh=2、X2=2なら12321の1列、X2=3なら余分な2のgapが4通りある。この対応からcaseごとの積と走査範囲を導き、h>X2の項を0とする。

### ABC309 G：maskの各bitとshiftの時点を固定する

[現稿](../../src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc309-g.md)の「考察」は「maskをshift」「未使用の近傍値lを割り当てる」とするが、bitから実際の値への式、初期化、割当てとshiftの順がない。[公式問題](https://atcoder.jp/contests/abc309/tasks/abc309_g)・[個別公式解説](https://atcoder.jp/contests/abc309/editorial/6745)は、禁止値への部分matchingと残りの(N−k)!を根拠にしている。

[#439](https://github.com/Fu-L/abc-textbook/issues/439)では、位置iを処理する**直前**の窓を[i−X+1,i+X−1]、bit
bが値i−X+1+bの使用済みを表す規約にそろえる。固定しないならmask>>1、固定するなら範囲内の未使用bitを立ててから>>1し、次窓の新しい右端を0にする。i=3,X=2なら窓は[2,3,4]で、4を使ったbit
`100`は次の[3,4,5]では`010`になる。最左の値は次の禁止候補でなくなるため捨てられる。これは、最後の自由な補完でもその値を未使用に戻すという意味ではない。初期の空matching、kの加算、全終端maskの符号付き総和まで接続する。

### ABC306 Ex：比較結果のsourceを選ぶ包除にする

[現稿](../../src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc306-ex.md)には「connected
components数c(s)に応じて符号」と漸化式があるが、s内の辺・sと補集合間の辺をどう確定するかが薄い。[公式問題](https://atcoder.jp/contests/abc306/tasks/abc306_h)が数えるのは観測する比較結果であり、比較しない頂点間の大小や重さの全順序ではない。[個別公式解説](https://atcoder.jp/contests/abc306/editorial/6608)のsource除去と照合した。

[#440](https://github.com/Fu-L/abc-textbook/issues/440)では、有向辺を軽い→重いに固定し、=辺の連結成分を縮約する。選択したsource集合sの誘導グラフ内に厳密比較があれば、その到着先はsourceでなくなるため、各連結成分内の比較は全て=に固定される。補集合へまたがる辺は全て外向きで、一つの補集合の比較結果からの拡張は一意。比較されない二成分が同じ重さでも、同じ=成分へ統合して新たに数えない。

固定した完成結果にk個のsource成分があれば、その非空部分集合を選ぶ符号和は1になる。二sourceなら+1,+1,−1である。選んだsの成分数がc(s)なので符号は(−1)^(c(s)+1)となる。dp[空集合]=1から、s=maskも含む全非空submaskを列挙する理由を示す。三頂点pathの結果9通りと、三角形の13通りを比較し、比較していない辺の有無が何を変えるか説明する。この一問で論証を完結させる。

### ABC276 Ex：四隅からの復元と0-query検査を具体化する

[現稿](../../src/content/docs/problems/mathematics/outcome-solve-linear-system-and-rank/outcome-solve-linear-system-and-rank-shard-001/abc276-ex.md)には非零領域のunionを避けて0を置く必要十分性がある。一方、「未使用prefixは0として2D差分」「最後に全queryを検証する」から復元式・検査用データ構造が分からない。[公式問題](https://atcoder.jp/contests/abc276/tasks/abc276_h)・[個別公式解説](https://atcoder.jp/contests/abc276/editorial/5169)の非零元の指数化と0の扱いを別々に再照合した。

[#441](https://github.com/Fu-L/abc-textbook/issues/441)で、補助配列pからy[i,j]=p[i,j] XOR p[i−1,j]
XOR p[i,j−1] XOR
p[i−1,j−1]を作り、指数0/1を値1/2へ戻す。境界`p[0,*]`,`p[*,0]`を通常のprefixとして0固定するか、任意の補助配列にするかを明示する。後者でも長方形内の差分をXORすると中間が二度ずつ消えて四隅だけ残るため、境界を自由変数にできる。未使用座標を0にできる理由も式から説明する。

例えば2×2でp[2,2]だけ1なら、復元した非零行列は上段(1,1)、下段(1,2)。非零queryを右列にだけ課せば、左列を全て0にしても右列の条件は保たれる。0-queryが左列に触れるなら成立し、右列だけなら不可能となる。coverageを2D
imosで作り、uncovered cell数の2D
prefixで各0-queryをO(1)判定すれば、全queryごとのN²走査を避けられる。行列の復元・出力を含む費用とbitset消去の行数・列数をそろえる。

### ABC428 G：回転のcycle長と代表列の長さを分ける

[現稿](../../src/content/docs/problems/mathematics/outcome-count-orbits-by-fixed-points/outcome-count-orbits-by-fixed-points-shard-001/abc428-g.md)は「宝石の頻度との積約数DP」「d周期の回転」とするが、初期値と遷移式、dの意味が十分でない。[公式問題](https://atcoder.jp/contests/abc428/tasks/abc428_g)では同じ美しさの別種類は区別され、反転同値もない。[個別公式解説](https://atcoder.jp/contests/abc428/editorial/14241)の初等解法と照合した。公式の回転量別第一式はgcdの位置が約数別の第二式と整合せず、擬似コードもA(0)からの最初の更新を飛ばしているので、そのまま転記しない。

[#442](https://github.com/Fu-L/abc-textbook/issues/442)ではfreq[a]を美しさaの種類数とし、A0[1]=1、A(n+1)[sa]+=An[s]freq[a]（a≥2,sa≤U）から始める。長さLの回転量tについて、cycle数g=gcd(L,t)、cycle長d=L/gとする。L=6,t=2なら二つの3-cycleであり、各cycleに置く同じ種類の代表を二つ選ぶ。代表列の積yに対し全体の積はy^dで、同じdの回転数φ(d)からφ(d)A(L/d)[y]/Lへつながる。

一cycleの中は同じ**種類**を反復するためfreq[a]^dを掛けない。美しさ(2,2)の二種類A,Bで総積4なら、二珠の軌道はAA,AB,BBの3通り。恒等回転の固定列4と一つずらす回転の固定列2の平均で確かめられる。整数の完全d乗判定、長さ1、空列を答えに含めないこと、入力O(N)も含めた費用を整える。

## 後続改稿と優先順

全7件は作成済みで、#140 → #182
→ 各Issueの標準Sub-issueでたどれる。各Issueは対象path・症状・補う説明・根拠・検証・保持条件を持つ。**5問・4単元の編集path9本に重複はなく、必須先行mergeもない。**
優先は学習時のつまずきによるもので、教材の問題順を変える指示ではない。

| 優先   | Issue                                                   | 編集対象と到達点                                                                                           |
| ------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 先     | [#439](https://github.com/Fu-L/abc-textbook/issues/439) | ABC309 G：窓のbit対応・shift・初期/終端を固定する。                                                        |
| 先     | [#441](https://github.com/Fu-L/abc-textbook/issues/441) | ABC276 Ex：四隅から復元し、0-queryを計算量内で判定する。                                                   |
| 先     | [#440](https://github.com/Fu-L/abc-textbook/issues/440) | ABC306 Ex：等値縮約・source選択・符号の対応を一問で証明する。                                              |
| 次     | [#438](https://github.com/Fu-L/abc-textbook/issues/438) | ABC458 E：四caseとgap配分を式にする。                                                                      |
| 次     | [#442](https://github.com/Fu-L/abc-textbook/issues/442) | ABC428 G：積DPと回転の固定点を小例から結ぶ。                                                               |
| 並行可 | [#443](https://github.com/Fu-L/abc-textbook/issues/443) | linear-algebra-xor・linear-system-rank：同じF2の二式で、特解・kernel・可解性と子単元への使い分けをつなぐ。 |
| 並行可 | [#444](https://github.com/Fu-L/abc-textbook/issues/444) | matroid-theory・matroid-greedy：三ベクトルの価格順選択と三辺pathの交換失敗を追う。                         |

線形代数の親はrank・kernelという語を挙げるが、制約を解く／生成可能値を持つ／配列を変換する要求を具体例から選べない。rank単元には一般手順があるので、F2上のx1
XOR x2=1、x2 XOR x3=0を、特解(1,0,0)・kernel基底(1,1,1)・全解二つへつなぐ。x1 XOR
x3=0を追加した矛盾も比較する。親は解釈と導線、子は消去の手計算を担当する。

matroidの親は公理の紹介、子はprefix
rankと重み和の一般証明であり、oracleと交換を手で追う例がない。価格1,2,3のF2ベクトル(1,0),(0,1),(1,1)なら最初の二本を採用し第三を拒否する。一方、三辺pathのmatchingでは、中辺一つと両端二辺の間で交換公理が破れる。二つの端点別partition制約の共通部分へgreedyを無条件に移せない理由を具体化する。[ABC236 F公式解説](https://atcoder.jp/contests/abc236/editorial/3287)の交換論とも照合した。既存の負重み・基底と任意独立集合の区別は保持する。

## 一次確認にとどめ、詳細確認へ残す範囲

**未予約57問・14単元**は下表のまとまりで残す。予約済み4単元に属する未予約問題も含む。「既に説明がある」は修正不要・品質確認済みという意味ではない。公式再照合・必要な検算を伴う次の詳細確認を#140で追い、課題が具体化した順に数問/数単元のIssueへ分ける。

| 残るまとまり                                            | 既にある説明と、次に確認すること                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 章入口index                                             | 章の読書順と分野の見取り図はある。各名前を選ぶ要求・既習事項への接続が入口として十分か、子単元と読み合わせる。                                                                                                                                                                                                          |
| 組合せ係数単元・ABC458 E以外の17問                      | 挿入の一対一対応、Gaussian係数の分母、Stirling変換の二方向、Lucasの計算法は既にある。ABC425 Eのcaseごとの法・一行保持の具体手順、ABC433 FのVandermondeの添字、ABC267 Gのgap分類、ABC240 Gの四符号の逆対応を公式・小列まで確認する。補強済みABC278 Ex・ABC290 F・ABC463 Gなども境界と全体費用を詳細照合する。            |
| 包除単元・代表二問以外の13問                            | 対象ごとの符号和・空集合の意味は単元にある。ABC297 Fの四半平面の交差、ABC462 Gの値classとj!、ABC331 Gの全体符号と除外次数、ABC280 GのZ-sweepの出入り・面上の分類更新を公式・小集合まで具体的に調べる。ABC456 G・ABC214 G・ABC236 Ex・ABC357 Gの既存補強を維持する。ABC285 Exの括弧escapeはclaimの意味の不一致ではない。 |
| 約数反転単元・ABC304 F・ABC361 F・ABC230 G              | μの恒等式、約数/倍数の逆順、最小周期・exact gcdはある。周期tの定義、整数rootの境界、i=jを含む三角数、触れたカウンタだけの初期化まで公式・直接列挙で確認する。                                                                                                                                                           |
| 固定範囲のABC423 F・ABC349 F・ABC295 Ex                 | 現homeはsubset変換単元。supersetの向き、空集合/空部分列、LCMの上限、行開始時dpを使う標準形遷移はある。各式を公式・全mask/小盤面と再照合する。#166の単元を重複改稿しない。                                                                                                                                               |
| reflection-principle・ABC309 Ex                         | 一壁の逆写像と、二壁の符号付き巡回列の不変量はある。一壁の反射から二壁の周期2M+2へ進む説明、N=1、M=1、開始/終点の重複加算、巡回積の折返しを公式・短時間DPで確認する。                                                                                                                                                   |
| monoid-exponentiation・ABC448 E                         | res⊗power^kの不変式、連結対の演算、商の法拡張はある。左右のblock処理とshift、9が非可逆な例、先頭0のない制約、中間積の型幅を公式・短い十進展開まで確かめる。                                                                                                                                                             |
| 半環行列単元・ABC445 F・ABC236 G                        | 列vectorの積順、零元・単位元、exact長と待機の違いはある。単元のmax-minと問題のmin-maxを混同しない小例、INF・対角・全始点出力と累乗順を公式・短いwalk列挙まで確認する。                                                                                                                                                  |
| ABC366 G（rank単元は予約済み）                          | kernel基底のOR被覆の必要十分性とbit packingはある。自由変数からの具体的復元、孤立頂点・全rank・N=60の出力bit上限、時間/空間評価の単位を公式・小graphまで確認する。                                                                                                                                                      |
| XOR基底単元・ABC283 G・ABC451 G・ABC223 H・ABC249 G     | 既約化、coset最小の線形性、walkの両方向、全suffix不変量、非空な零表現は補強済み。k-thの狭義順位、同じ値の頻度、N−rankと射影rankの違いを公式・全subset/有限XOR状態と詳細照合する。                                                                                                                                       |
| 分離可能変換単元・ABC288 G・ABC212 H・ABC367 G          | butterfly・characterによる積への変換、標数2での非可逆性、三値逆変換、全nの巡回係数前計算はある。二軸の格納順、同時更新、有限冪和の0/1、空部分列、変換値からB_tを戻す整数/法上演算の区別を公式・直接変換まで確認する。                                                                                                   |
| Prüfer単元・ABC303 Ex                                   | 復号・次数の出現回数・EGFの因子はある。N=2、許容次数の最小値、階乗の上限、打切り冪の全費用を公式・全Prüfer列まで確認する。                                                                                                                                                                                              |
| orbit-counting・ABC284 Ex                               | stabilizerによる平均の証明、回転と反転の違い、辺orbitと全色使用の包除はある。非自明なorbitサイズの小例、cycle型の係数・同一cycle内と異cycle間の辺数、法PとN!の可逆性を公式・小graphまで確認する。ABC428 Gだけ予約済み。                                                                                                 |
| deletion-contraction（直接問題なし）                    | 全域木と彩色多項式で異なる符号、loop/bridge・多重辺・基底はある。関連ABC294 Exの低次数処理・縮約後の同一視と一般削除縮約の適用先を照合する。問題本文は別担当として予約しない。                                                                                                                                          |
| determinant-counting・ABC253 Ex・ABC323 G・ABC216 H     | LGVの符号反転と端点順、有向木の向き、木の空余因子、Hessenbergと係数反転、終点mask DPはある。形式多項式と数値の体、自己loop・平行辺、pivot0、操作順i!、反転の0埋めを公式・小木/小経路で詳細照合する。                                                                                                                    |
| poset-dilworth-antichain・ABC457 G・ABC237 Ex・ABC354 G | matchingから鎖への両方向、重みの概念上の複製・整数flow、cut復元、推移閉包と元DAGの違いはある。LDSの同値境界、回文の種類数、同一文字列の統合と比較不能なtwinの違いを公式・小posetまで詳細照合する。                                                                                                                      |
| ABC236 F（matroid二単元は予約済み）                     | 現稿には最適基底を保つ交換の詳しい証明がある。正価格から基底に絞る前提、最高bit消去・rank Nで停止、入力とsortの費用を公式・全subsetまで確認する。                                                                                                                                                                       |

関連55問は上の未予約57問にも新たな編集対象にも加えない。特にABC321 Gの初期改稿、ABC399
Gの乱択rank、母関数章のABC260 Ex・ABC294
Ex等を重複予約しない。英語混在、未定義記号、分類文の反復、検算指示だけの復習欄、未区切りTeXは、各ページの改稿・詳細確認で文脈に即して扱う。共通生成器・reader・rendererが原因と実証した症状はなく、基盤修正Issueや一括再生成は追加しない。

## 検証と限界

- Node.js 26.12.1 / npm
  11.20.0で`npm run notation:report -- <対象80原稿の実path>`を実行し、**80原稿・403候補・明示数式エラー0件**、exit
  0。397候補は58問題の「制約との対応」の未区切りTeX、残る6候補はABC285 Ex・ABC306 Ex・ABC331
  G・ABC267
  Gの係数抽出や配列添字の括弧escapeである。同文中の複数コマンドも別に数え、表示不具合403件とは数えない。npmは指定11.21.1との差を警告した。依存・lockfileは変更していない。
- 一時検算でABC458 Eは各個数1〜4・総長10以下の60組を全列生成と比較した。ABC309
  Gは1≤N≤8、1≤X≤5の40組を全順列と比較し、窓のbit対応とshift規約を確認した。
- ABC306
  ExはN≤4の全75単純グラフについて、重さ0,…,N−1の全割当てから得る比較結果集合とsource包除DPを比較した。範囲外の無辺graphも検算に含む。ABC276
  Exは2×2の全81行列を基準に、0〜2本のqueryの379集合で可解性と補助四隅からの復元結果を比較した。
- ABC428
  Gは1〜3種類、美しさ2〜4、max(b)≤U≤16の524組で、積DP・有理数のBurnside平均と全列の最小回転代表を比較した。単元のF2例の全8代入、三辺pathの全8辺集合も確認した。これらは補完案の小規模検算であり、大制約の実装・性能や完成教材の検証ではない。
- 変更Markdownの書式・ローカルリンク27参照、全18単元・62問の存在と現home、関連55問、後続Issueの編集path重複と残範囲を確認した。教材本文・分類JSON・共通表示は変更せず、文書PRとしてbuild・E2Eは実行していない。後続改稿では公式根拠・本文/claim・必要な既存schema/reader・本番subpathのbuild/内部リンク・対象の文章と表示まで確認する。

この調査の完成・merge後も、上記7件と未予約57問・14単元の詳細確認を#140の未完了範囲に残す。#182だけの完了でEpicを閉じない。
