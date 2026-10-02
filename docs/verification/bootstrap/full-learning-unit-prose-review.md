# Full LearningUnit 本文の技術検証

対象は Issue #46 の9章232単元。本文の正本は各 LearningUnit の `docPath`
にあるMarkdownであり、この記録は本文の代替ではない。編集前に一単元一manifestを固定し、`full_authoring`へ移してから同じ文書に概念説明と成立条件・計算量を追記した。既存の通常本文を保持した。

## 検証の範囲と方法

2026-10-02の[PR #64レビュー](https://github.com/Fu-L/abc-textbook/pull/64#pullrequestreview-5387203474)で、初回の自己点検ではSlope
Trickの傾きの符号とBEST定理の根の除外を見落とし、Gaussian二項係数・Stirling変換とSegment Tree
Beatsの成果被覆も不十分だったことが判明した。初回の構造検証成功は本文の数学的正しさや習得可能性を保証しない。

今回の修正では、対象の所有Unit内で、状態の定義から更新式・全単射・計算手順・総費用までを導いた。手法名と用途の記述だけで成果被覆を判断せず、読者が本文から式を再構成できるかを点検した。

- Slope
  Trick: 左右の片側線形関数を区別し、heapの順序不変量・最小値・交差解消の恒等式を定義。絶対値追加、prefix
  minimum、平行移動、区間内最小化と、有限関数では直接表せない初期制約まで説明した。
- BEST定理: 根以外のlast-exit
  edgeだけを選び、時刻の単調性による非閉路性と、出辺順序による全辺使用の復元を証明。先頭辺固定・根固定の二つの式、自己ループと次数0の扱いを明示した。
- Gaussian二項係数・Stirling変換: 独立ベクトル列を各部分空間の基底数で割る導出、rank別生成列、出力の法での可逆性、除算不要の漸化式を追加。二種のStirling数の定義・符号・漸化式、係数変換と計数列変換の入力・出力を区別した。
- Segment Tree Beats:
  chmin＋区間和に対するsum・max・secondMax・countMax、成功／失敗条件、伝播と併合を定義。全nodeの異なる値の種類数の和をpotentialとし、初期量・完全被覆での減少・境界での増加から総上界を導出。集合更新では不一致要素の数へ置き換えて接続した。

公式解説と照合したうえで、一時スクリプトによる独立した小規模計算も行った。Slope
Trickは座標DPとの25,200点の比較、BEST定理は自己ループ・多重辺を含む67graphの木数と辺列の全探索、Gaussian係数はF_2・F_3の20ケースの部分空間列挙、Stirling変換は321ケースの恒等式と往復、Beatsは4,050ケースの一括更新式とpotential増減を確認した。これらは数式の反例検出を補助する検算であり、本文中の証明を置き換えない。

各単元について、保持する状態・不変量と発動条件、正当性の根拠、計算量で数える対象、境界条件を読み直した。標準算法の上界と問題固有の解法全体の上界を区別した。汎用的な上界を置けない手法には、評価すべき状態数・合成費用・償却量を明示した。既存の公式Source
Revision、accepted Tag/Outcomeの意味、通常本文との整合を確認した。

自動検査は、232件の編集前manifest・受理済みmetadata・出典リンク・本文構造・導線を実ファイルから読み直す。数学的正しさを文字列検査だけで判定するものではない。本文ごとのhash、所有成果、Source
Revisionは `learning-unit-content.json` に固定する。

| 章           | 本文で確認した根拠・境界                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| モデル変換   | 代表への同値写像、候補の一意分割、交換後の実行可能性、総作業への課金。乱択の入力独立性・全比較の誤り確率。    |
| Query        | 結合則・逆元・冪等性を分離。作用の時間順、padding、非可換query、run生成数、rollbackの履歴、共有節点の非変更。 |
| DP           | 未来に対する状態の十分性、最後の選択の一意性、依存順、自己loopの方程式、半環・確率・ゲームの評価方法の違い。  |
| グラフ       | 距離確定の仮定、cycle rank、SCCと縮約、次数と連結性の両条件、残余逆辺、負閉路の終点への影響。                 |
| 木           | pathの一意性、messageの除外、light辺のサイズ増加、virtual treeのLCA閉包、重心の重み、再帰の重複呼出し。       |
| 文字列       | prefix/suffix状態の意味、一致右端の単調進行、cloneの出現数、部分集合構成の指数上界、区間長と周期の整除条件。  |
| 数論         | gcdの存在条件、合同式の両立、逆元と0因子、位数の可逆性、商block、体の既約性、丸めとoverflow。                 |
| 組合せ・代数 | 対象と係数の全単射、重複の相殺、分母の可逆性、rankとkernel、matroid交換公理、各公式の標数・次数条件。         |
| 幾何・最適化 | 外積の退化、凸最小点と境界の違い、格子近傍の証明、単調差分、Monge/全単調/Knuthの条件、双対gap。               |

とくに誤用しやすい主張は以下のように検証した。

- 有向剥離の残存頂点にはcycleから到達する頂点も含まれる。SCCのcycle判定とは分けた。
- 無向成分のcycle rankは全域木の非木辺数
  `E−V+1`。葉刈りの結果だけから一般の成分を単一cycleとしない。
- XOR基底のpivot消去はspanを保存する。coset代表の正規化と二つの独立な値の最適化を区別した。
- Lazy Segment Treeの要約と作用の条件・合成順は
  [ACL公式仕様](https://atcoder.github.io/ac-library/master/document_en/lazysegtree.html)と照合した。
- suffix arrayの文字種依存上界とZの線形上界は
  [ACL公式仕様](https://atcoder.github.io/ac-library/master/document_en/string.html)と照合した。
- HLRecDPはlight childの二重呼出しまで数える。
  [ABC311 Ex公式解説](https://atcoder.jp/contests/abc311/editorial/6814)と既存本文を照合し、単なる重軽分解の対数段数から線形・準線形を主張していない。
- Min_25・Lucy DPの素数和と乗法的関数総和を区別した。
  [ABC370 G公式解説](https://atcoder.jp/contests/abc370/editorial/10869)の簡略版と本来の算法は同じ上界ではない。本文では関数・再帰・更新に依存する費用を評価するよう明示した。
- FPS合成を一回の畳み込みとしない。
  [ABC387 G公式解説](https://atcoder.jp/contests/abc387/editorial/11727)の転置原理と比較した。
- 線形matroid交差ではrankの乱択判定と解集合の復元を区別した。
  [ABC399 G公式解説](https://atcoder.jp/contests/abc399/editorial/12546)の前提に沿う。
- 格子最適化の近傍半径は関数固有の証明を要する。
  [ABC459 G公式解説](https://atcoder.jp/contests/abc459/editorial/20454)の議論を任意の二変数凸関数の丸め保証へ一般化していない。
- path matching縮約は中央を左右で置き換える費用差を保つ。
  [ABC464 G公式解説](https://atcoder.jp/contests/abc464/editorial/22263)と照合した。
- RSKのstandard tableauと一般の文字列、hook-length公式と追加順序制約を区別した。
  [ABC378 G公式解説](https://atcoder.jp/contests/abc378/editorial/11283)を確認した。
- 数ゲームの加算則を一般partizan gameへ拡張しない。
  [ABC229 H公式解説](https://atcoder.jp/contests/abc229/editorial/2977)と比較した。

## 成果・所有権・訂正の確認

全242成果の直接所有は変更しない。概念説明は各単元の習得対象へ、練習は既存の問題一覧へつながる。構造単元には子単元との使い分けを加え、OutcomeごとにUnitを複製していない。固定guide・assessment・自評価表やProblem固有の解説は追加していない。今回は実行可能Example・Exercise・Answerを追加していないので、その実行証跡は適用外。

CorrectionImpactは実在するLearningUnit本文・前提policy・placementを検証する。Problem-owned
section/example/answerは#47/#48へ、公開indexはT160へ引き継ぎ、未実体化のtargetを検証済みと表示しない。canonical
impactの全体statusはpendingを保つ。

## レビューの状態

この記録はCodexによる本文の自己点検であり、運用者本人の受入レビューを代行した記録ではない。通常の本文追加として
`self` policyを選ぶ。taxonomy・DAG・配置の変更は0件。T059のhuman
acceptanceはPRのレビューで確定する。T060の手動self-studyは運用者指示により対象外。公開は行わず、全Markdownのdraftを維持する。
