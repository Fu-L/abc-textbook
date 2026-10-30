# A2：母関数・成分分解・畳み込み・FPSの本文調査

2026-10-30、[調査Issue #183](https://github.com/Fu-L/abc-textbook/issues/183)の14単元・39問を、main
`47142423`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)へ改稿対象と残範囲を渡す文書であり、**教材改修の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・full/短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

次表はhomeの`directProblemIds`を既存順で記す。掲載順の評価・再計算には使わない。問題本文は`src/content/docs/problems/`配下の各IDと同名のMarkdownへ一意に対応する。

| 対象単元                                                                                                                      | 現在の直接配置問題                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [generating-functions.md](../../src/content/docs/learn/combinatorics-algebra/generating-functions.md)                         | `abc422-g`, `abc352-g`, `abc267-ex`, `abc385-g`, `abc436-g`, `abc390-g`, `abc449-g`, `abc247-ex`, `abc297-ex`, `abc241-ex`, `abc225-h`, `abc281-ex`, `abc260-ex`, `abc345-g`, `abc317-ex` |
| [labeled-component-decomposition.md](../../src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md)   | `abc213-g`, `abc321-g`, `abc318-ex`, `abc386-g`, `abc327-g`                                                                                                                               |
| [polynomial-convolution.md](../../src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)                     | `abc392-g`, `abc291-g`, `abc432-g`, `abc409-g`, `abc307-ex`, `abc265-ex`                                                                                                                  |
| [polynomial-taylor-shift.md](../../src/content/docs/learn/combinatorics-algebra/polynomial-taylor-shift.md)                   | 直接配置なし                                                                                                                                                                              |
| [formal-power-series.md](../../src/content/docs/learn/combinatorics-algebra/formal-power-series.md)                           | `abc289-ex`                                                                                                                                                                               |
| [polynomial-multipoint-evaluation.md](../../src/content/docs/learn/combinatorics-algebra/polynomial-multipoint-evaluation.md) | `abc272-ex`                                                                                                                                                                               |
| [bostan-mori.md](../../src/content/docs/learn/combinatorics-algebra/bostan-mori.md)                                           | `abc300-ex`                                                                                                                                                                               |
| [generating-function-coefficients.md](../../src/content/docs/learn/combinatorics-algebra/generating-function-coefficients.md) | `abc279-ex`, `abc222-h`, `abc230-h`                                                                                                                                                       |
| [relaxed-convolution.md](../../src/content/docs/learn/combinatorics-algebra/relaxed-convolution.md)                           | `abc213-h`, `abc315-ex`                                                                                                                                                                   |
| [subset-convolution.md](../../src/content/docs/learn/combinatorics-algebra/subset-convolution.md)                             | `abc294-ex`                                                                                                                                                                               |
| [euler-circuit-counting.md](../../src/content/docs/learn/combinatorics-algebra/euler-circuit-counting.md)                     | `abc336-g`                                                                                                                                                                                |
| [rsk-young-tableaux.md](../../src/content/docs/learn/combinatorics-algebra/rsk-young-tableaux.md)                             | `abc378-g`                                                                                                                                                                                |
| [fps-composition-power-projection.md](../../src/content/docs/learn/combinatorics-algebra/fps-composition-power-projection.md) | `abc387-g`, `abc439-g`                                                                                                                                                                    |
| [linear-matroid-intersection.md](../../src/content/docs/learn/combinatorics-algebra/linear-matroid-intersection.md)           | `abc399-g`                                                                                                                                                                                |

この直接配置は計40問で、既に[#158](https://github.com/Fu-L/abc-textbook/issues/158)で改稿されたABC321
Gを除く39問が#183の固定範囲と一致する。14単元・39問の主要な説明、式・手順、正当性、境界・全体計算量、記法を一次確認した。
**代表5問（ABC422 G・ABC297 Ex・ABC409 G・ABC387 G・ABC390
G）は、同居claimと公式問題文・個別公式解説を再照合し、補完案を小規模列挙と比較した。**
後述の3単元は小例を具体化した改稿予約であり、全主張を数学監査済みとはしない。

範囲外の関連17問とABC321 Gでは、本分野へ接続する考察・正当性を照合した。特にABC236
Exの符号付き成分、ABC253 Exの木成分、ABC269 Exのheavy path、ABC323 Gのshift、ABC381
Gの等比点評価は参照したが、別担当の編集対象として予約しない。関連全節・全公式出典の詳細監査はしていない。対象39問・照合18問は全て`full`・`primaryProblemId: null`であり、短縮形式から追加でたどる参照元はない。

既存の補強を欠落扱いしない。単元にはOGF/EGFの定義・SETの条件、最小ラベルの成分、NTTの根の位数と折返し、Taylor
shiftの反転添字、FPSのNewton誤差と標数条件、多点評価の高速除法・補間、Bostan–Moriの偶奇抽出、Lagrange反転の留数による導出がある。online
convolutionのblock被覆・発動時刻、subset convolutionのunionとrank、BESTのlast-exit
treeの逆対応、RSKの逆挿入、合成の転置、線形matroid交差の非相殺と片側誤りも既に説明されている。

問題にもABC267 Exの積木全体の次数課金、ABC436 Gのoffset付き帯、ABC449 Gの最小項数と補正、ABC225
Hの固定席なし、ABC281 Exの局所積、ABC260 Exの二項反転、ABC317 Exの分母を払った行列、ABC318
Exの最小重み判定、ABC386 Gの閾値補正、ABC265 Exの応答戦略、ABC289 Exの偶奇・offset、ABC272
Exの階乗と反転回数、ABC230 H・ABC315 Exの因果的CDQ、ABC294 Exの巨大冪、ABC378 Gの追加不等式、ABC439
Gの法上の零、ABC399 Gのsuffix基底と誤り上界の補強がある。

## 詳しく確認した代表5問

公式根拠の再照合日は全て2026-10-30。引用は現稿の短い抜粋で、補う式・小例は独自案である。以下の診断は説明を補う場所の特定であり、既存の最終式が誤答になるという判定ではない。

### ABC422 G：同じサイズ分割の重みが変わる理由

[現稿](../../src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc422-g.md)の「考察」は「indistinguishable
ballsにはordinary generating
function」から始まり、三積の係数で手順へ進む。N!による復元はあるが、日本語の定義と、ひとつの分配に付く倍率を手で追う例がない。[公式問題](https://atcoder.jp/contests/abc422/tasks/abc422_g)・[個別公式解説](https://atcoder.jp/contests/abc422/editorial/13823)の二問の区別と照合した。

[#446](https://github.com/Fu-L/abc-textbook/issues/446)では、総数だけが三箱を結ぶことから、個数(a,b,c)を先に選ぶ。区別しない球では重み1、番号付きではラベルを各箱へ選ぶN!/(a!b!c!)通りとなる。公式例N=3、(A,B,C)=(1,2,3)の三つ組(3,0,0),(1,2,0),(0,0,3)は、前者で1+1+1=3、後者で1+3+1=5。EGFの係数は5/3!であり、最後のN!が何を戻すか分かる。0個、上限Nでの打切り、逆階乗とNTT長へつなぐ。素朴解は、二箱の個数を決めれば残りが決まるO(N²)とも比較する。

### ABC297 Ex：最大runと包除で結ぶ部品を区別する

[現稿](../../src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc297-ex.md)には「同値runの境界違反へ包除」「列をrun部品の列と見る」とあるが、g,fの定義と、不適な列が消える対応が薄い。[公式問題](https://atcoder.jp/contests/abc297/tasks/abc297_h)・[個別公式解説](https://atcoder.jp/contests/abc297/editorial/6141)の符号とmarkingを照合した。

[#447](https://github.com/Fu-L/abc-textbook/issues/447)では、元の列と等値隣接境界の部分集合を組にする。選択した境界だけを結合した部品(iをj個)の重みは(-1)^(j−1)x^(ij)y^j。部品同士の値は同じでもよく、最大runの一意分解とは違う。列(1,1,2)は境界未選択の+と最初の境界を選択した−で相殺され、どちらのy次数も**元の長さ3**である。違反b箇所の符号和(1−1)^bから、g=Σ_i
x^i y/(1+x^i y)、f=1/(1−g)へ進む。y微分が部品数ではなく元の列長を重みにすることを確認する。

実装へ渡す係数もG_n=Σ_{ij=n}(-1)^(j−1)、H_n=Σ_{ij=n}(-1)^(j−1)jと明記する。i,j≥1、ij≤Nの寄与を足してH/(1−G)²を計算し、定数項・逆元・約数寄与を含む全体O(N
log N)までつなぐ。

### ABC409 G：時刻和を示してから添字を分離する

[現稿](../../src/content/docs/problems/mathematics/outcome-compute-convolution-or-correlation/outcome-compute-convolution-or-correlation-shard-001/abc409-g.md)は初登場確率と倍率を示した後、「F_j=f(j)(N-j-2)!、G_i=…」へ飛ぶ。操作番号と畳み込み添字が同じiで、読む係数N−kを導けない。[公式問題](https://atcoder.jp/contests/abc409/tasks/abc409_g)・[個別公式解説](https://atcoder.jp/contests/abc409/editorial/13172)で操作回数と期待倍率を再照合した。

[#448](https://github.com/Fu-L/abc-textbook/issues/448)では操作番号をtとし、k≥2について
`E_k=Σ_{t=k−1}^{N−1} C(t−1,k−2)p^(k−1)(1−p)^(t−k+1)f(N−t−1)`
と書く。s=t−k+1、j=N−t−1と置けばs+j=N−k、(t−1)!=(N−j−2)!となり、二列の係数が分離する。fの必要範囲も0,…,N−2と固定できる。倍率は条件付き期待増分が個数に線形だから掛けられ、個数と未来の独立性を別途仮定しない。

N=3,p=1/2ならE_2=(1/2)(5/4)+(1/2)(1/2)=7/8、E_3=1/4。E_1=3−E_2−E_3=15/8まで追い、初登場の時刻・残回数・保存則を結ぶ。

### ABC387 G：回路の定義から閉路構造と係数1/2へ進む

[現稿](../../src/content/docs/problems/mathematics/outcome-compose-series-and-project-powers/outcome-compose-series-and-project-powers-shard-001/abc387-g.md)の「正当性」は辺共有caseを「対称差の最短閉路を使ってより小さい閉路対へ帰納」とするが、帰納の縮小量が見えない。G=x+Σx^p/2も、根を持つ閉路で2だけを割る理由が薄い。[公式問題](https://atcoder.jp/contests/abc387/tasks/abc387_g)の回路は頂点の再訪を許し、辺の再使用を許さない。[個別公式解説](https://atcoder.jp/contests/abc387/editorial/11727)の構造・EGF・Newtonを再照合した。

独自論証の重い一問として[#449](https://github.com/Fu-L/abc-textbook/issues/449)に分ける。辺を共有しない二奇閉路が頂点を共有すれば、連結した辺列が偶数長回路になる。辺共有caseの補完案は、一方の閉路の外へ出て再び戻る他方のpathを取り、内部が元閉路に交わらない区間を選ぶこと。元閉路の二つの弧と合わせると内部頂点を共有しない三本のu-v
pathになり、二本は同じ偶奇長なので偶数長の単純閉路を作れる。逆方向はbridgeを回路に使えないことから示す。

根の属するblockを単頂点または素数長閉路とし、bridgeで付く子の集合からU=x exp
Fへ進む。p個のラベルの一つを根にし、残りを巡回順に並べて逆向きを同一視するとp·(p−1)!/2通り。EGF係数が1/2となり、根が開始点なのでpでは割らない。F=U+ΣU^p/2から、既存のNewton更新・J(0)=−1・倍精度と、根の倍率を除く(N−1)!を保って説明する。

### ABC390 G：桁別次数の増え方から費用をそろえる

[現稿](../../src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc390-g.md)の「考察」は全体O(N
log N)、「時間」はO(N log²N+N log_10
N)とする。後者は緩い上界として成り立つが、より強い評価への理由がない。一次因子の除去も「筆算してO(N)」で終わる。[公式問題](https://atcoder.jp/contests/abc390/tasks/abc390_g)・[個別公式解説](https://atcoder.jp/contests/abc390/editorial/11976)で桁別因子と合成順を照合した。

[#450](https://github.com/Fu-L/abc-textbook/issues/450)では、F^0=(1+10^b
x)Q_bの係数比較からq_0=F^0_0、q_r=F^0_r−10^b
q_(r−1)を導く。rは後方の要素数で、桁数合計は係数の10冪に含む。q_r
r!(N−1−r)!が左右の順序を戻す一対一対応を示す。

各桁の多項式係数C(C_b,r)10^(br)を作って小桁から合成すると、各段の次数はmin(N,10^b−1)程度に幾何的に増える。最後の一段も含め積の費用和はO(N
log N)、全桁の除算・内積はO(N log_10
N)。一般の一次因子積木とは区別し、考察と計算量節をそろえる。N=1と9→10などの桁境界も扱う。

## 後続改稿と優先順

7件を#183の標準Sub-issueとして作成した。各Issueに対象path・症状・補う説明・公式根拠・検算・保持条件を記載している。**5問・3単元の編集path8本に重複はなく、必須先行mergeもない。**
優先は学習への影響に基づき、教材内の問題順を変える指示ではない。

| 優先   | Issue                                                   | 編集対象と到達点                                                                               |
| ------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 先     | [#447](https://github.com/Fu-L/abc-textbook/issues/447) | ABC297 Ex：選択境界の包除と長さmarkを対応させる。                                              |
| 先     | [#448](https://github.com/Fu-L/abc-textbook/issues/448) | ABC409 G：初登場の時刻和から係数N−kを導く。                                                    |
| 先     | [#449](https://github.com/Fu-L/abc-textbook/issues/449) | ABC387 G：偶数回路の構成と根付き閉路のEGFを一問で証明する。                                    |
| 次     | [#446](https://github.com/Fu-L/abc-textbook/issues/446) | ABC422 G：同じ分配例でOGF/EGFの倍率を読む。                                                    |
| 次     | [#450](https://github.com/Fu-L/abc-textbook/issues/450) | ABC390 G：一次除算の再帰と桁別次数の総費用を示す。                                             |
| 並行可 | [#451](https://github.com/Fu-L/abc-textbook/issues/451) | generating-functions・labeled-component-decomposition：部品の積と3ラベルの成分分類を手で追う。 |
| 並行可 | [#452](https://github.com/Fu-L/abc-textbook/issues/452) | fps-composition-power-projection：固定するg、入力の反転、転置を同じ小行列で追う。              |

二単元の小例では(1+x)(1+x²)の部品選択から始め、3ラベル上の全単純グラフ8個を最小ラベルの成分サイズで2+2+4へ分ける。連結4個、ラベル選択二項係数、EGFの3!を同じ対象で結ぶ。ラベルごとに使える辺が異なる場合は同サイズでも個数が異なりsubsetが必要となる。[ABC213 G公式解説](https://atcoder.jp/contests/abc213/editorial/2392)も再照合した。既存の符号和h(n)・空集合・可逆性・成分間制約は保持する。

合成単元は精度x^4、g=x+x²とし、行列Aの列を1,g,g²,g³から作る。f=(1,2,3,4)にAf=(1,2,5,10)、w=(5,6,7,8)にAᵀw=(5,13,23,8)。h=(8,7,6,5)からの[x³]h
g^kも後者へ一致し、内積は両方向とも132となる。小例で反転と転置を区別した後、既存の散布・相関・二変数縮約と次数/費用評価へ戻す。高速算法を小例の二乗計算へ置き換えない。

## 一次確認にとどめ、詳細確認へ残す範囲

**未予約34問・11単元**を次のまとまりに残す。予約済み単元に属する未予約問題も含む。既に説明があることを「修正不要・品質確認済み」とはせず、公式再照合・境界の検算を伴う詳細確認を#140で追う。

| 残る範囲                                                                                                                                                               | 既にある説明と、次に確認すること                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 母関数の残り12問：`abc352-g`, `abc267-ex`, `abc385-g`, `abc436-g`, `abc449-g`, `abc247-ex`, `abc241-ex`, `abc225-h`, `abc281-ex`, `abc260-ex`, `abc345-g`, `abc317-ex` | 生存確率、挿入の因子、一次分母、局所積などはある。ABC352 GのS<法と分母、ABC385 Gの挿入前サイズ・空積、ABC247 Exの最短swapの証明、ABC241 Exの部分分数と巨大指数の実行費用を次に照合する。帯・二項反転・固定席なし・分母を払う行列などの既存補強を保持し、small caseから全体計算量まで再確認する。母関数単元自体は#451で予約済み。 |
| 成分分解の4問：`abc213-g`, `abc318-ex`, `abc386-g`, `abc327-g`                                                                                                         | anchorによる一意分解、片方ACのEGF、閾値補正、彩色付きから連結を取り出す二段階はある。全subsetの計算順、ラベル重みの独立性、k=Mの0冪、彩色交換の2倍と孤立点、単純supportへの全射、辺数合成の総費用を公式・小graphまで照合する。単元は#451、ABC321 Gは#158の既存担当。                                                             |
| 畳み込み単元・残り5問：`abc392-g`, `abc291-g`, `abc432-g`, `abc307-ex`, `abc265-ex`                                                                                    | 対角/順序補正、相関の反転、階乗正規化、二乗差と法未満、加算×XORの勝敗がある。ABC291 Gの係数N−1+sを単元の導出と読み合わせ、ABC307 Exの符号上限とpadding、ABC265 Exの軸長・空間の実サイズを公式・小列まで確認する。ABC409 Gのみ#448で予約済み。                                                                                    |
| Taylor shift単元（直接問題なし）                                                                                                                                       | 反転列とC_(N−i)/i!、a=0、階乗可逆性はある。低次数の展開を通して反転の向きと全変換長を確認する。関連ABC323 GはO(N²)のshiftで十分と明記され、本文を重複予約しない。                                                                                                                                                                |
| FPS基本演算単元・`abc289-ex`                                                                                                                                           | 誤差倍増、log/expの精度、冪の正規化と同地点初期のrenewal、圧縮offsetはある。微分/積分の最終次数、定数項0/1の役割、T=0・会合不能と範囲外階乗を公式・小walkで詳細確認する。                                                                                                                                                        |
| 多点評価単元・`abc272-ex`                                                                                                                                              | 剰余木の不変量・高速除法・補間、等比点のchirp-z、微分DPの指数変換がある。重複評価点と補間不能の差、反転除法の0埋め、二回の階乗正規化と初期表の偶奇を公式・小点列で確認する。                                                                                                                                                     |
| Bostan–Mori単元・`abc300-ex`                                                                                                                                           | 分母偶化・K=0、初期Pとsubmaskの偶奇和はある。積の後で抽出する順序と一般手順の打切り表現を読み合わせ、N=0・K=1・連続1-bitを直接列挙で照合する。                                                                                                                                                                                   |
| 係数抽出単元・`abc279-ex`, `abc222-h`, `abc230-h`                                                                                                                      | 有限Euler積の低次数、到達可能性の両方向、Lagrangeと微分再帰、二列CDQがある。五角数の二系列・Lucas、根葉/隣接0、必要な逆元範囲、倍数更新と積の一意な配送を公式・小木/小係数まで詳細照合する。                                                                                                                                     |
| online convolution単元・`abc213-h`, `abc315-ex`                                                                                                                        | blockの被覆と締切、正時間の因果性、l=0の自己積・l>0の二方向がある。単元の発動時刻と問題のCDQの対応、道路両方向、積の次数と寄与先n=s+1、prefixを小時刻の表で照合する。                                                                                                                                                            |
| subset convolution単元・`abc294-ex`                                                                                                                                    | unionとrankを分けた証明、低次数簡約、ranked領域でのK乗再帰、分岐全体の費用がある。早期rank打切りをしない理由、loop/並行辺、K=1・空graph、最大葉の表領域を公式・全彩色で確認する。#166のsubset変換を重複予約しない。                                                                                                              |
| BEST単元・`abc336-g`                                                                                                                                                   | 根を除くlast-exit treeと逆対応、補助辺を先頭固定する手順、自己loopを除くLaplacianがある。先頭固定と始点固定、s=t、単頂点・未使用頂点、多重辺階乗除算を小binary列から公式へ照合する。                                                                                                                                             |
| RSK単元・`abc378-g`                                                                                                                                                    | P/Qの構築・逆操作、hook、追加不等式の必要十分性と整数keyがある。LDSの定理への接続、二盤の独立性、ideal状態数・bit位置、最小A,Bを小順列/盤まで照合する。                                                                                                                                                                          |
| `abc439-g`（合成単元は#452で予約済み）                                                                                                                                 | 冪列の係数式、手番順の指数、法上0なら最後の人だけ別計算する分離はある。N=1、L=2、最後のf_N=0、分数積木の次数とN/Lの総費用を公式・小確率過程で確認する。                                                                                                                                                                          |
| 線形matroid交差単元・`abc399-g`                                                                                                                                        | 非零minorの非相殺、Vandermonde、suffix基底、区間全体の誤り上界はある。二つの独立性とrow blockの対応、pivot交換時の正規化、行位置から色境界への復元、構築O(MS)を公式・小全域木で照合する。A1のmatroid親子二単元と重複予約しない。                                                                                                 |

英語混在・分類文の反復・検算指示だけの復習欄・未区切りTeXは、各ページの改稿や詳細確認で文脈に即して扱う。全ページへ同じ節や例を追加しない。共通生成器・reader・rendererが原因と実証した症状はなく、基盤修正Issueや一括再生成は追加しない。

## 検証と限界

- Node.js 26.12.1 / npm
  11.20.0で`npm run notation:report -- <対象53原稿の実path>`を実行し、**53原稿・263候補・明示数式エラー0件**、exit
  0。256候補は38問題の「制約との対応」の未区切りTeX、残る7候補はABC225 H・ABC281 Ex・ABC279
  Ex・ABC222 H・ABC439 Gの係数抽出括弧のMarkdown
  escapeである。複数コマンドも別々に数えており、表示不具合263件とは数えない。npmは指定11.21.1との差を警告した。依存・lockfileは変更していない。
- 対象39問と照合18問の正当性節は、同居claimと既存validator同様の括弧escape正規化後に一致した。一致を数学的正しさの保証とはしない。
- 一時検算でABC422 GはN=1..7、A,B,C=1..4の448組を三つ組/球ラベル割当てと比較。ABC297
  ExはN=1..12の全compositionで合法列の長さ和・係数式・等値境界の符号相殺を比較した。
- ABC409 GはN=2..7、p=0,1/4,1/2,1の24組を個数vectorの全確率遷移と有理数で比較。ABC387
  GはN≤5の連結単純グラフ772個で全閉じたtrailの条件と構造を比較し、独立の低次EGFからも根なし個数1,1,4,28,287が一致した。ABC390
  GはN=1..8の全順列の連結値総和、N=1..10の全後方部分集合と一次因子除去を比較した。
- 単元の小例では3ラベルの成分分類とa_3=2+2+4、合成の直接行列積・反転後の係数抽出・内積132を確認した。これらは補完案の検算であり、一般の論証、大制約の実装・性能、完成教材の表示検証ではない。
- 変更Markdownの書式・ローカルリンク、対象14単元・39問の存在と現home、照合18問、後続Issueのpath重複と残範囲を確認した。教材本文・分類JSON・共通表示は変更せず、文書PRとしてbuild・E2Eは実行していない。後続改稿では公式根拠・本文/claim・必要な既存schema/reader・本番subpathのbuild/内部リンク・対象の文章と表示を確認する。

この調査の完成・merge後も、上記7件と未予約34問・11単元の詳細確認を#140の未完了範囲に残す。#183だけの完了でEpicを閉じない。
