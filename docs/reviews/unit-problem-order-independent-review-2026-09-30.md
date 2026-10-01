# 現在のUnit内問題順の総合レビュー（2026-09-30）

現在の表示順を基準に全232 Unitを確認した。直接所属が複数ある120
Unit・801問を比較し、**改善提案は15件・13
Unit（推奨4件、編集案11件）**。残る107の複数問題Unitには、現順を変えるだけの明確な改善理由を見つけなかった。直接所属が1問の67
Unit、0問の45 UnitにはUnit内順序の比較は生じない。全直接所属は868問で重複はない。

全体として、易しい問題から問題固有の変換・証明・複合算法へ進める意図はよく反映されている。以下は読者が既出の考え方を次へ持ち越しやすくする提案であり、配点・出題スロット・diffの逆転を誤りとして数えたものではない。「編集案」は現順にも合理性があり、典型の見せ方を優先するなら変更を検討したい箇所である。

## 範囲と判断方法

- 実際の問題一覧に使われる`directProblemIds`を対象とした。`problemIds`の所属集合、関連問題の列挙順、Unit間の順序は別の論点として扱った。
- 全801問のInventoryの`algorithmConnection`を読み、変更候補と対照問題では観察・核心・採用案・前提へ戻った。発想の発見、状態・式の導出、正当化、実装の負荷、既出問題から再利用できる核を比較した。
- 共通baselineと各Unitで既習とされる技能を満たす読者を想定した。手法数や実装の短さを総合難度の代理値にはしていない。
- 主要候補の公式解説を選択的に参照した。全868問の公式解説を独立に再監査したレビューではない。ABC286
  Exの公式解説は今回の閲覧で取得できず、保存済みInventoryに基づく編集案とした。
- 配点とdiffは[保存済みmetrics](../../src/content/problem-metrics/atcoder-problems.json)（確認日時`2026-09-14T18:34:00+09:00`）を補助資料とした。最新difficultyを再取得していない。問題順の決定に数値ソート・合成評価値は使っていない。
- 187の非空Unitすべてで、編集元の配列・LearningUnit
  JSON・Markdownの問題一覧の順序が一致することを照合した。提案配列の所属集合と個数も照合した。
- 既存の未追跡レビュー文書は変更していない。今回追加したのはこのレビュー文書のみで、教材データ・問題順は変更していない。

対象編集元: [problem-reading-order.ts](../../src/lib/taxonomy/problem-reading-order.ts)、SHA-256
`089cf820ed76d574872064187eb2dc1f16ee09a0aeb3a2973ce5076bbaf71233`。

LearningUnit全232ファイルの相対パスと原文bytesをパス順に連結したSHA-256:
`03603708d430aa815df474815190e611483fd39b3295ed7d000233460716618e`。

## 全15提案

### 1. 交換論から選択順を導く — ABC252 F

**編集案：ABC252 FをABC308 Fの直後へ移す。**

ABC252
Fでは切断を逆向きの併合へ写し、最小の二片を併合するHuffman型の貪欲を学べる。現在は、括弧列のprefix制約を扱うABC407
Eや、二次元の候補を管理するABC245
Eの後にある。単純な選択群の後で標準的なheap・交換論の組合せを学び、その後に問題固有の実行可能性制約へ進む方が、基本から応用という意図が明瞭になる。

Huffmanの証明と余りを一片にまとめる正当化は軽くない。ABC407
Eより常に易しいという断定ではなく、典型の配置を重視する提案。ABC308
Fの直後を勧めるが、現位置にも難度面の合理性はある。

対象Unit:
[交換論から選択順を導く](../../src/content/docs/learn/modeling/greedy-exchange.md)。比較根拠:
[ABC252 F](../../src/content/technique-inventory/shard-01/abc252-f.json)（500点、保存diff
1609）、[ABC407 E](../../src/content/technique-inventory/shard-00/abc407-e.json)（450点、保存diff
1531）、[ABC245 E](../../src/content/technique-inventory/shard-02/abc245-e.json)（500点、保存diff
1571）。

解法の照合:
[ABC252 F 公式解説](https://atcoder.jp/contests/abc252/editorial/3998)。順序の採否は本レビューの編集判断。

### 2. 単調境界を証明して探索する — ABC381 E

**編集案：ABC381 EをABC267 Eの直前へ移す。**

ABC381 Eの判定は、必要数の1、次の/、必要数の2を最も早く取れるかという位置列への照会である。ABC267
Eでは閾値ごとに削除可能な頂点をqueueで処理し、隣接頂点の費用を更新するpeelingが必要になる。二分探索と静的な貪欲判定を先に扱い、判定器自体が一つのグラフ算法になる問題を次に置く方が段階を作りやすい。

381 Eにも貪欲判定の必要十分性と境界処理があり、二分探索だけの練習ではない。保存diffは381
Eの方が高いが、判定器の構造を優先した編集案。267
Eの採用解法がInventoryの二分探索＋peelingであることを前提とする。

対象Unit:
[単調境界を証明して探索する](../../src/content/docs/learn/modeling/monotone-search.md)。比較根拠:
[ABC381 E](../../src/content/technique-inventory/shard-04/abc381-e.json)（500点、保存diff
1396）、[ABC267 E](../../src/content/technique-inventory/shard-00/abc267-e.json)（500点、保存diff
1313）。

解法の照合:
[ABC381 E 公式解説](https://atcoder.jp/contests/abc381/editorial/11415)。順序の採否は本レビューの編集判断。

### 3. 単調境界を証明して探索する — ABC300 F

**編集案：ABC300 FをABC373 Eの直前へ移す。**

ABC300
Fは「始点は最初の一周期に選べる」を証明した後、周期累積和で区間内のx数を求め、終点を二分探索する。現在はABC373
Eの候補本人を除いた最悪得票配分と、ABC330
Fの座標分離・区間位置の凸最適化を通った後にある。圧縮後の判定が累積和の差一つになる問題を、判定内で別の最適化を行う二問より前に置きたい。

始点を一周期へ制限する観察は独自の核心なので、Unit冒頭へは出さない。ABC374 Eの後、ABC373
Eの直前という小さな移動を提案する。300
Fの保存diffが両比較問題より高いことを含め、これは難度の断定ではなく判定の段階を明確にする案。

対象Unit:
[単調境界を証明して探索する](../../src/content/docs/learn/modeling/monotone-search.md)。比較根拠:
[ABC300 F](../../src/content/technique-inventory/shard-04/abc300-f.json)（500点、保存diff
1846）、[ABC373 E](../../src/content/technique-inventory/shard-05/abc373-e.json)（500点、保存diff
1592）、[ABC330 F](../../src/content/technique-inventory/shard-05/abc330-f.json)（525点、保存diff
1718）。

解法の照合:
[ABC300 F 公式解説](https://atcoder.jp/contests/abc300/editorial/6274)。順序の採否は本レビューの編集判断。

### 4. 区間合成・領域分割DP — ABC325 G

**推奨：ABC325 GをABC400 Fの直前へ移す。**

ABC325 Gは区間の最小残存長を一つ持ち、splitと「中間を消してofを作る」遷移で解く。ABC400
Fは円環の二重化・逆操作への変換と、全消去dp／端色を残すepを組み合わせる。ABC292
Gも区間と桁の状態に、数字別の先頭ブロックを数える補助DPが加わる。217 F・252 Gで分解を学んだ後、325
Gで一種類の値を使う削除DPを学び、複数状態へ進む順を勧める。

325 Gにも最後の操作による分解の証明が必要であり、先頭へ出す提案ではない。保存diffは325
Gの方が高いが、導く状態と遷移を分離して学べることを重視する。

対象Unit:
[区間合成・領域分割DP](../../src/content/docs/learn/dynamic-programming/dp-interval-composition.md)。比較根拠:
[ABC325 G](../../src/content/technique-inventory/shard-03/abc325-g.json)（575点、保存diff
2388）、[ABC400 F](../../src/content/technique-inventory/shard-05/abc400-f.json)（550点、保存diff
2263）、[ABC292 G](../../src/content/technique-inventory/shard-02/abc292-g.json)（600点、保存diff
2340）。

解法の照合:
[ABC325 G 公式解説](https://atcoder.jp/contests/abc325/editorial/7486)。順序の採否は本レビューの編集判断。

### 5. 最小十分状態からDPを設計する — ABC229 F

**推奨：ABC229 FをABC237 Fの直前へ移す。**

ABC229
Fは二部化を二色彩色の費用へ写した後、中心の色を固定し、先頭色と現在色だけで環を処理する。既に序盤のABC251
E・ABC307 Eで学ぶ「環を切り、端の情報を残す」を費用最小化へ広げる例になる。ABC237
FではLISの最小末尾列そのものを列数え上げの状態へ持ち上げ、ABC264
Fでは行・列の全体反転を単調経路の局所状態へ落とす。四状態の環状DPをこの二問より先に置く方が、状態設計の増分が小さい。

二部性と二色彩色の対応という観察を要するため、Unit冒頭には移さない。具体的にはABC283 E → ABC229 F →
ABC237 F → ABC264 Fとし、序盤の問題群は維持する。

対象Unit:
[最小十分状態からDPを設計する](../../src/content/docs/learn/dynamic-programming/dp-state-design.md)。比較根拠:
[ABC229 F](../../src/content/technique-inventory/shard-04/abc229-f.json)（500点、保存diff
1917）、[ABC237 F](../../src/content/technique-inventory/shard-01/abc237-f.json)（500点、保存diff
1857）、[ABC264 F](../../src/content/technique-inventory/shard-02/abc264-f.json)（500点、保存diff
1878）。

解法の照合:
[ABC229 F 公式解説](https://atcoder.jp/contests/abc229/editorial/2964)。順序の採否は本レビューの編集判断。

### 6. 状態グラフのモデリングと探索 — ABC302 F

**推奨：ABC302 FをABC429 Eの直前へ移す。**

ABC302 Fは集合と要素を頂点にして所属を辺にすれば、通常のBFSで集合間の移動回数を求められる。ABC429
Eではmulti-source
BFSに始点ラベルを載せ、各頂点で相異なる二始点だけを受理してよいという枝刈りの正当化まで必要になる。頂点・辺のモデル化を主に学ぶ例から、探索中に複数の到達情報を保存する例へ進む方が自然である。

302
Fにもマージの最適回数と集合間最短路の対応、二部グラフ化による辺数削減がある。既存の単純な直積状態ABC289
Eより先へ出す必要まではない。冒頭をABC446 E → ABC289 E → ABC302 F → ABC429 Eとする。

対象Unit:
[状態グラフのモデリングと探索](../../src/content/docs/learn/graph/state-graph-search.md)。比較根拠:
[ABC302 F](../../src/content/technique-inventory/shard-03/abc302-f.json)（500点、保存diff
1430）、[ABC429 E](../../src/content/technique-inventory/shard-04/abc429-e.json)（625点、保存diff
1313）、[ABC289 E](../../src/content/technique-inventory/shard-05/abc289-e.json)（500点、保存diff
1318）。

解法の照合:
[ABC302 F 公式解説](https://atcoder.jp/contests/abc302/editorial/6411)。順序の採否は本レビューの編集判断。

### 7. 二部matching・Hall・Kőnig — ABC317 G

**編集案：ABC317 GをABC320 Gの直前へ移す。**

ABC317
Gは行と値から正則二部多重グラフを作り、Hall条件を次数から証明し、完全matchingを繰り返し取り出す。このUnitのHallの定理を直接使う教材になる。ABC320
Gは停止時刻の候補を最初のN回へ制限する交換論と二分探索を追加し、ABC374 GはSCC・推移閉包・DAGのwalk
coverへ変換する。matching自身の構造を使う構成を、この二つの複合問題より前へ置く案。

多重辺と複数回のmatchingの実装負荷があり、必ず320 Gより易しいとは言えない。先頭四問の後、ABC461 G →
ABC317 G → ABC320 G → ABC374 Gという位置を提案する。

対象Unit:
[二部matching・Hall・Kőnig](../../src/content/docs/learn/graph/bipartite-matching.md)。比較根拠:
[ABC317 G](../../src/content/technique-inventory/shard-02/abc317-g.json)（600点、保存diff
2649）、[ABC320 G](../../src/content/technique-inventory/shard-05/abc320-g.json)（600点、保存diff
2575）、[ABC374 G](../../src/content/technique-inventory/shard-00/abc374-g.json)（600点、保存diff
2608）。

解法の照合:
[ABC317 G 公式解説](https://atcoder.jp/contests/abc317/editorial/7023)。順序の採否は本レビューの編集判断。

### 8. 区間monoid要約 — ABC292 Ex

**推奨：ABC292 ExをABC429 Fの直前へ移す。**

ABC292
Exは平均条件をp_i-Bのprefix和へ直し、区間和と最大prefix和の二成分を結合して、最初の非負prefixを木上で探す。既出のABC223
Fで学ぶsum・最小prefixの要約を、最大prefixと探索へ広げられる。現在はmin-plus行列のABC429
F、木の直径要約のABC460 F、並び順を制約付き最小集合へ変換するABC440
Fの後にある。小さな要約上の探索を先に学び、その後に別の構造を要約する例へ進みたい。

prefix和そのものは単調とは限らないため、「区間内の最大prefixが非負か」を持って探索する理由を教える必要がある。ABC285
Fの後、ABC429 Fの直前なら基本の点更新・区間積の問題群を済ませてから探索へ進める。保存diffが429
F・440 Fより高いことは承知した上で、技能の基本形を優先する提案。

対象Unit:
[区間monoid要約](../../src/content/docs/learn/query/range-monoid-aggregation.md)。比較根拠:
[ABC292 Ex](../../src/content/technique-inventory/shard-02/abc292-ex.json)（600点、保存diff
2248）、[ABC223 F](../../src/content/technique-inventory/shard-04/abc223-f.json)（500点、保存diff
1641）、[ABC429 F](../../src/content/technique-inventory/shard-04/abc429-f.json)（525点、保存diff
1859）、[ABC440 F](../../src/content/technique-inventory/shard-04/abc440-f.json)（550点、保存diff
2108）。

解法の照合:
[ABC292 Ex 公式解説](https://atcoder.jp/contests/abc292/editorial/5887)。順序の採否は本レビューの編集判断。

### 9. Trieで共有接頭辞を索引化する — ABC437 E

**編集案：ABC437 EをABC353 Eの直前へ移す。**

ABC437
Eは各列を親列の節点から一要素だけ延長してTrieへ対応させ、終端を先に出し、子をラベル順に走査する。prefix木と辞書順の対応を直接学べる。ABC353
EはLCPを共有prefix数へ分解し、節点の通過頻度から全pairの寄与を集計する。木が表す構造を確認してから統計を載せる順にする案。

437 Eには同じ延長の節点共有、整数ラベルの子の順序管理、同一列の添字順の処理がある。353
Eより常に易しいとは言えない。ABC287 E → ABC437 E → ABC353 E → ABC377
Gを提案する。列を全展開して挿入する実装を前提にしていない。

対象Unit:
[Trieで共有接頭辞を索引化する](../../src/content/docs/learn/string/trie-prefix.md)。比較根拠:
[ABC437 E](../../src/content/technique-inventory/shard-02/abc437-e.json)（450点、保存diff
1279）、[ABC353 E](../../src/content/technique-inventory/shard-01/abc353-e.json)（500点、保存diff
1217）。

解法の照合:
[ABC437 E 公式解説](https://atcoder.jp/contests/abc437/editorial/14880)。順序の採否は本レビューの編集判断。

### 10. 組合せ係数と対称性で数える — ABC262 E

**編集案：ABC262 EをABC399 Fの直前へ移す。**

ABC262
Eは次数和の偶奇でグラフ条件を「奇数次数から偶数個選ぶ」へ圧縮し、二種類からの選択を二項係数の積で足す。現在はABC399
FのK乗を区別されたlabel配置へ読む変換と仕切り段階のDP、ABC431 Fの挿入位置の集計、ABC433
Fの二項係数への和の集約の後にある。一つの不変量から通常の選択数へ落ちる例を、追加の計数構造を導く例より前へ置きたい。

グラフの次数和という観察を学ぶ問題で、数式を当てはめるだけではない。より素直な序盤の配列・文字数え上げは残し、ABC234
Fの後へ移す案。

対象Unit:
[組合せ係数と対称性で数える](../../src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)。比較根拠:
[ABC262 E](../../src/content/technique-inventory/shard-04/abc262-e.json)（500点、保存diff
1719）、[ABC399 F](../../src/content/technique-inventory/shard-01/abc399-f.json)（550点、保存diff
1558）、[ABC431 F](../../src/content/technique-inventory/shard-04/abc431-f.json)（500点、保存diff
1613）、[ABC433 F](../../src/content/technique-inventory/shard-03/abc433-f.json)（500点、保存diff
1617）。

解法の照合:
[ABC262 E 公式解説](https://atcoder.jp/contests/abc262/editorial/4479)。順序の採否は本レビューの編集判断。

### 11. 組合せ係数と対称性で数える — ABC243 F

**編集案：ABC243 FをABC226 Fの直前へ移す。**

ABC243
Fは各賞の出現回数ベクトルに対する多項係数を使い、p_i^c/c!を種類ごとにDPで合成して最後にK!を掛ける、標準的な係数分離の例である。ABC226
Fは順列の巡回長を整数分割へ同一視し、同長cycleの入れ替えと各cycleの回転の重複を除き、LCMの寄与を掛ける。次数や頻度に応じた階乗の分母を扱う基本例を先にし、より複雑な対称性による補正へ進む順を勧める。

243
Fにも確率と「正の頻度を持つ種類数」のDPがあるため、難度上の明らかな逆転とは扱わない。現行の隣接二問をABC243
F → ABC226 Fとする編集案。

対象Unit:
[組合せ係数と対称性で数える](../../src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)。比較根拠:
[ABC243 F](../../src/content/technique-inventory/shard-01/abc243-f.json)（500点、保存diff
2125）、[ABC226 F](../../src/content/technique-inventory/shard-04/abc226-f.json)（500点、保存diff
2086）。

解法の照合:
[ABC243 F 公式解説](https://atcoder.jp/contests/abc243/editorial/3508)。順序の採否は本レビューの編集判断。

### 12. 根付き木DP・部分木集約 — ABC263 F

**編集案：ABC263 FをABC287 Fの直前へ移す。**

ABC263
Fは勝ち上がる人物を状態に持つが、勝つ側を固定すれば、負ける側の最適値は勝者によらず最大値一つへ集約できる。ABC287
Fは成分数と根の選択bitを保ち、二つの部分木の成分数を全分割で畳み込む。相手側を独立な極値へまとめられるmergeを先に学び、両側の資源・個数を同時に持つmergeへ進めると、後続ABC416
Fの木knapsackへもつながる。

263 Fの状態数評価と敗者の報酬が確定する時点は説明が必要であり、単なるscalar DPではない。ABC259
Fの後は保ち、隣接するABC287 F・ABC263 Fだけを入れ替える案。

対象Unit:
[根付き木DP・部分木集約](../../src/content/docs/learn/tree/rooted-tree-aggregation.md)。比較根拠:
[ABC263 F](../../src/content/technique-inventory/shard-01/abc263-f.json)（500点、保存diff
2066）、[ABC287 F](../../src/content/technique-inventory/shard-05/abc287-f.json)（500点、保存diff
2034）、[ABC259 F](../../src/content/technique-inventory/shard-03/abc259-f.json)（500点、保存diff
1961）。

解法の照合:
[ABC263 F 公式解説](https://atcoder.jp/contests/abc263/editorial/4550)。順序の採否は本レビューの編集判断。

### 13. NTT・FFTで畳み込みと相互相関を求める — ABC307 Ex

**編集案：ABC307 ExをABC409 Gの直前へ移す。**

ABC307
Exは不一致の非負scoreを二乗差とwildcardのmaskで表し、展開した積和を反転列との畳み込みでまとめる。既出のABC291
Gの相互相関を文字一致へ広げる例になる。ABC409
Gは初登場時刻で条件付け、以後の期待倍率を求め、二項係数を階乗形へ整理して畳み込みへ持ち込む。畳み込みへ写す対象を直接作れる問題から、確率過程を先に解きほぐす問題へ進む方が、このUnit内の階段として分かりやすい。

307
Exでは電光掲示板の周期表現、wildcardの扱い、mod上で偽一致しない上界まで必要になる。そのためABC432
Gより前へは動かさず、ABC432 G → ABC307 Ex → ABC409 Gとする。保存diffは307
Exの方が高く、ここでも単純な総合難度の断定はしない。

対象Unit:
[NTT・FFTで畳み込みと相互相関を求める](../../src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)。比較根拠:
[ABC307 Ex](../../src/content/technique-inventory/shard-02/abc307-ex.json)（600点、保存diff
2754）、[ABC409 G](../../src/content/technique-inventory/shard-05/abc409-g.json)（625点、保存diff
2616）、[ABC432 G](../../src/content/technique-inventory/shard-04/abc432-g.json)（575点、保存diff
1984）。

解法の照合:
[ABC307 Ex 公式解説](https://atcoder.jp/contests/abc307/editorial/6598)。順序の採否は本レビューの編集判断。

### 14. 幾何の基本判定と座標変換 — ABC296 G

**編集案：ABC296 GをABC353 Fの直前へ移す。**

ABC296 Gは凸多角形の上側・下側chainで対象点を挟む二辺を特定し、外積でIN／ON／OUTを判定する。ABC353
Fは無限のtile盤面から入口・出口を有限候補へ絞り、大tile間の距離式をK=2の例外も含めて導く。汎用的な幾何判定を先にし、問題固有の無限盤面の圧縮へ進む順が、基礎から応用という意図に合う。

296
Gにもchainの構築と垂直辺・境界点の処理がある。序盤へ大きく動かすほど易しいとは判断しない。現在隣接するABC353
F・ABC296 Gの入れ替えだけを提案する。

対象Unit:
[幾何の基本判定と座標変換](../../src/content/docs/learn/geometry-optimization/geometry-primitives.md)。比較根拠:
[ABC296 G](../../src/content/technique-inventory/shard-01/abc296-g.json)（600点、保存diff
2241）、[ABC353 F](../../src/content/technique-inventory/shard-02/abc353-f.json)（550点、保存diff
2201）。

解法の照合:
[ABC296 G 公式解説](https://atcoder.jp/contests/abc296/editorial/6070)。順序の採否は本レビューの編集判断。

### 15. 凸包・支持方向・境界候補 — ABC286 Ex

**編集案：ABC286 ExをABC275 Gの直前へ移す。**

ABC286
Exは凸障害物を避ける最短路を接線と境界arcへ制限し、始終点を含む凸包の二方向の長さを比較する。ABC275
Gは離散的な品物選択を極限の連続最適化へ写し、価値で正規化した点の凸結合からPareto境界を求め、線分内の最適混合比も調べる。目に見える幾何境界の応用を先にし、凸包を抽象的な可行領域として使う例へ進む方が導入を作りやすい。

286
Exの線分が内部を横切るかの判定、接線・境界へ制限できる証明は必要。保存diffはほぼ同じであり、難度上の明白な逆転ではない。冒頭をABC341
G → ABC286 Ex → ABC275 Gとする編集案。

対象Unit:
[凸包・支持方向・境界候補](../../src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)。比較根拠:
[ABC286 Ex](../../src/content/technique-inventory/shard-01/abc286-ex.json)（600点、保存diff
2526）、[ABC275 G](../../src/content/technique-inventory/shard-04/abc275-g.json)（600点、保存diff
2522）。

## 提案をまとめて適用した順序

以下は提案であり、教材に適用していない。対象外の問題同士の相対順は維持する。

### 交換論から選択順を導く

現在: ABC447 E → ABC376 E → ABC388 E → ABC257 E → ABC417 E → ABC404 E → ABC308 F → ABC385 E → ABC457
E → ABC407 E → ABC298 F → ABC312 F → ABC245 E → ABC252 F → ABC433 E → ABC225 E → ABC214 E → ABC268 F
→ ABC366 F → ABC299 G → ABC262 F → ABC371 G → ABC226 G → ABC290 G → ABC225 F → ABC254 Ex → ABC434 F
→ ABC304 Ex → ABC290 Ex

提案: ABC447 E → ABC376 E → ABC388 E → ABC257 E → ABC417 E → ABC404 E → ABC308 F → ABC252 F → ABC385
E → ABC457 E → ABC407 E → ABC298 F → ABC312 F → ABC245 E → ABC433 E → ABC225 E → ABC214 E → ABC268 F
→ ABC366 F → ABC299 G → ABC262 F → ABC371 G → ABC226 G → ABC290 G → ABC225 F → ABC254 Ex → ABC434 F
→ ABC304 Ex → ABC290 Ex

### 単調境界を証明して探索する

現在: ABC269 E → ABC270 E → ABC267 E → ABC381 E → ABC395 F → ABC292 F → ABC424 E → ABC374 E → ABC373
E → ABC330 F → ABC300 F → ABC215 F → ABC388 G → ABC229 G → ABC246 G → ABC303 F → ABC444 F → ABC293
Ex → ABC263 Ex

提案: ABC269 E → ABC270 E → ABC381 E → ABC267 E → ABC395 F → ABC292 F → ABC424 E → ABC374 E → ABC300
F → ABC373 E → ABC330 F → ABC215 F → ABC388 G → ABC229 G → ABC246 G → ABC303 F → ABC444 F → ABC293
Ex → ABC263 Ex

### 区間合成・領域分割DP

現在: ABC217 F → ABC252 G → ABC400 F → ABC292 G → ABC325 G → ABC233 G → ABC298 G → ABC261 G → ABC262
G

提案: ABC217 F → ABC252 G → ABC325 G → ABC400 F → ABC292 G → ABC233 G → ABC298 G → ABC261 G → ABC262
G

### 最小十分状態からDPを設計する

現在: ABC244 E → ABC251 E → ABC307 E → ABC310 E → ABC232 E → ABC215 E → ABC375 E → ABC265 E → ABC247
F → ABC403 F → ABC283 E → ABC237 F → ABC264 F → ABC229 F → ABC344 F → ABC462 F → ABC450 F → ABC311 F
→ ABC422 F → ABC217 G → ABC376 F → ABC391 G → ABC281 G → ABC345 E → ABC227 E → ABC279 G → ABC273 G →
ABC416 G → ABC389 G → ABC440 G → ABC313 Ex

提案: ABC244 E → ABC251 E → ABC307 E → ABC310 E → ABC232 E → ABC215 E → ABC375 E → ABC265 E → ABC247
F → ABC403 F → ABC283 E → ABC229 F → ABC237 F → ABC264 F → ABC344 F → ABC462 F → ABC450 F → ABC311 F
→ ABC422 F → ABC217 G → ABC376 F → ABC391 G → ABC281 G → ABC345 E → ABC227 E → ABC279 G → ABC273 G →
ABC416 G → ABC389 G → ABC440 G → ABC313 Ex

### 状態グラフのモデリングと探索

現在: ABC446 E → ABC289 E → ABC429 E → ABC302 F → ABC305 F → ABC394 E → ABC446 F → ABC244 F → ABC427
E → ABC241 F → ABC443 F → ABC319 G → ABC355 E → ABC414 F → ABC361 G

提案: ABC446 E → ABC289 E → ABC302 F → ABC429 E → ABC305 F → ABC394 E → ABC446 F → ABC244 F → ABC427
E → ABC241 F → ABC443 F → ABC319 G → ABC355 E → ABC414 F → ABC361 G

### 二部matching・Hall・Kőnig

現在: ABC401 G → ABC274 G → ABC445 G → ABC461 G → ABC320 G → ABC374 G → ABC317 G → ABC215 H

提案: ABC401 G → ABC274 G → ABC445 G → ABC461 G → ABC317 G → ABC320 G → ABC374 G → ABC215 H

### 区間monoid要約

現在: ABC432 E → ABC343 F → ABC223 F → ABC415 F → ABC424 F → ABC331 F → ABC285 F → ABC429 F → ABC460
F → ABC440 F → ABC292 Ex → ABC447 G → ABC418 F → ABC365 F → ABC246 Ex → ABC434 G

提案: ABC432 E → ABC343 F → ABC223 F → ABC415 F → ABC424 F → ABC331 F → ABC285 F → ABC292 Ex →
ABC429 F → ABC460 F → ABC440 F → ABC447 G → ABC418 F → ABC365 F → ABC246 Ex → ABC434 G

### Trieで共有接頭辞を索引化する

現在: ABC287 E → ABC353 E → ABC437 E → ABC377 G

提案: ABC287 E → ABC437 E → ABC353 E → ABC377 G

### 組合せ係数と対称性で数える

現在: ABC425 E → ABC405 E → ABC458 E → ABC358 E → ABC234 F → ABC399 F → ABC431 F → ABC433 F → ABC262
E → ABC266 G → ABC226 F → ABC243 F → ABC276 G → ABC290 F → ABC463 G → ABC240 G → ABC267 G → ABC278
Ex

提案: ABC425 E → ABC405 E → ABC458 E → ABC358 E → ABC234 F → ABC262 E → ABC399 F → ABC431 F → ABC433
F → ABC266 G → ABC243 F → ABC226 F → ABC276 G → ABC290 F → ABC463 G → ABC240 G → ABC267 G → ABC278
Ex

### 根付き木DP・部分木集約

現在: ABC309 E → ABC409 E → ABC239 E → ABC391 E → ABC459 E → ABC378 F → ABC447 F → ABC397 E → ABC394
F → ABC312 G → ABC259 F → ABC287 F → ABC263 F → ABC416 F → ABC248 G → ABC264 Ex → ABC329 G

提案: ABC309 E → ABC409 E → ABC239 E → ABC391 E → ABC459 E → ABC378 F → ABC447 F → ABC397 E → ABC394
F → ABC312 G → ABC259 F → ABC263 F → ABC287 F → ABC416 F → ABC248 G → ABC264 Ex → ABC329 G

### NTT・FFTで畳み込みと相互相関を求める

現在: ABC392 G → ABC291 G → ABC432 G → ABC409 G → ABC307 Ex → ABC265 Ex

提案: ABC392 G → ABC291 G → ABC432 G → ABC307 Ex → ABC409 G → ABC265 Ex

### 幾何の基本判定と座標変換

現在: ABC248 E → ABC437 F → ABC442 E → ABC223 E → ABC366 E → ABC426 E → ABC351 E → ABC385 F → ABC377
F → ABC353 F → ABC296 G → ABC258 F → ABC220 G → ABC234 Ex → ABC301 G

提案: ABC248 E → ABC437 F → ABC442 E → ABC223 E → ABC366 E → ABC426 E → ABC351 E → ABC385 F → ABC377
F → ABC296 G → ABC353 F → ABC258 F → ABC220 G → ABC234 Ex → ABC301 G

### 凸包・支持方向・境界候補

現在: ABC341 G → ABC275 G → ABC286 Ex → ABC244 Ex → ABC356 G → ABC257 Ex

提案: ABC341 G → ABC286 Ex → ABC275 G → ABC244 Ex → ABC356 G → ABC257 Ex

## 現順を支持する具体例

- **doubling:** ABC367 E → ABC438
  Eを維持する。写像だけの合成から、遷移と水量をともに合成する例への拡張であり、diffが下がることを理由に逆転しない。
- **Mo:** ABC242 G → ABC293 Gを維持する。頻度からpairを数える基本形の後で三つ組を数える流れは自然。
- **関数グラフ:** ABC436 E → ABC296 E → ABC256
  Eは、順列のcycle、木を除去したcycle抽出、cycle上の費用最適化と進んでおり、現在の順を支持する。
- **monoid:** ABC343 F → ABC223 F → ABC415 F → ABC424
  Fは、小さな要約からrun要約・括弧への変換へ進む。少なくとも223 Fが424
  Fより先にあり、再利用の関係が保たれている。
- **subset TSP:** ABC274 EをABC338 Fより後へ動かさない。274
  Eはspeedをmaskから直接復元できる一方、338
  Fは負辺のある最短walkと代表順列の対応の証明がある。「単純なTSPらしい」だけで338 Fを入門にしない。
- **構成:** ABC251
  Fを冒頭に動かさない。DFS木・BFS木を出力するコードは定番でも、非木辺が祖先・子孫を結ぶ／結ばないことの証明が核心である。ABC333
  E・ABC299 Eの後という現位置を許容する。
- **資源DP:** ABC288
  Eを前半へ動かさない。最終的なDPは小さいが、各商品の最小追加費用を固定集合で同時に達成できる購入順の正当化が先に必要。
- **MST:** ABC352 E → ABC282 Eを維持する。282
  Eの最大全域木実装は標準形でも、削除操作列と木の双方向の対応を証明する必要がある。
- **XOR基底:** ABC451 G → ABC223
  Hを維持する。前者にはgraphとtrieの複合があるが、後者にも全suffixのspanを新しい添字優先の基底一つで保つ独自の不変条件がある。構成部品の多寡だけで入れ替えない。
- **最小費用流:** ABC224
  Hを前へ出さない。ネットワークの見た目が簡単でも、元問題からそこへ移すLP双対・整数性の議論が重い。
- **slope trick:** ABC250 G → ABC217 H → ABC458
  Gは、heap上の限界費用、標準的なhinge追加・最小区間拡張、特殊なdomainのtrimへ進んでおり、現順を支持する。

## 全120比較対象Unitの確認結果

「現順を許容」は順序が唯一の正解という意味ではなく、変更の利点を示すだけの根拠を見つけなかったという判断である。各問題の順序を記録し、確認対象の欠落を追えるようにした。

| 章             | Unit                                                                                                                                | 問数 | 判定        | 現在の直接問題順                                                                                                                                                                                                                                                                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---: | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 組合せ・代数   | [組合せ係数と対称性で数える](../../src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)                      |   18 | 提案 10, 11 | ABC425 E → ABC405 E → ABC458 E → ABC358 E → ABC234 F → ABC399 F → ABC431 F → ABC433 F → ABC262 E → ABC266 G → ABC226 F → ABC243 F → ABC276 G → ABC290 F → ABC463 G → ABC240 G → ABC267 G → ABC278 Ex                                                                                                                                                                                           |
| 組合せ・代数   | [行列式による数え上げ](../../src/content/docs/learn/combinatorics-algebra/determinant-counting.md)                                  |    3 | 現順を許容  | ABC253 Ex → ABC323 G → ABC216 H                                                                                                                                                                                                                                                                                                                                                                |
| 組合せ・代数   | [約数格子のzeta・Möbius反転](../../src/content/docs/learn/combinatorics-algebra/divisor-mobius-inversion.md)                        |    3 | 現順を許容  | ABC304 F → ABC361 F → ABC230 G                                                                                                                                                                                                                                                                                                                                                                 |
| 組合せ・代数   | [FPS合成・power projection](../../src/content/docs/learn/combinatorics-algebra/fps-composition-power-projection.md)                 |    2 | 現順を許容  | ABC387 G → ABC439 G                                                                                                                                                                                                                                                                                                                                                                            |
| 組合せ・代数   | [母関数方程式・高度な係数抽出](../../src/content/docs/learn/combinatorics-algebra/generating-function-coefficients.md)              |    3 | 現順を許容  | ABC279 Ex → ABC222 H → ABC230 H                                                                                                                                                                                                                                                                                                                                                                |
| 組合せ・代数   | [組合せを生成関数へ符号化する](../../src/content/docs/learn/combinatorics-algebra/generating-functions.md)                          |   15 | 現順を許容  | ABC422 G → ABC352 G → ABC267 Ex → ABC385 G → ABC436 G → ABC390 G → ABC449 G → ABC247 Ex → ABC297 Ex → ABC241 Ex → ABC225 H → ABC281 Ex → ABC260 Ex → ABC345 G → ABC317 Ex                                                                                                                                                                                                                      |
| 組合せ・代数   | [包除・Möbius反転で重複を補正する](../../src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)                       |   15 | 現順を許容  | ABC455 E → ABC246 F → ABC297 F → ABC462 G → ABC242 F → ABC235 G → ABC309 G → ABC456 G → ABC331 G → ABC280 G → ABC214 G → ABC236 Ex → ABC357 G → ABC285 Ex → ABC306 Ex                                                                                                                                                                                                                          |
| 組合せ・代数   | [label付き連結成分分解・exponential formula](../../src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md) |    5 | 現順を許容  | ABC213 G → ABC321 G → ABC318 Ex → ABC386 G → ABC327 G                                                                                                                                                                                                                                                                                                                                          |
| 組合せ・代数   | [線形方程式・rank](../../src/content/docs/learn/combinatorics-algebra/linear-system-rank.md)                                        |    2 | 現順を許容  | ABC366 G → ABC276 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| 組合せ・代数   | [群作用・軌道数え上げ](../../src/content/docs/learn/combinatorics-algebra/orbit-counting.md)                                        |    2 | 現順を許容  | ABC428 G → ABC284 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| 組合せ・代数   | [NTT・FFTで畳み込みと相互相関を求める](../../src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)                |    6 | 提案 13     | ABC392 G → ABC291 G → ABC432 G → ABC409 G → ABC307 Ex → ABC265 Ex                                                                                                                                                                                                                                                                                                                              |
| 組合せ・代数   | [半順序・Dilworth・最大反鎖](../../src/content/docs/learn/combinatorics-algebra/poset-dilworth-antichain.md)                        |    3 | 現順を許容  | ABC457 G → ABC237 Ex → ABC354 G                                                                                                                                                                                                                                                                                                                                                                |
| 組合せ・代数   | [Relaxed・online convolution](../../src/content/docs/learn/combinatorics-algebra/relaxed-convolution.md)                            |    2 | 現順を許容  | ABC213 H → ABC315 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| 組合せ・代数   | [半環行列・min-plus/max-min遷移](../../src/content/docs/learn/combinatorics-algebra/semiring-matrix-exponentiation.md)              |    2 | 現順を許容  | ABC445 F → ABC236 G                                                                                                                                                                                                                                                                                                                                                                            |
| 組合せ・代数   | [分離可能線形変換・Walsh–Hadamard変換](../../src/content/docs/learn/combinatorics-algebra/separable-linear-transform.md)            |    3 | 現順を許容  | ABC288 G → ABC212 H → ABC367 G                                                                                                                                                                                                                                                                                                                                                                 |
| 組合せ・代数   | [subset zeta・Möbius変換](../../src/content/docs/learn/combinatorics-algebra/subset-transforms.md)                                  |    3 | 現順を許容  | ABC423 F → ABC349 F → ABC295 Ex                                                                                                                                                                                                                                                                                                                                                                |
| 組合せ・代数   | [XOR線形基底](../../src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)                                               |    4 | 現順を許容  | ABC283 G → ABC451 G → ABC223 H → ABC249 G                                                                                                                                                                                                                                                                                                                                                      |
| DP             | [循環局面の後退解析とminimax距離](../../src/content/docs/learn/dynamic-programming/cyclic-minimax-game.md)                          |    2 | 現順を許容  | ABC413 F → ABC261 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| DP             | [上限制約付き桁DP](../../src/content/docs/learn/dynamic-programming/digit-dp.md)                                                    |    6 | 現順を許容  | ABC406 E → ABC465 E → ABC336 E → ABC235 F → ABC317 F → ABC288 Ex                                                                                                                                                                                                                                                                                                                               |
| DP             | [繰り上がり・借り・混合基数を状態にするDP](../../src/content/docs/learn/dynamic-programming/dp-carry-mixed-radix.md)                |    2 | 現順を許容  | ABC231 E → ABC466 G                                                                                                                                                                                                                                                                                                                                                                            |
| DP             | [minimax・得点差・局面値を評価するゲームDP](../../src/content/docs/learn/dynamic-programming/dp-game-value.md)                      |    2 | 現順を許容  | ABC349 E → ABC303 G                                                                                                                                                                                                                                                                                                                                                                            |
| DP             | [ゲーム状態の勝敗とGrundy数](../../src/content/docs/learn/dynamic-programming/dp-game.md)                                           |    7 | 現順を許容  | ABC354 E → ABC368 F → ABC278 F → ABC380 F → ABC297 G → ABC278 G → ABC255 G                                                                                                                                                                                                                                                                                                                     |
| DP             | [グリッド・多次元表の局所DPを設計する](../../src/content/docs/learn/dynamic-programming/dp-grid-table.md)                           |    3 | 現順を許容  | ABC311 E → ABC415 E → ABC443 E                                                                                                                                                                                                                                                                                                                                                                 |
| DP             | [区間合成・領域分割DP](../../src/content/docs/learn/dynamic-programming/dp-interval-composition.md)                                 |    9 | 提案 4      | ABC217 F → ABC252 G → ABC400 F → ABC292 G → ABC325 G → ABC233 G → ABC298 G → ABC261 G → ABC262 G                                                                                                                                                                                                                                                                                               |
| DP             | [区間拡張DP](../../src/content/docs/learn/dynamic-programming/dp-interval-expansion.md)                                             |    2 | 現順を許容  | ABC273 F → ABC219 H                                                                                                                                                                                                                                                                                                                                                                            |
| DP             | [LIS・末尾の支配関係](../../src/content/docs/learn/dynamic-programming/dp-lis.md)                                                   |    3 | 現順を許容  | ABC439 E → ABC393 F → ABC369 F                                                                                                                                                                                                                                                                                                                                                                 |
| DP             | [prefix分割DP](../../src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)                                             |    6 | 現順を許容  | ABC466 E → ABC285 E → ABC288 F → ABC374 F → ABC230 F → ABC262 Ex                                                                                                                                                                                                                                                                                                                               |
| DP             | [列・subsequence DP](../../src/content/docs/learn/dynamic-programming/dp-sequence.md)                                               |    7 | 現順を許容  | ABC327 E → ABC362 E → ABC315 F → ABC386 F → ABC214 F → ABC238 F → ABC299 F                                                                                                                                                                                                                                                                                                                     |
| DP             | [最小十分状態からDPを設計する](../../src/content/docs/learn/dynamic-programming/dp-state-design.md)                                 |   31 | 提案 5      | ABC244 E → ABC251 E → ABC307 E → ABC310 E → ABC232 E → ABC215 E → ABC375 E → ABC265 E → ABC247 F → ABC403 F → ABC283 E → ABC237 F → ABC264 F → ABC229 F → ABC344 F → ABC462 F → ABC450 F → ABC311 F → ABC422 F → ABC217 G → ABC376 F → ABC391 G → ABC281 G → ABC345 E → ABC227 E → ABC279 G → ABC273 G → ABC416 G → ABC389 G → ABC440 G → ABC313 Ex                                            |
| DP             | [確率過程・期待値DP](../../src/content/docs/learn/dynamic-programming/dp-stochastic.md)                                             |   23 | 現順を許容  | ABC266 E → ABC360 E → ABC275 E → ABC323 E → ABC298 E → ABC326 E → ABC300 E → ABC350 E → ABC402 E → ABC263 E → ABC382 E → ABC314 E → ABC333 F → ABC412 F → ABC421 E → ABC342 F → ABC404 F → ABC450 G → ABC277 G → ABC226 H → ABC242 Ex → ABC299 Ex → ABC270 Ex                                                                                                                                  |
| DP             | [資源・容量DP](../../src/content/docs/learn/dynamic-programming/dp-subset-resource.md)                                              |   19 | 現順を許容  | ABC410 E → ABC322 E → ABC390 E → ABC419 E → ABC441 F → ABC364 E → ABC222 E → ABC216 F → ABC341 F → ABC275 F → ABC321 F → ABC383 F → ABC325 F → ABC461 F → ABC288 E → ABC320 F → ABC307 G → ABC269 G → ABC424 G                                                                                                                                                                                 |
| DP             | [部分集合・bitmask状態DP](../../src/content/docs/learn/dynamic-programming/dp-subset-state.md)                                      |   15 | 現順を許容  | ABC274 E → ABC301 E → ABC338 F → ABC381 F → ABC232 F → ABC332 E → ABC425 F → ABC310 F → ABC352 F → ABC343 G → ABC411 G → ABC328 G → ABC396 G → ABC432 F → ABC319 F                                                                                                                                                                                                                             |
| DP             | [DP遷移を因数分解・集約して加速する](../../src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)                |   19 | 現順を許容  | ABC253 E → ABC442 F → ABC212 E → ABC370 E → ABC224 E → ABC408 F → ABC372 F → ABC358 G → ABC224 F → ABC353 G → ABC334 F → ABC249 E → ABC243 G → ABC457 F → ABC265 F → ABC282 G → ABC435 G → ABC338 G → ABC221 H                                                                                                                                                                                 |
| DP             | [値域集約による部分列DP](../../src/content/docs/learn/dynamic-programming/dp-value-range.md)                                        |    5 | 現順を許容  | ABC339 E → ABC354 F → ABC360 G → ABC410 G → ABC240 Ex                                                                                                                                                                                                                                                                                                                                          |
| DP             | [大容量unbounded knapsackのeventual linearity](../../src/content/docs/learn/dynamic-programming/eventual-unbounded-knapsack.md)     |    2 | 現順を許容  | ABC415 G → ABC310 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| DP             | [frontier/profile DP・境界状態圧縮](../../src/content/docs/learn/dynamic-programming/frontier-profile-dp.md)                        |    3 | 現順を許容  | ABC248 F → ABC379 G → ABC296 Ex                                                                                                                                                                                                                                                                                                                                                                |
| DP             | [固定線形遷移を巨大回数進める](../../src/content/docs/learn/dynamic-programming/linear-recurrence.md)                               |    4 | 現順を許容  | ABC293 E → ABC256 G → ABC271 G → ABC258 Ex                                                                                                                                                                                                                                                                                                                                                     |
| DP             | [Steiner tree subset DP](../../src/content/docs/learn/dynamic-programming/steiner-tree-dp.md)                                       |    2 | 現順を許容  | ABC364 G → ABC395 G                                                                                                                                                                                                                                                                                                                                                                            |
| 幾何・凸最適化 | [一次元凸・単峰最適化](../../src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)                             |    2 | 現順を許容  | ABC224 G → ABC314 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| 幾何・凸最適化 | [凸包・支持方向・境界候補](../../src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)                              |    6 | 提案 15     | ABC341 G → ABC275 G → ABC286 Ex → ABC244 Ex → ABC356 G → ABC257 Ex                                                                                                                                                                                                                                                                                                                             |
| 幾何・凸最適化 | [fractional programming・比率parametric search](../../src/content/docs/learn/geometry-optimization/fractional-parametric-search.md) |    3 | 現順を許容  | ABC324 F → ABC294 F → ABC236 E                                                                                                                                                                                                                                                                                                                                                                 |
| 幾何・凸最適化 | [幾何の基本判定と座標変換](../../src/content/docs/learn/geometry-optimization/geometry-primitives.md)                               |   15 | 提案 14     | ABC248 E → ABC437 F → ABC442 E → ABC223 E → ABC366 E → ABC426 E → ABC351 E → ABC385 F → ABC377 F → ABC353 F → ABC296 G → ABC258 F → ABC220 G → ABC234 Ex → ABC301 G                                                                                                                                                                                                                            |
| 幾何・凸最適化 | [Lagrangian relaxation・Aliens trick](../../src/content/docs/learn/geometry-optimization/lagrangian-relaxation.md)                  |    4 | 現順を許容  | ABC400 G → ABC355 G → ABC305 Ex → ABC393 G                                                                                                                                                                                                                                                                                                                                                     |
| 幾何・凸最適化 | [Convex Hull Trick・直線包絡](../../src/content/docs/learn/geometry-optimization/line-envelope.md)                                  |    4 | 現順を許容  | ABC289 G → ABC228 H → ABC372 G → ABC448 G                                                                                                                                                                                                                                                                                                                                                      |
| 幾何・凸最適化 | [分離凸・凹の単調限界値選択](../../src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)                      |    6 | 現順を許容  | ABC216 E → ABC359 F → ABC389 E → ABC373 F → ABC369 G → ABC383 G                                                                                                                                                                                                                                                                                                                                |
| 幾何・凸最適化 | [slope trick](../../src/content/docs/learn/geometry-optimization/slope-trick.md)                                                    |    5 | 現順を許容  | ABC250 G → ABC217 H → ABC458 G → ABC406 G → ABC275 Ex                                                                                                                                                                                                                                                                                                                                          |
| グラフ         | [doubling・binary lifting](../../src/content/docs/learn/graph/binary-lifting.md)                                                    |    5 | 現順を許容  | ABC367 E → ABC438 E → ABC212 F → ABC310 G → ABC254 G                                                                                                                                                                                                                                                                                                                                           |
| グラフ         | [二部matching・Hall・Kőnig](../../src/content/docs/learn/graph/bipartite-matching.md)                                               |    8 | 提案 7      | ABC401 G → ABC274 G → ABC445 G → ABC461 G → ABC320 G → ABC374 G → ABC317 G → ABC215 H                                                                                                                                                                                                                                                                                                          |
| グラフ         | [DAGのtopological processing](../../src/content/docs/learn/graph/dag-topological-processing.md)                                     |    3 | 現順を許容  | ABC315 E → ABC291 E → ABC277 F                                                                                                                                                                                                                                                                                                                                                                 |
| グラフ         | [difference constraints・不等式系の最短路化](../../src/content/docs/learn/graph/difference-constraints.md)                          |    2 | 現順を許容  | ABC216 G → ABC404 G                                                                                                                                                                                                                                                                                                                                                                            |
| グラフ         | [有向cycle検出・sink/source peeling](../../src/content/docs/learn/graph/directed-core-peeling.md)                                   |    2 | 現順を許容  | ABC456 E → ABC245 F                                                                                                                                                                                                                                                                                                                                                                            |
| グラフ         | [DSUによる連結成分管理・縮約](../../src/content/docs/learn/graph/dsu-components.md)                                                 |   10 | 現順を許容  | ABC420 E → ABC304 E → ABC372 E → ABC276 E → ABC392 E → ABC401 E → ABC434 E → ABC335 E → ABC238 E → ABC279 F                                                                                                                                                                                                                                                                                    |
| グラフ         | [関数グラフのcycle・tree分解](../../src/content/docs/learn/graph/functional-graph-decomposition.md)                                 |    9 | 現順を許容  | ABC436 E → ABC296 E → ABC256 E → ABC241 E → ABC357 E → ABC377 E → ABC387 F → ABC399 E → ABC284 G                                                                                                                                                                                                                                                                                               |
| グラフ         | [単一サイクル成分とgraph core](../../src/content/docs/learn/graph/graph-core.md)                                                    |    2 | 現順を許容  | ABC226 E → ABC266 F                                                                                                                                                                                                                                                                                                                                                                            |
| グラフ         | [静的graph等式制約のpotential伝播](../../src/content/docs/learn/graph/graph-potential-propagation.md)                               |    2 | 現順を許容  | ABC396 E → ABC280 F                                                                                                                                                                                                                                                                                                                                                                            |
| グラフ         | [Kruskal順の閾値DSU sweep](../../src/content/docs/learn/graph/kruskal-threshold-sweep.md)                                           |    3 | 現順を許容  | ABC235 E → ABC383 E → ABC250 Ex                                                                                                                                                                                                                                                                                                                                                                |
| グラフ         | [lowlinkで橋・関節点を特定する](../../src/content/docs/learn/graph/lowlink-critical-structure.md)                                   |    3 | 現順を許容  | ABC375 G → ABC334 G → ABC301 Ex                                                                                                                                                                                                                                                                                                                                                                |
| グラフ         | [最大流・最小カット](../../src/content/docs/learn/graph/max-flow-min-cut.md)                                                        |   12 | 現順を許容  | ABC318 G → ABC239 G → ABC241 G → ABC259 G → ABC326 G → ABC225 G → ABC263 G → ABC332 G → ABC437 G → ABC347 G → ABC397 G → ABC227 H                                                                                                                                                                                                                                                              |
| グラフ         | [最小費用流・circulation](../../src/content/docs/learn/graph/min-cost-flow.md)                                                      |    6 | 現順を許容  | ABC247 G → ABC407 G → ABC421 G → ABC231 H → ABC224 H → ABC214 H                                                                                                                                                                                                                                                                                                                                |
| グラフ         | [path matchingのheap縮約greedy](../../src/content/docs/learn/graph/path-matching-contraction.md)                                    |    2 | 現順を許容  | ABC464 G → ABC218 H                                                                                                                                                                                                                                                                                                                                                                            |
| グラフ         | [cut・cycle性質から最適全域木を構成する](../../src/content/docs/learn/graph/spanning-tree-optimization.md)                          |    6 | 現順を許容  | ABC218 E → ABC352 E → ABC282 E → ABC270 F → ABC364 F → ABC355 F                                                                                                                                                                                                                                                                                                                                |
| グラフ         | [状態グラフのモデリングと探索](../../src/content/docs/learn/graph/state-graph-search.md)                                            |   15 | 提案 6      | ABC446 E → ABC289 E → ABC429 E → ABC302 F → ABC305 F → ABC394 E → ABC446 F → ABC244 F → ABC427 E → ABC241 F → ABC443 F → ABC319 G → ABC355 E → ABC414 F → ABC361 G                                                                                                                                                                                                                             |
| グラフ         | [推移閉包](../../src/content/docs/learn/graph/transitive-closure.md)                                                                |    2 | 現順を許容  | ABC292 E → ABC287 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| グラフ         | [最短路モデル](../../src/content/docs/learn/graph/weighted-shortest-path.md)                                                        |   21 | 現順を許容  | ABC395 E → ABC325 E → ABC286 E → ABC463 E → ABC277 E → ABC237 E → ABC271 E → ABC213 E → ABC431 E → ABC246 E → ABC291 F → ABC416 E → ABC342 E → ABC243 E → ABC257 F → ABC307 F → ABC245 G → ABC232 G → ABC308 Ex → ABC414 G → ABC243 Ex                                                                                                                                                         |
| モデル変換     | [単調進行による償却解析](../../src/content/docs/learn/modeling/amortized-monotone-progress.md)                                      |    7 | 現順を許容  | ABC217 E → ABC302 E → ABC403 E → ABC368 G → ABC466 F → ABC428 F → ABC256 Ex                                                                                                                                                                                                                                                                                                                    |
| モデル変換     | [候補数を界して全列挙・有限case分解する](../../src/content/docs/learn/modeling/bounded-enumeration.md)                              |   14 | 現順を許容  | ABC234 E → ABC254 E → ABC328 E → ABC369 E → ABC272 E → ABC386 E → ABC219 E → ABC343 E → ABC312 E → ABC260 F → ABC347 F → ABC227 F → ABC442 G → ABC313 F                                                                                                                                                                                                                                        |
| モデル変換     | [基準witnessから変更影響を局所化する](../../src/content/docs/learn/modeling/change-impact-localization.md)                          |    2 | 現順を許容  | ABC279 E → ABC218 F                                                                                                                                                                                                                                                                                                                                                                            |
| モデル変換     | [成立証明から構成解を復元する](../../src/content/docs/learn/modeling/constructive-witness.md)                                       |   15 | 現順を許容  | ABC333 E → ABC299 E → ABC251 F → ABC454 E → ABC448 F → ABC255 F → ABC363 F → ABC239 F → ABC233 F → ABC387 E → ABC289 F → ABC358 F → ABC244 G → ABC232 H → ABC453 F                                                                                                                                                                                                                             |
| モデル変換     | [局所寄与へ分解して集計順を交換する](../../src/content/docs/learn/modeling/contribution-reordering.md)                              |   35 | 現順を許容  | ABC233 E → ABC371 E → ABC318 E → ABC308 E → ABC365 E → ABC324 E → ABC347 E → ABC423 E → ABC379 E → ABC247 E → ABC334 E → ABC280 E → ABC418 E → ABC436 F → ABC411 E → ABC378 E → ABC396 F → ABC290 E → ABC255 E → ABC306 F → ABC261 F → ABC220 E → ABC269 F → ABC439 F → ABC407 F → ABC390 F → ABC438 F → ABC380 G → ABC295 E → ABC362 F → ABC215 G → ABC268 G → ABC295 F → ABC231 G → ABC330 G |
| モデル変換     | [event順にactive集合を更新する](../../src/content/docs/learn/modeling/event-sweep.md)                                               |   15 | 現順を許容  | ABC320 E → ABC363 E → ABC453 E → ABC231 F → ABC309 F → ABC327 F → ABC283 F → ABC449 E → ABC449 F → ABC368 E → ABC346 G → ABC311 G → ABC274 F → ABC360 F → ABC266 Ex                                                                                                                                                                                                                            |
| モデル変換     | [偶奇不変量からゲームの勝敗を決める](../../src/content/docs/learn/modeling/game-parity-invariant.md)                                |    2 | 現順を許容  | ABC398 E → ABC398 G                                                                                                                                                                                                                                                                                                                                                                            |
| モデル変換     | [交換論から選択順を導く](../../src/content/docs/learn/modeling/greedy-exchange.md)                                                  |   29 | 提案 1      | ABC447 E → ABC376 E → ABC388 E → ABC257 E → ABC417 E → ABC404 E → ABC308 F → ABC385 E → ABC457 E → ABC407 E → ABC298 F → ABC312 F → ABC245 E → ABC252 F → ABC433 E → ABC225 E → ABC214 E → ABC268 F → ABC366 F → ABC299 G → ABC262 F → ABC371 G → ABC226 G → ABC290 G → ABC225 F → ABC254 Ex → ABC434 F → ABC304 Ex → ABC290 Ex                                                                |
| モデル変換     | [meet-in-the-middle・半分全列挙](../../src/content/docs/learn/modeling/meet-in-the-middle.md)                                       |    9 | 現順を許容  | ABC271 F → ABC427 F → ABC402 F → ABC326 F → ABC336 F → ABC464 F → ABC300 G → ABC252 Ex → ABC220 H                                                                                                                                                                                                                                                                                              |
| モデル変換     | [単調境界を証明して探索する](../../src/content/docs/learn/modeling/monotone-search.md)                                              |   19 | 提案 2, 3   | ABC269 E → ABC270 E → ABC267 E → ABC381 E → ABC395 F → ABC292 F → ABC424 E → ABC374 E → ABC373 E → ABC330 F → ABC300 F → ABC215 F → ABC388 G → ABC229 G → ABC246 G → ABC303 F → ABC444 F → ABC293 Ex → ABC263 Ex                                                                                                                                                                               |
| モデル変換     | [同値な状態を正規化する](../../src/content/docs/learn/modeling/normalization.md)                                                    |   12 | 現順を許容  | ABC462 E → ABC242 E → ABC250 E → ABC323 F → ABC296 F → ABC302 G → ABC446 G → ABC463 F → ABC313 G → ABC219 F → ABC427 G → ABC382 G                                                                                                                                                                                                                                                              |
| モデル変換     | [parallel binary search・多数境界の判定共有](../../src/content/docs/learn/modeling/parallel-binary-search.md)                       |    2 | 現順を許容  | ABC394 G → ABC233 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| モデル変換     | [乱択代数fingerprint](../../src/content/docs/learn/modeling/randomized-algebraic-fingerprint.md)                                    |    4 | 現順を許容  | ABC367 F → ABC339 F → ABC238 G → ABC455 G                                                                                                                                                                                                                                                                                                                                                      |
| モデル変換     | [乱択の成功条件と誤り確率を設計する](../../src/content/docs/learn/modeling/randomized-algorithms.md)                                |    2 | 現順を許容  | ABC422 E → ABC272 G                                                                                                                                                                                                                                                                                                                                                                            |
| モデル変換     | [再帰分割・分割統治](../../src/content/docs/learn/modeling/recursive-divide-and-conquer.md)                                         |    3 | 現順を許容  | ABC413 E → ABC426 G → ABC282 Ex                                                                                                                                                                                                                                                                                                                                                                |
| モデル変換     | [時間を逆向きにして未来依存を消す](../../src/content/docs/learn/modeling/reverse-offline.md)                                        |   10 | 現順を許容  | ABC229 E → ABC346 E → ABC464 E → ABC264 E → ABC392 F → ABC329 E → ABC375 F → ABC253 F → ABC249 F → ABC238 Ex                                                                                                                                                                                                                                                                                   |
| モデル変換     | [small-to-large・DSU on Tree](../../src/content/docs/learn/modeling/small-to-large.md)                                              |    4 | 現順を許容  | ABC329 F → ABC411 F → ABC454 G → ABC324 G                                                                                                                                                                                                                                                                                                                                                      |
| モデル変換     | [平方根・閾値による軽重分類](../../src/content/docs/learn/modeling/threshold-heavy-light.md)                                        |    5 | 現順を許容  | ABC335 F → ABC350 G → ABC219 G → ABC365 G → ABC259 Ex                                                                                                                                                                                                                                                                                                                                          |
| モデル変換     | [尺取り法・sliding windowで連続区間を走査する](../../src/content/docs/learn/modeling/two-pointers-window.md)                        |    8 | 現順を許容  | ABC294 E → ABC444 E → ABC258 E → ABC452 F → ABC260 E → ABC250 F → ABC370 F → ABC337 F                                                                                                                                                                                                                                                                                                          |
| 数論           | [巡回群を指数化して数える](../../src/content/docs/learn/number-theory/cyclic-group-exponent-counting.md)                            |    2 | 現順を許容  | ABC212 G → ABC335 G                                                                                                                                                                                                                                                                                                                                                                            |
| 数論           | [格子点転置によるfloor_sum](../../src/content/docs/learn/number-theory/euclidean-floor-sum.md)                                      |    3 | 現順を許容  | ABC443 G → ABC283 Ex → ABC402 G                                                                                                                                                                                                                                                                                                                                                                |
| 数論           | [gcdと整数解の成立条件](../../src/content/docs/learn/number-theory/gcd-diophantine.md)                                              |    3 | 現順を許容  | ABC340 F → ABC315 G → ABC271 Ex                                                                                                                                                                                                                                                                                                                                                                |
| 数論           | [gcd不変量・差分構造](../../src/content/docs/learn/number-theory/gcd-structure.md)                                                  |    2 | 現順を許容  | ABC254 F → ABC438 G                                                                                                                                                                                                                                                                                                                                                                            |
| 数論           | [整数境界と同値区間を正確に分ける](../../src/content/docs/learn/number-theory/integer-boundary-blocks.md)                           |   10 | 現順を許容  | ABC230 E → ABC414 E → ABC452 E → ABC356 E → ABC240 F → ABC293 F → ABC318 F → ABC253 G → ABC239 Ex → ABC429 G                                                                                                                                                                                                                                                                                   |
| 数論           | [一次合同・CRTで解の類を統合する](../../src/content/docs/learn/number-theory/modular-congruence.md)                                 |    4 | 現順を許容  | ABC460 E → ABC286 F → ABC423 G → ABC245 Ex                                                                                                                                                                                                                                                                                                                                                     |
| 数論           | [剰余周期と指数法則を利用する](../../src/content/docs/learn/number-theory/modular-periodicity.md)                                   |    2 | 現順を許容  | ABC319 E → ABC228 E                                                                                                                                                                                                                                                                                                                                                                            |
| 数論           | [素因数分解と約数構造](../../src/content/docs/learn/number-theory/prime-divisor.md)                                                 |    9 | 現順を許容  | ABC400 E → ABC393 E → ABC259 E → ABC445 E → ABC420 G → ABC412 E → ABC384 F → ABC227 G → ABC322 G                                                                                                                                                                                                                                                                                               |
| 数論           | [連分数・Stern–Brocotで有理近似する](../../src/content/docs/learn/number-theory/rational-approximation.md)                          |    2 | 現順を許容  | ABC408 G → ABC333 G                                                                                                                                                                                                                                                                                                                                                                            |
| 区間・query    | [bitsetで集合演算をword並列化する](../../src/content/docs/learn/query/bitset-word-parallel.md)                                      |    3 | 現順を許容  | ABC258 G → ABC348 F → ABC221 G                                                                                                                                                                                                                                                                                                                                                                 |
| 区間・query    | [大小関係をCartesian treeへ変換する](../../src/content/docs/learn/query/cartesian-tree.md)                                          |    2 | 現順を許容  | ABC435 F → ABC420 F                                                                                                                                                                                                                                                                                                                                                                            |
| 区間・query    | [要素索引と連結リストで局所linkを更新する](../../src/content/docs/learn/query/linked-list-index.md)                                 |    2 | 現順を許容  | ABC344 E → ABC421 F                                                                                                                                                                                                                                                                                                                                                                            |
| 区間・query    | [Moの順序で区間問い合わせの差分を更新する](../../src/content/docs/learn/query/mo-offline-range.md)                                  |    4 | 現順を許容  | ABC242 G → ABC293 G → ABC384 G → ABC405 G                                                                                                                                                                                                                                                                                                                                                      |
| 区間・query    | [支配関係から不要な候補を単調stack・queueで削る](../../src/content/docs/learn/query/monotone-stack-queue.md)                        |    5 | 現順を許容  | ABC359 E → ABC379 F → ABC228 F → ABC234 G → ABC248 Ex                                                                                                                                                                                                                                                                                                                                          |
| 区間・query    | [端点更新型のrun分割管理](../../src/content/docs/learn/query/ordered-interval-partition.md)                                         |    4 | 現順を許容  | ABC435 E → ABC380 E → ABC255 Ex → ABC465 G                                                                                                                                                                                                                                                                                                                                                     |
| 区間・query    | [ordered set・multisetの動的順序管理](../../src/content/docs/learn/query/ordered-set-multiset.md)                                   |    7 | 現順を許容  | ABC330 E → ABC306 E → ABC281 E → ABC308 G → ABC356 F → ABC314 G → ABC431 G                                                                                                                                                                                                                                                                                                                     |
| 区間・query    | [永続data structure・structural sharing](../../src/content/docs/learn/query/persistence.md)                                         |    2 | 現順を許容  | ABC273 E → ABC453 G                                                                                                                                                                                                                                                                                                                                                                            |
| 区間・query    | [一次元・二次元累積和と差分で区間情報を線形化する](../../src/content/docs/learn/query/prefix-aggregate.md)                          |    9 | 現順を許容  | ABC441 E → ABC278 E → ABC341 E → ABC430 F → ABC410 F → ABC465 F → ABC268 E → ABC454 F → ABC260 G                                                                                                                                                                                                                                                                                               |
| 区間・query    | [priority queue・best-first列挙](../../src/content/docs/learn/query/priority-queue-best-first.md)                                   |    7 | 現順を許容  | ABC384 E → ABC331 E → ABC305 E → ABC297 E → ABC391 F → ABC409 F → ABC440 E                                                                                                                                                                                                                                                                                                                     |
| 区間・query    | [区間更新を要約へ作用させる](../../src/content/docs/learn/query/range-actions.md)                                                   |   14 | 現順を許容  | ABC340 E → ABC382 F → ABC417 F → ABC455 F → ABC389 F → ABC332 F → ABC357 F → ABC322 F → ABC397 F → ABC426 F → ABC441 G → ABC237 G → ABC371 F → ABC265 G                                                                                                                                                                                                                                        |
| 区間・query    | [区間monoid要約](../../src/content/docs/learn/query/range-monoid-aggregation.md)                                                    |   16 | 提案 8      | ABC432 E → ABC343 F → ABC223 F → ABC415 F → ABC424 F → ABC331 F → ABC285 F → ABC429 F → ABC460 F → ABC440 F → ABC292 Ex → ABC447 G → ABC418 F → ABC365 F → ABC246 Ex → ABC434 G                                                                                                                                                                                                                |
| 区間・query    | [rollback・DFS入退場の状態復元](../../src/content/docs/learn/query/rollback.md)                                                     |    3 | 現順を許容  | ABC218 G → ABC302 Ex → ABC363 G                                                                                                                                                                                                                                                                                                                                                                |
| 区間・query    | [反転数・重み付き接頭辞統計をFenwick Treeで保つ](../../src/content/docs/learn/query/weighted-prefix-fenwick.md)                     |    6 | 現順を許容  | ABC351 F → ABC221 E → ABC276 F → ABC461 E → ABC256 F → ABC287 G                                                                                                                                                                                                                                                                                                                                |
| 文字列         | [Aho–Corasick](../../src/content/docs/learn/string/aho-corasick.md)                                                                 |    2 | 現順を許容  | ABC419 F → ABC458 F                                                                                                                                                                                                                                                                                                                                                                            |
| 文字列         | [有限状態automatonの構成](../../src/content/docs/learn/string/finite-pattern-automaton.md)                                          |    4 | 現順を許容  | ABC305 G → ABC264 G → ABC301 F → ABC418 G                                                                                                                                                                                                                                                                                                                                                      |
| 文字列         | [回文半径と左右対称区間を特定する](../../src/content/docs/learn/string/palindrome-radius.md)                                        |    2 | 現順を許容  | ABC398 F → ABC349 G                                                                                                                                                                                                                                                                                                                                                                            |
| 文字列         | [圧縮・反復・再帰文字列へ問い合わせる](../../src/content/docs/learn/string/recursive-compressed-string.md)                          |    4 | 現順を許容  | ABC450 E → ABC350 F → ABC346 F → ABC417 G                                                                                                                                                                                                                                                                                                                                                      |
| 文字列         | [接尾辞の順序とLCPを索引化する](../../src/content/docs/learn/string/suffix-lcp-index.md)                                            |    6 | 現順を許容  | ABC362 G → ABC272 F → ABC213 F → ABC452 G → ABC268 Ex → ABC280 Ex                                                                                                                                                                                                                                                                                                                              |
| 文字列         | [Trieで共有接頭辞を索引化する](../../src/content/docs/learn/string/trie-prefix.md)                                                  |    4 | 提案 9      | ABC287 E → ABC353 E → ABC437 E → ABC377 G                                                                                                                                                                                                                                                                                                                                                      |
| 文字列         | [Z algorithmによるprefix matching](../../src/content/docs/learn/string/z-algorithm.md)                                              |    3 | 現順を許容  | ABC430 E → ABC284 F → ABC257 G                                                                                                                                                                                                                                                                                                                                                                 |
| 木             | [DSU merge tree・Kruskal reconstruction tree](../../src/content/docs/learn/tree/dsu-merge-tree.md)                                  |    2 | 現順を許容  | ABC314 F → ABC235 Ex                                                                                                                                                                                                                                                                                                                                                                           |
| 木             | [rerooting・全方位木DP](../../src/content/docs/learn/tree/rerooting.md)                                                             |    3 | 現順を許容  | ABC220 F → ABC348 E → ABC223 G                                                                                                                                                                                                                                                                                                                                                                 |
| 木             | [根付き木DP・部分木集約](../../src/content/docs/learn/tree/rooted-tree-aggregation.md)                                              |   17 | 提案 12     | ABC309 E → ABC409 E → ABC239 E → ABC391 E → ABC459 E → ABC378 F → ABC447 F → ABC397 E → ABC394 F → ABC312 G → ABC259 F → ABC287 F → ABC263 F → ABC416 F → ABC248 G → ABC264 Ex → ABC329 G                                                                                                                                                                                                      |
| 木             | [rake・compressで動的木DPを保つ](../../src/content/docs/learn/tree/static-top-tree.md)                                              |    2 | 現順を許容  | ABC351 G → ABC460 G                                                                                                                                                                                                                                                                                                                                                                            |
| 木             | [木の均衡分離点から重心分解へ進む](../../src/content/docs/learn/tree/tree-balanced-separators.md)                                   |    2 | 現順を許容  | ABC291 Ex → ABC359 G                                                                                                                                                                                                                                                                                                                                                                           |
| 木             | [Euler順による部分木区間化](../../src/content/docs/learn/tree/tree-euler-flattening.md)                                             |    4 | 現順を許容  | ABC240 E → ABC406 F → ABC294 G → ABC337 G                                                                                                                                                                                                                                                                                                                                                      |
| 木             | [基準点からの木距離・剰余類・直径・中心](../../src/content/docs/learn/tree/tree-metric.md)                                          |    7 | 現順を許容  | ABC303 E → ABC361 E → ABC428 E → ABC401 F → ABC222 F → ABC267 F → ABC221 F                                                                                                                                                                                                                                                                                                                     |

照合: 232 Unit = 比較120 + 単問67 + 空45。868問 = 比較801 + 単問67。提案15件・13 Unit。
