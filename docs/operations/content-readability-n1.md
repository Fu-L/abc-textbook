# N1：素因数・合同・周期・数論の発展の本文調査

2026-10-29、[調査Issue #181](https://github.com/Fu-L/abc-textbook/issues/181)の21単元・45問を、main
`ec08f8d3`で一次確認した。[親Epic #140](https://github.com/Fu-L/abc-textbook/issues/140)へ具体的な改稿と残範囲を渡す文書であり、**教材改稿の完了ではない。**
[憲章](../../.specify/memory/constitution.md)・[更新マニュアル](update-manual.md)・[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)・fullと短縮形式のテンプレートを基準に読んだ。

## 対象と確認の深さ

homeの`directProblemIds`を既存順で記す。分類・難易度順を再計算する表ではない。問題本文は`src/content/docs/problems/`配下の同名Markdownへ一意に対応する。

| 対象単元                                                                                                              | 担当Problem ID                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [index.md](../../src/content/docs/learn/number-theory/index.md)                                                       | 直接配置なし                                                                                                            |
| [prime-divisor.md](../../src/content/docs/learn/number-theory/prime-divisor.md)                                       | `abc400-e`, `abc393-e`, `abc259-e`, `abc445-e`, `abc420-g`, `abc412-e`, `abc384-f`, `abc227-g`, `abc322-g`              |
| [gcd-structure.md](../../src/content/docs/learn/number-theory/gcd-structure.md)                                       | `abc254-f`, `abc438-g`                                                                                                  |
| [gcd-diophantine.md](../../src/content/docs/learn/number-theory/gcd-diophantine.md)                                   | `abc340-f`, `abc315-g`, `abc271-ex`                                                                                     |
| [modular-product-foundations.md](../../src/content/docs/learn/number-theory/modular-product-foundations.md)           | 直接配置なし                                                                                                            |
| [modular-arithmetic.md](../../src/content/docs/learn/number-theory/modular-arithmetic.md)                             | 直接配置なし                                                                                                            |
| [dynamic-modular-product.md](../../src/content/docs/learn/number-theory/dynamic-modular-product.md)                   | 直接配置なし                                                                                                            |
| [modular-congruence.md](../../src/content/docs/learn/number-theory/modular-congruence.md)                             | `abc460-e`, `abc286-f`, `abc423-g`, `abc245-ex`                                                                         |
| [integer-boundary-blocks.md](../../src/content/docs/learn/number-theory/integer-boundary-blocks.md)                   | `abc230-e`, `abc414-e`, `abc452-e`, `abc356-e`, `abc240-f`, `abc293-f`, `abc318-f`, `abc253-g`, `abc239-ex`, `abc429-g` |
| [modular-periodicity.md](../../src/content/docs/learn/number-theory/modular-periodicity.md)                           | `abc319-e`, `abc228-e`                                                                                                  |
| [multiplicative-order-periods.md](../../src/content/docs/learn/number-theory/multiplicative-order-periods.md)         | `abc222-g`                                                                                                              |
| [cyclic-group-exponent-counting.md](../../src/content/docs/learn/number-theory/cyclic-group-exponent-counting.md)     | `abc212-g`, `abc335-g`                                                                                                  |
| [baby-step-giant-step.md](../../src/content/docs/learn/number-theory/baby-step-giant-step.md)                         | `abc270-g`                                                                                                              |
| [euclidean-floor-sum.md](../../src/content/docs/learn/number-theory/euclidean-floor-sum.md)                           | `abc443-g`, `abc283-ex`, `abc402-g`                                                                                     |
| [rational-approximation.md](../../src/content/docs/learn/number-theory/rational-approximation.md)                     | `abc408-g`, `abc333-g`                                                                                                  |
| [stern-brocot-ancestry.md](../../src/content/docs/learn/number-theory/stern-brocot-ancestry.md)                       | `abc273-ex`                                                                                                             |
| [numerical-semigroup-reachability.md](../../src/content/docs/learn/number-theory/numerical-semigroup-reachability.md) | `abc388-f`                                                                                                              |
| [finite-field-frobenius.md](../../src/content/docs/learn/number-theory/finite-field-frobenius.md)                     | `abc251-ex`                                                                                                             |
| [finite-field-extension.md](../../src/content/docs/learn/number-theory/finite-field-extension.md)                     | `abc381-g`                                                                                                              |
| [gaussian-integers-two-squares.md](../../src/content/docs/learn/number-theory/gaussian-integers-two-squares.md)       | `abc444-g`                                                                                                              |
| [min25-sieve.md](../../src/content/docs/learn/number-theory/min25-sieve.md)                                           | `abc370-g`                                                                                                              |

全66原稿の主要な説明、正当性、境界・計算量と記法を一次確認した。**代表5問（ABC429 G・ABC438
G・ABC322 G・ABC270 G・ABC333 G）は、同居claimと公式問題文・個別公式解説まで再照合した。** ABC445
Eは複数caseの前処理・初期化だけを追加公式照合した。全原稿の詳細な数学監査・ブラウザー表示確認とは区別する。

範囲外の関連107問は数論につながる記述を読み、葉単元側の関連29問についても適用先を照合した。章入口・法上の演算の親子は広い関連集合を持つため、107問の全解法を詳細確認したとはしない。担当45問・関連107問は全て`full`、`primaryProblemId: null`で、追加で読む短縮形式の参照元はない。担当45問の正当性と同居claimのtextは一致するが、一致を数学的正しさの保証とはしない。

既に、ABC245 Exの固定剰余ごとの状態と長さ1の初期化、ABC452 Eの商0、ABC356 Eの商区間、ABC384
Fの対角、ABC271 Exの六型交換、ABC388 Fの閾値と全保持点間の一歩、ABC273 Exの厳密なrun打切り、ABC402
Gの三moment再帰、ABC381 Gの正規化因子、ABC444 Gの前周期を除いた中央集計、ABC370
Gの二段の篩は補強されている。各対応Unitの詳しい手順・証明も欠落扱いせず、残る説明を選んだ。

## 詳しく確認した代表5問

公式根拠の再照合日は全て2026-10-29。引用は現稿の短い抜粋、補う式・反例・小例は独自案である。

### ABC429 G：通常の隣接差はM/D以下とは限らない

[現稿](../../src/content/docs/problems/mathematics/outcome-evaluate-compressed-integer-blocks/outcome-evaluate-compressed-integer-blocks-shard-001/abc429-g.md)の「考察」は「最初のD個の剰余」の値順の隣接差の最小hについて「M/D以下」とする。M=11,A=3,B=0,D=4,N=5では、最初の四項は0,3,6,9で、h=3>11/4である。**定数を含む不等式の訂正であり、平方根本数という漸近結論の反例ではない。**

[公式問題](https://atcoder.jp/contests/abc429/tasks/abc429_g)・[個別公式解説](https://atcoder.jp/contests/abc429/editorial/14242)にも同じ境界がある。通常のD−1個のgapの和は高々M−1なので、h≤(M−1)/(D−1)なら保証できる。D≥2、D≈√MならこれでO(M/D)を保てる。D+1点を取る修正も可能だが、点数・短いNの分岐を一つの規約にそろえる。

[#408](https://github.com/Fu-L/abc-textbook/issues/408)で、値順と時刻順の違いからAd≡±hとなる理由、k
mod
dでの部分列化、折返し直前までの項数を整数除算で決める手順へつなぐ。初期d本を含むO(d+hN/M)の評価は現稿に既にある。上例なら0,3,6,9と1の二列に分かれる。gcd縮約の底のg乗・余り因子、完全周回、負方向を小さい指数から並べ直す手順、合成数Rで割り算を使わない冪和の合成まで、一問で扱う。

### ABC438 G：gcdで分けた後の時刻と円環開始位置を定義する

[現稿](../../src/content/docs/problems/mathematics/outcome-reduce-integer-structure-by-gcd/outcome-reduce-integer-structure-by-gcd-shard-001/abc438-g.md)の「考察」は「各A_kから出現回数とB′上の開始・長さを計算」とする。minの個数・総和への分解とFenwick処理はあるが、gcd分割後のKと開始位置の式を読者が埋める必要がある。

g=gcd(N,M)、剰余rごとにi=r+gt、N′=N/g,M′=M/gとする。局所配列をA^(r)_j=A_{r+gj}、B^(r)_u=B_{r+gu}と定め、局所時刻数をK_r=max(0,1+floor((K−1−r)/g))とする。j固定の出現回数はc=max(0,1+floor((K_r−1−j)/N′))。B′_u=B^(r)_{N′u
mod M′}と置くと、開始位置はj(N′)^{-1} mod M′である。M′=1は開始0とする。

例えばN=4,M=6,K=13、r=1ではK_r=6、縮約長2,3。j=1の元の時刻は3,7,11、Bの添字は3,1,5である。局所B添字は1,0,2、B′の元添字順は1,5,3なので、開始2から三項を読むと一致する。全周回と端数を分け、端数だけを高々二区間へする。

[公式問題](https://atcoder.jp/contests/abc438/tasks/abc438_g)・[個別公式解説](https://atcoder.jp/contests/abc438/editorial/14946)の帰着と照合した。[#409](https://github.com/Fu-L/abc-textbook/issues/409)で、公式の添字表現を転載するのでなく、この写像から出発して閾値同値・整数の商・法上の積まで具体化する。

### ABC322 G：重みの急増を証明してから貪欲復号する

[現稿](../../src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc322-g.md)は「D_eが低位digit全和より大きい」と宣言するが、なぜその不等式が成り立つかを導かない。[公式問題](https://atcoder.jp/contests/abc322/tasks/abc322_g)・[個別公式解説](https://atcoder.jp/contests/abc322/editorial/7306)も式変形の詳細を省略しているため、教科書側で行間を補う。

a>b≥2、s=a−b、D_e=a^e−b^eとすると、次の恒等式で必要な不等式が分かる。

```text
D_e − (b−1)Σ_{i=0}^{e−1}D_i = sΣ_{i=0}^{e−1}a^i > 0
```

桁上限d=min(10,b)では下位桁の寄与はさらに小さい。よって上位重みで割った商が唯一の可能な桁であり、d以上なら不可能、全桁が範囲内で残余0なら十分となる。a=3,b=2ではD_1=1,D_2=5,D_3=19、X=6のprefixは高位から1,1と決まる。末尾D_0=0は自由なので、全Sが高々一つという意味にはしない。

[#410](https://github.com/Fu-L/abc-textbook/issues/410)で、二桁の区間和、三桁以上のs|Xとs(2b+s)≤X、prefixの一意復号をつなぐ。a^e,b^eを別々にX+1へ飽和して引く方法は差を失うため、D_{e+1}=bD_e+s
a^eなど正項だけの式と乗算前の上限判定を具体化する。重い独自論証はこの一問に限定する。

### ABC270 G：逆写像と合成を、実際の衝突表へ落とす

[現稿](../../src/content/docs/problems/mathematics/outcome-find-orbit-hit-by-bsgs/outcome-find-orbit-hit-by-bsgs-shard-001/abc270-g.md)は「inverseもaffine
function」「compositionによりf^M」とするが、逆写像・合成式がない。[BSGS Unit](../../src/content/docs/learn/number-theory/baby-step-giant-step.md)には一致条件、最小j、giant一回を高速に行う必要条件は既にある。両ページに具体的な衝突例を補う。

f^{-1}(y)=A^{-1}(y−B)、(a,b)を(c,d)の後に適用する合成は(ac,ad+b)と、代入から示す。P=5,A=2,B=1,S=1,G=0、幅W=3なら、逆側babyは0,2,3、順側giantは1,0で、i=1,j=0から最小時刻3を得る。一方、P=11,A=10,B=0,S=1,G=10,W=4ではbabyが10,1,10,1となる。key1を最後のj=3で上書きすると最小時刻1を失うため、最小jを残す。

[公式問題](https://atcoder.jp/contests/abc270/tasks/abc270_g)・[個別公式解説](https://atcoder.jp/contests/abc270/editorial/4847)の可逆性・短周期の注意と照合した。[#411](https://github.com/Fu-L/abc-textbook/issues/411)で、S=G、A=0の分岐、探索範囲0≤iW+j<P、i昇順の最初の衝突の最小性へつなぐ。Unit冒頭の群版と後半の可逆写像版は、表の向きを取り違えない説明にする。辞書の最悪時間とhashの期待時間も区別する。

### ABC333 G：初期値と打切り後の二候補を具体化する

[現稿](../../src/content/docs/problems/mathematics/outcome-approximate-rational-by-euclid/outcome-approximate-rational-by-euclid-shard-001/abc333-g.md)の「考察」はq_prev,q_prevprevを定義せず、収束分数の初期値・分子側更新・打切り後の二候補を省く。対応する有理近似Unitには隣接境界の式、最良性、誤差比較と小例が既にある。

[公式問題](https://atcoder.jp/contests/abc333/tasks/abc333_g)・[個別公式解説](https://atcoder.jp/contests/abc333/editorial/7937)の分母打切りと同値規則を再照合した。r=0.41,N=3なら、完全な収束分数だけでは0/1,1/2だが、中間分数1/3の方が近い。この独自小例で「最後の係数を途中まで進める」必要性を示せる。

[#412](https://github.com/Fu-L/abc-textbook/issues/412)で、連分数版かUnitの隣接境界版を一つ選び、初期値・更新・完全一致・分母制限・二候補の回収へつなぐ。連分数版なら分子分母それぞれ二組の初期値と、初期分母0で割らない条件を明示する。誤差は整数の交差積で比べ、同値は小さい分数へする。公式の64bit
CRT比較を必須とせず、十分な整数幅の簡潔な手順でよい。

## 一次確認から具体化した小batch

以下は代表5問と同じ深さの全節監査ではない。既存の手順を削らず、前処理の適用範囲や最小の小例を補う。

- **ABC445
  E**：「時間」のV=10^7の篩と各caseの指数表の初期化が区別されていない。T≤10^5、ΣN≤2×10^5だけではO(TV)の初期化を抑えられない。[公式問題](https://atcoder.jp/contests/abc445/tasks/abc445_e)の複数case制約と[個別公式解説](https://atcoder.jp/contests/abc445/editorial/15897)の一回の篩・case内mapを2026-10-29に追加照合した。[#413](https://github.com/Fu-L/abc-textbook/issues/413)で、共有篩と出現素数だけの初期化を明記して全case計算量をそろえる。公式の手順箇条書きは除く条件が本文・実装と食い違うため、現稿の正しいe=e1を保つ。
- **modular-product-foundations・modular-arithmetic・dynamic-modular-product**：逆元の存在、二分累乗、(z,P)の更新はあるが、整数除算との違いと零復帰を追う例がない。[#414](https://github.com/Fu-L/abc-textbook/issues/414)で、mod
  7の8/2、mod
  6の非可逆な2、因子(2,7,14)から7と14を順に除いて0から2へ戻る例をつなぐ。親の累乗による逆元計算には素数法の条件を添える。
- **modular-congruence**：一次合同とCRTの式はある。[#415](https://github.com/Fu-L/abc-textbook/issues/415)で、6x≡4
  mod10の代表4,9を4 mod5へまとめ、1 mod6と3 mod10を13 mod30へ統合する例を補う。後者を2
  mod10へ替えると不両立。n′=1では逆元を取らない境界もCRT側へ明記する。
- **cyclic-group-exponent-counting**：位数の式・φ・部分群の一意性はある。[#416](https://github.com/Fu-L/abc-textbook/issues/416)で、法7の生成元3の指数と位数を並べ、2,4が同じ位数3の部分群を生成し、位数2の部分群とは包含しない例を補う。生成元で理論を説明することと、実装で離散対数を求めることを区別する。

## 後続改稿と優先順

6問・6単元を9件へ分けた。各Issueに編集path、症状、直す説明、公式根拠、個別検算、既存検証、依存を記し、編集path12本は重複しない。

| 優先する課題             | 後続Issue                                               | 編集対象                       |
| ------------------------ | ------------------------------------------------------- | ------------------------------ |
| 小歩幅の定数境界と分割   | [#408](https://github.com/Fu-L/abc-textbook/issues/408) | ABC429 G                       |
| gcd後の時刻と円環の添字  | [#409](https://github.com/Fu-L/abc-textbook/issues/409) | ABC438 G                       |
| 貪欲復号を保証する不等式 | [#410](https://github.com/Fu-L/abc-textbook/issues/410) | ABC322 G                       |
| 逆写像から最小到達時刻へ | [#411](https://github.com/Fu-L/abc-textbook/issues/411) | ABC270 G・baby-step-giant-step |
| 分母打切りと二候補の回収 | [#412](https://github.com/Fu-L/abc-textbook/issues/412) | ABC333 G                       |
| 全caseの前処理・初期化   | [#413](https://github.com/Fu-L/abc-textbook/issues/413) | ABC445 E                       |
| 整数除算・可逆性・零復帰 | [#414](https://github.com/Fu-L/abc-textbook/issues/414) | 法上の演算の親子三単元         |
| 非互いに素な解集合の統合 | [#415](https://github.com/Fu-L/abc-textbook/issues/415) | modular-congruence             |
| 位数と部分群包含の意味   | [#416](https://github.com/Fu-L/abc-textbook/issues/416) | cyclic-group-exponent-counting |

各1 Issue＝1
PR、必須先行mergeなし。#140の直接Sub-issue数の上限を踏まえ、全9件を#181の標準Sub-issueへ登録し、#140
→ #181 →
#408〜#416でたどれる。調査文書のmergeや他分野の調査完了を直列ゲートにしない。共通生成器・reader・renderer起因の再現は実証しておらず、基盤改修・一括再生成は追加しない。

## 一次確認のみの残範囲

**未予約39問・15単元**の詳細確認を#140の未完了として残す。予約ABC445
Eと6単元も、上記の限定診断を超える確認は後続で行う。下表は既存説明と次の確認点であり、修正不要・品質確認済みの一覧ではない。

| 残る範囲                                                                                                           | 既存の説明と次の詳細確認                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 章入口・prime-divisor、ABC400 E・ABC393 E・ABC259 E・ABC420 G・ABC412 E・ABC384 F・ABC227 G                        | 平方根への変換、倍数篩の最大可解約数、LCMの一意最大、符号付き約数、区間篩、2進指数の層差、分子短区間の残存素因数はある。篩の初期化、欠けた指数0、m=0・負X、残存因子の素数性、対角登録、K=0の空区間を公式・直接法まで確認する。ABC445 E・ABC322 Gのみ予約済み。       |
| gcd-structure、ABC254 F                                                                                            | 双方向の整除による差分への帰着、空差分の単位元0、gcd演算の費用はある。長方形から二本の差区間へ落とす小例と、全同値・一行・一列・負差を公式と確認する。ABC438 Gは予約済み。                                                                                           |
| gcd-diophantine、ABC340 F・ABC315 G・ABC271 Ex                                                                     | 拡張Euclidの係数更新、全解のparameterと符号別の範囲、面積の符号、三変数の一軸列挙、八方向の六型交換と一軸一回の例外はある。出力座標の上界、途中積、負の基準解のfloor/ceil、交換の全型を公式・直接探索まで確認する。                                                  |
| ABC460 E・ABC286 F・ABC423 G・ABC245 Ex                                                                            | 桁数別の合同、108頂点の周期packing、短い側の列挙と本体をコピーしない比較、素数冪ごとの固定剰余への個数はある。19桁、対話の0/1-index、leading zero、縮約法1、長さ0では一様でない状態を公式・小列挙まで確認する。CRT Unitだけ予約済み。                                |
| integer-boundary-blocks、ABC230 E・ABC414 E・ABC452 E・ABC356 E・ABC240 F・ABC293 F・ABC318 F・ABC253 G・ABC239 Ex | 商一定区間、商0、同値pair、二重累積の二次式、桁数固定の基数区間、整数event点、完全行の右回転、期待値の自己ループ除去はある。ABC230 Eの考察と証明の二通りの分割の境界、二次式の整数候補、非単調な可否、商状態全体の費用を公式・直接法で確認する。ABC429 Gは予約済み。 |
| modular-periodicity、ABC319 E・ABC228 E                                                                            | 前周期μ・周期λの位置復元、非可逆な底の例外、所要時間だけが840周期、外側の底Mの分岐はある。有限状態の周期と時刻shiftの同変性の違い、指数0と周期で0になった正指数の違いを小例・公式まで確認する。                                                                      |
| multiplicative-order-periods、ABC222 G                                                                             | 素因数を割り落とす最小性、10と法の互いに素条件、9を法逆元にしない整数の可除性変形はある。Unitの割落しと問題の約数昇順探索を区別し、正当性のLと考察のM′の記号対応、φの前処理・全case費用を公式・余り列挙まで確認する。                                                |
| ABC212 G・ABC335 G                                                                                                 | 約数上の差し引き、位数だけによる包含、mixed-radixのzetaはある。生成元の構成が不要な理由、指数0と正の冪の対応、全元と入力頻度の違い、各軸の更新順・128bit積を公式と検算する。Unitだけ予約済み。                                                                       |
| euclidean-floor-sum、ABC443 G・ABC283 Ex・ABC402 G                                                                 | floor正規化・格子点転置・同時更新・bit指示値・三momentの閉じた再帰はある。負係数、n=0、厳密不等式、正整数列の初項、三角数の整数除算、最終答えより大きい中間値を小例・公式・直接和で詳細確認する。                                                                    |
| rational-approximation、ABC408 G                                                                                   | 隣接境界の行列式、最大同方向移動、最小分母の証明、開端点で止めない条件と(1/3,1/2)の例はある。無限境界、同方向の巨大商、最小分母の分子の非一意性、交差積の型幅を公式・全分母探索まで確認する。ABC333 Gは予約済み。                                                    |
| stern-brocot-ancestry、ABC273 Ex                                                                                   | 正の残余座標、−1付きの商、run途中のLCA、辞書順隣接だけでの祖先和集合、問題の操作数と深さの差はある。primitiveでない位置の分割、0/1・1/0の有効位置、gapの三角数、圧縮木とsmall-to-largeの費用を公式・小木で詳細確認する。                                             |
| numerical-semigroup-reachability、ABC388 F                                                                         | gcd正規化、剰余最短路、conductor、(B−1)(B−2)以上の構成、境界帯圧縮の両方向の証明はある。一般Unitの最小生成元が大きい場合の不適用、短い安全区間を複数飛び越す辺、A=BとB=2を公式・全cell DPまで確認する。                                                              |
| finite-field-frobenius、ABC251 Ex                                                                                  | 可換性と標数p、七進降順、RLEの二本pointer、境界数と残り長さの二上界はある。有限列の出力範囲、段の途中のrun数、相殺してrunが再結合する例、N=Kを公式・一段更新まで確認する。元のFrobenius写像の周期とは混同されていない。                                              |
| finite-field-extension、ABC381 G                                                                                   | 非剰余による二次拡大、逆元の分母、一般多項式Euclid、nimberの塔、問題の周期・正規化因子・chirp-zは具体的。基底の違い、零因子を持つ剰余環との区別、係数0・空積、NTTの実部/拡大成分、全caseの費用を公式・小積で詳細確認する。                                           |
| gaussian-integers-two-squares、ABC444 G                                                                            | norm・Euclid除法・三種類の素数・指数配分・単元と、問題の前周期を除いた中央集計はある。符号/座標順の重複、周期の両端の重なり、偶指数の中央、C=1でも個数を消さない条件、C^4合成を公式・小指数の全構成まで確認する。                                                    |
| min25-sieve、ABC370 G                                                                                              | Lucyの昇順素数、商の降順、逆向きの素数冪追加、mod3の二class、素数3の例外と時間評価はある。更新前後の不変量を小さいNで追い、PとTの分離、1の寄与の相殺、圧縮索引・素数冪の停止を公式・直接乗法的和まで確認する。                                                       |

関連107問は担当45問・未予約39問・新たな改稿予約へ含めない。関連先の既存担当（例：ABC371 G、ABC372
G、ABC274 Ex、ABC445
G）を重複改稿しない。英語混在、未定義記号、分類文の反復、検算指示だけの復習欄、未区切り数式も、該当ページの改稿・詳細確認で文脈に即して扱う。空見出しだけを独立した確定不具合として予約したページはない。

## 検証と限界

- Node.js 26.12.1 / npm
  11.20.0で`npm run notation:report -- <対象21単元・45問の実path>`を実行し、**66原稿・274候補・明示数式エラー0件**、exit
  0。候補は全て43問題の「制約との対応」の未区切りTeXで、同一文中の複数コマンドも別に数える。表示不具合274件とは数えず、式の範囲を確認して各ページの改稿時に扱う。npmは指定11.21.1との差を警告した。依存・lockfileは変更していない。
- 一時検算で、ABC429
  Gの互いに素な2≤M≤30の127,034件について、通常の隣接gapの修正境界・符号付き歩幅・等差列分割の被覆を照合した。最終冪和とgcd縮約全体の実装検証は後続に残す。ABC438
  Gは1≤N,M≤10、0≤K≤40の4,100件で、局所時刻から円環添字へ移す対応を元の全訪問対と比較した。Fenwick実装の検証とは区別する。
- ABC322
  Gの重みの恒等式330件・有界桁のgreedy判定6,300件を全桁列挙と比較した。全(S,a,b)の数え上げと巨大値の飽和実装は後続に残す。ABC270
  Gは13以下の全素数で全A,B,S,Gの46,325件を直接orbitと比較した。
- ABC333
  Gの補完案は、分母60以下の目標と上限20以下の35,400件で、厳密な分数による全分母探索と比較した。現稿の省略された実装を検証したという意味ではない。CRT・非可逆累乗の小例も整数で確認した。
- 変更Markdownの書式・ローカルリンク、全21単元・45問の存在とhome対応、関連集合、後続Issueの編集path重複と残範囲を確認した。教材本文・分類JSON・共通表示は変更せず、文書PRとしてbuild・E2Eは実行していない。後続改稿では公式根拠・本文/claim・必要なschema/reader・本番subpathのbuild/内部リンク・対象の文章と表示を確認する。

この調査の完成・mergeは後続9件の本文改稿や残39問・15単元の詳細確認の完了を意味しない。これらを#140の未完了として追い、#181だけの完了でEpicを閉じない。
