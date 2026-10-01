# Inventory に基づく全問題の意味的分類監査

監査日: 2026-09-26。対象は現在の final-taxonomy-build の全 placement と、それぞれに対応する trusted Technique Inventory。

## 結論

- **全 868 問を確認した。必須修正は 49 問・53 指摘。**
- 軸別の影響問題数: semantic primary 5 問、co-primary/home 順序 1 問、supporting 49 問。軸の件数は重複する。
- 残る 819 問は現分類を許容する。一部の粒度改善は必須修正から分離して所見を付けた。
- 分類ファイルの修正は行っていない。この文書が報告成果物である。

## 判定の意味と根拠

Inventory は真として扱った。全問題の algorithmConnection・典型技能の具体的な意味・前提を読み、疑義がある問題では採用/棄却案、keyInsights、implementationConcerns まで戻った。技法名の一致や正規表現、既存の claim disposition、以前の監査の結論を正誤の根拠にはしていない。

P は問題を解けるようにする再利用可能な核心、C は追加で学ぶ核心、S は採用解法で実際に使う別の既習技能として判断した。複数の核心があるときの home は、最も問題固有の発見だけでなく、採用案を成立させる変換・計算量のボトルネック・教材として再利用する判断を合わせて選んだ。一般に home は数学的に一意ではないので、広い分類が成立する場合の具体化は改善所見に分けた。

supporting の十分性は、全 prerequisite の推移閉包を列挙する意味ではない。専用 Outcome に含まれる内部操作、標準ソート・lower_bound・通常 gcd・単純な法加減乗算などの baseline は重ねない。一方、NTT 内部の逆変換や組合せ計算内部の通常の逆階乗とは別に、問題の確率を正規化する逆元、零分母の条件、動的な因子除去などを発動する場合は法演算 S が必要と判断した。

現 Outcome の statement を技能の意味として用いた。例えば全点間の値を得ることと Floyd–Warshall、Gaussian binomial と Gaussian elimination、二部性の理論と matching solver は別である。適切な既存 Outcome がない指摘では、不適切な既存 ID へ無理に押し込まず不足する技能を日本語で記した。

スクリプトは Inventory と placement の読出し・報告の整形・全件対応の確認だけに用いた。指摘集合と理由は問題ごとの意味的判断として記述したものであり、ルールによって分類の正誤を生成したものではない。

### 対象スナップショット

- [final-taxonomy-build.json](../../staging/taxonomy/initial/final-taxonomy-build.json)
- [配置原則](../../src/lib/taxonomy/final-taxonomy-policy.ts) / [baseline 定義](../../src/lib/taxonomy/final-taxonomy-baseline.ts)
- build SHA-256: `b8d4248d53900f9f3da3e1ebfb07157da701c713d8e21a52808fe4f282c86cdb`
- buildDigest: `a83767c84a9cb372c1228a1849ba7ad25ea0b926c3443a52e846b4230fa86ee8`
- Inventory の problemId 集合と placement の problemId 集合は一致し、各 868 件。存在しない contest/problem を連番から補っていない。

## 必須修正一覧

以下の ID は `outcome-` を省略した表記。変更を指示していない P/C/S は維持する。各問題の見出しリンクは Inventory 本文へ接続する。

| 問題 | 修正軸 | 指摘数 |
|---|---|---:|
| [abc212-h](#finding-abc212-h) | S | 1 |
| [abc216-h](#finding-abc216-h) | S | 1 |
| [abc224-f](#finding-abc224-f) | P / S | 1 |
| [abc226-h](#finding-abc226-h) | S | 1 |
| [abc228-h](#finding-abc228-h) | S | 1 |
| [abc231-g](#finding-abc231-g) | S | 1 |
| [abc249-ex](#finding-abc249-ex) | S | 2 |
| [abc253-ex](#finding-abc253-ex) | S | 1 |
| [abc256-f](#finding-abc256-f) | S | 1 |
| [abc259-ex](#finding-abc259-ex) | S | 1 |
| [abc261-g](#finding-abc261-g) | S | 1 |
| [abc263-e](#finding-abc263-e) | S | 1 |
| [abc268-g](#finding-abc268-g) | S | 1 |
| [abc271-e](#finding-abc271-e) | P / S | 1 |
| [abc278-ex](#finding-abc278-ex) | P / S | 1 |
| [abc280-e](#finding-abc280-e) | P / S | 1 |
| [abc282-ex](#finding-abc282-ex) | S | 1 |
| [abc299-ex](#finding-abc299-ex) | S | 1 |
| [abc300-e](#finding-abc300-e) | S | 1 |
| [abc305-ex](#finding-abc305-ex) | S | 1 |
| [abc310-g](#finding-abc310-g) | S | 1 |
| [abc313-ex](#finding-abc313-ex) | S | 1 |
| [abc327-g](#finding-abc327-g) | S | 1 |
| [abc330-g](#finding-abc330-g) | S | 1 |
| [abc331-g](#finding-abc331-g) | S | 1 |
| [abc334-g](#finding-abc334-g) | S | 1 |
| [abc345-g](#finding-abc345-g) | S | 1 |
| [abc352-g](#finding-abc352-g) | S | 2 |
| [abc362-f](#finding-abc362-f) | S | 1 |
| [abc364-f](#finding-abc364-f) | S | 1 |
| [abc369-g](#finding-abc369-g) | S | 1 |
| [abc402-f](#finding-abc402-f) | S | 1 |
| [abc409-g](#finding-abc409-g) | P / C / S | 2 |
| [abc411-g](#finding-abc411-g) | S | 1 |
| [abc413-g](#finding-abc413-g) | S | 1 |
| [abc418-e](#finding-abc418-e) | S | 1 |
| [abc423-g](#finding-abc423-g) | S | 1 |
| [abc428-f](#finding-abc428-f) | S | 1 |
| [abc428-g](#finding-abc428-g) | S | 1 |
| [abc433-e](#finding-abc433-e) | S | 1 |
| [abc439-g](#finding-abc439-g) | S | 1 |
| [abc445-e](#finding-abc445-e) | S | 1 |
| [abc449-f](#finding-abc449-f) | S | 1 |
| [abc450-g](#finding-abc450-g) | S | 1 |
| [abc455-f](#finding-abc455-f) | S | 1 |
| [abc462-g](#finding-abc462-g) | S | 1 |
| [abc463-f](#finding-abc463-f) | S | 1 |
| [abc463-g](#finding-abc463-g) | S | 1 |
| [abc464-f](#finding-abc464-f) | S | 2 |

<a id="finding-abc212-h"></a>
### [abc212-h](../../src/content/technique-inventory/shard-04/abc212-h.json)

P: `factor-separable-linear-transform` / C: — / S: `classify-game-states`

**指摘 1（S）**

変換後の各 scalar について可変長列の冪和を評価する。値 0/1 と一般値を分けた等比和の除算・高速累乗は、軸ごとの線形変換そのものとは別の工程である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** keyInsights、implementationConcerns の変換値 0/1 と等比級数。


<a id="finding-abc216-h"></a>
### [abc216-h](../../src/content/technique-inventory/shard-05/abc216-h.json)

P: `count-nonintersecting-paths-by-lgv` / C: — / S: `enumerate-subset-state-space`、`formulate-combinatorial-coefficients`

**指摘 1（S）**

LGV/subset DP が数える非交差操作列数を、全操作列数 2^(NK) で割って確率へ戻す。二項係数の計算とは独立の正規化である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の 2^(NK) の法逆元。


<a id="finding-abc224-f"></a>
### [abc224-f](../../src/content/technique-inventory/shard-05/abc224-f.json)

P: `reorder-counting-contributions` / C: — / S: —

**指摘 1（P / S）**

採用解法は各桁の独立な寄与公式を足すだけではない。全式の個数 ways、末尾項総和 last、式総和 total が連結・切断の両分岐について閉じることが、指数個の式を線形時間へ落とす核心である。現状の寄与数え上げ一つでは、この状態集約技能が落ちる。

**修正:** P を compress-dp-sufficient-aggregates に変更。reorder-counting-contributions は S に移す。C を新設する必要はない。

**Inventory 根拠:** candidateApproaches の採用案、keyInsights の last'=10last+2d·ways / total'=2total+9last+2d·ways、typicalTechniques「全分岐に対する集約DP」。


<a id="finding-abc226-h"></a>
### [abc226-h](../../src/content/technique-inventory/shard-03/abc226-h.json)

P: `propagate-probability-distribution` / C: — / S: —

**指摘 1（S）**

成功確率の分母 R_i−L_i と、係数積分の分母 d+1 を法上で割る。確率 DP の加減乗算だけでは厳密な有理数積分を実装できない。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** keyInsights と implementationConcerns の二種類の逆元。


<a id="finding-abc228-h"></a>
### [abc228-h](../../src/content/technique-inventory/shard-01/abc228-h.json)

P: `optimize-by-line-envelope` / C: — / S: `design-interval-split-dp`、`prove-greedy-order`

**指摘 1（S）**

ソート後の区間コストを用いるが、DP は処理済み prefix と最後の一ブロックの結合である。二つの独立な区間 DP を分割点で合成する interval-split ではない。区間を扱うという表層が混同されている。

**修正:** S の design-interval-split-dp を design-prefix-partition-dp に置換。CHT の P と交換論の S は維持。

**Inventory 根拠:** reasoningPath.algorithmConnection と keyInsights の最終ブロックを固定した DP 遷移。


<a id="finding-abc231-g"></a>
### [abc231-g](../../src/content/technique-inventory/shard-04/abc231-g.json)

P: `reorder-counting-contributions` / C: — / S: `encode-counting-by-generating-function`

**指摘 1（S）**

multinomial の相異なる座標の階乗 moment (K)_m/N^m を法上で計算する。対称式の生成関数を作る処理とは独立に、確率の分母とその逆冪が必要である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** reasoningPath の階乗 moment、implementationConcerns の逆冪。


<a id="finding-abc249-ex"></a>
### [abc249-ex](../../src/content/technique-inventory/shard-03/abc249-ex.json)

P: `decompose-expectation-by-additive-potential` / C: — / S: `compute-convolution-or-correlation`、`formulate-combinatorial-coefficients`、`solve-stochastic-recurrence`

**指摘 1（S）**

一色の個数遷移分布を計算するための二項係数・畳み込みは記載されているが、NTT/FFT による高速多項式積を発動する記載はない。現 Outcome は「NTT・FFTで必要な係数範囲を計算」まで要求しており、単なる確率の積和との意味差がある。

**修正:** compute-convolution-or-correlation を S から外す。分布の直接計算は既存の組合せ係数と期待値方程式で説明する。高速畳み込みを別途採用するなら、その採用解法を明記してから付ける。

**Inventory 根拠:** 採用案は加法的ポテンシャルと上ヘッセンベルグ型の逐次方程式。prerequisiteCandidates は「二項係数や畳み込み」であり NTT/FFT の指定ではない。

**指摘 2（S）**

各頻度の方程式から次項を得るため P[j][j+1] で割る。法上で非零な係数を確認して逐次的に解く必要がある。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の自己ループ係数と P[j][j+1] の逆元。


<a id="finding-abc253-ex"></a>
### [abc253-ex](../../src/content/technique-inventory/shard-05/abc253-ex.json)

P: `count-combinatorial-objects-by-determinant` / C: — / S: `count-labeled-structures-by-components`

**指摘 1（S）**

行列式と成分 DP が求める森林数へ i! を掛け、全操作列数 M^i で割る。行列式内部の体演算とは別の確率正規化である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の i! と M^i の逆元。


<a id="finding-abc256-f"></a>
### [abc256-f](../../src/content/technique-inventory/shard-00/abc256-f.json)

P: `maintain-weighted-prefix-statistics` / C: — / S: `formulate-combinatorial-coefficients`

**指摘 1（S）**

Fenwick tree の三つの moment から作る二次式を、法上で 2 で割って D_x へ戻す。組合せ係数を導くことと、剰余に対する除算の実装は別である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** algorithmConnection の /2 と implementationConcerns の法逆元。


<a id="finding-abc259-ex"></a>
### [abc259-ex](../../src/content/technique-inventory/shard-00/abc259-ex.json)

P: `balance-heavy-light-threshold` / C: — / S: `formulate-combinatorial-coefficients`

**指摘 1（S）**

heavy/light のうち重い色は、各始点の寄与を格子の上・左から伝播する DP でまとめる。軽い色の点対を数える二項係数だけでは、重い側のアルゴリズムを再構成できない。

**修正:** design-grid-table-dp を S に追加。P の頻度平方分割と S の組合せ係数は維持。

**Inventory 根拠:** algorithmConnection の重い色に対する格子 DP と、typicalTechniques の二手法の使い分け。


<a id="finding-abc261-g"></a>
### [abc261-g](../../src/content/technique-inventory/shard-04/abc261-g.json)

P: `design-interval-split-dp` / C: — / S: `compute-all-pairs-distance`

**指摘 1（S）**

長さ一の生成規則を閉包する採用手続きは、26 文字の逆向きグラフで初期距離を与えて Dijkstra を行うもの。現 compute-all-pairs-distance は中間頂点集合を増やす Floyd–Warshall を要求しており、複数の文字間距離という結果だけで同一視できない。

**修正:** compute-all-pairs-distance を model-and-compute-shortest-path に置換。区間分割 DP の P は維持。

**Inventory 根拠:** algorithmConnection と実装上の単項生成規則の最短距離閉包。


<a id="finding-abc263-e"></a>
### [abc263-e](../../src/content/technique-inventory/shard-02/abc263-e.json)

P: `solve-stochastic-recurrence` / C: — / S: `compute-in-modular-arithmetic`

**指摘 1（S）**

自己ループを移項して期待値を求めるだけでは、各位置から A_i 個の次状態を合計する二乗時間の処理が残る。suffix sum による遷移和の定数時間化が独立に必要である。

**修正:** factor-and-accelerate-transitions を S に追加。期待値方程式の P と法演算の S は維持。

**Inventory 根拠:** algorithmConnection、typicalTechniques の suffix sum による期待値 DP の高速化。


<a id="finding-abc268-g"></a>
### [abc268-g](../../src/content/technique-inventory/shard-02/abc268-g.json)

P: `reorder-counting-contributions` / C: — / S: `index-shared-prefixes-with-trie`

**指摘 1（S）**

prefix 関係でない文字列対が前に来る確率 1/2 を法上で表し、(N+A_i−B_i)/2 を計算する。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns が inverse of 2 を明記。


<a id="finding-abc271-e"></a>
### [abc271-e](../../src/content/technique-inventory/shard-04/abc271-e.json)

P: `design-order-preserving-dp` / C: — / S: `relax-in-dependency-order`

**指摘 1（P / S）**

必要なのは選べる部分列一般の DP ではなく、与えられた辺列の prefix で実現可能な最短距離を保ち、その次の一辺を一度緩和する不変条件である。このための専用 Outcome が既に S にある。

**修正:** relax-in-dependency-order を P に昇格。design-order-preserving-dp は同じ一つの遷移の一般化なので、独立した S/C としては残さない。

**Inventory 根拠:** algorithmConnection の辺列順の dist[b]←min(dist[b],dist[a]+c) 更新。


<a id="finding-abc278-ex"></a>
### [abc278-ex](../../src/content/technique-inventory/shard-02/abc278-ex.json)

P: `solve-linear-system-and-rank` / C: — / S: `compute-convolution-or-correlation`、`formulate-combinatorial-coefficients`

**指摘 1（P / S）**

Gaussian binomial と Gaussian elimination が混同されている。採用解法は rank 別の部分空間・行列の個数を q=2 の二項係数で数え、Stirling 変換を反転して distinct 制約を戻す。入力行列を掃き出して rank や解空間を求める工程はなく、基底を状態にする案は棄却されている。

**修正:** solve-linear-system-and-rank を P から除く。有限体上の部分空間・rank 別計数を表す Outcome を用意して P にする。Stirling 変換とその逆変換を独立した S として追加する。既存の通常組合せ係数・高速畳み込みは維持。現 Outcome 集合だけで Gaussian elimination に代入する修正は不可。

**Inventory 根拠:** candidateApproaches の採用案と棄却案、keyInsights の G(s)=Σ_t {s\brace t}F(t)、typicalTechniques の q-binomial coefficient / Stirling変換。


<a id="finding-abc280-e"></a>
### [abc280-e](../../src/content/technique-inventory/shard-02/abc280-e.json)

P: `solve-stochastic-recurrence` / C: — / S: `compute-in-modular-arithmetic`

**指摘 1（P / S）**

Inventory が採るのは p_i=1-q p_{i-1} による到達確率を求め、各体力を訪れる指示変数の期待値を足す方法である。「状態から先の期待費用」を未知数にする solve-stochastic-recurrence の定義とは異なる。別の正解法が存在することは現採用案の分類根拠にならない。

**修正:** P を reorder-counting-contributions に変更し、propagate-probability-distribution を S に追加。既存の法演算 S は維持。

**Inventory 根拠:** 採用案、algorithmConnection の到達確率 p とその総和。


<a id="finding-abc282-ex"></a>
### [abc282-ex](../../src/content/technique-inventory/shard-00/abc282-ex.json)

P: `divide-search-space-recursively` / C: — / S: `answer-idempotent-range-query`

**指摘 1（S）**

区間最小値を pivot に再帰する木は平衡とは限らない。小さい側の端点だけを走査するため、一要素が走査される回数が対数回になるという償却が計算量の根拠である。分割統治と RMQ だけではこの根拠が落ちる。

**修正:** bound-monotone-total-work を S に追加。divide-search-space-recursively と answer-idempotent-range-query は維持。

**Inventory 根拠:** algorithmConnection と典型技能の smaller-side enumeration。


<a id="finding-abc299-ex"></a>
### [abc299-ex](../../src/content/technique-inventory/shard-02/abc299-ex.json)

P: `solve-stochastic-recurrence` / C: — / S: `accelerate-fixed-linear-transition`、`compute-in-modular-arithmetic`

**指摘 1（S）**

行列累乗で一周期の到達量を得た後、E_1..E_6 の一般の連立一次方程式を解く。自己ループの一項移項とも、遷移行列の累乗とも別の工程である。

**修正:** solve-linear-system-and-rank を S に追加。現 P/C/S はそのほか維持。

**Inventory 根拠:** 採用案「6残差の連立方程式と線形漸化式高速化」、implementationConcerns の pivot 非零確認を伴う Gauss 消去。


<a id="finding-abc300-e"></a>
### [abc300-e](../../src/content/technique-inventory/shard-04/abc300-e.json)

P: `propagate-probability-distribution` / C: — / S: —

**指摘 1（S）**

自己ループを除いた五つの遷移の確率を法上の 1/5 として扱う。確率式を立てることだけでは、剰余での除算方法を表せない。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** algorithmConnection の和/5、法998244353で出力。


<a id="finding-abc305-ex"></a>
### [abc305-ex](../../src/content/technique-inventory/shard-03/abc305-ex.json)

P: `optimize-by-lagrangian-relaxation` / C: — / S: `design-interval-split-dp`、`prove-greedy-order`

**指摘 1（S）**

元の dp[k][r]=min_l dp[k−1][l]+c(l,r) も、penalty を加えた oracle も、列 prefix を最後の一ブロックで延長する分割 DP である。左右の独立区間を合成する interval-split とは異なる。

**修正:** design-interval-split-dp を design-prefix-partition-dp に置換。Aliens の P と交換論 S は維持。Monge はここでは凸性の正当化であり、Monge 最小点探索を別途追加しない。

**Inventory 根拠:** candidateApproaches に明示された dp[k][r]、採用 Aliens oracle と keyInsights の凸双対。


<a id="finding-abc310-g"></a>
### [abc310-g](../../src/content/technique-inventory/shard-02/abc310-g.json)

P: `jump-deterministic-transition` / C: — / S: —

**指摘 1（S）**

写像と区間和の doubling 後に K 時刻の総和を K で割る。この平均化は写像合成の技能に含まれない。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** algorithmConnection の「得た K 状態の総和を法上の K で割る」、prerequisiteCandidates の法逆元。


<a id="finding-abc313-ex"></a>
### [abc313-ex](../../src/content/technique-inventory/shard-04/abc313-ex.json)

P: `design-minimal-sufficient-state` / C: — / S: `formulate-combinatorial-coefficients`、`solve-bipartite-matching`

**指摘 1（S）**

二部マッチングを実際に増加路やフローで解いていない。大小比較で辺が入れ子になるため、整列した B と閾値列を比較する Hall 型の必要十分条件だけを使う。

**修正:** solve-bipartite-matching を characterize-bipartite-feasibility-by-hall に置換。挿入 DP の P と組合せ係数の S は維持。

**Inventory 根拠:** typicalTechniques「sorted matching condition」の application、採用案の Hall 型 sorted 条件。


<a id="finding-abc327-g"></a>
### [abc327-g](../../src/content/technique-inventory/shard-05/abc327-g.json)

P: `count-labeled-structures-by-components` / C: — / S: `color-and-classify-bipartite-components`、`compute-in-modular-arithmetic`、`correct-overlap-by-inversion`、`formulate-combinatorial-coefficients`

**指摘 1（S）**

必要なのは「連結二部グラフの proper 2-coloring はちょうど二通り」という計数上の重複度である。現 Outcome は実グラフを二色に塗り、矛盾・部サイズを成分ごとに集約する技能で、採用解法ではその処理を行わない。

**修正:** color-and-classify-bipartite-components を、連結成分ごとの彩色対称性と重複度を扱う Outcome に置換する。二部性の知識そのものを不要として削除してはならない。連結構造計数の P は維持。

**Inventory 根拠:** keyInsights の colored connected 数 h と uncolored 数 h/2、typicalTechniques「proper coloringの重複補正」。


<a id="finding-abc330-g"></a>
### [abc330-g](../../src/content/technique-inventory/shard-03/abc330-g.json)

P: `reorder-counting-contributions` / C: — / S: `linearize-static-range-information`

**指摘 1（S）**

二次 moment の分母 4,72,q,q−1 を法上で処理する。特に q=0,1 では同じ式の逆元を取れないため分岐が必要である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の q=0,1 と modular inverse。


<a id="finding-abc331-g"></a>
### [abc331-g](../../src/content/technique-inventory/shard-02/abc331-g.json)

P: `correct-overlap-by-inversion` / C: `encode-counting-by-generating-function` / S: `compute-convolution-or-correlation`、`divide-search-space-recursively`

**指摘 1（S）**

包除係数へ N/(N−k) を掛ける段階が独立に必要。k=N は分母 0 であり、母関数の積が計算できてもそのまま全係数を使えない。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** keyInsights と implementationConcerns の次数 N の除外と mod 除算。


<a id="finding-abc334-g"></a>
### [abc334-g](../../src/content/technique-inventory/shard-01/abc334-g.json)

P: `identify-bridges-and-articulations` / C: — / S: —

**指摘 1（S）**

lowlink が得る削除後成分数の総和を、緑頂点数で法上の平均にする。グラフ構造解析からは出てこない数値表現の技能である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** algorithmConnection の全緑頂点での平均、outcomeCandidates の mod 998244353。


<a id="finding-abc345-g"></a>
### [abc345-g](../../src/content/technique-inventory/shard-04/abc345-g.json)

P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `balance-heavy-light-threshold`、`divide-search-space-recursively`、`formulate-combinatorial-coefficients`

**指摘 1（S）**

確率母関数の各係数へ K の逆元・逆冪 K^(−n) を入れる必要がある。heavy/light や NTT だけではこの正規化を説明しない。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** keyInsights の K^(−n)、implementationConcerns の mod 上の K 逆元。


<a id="finding-abc352-g"></a>
### [abc352-g](../../src/content/technique-inventory/shard-03/abc352-g.json)

P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `divide-search-space-recursively`、`reorder-counting-contributions`

**指摘 1（S）**

多項式係数は色相異なる選び方の個数であって確率ではない。全 S 足から i 足を選ぶ C(S,i) で割る工程が別途必要であり、巨大 S に対し i≤N の範囲だけ組合せ数を逐次計算する。

**修正:** formulate-combinatorial-coefficients を S に追加。生成関数 P、NTT の C、tail-sum に対応する寄与数え上げ S は維持。法上の除算については次の指摘も参照。

**Inventory 根拠:** keyInsights の f_i/C(S,i)、implementationConcerns の巨大 S に対する逐次組合せ数。

**指摘 2（S）**

個数係数 f_i を C(S,i) で割って survival probability にする。多項式積内部の逆元とは別の確率正規化である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** 採用案と keyInsights の f_i/C(S,i)、係数の法上評価。


<a id="finding-abc362-f"></a>
### [abc362-f](../../src/content/technique-inventory/shard-05/abc362-f.json)

P: `reorder-counting-contributions` / C: — / S: `recover-valid-witness`

**指摘 1（S）**

辺寄与の上界を求めるだけでは同時達成できない。各子成分が半分以下になる重心を選ぶことが、半周ずらした pairing が同一成分内に入らない証明に必要である。一般の witness 復元だけでは代替できない。

**修正:** find-weighted-balanced-separator を S に追加（全頂点の重みを 1 とする）。P の辺寄与と既存 witness の S は維持。

**Inventory 根拠:** 採用案の重心、keyInsights の半分以下の block と半周 pairing。


<a id="finding-abc364-f"></a>
### [abc364-f](../../src/content/technique-inventory/shard-04/abc364-f.json)

P: `construct-optimal-spanning-tree` / C: — / S: `maintain-connectivity-components`、`maintain-ordered-set-statistics`

**指摘 1（S）**

大量の暗黙辺を列挙しないためには、未接続境界を削除したら二度と処理しないという全体計算量の証明が必要である。各区間を ordered set で走査できることだけでは、総走査回数が線形になる理由が残らない。

**修正:** bound-monotone-total-work を S に追加。maintain-connectivity-components は維持する。DSU という実装を使わなくても、境界削除が成分併合を表しているため、この Outcome 自体は誤りではない。

**Inventory 根拠:** 採用案の「各境界は全処理を通して一度しか削除されず」、typicalTechniques「削除型ordered set走査」。


<a id="finding-abc369-g"></a>
### [abc369-g](../../src/content/technique-inventory/shard-00/abc369-g.json)

P: `allocate-by-convex-marginal-costs` / C: — / S: `aggregate-rooted-tree`、`merge-small-into-large`

**指摘 1（S）**

各子から最大候補一個だけを返し、その他を global multiset へ一度追加する。大小のコンテナを比較して小さい方を大きい方へ移す操作も、サイズ倍増による計算量証明もない。Inventory の技能名に small-to-large があっても、application の意味は別である。

**修正:** merge-small-into-large を S から除く。convex marginal の P と根付き木集約の S でこの採用方法を表す。

**Inventory 根拠:** 採用案、keyInsights、typicalTechniques「最大要素だけのsmall-to-large圧縮」の実際の application。


<a id="finding-abc402-f"></a>
### [abc402-f](../../src/content/technique-inventory/shard-05/abc402-f.json)

P: `split-enumeration-space` / C: — / S: `prove-and-search-threshold`

**指摘 1（S）**

右半分の剰余を整列し、M−x を境界に lower_bound するだけである。新しい可否判定器の単調性を証明して答えを二分探索する技能ではなく、既知配列の位置検索という baseline である。

**修正:** prove-and-search-threshold を S から除く。meet-in-the-middle の P は維持。

**Inventory 根拠:** algorithmConnection のソート済み半分列への lower_bound、baseline の sorted-boundary-search の範囲。


<a id="finding-abc409-g"></a>
### [abc409-g](../../src/content/technique-inventory/shard-05/abc409-g.json)

P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `formulate-combinatorial-coefficients`、`solve-stochastic-recurrence`

**指摘 1（P / C）**

採用案の計算量を決める変換は、既に得た期待値の二重和の階乗を各列へ分離し、同じ一回の畳み込みの異なる係数から全 k を取り出すこと。組合せ構造を新しく生成関数で定義する段階より、係数積和を高速畳み込みへ帰着する段階が教材上の中心になる。

**修正:** P を compute-convolution-or-correlation、C を encode-counting-by-generating-function に入れ替える。条件付き期待値と組合せ係数の S は維持。法演算 S の欠落は別項。

**Inventory 根拠:** 採用案、keyInsights の F_j=f(j)(N−j−2)! / G_i=(1−p)^i/i! と [x^{N−k}]FG。

**指摘 2（S）**

p と (N−x+1−p)/(N−x) を法上で扱い、各成長係数を計算する。階乗正規化による畳み込みとは別の確率 recurrence の除算である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の p=0,1 と分母 1..N の可逆性。


<a id="finding-abc411-g"></a>
### [abc411-g](../../src/content/technique-inventory/shard-00/abc411-g.json)

P: `enumerate-subset-state-space` / C: — / S: `normalize-equivalent-states`

**指摘 1（S）**

subset DP の閉路数を時計回り・反時計回りの二重計数から戻す際、法上の inv2 を使う。標準形の選択と法上の割算は異なる。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** keyInsights の closing sum への inv2。


<a id="finding-abc413-g"></a>
### [abc413-g](../../src/content/technique-inventory/shard-03/abc413-g.json)

P: `dualize-planar-cut-to-path` / C: — / S: `maintain-connectivity-components`、`model-max-flow-min-cut`

**指摘 1（S）**

Inventory が要求する最大流最小 cut の理論と、現 Outcome の network 構築・残余網による最大流計算は同じ技能ではない。採用アルゴリズムは 0 重み dual edge の連結性だけを DSU で調べる。

**修正:** model-max-flow-min-cut を S から除く。cut の意味と primal/dual 対応は現 P の説明に含める。最大流最小 cut 定理を独立して要求するなら定理用 Outcome に分け、flow solver を既習技能としては要求しない。DSU の S は維持。

**Inventory 根拠:** 採用案の sparse dual DSU、prerequisiteCandidates の「最大流最小cut」と実際の実装工程の違い。


<a id="finding-abc418-e"></a>
### [abc418-e](../../src/content/technique-inventory/shard-03/abc418-e.json)

P: `reorder-counting-contributions` / C: — / S: `reduce-integer-structure-by-gcd`

**指摘 1（S）**

方向を gcd で既約化するのは整数対の標準化であり、gcd 不変量で可解性・周期・範囲を解く技能ではない。必要なのは平行な辺と中点一致によって平行四辺形を数える幾何からの変換である。

**修正:** reduce-integer-structure-by-gcd を reduce-geometry-to-algebraic-predicates に置換。寄与数え上げの P は維持。

**Inventory 根拠:** algorithmConnection と keyInsights の方向・中点による分類、baseline の通常 gcd。


<a id="finding-abc423-g"></a>
### [abc423-g](../../src/content/technique-inventory/shard-03/abc423-g.json)

P: `solve-modular-constraints` / C: — / S: `split-enumeration-space`

**指摘 1（S）**

二つの独立な候補集合を作って照合していない。桁数 split ごとに短い側だけを列挙し、長い側は一次合同式で直接決めている。計算量が平方根規模であることだけでは MITM にならない。

**修正:** split-enumeration-space を enumerate-bounded-candidates-or-cases に置換。P の一次合同式は維持。

**Inventory 根拠:** 採用案と keyInsights の upper/lower の片側列挙、および 10^{min(u,l)} の候補上界。


<a id="finding-abc428-f"></a>
### [abc428-f](../../src/content/technique-inventory/shard-01/abc428-f.json)

P: `bound-monotone-total-work` / C: — / S: `prove-and-search-threshold`

**指摘 1（S）**

償却の対象になるブロック列そのものの表現が欠落している。同じ整列状態を run にまとめ、境界を split し、端の run を削除・追加して全要素更新を避ける技能は、pop 回数の償却証明とは独立である。

**修正:** run による区間分割管理を S として追加する。ただし現 maintain-ordered-interval-partition は「左端順set」を必須としており、deque/連結リストの本解法へそのまま付けるのは不正確。端更新型の Outcome を設けるか、順序付き run 管理と backend の定義を整理する。

**Inventory 根拠:** typicalTechniques「ランレングス状の区間管理」と「ポテンシャル法による償却」の別々の application。


<a id="finding-abc428-g"></a>
### [abc428-g](../../src/content/technique-inventory/shard-02/abc428-g.json)

P: `count-orbits-by-fixed-points` / C: — / S: `decompose-by-prime-or-divisor`、`design-resource-dp`

**指摘 1（S）**

Burnside の有理数としての平均を法上の値にするため、長さ L の逆元を用いる。固定点数の組合せ計算とは別の演算条件である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の mod 998244353 上での L 逆元。


<a id="finding-abc433-e"></a>
### [abc433-e](../../src/content/technique-inventory/shard-00/abc433-e.json)

P: `prove-greedy-order` / C: — / S: `enumerate-frontier-best-first`、`linearize-events`

**指摘 1（S）**

解禁済み候補のうち最良の優先度を取り出す必要はなく、任意の未使用マスでよい。値 v を降順に処理する外側の順序と、候補集合内の best-first 選択が混同されている。

**修正:** enumerate-frontier-best-first を S から除く。greedy の P と event/bucket の S は維持。

**Inventory 根拠:** keyInsights の「どこでもよい」「任意の未使用マス」、typicalTechniques「閾値候補のバケット管理」。


<a id="finding-abc439-g"></a>
### [abc439-g](../../src/content/technique-inventory/shard-05/abc439-g.json)

P: `compose-series-and-project-powers` / C: `apply-formal-power-series-operations`、`encode-counting-by-generating-function` / S: `compute-convolution-or-correlation`、`divide-search-space-recursively`

**指摘 1（S）**

確率を M の逆元で正規化し、さらに f_k/f_(k−1) で等比列へ変形する。後者では零分母を分ける必要がある。FPS の分母多項式の逆元とは別の scalar 条件である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** keyInsights の確率比、implementationConcerns の f_(k−1)=0 と M 逆元。


<a id="finding-abc445-e"></a>
### [abc445-e](../../src/content/technique-inventory/shard-00/abc445-e.json)

P: `decompose-by-prime-or-divisor` / C: — / S: —

**指摘 1（S）**

巨大な LCM を法上で保持し、減る素数冪の逆元を掛けて除去する。指数 max の構造だけでは、法の倍数を割ってはいけない条件を説明できない。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** keyInsights と implementationConcerns の除去因子の可逆性。


<a id="finding-abc449-f"></a>
### [abc449-f](../../src/content/technique-inventory/shard-05/abc449-f.json)

P: `linearize-events` / C: — / S: —

**指摘 1（S）**

event の順序を決めるだけでは rectangle union の面積は出ない。重なりと削除がある active 列区間について、その和集合長を動的に維持する工程が必要である。現 S は空で、この独立したデータ構造技能が表れていない。

**修正:** 動的な区間和集合長の維持を S として追加する。Inventory は backend を一意に指定していないので、lazy segment tree と断定して付けない。被覆回数と被覆長を持つ木、または本問題の区間構造を使う順序集合など、採用表現に対応する Outcome が必要。

**Inventory 根拠:** 採用案の「active 列 interval の union 長を保つ」、algorithmConnection の O(N log N) 面積集計。


<a id="finding-abc450-g"></a>
### [abc450-g](../../src/content/technique-inventory/shard-03/abc450-g.json)

P: `solve-stochastic-recurrence` / C: — / S: `normalize-equivalent-states`

**指摘 1（S）**

N−1 と組の個数で割る相関 recurrence を法上で計算する。N=1 では逆元を使わない別処理が必要である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の binom(N,2) と modular fraction。


<a id="finding-abc455-f"></a>
### [abc455-f](../../src/content/technique-inventory/shard-03/abc455-f.json)

P: `design-range-update-action` / C: — / S: `reorder-counting-contributions`

**指摘 1（S）**

区間和 S と二乗和 Q の更新後、(S²−Q)/2 を法上で復元する。range add 作用の導出と、逆元による除算は別工程である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の 2 の inverse。


<a id="finding-abc462-g"></a>
### [abc462-g](../../src/content/technique-inventory/shard-00/abc462-g.json)

P: `correct-overlap-by-inversion` / C: — / S: `compute-convolution-or-correlation`、`encode-counting-by-generating-function`

**指摘 1（S）**

包除と多項式積から得た有効順列数を、最後に N! で割って確率へ正規化する。因子の係数を作る逆階乗計算とは独立の最終工程である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の N! で割る確率正規化。


<a id="finding-abc463-f"></a>
### [abc463-f](../../src/content/technique-inventory/shard-04/abc463-f.json)

P: `normalize-equivalent-states` / C: — / S: `formulate-combinatorial-coefficients`

**指摘 1（S）**

候補人数 w で割って各選手の勝率を得る。binomial 分布を数える段階に加えて、2 の逆元・w の逆元の適用範囲が必要である。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** implementationConcerns の mod 確率の 2 逆元・w 逆元。


<a id="finding-abc463-g"></a>
### [abc463-g](../../src/content/technique-inventory/shard-01/abc463-g.json)

P: `formulate-combinatorial-coefficients` / C: — / S: `schedule-range-query-updates`

**指摘 1（S）**

binomial の prefix moment を random walk の期待値へ変換する分母 2^N が必要で、N を戻す Mo 更新にも 2 による除算が現れる。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** keyInsights と algorithmConnection の /2^N と四方向更新。


<a id="finding-abc464-f"></a>
### [abc464-f](../../src/content/technique-inventory/shard-00/abc464-f.json)

P: `split-enumeration-space` / C: — / S: `reorder-counting-contributions`

**指摘 1（S）**

到達 subset の確率 1/C(N,s) と次金庫の平均 1/(N−s) を法上で扱う。s=N は分母 0 なので除外する。

**修正:** compute-in-modular-arithmetic を S に追加。通常の法上の加減乗算だけを理由にした追加ではなく、この問題で別途必要な除算・逆冪・可逆性条件に対応させる。

**Inventory 根拠:** 採用案と implementationConcerns の mod binomial inverse と s=N 除外。

**指摘 2（S）**

特定の size-s subset が一様順列の prefix 集合になる確率 1/C(N,s) を導くには、順列の順序と集合の組合せ数を区別して全事象数を数える必要がある。MITM の count/sum query と指示変数の総和だけでは、この確率式が残る。

**修正:** formulate-combinatorial-coefficients を S に追加。MITM の P と寄与数え上げの S は維持。

**Inventory 根拠:** 採用案の 1/C(N,|S|)、typicalTechniques「random permutationのprefix集合化」。

## 必須修正と区別した所見

次の点も確認した。採用していない代替解法への置換、Outcome 名の字面だけの削除、専用技能に内包された操作の二重追加を避けるために記録する。

- **[abc243-ex](../../src/content/technique-inventory/shard-01/abc243-ex.json):** 分類を即座に誤りとはしないが、最短路へ落とす前の「平面 separator と基準曲線の奇数回交差」の証明は幾何の局所 predicate より深い。交差 parity による分離を専用 Outcome に分ける余地がある。現分類を維持するなら、このトポロジーの意味を supporting の説明に明記したい。
- **[abc264-f](../../src/content/technique-inventory/shard-02/abc264-f.json):** 行・列の反転 bit を現在位置とともに持つ定数サイズの未来同値状態。幅に指数依存する境界 profile DP を追加する必要はない。
- **[abc268-ex](../../src/content/technique-inventory/shard-01/abc268-ex.json):** 区間刺突の greedy も必要だが現 S にある。多数 pattern の出現区間を扱えるようにする suffix-array 側が home を占める配置は妥当。
- **[abc284-g](../../src/content/technique-inventory/shard-02/abc284-g.json):** implementation/prerequisite に法上の高速累乗があるため modular arithmetic の S は維持。逆元を使わないという一点からは削除しない。
- **[abc311-e](../../src/content/technique-inventory/shard-00/abc311-e.json):** 最大正方形サイズで全サイズの個数を代表する状態の発見と、局所三方向からの grid recurrence がある。P の grid DP と C の最小十分状態は許容。より簡潔な設計なら C を same_tag 相当へ統合する余地はあるが、数学的な誤分類とは断定しない。
- **[abc314-g](../../src/content/technique-inventory/shard-03/abc314-g.json):** Inventory の application に L_i(K) の答えへの反映を two pointers で進める工程があるため、monotone-window の S は維持。単に二分探索で置き換えられることは削除理由にならない。
- **[abc315-f](../../src/content/technique-inventory/shard-01/abc315-f.json):** skip 数の上界は DP 状態軸そのものの設計であり、独立した generic bounded enumeration を追加する必要はない。
- **[abc324-f](../../src/content/technique-inventory/shard-00/abc324-f.json):** 分数目的の判定化が P、実際の境界探索が S という分解は許容。両方に単調性が出るだけでは重複と断定しない。
- **[abc376-g](../../src/content/technique-inventory/shard-02/abc376-g.json):** 最後の S による除算は Inventory にあるが、確認した採用説明は広い整数型と除算までで、法逆元の採用を明示していない。確率問題という語だけから modular arithmetic を追加しない。
- **[abc384-f](../../src/content/technique-inventory/shard-04/abc384-f.json):** 2-adic valuation の層別計数は prime/divisor decomposition の指数構造に含まれる。素数が 2 一つというだけでは誤分類にならない。
- **[abc386-f](../../src/content/technique-inventory/shard-01/abc386-f.json):** edit-distance の Outcome 自体に対角帯 |i−j|≤K が含まれる。minimal-state の S は値の上限切捨てを別に説明する配置として許容するが、説明上は P と一体化してもよい。
- **[abc386-g](../../src/content/technique-inventory/shard-02/abc386-g.json):** MST 重みを閾値成分数の和に変える部分を独立に説明する価値がある。ただし現 derive-mst-weight-from-threshold-components は動的な辺追加まで一体の Outcome なので、そのまま S へ足すと過剰。静的な層別和への分割を検討できる。現 P/C の成分計数と寄与分解は意味的に通る。
- **[abc391-g](../../src/content/technique-inventory/shard-01/abc391-g.json):** LCS row の差分 mask は未来同値状態であり現 P は正しい。より具体的な build-finite-string-automaton が「圧縮 DP row」を明記しているので、こちらを home にする改善を推奨。現 P が別アルゴリズムを要求するわけではないため、必須修正件数には含めない。
- **[abc392-g](../../src/content/technique-inventory/shard-01/abc392-g.json):** 0/1 係数の自己畳み込みで中心 2B を読む。home は convolution が正しい。生成関数 C はペア選択を係数に符号化する観点として許容するが、convolution の説明と分離できない教材なら統合してよい。組合せ S は向きと対角項の補正に対応する。
- **[abc414-e](../../src/content/technique-inventory/shard-03/abc414-e.json):** /2 があっても整数として先に除算する実装が採用可能と明記されている。mod inverse が必須とはしない。
- **[abc429-f](../../src/content/technique-inventory/shard-04/abc429-f.json):** 半環行列 Outcome は「累乗」だけでなく区間積も定義に含む。区間の min-plus 積なので現 S は妥当。
- **[abc432-g](../../src/content/technique-inventory/shard-04/abc432-g.json):** 階乗を係数へ分離して二重和を一回の NTT にするため convolution が home で正しい。GF の C は符号化と演算の分解として許容する。abc409-g の home 選び直しもこの意味的基準による。
- **[abc449-g](../../src/content/technique-inventory/shard-01/abc449-g.json):** Inventory は採用案として FPS を明示している。微分 recurrence など別ルートが存在することを理由に、FPS の C を削除してはいけない。
- **[abc456-f](../../src/content/technique-inventory/shard-02/abc456-f.json):** SWAG が保持する min-plus 行列の区間積は半環 Outcome の定義内。累乗を行わないという字面だけで削除しない。
- **[abc456-g](../../src/content/technique-inventory/shard-04/abc456-g.json):** implementationConcerns に零因子数と逆元での積更新がある。全ての k を外側で走査することと、その内側の動的積は両立するため dynamic modular product の S は維持。
- **[abc464-g](../../src/content/technique-inventory/shard-04/abc464-g.json):** heap と linked list は専用の path matching Outcome の操作自体に含まれる。独立した汎用 heap 技能をさらに S として重ねる必要はない。

## 全868問の個別判定

全問題について現 P/C/S と Inventory の解法概要を併記する。概要欄は algorithmConnection の転記であり、判定欄はその意味を読んだ結果である。「維持」は採用解法に照らして現配置を許容するという結論。「変更」は上の詳細指摘を参照。C がない場合も「なし」と明示する。

### ABC212

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc212-e](../../src/content/technique-inventory/shard-04/abc212-e.json) | 維持 | なし | 維持 | P: `subtract-exception-transitions` / C: — / S: — | 日ごとの街別到達数を DP とし、全成分和を基準値にして禁止辺の両端からの寄与を差し引くことで、完全グラフの補グラフ上の遷移を疎な更新へ変換する。 |
| [abc212-f](../../src/content/technique-inventory/shard-00/abc212-f.json) | 維持 | なし | 維持 | P: `jump-deterministic-transition` / C: — / S: — | 街別にソートした出発時刻列で後継バスを構成し、後継写像へ二進法的なジャンプ表を重ねて、時刻上限付きの経路追跡クエリへ変換する。 |
| [abc212-g](../../src/content/technique-inventory/shard-01/abc212-g.json) | 維持 | なし | 維持 | P: `count-through-cyclic-exponents` / C: — / S: `decompose-by-prime-or-divisor`、`invert-divisor-lattice-by-mobius`、`reduce-integer-structure-by-gcd` | m の約数を降順に処理し、f(g)=m/g−Σ_{h:g\|h,h>g}f(h) により gcd(m,a)=g となる a の個数を求める。最後に (0,0) の寄与を含む 1+Σ_g f(g)(m/g) を mod 998244353 で計算する。 |
| [abc212-h](../../src/content/technique-inventory/shard-04/abc212-h.json) · [指摘](#finding-abc212-h) | 維持 | なし | **変更** | P: `factor-separable-linear-transform` / C: — / S: `classify-game-states` | Nim の敗北条件を XOR 畳み込みの添字 0 の係数へ翻訳し、XOR 変換領域で可変長列の冪和をまとめて評価してから逆変換する。 |

### ABC213

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc213-e](../../src/content/technique-inventory/shard-00/abc213-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | 不可逆な盤面変更を位置間の 0・1 重み付き遷移へ置換し、距離更新が 0 の頂点を deque の前、1 の頂点を後ろへ入れる最短路探索を行う。 |
| [abc213-f](../../src/content/technique-inventory/shard-01/abc213-f.json) | 維持 | なし | 維持 | P: `build-suffix-lcp-index` / C: — / S: `prune-dominated-candidates-once` | 接尾辞対の LCP を接尾辞配列上の区間最小値へ写し、LCP 配列を正順・逆順に単調スタックで走査して左右の全区間最小値和を合成する。 |
| [abc213-g](../../src/content/technique-inventory/shard-00/abc213-g.json) | 維持 | なし | 維持 | P: `count-labeled-structures-by-components` / C: — / S: `enumerate-subset-state-space` | 各頂点集合の内部辺数から全部分グラフ数を作り、基準頂点の連結成分による再帰で連結数を求めた後、1 と k を含む成分 S と外側の自由な辺選択を合成する。 |
| [abc213-h](../../src/content/technique-inventory/shard-01/abc213-h.json) | 維持 | なし | 維持 | P: `compute-online-relaxed-convolution` / C: — / S: `divide-search-space-recursively` | 時間 DAG 上の自己参照型畳み込み DP を CDQ 型の分割統治で因果順に確定し、各区間間の道路遷移を NTT による多項式積として高速化する。 |

### ABC214

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc214-e](../../src/content/technique-inventory/shard-00/abc214-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `enumerate-frontier-best-first`、`linearize-events` | 区間の左端を解禁時刻、右端を締切とみなし、疎な整数軸をイベント間で飛ばしながら最早締切優先で単位ジョブを配置する。 |
| [abc214-f](../../src/content/technique-inventory/shard-02/abc214-f.json) | 維持 | なし | 維持 | P: `design-order-preserving-dp` / C: — / S: `factor-and-accelerate-transitions` | 末尾位置で分類した distinct-subsequence DP を作り、同じ文字の直前位置を左端、隣接を避けた位置を右端とする区間和を累積和で評価する。 |
| [abc214-g](../../src/content/technique-inventory/shard-00/abc214-g.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `encode-counting-by-generating-function`、`formulate-combinatorial-coefficients` | 包除の交差項を次数 2 以下のグラフ上の端点単射数へ変換し、元の各パス・サイクル成分から選ぶ辺数別多項式を作って全体 DP と階乗係数へ合成する。 |
| [abc214-h](../../src/content/technique-inventory/shard-05/abc214-h.json) | 維持 | 現順維持 | 維持 | P: `model-min-cost-flow` / C: `condense-and-order-directed-graph` / S: — | SCC 縮約で移動を DAG の経路へ変え、頂点報酬を容量付き node-splitting 辺で共有し、トポロジカル prefix による再重み付け後の最小費用流として K 経路を同時最適化する。 |

### ABC215

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc215-e](../../src/content/technique-inventory/shard-02/abc215-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `enumerate-subset-state-space` | 文字列を左から走査し、各位置の文字 x について current から next へ、選ばない・last=x なら同じブロックを続ける・bit x が未使用なら新ブロックを始める遷移を行う。さらにその位置だけを選ぶ singleton を next[1<<x][x] へ加え、最後に全ての非空状態を合計する。 |
| [abc215-f](../../src/content/technique-inventory/shard-02/abc215-f.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `maintain-monotone-window` | 最大化する距離を閾値判定へ変え、x 座標で解禁される過去点集合を二ポインタで管理し、その y の両極値を使う単調判定を二分探索へ組み込む。 |
| [abc215-g](../../src/content/technique-inventory/shard-02/abc215-g.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `compute-in-modular-arithmetic`、`formulate-combinatorial-coefficients` | 色数を指示変数の和へ分解し、余事象の二項係数比を頻度別に集約して、正頻度の疎性を利用しながら全ての K の期待値を求める。 |
| [abc215-h](../../src/content/technique-inventory/shard-01/abc215-h.json) | 維持 | なし | 維持 | P: `characterize-bipartite-feasibility-by-hall` / C: — / S: `apply-subset-zeta-mobius-transform` | 許可マスク別注文数をsubset zeta変換して実際の注文数g(S)を求める。全SのHall条件で実行可能性を判定し、不可能なら(X,Y)=(0,1)。可能ならg(S)>0に限った最小余裕dと集合族F={S:g(S)>0かつf(S)−g(S)=d}を作る。X=d+1とし、C(f(S),X)のMöbius反転で台集合がちょうどSの個体選択数h(S)を求める。Fのsuperset zeta変換が正のSについてh(S)を一度ずつ加える。 |

### ABC216

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc216-e](../../src/content/technique-inventory/shard-00/abc216-e.json) | 維持 | なし | 維持 | P: `allocate-by-convex-marginal-costs` / C: — / S: `evaluate-compressed-integer-blocks`、`prove-and-search-threshold` | 減少する限界利益列の上位 K 項選択を、値域上の順位閾値探索へ変換し、各列の閾値超過部分を算術級数としてまとめて加算する。 |
| [abc216-f](../../src/content/technique-inventory/shard-02/abc216-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: `reorder-counting-contributions` | A 順の最後の選択要素で部分集合を分割し、走査済み要素の B 和別選択数を 0/1 ナップサック DP として維持して閾値以下を加算する。 |
| [abc216-g](../../src/content/technique-inventory/shard-04/abc216-g.json) | 維持 | なし | 維持 | P: `solve-difference-constraints` / C: — / S: `linearize-static-range-information` | 区間内 1 の下限制約を prefix 0 数の差の上限へ翻訳し、各不等式を有向辺として最短路距離に符号化して、距離差から最小 1 列を復元する。 |
| [abc216-h](../../src/content/technique-inventory/shard-05/abc216-h.json) · [指摘](#finding-abc216-h) | 維持 | なし | **変更** | P: `count-nonintersecting-paths-by-lgv` / C: — / S: `enumerate-subset-state-space`、`formulate-combinatorial-coefficients` | 衝突回避を時間 DAG の頂点非共有パスへ移し、LGV 行列式を終点座標順に展開しながら、選択済み始点マスクと転倒数符号を持つ subset DP で全終点列を合算する。 |

### ABC217

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc217-e](../../src/content/technique-inventory/shard-01/abc217-e.json) | 維持 | なし | 維持 | P: `bound-monotone-total-work` / C: — / S: `enumerate-frontier-best-first` | 操作1では queue へ追加し、操作2では heap が非空ならその最小値、空なら queue の先頭を出力して削除する。操作3では queue が空になるまで要素を heap へ移し、明示的な全体ソートを行わない。 |
| [abc217-f](../../src/content/technique-inventory/shard-05/abc217-f.json) | 維持 | なし | 維持 | P: `design-interval-split-dp` / C: — / S: `formulate-combinatorial-coefficients` | dp[i][j] を生徒 i+1 から i+2j を全て消す方法数とし、左端の相手 i+2k を全て試す。仲良しの場合に dp[i+1][k-1]、dp[i+2k][j-k]、C(j,k) を掛けて加算し、空区間を 1 とする。 |
| [abc217-g](../../src/content/technique-inventory/shard-03/abc217-g.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | dp[i][j]=dp[i-1][j-1]+(j-floor((i-1)/M))dp[i-1][j] を法 998244353 で計算し、i=N の j=1..N を順に出力する。 |
| [abc217-h](../../src/content/technique-inventory/shard-02/abc217-h.json) | 維持 | なし | 維持 | P: `maintain-piecewise-linear-convex-function` / C: — / S: — | f_0 は x=0 だけが有限な凸関数として初期化する。射撃ごとに前時刻との差 ΔT を使って左右 heap の座標 offset を広げ、D_i に応じた hinge を X_i に追加し、最後に保持した最小値を答える。 |

### ABC218

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc218-e](../../src/content/technique-inventory/shard-01/abc218-e.json) | 維持 | なし | 維持 | P: `construct-optimal-spanning-tree` / C: — / S: `maintain-connectivity-components` | 全辺を重み昇順に並べて DSU で処理する。成分が異なれば unite して辺を残し、同じ成分なら C_i>0 の場合だけ答えに C_i を加え、C_i≤0 なら報酬を悪化させないため残す。 |
| [abc218-f](../../src/content/technique-inventory/shard-05/abc218-f.json) | 維持 | 現順維持 | 維持 | P: `localize-change-impact-by-witness` / C: `build-shortest-path-certificate` / S: `model-and-compute-shortest-path` | まず BFS し、頂点 N が到達不能なら全 M 個を -1 とする。到達可能なら元距離 d を全辺の初期答えにし、predecessor edge から P を復元する。P 上の各 edge id だけを一つずつ無効化して BFS し、その距離を対応する答えへ上書きする。 |
| [abc218-g](../../src/content/technique-inventory/shard-04/abc218-g.json) | 維持 | なし | 維持 | P: `rollback-reversible-updates` / C: — / S: `evaluate-adversarial-game-value`、`maintain-ordered-set-statistics` | 値を座標圧縮した Fenwick Tree の k-th 探索、または大小二つの multiset で path 中央値を管理する。葉では奇数個なら中央、偶数個なら中央二値の平均を返し、内部では深さの偶奇で集約する。 |
| [abc218-h](../../src/content/technique-inventory/shard-04/abc218-h.json) | 維持 | なし | 維持 | P: `optimize-path-matching-by-contraction` / C: — / S: `enumerate-frontier-best-first`、`maintain-local-sequence-links`、`normalize-equivalent-states` | R を min(R,N-R) にし、B_1=A_1、B_N=A_{N-1}、内部 B_i=A_{i-1}+A_i を作る。最大 B_i を R 回取り出して答えへ加え、端なら二要素を、内部なら両隣を削除して補正値を置き、隣接 link と heap を更新する。 |

### ABC219

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc219-e](../../src/content/technique-inventory/shard-01/abc219-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: — | 各 mask について村 bit が全て立っているか確認し、選択セルを4近傍探索して選択数と到達数を比較する。さらに盤面を外枠付きに拡張し、外枠から非選択セルだけを探索して未到達の空セルがなければ答えへ加える。 |
| [abc219-f](../../src/content/technique-inventory/shard-05/abc219-f.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: — | 一回分の全 prefix 座標を set で重複除去して V とする。v=0 なら \|V\| を返す。そうでなければ必要なら座標軸を交換して a≠0 とし、各点を (s,t,q) へ正規化して (s,t) ごとに q をソートし、隣接 gap の min と末尾の K を合計する。 |
| [abc219-g](../../src/content/technique-inventory/shard-00/abc219-g.json) | 維持 | なし | 維持 | P: `balance-heavy-light-threshold` / C: — / S: — | 閾値 B を √M 程度に置き、各頂点について隣接 heavy 頂点を前計算する。query x の先頭で x を最新化し、x が light なら全近傍の値・時刻を更新、heavy なら x の看板へ値・時刻を保存する。全 query 後も各頂点を同じ方法で最新化して出力する。 |
| [abc219-h](../../src/content/technique-inventory/shard-04/abc219-h.json) | 維持 | なし | 維持 | P: `design-interval-expansion-dp` / C: — / S: `reorder-counting-contributions` | ろうそくと dummy を座標順に並べる。dp[l][r][side][k] を区間を訪問済みで端にいるときの最大の将来増分とし、次に l-1 または r+1 へ進む距離に k を掛けて引き、新位置を選ぶなら A を足して counter を減らし、選ばない遷移も取る。全区間・k を埋め、dummy 一点の状態で初期 counter を全て試す。 |

### ABC220

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc220-e](../../src/content/technique-inventory/shard-00/abc220-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `compute-in-modular-arithmetic`、`count-implicit-binary-tree-layers` | 2 の冪を法 998244353 で前計算する。各深さ d で H=N-1-d とし、D≤H なら片端が LCA の 2×2^D を加え、内部 split 区間の長さに 2^{D-1} を掛けて加える。その一頂点分へ 2^d を掛け、全深さを合計する。 |
| [abc220-f](../../src/content/technique-inventory/shard-00/abc220-f.json) | 維持 | なし | 維持 | P: `reroot-tree-aggregation` / C: — / S: — | 頂点1を根に DFS し、depth の総和と sub[v] を計算する。ans[1] をその総和で初期化し、親から子へ進むたび ans[child]=ans[parent]+N-2sub[child] を代入して全頂点を出力する。 |
| [abc220-g](../../src/content/technique-inventory/shard-04/abc220-g.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `enumerate-bounded-candidates-or-cases` | 各 i<j について方向差を gcd と符号で primitive 化し、bisector key と二倍中点、重み C_i+C_j を記録する。bisector key で分類し、重み降順に見て中点が異なる二候補の最大和を更新し、存在しなければ -1 を出す。 |
| [abc220-h](../../src/content/technique-inventory/shard-05/abc220-h.json) | 維持 | なし | 維持 | P: `split-enumeration-space` / C: — / S: `factor-separable-linear-transform` | 各 s について、S 内と選択済み S 端点が監視する辺の parity L1[s]、S\s から各 T 頂点へ出る辺数 parity の mask L2[s] を作る。各 t の T 内 parity R[t] から符号配列を作って XOR-WHT し、L2[s] の変換値から L1[s] と打ち消し合う右集合数を加算する。 |

### ABC221

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc221-e](../../src/content/technique-inventory/shard-03/abc221-e.json) | 維持 | なし | 維持 | P: `maintain-weighted-prefix-statistics` / C: — / S: `compress-sparse-keys`、`compute-in-modular-arithmetic`、`reorder-counting-contributions` | 2 の冪と逆冪を法 998244353 で前計算する。j を左から走査し、Fenwick Tree の rank(A_j) 以下を query して 2^{j-1} 倍を答えへ加えた後、同じ rank に 2^{-j} を add する。 |
| [abc221-f](../../src/content/technique-inventory/shard-01/abc221-f.json) | 維持 | なし | 維持 | P: `use-tree-diameter-extrema` / C: — / S: `reorder-counting-contributions` | 任意点から最遠点 X、X から最遠点 Y を求めて直径 path を復元する。D が奇数なら中央辺を越えない DFS で両側の対象深さ個数を数えて積を取る。偶数なら中心の各隣接 branch ごとに対象深さ個数 M_i を数え、∏(M_i+1)-1-ΣM_i を法 998244353 で求める。 |
| [abc221-g](../../src/content/technique-inventory/shard-04/abc221-g.json) | 維持 | なし | 維持 | P: `accelerate-set-operations-with-bitsets` / C: — / S: `recover-valid-witness`、`reduce-geometry-to-algebraic-predicates` | dp の bit s を先頭から選んで和 s が可能かとして、各 D_i で dp\|=dp<<D_i を行う。P,Q の到達を確認し、prefix 履歴または分割統治で各 target の採否列を復元し、二列の bit pair を R/L/U/D に変換して出力する。 |
| [abc221-h](../../src/content/technique-inventory/shard-02/abc221-h.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: `design-grid-table-dp` | 番兵 f[0][0]=1 を置く。x=1..N について各 y の g[x][y] を直前 M 行の f の sliding sum で保ち、y≥x なら f[x][y]=f[x][y-x]+g[x][y-x] を法 998244353 で計算する。求める k ごとの答えは f[k][N] である。 |

### ABC222

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc222-e](../../src/content/technique-inventory/shard-03/abc222-e.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: `reorder-counting-contributions` | 各 A_i から A_{i+1} への木上パスをDFSで復元して C_e を加算し、目標 (S+K)/2 に対して C_e を一度ずつ選ぶ0/1部分和DPを行う。 |
| [abc222-f](../../src/content/technique-inventory/shard-03/abc222-f.json) | 維持 | なし | 維持 | P: `use-tree-diameter-extrema` / C: — / S: — | 補助葉を含む重み付き木で直径端 s',t' を求め、両端から全頂点への距離を計算し、端の親に対する除外だけ補正して二距離の最大を答える。 |
| [abc222-g](../../src/content/technique-inventory/shard-04/abc222-g.json) | 維持 | なし | 維持 | P: `find-period-by-multiplicative-order` / C: — / S: `decompose-by-prime-or-divisor`、`reduce-integer-structure-by-gcd` | 各 K について g=gcd(K,2), M'=9K/g を作る。gcd(10,M')>1 なら -1 とし、そうでなければ試し割りで φ(M') を求め、その正約数を昇順に列挙して powmod(10,d,M')=1 となる最初の d を出力する。 |
| [abc222-h](../../src/content/technique-inventory/shard-01/abc222-h.json) | 維持 | 現順維持 | 維持 | P: `invert-generating-function-equation` / C: `derive-coefficient-recurrence-by-differentiation` / S: `compute-in-modular-arithmetic` | m=2N、u_k=[x^k](1+3x+x^2)^m として u_0=1 から u_k={3(m+1-k)u_(k-1)+(2m+2-k)u_(k-2)}/k を進め、u_(N-1)/N を出力する。 |

### ABC223

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc223-e](../../src/content/technique-inventory/shard-00/abc223-e.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `enumerate-bounded-candidates-or-cases` | A,B,C の6順列と X,Y の二方向を試し、最初の面積に必要な帯を切り取り、残った長方形で残り二面積を縦または横に分割できるか天井除算で調べる。 |
| [abc223-f](../../src/content/technique-inventory/shard-04/abc223-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: — | leaf を '('=(1,0), ')'=(-1,-1)、identity を (0,0) として segment tree を構築する。type 1 は文字を交換して二点更新し、type 2 は [l,r] の積 (s,m) を取得して s=0 かつ m≥0 なら Yes、それ以外は No とする。 |
| [abc223-g](../../src/content/technique-inventory/shard-02/abc223-g.json) | 維持 | なし | 維持 | P: `reroot-tree-aggregation` / C: — / S: — | 有向辺の反対側を処理したときの白黒状態を木DPで求め、親側と子側の寄与をrerootして、各頂点を根にしたとき白で終わる頂点を数える。 |
| [abc223-h](../../src/content/technique-inventory/shard-00/abc223-h.json) | 維持 | なし | 維持 | P: `maintain-xor-linear-basis` / C: — / S: `linearize-events` | 問い合わせをRでまとめ、A_Rを添字付き線形基底へ挿入する。Xを高bitから、添字がL以上のpivotだけで消去し、0まで落とせればYesとする。 |

### ABC224

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc224-e](../../src/content/technique-inventory/shard-04/abc224-e.json) | 維持 | なし | 維持 | P: `compress-dp-sufficient-aggregates` / C: — / S: `linearize-events`、`process-dag-in-topological-order` | N個のマスをa_i降順にsortし、等しい値のbatchごとに dp_i=max(rmax[r_i],cmax[c_i]) を先に求め、その後で両最大値をdp_i+1に更新する。 |
| [abc224-f](../../src/content/technique-inventory/shard-05/abc224-f.json) · [指摘](#finding-abc224-f) | **変更** | なし | **変更** | P: `reorder-counting-contributions` / C: — / S: — | 先頭桁でways=1、last=total=dを初期化し、残りの桁を左から読みながら三つの集約値を同時更新し、最後のtotalを998244353で出力する。 |
| [abc224-g](../../src/content/technique-inventory/shard-01/abc224-g.json) | 維持 | なし | 維持 | P: `optimize-univariate-convex-function` / C: — / S: — | S≤Tなら直接増加するA(T-S)も候補にし、1≤X≤Tへ丸めた sqrt(2BN/A) 前後の整数について f(X) を評価して最小値を出す。S=Tなら0である。 |
| [abc224-h](../../src/content/technique-inventory/shard-05/abc224-h.json) | 維持 | なし | 維持 | P: `model-min-cost-flow` / C: — / S: — | sourceから左iへ容量A_i、左iから右jへ報酬C_ij、右jからsinkへ容量B_jを張り、送流を任意にできる最大費用流、または符号を反転した最小費用流を計算する。 |

### ABC225

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc225-e](../../src/content/technique-inventory/shard-04/abc225-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `reduce-geometry-to-algebraic-predicates` | 浮動小数の角度を使わず端点方向を外積で比較して右端順にsortし、次の左端が直前に選んだ右端以上なら選択する。 |
| [abc225-f](../../src/content/technique-inventory/shard-03/abc225-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `design-order-preserving-dp` | 連結比較でsortした後、i=Nから逆順に不採用と採用の二遷移を辞書順比較し、ちょうどK枚を選ぶdp[0][K]を答える。 |
| [abc225-g](../../src/content/technique-inventory/shard-01/abc225-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: — | 各マスへsourceからA_ij、二つの上側斜め前マスへ各C、前マスが盤外ならsinkへCの辺を張り、ΣA_ij−mincutを答える。 |
| [abc225-h](../../src/content/technique-inventory/shard-04/abc225-h.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `formulate-combinatorial-coefficients` | 固定席からK+1個の区間多項式を作り、次数M-Kまでに切って小さいものから畳み込み、係数[M-K]へ未着席者の並べ方(M-K)!を掛ける。K=0は両端なしの式を直接使う。 |

### ABC226

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc226-e](../../src/content/technique-inventory/shard-00/abc226-e.json) | 維持 | なし | 維持 | P: `peel-graph-core` / C: — / S: `compute-in-modular-arithmetic` | 未訪問頂点からDFSを行って成分のV'と次数和/2のE'を求め、不一致が一つでもあれば0、全て一致するなら2^(連結成分数)を998244353で返す。 |
| [abc226-f](../../src/content/technique-inventory/shard-04/abc226-f.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: `compute-in-modular-arithmetic`、`enumerate-bounded-candidates-or-cases` | 非減少な巡回長を選ぶDFSで総和Nの整数分割を列挙し、各頻度の順列数を階乗・逆元で求め、count×lcm^Kを998244353で加算する。 |
| [abc226-g](../../src/content/technique-inventory/shard-03/abc226-g.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: — | 人数bucketを用い、5→5、4→4,5、3→3,5,4、2→残り体力2以上、1→残り体力1以上の順でmin個ずつ一括消費し、最後に荷物が残らないか確認する。 |
| [abc226-h](../../src/content/technique-inventory/shard-03/abc226-h.json) · [指摘](#finding-abc226-h) | 維持 | なし | **変更** | P: `propagate-probability-distribution` / C: — / S: — | a=0,…,99ごとに各p_i(x)の一次多項式を作り、成功個数DPを多項式として更新する。j≥Kの多項式を合計して[a,a+1]で積分し、全区間の値を法998244353で加える。 |

### ABC227

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc227-e](../../src/content/technique-inventory/shard-02/abc227-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `prove-greedy-order` | dp[k][e][y][c]を、各文字をその個数だけ使ったprefixを費用cで作る異なる方法数とする。次の文字種を選び、その文字の左端未使用出現が現在の残列で何番目かを追加費用として遷移し、c≤Kの最終状態を合計する。 |
| [abc227-f](../../src/content/technique-inventory/shard-05/abc227-f.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: `design-grid-table-dp` | 盤面の各A[p][q]をXとして、dp[k][i][j]を左上から(i,j)まででX以上の値をちょうどk個採用した採用値和の最小値とする。次の値aがXより大きければ採用だけ、小さければ不採用だけ、等しければ両方へ遷移する。始点も同じ規則で初期化し、全Xに対するdp[K][H-1][W-1]の最小を答える。 |
| [abc227-g](../../src/content/technique-inventory/shard-02/abc227-g.json) | 維持 | なし | 維持 | P: `decompose-by-prime-or-divisor` / C: — / S: — | sqrt(N)までを篩って素数を列挙する。各素数について分子区間内の最初の倍数から繰り返し割って指数を加え、K!中の指数を減らす。最後に各要素の残存素因数も加え、全ての指数eについて(e+1)をmod 998244353で掛ける。 |
| [abc227-h](../../src/content/technique-inventory/shard-02/abc227-h.json) | 維持 | 現順維持 | 維持 | P: `model-max-flow-min-cut` / C: `construct-euler-trail-or-circuit` / S: `enumerate-bounded-candidates-or-cases` | 12辺の部分集合から9頂点を結ぶtreeを選び、各tree辺を1回使う分だけ端点の要求次数2A_vを減らす。残余要求を最大流で全て満たせたら辺多重度を復元し、(1,1)からHierholzer法でEuler閉路を構築して各辺をL/R/U/Dへ変換する。 |

### ABC228

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc228-e](../../src/content/technique-inventory/shard-04/abc228-e.json) | 維持 | 現順維持 | 維持 | P: `exploit-modular-periodicity` / C: `compute-in-modular-arithmetic` / S: — | M mod P=0なら0を出力する。そうでなければ二分累乗法で e=K^N mod (P-1) を計算し、続けて M^e mod P を計算する。 |
| [abc228-f](../../src/content/technique-inventory/shard-01/abc228-f.json) | 維持 | なし | 維持 | P: `prune-dominated-candidates-once` / C: — / S: `linearize-static-range-information` | h2,w2をh1,w1以下へ切り詰め、二次元累積和で全ての黒・白長方形和を作る。白長方形和へdequeによる横方向、次に縦方向の窓最大値を適用し、各黒位置について黒和−内部の白最大和を求め、その最大を答える。 |
| [abc228-g](../../src/content/technique-inventory/shard-05/abc228-g.json) | 維持 | 現順維持 | 維持 | P: `determinize-automaton-by-subsets` / C: `run-dp-on-finite-automaton` / S: `enumerate-subset-state-space` | 行を全て含む集合を長さ0の初期状態とする。各長さで非空集合Sと数字d=1..9を列挙し、ラベルdの辺で到達する反対側集合next(S,d)へdp値を加える。行集合と列集合を交互に使い、2N文字後の全ての非空集合の値を合計する。 |
| [abc228-h](../../src/content/technique-inventory/shard-01/abc228-h.json) · [指摘](#finding-abc228-h) | 維持 | なし | **変更** | P: `optimize-by-line-envelope` / C: — / S: `design-interval-split-dp`、`prove-greedy-order` | (A,C)をA順にソートし、D_0=0、R_0=0の直線から始める。rを昇順に走査してx=A_rで直線群の最小値をqueryしD_rを求め、傾き−R_r・切片D_rの直線を単調dequeへ追加する。最後にD_N−ΣA_iC_iを出力する。 |

### ABC229

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc229-e](../../src/content/technique-inventory/shard-02/abc229-e.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `maintain-connectivity-components` | 固定順の頂点削除クエリをオフラインで逆転し、suffix グラフを頂点・辺の追加系列として Union-Find と成分数カウンタで復元する。 |
| [abc229-f](../../src/content/technique-inventory/shard-04/abc229-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | 中心頂点の色を固定し、外周の環を切って二色の系列 DP にし、直前色・先頭色を使って放射辺と隣接辺の同色費用を加算する。 |
| [abc229-g](../../src/content/technique-inventory/shard-04/abc229-g.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `optimize-univariate-convex-function` | Y の位置列を順位補正して単調列 B を作り、長さ m の各窓について中央値までの L1 距離を prefix sum で求める可否判定を答えの二分探索に使う。 |
| [abc229-h](../../src/content/technique-inventory/shard-05/abc229-h.json) | 維持 | なし | 維持 | P: `add-conway-number-games` / C: — / S: — | 列状態を三進数で列挙した有限 partisan game DAG に Conway 型の数値評価を付け、入力各列の評価値を厳密な二進有理数として合計して符号を判定する。 |

### ABC230

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc230-e](../../src/content/technique-inventory/shard-04/abc230-e.json) | 維持 | なし | 維持 | P: `partition-integer-parameter-ranges` / C: — / S: — | 整数双曲線 xy≤N の格子点数え上げとして、小さい商の頻度集約と小さい除数の直接和を境界 floor(sqrt(N)) で分割する。 |
| [abc230-f](../../src/content/technique-inventory/shard-02/abc230-f.json) | 維持 | なし | 維持 | P: `design-prefix-partition-dp` / C: — / S: — | 連続ブロック和列を左優先の正規形へ写し、prefix 和の最新重複位置で許される切れ目範囲を決め、DP の prefix sum から個数を計算する。 |
| [abc230-g](../../src/content/technique-inventory/shard-04/abc230-g.json) | 維持 | なし | 維持 | P: `invert-divisor-lattice-by-mobius` / C: — / S: `decompose-by-prime-or-divisor` | 二つの非互いに素条件を修正 Möbius 反転で約数対へ展開し、倍数走査と P_i の非零 square-free 約数列挙から num(a,b) の三角数を符号付き加算する。 |
| [abc230-h](../../src/content/technique-inventory/shard-03/abc230-h.json) | 維持 | 現順維持 | 維持 | P: `derive-coefficient-recurrence-by-differentiation` / C: `compute-online-relaxed-convolution` / S: `divide-search-space-recursively` | unlabeled multiset の組合せ構造から暗黙母関数を立て、対数微分で約数和列と自己畳み込みの係数再帰へ落とし、確定済み係数を CDQ 型 FFT で未来へ送る。 |

### ABC231

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc231-e](../../src/content/technique-inventory/shard-05/abc231-e.json) | 維持 | なし | 維持 | P: `design-carry-or-mixed-radix-dp` / C: — / S: — | 整除関係を持つ額面列を混合基数の桁として、各桁で端数をそのまま払う遷移と補数を釣銭にする遷移の最小値をメモ化再帰で求める。 |
| [abc231-f](../../src/content/technique-inventory/shard-05/abc231-f.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `compress-sparse-keys`、`maintain-weighted-prefix-statistics` | 喧嘩しない条件を二次元 dominance counting として、A の昇順 sweep と圧縮 B 上の suffix 頻度和を組み合わせ、同一点群を一括処理する。 |
| [abc231-g](../../src/content/technique-inventory/shard-04/abc231-g.json) · [指摘](#finding-abc231-g) | 維持 | なし | **変更** | P: `reorder-counting-contributions` / C: — / S: `encode-counting-by-generating-function` | ランダムな選択回数を含む積を多重線形展開し、定数 A の基本対称式と multinomial 分布の相異なる座標に対する階乗モーメントを次数ごとに合成する。 |
| [abc231-h](../../src/content/technique-inventory/shard-05/abc231-h.json) | 維持 | なし | 維持 | P: `model-min-cost-flow` / C: — / S: — | 二部グラフの最小重み辺被覆を頂点別最安値の定数項と任意濃度の差分マッチングへ分解し、費用シフト付き min-cost-flow slope で最適濃度まで選ぶ。 |

### ABC232

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc232-e](../../src/content/technique-inventory/shard-04/abc232-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | 状態を A=終点、B=同じ行だけ、C=同じ列だけ、D=どちらも異なる、とする。次の値は A'=B+C、B'=(W-1)A+(W-2)B+D、C'=(H-1)A+(H-2)C+D、D'=(H-1)B+(W-1)C+(H+W-4)D であり、開始位置の分類を 1 として K 回更新した A を答える。 |
| [abc232-f](../../src/content/technique-inventory/shard-04/abc232-f.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: — | 操作の交換可能性で解を「順列＋位置別補正」へ正規化し、順列の prefix で確定する転倒寄与を使用済みビット集合の遷移コストとして最短 DP を行う。 |
| [abc232-g](../../src/content/technique-inventory/shard-00/abc232-g.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: `compress-sparse-keys` | 加法 mod M の完全グラフ辺を円周距離へ因数分解し、座標圧縮した循環補助グラフ上の通常の非負最短路としてダイクストラ法を適用する。 |
| [abc232-h](../../src/content/technique-inventory/shard-00/abc232-h.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `normalize-equivalent-states` | 長方形 Hamilton path の構成不変条件を「左上開始・任意の別終点」とし、対称変換で終点を境界から外して一列ずつ剥がす再帰構成を行う。 |

### ABC233

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc233-e](../../src/content/technique-inventory/shard-04/abc233-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | 巨大な切り捨て除算和を縦書き加算へ変換し、右端から prefix digit sum と carry を更新する文字列上の筆算アルゴリズムで出力する。 |
| [abc233-ex](../../src/content/technique-inventory/shard-02/abc233-ex.json) | 維持 | なし | 維持 | P: `share-threshold-checks-by-parallel-binary-search` / C: — / S: `linearize-events`、`linearize-static-range-information`、`maintain-weighted-prefix-statistics`、`reduce-geometry-to-algebraic-predicates` | K 番目距離を単調な個数判定へ変え、回転座標の矩形問合せを二つの x-prefix イベントへ分解して、parallel binary search と BIT sweep を重ねる。 |
| [abc233-f](../../src/content/technique-inventory/shard-01/abc233-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `maintain-connectivity-components` | Union-Find で feasibility と spanning forest を構成し、各木を葉除去順に処理して、駒の現在位置から目標葉までの木路上の辺 ID を交換列として出力する。 |
| [abc233-g](../../src/content/technique-inventory/shard-05/abc233-g.json) | 維持 | なし | 維持 | P: `design-interval-split-dp` / C: — / S: `linearize-static-range-information` | 部分長方形を一辺長コストで一括消去する上界と、水平・垂直 cut で独立問題へ分ける遷移を持つ四次元区間 DP を小領域から計算する。 |

### ABC234

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc234-e](../../src/content/technique-inventory/shard-05/abc234-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: — | 等差 digit sequence の三パラメータ表現を使って全候補を生成・検証し、下限 X を満たす最小値を単純比較する。 |
| [abc234-ex](../../src/content/technique-inventory/shard-01/abc234-ex.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `enumerate-bounded-candidates-or-cases` | 距離閾値をセル幅にした spatial hashing で局所候補だけを列挙し、セル密度が真の出力数へ下界を与えることから output-sensitive な全探索を正当化する。 |
| [abc234-f](../../src/content/technique-inventory/shard-02/abc234-f.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: `compute-in-modular-arithmetic` | 部分列選択を文字頻度ベクトルへ商約し、各文字種の同一要素を既存列へ挿入する二項係数遷移で全長の multiset permutation 数を DP する。 |
| [abc234-g](../../src/content/technique-inventory/shard-04/abc234-g.json) | 維持 | なし | 維持 | P: `prune-dominated-candidates-once` / C: — / S: `design-prefix-partition-dp` | 区間分割 DP の遷移を max 部と min 部へ線形分離し、右端追加時の区間極値の変化を重み付き単調スタックでまとめて dp_i を算出する。 |

### ABC235

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc235-e](../../src/content/technique-inventory/shard-05/abc235-e.json) | 維持 | なし | 維持 | P: `sweep-connectivity-by-kruskal-threshold` / C: — / S: `linearize-events`、`maintain-connectivity-components` | Kruskal の選択条件を重み閾値付き連結性クエリへ切り出し、独立クエリを元辺だけが更新するオフライン Union-Find sweep に並列化する。 |
| [abc235-ex](../../src/content/technique-inventory/shard-04/abc235-ex.json) | 維持 | 現順維持 | 維持 | P: `build-component-merge-tree` / C: `encode-counting-by-generating-function` / S: `compute-convolution-or-correlation` | Kruskal の重み別成分併合を reconstruction forest として、葉の 1＋X から親で ∏dp_child−X^m＋X を計算し、最後に森の根多項式を掛けて K 次まで合計する。 |
| [abc235-f](../../src/content/technique-inventory/shard-03/abc235-f.json) | 維持 | なし | 維持 | P: `count-prefix-constrained-objects` / C: — / S: — | 巨大上限の十進 prefix automaton 上で、tight・started・digit mask ごとの個数と数値和を伝播し、必要 mask を包含する終了状態の和を集計する。 |
| [abc235-g](../../src/content/technique-inventory/shard-01/abc235-g.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `compute-in-modular-arithmetic`、`formulate-combinatorial-coefficients`、`slide-transition-recurrence` | 全庭非空を空庭事象の inclusion-exclusion へ変え、各項 C(N,i)F_A(i)F_B(i)F_C(i) を、三つの打切り二項和の同時一次更新で走査する。 |

### ABC236

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc236-e](../../src/content/technique-inventory/shard-01/abc236-e.json) | 維持 | なし | 維持 | P: `optimize-ratio-by-parametric-search` / C: — / S: `design-minimal-sufficient-state` | 比率・順序統計量の最大化を parametric search で加重選択問題へ移し、直前カードを選んだかだけの DP で各閾値の feasibility oracle を作る。 |
| [abc236-ex](../../src/content/technique-inventory/shard-03/abc236-ex.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `count-labeled-structures-by-components` | 非衝突条件の edge inclusion-exclusion を set partition の重み積へ変換し、固定頂点を含む一成分 T' を選ぶ再帰 dp[T]=Σg(T')h(\|T'\|)dp[T\T'] で計算する。 |
| [abc236-f](../../src/content/technique-inventory/shard-04/abc236-f.json) | 維持 | なし | 維持 | P: `optimize-weighted-matroid-basis` / C: — / S: `maintain-xor-linear-basis` | 辛さの XOR 合成を二元体上の線形代数へ翻訳し、価格順 Kruskal 型 greedy と XOR Gaussian elimination で最小費用基底を選ぶ。 |
| [abc236-g](../../src/content/technique-inventory/shard-03/abc236-g.json) | 維持 | なし | 維持 | P: `exponentiate-transition-over-semiring` / C: — / S: — | 時刻付き有向グラフの exact-length bottleneck path DP を (min,max) semiring の行列積へ写し、隣接行列の L 乗を繰り返し二乗法で初期ベクトルへ作用させる。 |

### ABC237

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc237-e](../../src/content/technique-inventory/shard-04/abc237-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | 負辺を含む経路評価に頂点ポテンシャル H_i を加えて非負の reduced cost へ変換し、単一始点最短路として解く。 |
| [abc237-ex](../../src/content/technique-inventory/shard-03/abc237-ex.json) | 維持 | なし | 維持 | P: `optimize-poset-antichain-by-dilworth` / C: — / S: `solve-bipartite-matching` | 文字列包含を半順序として明示し、最大 antichain → minimum chain cover → bipartite matching という Dilworth の定理の標準変換を適用する。 |
| [abc237-f](../../src/content/technique-inventory/shard-01/abc237-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `design-lis-frontier` | 通常は一列の LIS を求める patience sorting の tails 配列を、小さい値域上の有限状態へ変えて列の個数を数える DP にする。 |
| [abc237-g](../../src/content/technique-inventory/shard-01/abc237-g.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: — | 順列の値を order-preserving な閾値写像で二値化し、range sort を range count と range assign の遅延セグメント木操作へ落とす。 |

### ABC238

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc238-e](../../src/content/technique-inventory/shard-02/abc238-e.json) | 維持 | なし | 維持 | P: `maintain-connectivity-components` / C: — / S: `linearize-static-range-information` | 区間和制約を prefix potential 間の差分制約へ変換し、目的の二ポテンシャルが同じ連結成分かを Union-Find またはグラフ探索で調べる。 |
| [abc238-ex](../../src/content/technique-inventory/shard-04/abc238-ex.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `compute-in-modular-arithmetic`、`design-interval-split-dp`、`formulate-combinatorial-coefficients`、`reorder-counting-contributions` | 円環上の逐次削除を reverse process の挿入木へ変え、最初の挿入を根とする interval decomposition と count/sum の二量 DP で全履歴を集計する。 |
| [abc238-f](../../src/content/technique-inventory/shard-04/abc238-f.json) | 維持 | なし | 維持 | P: `design-order-preserving-dp` / C: — / S: — | 二次元支配順序の下向き閉包を数える問題を、一方の座標で sweep し、未選択集合が課す他方座標の最小境界だけを持つ DP にする。 |
| [abc238-g](../../src/content/technique-inventory/shard-00/abc238-g.json) | 維持 | なし | 維持 | P: `compare-algebraic-objects-by-random-fingerprint` / C: — / S: `decompose-by-prime-or-divisor` | 各素数pについて全prefixを通じた出現位相を管理し、出現ごとにa_p,b_p,a_p XOR b_pを周期的にXORする。累積指数の剰余0,1,2はそれぞれ0,a_p,a_p XOR b_pに符号化され、区間積の完全三乗性は両端prefixの状態の等値判定になる。これは状態のランダム符号化であり、Z/3ZからXOR群への準同型ではない。異なる固定prefix状態の差にはa_p,b_pの少なくとも一方が奇数回現れる素数pがあり、他の乱数を固定すると一様な64 bit値が残るので衝突確率は2^(-64)。乱数と独立なQ個のquery全体ではunion boundでQ/2^64以下となる。 |

### ABC239

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc239-e](../../src/content/technique-inventory/shard-02/abc239-e.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | 根1から親子関係と postorder を作る。各 v の候補を [X_v] で始め、各 child の上位20配列を追加して降順に並べ、先頭20個だけを P_v として残し、query (V,K) へ P_V[K-1] を返す。 |
| [abc239-ex](../../src/content/technique-inventory/shard-02/abc239-ex.json) | 維持 | なし | 維持 | P: `partition-integer-parameter-ranges` / C: — / S: `compute-in-modular-arithmetic`、`solve-stochastic-recurrence` | f(0)=0 とし、未計算の x では i=2 から min(N,x) までを quotient block [l,r] に分け、(r-l+1)f(floor(x/l)) を加える。N とこの和を足して N-1 の法逆元を掛け、map に memoize して f(M) を返す。 |
| [abc239-f](../../src/content/technique-inventory/shard-01/abc239-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `maintain-connectivity-components` | DSU で既存辺の cycle と各 current degree を検査し、各成分に頂点 i を D_i-currentDegree_i 回並べた stub list を持つ。不足1 queue と不足2以上 queue から成分を取り、各 list の末尾同士を新辺として出して併合・再分類し、最後の二つの不足1成分を結ぶ。 |
| [abc239-g](../../src/content/technique-inventory/shard-04/abc239-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: — | 2N 頂点の有向 network を作り、中間頂点の in→out に c_v、元辺に対応する両方向 out→in に INF を置く。1_out を source、N_in を sink として max-flow を流し、flow 値と residual reachability で壁頂点列を出力する。 |

### ABC240

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc240-e](../../src/content/technique-inventory/shard-04/abc240-e.json) | 維持 | なし | 維持 | P: `flatten-tree-by-euler-order` / C: — / S: `recover-valid-witness` | 根1から DFS し、子を持たない頂点に counter の現在値を L=R として割り当てて増やす。内部頂点では全 child の L の最小と R の最大を取り、全頂点の区間を出力する。 |
| [abc240-ex](../../src/content/technique-inventory/shard-03/abc240-ex.json) | 維持 | なし | 維持 | P: `aggregate-subsequence-transitions-by-value` / C: — / S: `design-associative-range-summary`、`enumerate-bounded-candidates-or-cases`、`index-shared-prefixes-with-trie`、`linearize-events`、`prove-greedy-order` | B を求め、各開始位置から長さ B までの substring を trie node と (l,r) に対応させる。trie DFS 順で lex rank を付け、候補を (rank,-l) 順に処理し、best=max dp[0..l-1]+1 を r へ chmax する segment tree を更新して全体最大を返す。 |
| [abc240-f](../../src/content/technique-inventory/shard-05/abc240-f.json) | 維持 | なし | 維持 | P: `evaluate-compressed-integer-blocks` / C: — / S: `optimize-univariate-convex-function` | 各 (x,y) で f(n)=A+B n+x n(n+1)/2 を定義し、n=1,y と、x<0 なら -B/x 付近を [1,y] に clamp した候補を評価して全体最大を更新する。その後 A←f(y)、B←B+xy として次 block へ進む。 |
| [abc240-g](../../src/content/technique-inventory/shard-04/abc240-g.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: `reduce-geometry-to-algebraic-predicates` | 階乗と逆階乗を N まで前計算し、到達不能なら0を返す一次元関数 f1(n,x)=C(n,(n+\|x\|)/2) を用意する。k=0..N について C(N,k)f1(k,Z)f1(N-k,X+Y)f1(N-k,X-Y) を加算する。 |

### ABC241

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc241-e](../../src/content/technique-inventory/shard-05/abc241-e.json) | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: — | state=0、prefix[0]=0 から、未訪問 state に step を記録し A_state を加えて次 residue へ進む。K 回前に repeat したら cycleStart s、length p、gain を求め、K-s を商と余りに分けて prefix[s]+商·gain+cycle prefix の余りを返す。 |
| [abc241-ex](../../src/content/technique-inventory/shard-02/abc241-ex.json) | 維持 | なし | 維持 | P: `encode-counting-by-generating-function` / C: — / S: `compute-in-modular-arithmetic` | 全 i の c_i を法998244353で求める。全 subset U について degree d と numerator coefficient を更新し、d≤M なら coefficient·Σ_i c_i A_i^{M-d} を答えへ加える。冪は二分累乗で計算する。 |
| [abc241-f](../../src/content/technique-inventory/shard-02/abc241-f.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | 障害物を row→sorted columns と column→sorted rows に格納する。start から BFS し、上下左右それぞれ nearest obstacle を lower_bound で探し、その直前マスが別状態なら距離+1で enqueue する。goal の距離が得られなければ -1 とする。 |
| [abc241-g](../../src/content/technique-inventory/shard-05/abc241-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: — | 各 p について未終了の p 戦を p 勝利に固定して win を数える。source→全試合 node に容量1、試合→許される winner、player p→sink に win、他 player→sink に win-1 を置き、全試合数だけ flow が流れれば p を出力する。 |

### ABC242

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc242-e](../../src/content/technique-inventory/shard-03/abc242-e.json) | 維持 | なし | 維持 | P: `count-symmetric-strings-under-lex-bound` / C: — / S: — | h 文字を左から読み ans=26·ans+(S_i-'A') と更新する。S の前半を左右へ鏡映して palindrome P を作り、P≤S なら ans に1を足して法998244353で出力する。 |
| [abc242-ex](../../src/content/technique-inventory/shard-04/abc242-ex.json) | 維持 | なし | 維持 | P: `solve-stochastic-recurrence` / C: — / S: `compute-in-modular-arithmetic`、`design-order-preserving-dp`、`formulate-combinatorial-coefficients` | interval を L,R 順に sort し、dp[j][k] を選択 union が [1,j]、選択数 k の subset 数として skip/select 遷移する。f(k)=dp[N][k] を得た後、Σ_{k=0}^{M-1}(1-f(k)/C(M,k))·M/(M-k) を法998244353で計算する。 |
| [abc242-f](../../src/content/technique-inventory/shard-01/abc242-f.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `formulate-combinatorial-coefficients` | x=B,W について全 n≤N,m≤M の f を計算する。黒の使用行 i・列 k、白の使用行 j・列 l を正の範囲で選び、C(N,i)C(N-i,j)C(M,k)C(M-k,l)f(i,k,B)f(j,l,W) を全て加算する。 |
| [abc242-g](../../src/content/technique-inventory/shard-05/abc242-g.json) | 維持 | なし | 維持 | P: `schedule-range-query-updates` / C: — / S: — | query を左端 block と右端で Mo 順に sort する。現在 [L,R] を伸縮し、add(x) は count[A_x] が奇数なら ans++、remove(x) は削除前 count[A_x] が偶数なら ans-- として頻度を更新し、元 query index へ ans を保存する。 |

### ABC243

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc243-e](../../src/content/technique-inventory/shard-02/abc243-e.json) | 維持 | なし | 維持 | P: `compute-all-pairs-distance` / C: — / S: `localize-change-impact-by-witness` | 隣接行列を辺長で初期化して Floyd-Warshall を行う。各 (a,b,c) で dist[a][b]<c なら削除可能、そうでなくても a,b 以外の k に dist[a][k]+dist[k][b]≤c があれば削除可能として数える。 |
| [abc243-ex](../../src/content/technique-inventory/shard-01/abc243-ex.json) · 所見あり | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: `reduce-geometry-to-algebraic-predicates` | S から G への単純 path を一つ固定し、赤 path とその片側の青領域の境を跨ぐ8近傍 edge に bit1を付ける。constructible cell と盤外からなる graph を (position,parity) に拡張し、公式の canonical start ごとに odd parity で戻る最短距離と経路数を求め、最小壁数と総数を集約する。 |
| [abc243-f](../../src/content/technique-inventory/shard-01/abc243-f.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: `compute-in-modular-arithmetic` | p_i=W_i/(ΣW) を法上で求め、dp[usedKinds][draws] を初期 dp[0][0]=1 とする。賞 i ごとに c=0..K-draws を試し、c=0なら種類数据え置き、c>0なら+1し、p_i^c/c! を掛ける。最後に dp[M][K]·K! を出力する。 |
| [abc243-g](../../src/content/technique-inventory/shard-00/abc243-g.json) | 維持 | なし | 維持 | P: `compress-dp-sufficient-aggregates` / C: — / S: `partition-integer-parameter-ranges` | 全 query の最大 fourth-root まで dp[1]=1、dp[v]=P0[floor√v] を順に前計算し、P0,P2 を更新する。各 X は整数平方根 s と r を厳密に求め、(s+1)P0[r]-P2[r] を64 bitで出力する。 |

### ABC244

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc244-e](../../src/content/technique-inventory/shard-01/abc244-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | cur[S][0]=1 から K 回、辺 (u,v) ごとに u→v と v→u を更新し、到着先が X なら parity を1反転する。rolling array で step を進め、cur[T][0] を法998244353で出力する。 |
| [abc244-ex](../../src/content/technique-inventory/shard-00/abc244-ex.json) | 維持 | なし | 維持 | P: `restrict-geometric-candidates-to-boundary` / C: — / S: `decompose-ranges-into-segment-tree-nodes` | 全 Q 点を葉へ置く segment tree を作り、各 node の点を sort して上下 convex hull を構築する。時刻 i では range [1,i] を分解し、各 hull 上で A x+B y の最大頂点を unimodal search して全 node の最大を出力する。 |
| [abc244-f](../../src/content/technique-inventory/shard-01/abc244-f.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | 各 v について dist[1<<v][v]=1 を queue に入れる。状態 (mask,v) から各 neighbor u へ (mask xor (1<<u),u) を距離+1で緩和し、BFS 後に mask=1..2^N-1 の min_v dist と mask0の0を合計する。 |
| [abc244-g](../../src/content/technique-inventory/shard-04/abc244-g.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: — | 全0 target なら空 path を出してよい。それ以外は spanning tree を作り、各 v で v を置いて子の列を再帰連結し、子 parity が target と違えば v,c を追加して v へ戻る。root 列完成後に必要なら u,root,u を追加し、長さと列を出力する。 |

### ABC245

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc245-e](../../src/content/technique-inventory/shard-02/abc245-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `linearize-events`、`maintain-ordered-set-statistics` | 2 次元の支配条件を一方の座標で sweep し、もう一方を ordered multiset の lower_bound で貪欲に照合する。途中で候補がなければ No、全チョコレートを処理できれば Yes とする。 |
| [abc245-ex](../../src/content/technique-inventory/shard-01/abc245-ex.json) | 維持 | なし | 維持 | P: `solve-modular-constraints` / C: — / S: `accelerate-fixed-linear-transition`、`compute-in-modular-arithmetic`、`decompose-by-prime-or-divisor` | M を ∏p^q に分解する。各素数冪について、目標剰余を打ち切り p 進指数で分類した q+1 次元 vector と 1 要素追加の遷移行列を構成し、K 乗を二分累乗で適用する。N mod p^q の指数に対応する成分を取り、全因子分を 998244353 で掛ける。 |
| [abc245-f](../../src/content/technique-inventory/shard-03/abc245-f.json) | 維持 | なし | 維持 | P: `peel-directed-graph-toward-cycles` / C: — / S: — | 逆隣接リストと現在出次数を作り、初期 sink を queue に入れる。頂点 v を削除したら v への各入辺 u→v について outdeg[u] を減らし、0 になった u を追加する。N から削除数を引いた値が答えになる。 |
| [abc245-g](../../src/content/technique-inventory/shard-01/abc245-g.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | 全人気者 (B_i, A_{B_i}) を距離 0 で queue に入れる。Dijkstra 順に取り出し、頂点ごとに未確定の国なら最短 2 国まで記録して隣接辺へ緩和する。最後に各頂点の記録から A_i と異なる国の最小距離を選び、なければ -1 とする。 |

### ABC246

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc246-e](../../src/content/technique-inventory/shard-00/abc246-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | 始点から 4 方向状態へのコストを 1 として開始し、空きマス間の斜め隣接を 01-BFS する。同方向なら +0、方向変更なら +1 とし、終点の 4 状態の最小値を答える。未到達なら -1 とする。 |
| [abc246-ex](../../src/content/technique-inventory/shard-04/abc246-ex.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: `design-order-preserving-dp` | leaf i に A_{s_i} を置く。左区間を先に適用してから右区間を適用するため、親の積を M_right×M_left とする。点更新後、root 行列を (0,0,1)^T に作用させ、先頭 2 成分の和を出力する。 |
| [abc246-f](../../src/content/technique-inventory/shard-00/abc246-f.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `compute-in-modular-arithmetic`、`enumerate-subsets-by-mask` | 各 S_i を 26 bit mask にする。mask=1,…,2^N-1 ごとに選択行の AND と選択数を求め、共通文字数^L を高速累乗する。選択数が奇数なら加算、偶数なら減算し、998244353 で正規化する。 |
| [abc246-g](../../src/content/technique-inventory/shard-04/abc246-g.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `aggregate-rooted-tree` | 候補 X ごとに A_i≥X を黒とし、postorder で dp を計算する。dp[root]>0 を判定の真として、真となる最大 X を値域または A_i の候補列上で二分探索する。 |

### ABC247

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc247-e](../../src/content/technique-inventory/shard-05/abc247-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | lastX,lastY,lastBad を未出現値で初期化する。A_R が X,Y なら対応位置を R に更新し、範囲外なら lastBad=R とする。その後 max(0,min(lastX,lastY)-lastBad) を 64 bit の答えへ加える。 |
| [abc247-ex](../../src/content/technique-inventory/shard-01/abc247-ex.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `divide-search-space-recursively` | 色ごとに出現順 j=0,…,m-1 の一次多項式 (z+j) を用意し、divide-and-conquer/priority merge と NTT で全積を求める。係数 [z^c] のうち N-c≤K かつ parity が一致するものを 998244353 で合計する。 |
| [abc247-f](../../src/content/technique-inventory/shard-01/abc247-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | DSU または traversal で graph の連結成分サイズを集計する。N まで f と cycle 辺被覆数 g を前計算し、各成分の g(size) を 998244353 で乗算する。 |
| [abc247-g](../../src/content/technique-inventory/shard-04/abc247-g.json) | 維持 | なし | 維持 | P: `model-min-cost-flow` / C: — / S: — | S→各大学、各分野→T に容量 1・費用 0、人ごとに大学→分野へ容量 1・費用 BIG-C_i の辺を張る。増加路がなくなるまで 1 flow ずつ min-cost flow を進め、累積費用 cost_i から i×BIG-cost_i を順に出力する。 |

### ABC248

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc248-e](../../src/content/technique-inventory/shard-05/abc248-e.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `enumerate-bounded-candidates-or-cases` | K=1 なら Infinity を出力する。それ以外は i<j の各点対から直線を作り、全点を外積で数えて K 以上なら canonical (A,B,C) を set へ挿入し、set size を答える。 |
| [abc248-ex](../../src/content/technique-inventory/shard-03/abc248-ex.json) | 維持 | なし | 維持 | P: `prune-dominated-candidates-once` / C: — / S: `design-associative-range-summary`、`design-range-update-action` | 未使用 L を INF にした lazy segment tree を用意する。各 R で既存 active 範囲へ -1、新要素による suffix max/min の変化量を monotone stack が示す区間へ加算し、L=R を V=0 で有効化する。root の保持 pair のうち value≤K の count を答えへ足す。 |
| [abc248-f](../../src/content/technique-inventory/shard-04/abc248-f.json) | 維持 | なし | 維持 | P: `design-frontier-profile-dp` / C: — / S: — | 初列は c_0 を残す dp[0][0][0]=1 と、消す dp[0][1][1]=1 で始める。以後 new0[j]=old0[j]+3old0[j-1]+old1[j]、new1[j]=2old0[j-2]+old1[j-1] を P で計算し、最後の dp[N-1][j][0] を j=1,…,N-1 について出力する。 |
| [abc248-g](../../src/content/technique-inventory/shard-05/abc248-g.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: `reduce-integer-structure-by-gcd` | 各頂点を cnt[A_v]=sum[A_v]=1、部分木内答え 0 で初期化する。子の DP を受け取り、全 gcd group 対で cross pair の寄与を答えへ加えた後、子の key y を gcd(A_v,y) に写して cnt と sum+cnt を親 map へ統合する。root の答えを 998244353 で出力する。 |

### ABC249

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc249-e](../../src/content/technique-inventory/shard-03/abc249-e.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: — | dp[i][j]を元文字列長i、RLE後の長さjとなる個数として、各十進桁数dのラン長区間からdpへの寄与を区間和で集約し、j<Nの状態を合計する。 |
| [abc249-ex](../../src/content/technique-inventory/shard-03/abc249-ex.json) · [指摘](#finding-abc249-ex) | 維持 | なし | **変更** | P: `decompose-expectation-by-additive-potential` / C: — / S: `compute-convolution-or-correlation`、`formulate-combinatorial-coefficients`、`solve-stochastic-recurrence` | 各個数jの一手後の分布を組合せ数から求め、g(j)=1/N+ΣP[j][k]g(k)を自己ループを移項してj=0から順に解き、初期色頻度のgの総和から単色終端のポテンシャルを差し引く。 |
| [abc249-f](../../src/content/technique-inventory/shard-01/abc249-f.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `enumerate-frontier-best-first` | 末尾から操作を走査し、後続加算の総和と無視する負加算の集合を優先度付きキューで管理する。代入を跨ぐたび無視枠を一つ消費し、集合サイズを枠内へ縮めて代入値との和を最大化する。 |
| [abc249-g](../../src/content/technique-inventory/shard-05/abc249-g.json) | 維持 | なし | 維持 | P: `maintain-xor-linear-basis` / C: — / S: — | (A_i,B_i)を連結したベクトルにガウス消去を行い、A側の上位ビットからK以下となる分岐を探索する。Kとの大小が確定した各候補で残余基底によるBの最大XORを求め、最大値を採用する。 |

### ABC250

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc250-e](../../src/content/technique-inventory/shard-05/abc250-e.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: — | A,Bそれぞれについて初出値の列と各位置のdistinct数を作る。kを増やしながら両初出値を対称差集合へ追加・削除し、空ならequal[k]=trueとして、問い合わせでは二つのdistinct数が等しくequal[k]かを答える。 |
| [abc250-ex](../../src/content/technique-inventory/shard-01/abc250-ex.json) | 維持 | 現順維持 | 維持 | P: `sweep-connectivity-by-kruskal-threshold` / C: `model-and-compute-shortest-path` / S: `linearize-events`、`maintain-connectivity-components` | K個の家を同時に始点としてDijkstraを行い、各辺の変換重みd[a]+c+d[b]を求めて昇順に並べる。質問もt順に処理し、重み≤tの辺をDSUへ追加して指定された家x,yの連結を判定する。 |
| [abc250-f](../../src/content/technique-inventory/shard-01/abc250-f.json) | 維持 | なし | 維持 | P: `maintain-monotone-window` / C: — / S: `reduce-geometry-to-algebraic-predicates` | 全体の2倍面積Sを求め、頂点を巡回させながら部分多角形の2倍面積Eを外積で増減する。各左端について4EがSを超えるまで右端を進め、跨ぐ前後の\|S-4E\|で答えを更新する。 |
| [abc250-g](../../src/content/technique-inventory/shard-01/abc250-g.json) | 維持 | なし | 維持 | P: `maintain-piecewise-linear-convex-function` / C: — / S: `enumerate-frontier-best-first` | 利益を0、最小ヒープを最初の価格一個で初期化する。二日目以降は挿入前の最小値mとP_iを比較し、m<P_iならmを一つ取り出して利益へP_i-mを加え、P_iを二個挿入する。そうでなければP_iを一個挿入する。heapは取引候補の限界費用を表し、過去の売りを後から取り消してより高い価格へ付け替えられる。価格[1,2,100]では利益は1+98=99となる。全体O(N log N)。 |

### ABC251

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc251-e](../../src/content/technique-inventory/shard-00/abc251-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | 操作1を選択・非選択の二ケースに固定し、各位置で現在の操作を選ぶかを2状態DPで更新する。最後に操作Nと操作1がともに未選択のケースを除き、二ケースの最小費用を取る。 |
| [abc251-ex](../../src/content/technique-inventory/shard-05/abc251-ex.json) | 維持 | なし | 維持 | P: `accelerate-iteration-by-characteristic-p-frobenius` / C: — / S: `formulate-combinatorial-coefficients`、`maintain-ordered-interval-partition` | N-Kを七進的な7の冪ジャンプへ分解し、各ジャンプでRLE列とその7^tシフト列を法7で加算する。区間境界を分割し、隣接する同値区間を再結合しながら、最後に先頭K項を出力する。 |
| [abc251-f](../../src/content/technique-inventory/shard-05/abc251-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: — | 頂点1を根にDFSし、未訪問頂点を初めて発見した辺を第一の木として出力する。続いて頂点1からBFSし、同様に発見辺を第二の木として出力する。 |
| [abc251-g](../../src/content/technique-inventory/shard-02/abc251-g.json) | 維持 | なし | 維持 | P: `represent-convex-intersection-by-halfplanes` / C: — / S: — | 各辺iについてM個の平行移動後頂点との外積定数を計算し、その最大値limit[i]を保存する。各質問点zについて全iでcross(edge[i],z)≥limit[i]かを調べ、全て満たせばYesとする。 |

### ABC252

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc252-e](../../src/content/technique-inventory/shard-00/abc252-e.json) | 維持 | なし | 維持 | P: `build-shortest-path-certificate` / C: — / S: `model-and-compute-shortest-path` | 隣接辺 (v,to,w,id) で dist[to]>dist[v]+w となるたび dist[to] と parentEdge[to]=id を更新する。Dijkstra 終了後、頂点 2..N の parentEdge を出力すれば、距離和の下界を達成する N-1 本が得られる。 |
| [abc252-ex](../../src/content/technique-inventory/shard-02/abc252-ex.json) | 維持 | なし | 維持 | P: `split-enumeration-space` / C: — / S: `query-bitwise-order-with-trie` | 色を選択数の積が均衡する二群へ分け、各群で一色一枚を選ぶ全XORを重複込みで列挙する。一方を二進trieへ入れ、上位ビットから1側を選んだ組数を数えてKを更新しながらK番目に大きいXORを確定する。 |
| [abc252-f](../../src/content/technique-inventory/shard-01/abc252-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `enumerate-frontier-best-first` | ΣA<Lなら長さL-ΣAの片を追加し、全ての片を最小ヒープへ入れる。最小の二片を取り出して和を費用へ加え、その和をヒープへ戻す操作を一片になるまで繰り返す。 |
| [abc252-g](../../src/content/technique-inventory/shard-02/abc252-g.json) | 維持 | なし | 維持 | P: `design-interval-split-dp` / C: — / S: — | 先行順列に仮想根を加え、dp[l][r]を区間[l,r)から条件を満たす森・部分木を作る数として定義する。最初の子部分木の終端kを列挙し、根番号の大小条件を満たすとき左右区間の積を加え、法998244353で答えを得る。 |

### ABC253

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc253-e](../../src/content/technique-inventory/shard-05/abc253-e.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: — | 各長さについて前行dpの累積和を作る。各末尾値jへ、K=0なら全体和、そうでなければ範囲外の[1,j-K]と[j+K,M]の和を加えて遷移し、法998244353で最終行を合計する。 |
| [abc253-ex](../../src/content/technique-inventory/shard-05/abc253-ex.json) · [指摘](#finding-abc253-ex) | 維持 | なし | **変更** | P: `count-combinatorial-objects-by-determinant` / C: — / S: `count-labeled-structures-by-components` | 全頂点部分集合Tについて多重辺ラプラシアンの余因子行列式からtree[T]を求める。固定頂点を含むTを列挙してforest[S][i]へtree[T]×forest[S\T][i-(\|T\|-1)]を加え、得た森の辺集合数にi!を掛けて全M^iで割る。 |
| [abc253-f](../../src/content/technique-inventory/shard-01/abc253-f.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `linearize-static-range-information`、`maintain-weighted-prefix-statistics` | 一度目の走査で各点取得をその行の直前代入へ紐付ける。二度目は列区間加算をrange-add/point-query BITで処理し、代入時に紐付く各列のBIT値を負の補正として保存し、取得時のBIT値と代入値へ加える。 |
| [abc253-g](../../src/content/technique-inventory/shard-02/abc253-g.json) | 維持 | なし | 維持 | P: `evaluate-compressed-integer-blocks` / C: — / S: — | 三角数を64ビットで計算してL,Rの行と行内位置を求める。最初と最後の不完全行の交換を直接行い、その間の完全行群があれば対応するsuffix回転を二回のreverseでまとめて適用する。 |

### ABC254

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc254-e](../../src/content/technique-inventory/shard-05/abc254-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: — | 各問い合わせ(x,k)ごとにxからBFSまたは深さ制限DFSを行い、距離kへ達した頂点から先へは進まない。訪れた頂点番号を一度ずつ合計し、訪問印は今回触れた頂点だけ戻す。 |
| [abc254-ex](../../src/content/technique-inventory/shard-03/abc254-ex.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `query-bitwise-order-with-trie` | A_i,B_iの二進表記を同じtrieへ挿入し、深い節点からA個数とB個数を相殺する。残ったAは親へ移し、残ったBは末尾辺が0なら親へ移し、1なら不可能として-1にする。全移動数を合計する。 |
| [abc254-f](../../src/content/technique-inventory/shard-00/abc254-f.json) | 維持 | なし | 維持 | P: `reduce-integer-structure-by-gcd` / C: — / S: `design-associative-range-summary` | 差分配列dA[i]=A_i-A_(i-1)、dB[j]=B_j-B_(j-1)を区間gcd可能な構造へ載せる。各質問でgcd(A_h1+B_w1, gcd(dA[h1+1..h2]), gcd(dB[w1+1..w2]))を返す。 |
| [abc254-g](../../src/content/technique-inventory/shard-02/abc254-g.json) | 維持 | なし | 維持 | P: `jump-deterministic-transition` / C: — / S: `compress-sparse-keys`、`linearize-events` | 同じビルで共通部分を持つエレベーター区間をマージし、端点階を座標圧縮する。一回通路を使った後の最大到達階nextを前計算してダブリング表を作り、各質問をY≤Wへ正規化し、到達階を下から持ち上げて最小通路数を求める。 |

### ABC255

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc255-e](../../src/content/technique-inventory/shard-02/abc255-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | Bを漸化式で作り、全i,jについて候補Z=(-1)^(i+1)(X_j-B_i)を連想配列で数える。最大頻度を答えとする。 |
| [abc255-ex](../../src/content/technique-inventory/shard-02/abc255-ex.json) | 維持 | なし | 維持 | P: `maintain-ordered-interval-partition` / C: — / S: `bound-monotone-total-work` | 初期ブロック[1,N]の値を0とし、各質問でLとR+1に境界を作る。完全に含まれる各ブロック[l,r],dの収穫量を足して削除し、値Dの一ブロック[L,R]を挿入する。 |
| [abc255-f](../../src/content/technique-inventory/shard-03/abc255-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: — | 各頂点の中間順位置invを前計算し、(preL,inL,len)を持つ部分問題を処理する。根=P[preL]の位置が中間順区間内か検証し、左右サイズで二部分へ分け、空でなければその先頭を子として記録する。 |
| [abc255-g](../../src/content/technique-inventory/shard-00/abc255-g.json) | 維持 | なし | 維持 | P: `classify-game-states` / C: — / S: — | S={0,X_i}を昇順に処理し、各例外Xについて禁止遷移先X-YのGrundy値を求める。過去全体での出現数が禁止分を上回る最小値をmexとしてg(X)にし、hと追加頻度を更新する。各A_iは直前例外を二分探索して式で求め、全山のxorを判定する。 |

### ABC256

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc256-e](../../src/content/technique-inventory/shard-02/abc256-e.json) | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: — | 各頂点の入次数を求め、入次数0をキューに入れて辺を順に削除する。最後まで残る閉路頂点を未訪問ごとに一周し、その閉路上のC最小値を答えへ加える。 |
| [abc256-ex](../../src/content/technique-inventory/shard-05/abc256-ex.json) | 維持 | なし | 維持 | P: `bound-monotone-total-work` / C: — / S: `design-range-update-action`、`maintain-ordered-interval-partition` | 初期配列を非零同値区間へまとめ、別に区間代入・区間和可能な遅延セグメント木を持つ。除算では対象区間をsplitして各値vをfloor(v/x)へ代入し、0区間をsetから消す。代入質問でもsetを置換し、和質問はsegment treeから得る。 |
| [abc256-f](../../src/content/technique-inventory/shard-00/abc256-f.json) · [指摘](#finding-abc256-f) | 維持 | なし | **変更** | P: `maintain-weighted-prefix-statistics` / C: — / S: `formulate-combinatorial-coefficients` | S_r(x)=Σ_{i=1}^x i^r A_i (r=0,1,2) を 3 本の Fenwick tree で管理し、D_x={S_2(x)-(2x+3)S_1(x)+(x+1)(x+2)S_0(x)}/2 を計算する。代入更新は旧値との差分を 3 種類の重みで加える。 |
| [abc256-g](../../src/content/technique-inventory/shard-03/abc256-g.json) | 維持 | なし | 維持 | P: `accelerate-fixed-linear-transition` / C: — / S: `formulate-combinatorial-coefficients` | 二項係数C(D-1,r)を法998244353で前計算する。k=0..D+1ごとに2×2行列M_k[u][v]=C(D-1,k-u-v)を作り、M_k^Nのtraceを答えへ加える。 |

### ABC257

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc257-e](../../src/content/technique-inventory/shard-05/abc257-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: — | c_minを求めて桁数L=floor(N/c_min)を固定する。左から各桁について9から1を調べ、C_d+(L-p-1)c_min≤残予算を満たす最初のdを出力して費用を引く。 |
| [abc257-ex](../../src/content/technique-inventory/shard-05/abc257-ex.json) | 維持 | なし | 維持 | P: `restrict-geometric-candidates-to-boundary` / C: — / S: `maintain-order-through-crossing-events` | 各サイコロから整数スケールした(x_i,y_i)を作り、初期のx順と上位K和を用意する。全点対の順位交換イベントを傾き順にソートし、同傾き群を反映しながら上位KのΣx,Σyを更新して(Σx)^2+Σyの最大を評価する。 |
| [abc257-f](../../src/content/technique-inventory/shard-02/abc257-f.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: `enumerate-bounded-candidates-or-cases` | 頂点0を含む辺の相手集合Sを取り出し、残る通常グラフで1とNからBFSしてd1,dNを求める。S上の各距離最小値を計算し、T=1..Nごとに四候補の最小を出し、全て無限なら-1とする。 |
| [abc257-g](../../src/content/technique-inventory/shard-05/abc257-g.json) | 維持 | なし | 維持 | P: `build-prefix-match-state` / C: — / S: `select-state-graph-search` | S、未使用文字、Tを連結してZ値から各T位置のL_iを得る。到達済み位置を左から一度ずつ走査し、現在の断片数で使える開始位置のmax(i+L_i)を次frontierとして更新する。frontierが伸びなければ-1、\|T\|へ達した段階数を答える。 |

### ABC258

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc258-e](../../src/content/technique-inventory/shard-03/abc258-e.json) | 維持 | なし | 維持 | P: `maintain-monotone-window` / C: — / S: `decompose-functional-graph` | q=floor(X/S), rem=X mod Sとし、二周したW上の二点法でrem以上にする追加個数を各iへ求めてC_i=qN+追加数とする。next[i]=(i+C_i) mod Nを作り、0からの頂点列と閉路開始を記録して各K_i-1位置のCを返す。 |
| [abc258-ex](../../src/content/technique-inventory/shard-05/abc258-ex.json) | 維持 | なし | 維持 | P: `accelerate-fixed-linear-transition` / C: — / S: — | 0を必ず選んだ二状態ベクトルから始め、ソート済み禁止点A_iの間にある許可位置数だけFibonacci遷移行列を高速累乗して掛ける。禁止点では選択遷移を除いた状態更新だけを行い、最後にSを必ず選ぶ条件に対応する成分を答える。 |
| [abc258-f](../../src/content/technique-inventory/shard-05/abc258-f.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `enumerate-bounded-candidates-or-cases` | 各点からfloor/ceilしたB倍数の縦線・横線への四射影を列挙する。入口までは通常費用K、入口・出口間は大通り網距離、出口から終点も通常費用Kとして16組の最小を取り、全て通常道路の候補とも比較する。 |
| [abc258-g](../../src/content/technique-inventory/shard-01/abc258-g.json) | 維持 | なし | 維持 | P: `accelerate-set-operations-with-bitsets` / C: — / S: `reorder-counting-contributions` | 各頂点の隣接行をbitsetとして保存する。全i<jで辺がある場合だけ(row_i & row_j).count()を合計し、各三角形の三重計数を除くため3で割る。 |

### ABC259

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc259-e](../../src/content/technique-inventory/shard-03/abc259-e.json) | 維持 | なし | 維持 | P: `decompose-by-prime-or-divisor` / C: — / S: — | 最初の走査で各素数pの最大指数max[p]と達成者数count[p]を求める。次に各a_iの組(p,e)を見てe=max[p]かつcount[p]=1が一つでもあればiを特別と数える。その個数をcとし、特別でないiがあれば共通の『LCM不変』も1種類なので、答えをmin(c+1,N)とする。 |
| [abc259-ex](../../src/content/technique-inventory/shard-00/abc259-ex.json) · [指摘](#finding-abc259-ex) | 維持 | なし | **変更** | P: `balance-heavy-light-threshold` / C: — / S: `formulate-combinatorial-coefficients` | 階乗と逆階乗を2Nまで前計算する。ラベルごとに座標を集め、k≤Nなら比較可能な全座標対へ二項係数を加え、k>Nなら盤面を左上から走査するDPを一回行って対象マスで値を回収する。全加算は998244353で剰余を取る。 |
| [abc259-f](../../src/content/technique-inventory/shard-03/abc259-f.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: `prove-greedy-order` | 任意の根からpostorderで処理する。各vでbase=Σdp_le[u]と各子のΔを求めて降順に並べ、正の先頭d_v個を足してdp_le[v]、正の先頭d_v−1個を足してdp_lt[v]とする。d_v=0のdp_lt[v]は実現不能値にし、根のdp_leを答える。 |
| [abc259-g](../../src/content/technique-inventory/shard-02/abc259-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: — | S,T、行頂点R_i、列頂点C_jを作る。S→R_iへ行内負値の絶対値和、C_j→Tへ列内負値の絶対値和を張る。正マスはR_i→C_jへA_ij、負マスはC_j→R_iへ十分大きい容量を張る。答えはΣ+−最大流、すなわちΣ+−最小カット容量である。 |

### ABC260

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc260-e](../../src/content/technique-inventory/shard-03/abc260-e.json) | 維持 | なし | 維持 | P: `maintain-monotone-window` / C: — / S: — | 包含に関して上向き閉じた区間条件を two pointers で最小右端へ圧縮し、各左端が作る長さ範囲を imos で集計する。 |
| [abc260-ex](../../src/content/technique-inventory/shard-04/abc260-ex.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `apply-formal-power-series-operations` / S: `compute-convolution-or-correlation`、`compute-in-modular-arithmetic`、`correct-overlap-by-inversion`、`divide-search-space-recursively`、`formulate-combinatorial-coefficients` | 同色 run の組合せを exponential generating function で合成し、binomial inversion で分布を復元し、power moments を rational generating function の級数展開へ接続する。 |
| [abc260-f](../../src/content/technique-inventory/shard-02/abc260-f.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: — | 短い偶閉路の検出を、二歩パスの両端対に中点を記録する collision detection として実装する。 |
| [abc260-g](../../src/content/technique-inventory/shard-04/abc260-g.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: — | 非軸平行な格子三角形を、境界方向ごとに異なる prefix operator を持つ multidirectional imos として加算する。 |

### ABC261

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc261-e](../../src/content/technique-inventory/shard-00/abc261-e.json) | 維持 | なし | 維持 | P: `compose-finite-functions` / C: — / S: — | bitwise operation sequence を各 bit 上の四種類の unary Boolean function の monoid とみなし、prefix composition を逐次更新する。 |
| [abc261-ex](../../src/content/technique-inventory/shard-01/abc261-ex.json) | 維持 | なし | 維持 | P: `solve-cyclic-minimax-game` / C: — / S: — | reachability game の retrograde analysis に、AND/OR 状態の確定規則と nonnegative minimax distance の Dijkstra ordering を組み合わせる。 |
| [abc261-f](../../src/content/technique-inventory/shard-01/abc261-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `maintain-weighted-prefix-statistics` | 重み付き隣接 swap の最小費用を、有料で交差しなければならない inversion pair の個数へ変換し、カテゴリ内寄与を inclusion-exclusion 的に除く。 |
| [abc261-g](../../src/content/technique-inventory/shard-04/abc261-g.json) · [指摘](#finding-abc261-g) | 維持 | なし | **変更** | P: `design-interval-split-dp` / C: — / S: `compute-all-pairs-distance` | single-symbol rewriting を weighted context-free derivation とみなし、CYK 型 interval parsing に unit-production closure の shortest paths を組み込む。 |

### ABC262

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc262-e](../../src/content/technique-inventory/shard-04/abc262-e.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: `compute-in-modular-arithmetic` | グラフcutのparity条件を handshaking identity で頂点属性の選択個数へ移し、二種類から固定個数を選ぶ組合せ和として計算する。 |
| [abc262-ex](../../src/content/technique-inventory/shard-00/abc262-ex.json) | 維持 | なし | 維持 | P: `design-prefix-partition-dp` / C: — / S: `compress-sparse-keys`、`design-range-update-action`、`reorder-counting-contributions` | range maximum equality を pointwise envelope B と level-set ごとの hitting constraint に分解し、各levelを last occurrence DP で数える。 |
| [abc262-f](../../src/content/technique-inventory/shard-02/abc262-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `design-associative-range-summary` | 操作列を rotate-then-delete の正規形へ交換し、lexicographic optimization を最初の要素による候補枝刈りと range-min greedy に落とす。 |
| [abc262-g](../../src/content/technique-inventory/shard-01/abc262-g.json) | 維持 | なし | 維持 | P: `design-interval-split-dp` / C: — / S: — | LIFO 制約を最大選択値の push 時点で切る separator property に変え、位置区間と値区間を同時に分割する四次元 interval DP を作る。 |

### ABC263

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc263-e](../../src/content/technique-inventory/shard-02/abc263-e.json) · [指摘](#finding-abc263-e) | 維持 | なし | **変更** | P: `solve-stochastic-recurrence` / C: — / S: `compute-in-modular-arithmetic` | 確率DPの self-loop を一次方程式として消去し、range-sum optimized backward expectation DP に変える。 |
| [abc263-ex](../../src/content/technique-inventory/shard-05/abc263-ex.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `detect-crossing-by-cyclic-order`、`linearize-events`、`maintain-weighted-prefix-statistics`、`reduce-geometry-to-algebraic-predicates` | geometric order statistic を parametric counting にし、line-circle dualization で chord intersection、さらに circular order の interval crossing count へ段階的に落とす。 |
| [abc263-f](../../src/content/technique-inventory/shard-01/abc263-f.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | fixed bracket tournament を complete binary tree DP とし、merge の片側全探索を winner-independent maximum へ畳み込む。 |
| [abc263-g](../../src/content/technique-inventory/shard-02/abc263-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: `optimize-univariate-convex-function` | almost-bipartite capacitated matching の例外自己辺を使用回数でparameterizeし、parametric max flow value の離散凹性で最適点を探索する。 |

### ABC264

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc264-e](../../src/content/technique-inventory/shard-01/abc264-e.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `augment-components-with-metadata` | offline dynamic connectivity の削除列を time reversal で追加列へ変換し、component aggregate 付き Union-Find で問い合わせ値を保つ。 |
| [abc264-ex](../../src/content/technique-inventory/shard-00/abc264-ex.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | incremental rooted tree counting を bounded-height tree DP の delta propagation とし、unordered child-pair convolution を child sum で差分更新する。 |
| [abc264-f](../../src/content/technique-inventory/shard-02/abc264-f.json) · 所見あり | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | global row/column XOR choices を monotone path の frontier state へ局所化し、cell×current-line parities の shortest-path DP にする。 |
| [abc264-g](../../src/content/technique-inventory/shard-00/abc264-g.json) | 維持 | 現順維持 | 維持 | P: `build-finite-string-automaton` / C: `detect-improving-cycles` / S: — | bounded-length substring score を de Bruijn 型 suffix automaton のedge weightへ変換し、unbounded sequence optimization を positive-cycle detection 付き longest walk にする。 |

### ABC265

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc265-e](../../src/content/technique-inventory/shard-01/abc265-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | commutative displacement のwalk countingをcomposition count lattice上のDPへ移し、幾何座標は障害物判定時だけ線形写像で復元する。 |
| [abc265-ex](../../src/content/technique-inventory/shard-01/abc265-ex.json) | 維持 | なし | 維持 | P: `compute-convolution-or-correlation` / C: — / S: `add-conway-number-games`、`classify-game-states`、`factor-separable-linear-transform` | partisan gameのsurreal-number成分を加法群、impartial成分をXOR群として、direct product group上のconvolutionを多次元Fourier変換で対角化する。 |
| [abc265-f](../../src/content/technique-inventory/shard-02/abc265-f.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: — | separable L1-ball intersection countingをdistance-pair DPにし、一軸transition kernelの三本のdiagonal supportをprefix sumsで高速畳み込みする。 |
| [abc265-g](../../src/content/technique-inventory/shard-05/abc265-g.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: `design-associative-range-summary` | small-alphabet sequence statisticsをordered-pair monoidへ持ち上げ、alphabet endomorphismをそのmonoidへのlazy actionとしてsegment treeに載せる。 |

### ABC266

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc266-e](../../src/content/technique-inventory/shard-02/abc266-e.json) | 維持 | なし | 維持 | P: `optimize-stochastic-actions` / C: — / S: — | 有限期限optimal stoppingをBellman value iterationにし、観測後のstop payoffとcontinuation valueの最大を取る。 |
| [abc266-ex](../../src/content/technique-inventory/shard-04/abc266-ex.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `compress-sparse-keys`、`design-associative-range-summary`、`reduce-geometry-to-algebraic-predicates` | anisotropic movement coneをlinear coordinate transformでorthant orderへ変え、weighted event schedulingを3D dominance maximum DPとして解く。 |
| [abc266-f](../../src/content/technique-inventory/shard-03/abc266-f.json) | 維持 | なし | 維持 | P: `peel-graph-core` / C: — / S: — | unicyclic graphをcore cycleとrooted-tree componentsへ分解し、path multiplicity queryをcomponent label equalityへ圧縮する。 |
| [abc266-g](../../src/content/technique-inventory/shard-05/abc266-g.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: — | exact nonoverlapping pattern countをpattern contractionでavoidance problemへ変え、multiset permutationとforbidden-gap insertionに分解する。 |

### ABC267

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc267-e](../../src/content/technique-inventory/shard-00/abc267-e.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `bound-monotone-total-work` | minimize maximum elimination costをparametric searchへ変え、monotone eligibilityを持つweighted degeneracy peelingでfeasibilityを判定する。 |
| [abc267-ex](../../src/content/technique-inventory/shard-04/abc267-ex.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `divide-search-space-recursively` | knapsack generating functionをsum degree×selection parityのgroup algebraとして表し、product treeとfast convolutionで全因子を掛ける。 |
| [abc267-f](../../src/content/technique-inventory/shard-05/abc267-f.json) | 維持 | なし | 維持 | P: `use-tree-diameter-extrema` / C: — / S: `answer-tree-ancestor-queries` | arbitrary-distance witness queryをdiameter endpoint coverで二つのlevel-ancestor queryへ帰着し、offline DFS stackで解く。 |
| [abc267-g](../../src/content/technique-inventory/shard-04/abc267-g.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: — | Eulerian-number型のgap insertion DPをmultiset-like equal valuesへ拡張し、strict ascentを作れないequal-left gapsの補正を加える。 |

### ABC268

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc268-e](../../src/content/technique-inventory/shard-03/abc268-e.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: — | sum of circular absolute-distance functionsをperiod doublingでpiecewise-linear range additionsへ変え、coefficient-wise imosで全評価点を一括計算する。 |
| [abc268-ex](../../src/content/technique-inventory/shard-01/abc268-ex.json) · 所見あり | 維持 | なし | 維持 | P: `build-suffix-lcp-index` / C: — / S: `design-associative-range-summary`、`linearize-events`、`maintain-ordered-set-statistics`、`prove-greedy-order` | multi-pattern occurrence detectionをsuffix-order range assignmentへ変換し、substring destructionをminimum interval stabbingへ帰着する。 |
| [abc268-f](../../src/content/technique-inventory/shard-01/abc268-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: — | pairwise separable concatenation objectiveにexchange argumentを適用し、Smith-rule型のratio orderingへ変換する。 |
| [abc268-g](../../src/content/technique-inventory/shard-02/abc268-g.json) · [指摘](#finding-abc268-g) | 維持 | なし | **変更** | P: `reorder-counting-contributions` / C: — / S: `index-shared-prefixes-with-trie` | random total-order lexicographic rankの期待値をlinearity of expectationでpairwise comparisonへ分解し、deterministic prefix poset countsをtrieで集計する。 |

### ABC269

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc269-e](../../src/content/technique-inventory/shard-00/abc269-e.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `maintain-interactive-query-protocol` | rectangle count queryを一次元のdefect detectorとして使い、独立な二回のbinary searchで唯一欠けたrowとcolumnを復元する。 |
| [abc269-ex](../../src/content/technique-inventory/shard-00/abc269-ex.json) | 維持 | なし | 維持 | P: `accelerate-tree-dp-by-heavy-path` / C: — / S: `aggregate-rooted-tree`、`compute-convolution-or-correlation`、`divide-search-space-recursively`、`encode-counting-by-generating-function` | antichainのtree generating-function DPをheavy pathsへ分解し、path recurrenceをNTT付きdivide and conquer、light subtreesをsize-aware mergingで合成する。 |
| [abc269-f](../../src/content/technique-inventory/shard-03/abc269-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `compute-in-modular-arithmetic` | checkerboard filterを二つのparity classへ分割し、nested arithmetic progression sumsで巨大rectangle queryをO(1)評価する。 |
| [abc269-g](../../src/content/technique-inventory/shard-04/abc269-g.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | equal flip deltasをfrequency compressionし、binary-split bounded knapsackへ帰着して全visible sumsのminimum flipsを同時に得る。 |

### ABC270

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc270-e](../../src/content/technique-inventory/shard-05/abc270-e.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: — | cyclic simulationをcomplete roundsのmonotone aggregateへ圧縮し、binary searchと一回のresidual scanで最終状態を再構成する。 |
| [abc270-ex](../../src/content/technique-inventory/shard-02/abc270-ex.json) | 維持 | なし | 維持 | P: `solve-stochastic-recurrence` / C: — / S: `accelerate-fixed-linear-transition`、`compute-in-modular-arithmetic` | Markov stateを最大不足量へlumpし、piecewise-constant coefficientのexpectation recurrenceをaffine shiftとfast exponentiationでbreakpoint間ジャンプする。 |
| [abc270-f](../../src/content/technique-inventory/shard-01/abc270-f.json) | 維持 | なし | 維持 | P: `construct-optimal-spanning-tree` / C: — / S: `enumerate-bounded-candidates-or-cases`、`maintain-connectivity-components` | global transportation modesをvirtual verticesへ変換し、hub inclusionのconstant-size case splitとminimum spanning treeで最小建設費を求める。 |
| [abc270-g](../../src/content/technique-inventory/shard-05/abc270-g.json) | 維持 | なし | 維持 | P: `find-orbit-hit-by-bsgs` / C: — / S: `compute-in-modular-arithmetic` | invertible affine recurrenceのorbit searchへBaby-Step Giant-Stepを適用し、forward giant stepsとbackward baby stepsを衝突させる。 |

### ABC271

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc271-e](../../src/content/technique-inventory/shard-04/abc271-e.json) · [指摘](#finding-abc271-e) | **変更** | なし | **変更** | P: `design-order-preserving-dp` / C: — / S: `relax-in-dependency-order` | ordered edge stream上のsubsequence-constrained shortest pathを、prefixごとのsingle-edge relaxation DPとして計算する。 |
| [abc271-ex](../../src/content/technique-inventory/shard-04/abc271-ex.json) | 維持 | なし | 維持 | P: `characterize-integer-solvability` / C: — / S: `enumerate-bounded-candidates-or-cases`、`prove-greedy-order` | integer lattice shortest walkをexchange argumentでconstant-support representationsへ縮約し、小さなDiophantine systemsの全列挙で解く。 |
| [abc271-f](../../src/content/technique-inventory/shard-05/abc271-f.json) | 維持 | なし | 維持 | P: `split-enumeration-space` / C: — / S: — | grid path spaceを唯一のanti-diagonal meeting cellでfactorizeし、XOR constraintをmeet-in-the-middle frequency joinへ変換する。 |
| [abc271-g](../../src/content/technique-inventory/shard-00/abc271-g.json) | 維持 | なし | 維持 | P: `accelerate-fixed-linear-transition` / C: — / S: `compute-in-modular-arithmetic`、`propagate-probability-distribution` | periodic Bernoulli processの無限待ち時間を一accessごとのfinite Markov transitionへ圧縮し、matrix exponentiationで巨大なaccess countを進める。 |

### ABC272

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc272-e](../../src/content/technique-inventory/shard-03/abc272-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: — | mexの値域boundで全time-element pairsをsparse eventsへ絞り、arithmetic progressionの有効区間列挙とoffline bucketsで処理する。 |
| [abc272-ex](../../src/content/technique-inventory/shard-01/abc272-ex.json) | 維持 | 現順維持 | 維持 | P: `evaluate-polynomial-at-many-points` / C: `encode-counting-by-generating-function` / S: `compute-convolution-or-correlation`、`correct-overlap-by-inversion`、`divide-search-space-recursively`、`formulate-combinatorial-coefficients` | permutation counting DPをexponential generating functionsでdiagonalizeし、product polynomialのmultipoint evaluationとbinomial inversionへ変換する。 |
| [abc272-f](../../src/content/technique-inventory/shard-03/abc272-f.json) | 維持 | なし | 維持 | P: `build-suffix-lcp-index` / C: — / S: — | cyclic-string comparisonをcarefully padded doubled stringsのsuffix rankingへ変換し、cross-group order pairsをrank sweepで数える。 |
| [abc272-g](../../src/content/technique-inventory/shard-04/abc272-g.json) | 維持 | なし | 維持 | P: `design-and-bound-randomized-algorithm` / C: — / S: `decompose-by-prime-or-divisor` | hidden majority congruence classからrandom pair samplingでmodulus divisorを抽出し、factorization-generated candidatesをdeterministically verifyするMonte Carlo searchである。 |

### ABC273

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc273-e](../../src/content/technique-inventory/shard-00/abc273-e.json) | 維持 | なし | 維持 | P: `persist-data-structure-versions` / C: — / S: — | versioned sequence operationsをstructural sharingするpersistent linked stackとして表し、notebook pagesをversion pointersにする。 |
| [abc273-ex](../../src/content/technique-inventory/shard-05/abc273-ex.json) | 維持 | なし | 維持 | P: `traverse-stern-brocot-ancestors` / C: — / S: `divide-search-space-recursively`、`maintain-ordered-set-statistics`、`merge-small-into-large` | mediant insertion costをcompressed Stern–Brocot trie上のancestor-union countへ写し、ordered-position set mergingで全consecutive subarraysへのnode寄与を合計する。 |
| [abc273-f](../../src/content/technique-inventory/shard-00/abc273-f.json) | 維持 | なし | 維持 | P: `design-interval-expansion-dp` / C: — / S: `compress-sparse-keys` | line exploration with prerequisite wallsをvisited-coordinate intervalへstate compressionし、endpoint-based interval DPでminimum travel distanceを求める。 |
| [abc273-g](../../src/content/technique-inventory/shard-02/abc273-g.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `formulate-combinatorial-coefficients` | bounded row/column-sum matrix countingをcolumn remainder histogramへstate compressionし、row sum別のcombinatorial transitionsで数える。 |

### ABC274

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc274-e](../../src/content/technique-inventory/shard-00/abc274-e.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: — | optional pickups that alter speedをsubset TSPへ統合し、visited-mask-derived resource levelでedge costsを評価する。 |
| [abc274-ex](../../src/content/technique-inventory/shard-04/abc274-ex.json) | 維持 | 現順維持 | 維持 | P: `compare-sequences-by-rolling-fingerprint` / C: `compute-in-finite-field-extension` / S: — | XORを加法とするfinite fieldへrolling hashを移植し、linear hash compositionとLCP binary searchでvirtual arraysを比較する。 |
| [abc274-f](../../src/content/technique-inventory/shard-01/abc274-f.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `reduce-geometry-to-algebraic-predicates` | moving interval captureをleftmost anchorで離散化し、relative-motion inequalitiesから得るweighted time intervalsのmaximum overlapへ帰着する。 |
| [abc274-g](../../src/content/technique-inventory/shard-02/abc274-g.json) | 維持 | なし | 維持 | P: `solve-bipartite-matching` / C: — / S: `prove-greedy-order` | camera directions/positionsをmaximal visibility runsへcanonicalizeし、all-cell coverageをbipartite minimum vertex coverすなわちmaximum flowへ帰着する。 |

### ABC275

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc275-e](../../src/content/technique-inventory/shard-05/abc275-e.json) | 維持 | なし | 維持 | P: `propagate-probability-distribution` / C: — / S: `compute-in-modular-arithmetic` | dp[0][0]=1 とし、i=0,…,K-1 で j<N と d=1,…,M を走査する。t=j+d が N 以下なら t、超えるなら 2N-t へ invM 倍を配り、t=N の分だけ答えに加える。 |
| [abc275-ex](../../src/content/technique-inventory/shard-05/abc275-ex.json) | 維持 | 現順維持 | 維持 | P: `maintain-piecewise-linear-convex-function` / C: `build-cartesian-tree-decomposition` / S: `maintain-ordered-set-statistics`、`merge-small-into-large` | 単調 stack等で tie規約付き max Cartesian treeを構築する。postorderで子の折れ線event集合を大きい方へ併合し、j≥A_i かつ子の限界節約<B_iとなる j_0 までeventを消費する。prefix slopeをB_iへ置換するbreakpointを挿入し、rootのF(0)を答える。 |
| [abc275-f](../../src/content/technique-inventory/shard-04/abc275-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | dp[sum][last] を最小操作数として dp[0][1]=0 から始める。a_i を残すなら sum+a_i,last=1 へ同費用、消すなら sum,last=0 へ last=1 のときだけ +1 して更新し、各 x の min(dp[x][0],dp[x][1]) を出す。 |
| [abc275-g](../../src/content/technique-inventory/shard-04/abc275-g.json) | 維持 | なし | 維持 | P: `restrict-geometric-candidates-to-boundary` / C: — / S: — | 各点を (A_i/C_i,B_i/C_i) に写し、単調鎖で下側の Pareto convex frontier を作る。全頂点と隣接線分について max 座標の最小値 ans を調べ、求める極限 1/ans を浮動小数で出力する。 |

### ABC276

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc276-e](../../src/content/technique-inventory/shard-01/abc276-e.json) | 維持 | なし | 維持 | P: `maintain-connectivity-components` / C: — / S: — | S以外の'.'を頂点として隣接roadを連結する。Sの上下左右にあるroadを列挙し、その任意の2つのcomponent idが一致すればYes、なければNoを出す。 |
| [abc276-ex](../../src/content/technique-inventory/shard-01/abc276-ex.json) | 維持 | なし | 維持 | P: `solve-linear-system-and-rank` / C: — / S: `accelerate-set-operations-with-bitsets`、`compress-sparse-keys`、`linearize-static-range-information`、`recover-valid-witness` | e=1,2のqueryだけからcorner prefix変数と右辺(e=2なら1)を作り、F_2掃き出しで一解を得る。未使用prefixは0として2D差分から1/2 matrixを復元し、2D imosで非零queryに覆われないcellを0化する。最後に全queryを検証する。 |
| [abc276-f](../../src/content/technique-inventory/shard-04/abc276-f.json) | 維持 | なし | 維持 | P: `maintain-weighted-prefix-statistics` / C: — / S: `compute-in-modular-arithmetic` | Kを1から進め、Fenwickでcnt≤A_Kとsum≤A_Kを取得し、sumGreater=totalSum-sum≤を作る。S+=2(A_K·cnt≤+sumGreater)+A_K と更新し、S/(K²)を法上で出力してからA_Kを木へ追加する。 |
| [abc276-g](../../src/content/technique-inventory/shard-01/abc276-g.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: — | factorialとinverse factorialを必要上限まで前計算する。x_1=0,1,2とr=0,…,N-1を走査し、s=x_1+2(N-1)-r≤MならC(N-1,r)·C(N+floor((M-s)/3),N)を加える。 |

### ABC277

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc277-e](../../src/content/technique-inventory/shard-05/abc277-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | (1,0)を距離0で開始する。各入力edgeを使用可能なparity層のcost1辺にし、各switch sを(s,0)↔(s,1)のcost0辺にする。dequeで01-BFSし、Nの2状態が未到達なら-1を出す。 |
| [abc277-ex](../../src/content/technique-inventory/shard-05/abc277-ex.json) | 維持 | なし | 維持 | P: `encode-threshold-constraints-as-two-sat` / C: — / S: — | iごとにthreshold 0,…,M+1を用意し、端のunit clauseと単調clauseを張る。各queryと関連tについてlower/upperの2-SAT clauseを追加し、implication graphのSCCで矛盾を判定する。可解なら各iの最大true jを出力する。 |
| [abc277-f](../../src/content/technique-inventory/shard-05/abc277-f.json) | 維持 | なし | 維持 | P: `process-dag-in-topological-order` / C: — / S: — | 各行の0を除くmin/maxを集め、空行を除いてsortし隣接区間を検査する。列番号W頂点に加え、各行の昇順value group境界ごとに補助頂点とgroup→aux→次groupのedgeを作り、全graphがDAGならYesとする。 |
| [abc277-g](../../src/content/technique-inventory/shard-01/abc277-g.json) | 維持 | なし | 維持 | P: `propagate-probability-distribution` / C: — / S: `compute-in-modular-arithmetic`、`reorder-counting-contributions` | 初期vertex1でmarker00の重み1から始める。各stepでcurrent vertexのdeg逆元を掛けて隣接vertexへ配り、到着先C=0なら各未選択markerについて現在時刻を選ぶ/選ばない遷移を行う。C=1到着後のstate11を答えへ加え、K回繰り返す。 |

### ABC278

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc278-e](../../src/content/technique-inventory/shard-01/abc278-e.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: — | count[r][c][x]を(1,1)…(r,c)のx出現数として全値分構築する。各top-left(k,l)とxについてh×w内個数を4項で取り、total[x]との差が正ならanswerを1増やして表形式で出力する。 |
| [abc278-ex](../../src/content/technique-inventory/shard-02/abc278-ex.json) · [指摘](#finding-abc278-ex) | **変更** | なし | **変更** | P: `solve-linear-system-and-rank` / C: — / S: `compute-convolution-or-correlation`、`formulate-combinatorial-coefficients` | q=2のq-factorialと逆元を前計算し、rank式をconvolution形へ整理してG(1…N)をNTTで求める。必要なsigned Stirling係数でF(N),F(N-1)を反転し、distinct全列−Fからgood列を作って初回goodの差を取る。 |
| [abc278-f](../../src/content/technique-inventory/shard-04/abc278-f.json) | 維持 | なし | 維持 | P: `classify-game-states` / C: — / S: `enumerate-subset-state-space` | dp[mask][c]をremaining set=mask、要求先頭文字cから手番playerが勝てるかとする。使用可能word iごとにdp[mask\{i}][last_i]がfalseならtrueとし、maskの小さい順に埋める。full maskから任意初手で勝てればFirst。 |
| [abc278-g](../../src/content/technique-inventory/shard-00/abc278-g.json) | 維持 | なし | 維持 | P: `classify-game-states` / C: — / S: `maintain-interactive-query-protocol`、`normalize-equivalent-states` | parity一致yを選べるならFirstを宣言し、中央y枚を除いた後、judgeの(a,b)へstart=N-a-b+2のmirror手を返す。例外ではg[0…N]を計算し、初期xorで先後を選び、毎turn全intervalのxorを0にする固定長Lの手を探索する。 |

### ABC279

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc279-e](../../src/content/technique-inventory/shard-01/abc279-e.json) | 維持 | なし | 維持 | P: `localize-change-impact-by-witness` / C: — / S: — | まずidentityへ全A_k swapを適用してvalue→final positionのposを作る。次にidentityのprefix配列C'を持ち、iを昇順に、A_iの両位置の値x,yから答えを決めた後、そのswapをC'へ適用する。 |
| [abc279-ex](../../src/content/technique-inventory/shard-01/abc279-ex.json) | 維持 | なし | 維持 | P: `expand-euler-product-sparsely` / C: — / S: `compute-binomial-by-lucas`、`formulate-combinatorial-coefficients` | d=M-Nとし、e=0およびt(3t±1)/2≤dを列挙する。符号(-1)^tを掛けたC(M+N-e-1,2N-1)をmod200003で加算する。二項係数は0…p-1のfactorial/逆factorialを前計算してLucasで評価する。 |
| [abc279-f](../../src/content/technique-inventory/shard-03/abc279-f.json) | 維持 | なし | 維持 | P: `augment-components-with-metadata` / C: — / S: — | 最大N+Q ballのDSUを用意し、rootOfBox[x]とboxOfRoot[r]を持つ。move Y→Xは空caseを分けてcomponentをunionしYを空にする。addはsingleton ballをX componentへunionし、query ball bはboxOfRoot[find(b)]を返す。 |
| [abc279-g](../../src/content/technique-inventory/shard-02/abc279-g.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `factor-and-accelerate-transitions` | 位置1でsing=C、dp=0とする。i=2…Nでsingへdp[i-K]を加え、dp[i-1]=sing(C-1)+Σ_{p=i-K+1}^{i-2}dp[p]を作る。区間和はdp prefixで求め、最後はsingとactive範囲のdpを合計する。 |

### ABC280

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc280-e](../../src/content/technique-inventory/shard-02/abc280-e.json) · [指摘](#finding-abc280-e) | **変更** | なし | **変更** | P: `solve-stochastic-recurrence` / C: — / S: `compute-in-modular-arithmetic` | q=P·inv(100)を法上で作り、p=1,ans=0からi=0,…,N-1でans+=p、p=1-q·pと更新する。最後のansを998244353で出力する。 |
| [abc280-ex](../../src/content/technique-inventory/shard-05/abc280-ex.json) | 維持 | なし | 維持 | P: `build-suffix-lcp-index` / C: — / S: `prune-dominated-candidates-once` | 各S_iにseparatorを付けて連結しSAとLCPを構築、separator suffixを除いたT=(string id,start)とcap済みLCPを得る。stackで有効(i,j,a,b)を辞書順に走査しblock size=(j-i+1)(b-a)を累積する。昇順query xが入るblockでRとT内occurrenceを選び(K,L,L+R-1)を出す。 |
| [abc280-f](../../src/content/technique-inventory/shard-01/abc280-f.json) | 維持 | なし | 維持 | P: `propagate-static-graph-potentials` / C: — / S: — | 未訪問vertexごとにcomponent idとpot=0を置き、(u,v,+c)をDFS緩和する。pot[v]≠pot[u]+cを見つけたcomponentをbadにする。queryはcomponent不同ならnan、badならinf、それ以外はpot[y]-pot[x]。 |
| [abc280-g](../../src/content/technique-inventory/shard-04/abc280-g.json) | 維持 | 現順維持 | 維持 | P: `correct-overlap-by-inversion` / C: `reduce-geometry-to-algebraic-predicates` / S: `linearize-events`、`reorder-counting-contributions` | 点を(x,y,x-y)に変換する。候補X,Yごとに[X,X+D]×[Y,Y+D]へ入る点を整理し、候補Zのsweepで8category countを更新する。各(X,Y,Z)でlower 3面を全てhitする非空subset数を包除で加える。 |

### ABC281

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc281-e](../../src/content/technique-inventory/shard-03/abc281-e.json) | 維持 | なし | 維持 | P: `maintain-ordered-set-statistics` / C: — / S: `maintain-monotone-window` | 初windowをsortしてK個をL、残りをRへ入れsumLを作る。slideごとにoutgoingを所属setから削除し、incomingを境界比較で挿入する。\|L\|<KならminRをLへ、>KならmaxLをRへ移しsumLを更新して出力する。 |
| [abc281-ex](../../src/content/technique-inventory/shard-00/abc281-ex.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `compute-online-relaxed-convolution` / S: `compute-convolution-or-correlation`、`divide-search-space-recursively` | N=1ならAを返す。f_k=C(A,k)をNまで用意し、CDQで左区間のaとlinear factorsを確定、product/convolutionの必要次数sliceだけを右区間の係数へ加える。998244353のNTTを用い、最終a_Nを出力する。 |
| [abc281-f](../../src/content/technique-inventory/shard-00/abc281-f.json) | 維持 | なし | 維持 | P: `minimize-maximum-xor-by-bit-partition` / C: — / S: — | solve(V,b)を定義する。b<0なら0、一方groupだけならそのgroupでsolve(b-1)、両groupがあれば2^b+min(solve(V0,b-1),solve(V1,b-1))を返す。初期V=A,b=29の値が答え。 |
| [abc281-g](../../src/content/technique-inventory/shard-01/abc281-g.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `formulate-combinatorial-coefficients` | dp[1][1]=1から、remaining=N-1-nの通常頂点よりl≥1を選び、C(remaining,l)(2^k-1)^l2^{C(l,2)}を掛けてdp[n+l][l]へ送る。n=N-1になった各kから(2^k-1)を掛けて合計する。全演算は入力M modulo。 |

### ABC282

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc282-e](../../src/content/technique-inventory/shard-03/abc282-e.json) | 維持 | なし | 維持 | P: `construct-optimal-spanning-tree` / C: — / S: `compute-in-modular-arithmetic` | 全i<jについてpowmod(A_i,A_j,M)+powmod(A_j,A_i,M)をmod Mしたweightを計算する。complete graphにmaximum版Primまたはweight降順Kruskalを適用し、採用N-1 edgeの和を出す。 |
| [abc282-ex](../../src/content/technique-inventory/shard-00/abc282-ex.json) · [指摘](#finding-abc282-ex) | 維持 | なし | **変更** | P: `divide-search-space-recursively` / C: — / S: `answer-idempotent-range-query` | RMQまたはmin Cartesian treeで各区間の最小位置Mを得る。leftが短ければ各l∈[L,M]についてPB上で最大r∈[M,R]を探し、rightが短ければ各rについて最小lを探す。cross数を加え、[L,M-1],[M+1,R]へ再帰する。 |
| [abc282-f](../../src/content/technique-inventory/shard-05/abc282-f.json) | 維持 | なし | 維持 | P: `answer-idempotent-range-query` / C: — / S: `maintain-interactive-query-protocol` | k=0…floor(log2N)、l=1…N-2^k+1の区間[l,l+2^k-1]を列挙しid[k][l]を保存して出力する。query[L,R]ではk=floor(log2(R-L+1))としてid[k][L]とid[k][R-2^k+1]を返す。 |
| [abc282-g](../../src/content/technique-inventory/shard-00/abc282-g.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: `design-minimal-sufficient-state`、`linearize-static-range-information` | i=1では各初期値pairに対応してdp[1][0][k][l]=1とする。各i,j layerの2D累積和から同方向rectangleをj+1、逆方向rectangleをjへ遷移させる。i=Nでk=l=0かつj=Kの値をP moduloで出力する。 |

### ABC283

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc283-e](../../src/content/technique-inventory/shard-03/abc283-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | flip1,flip2の4通りでrow1を検証できる初期状態を作る。row i-1,i,i+1のflipを使ってrow iの各cellに同値neighborがあるか調べ、validならcostへflip(i+1)を加えて遷移する。最後にrow Hも下neighborなしで検証し最小値、なければ-1。 |
| [abc283-ex](../../src/content/technique-inventory/shard-04/abc283-ex.json) | 維持 | なし | 維持 | P: `sum-affine-floors-by-euclid` / C: — / S: `reorder-counting-contributions` | 最小正のA=R+tMと最大≤Nからt rangeを求める。各kでm=2^{k+1}とし、shift後b=R+t_0Mについてfloor_sum(n,m,M,b+2^k)−floor_sum(n,m,M,b)をanswerへ足す。 |
| [abc283-f](../../src/content/technique-inventory/shard-05/abc283-f.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `design-associative-range-summary`、`reduce-geometry-to-algebraic-predicates` | 左→右sweepでvalue range [1,P_i)と(P_i,N]から対応するP_j+j/P_j-j extremumをqueryしD_iを更新後、P_i位置へ値を登録する。右→左でも対称な2caseを処理し、4候補のminを出力する。 |
| [abc283-g](../../src/content/technique-inventory/shard-04/abc283-g.json) | 維持 | なし | 維持 | P: `maintain-xor-linear-basis` / C: — / S: — | Aを上位bitpivotでbasisへ挿入し、全pivotが他rowから消えるようbackward/forward消去する。非零basisを数値昇順に並べ、q=L-1,…,R-1ごとにset bitのbasisをxorして出力する。 |

### ABC284

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc284-e](../../src/content/technique-inventory/shard-03/abc284-e.json) | 維持 | なし | 維持 | P: `enumerate-by-reversible-backtracking` / C: — / S: `enumerate-bounded-candidates-or-cases` | visited[1]=trueとしてDFS(1)を始め、各呼出しの冒頭でcountを1増やす。countが10^6なら終了flagを立てて全再帰から戻る。各neighborについて未訪問ならmarkして再帰し、戻ったらunmarkする。最後にcountを出力する。 |
| [abc284-ex](../../src/content/technique-inventory/shard-02/abc284-ex.json) | 維持 | なし | 維持 | P: `count-orbits-by-fixed-points` / C: — / S: `compute-in-modular-arithmetic`、`correct-overlap-by-inversion`、`formulate-combinatorial-coefficients` | Nの各integer partitionをcycle長列として列挙する。cycle数m、edge orbit数E、type内の置換数を求め、各c=0..KのF(c)へtypeCount·c^m·2^Eを加える。全typeの和へ(N!)^{-1}を掛けてBurnside平均を取り、答えをΣ_c(-1)^(K-c) C(K,c)F(c)で求める。P>Nの素数なので必要なfactorial inverseが存在する。 |
| [abc284-f](../../src/content/technique-inventory/shard-03/abc284-f.json) | 維持 | なし | 維持 | P: `build-prefix-match-state` / C: — / S: — | A=Tの前半、B=後半のreverseを作り、X=A+BとY=B+AのZ-arrayを計算する。i=0..Nについて、i=0なら第1条件、i=Nなら第2条件を空文字として扱い、それ以外はZ_X[2N-i]≥iかつZ_Y[N+i]≥N-iを確認する。最初の成立iでS=T[0,i)+T[N+i,2N)とiを出力し、なければ-1を出す。 |
| [abc284-g](../../src/content/technique-inventory/shard-02/abc284-g.json) · 所見あり | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: `compute-in-modular-arithmetic`、`formulate-combinatorial-coefficients`、`normalize-equivalent-states` | l=1..Nを走査し、falling=(N-1)P(l-1)とpow=N^(N-l)をmod Mで管理する。term=falling·pow·l(l-1)/2を加算し、最後に対称性のNを掛ける。三角数はlまたはl-1の偶数側を整数として2で割ってからmod Mへ落とし、modular inverseを使わない。 |

### ABC285

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc285-e](../../src/content/technique-inventory/shard-01/abc285-e.json) | 維持 | なし | 維持 | P: `design-prefix-partition-dp` / C: — / S: — | B_0=0とし、d≥1についてB_d=B_{d-1}+A_{floor((d+1)/2)}を前計算する。dp[i][j]を曜日iまで決めて末尾に平日がj日続く最大値とし、dp[1][0]=0から、次を平日にするdp[i+1][j+1]、休日にしてdp[i+1][0]へdp[i][j]+B_jを遷移する。全曜日後にmax_j(dp[N][j]+B_j)を答える。 |
| [abc285-ex](../../src/content/technique-inventory/shard-01/abc285-ex.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `decompose-by-prime-or-divisor`、`encode-counting-by-generating-function`、`formulate-combinatorial-coefficients` | D=max E_jまで係数arrayを持つ。初期F_0=(1-x)^(-N)はdelta arrayへN回prefix sumを施して作る。各iでvalue_i=∏_j F_i[E_j]を求め、(-1)^i C(N,i)value_iを答えへ加える。その後F_{i+1}=F_i/(1+x)をb_0=a_0, b_d=a_d-b_{d-1}で全次数更新する。すべてmod 10^9+7で行う。 |
| [abc285-f](../../src/content/technique-inventory/shard-01/abc285-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: — | 文字ごとに0/1のsegment treeを持つ。更新では旧文字の位置を0、新文字を1にする。質問では26個の区間頻度を取得し、左端から文字順にその頻度長のblockを割り当てて同じ文字が全長を占めるか検査する。さらに最小文字と最大文字の間の各文字について、区間頻度が全体頻度と一致すればYes、どれか崩れればNoとする。 |
| [abc285-g](../../src/content/technique-inventory/shard-05/abc285-g.json) | 維持 | なし | 維持 | P: `solve-flow-with-lower-bounds` / C: — / S: `model-max-flow-min-cut` | 文字1のcellを除き、偶奇で左右に分けて隣接辺を容量1で張る。source→左cellと右cell→sinkも容量1とし、文字2ならその辺のlower boundを1、?なら0にする。lower bound分を頂点需要へ移し、super sourceから需要超過頂点、供給超過頂点からsuper sinkへ辺を張り、sink→sourceへ十分大きい辺を追加する。最大流でsuper sourceからの全辺を飽和できればYes。 |

### ABC286

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc286-e](../../src/content/technique-inventory/shard-05/abc286-e.json) | 維持 | なし | 維持 | P: `compute-all-pairs-distance` / C: — / S: — | dist[i][i]=0,val[i][i]=A_i、direct flight i→jにはdist=1,val=A_i+A_jを設定し、他は到達不能とする。各k,i,jで到達可能なら候補(distance=dist[i][k]+dist[k][j], value=val[i][k]+val[k][j]-A_k)を作り、distance最小・同率value最大で更新する。queryは到達不能ならImpossible、否则pairを出力する。 |
| [abc286-ex](../../src/content/technique-inventory/shard-01/abc286-ex.json) | 維持 | なし | 維持 | P: `restrict-geometric-candidates-to-boundary` / C: — / S: — | まずS=Tや線分S–TがCの内部と交わらない場合を判定し、そのときはhypotで直線距離を返す。交わる場合はpolygon頂点とS,Tのconvex hullを求め、hull周上のedge長prefix sumを作る。SとTのindex間の周長を一方向でd、全周長をPとして、min(d,P-d)を出力する。 |
| [abc286-f](../../src/content/technique-inventory/shard-01/abc286-f.json) | 維持 | 現順維持 | 維持 | P: `solve-modular-constraints` / C: `exploit-modular-periodicity` / S: `maintain-interactive-query-protocol` | 長さ[4,9,5,7,11,13,17,19,23]の各連続blockをcycleにしたAを出力してflushする。Bを受け取り、各block先頭の移動量からN mod cを復元する。得た9合同式を中国剰余定理で統合し、[0,1338557220)の解を出力して直ちに終了する。 |
| [abc286-g](../../src/content/technique-inventory/shard-05/abc286-g.json) | 維持 | なし | 維持 | P: `construct-euler-trail-or-circuit` / C: — / S: `maintain-connectivity-components` | Sに属するedgeをmarkし、それ以外の全edgeでDSUをmergeする。各S edge(u,v)についてroot(u),root(v)のdegreeを1ずつ増やす。同じrootなら結果的に2増える。奇数degreeのroot数を数え、0または2ならYes、それ以外ならNoを出力する。 |

### ABC287

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc287-e](../../src/content/technique-inventory/shard-02/abc287-e.json) | 維持 | なし | 維持 | P: `index-shared-prefixes-with-trie` / C: — / S: — | 全indexをdepth 0のgroupとして再帰関数へ渡す。depth kで長さkの文字列へ答えkを設定し、それより長い文字列を次文字a..zでbucket分けする。bucket size 1ならそのindexの答えをk、size 2以上ならdepth k+1で再帰する。全indexの答えを入力順に出力する。 |
| [abc287-ex](../../src/content/technique-inventory/shard-03/abc287-ex.json) | 維持 | なし | 維持 | P: `compute-transitive-closure` / C: — / S: `accelerate-set-operations-with-bitsets`、`linearize-events` | 各direct edge a→bにbit reach[a][b]を立てる。k=1..Nについて、reach[i][k]が立つ全iでreach[i] \|= reach[k]をin-place実行する。その段階で未回答queryを走査し、k≥max(s,t)かつreach[s][t]ならanswer=kを記録する。最後まで未回答なら-1を出力する。 |
| [abc287-f](../../src/content/technique-inventory/shard-05/abc287-f.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: `design-resource-dp` | 任意のrootでtreeを親子化しpostorderに処理する。各vをdp[0][0]=1,dp[1][1]=1で初期化し、child uごとに現在arrayとdp_uを全組合せで畳み込む。indexはj+k-(b&&c)、root選択bitはbのままとして加算する。全treeのrootでdp[x][0]+dp[x][1]をx=1..Nについて出力する。 |
| [abc287-g](../../src/content/technique-inventory/shard-01/abc287-g.json) | 維持 | なし | 維持 | P: `maintain-weighted-prefix-statistics` / C: — / S: `compress-sparse-keys` | 初期scoreと全type-1更新値を圧縮し、Fenwick Xへ各座標のquota、Yへscore×quotaを入れる。score変更では旧座標からb_iを引き新座標へ足し、quota変更では差分を現在score座標へ反映する。type-3ではX全体がx未満なら-1。否则Fenwickのprefix lower_bound等で上位x枚の境界座標を求め、高score側のY合計と境界scoreで残りを計算する。 |

### ABC288

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc288-e](../../src/content/technique-inventory/shard-04/abc288-e.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | 各iについてcost(i,0)=C_iからjを増やしてsuffix minimumを作る。dp[i][j]をitem 1..iの選択を決め、そのうちj個を買う最小費用とし、dp[0][0]=0。item i+1を買うならdp[i+1][j+1]へA_{i+1}+cost(i+1,j)を加え、不要itemなら買わない遷移も行う。wishlist itemでは買わない遷移を禁止し、min_j dp[N][j]を答える。 |
| [abc288-ex](../../src/content/technique-inventory/shard-05/abc288-ex.json) | 維持 | なし | 維持 | P: `count-prefix-constrained-objects` / C: — / S: `correct-overlap-by-inversion`、`formulate-combinatorial-coefficients` | L=0..Nごとに上位bitからdigit DPし、既にM未満の要素数を状態として総XOR bitがXと一致する遷移を二項係数で加えf(L)を得る。odd(i,j),even(i,j)を、指定位置を奇数size/偶数sizeのj blockへ分割する個数として前計算し、h(x,y)=Σ_k even(x,k)·(M+1-y)_kも作る。Lを昇順に、f(L)からΣ_i C(L,i)Σ_{j≤min(L-1,i)}odd(i,j)g(j)h(L-i,j)を引いてdistinct ordered列数g(L)を得る。答えはΣ_{i=0..floor(N/2)} g(N-2i)/(N-2i)!·C(M+i,i)。 |
| [abc288-f](../../src/content/technique-inventory/shard-03/abc288-f.json) | 維持 | なし | 維持 | P: `design-prefix-partition-dp` / C: — / S: `compress-dp-sufficient-aggregates` | mod 998244353でdp_0=1、dp_1=d_1、prefix=dp_0+dp_1とする。i=2..Nについてdp_i=10dp_{i-1}+d_i·prefix(dp_0..dp_{i-1})を計算し、prefixへdp_iを加える。最後のdp_Nを出力する。 |
| [abc288-g](../../src/content/technique-inventory/shard-05/abc288-g.json) | 維持 | なし | 維持 | P: `factor-separable-linear-transform` / C: — / S: — | AをindexのN桁ternary配列とみなす。各axisのstride=3^axisについて、他桁が同じ3 entry (f0,f1,f2)を全blockから取り出し、(f1-f2, f0+f2-f1, f1-f0)へ同時更新する。全N軸の処理後、array[index]がその位置のbomb有無B_indexなので順に出力する。 |

### ABC289

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc289-e](../../src/content/technique-inventory/shard-05/abc289-e.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | distをN×Nの-1で初期化し、queueへ(1,N)を距離0で入れる。popした(u,v)についてadj[u]×adj[v]を走査し、色が異なる未訪問(x,y)へdist+1で遷移する。BFS終了後のdist[N][1]を出力し、未訪問なら-1とする。test caseごとに配列を初期化する。 |
| [abc289-ex](../../src/content/technique-inventory/shard-00/abc289-ex.json) | 維持 | 現順維持 | 維持 | P: `apply-formal-power-series-operations` / C: `compute-convolution-or-correlation`、`encode-counting-by-generating-function` / S: `compute-in-modular-arithmetic`、`formulate-combinatorial-coefficients` | factorial・inverse factorialと2の逆冪を前計算する。初期位置(X,Y,Z)について有効parityだけq,r配列へinverse factorial積を入れ、NTT convolutionのindex 2t（offset採用時はその補正位置）からp(t)を復元する。この処理を(A,B,C)でG、(0,0,0)でHに行う。HのFPS inverseを次数Tまで求め、Gと掛けたFのx^T係数を出力する。 |
| [abc289-f](../../src/content/technique-inventory/shard-03/abc289-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: — | まずs_x≡t_x、s_y≡t_y (mod 2)を確認する。a=bならt_xがs_xまたは2a-s_xか、c=dならyも同様かを調べ、singleton軸同士の要求parityが一致しなければNo。成立時、要求parityが奇なら(a,c)を1回出力して現在点を更新する。x差が正なら(a,c),(a+1,c)、負なら逆順を\|差\|/2回、yも(a,c),(a,c+1)または逆順で調整し、Yesと操作列を出す。 |
| [abc289-g](../../src/content/technique-inventory/shard-01/abc289-g.json) | 維持 | なし | 維持 | P: `optimize-by-line-envelope` / C: — / S: — | Bを降順sortし、i=1..Nについてline y=i·x+iB_iを傾き順に追加する。末尾2本と新線の交点順が非増加なら中央線を削除し、各線が最大になるx区間の左端を保持する。各C_jでは左端をbinary searchして該当lineを選び、i(C_j+B_i)を64bitで評価して入力順に出力する。queryをC順にsortしてpointer走査する実装でもよい。 |

### ABC290

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc290-e](../../src/content/technique-inventory/shard-01/abc290-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `maintain-monotone-window` | 全ての対称位置ペア数を長さ別の式で合計し、値ごとの昇順位置列Pを両端から走査してΣmin(P_i,N+1-P_j)を引き、悪いペア総数を得る。 |
| [abc290-ex](../../src/content/technique-inventory/shard-04/abc290-ex.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `design-resource-dp` | 偶数化後に全動物を係数順に走査し、dp[i][j][k]で左列Pへ入れた犬猫数を持って左右配置時の偏り費用を加え、指定個数状態の最小値を取る。 |
| [abc290-f](../../src/content/technique-inventory/shard-00/abc290-f.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: — | 最大Nまで二項係数を前計算し、各テストでC(2N-3,N-1)+N C(2N-4,N-1)を法998244353で計算する。 |
| [abc290-g](../../src/content/technique-inventory/shard-04/abc290-g.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `enumerate-bounded-candidates-or-cases` | h=0..Dを列挙し、初期サイズV_(D-h)がX以上なら差をV_(D-h-1)..V_0で貪欲に割って削除辺数を数え、親辺切断を含む最小値を取る。 |

### ABC291

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc291-e](../../src/content/technique-inventory/shard-02/abc291-e.json) | 維持 | なし | 維持 | P: `process-dag-in-topological-order` / C: — / S: — | 入次数0集合を用いるKahn法を行い、各段階で候補がちょうど一つか確認しながら順序Pを作り、A[P_i]=iを出力する。 |
| [abc291-ex](../../src/content/technique-inventory/shard-00/abc291-ex.json) | 維持 | なし | 維持 | P: `build-balanced-separator-decomposition` / C: — / S: — | 現在成分の重心を求めて分解木の根とし、重心を除いた各連結成分を再帰処理して得た根の親をその重心に設定する。 |
| [abc291-f](../../src/content/technique-inventory/shard-00/abc291-f.json) | 維持 | なし | 維持 | P: `relax-in-dependency-order` / C: — / S: — | dp0[i]とdp1[i]を前後から計算し、各kについて存在するi→jでi<k<jかつj-i≤Mを列挙してdp0[i]+1+dp1[j]の最小を取る。 |
| [abc291-g](../../src/content/technique-inventory/shard-05/abc291-g.json) | 維持 | なし | 維持 | P: `compute-convolution-or-correlation` / C: — / S: — | 各5bitについて補数化したA二周列と逆順B列を畳み込み、全shiftのOR個数N-c[N-1+j]を2^bit倍して得点へ加え、最大得点を選ぶ。 |

### ABC292

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc292-e](../../src/content/technique-inventory/shard-04/abc292-e.json) | 維持 | なし | 維持 | P: `compute-transitive-closure` / C: — / S: — | 各xから探索し、x以外の到達頂点数を合計して初期辺数Mを引く。 |
| [abc292-ex](../../src/content/technique-inventory/shard-02/abc292-ex.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: — | qを葉に置き、max_right相当の木上二分探索で最初のprefix和≥0のsを求め、prefix和から指定式のratingを計算する。 |
| [abc292-f](../../src/content/technique-inventory/shard-04/abc292-f.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: — | A≤Bへ並べ替え、候補辺長lごとにcosθ≤B/lとなる最小θを範囲内で求め、sinθ≤A/lを判定して実数二分探索する。 |
| [abc292-g](../../src/content/technique-inventory/shard-02/abc292-g.json) | 維持 | なし | 維持 | P: `design-interval-split-dp` / C: — / S: — | dp[i][j][k]を行区間[i,j)のk桁目以降で厳密増加させる数とし、数字lごとの先頭ブロック長を補助DPで列挙して下位桁dpを積み上げる。 |

### ABC293

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc293-e](../../src/content/technique-inventory/shard-00/abc293-e.json) | 維持 | なし | 維持 | P: `accelerate-fixed-linear-transition` / C: — / S: — | 遷移行列を法MでX乗し、初期ベクトル(0,1)へ作用させた第一成分を出力する。 |
| [abc293-ex](../../src/content/technique-inventory/shard-04/abc293-ex.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `aggregate-rooted-tree` | Kを固定し葉から(dp_v,f_v)を計算して全パス制約を検査する。判定の単調性でKを二分探索し、子値は最大数個だけ保持する。 |
| [abc293-f](../../src/content/technique-inventory/shard-00/abc293-f.json) | 維持 | なし | 維持 | P: `partition-integer-parameter-ranges` / C: — / S: — | d=2..floor(log2 N)+1を列挙し、d=2の候補N,N-1を処理する。d≥3は整数二分探索でbを求め、Nをb進除算して全桁0/1か検査し重複なく数える。 |
| [abc293-g](../../src/content/technique-inventory/shard-05/abc293-g.json) | 維持 | なし | 維持 | P: `schedule-range-query-updates` / C: — / S: — | 質問を左端blockと右端順でソートし、現在区間を伸縮しながらfreq[A_i]と三つ組数を差分更新して元の質問順へ答える。 |

### ABC294

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc294-e](../../src/content/technique-inventory/shard-05/abc294-e.json) | 維持 | なし | 維持 | P: `maintain-monotone-window` / C: — / S: — | 各列の現在run値と残長を持ち、d=min(rem1,rem2)だけ進め、値が等しければdを答えへ加え、残長0の側を次runへ移す。 |
| [abc294-ex](../../src/content/technique-inventory/shard-05/abc294-ex.json) | 維持 | なし | 維持 | P: `compute-subset-convolution` / C: — / S: `recur-by-edge-deletion-contraction` | 次数0,1,2頂点を係数付き再帰で消し、最小次数3以上になった小頂点グラフでは独立集合指示関数のsubset-convolution K乗を全頂点集合で評価する。 |
| [abc294-f](../../src/content/technique-inventory/shard-05/abc294-f.json) | 維持 | なし | 維持 | P: `optimize-ratio-by-parametric-search` / C: — / S: — | xを0..1で十分回二分探索し、各判定で青木側scoreをsort、各高橋側scoreについてlower_boundで和≥0のペア数を数え、K以上なら下限を上げる。 |
| [abc294-g](../../src/content/technique-inventory/shard-02/abc294-g.json) | 維持 | 現順維持 | 維持 | P: `flatten-tree-by-euler-order` / C: `answer-tree-ancestor-queries` / S: `maintain-weighted-prefix-statistics` | DFSで各辺の進入・退出時刻とLCA用tourを作る。重み変更はBITの+位置/-位置を差分更新し、距離質問は三頂点のprefix和とLCAから答える。 |

### ABC295

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc295-e](../../src/content/technique-inventory/shard-00/abc295-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `compute-in-modular-arithmetic`、`formulate-combinatorial-coefficients` | x=1..Mを走査し、既知の≥x個数を更新しながら、0の成功数が不足分以上となる確率を二項係数と冪で合計して期待値へ加える。 |
| [abc295-ex](../../src/content/technique-inventory/shard-00/abc295-ex.json) | 維持 | なし | 維持 | P: `apply-subset-zeta-mobius-transform` / C: — / S: `enumerate-subset-state-space` | 各行でdp[mask]を入力0/1/?制約に合わせて変換し、部分集合和を一回のzeta sweepで計算しつつ各prefix全1ケースを次maskへ加える。 |
| [abc295-f](../../src/content/technique-inventory/shard-02/abc295-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | F(X)について全開始位置rを列挙し、その位置にSを固定した正整数の単調なi番目構成を二分探索してX以下の個数を足し、F(R)-F(L-1)を返す。 |
| [abc295-g](../../src/content/technique-inventory/shard-00/abc295-g.json) | 維持 | なし | 維持 | P: `contract-monotone-paths-with-jump-pointers` / C: — / S: `bound-monotone-total-work`、`maintain-connectivity-components` | DSU各rootに成分最小頂点を持つ。追加クエリではv側成分からuを含む成分まで最小頂点と親を使って上りながらunionし、出力はfind(x)の最小頂点を返す。 |

### ABC296

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc296-e](../../src/content/technique-inventory/shard-04/abc296-e.json) | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: — | 全入次数を数え、0の頂点をqueueへ入れて取り出すたびA_xの入次数を減らす。削除されなかった頂点数を答える。 |
| [abc296-ex](../../src/content/technique-inventory/shard-00/abc296-ex.json) | 維持 | なし | 維持 | P: `design-frontier-profile-dp` / C: — / S: `design-minimal-sufficient-state` | 各マスで白/黒遷移を行い、上・左の黒ラベルをunionしてfrontier partitionをcanonicalizeする。孤立完成判定を入れ、最後に全必須黒が一成分の状態の追加数最小を取る。 |
| [abc296-f](../../src/content/technique-inventory/shard-00/abc296-f.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: `maintain-weighted-prefix-statistics` | A,Bをsortしてmultiset一致を確認し、重複があればYes。全相異ならFenwick tree等で両反転数parityを求め、一致するときだけYes。 |
| [abc296-g](../../src/content/technique-inventory/shard-01/abc296-g.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `linearize-events` | 左右端でpolygonを上下二chainへ分け、質問をx順にsortして各chainの辺pointerを進める。点と上下辺の外積符号を調べ、辺上ならON、間ならIN、外ならOUTとする。 |

### ABC297

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc297-e](../../src/content/technique-inventory/shard-00/abc297-e.json) | 維持 | なし | 維持 | P: `enumerate-frontier-best-first` / C: — / S: `model-and-compute-shortest-path` | heapへ0を入れ、最小値を取り出して直前確定値と異なる時だけ順位を進め、そのv+A_jを全j挿入する。0を含む順位補正後のK番目を返す。 |
| [abc297-ex](../../src/content/technique-inventory/shard-04/abc297-ex.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `apply-formal-power-series-operations` / S: `compute-convolution-or-correlation`、`compute-in-modular-arithmetic`、`correct-overlap-by-inversion` | 次数NまでG=Σ x^i/(1+x^i)とH=Σx^i/(1+x^i)^2を約数寄与で構成し、H/(1-G)^2のx^N係数をNTTとFPS逆元で求める。 |
| [abc297-f](../../src/content/technique-inventory/shard-05/abc297-f.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `compute-in-modular-arithmetic`、`formulate-combinatorial-coefficients`、`reorder-counting-contributions` | 二項係数を前計算し、全(a,b)と上下左右条件の16maskについて許可長方形面積を求め、包除符号付きC(area,K)から包含選択数を出し、総和をC(HW,K)で割る。 |
| [abc297-g](../../src/content/technique-inventory/shard-01/abc297-g.json) | 維持 | なし | 維持 | P: `classify-game-states` / C: — / S: — | 各山でr=A_i mod(L+R)、g=floor(r/L)を計算してxorし、0ならSecond、非0ならFirstとする。 |

### ABC298

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc298-e](../../src/content/technique-inventory/shard-05/abc298-e.json) | 維持 | なし | 維持 | P: `propagate-probability-distribution` / C: — / S: `compute-in-modular-arithmetic` | dp[i][j][turn]をi,j降順に計算し、高橋手番はk=1..P、青木手番はk=1..Qの遷移平均を法逆元で取る。dp[A][B][0]を出す。 |
| [abc298-ex](../../src/content/technique-inventory/shard-04/abc298-ex.json) | 維持 | なし | 維持 | P: `answer-tree-ancestor-queries` / C: — / S: `aggregate-rooted-tree` | 根付き木のdep,sz,subtree depth sum,祖先sz累積とLCA/LAを前計算する。各質問でMを求め、部分木距離和関数をR側とL側に適用して補集合と合算する。 |
| [abc298-f](../../src/content/technique-inventory/shard-04/abc298-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: — | 行和・列和とcell mapを作り、列を和降順にsortする。各行で先頭からrow+col-cellを更新し、cellが存在しない列に到達したらその候補を評価して停止する。 |
| [abc298-g](../../src/content/technique-inventory/shard-00/abc298-g.json) | 維持 | なし | 維持 | P: `design-interval-split-dp` / C: — / S: `enumerate-bounded-candidates-or-cases`、`linearize-static-range-information` | 2D prefix和で全長方形和候補aを列挙する。各aごとにdp[rect][m]を、m=1は和≥aなら和、m>1は全切線・片数分割のmax(dp1,dp2)最小として計算しdp[whole][T+1]-aを最小化する。 |

### ABC299

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc299-e](../../src/content/technique-inventory/shard-02/abc299-e.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `model-and-compute-shortest-path` | 全始点BFSでdistを前計算し、全条件のdist(p_i,v)<d_iを満たすvを白、残りを黒にする。黒が存在し各iで距離d_iの黒があればYesを出す。 |
| [abc299-ex](../../src/content/technique-inventory/shard-02/abc299-ex.json) · [指摘](#finding-abc299-ex) | 維持 | なし | **変更** | P: `solve-stochastic-recurrence` / C: — / S: `accelerate-fixed-linear-transition`、`compute-in-modular-arithmetic` | 残りrを0以下にする通常dice過程の期待回数とovershoot0..-5確率を遷移行列累乗で求める。それらから周期残差E_1..E_6の6元一次方程式を作って解き、R-6からの式へ代入する。 |
| [abc299-f](../../src/content/technique-inventory/shard-05/abc299-f.json) | 維持 | なし | 維持 | P: `design-order-preserving-dp` / C: — / S: — | 全位置i・文字cのnext σ(i,c)を前計算する。各xをq1としてdp[p][q]を初期化し、26文字で(dp[next(p,c)][next(q,c)])へ遷移し、σ(p,S_x)=xを満たす状態を答えに加える。 |
| [abc299-g](../../src/content/technique-inventory/shard-01/abc299-g.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `design-associative-range-summary` | 各値のlastを求め、未選択値の最小lastを境界rにする。segment tree/heapで現在位置..rの(value,index)最小を選び、位置を進め、その値の全出現を無効化してM回繰り返す。 |

### ABC300

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc300-e](../../src/content/technique-inventory/shard-04/abc300-e.json) · [指摘](#finding-abc300-e) | 維持 | なし | **変更** | P: `propagate-probability-distribution` / C: — / S: — | dp(N)=1、n>Nは0とし、未計算nを2..6倍先へ再帰して和/5を返す。dp(1)を法998244353で出力する。 |
| [abc300-ex](../../src/content/technique-inventory/shard-03/abc300-ex.json) | 維持 | なし | 維持 | P: `extract-rational-series-coefficient` / C: — / S: `accelerate-fixed-linear-transition`、`compute-convolution-or-correlation`、`enumerate-subset-state-space` | K-bonacciのP,Qを構成し、Nを下位bitから処理する。Q(-x)を掛けて分母を偶次数へ圧縮し、N bitが0なら分子偶部、1なら偶部＋奇部を選び、最後の定数係数比を出す。 |
| [abc300-f](../../src/content/technique-inventory/shard-04/abc300-f.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `linearize-static-range-information` | i=0..N-1ごとにendを[i,NM]で二分探索し、prefixX(end)-prefixX(i)≤Kとなる最大end-iを答えへ取る。 |
| [abc300-g](../../src/content/technique-inventory/shard-05/abc300-g.json) | 維持 | なし | 維持 | P: `split-enumeration-space` / C: — / S: `maintain-monotone-window` | P以下の素数を列挙し、各qについて小さい側のlistをq^e倍した値で拡張する。両listをsortし、一方昇順・他方pointer降順でuv≤Nのpair数を合計する。 |

### ABC301

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc301-e](../../src/content/technique-inventory/shard-02/abc301-e.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `model-and-compute-shortest-path` | S,G,菓子各点からBFSして距離行列を作る。dp[mask][i]をSからmask菓子を訪れiで終わる最短距離として遷移し、dp+dist(i,G)≤Tのpopcount最大を取る。 |
| [abc301-ex](../../src/content/technique-inventory/shard-00/abc301-ex.json) | 維持 | 現順維持 | 維持 | P: `identify-bridges-and-articulations` / C: `sweep-connectivity-by-kruskal-threshold` / S: `linearize-events`、`maintain-connectivity-components` | 辺を重み順に処理し、w未満辺をDSUで縮約する。同重み辺で作るcomponent graphへlowlinkとDFS順を構築し、queryのS,T連結閾値と対象edgeのbridge分離sideから距離増加有無を答える。 |
| [abc301-f](../../src/content/technique-inventory/shard-01/abc301-f.json) | 維持 | 現順維持 | 維持 | P: `build-finite-string-automaton` / C: `run-dp-on-finite-automaton` / S: `compute-in-modular-arithmetic`、`normalize-equivalent-states` | 固定prefixの大文字情報と29状態の個数DPを左から更新する。?の52通りを種類別係数で集約し、同一大文字2回→小文字→大文字という禁止部分列を完成させる遷移を除外する。最後に禁止部分列が未完成の全状態を足す。全52^qから引かない。 |
| [abc301-g](../../src/content/technique-inventory/shard-04/abc301-g.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `enumerate-bounded-candidates-or-cases` | 全person pairからx<0領域へ延びる相異なる3D直線をcanonical有理表現で作り各包含人数を数える。直線単独と全二直線交点x<0をmapで集約し、通過直線ごとの(cnt-1)最大をNから引く。 |

### ABC302

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc302-e](../../src/content/technique-inventory/shard-05/abc302-e.json) | 維持 | なし | 維持 | P: `bound-monotone-total-work` / C: — / S: — | 初期値を孤立頂点数Nとする。辺(u,v)追加時は追加前の隣接集合が空なら各端点について1減らして相互に挿入する。全辺削除時はvの各隣接uからvを消し、uが空になれば1増やし、最後にvを空にして必要なら1増やす。 |
| [abc302-ex](../../src/content/technique-inventory/shard-02/abc302-ex.json) | 維持 | なし | 維持 | P: `rollback-reversible-updates` / C: — / S: `augment-components-with-metadata` | 元の木を頂点1からDFSし、頂点iへ入ると値A_iとB_iを結ぶ辺をrollback DSUへ追加する。DSUは各成分の頂点数・辺数とΣmin(V,E)を持ち、その時点の総和をiの答えとして記録し、子の処理後に追加前までrollbackする。 |
| [abc302-f](../../src/content/technique-inventory/shard-03/abc302-f.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | N個の集合頂点とM個の要素頂点を作り、j∈S_iごとに無向辺を張る。要素1からBFSし、要素Mが未到達なら-1、到達距離をdとすればd/2-1を出力する。 |
| [abc302-g](../../src/content/technique-inventory/shard-03/abc302-g.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: `enumerate-bounded-candidates-or-cases` | 入力をsortした目標列と比較してCを作る。1,2,3,4の全24順列pを列挙し、pで前に置いた値から後に置いた値への誤配置数ΣC[p_a][p_b]を計算し、その最大値を最小swap回数として出力する。 |

### ABC303

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc303-e](../../src/content/technique-inventory/shard-02/abc303-e.json) | 維持 | なし | 維持 | P: `classify-tree-by-distance-residue` / C: — / S: — | 任意の次数1頂点を見つけ、その唯一の隣接頂点を始点に木をDFSまたはBFSする。距離が3の倍数である頂点の次数を答え列へ追加し、昇順にsortして出力する。 |
| [abc303-ex](../../src/content/technique-inventory/shard-03/abc303-ex.json) | 維持 | なし | 維持 | P: `encode-labeled-trees-by-prufer-code` / C: — / S: `compute-convolution-or-correlation`、`compute-in-modular-arithmetic`、`encode-counting-by-generating-function`、`formulate-combinatorial-coefficients` | factorialと逆factorialを前計算して次数N-2以下のFを作る。F^Nをbinary exponentiationとNTT畳み込みで計算し、各積をN-2次で打ち切る。最後にx^(N-2)の係数へ(N-2)!を掛ける。 |
| [abc303-f](../../src/content/technique-inventory/shard-02/abc303-f.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `sum-piecewise-linear-integer-ranges` | spellをtで整理し、suffixの最大dとprefixの最大tdを用意する。tの連続する境界区間を走査し、PとiDの交点で区間を分けてFの和を加える。Hへ初めて到達する区間では累積和がH以上となる最小iを二分探索し、必要ターン数を返す。 |
| [abc303-g](../../src/content/technique-inventory/shard-05/abc303-g.json) | 維持 | なし | 維持 | P: `evaluate-adversarial-game-value` / C: — / S: `prune-dominated-candidates-once` | dp[i][j]を残存区間[j,j+i)から手番の人が得る最適得点差とする。三行動に対応する(k,Z)=(i-1,0),(max(i-B,0),A),(max(i-D,0),C)ごとに、配列S(k,l)+dp[k,l]の幅i-k+1のsliding minimumをdequeで求め、S(i,j)-Z-minを候補として最大を取る。答えはdp[N][0]。 |

### ABC304

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc304-e](../../src/content/technique-inventory/shard-00/abc304-e.json) | 維持 | なし | 維持 | P: `maintain-connectivity-components` / C: — / S: — | 全M辺をDSUへunionする。各禁止pair(x_i,y_i)を代表元pair(min(root(x_i),root(y_i)),max(...))へ正規化してsetへ入れる。各query(p,q)も同様に正規化し、setに含まれればNo、含まれなければYesを出力する。 |
| [abc304-ex](../../src/content/technique-inventory/shard-03/abc304-ex.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `process-dag-in-topological-order` | まずtopological sortし、cycleならNoとする。逆順に各辺のR上界を伝播し、L_v≤R_vを確認する。position iを1から進め、全predecessor配置済みかつL_v≤iの頂点をmin-heapへ入れ、R最小を取り出してP_v=iとする。候補なしまたはi>R_vならNo、全配置できればYesとPを出力する。 |
| [abc304-f](../../src/content/technique-inventory/shard-03/abc304-f.json) | 維持 | なし | 維持 | P: `invert-divisor-lattice-by-mobius` / C: — / S: `compute-in-modular-arithmetic`、`decompose-by-prime-or-divisor` | Nの約数tを昇順に列挙する。各tについて全剰余類を調べ、欠勤を選べる類の数pからA_t=2^pを求める。M_t=A_t-Σ_{s\|t,s<t}M_sをmod 998244353で計算し、t≠NのM_tを合計する。 |
| [abc304-g](../../src/content/technique-inventory/shard-04/abc304-g.json) | 維持 | なし | 維持 | P: `solve-xor-threshold-matching` / C: — / S: `divide-search-space-recursively`、`prove-and-search-threshold` | f_d(C,x)をC内、g_d(C,D,x)をCとD間でxor≥xとなる最大pair数として、各列をbit dの0群・1群へ分割する。d=-1ではそれぞれfloor(\|C\|/2)、min(\|C\|,\|D\|)とし、x_dに応じて確定するcross pair数と下位bitのf/gを公式の漸化式で合成する。f_29(A,x)がfloor((N+1)/2)以上かを判定してxを二分探索する。 |

### ABC305

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc305-e](../../src/content/technique-inventory/shard-05/abc305-e.json) | 維持 | なし | 維持 | P: `enumerate-frontier-best-first` / C: — / S: `model-and-compute-shortest-path` | dを−1で初期化し、各(p_i,h_i)でd[p_i]をh_iにして最大heapへ入れる。最大の(x,v)を取り出し、古い候補なら捨てる。x>0なら各隣接uへx−1を緩和し、最後にd[v]≥0の頂点を昇順で列挙する。 |
| [abc305-ex](../../src/content/technique-inventory/shard-03/abc305-ex.json) · [指摘](#finding-abc305-ex) | 維持 | なし | **変更** | P: `optimize-by-lagrangian-relaxation` / C: — / S: `design-interval-split-dp`、`prove-greedy-order` | affine-composition orderingからsegment-cost Monge性を導き、partition shortest pathをLagrangian relaxation/Aliens DPとconvex dual searchで解く。 |
| [abc305-f](../../src/content/technique-inventory/shard-01/abc305-f.json) | 維持 | 現順維持 | 維持 | P: `select-state-graph-search` / C: `maintain-interactive-query-protocol` / S: `bound-monotone-total-work` | visited[1]=true、DFS stack=[1]で始める。毎回受け取った隣接一覧から未訪問uがあればvisitedにしてstackへ積みuを出力し、無ければstack先頭を捨てて新しい先頭の親を出力する。Nへ移動したらjudgeのOKを受けて直ちに終了する。 |
| [abc305-g](../../src/content/technique-inventory/shard-05/abc305-g.json) | 維持 | 現順維持 | 維持 | P: `build-finite-string-automaton` / C: `run-dp-on-finite-automaton` / S: `accelerate-fixed-linear-transition` | a,bからなる長さ0..5の安全な文字列を状態として列挙する。各状態へaまたはbを足し、末尾に禁止列があれば捨て、なければ末尾5文字以下の次状態へ向けて遷移行列の要素を1増やす。空状態の単位ベクトルへ行列のN乗を作用させ、全状態成分を合計する。 |

### ABC306

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc306-e](../../src/content/technique-inventory/shard-05/abc306-e.json) | 維持 | なし | 維持 | P: `maintain-ordered-set-statistics` / C: — / S: — | dynamic top-K aggregateをorder-statistic boundaryで二分したmultisetsとrunning sumにより維持する。 |
| [abc306-ex](../../src/content/technique-inventory/shard-01/abc306-ex.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `enumerate-subset-state-space`、`process-dag-in-topological-order` | comparison outcomesのrealisabilityをcontracted DAG countingへ写し、minimal classesのsubset inclusion-exclusionを3^N bit DPで評価する。 |
| [abc306-f](../../src/content/technique-inventory/shard-05/abc306-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `compress-sparse-keys`、`linearize-events`、`maintain-weighted-prefix-statistics` | rank-sum definitionをconstant self ranksとcross inversionsへ分解し、set index逆走査のFenwick prefix countsで集計する。 |
| [abc306-g](../../src/content/technique-inventory/shard-02/abc306-g.json) | 維持 | なし | 維持 | P: `compute-directed-walk-period` / C: — / S: `condense-and-order-directed-graph`、`reduce-integer-structure-by-gcd` | strongly connected directed graphのperiodをDFS potentialsに対するedge discrepanciesのgcdとして計算し、target lengthのprime supportと照合する。 |

### ABC307

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc307-e](../../src/content/technique-inventory/shard-01/abc307-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `normalize-equivalent-states` | cyclic coloringをanchor colorで切り開き、color symmetryでtwo-state linear DPへ圧縮する。 |
| [abc307-ex](../../src/content/technique-inventory/shard-02/abc307-ex.json) | 維持 | なし | 維持 | P: `compute-convolution-or-correlation` / C: — / S: — | wildcard pattern matchingをexact nonnegative mismatch polynomialへ符号化し、全cyclic display alignmentsをNTT cross-correlationsで評価する。 |
| [abc307-f](../../src/content/technique-inventory/shard-05/abc307-f.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: `bound-monotone-total-work`、`enumerate-frontier-best-first` | 日ごとにthresholdが変わるrepeated multi-source shortest pathsを、persistent frontierとday-local capped Dijkstraへ分解してamortizeする。 |
| [abc307-g](../../src/content/technique-inventory/shard-00/abc307-g.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: `linearize-static-range-information` | adjacent mass transfersをprefix imbalanceのL1 costへ変換し、balanced targetのhigh-value positionsをcount DPで最適配置する。 |

### ABC308

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc308-e](../../src/content/technique-inventory/shard-04/abc308-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | ordered triple sumをmiddle-index sweepとsmall-alphabet frequency aggregationへ分解する。 |
| [abc308-ex](../../src/content/technique-inventory/shard-03/abc308-ex.json) | 維持 | なし | 維持 | P: `find-rooted-cycle-by-shortest-path-branches` / C: — / S: `build-shortest-path-certificate` | cycle-with-tail subgraph optimizationをattachment vertexごとに分け、shortest-path-tree branch crossingによるminimum rooted cycle oracleで解く。 |
| [abc308-f](../../src/content/technique-inventory/shard-02/abc308-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `linearize-events` | nested threshold eligibilityを持つmaximum-discount matchingをsorted sweepとmax-priority greedyで解く。 |
| [abc308-g](../../src/content/technique-inventory/shard-02/abc308-g.json) | 維持 | なし | 維持 | P: `maintain-ordered-set-statistics` / C: — / S: — | minimum XOR pairをnumeric-order adjacencyへ局所化し、dynamic ordered multisetのneighbor-edge aggregateとして維持する。 |

### ABC309

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc309-e](../../src/content/technique-inventory/shard-01/abc309-e.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: `design-minimal-sufficient-state` | 全 m_v を −1 で初期化して契約を最大集約する。1 番から N 番へ、根では dp_1=m_1、他では dp_i=max(m_i,dp_{p_i}−1) を計算し、dp_i≥0 の個数を数える。 |
| [abc309-ex](../../src/content/technique-inventory/shard-02/abc309-ex.json) | 維持 | なし | 維持 | P: `remove-boundaries-by-reflection` / C: — / S: `compute-convolution-or-correlation` | 長さ D=2M+2 の f を作り、各開始 A_i の係数を +1、D−A_i を −1 とする。環 Z[x]/(x^D−1) で g=x^{-1}+1+x を N−1 乗し f と畳み込み、B_i の係数を合計する。各積は NTT 後に次数を D 周期で折り返す。 |
| [abc309-f](../../src/content/technique-inventory/shard-02/abc309-f.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `compress-sparse-keys`、`design-associative-range-summary` | 各箱の辺を昇順化し、h 昇順で同じ h を一群にする。群内の各 (w,d) についてセグメント木の w 未満の最小値が d 未満なら Yes。全照会後に各 w へ d の min 更新を行い、最後まで無ければ No とする。 |
| [abc309-g](../../src/content/technique-inventory/shard-02/abc309-g.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `design-frontier-profile-dp`、`enumerate-subset-state-space`、`formulate-combinatorial-coefficients` | dp[i][k][mask] を位置 1..i までで k 組を固定し、i−X より大きく i+X より小さい使用値を mask で表す個数とする。位置 i+1 を固定しない遷移と、未使用の近傍値 l を割り当てる遷移を行う。最後に全状態へ (N−k)!(−1)^k を掛けて総和する。 |

### ABC310

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc310-e](../../src/content/technique-inventory/shard-04/abc310-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | zero,one を直前位置で終わる部分文字列の結果別個数とする。b=0 なら (zero,one)=(1,zero+one)、b=1 なら (zero,one)=(one,zero+1) と更新し、毎回 one を答えへ加える。 |
| [abc310-ex](../../src/content/technique-inventory/shard-05/abc310-ex.json) | 維持 | なし | 維持 | P: `stabilize-unbounded-knapsack-by-best-density` / C: — / S: `design-resource-dp` | dp[len][balance] で長さ 2L 以下の基本列の最大ダメージを O(NL²) で求め、長さごとの最大値 d_len をコンボとする。効率 d_z/z 最大の z を選び、例外コンボ総コスト O(L²) までの無制限 knapsack で最大ダメージ M_x を O(L³) で計算する。各 x に不足分を z コンボで補った総手数の最小を取る。 |
| [abc310-f](../../src/content/technique-inventory/shard-05/abc310-f.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `compute-in-modular-arithmetic`、`propagate-probability-distribution` | 初期 mask は bit0 のみ。各 i で全 mask と x=1..min(A_i,10) を走査し、next=mask\|((mask<<x)&((1<<11)−1)) へ dp/A_i を加える。A_i>10 なら mask 自身へ (A_i−10)dp/A_i を加え、最後に bit10 が立つ確率を合計する。 |
| [abc310-g](../../src/content/technique-inventory/shard-02/abc310-g.json) · [指摘](#finding-abc310-g) | 維持 | なし | **変更** | P: `jump-deterministic-transition` / C: — / S: — | 一回操作後の分布 b を作る。現在の写像 S=A、区間和用ベクトル x=b とし、K の bit を下から処理する。偶数倍では x←x+Sx、S←S∘S とし、奇数分を答え側へ写像合成付きで取り込む。得た K 状態の総和を法上の K で割る。 |

### ABC311

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc311-e](../../src/content/technique-inventory/shard-00/abc311-e.json) · 所見あり | 維持 | 現順維持 | 維持 | P: `design-grid-table-dp` / C: `design-minimal-sufficient-state` / S: — | 穴を boolean grid に記録し、上と左に 0 の番兵行列を置く。行優先で、穴なら 0、そうでなければ三近傍の min+1 を計算して 64 bit の答えへ加算する。 |
| [abc311-ex](../../src/content/technique-inventory/shard-05/abc311-ex.json) | 維持 | なし | 維持 | P: `pass-resource-dp-through-heavy-recursion` / C: — / S: `design-resource-dp` | 部分木サイズから heavy child を決める。dfs(c,dp) で c を残す/削る場合の配列を O(X) で作り、heavy child は共有できる一方の経路を一回、各 light child は必要な二状態へ再帰させる。根1で全 heavy path を構成した後、各 heavy path 根から初期配列を渡すことで、その path 上の全 v の F(v) を同時に回収する。 |
| [abc311-f](../../src/content/technique-inventory/shard-04/abc311-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `factor-and-accelerate-transitions` | 入力の # から下・右下へ強制黒を伝播する。c=−M+1..N−1 を走査し、境界 j ごとの dp を前段の suffix sum から作る。対角線外の状態と、強制黒より右へ境界を置いて矛盾する状態を 0 にし、最終段を合計する。 |
| [abc311-g](../../src/content/technique-inventory/shard-05/abc311-g.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `linearize-static-range-information`、`maintain-connectivity-components` | 二次元累積和を作る。m=1..300 ごとに各行を下端として列別連続高さ H を更新する。H の降順 bucket で列を activate し、連結リストまたは DSU で左右成分を併合するたび、その成分幅×高さ H_j の長方形和を取得して m 倍し最大値を更新する。 |

### ABC312

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc312-e](../../src/content/technique-inventory/shard-03/abc312-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: — | 各直方体 i の半開整数領域 [x1,x2)×[y1,y2)×[z1,z2) の voxel を owner=i で塗る。全 voxel から正方向三近傍を見て、所有者が異なり両方存在すれば min/max のペアを収集する。重複除去後、各ペアの両頂点を加算する。 |
| [abc312-ex](../../src/content/technique-inventory/shard-02/abc312-ex.json) | 維持 | なし | 維持 | P: `normalize-string-to-primitive-period` / C: — / S: `bound-monotone-total-work`、`build-prefix-match-state` | 各 S_i に Z algorithm を行い最小周期 p_i と T_i=S_i[0:p_i]、指数 n_i=\|S_i\|/p_i を得る。T ごとに使用済み指数 set と next[n] を持ち、next[n],next[n]+n,…から最初の未使用 m を選ぶ。m を登録し next[n]=m+n、答え k_i=m/n_i とする。 |
| [abc312-f](../../src/content/technique-inventory/shard-05/abc312-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: — | 三種類を X 降順に sort し、type0 の prefix sum を作る。s=0 から type1/type2 側を伸ばし、capacity があれば次の type1 の満足度を加えて枠を1減らし、なければ次の type2 を取り枠を増やす。各 s≤M で value+prefix0[M−s] の最大を取る。 |
| [abc312-g](../../src/content/technique-inventory/shard-03/abc312-g.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | 木を任意根で DFS して subtree size を求める。各 v で隣接方向ごとのサイズを作り、ways[0]=1 の三要素選択 DP を更新して ways[3] を答えへ加える。 |

### ABC313

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc313-e](../../src/content/technique-inventory/shard-04/abc313-e.json) | 維持 | なし | 維持 | P: `evolve-run-length-encoded-state` / C: — / S: — | 隣接する二文字がともに 2..9 なら −1。そうでなければ RLE または同値な右からの DP で、現在の suffix が消える操作回数を保持し、非1数字 x を越えるたび左側 1-run の存続長を (x−1) 倍分増やす。各 run の消滅回数を法上で加えて答える。 |
| [abc313-ex](../../src/content/technique-inventory/shard-04/abc313-ex.json) · [指摘](#finding-abc313-ex) | 維持 | なし | **変更** | P: `design-minimal-sufficient-state` / C: — / S: `formulate-combinatorial-coefficients`、`solve-bipartite-matching` | A,B を昇順 sort する。dp[i][j] を小さい A を i 人挿入し path fragment が j 個ある部分構造数とし、新要素の置き方三種を組合せ係数付きで遷移する。k=i+j で現在確定した C の個数を追い、新しく確定する区間に B_t>A_{i+1} が成り立たない遷移を捨てる。dp[N][1] に対応する完成数を答える。 |
| [abc313-f](../../src/content/technique-inventory/shard-04/abc313-f.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: `enumerate-subset-state-space`、`reorder-counting-contributions` | X=Y の機械による確定反転を有利なカードだけ適用し基準和を作る。D_i=\|A_i−B_i\|/2 と P,Q を定義し、Q-Q の隣接利益を確定する。\|P\|≤\|Q\| なら全 P subset に対し −ΣD_P+ΣD_{隣接Q} を評価し、逆なら Q-mask DP で各 P の選択とその隣接 mask の OR を遷移する。最大増分を基準へ足す。 |
| [abc313-g](../../src/content/technique-inventory/shard-04/abc313-g.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: `sum-affine-floors-by-euclid` | a を昇順 sort し prefix sum を作る。x の区間 [a_k,a_{k+1}) では s(x)=prefix[k]+(N−k)x と書く。各区間で floor(s(x)/N) の総和を ACL floor_sum へ渡し、y=0 の一通りも足す。最小値以前の重複する正規形は公式の境界どおり補正する。 |

### ABC314

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc314-e](../../src/content/technique-inventory/shard-04/abc314-e.json) | 維持 | なし | 維持 | P: `optimize-stochastic-actions` / C: — / S: — | 各 roulette から0を除き cost_i=C_i P_i/(P_i−Z_i) を作る。e[p]=0 (p≥M) とし p=M−1..0 の順に、全 roulette の cost_i+非0出目に対する e[min(M,p+s)] の平均を計算し最小を e[p] とする。e[0] を出力する。 |
| [abc314-ex](../../src/content/technique-inventory/shard-00/abc314-ex.json) | 維持 | なし | 維持 | P: `optimize-univariate-convex-function` / C: — / S: `reduce-geometry-to-algebraic-predicates` | dist(point,segment) を内積射影と clamp で実装し、eval(x,y)=max_i dist とする。十分広い座標区間で、固定 x に対し y を約100回三分探索して F(x) を返す。さらに x も約100回三分探索し、最後の近傍での最小 eval を出力する。 |
| [abc314-f](../../src/content/technique-inventory/shard-02/abc314-f.json) | 維持 | なし | 維持 | P: `build-component-merge-tree` / C: — / S: `aggregate-rooted-tree`、`augment-components-with-metadata`、`compute-in-modular-arithmetic`、`reorder-counting-contributions` | 最初の N 葉を各一人チームとする。各試合で p,q の DSU representative に対応する現チーム節点 u,v を得て、新節点 w を作り u,v を子にし、辺重み size(u)/(size(u)+size(v)) 等を設定して union する。最後の根から DFS し累積辺和を各葉へ出力する。 |
| [abc314-g](../../src/content/technique-inventory/shard-03/abc314-g.json) · 所見あり | 維持 | なし | 維持 | P: `maintain-ordered-set-statistics` / C: — / S: `maintain-monotone-window`、`prove-greedy-order` | 初期 C_j=0 を全て未所持側 T に入れる。monster i を追加するたび type b の旧 C を属する multiset から削除し C_b+=A_i で再挿入する。T の和が H 以上なら最大を所持側 S へ、S の最小を T に戻せる間は戻し、順序逆転も交換して正規化する。L_i=M−\|T\| を記録し、K=0..M の最大 i を求める。 |

### ABC315

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc315-e](../../src/content/technique-inventory/shard-05/abc315-e.json) | 維持 | なし | 維持 | P: `process-dag-in-topological-order` / C: — / S: — | visited[1]=true から DFS/BFS で依存辺をたどる。DFS なら各子の探索後に v を answer へ push し、最後に根1だけを除いた列をそのまま出力する。再帰を避けるなら enter/exit を持つ明示 stack で postorder を作る。 |
| [abc315-ex](../../src/content/technique-inventory/shard-02/abc315-ex.json) | 維持 | なし | 維持 | P: `compute-online-relaxed-convolution` / C: — / S: `compute-convolution-or-correlation`、`encode-counting-by-generating-function` | F_0=1 を relaxed convolution 構造へ追加する。n=0..N−1 で現在返された G_n を prefix sum へ足し、F_{n+1}=A_{n+1}prefixG を計算して構造へ追加する。構造内部では時点ごとの lowbit/2冪区間に応じ、完成 block と既知 block の F/G polynomial product を NTT して該当する未来係数へ蓄積する。 |
| [abc315-f](../../src/content/technique-inventory/shard-01/abc315-f.json) · 所見あり | 維持 | なし | 維持 | P: `design-order-preserving-dp` / C: — / S: `reduce-geometry-to-algebraic-predicates` | 座標制約から得た既知上界を超える最小 2^{C−1} を基に CMAX を取る。dp[1][0]=0 とし、各 i,c から j=i+1..min(N,i+CMAX−c+1) へ距離(i,j)を加えて chmin する。最後に dp[N][c]+(c=0?0:2^{c−1}) の最小を出す。 |
| [abc315-g](../../src/content/technique-inventory/shard-05/abc315-g.json) | 維持 | なし | 維持 | P: `characterize-integer-solvability` / C: — / S: — | g,u,v=extgcd(B,C) を一度求める。i=1..N で Y=X−Ai とし、Y≤0 または Y%g≠0 なら skip。基準 j0=u(Y/g), k0=v(Y/g) を作り、二変数の上下限制約から signed floor_div/ceil_div で t の下限・上限を求め、その交差長を答えへ加える。 |

### ABC317

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc317-e](../../src/content/technique-inventory/shard-02/abc317-e.json) | 維持 | なし | 維持 | P: `precompute-directional-grid-effects` / C: — / S: `select-state-graph-search` | viewed を false で作り、各行を左右から、各列を上下から走査する。対応方向を向く人の後で blocker までの . を viewed=true にする。次に #・人・viewed を禁止として S から四近傍 BFS し、G の距離または −1 を出す。 |
| [abc317-ex](../../src/content/technique-inventory/shard-03/abc317-ex.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `apply-formal-power-series-operations`、`compute-convolution-or-correlation` / S: `divide-search-space-recursively` | 次数 K で打ち切った polynomial を使う。product tree で局所遷移行列を掛け、戻り辺を使わない 1→n の F_n と G_N=ΣD_nF_n を求める。最終生成関数 H=F_N·inv(1−xG_N) mod x^{K+1} を NTT/FPS inverse で計算し [x^K]H を出す。 |
| [abc317-f](../../src/content/technique-inventory/shard-05/abc317-f.json) | 維持 | なし | 維持 | P: `count-prefix-constrained-objects` / C: — / S: `correct-overlap-by-inversion` | dp[lessEq flags 3個][r1][r2][r3] を0 bitから始める。n=0..59 で xor が0となる bit triple を列挙し、N の n bit と旧下位比較から新 flag を更新、r_i←r_i+b_i2^n mod A_i とする。60桁後に全 x_i≤N・剰余0の状態を取り、x_i=0 を含む組を包除または直接補正して正整数だけにする。 |
| [abc317-g](../../src/content/technique-inventory/shard-02/abc317-g.json) | 維持 | 現順維持 | 維持 | P: `solve-bipartite-matching` / C: `characterize-bipartite-feasibility-by-hall` / S: — | 行 N 頂点と値 N 頂点の二部多重グラフを作る。col=1..M ごとに Hopcroft–Karp または最大流でサイズ N の matching を求め、matched value を各行の col へ出力し、対応する edge occurrence を graph から削除する。 |

### ABC318

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc318-e](../../src/content/technique-inventory/shard-01/abc318-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | 初期 right を全頻度、left=0,total=0 とする。j を左から処理する際、まず A_j を right から一つ外し total を差分更新する。答えへ total−left[A_j]right[A_j] を加え、次の中央に備えて A_j を left へ一つ加えて total を再度差分更新する。 |
| [abc318-ex](../../src/content/technique-inventory/shard-01/abc318-ex.json) | 維持 | 現順維持 | 維持 | P: `count-labeled-structures-by-components` / C: `apply-formal-power-series-operations` / S: `compute-convolution-or-correlation`、`encode-counting-by-generating-function` | mod 上で f_i=1/i² (1≤i≤N) を作り、FPS E=exp(f) mod x^{N+1} を Newton 法で求める。AliceのみAC/BobのみAC/両者AC の重複を対称性と1-cycleのみのケースで整理し、公式式 N!²(1−2[x^N]E)+N! を計算する。 |
| [abc318-f](../../src/content/technique-inventory/shard-01/abc318-f.json) | 維持 | なし | 維持 | P: `partition-at-critical-integer-boundaries` / C: — / S: `characterize-bipartite-feasibility-by-hall`、`prove-greedy-order` | S={X_i+L_j, X_i−L_j−1} を sort unique する。各連続境界について代表 k（公式の端点規約では右端 S_t）を選び、\|X_i−k\| を sort して全 Y_i≤L_i か検査する。有効なら前境界+1..現境界の整数個数を答えへ加える。外側無限区間は十分遠方で必ず失敗する。 |
| [abc318-g](../../src/content/technique-inventory/shard-05/abc318-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: — | 2N+2 頂点の network を作る。各 v に v_in→v_out 容量1（B は source から B_out へ容量2）、各無向辺を両方向の out→in 容量1で張る。A_out,C_out から sink へ容量1を張り、max flow が2なら Yes、未満なら No とする。 |

### ABC319

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc319-e](../../src/content/technique-inventory/shard-01/abc319-e.json) | 維持 | なし | 維持 | P: `exploit-modular-periodicity` / C: — / S: — | L=840とする。各r=0..L-1についてtime=r+Xから始め、i=1..N-1でtime=((time+P_i-1)/P_i)P_i+T_i、最後にYを加え、elapsed[r]=time-rを保存する。各query qにはq+elapsed[q%L]を64bitで出力する。 |
| [abc319-f](../../src/content/technique-inventory/shard-04/abc319-f.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `enumerate-frontier-best-first`、`prove-greedy-order` | medicineへ0..P-1のbitを付け、dp[0]をstrength 1からmedicineを跨がず倒せるenemyをすべて倒したclosureで初期化する。各reachable maskについて未使用medicine iを候補にし、そのvertexが現在の探索済み領域から到達可能ならstrengthをg_i倍してiを追加する。predecessorの到達・討伐状態を引き継ぎ、threshold以下のreachable enemyをpriority queue等で繰り返し倒して新しいclosureを作り、dp[next]を最大化する。全medicine maskを処理後、全enemyを倒した状態があればYes。 |
| [abc319-g](../../src/content/technique-inventory/shard-02/abc319-g.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: `bound-monotone-total-work`、`maintain-ordered-set-statistics`、`subtract-exception-transitions` | 禁止edgeを判定できるsetと各頂点の禁止adjacency listを作る。未訪問ordered set Lに2..Nを入れ、queueを1から開始する。vをpopするたびLをiterator走査し、(v,u)が禁止でなければdist[u]=dist[v]+1としてqueueへ入れLからerase、禁止なら残す。距離順に頂点をbucket化し、dp[1]=1から、v∈layer dへsum[d-1]−Σ_{u∈forbidden[v],dist[u]=d-1}dp[u]を加え、dp[N]または未到達-1を出力する。 |

### ABC320

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc320-e](../../src/content/technique-inventory/shard-04/abc320-e.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `enumerate-frontier-best-first`、`maintain-ordered-set-statistics` | available setを{1..N}、return min-heapを空、answerを0で初期化する。各(T_i,W_i,S_i)の前にheap先頭のreturnTime≤T_iを全てpopしてpersonをavailableへ戻す。availableが非空なら最小personをeraseしanswerへW_iを加え、(T_i+S_i,person)をheapへpushする。最後に全answerを出力する。 |
| [abc320-f](../../src/content/technique-inventory/shard-01/abc320-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | X_0=0とし、初期状態は往路fuel H、帰宅時fuel k=0..Hを費用0で許す。位置iへ距離d進むたび、往路はj-d≥0、復路逆算はk+d≤Hへ移す。station i<Nでは未使用、往路使用でjをmin(j+F_i,H)、復路使用で「給油後fuel」から可能な給油前kを逆算する3遷移を行い、使用時だけP_iを加える。X_Nまで進めた後、min_j dp_N[j][j]を答え、なければ-1。 |
| [abc320-g](../../src/content/technique-inventory/shard-05/abc320-g.json) | 維持 | なし | 維持 | P: `solve-bipartite-matching` / C: — / S: `compress-sparse-keys`、`exploit-modular-periodicity`、`prove-and-search-threshold`、`prove-greedy-order` | 各D=0..9について、各reelの周期文字列を繰り返した最初のN個のD出現時刻を列挙し、全候補時刻を圧縮する。deadline Tの判定ではsource→reel、T以下の候補をreel→time、time→sinkへ容量1のedgeを張り、max flowがNならtrueとする。候補時刻列上でbinary searchして最小Tを求め、10 digitの最小値を出力し、どれも不可なら-1。 |

### ABC321

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc321-e](../../src/content/technique-inventory/shard-00/abc321-e.json) | 維持 | なし | 維持 | P: `count-implicit-binary-tree-layers` / C: — / S: — | overflowを避けるcountDesc(v,d)を用意し、まずanswer=countDesc(X,K)とする。child=X,z=floor(X/2),u=1からz=0またはu>Kまで上る。d=K-uが0なら1を加え、正ならcountDesc(z,d)-countDesc(child,d-1)を加える。その後child=z,z=floor(z/2)へ更新し、各testのanswerを出力する。 |
| [abc321-f](../../src/content/technique-inventory/shard-02/abc321-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | dp[0]=1、他0で始める。+xではs=K..xの降順にdp[s]+=dp[s-x]、-xではs=x..Kの昇順にdp[s]-=dp[s-x]を行い、mod 998244353で正規化する。各operation後のdp[K]を出力する。x>Kなら保持範囲の係数は変化しない。 |
| [abc321-g](../../src/content/technique-inventory/shard-02/abc321-g.json) | 維持 | なし | 維持 | P: `count-labeled-structures-by-components` / C: — / S: `compute-in-modular-arithmetic`、`enumerate-subset-state-space`、`formulate-combinatorial-coefficients`、`reorder-counting-contributions` | 各partのred/blue端子数を数え、subset sumでr[S],b[S]を作る。等しいときf[S]=r[S]!、否则0。popcount昇順に、Sの最下位bit aを固定してproper submask T⊂S,a∈Tを列挙し、g[S]=f[S]-Σg[T]f[S\T]を求める。各非空Sでm=r[S]=b[S]ならg[S](M-m)!/M!をanswerへ加え、mod 998244353で出力する。 |

### ABC322

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc322-e](../../src/content/technique-inventory/shard-05/abc322-e.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: `design-minimal-sufficient-state` | state数D=(P+1)^K、dp[0-vector]=0、他INFで始める。各planについてnext=dpを作り、全stateをdecodeして各成分をPでcapしながらA_iを加えたtoをencodeし、next[to]=min(next[to],dp[state]+C_i)とする。dp=nextを繰り返し、全digit PのgoalがINFなら-1、否则そのcostを出力する。 |
| [abc322-f](../../src/content/technique-inventory/shard-01/abc322-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: `design-associative-range-summary` | 各文字をlen=1で、対応bitのprefix=suffix=best=1、反対bitを0としてleaf化する。上記mergeでlazy segment treeを構築する。type 1では[L,R]へflip tagをapplyし、既存tagとxor合成する。type 2ではrange productを取得しbest[1]を出力する。identityはlen=0としてmerge境界を扱う。 |
| [abc322-g](../../src/content/technique-inventory/shard-00/abc322-g.json) | 維持 | なし | 維持 | P: `decompose-by-prime-or-divisor` / C: — / S: `prove-greedy-order` | k=2はS_1=1..9かつS_1\|Xを走査し、s=X/S_1、b∈[S_1+1,N-s]ごとの末尾digit数min(10,b)を区間和で加える。k≥3は各divisor s of Xについて1≤b≤min(N-s,floor((X/s-s)/2))、a=b+sを列挙する。D_e=a^e-b^eをXでcapしながらe≥2まで作り、最大weightからXをgreedy分解してdigitが0..min(10,b)-1、leading非zero、remainder 0ならmin(10,b)を加える。 |

### ABC323

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc323-e](../../src/content/technique-inventory/shard-03/abc323-e.json) | 維持 | なし | 維持 | P: `propagate-probability-distribution` / C: — / S: `compute-in-modular-arithmetic` | invN=N^{-1} mod 998244353を一度求め、p[0]=1とする。t=1..Xでsum=Σ_{k:T_k≤t}p[t-T_k]を計算しp[t]=sum·invNとする。l=max(0,X-T_1+1)からXまでのp[t]を足し、さらにinvNを掛けて曲1が選ばれる確率として出力する。 |
| [abc323-f](../../src/content/technique-inventory/shard-01/abc323-f.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: `enumerate-bounded-candidates-or-cases`、`reduce-geometry-to-algebraic-predicates` | A'=(X_A-X_B,Y_A-Y_B)、D=(X_C-X_B,Y_C-Y_B)とする。D_x>0なら(-1,0)、D_x<0なら(1,0)をrequiredへ入れ、yも符号と逆側の点を入れる。avoidDist(A',p)=Manhattan距離に、同一axisで原点を挟む場合だけ2を足す。requiredが1点ならwalk=avoidDist、2点ならwalk=min(avoidDist(A',p_1),avoidDist(A',p_2))+2。答えはwalk+\|D_x\|+\|D_y\|。 |
| [abc323-g](../../src/content/technique-inventory/shard-00/abc323-g.json) | 維持 | なし | 維持 | P: `count-combinatorial-objects-by-determinant` / C: — / S: `shift-polynomial-by-factorial-convolution`、`solve-linear-system-and-rank` | 全unordered pair u<vについてP_u>P_vならw=x、否则w=1としてpolynomial Laplacianを作り、1行1列を除いてM_0,M_1へ分ける。d=N-1とし、C=M_0+aM_1が正則になるfield要素aを選ぶ。C^{-1}M_1を求め、−C^{-1}M_1のcharacteristic polynomialからE(z)=det(C)det(zI+C^{-1}M_1)を得る。degree dで係数をreverseしてQ(t)=D(a+t)とし、t=x-aのTaylor shiftでD(x)へ戻し、x^0..x^{N-1}係数を出力する。 |

### ABC324

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc324-e](../../src/content/technique-inventory/shard-05/abc324-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | 各S_iを左からscanしてA_i、右からscanしてB_iを求める。count[b]へB_iの頻度を入れ、ge[l]=Σ_{b≥l}count[b]をsuffix sumする。各iについてl=\|T\|-A_iを計算してge[l]をanswerへ加え、64bit整数で出力する。 |
| [abc324-f](../../src/content/technique-inventory/shard-00/abc324-f.json) · 所見あり | 維持 | なし | 維持 | P: `optimize-ratio-by-parametric-search` / C: — / S: `process-dag-in-topological-order`、`prove-and-search-threshold` | predicate(X)ではdp[1]=0、他−∞とし、u=1..Nの番号順に全outgoing edge(u,v,b,c)でdp[v]=max(dp[v],dp[u]+b-cX)を更新し、dp[N]≥0を返す。lower=0、upperを最大b_i/c_i以上に取り、十分な回数binary searchしてtrueならlower=mid、falseならupper=midとしlowerを出力する。 |
| [abc324-g](../../src/content/technique-inventory/shard-03/abc324-g.json) | 維持 | なし | 維持 | P: `merge-small-into-large` / C: — / S: `maintain-ordered-set-statistics` | 各sequence handleにposition-ordered setとvalue-ordered setを持ち、element移動時は両方からeraseして相手containerへinsertする。type 1はcut=min(x,length)からprefix/suffixの小さい側をposition端から移す。type 2はvalue rankで≤x側と>x側のsizeを得て、小さい側をvalue端から移す。移動した側・残った側が仕様のs,iへ対応するようhandleを必要ならswapし、新sequence iのsizeを出力する。 |

### ABC325

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc325-e](../../src/content/technique-inventory/shard-01/abc325-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | car graphのedge(i,j)=A·D_{i,j}でsource 1からdense DijkstraしXを得る。train graphのedge(i,j)=B·D_{i,j}+Cでsource Nから同様にYを得る。全i=1..NのX_i+Y_iの最小値を64bit整数で出力する。 |
| [abc325-f](../../src/content/technique-inventory/shard-00/abc325-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | dp[0]=0、他INFで始める。各D_iについてnextをINFにし、既使用jと当sectionへ使うk=0..K_1-jを列挙する。need2=max(0,D_i-kL_1)をL_2で切上げ、next[j+k]=min(next[j+k],dp[j]+need2)とする。全section後、dp[j]≤K_2の状態からjC_1+dp[j]C_2を最小化し、なければ-1。 |
| [abc325-g](../../src/content/technique-inventory/shard-03/abc325-g.json) | 維持 | なし | 維持 | P: `design-interval-split-dp` / C: — / S: — | dp[i][i]=0とし、interval長1から増やす。dp[l][r]をr-lで初期化し、全split mでdp[l][r]=min(dp[l][r],dp[l][m]+dp[m][r])を取る。S[l]='o'なら各i∈(l,r)でS[i]='f'かつdp[l+1][i]=0を確認し、max(dp[i+1][r]-K,0)でも更新する。最後にdp[0][\|S\|]を出力する。 |

### ABC326

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc326-e](../../src/content/technique-inventory/shard-05/abc326-e.json) | 維持 | なし | 維持 | P: `propagate-probability-distribution` / C: — / S: `compute-in-modular-arithmetic`、`reorder-counting-contributions` | mod 998244353でinvN=N^{-1}を求め、pref=p_0=1、answer=0とする。i=1..Nでp_i=pref·invN、answer+=A_i·p_i、pref+=p_iと更新する。最後にanswerを正規化して出力する。 |
| [abc326-f](../../src/content/technique-inventory/shard-01/abc326-f.json) | 維持 | なし | 維持 | P: `split-enumeration-space` / C: — / S: `recover-valid-witness` | odd indexのA列をtarget Y、even index列をtarget Xとしてsolveする。solveは列を半分に分け、各halfの全maskで+/- sumを列挙し、一方をhash mapへ保存して補数pairを探し、各項のsignを返す。どちらか失敗ならNo。成功時、各iのtarget directionをoddなら±y、evenなら±xに設定し、初期direction +xから左回転で一致すればL、否则Rを出してdirectionを更新する。 |
| [abc326-g](../../src/content/technique-inventory/shard-05/abc326-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: — | source,sink、各skill iのthreshold x=2..5、各achievement jのnodeを作る。threshold→sinkへC_i、source→achievementへA_jを張る。higher threshold→lower threshold、achievement j→S_{i,L_{j,i}}へINF edgeを張り、level 1 requirementは常に満たすとして省略する。max flow=min cutを求め、Σ_j A_j−mincutを出力する。 |

### ABC327

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc327-e](../../src/content/technique-inventory/shard-03/abc327-e.json) | 維持 | なし | 維持 | P: `design-order-preserving-dp` / C: — / S: — | dp[0]=0、他を−∞とし、P_iを順に見るたびjを大きい方から1まで走査してdp[j]=max(dp[j],0.9·dp[j-1]+P_i)と更新する。den[0]=0からden[k]=0.9den[k-1]+1を作り、全k=1..Nでdp[k]/den[k]−1200/sqrt(k)の最大値をdoubleで出力する。 |
| [abc327-f](../../src/content/technique-inventory/shard-04/abc327-f.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `design-range-update-action` | 各appleについてs0=max(1,T_i-D+1)、l0=max(1,X_i-W+1)を求め、events[s0]へ(+1,[l0,X_i])、events[T_i+1]へ(−1,同区間)を登録する。全L位置を0で持つrange-add/global-max lazy segment treeを作り、S=1..max T_iでその時刻のeventを全てapplyした後、root最大値でanswerを更新する。 |
| [abc327-g](../../src/content/technique-inventory/shard-05/abc327-g.json) · [指摘](#finding-abc327-g) | 維持 | なし | **変更** | P: `count-labeled-structures-by-components` / C: — / S: `color-and-classify-bipartite-components`、`compute-in-modular-arithmetic`、`correct-overlap-by-inversion`、`formulate-combinatorial-coefficients` | L=floor(N/2)ceil(N/2)までbinomialを前計算しg(n,m)を作る。h(n,m)=g(n,m)−Σ_{i<n,j}C(n-1,i-1)h(i,j)g(n-i,m-j)でcolored connected数を求め、c=h/2とする。f(0,0)=1から、vertex 1を含むconnected componentを選ぶ標準漸化式f(n,m)=Σ_{i=1..n,j}C(n-1,i-1)c(i,j)f(n-i,m-j)でsimple bipartite graphを数える。b(M,k)=Σ_{i=0}^k(-1)^{k-i}C(k,i)i^Mを求め、2^MΣ_{k=0}^L f(N,k)b(M,k)を出力する。 |

### ABC328

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc328-e](../../src/content/technique-inventory/shard-05/abc328-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: `maintain-connectivity-components` | edge indexからN-1個を選ぶcombination DFSを行う。leafでは新しいDSUを作って各chosen edgeをunionし、既に同rootならtreeでないとして捨てる。同時にsum=(sum+w_i)%Kを更新し、全edgeがcycleなしならanswer=min(answer,sum)とする。graph connected保証により少なくとも1候補は成立する。 |
| [abc328-f](../../src/content/technique-inventory/shard-05/abc328-f.json) | 維持 | なし | 維持 | P: `maintain-potential-differences` / C: — / S: — | weighted DSUをN頂点で初期化する。query(a,b,d)ごとにfindして、rootが同じならpot[a]-pot[b]==dのときだけindexをanswerへ追加する。rootが異なるなら常にindexを追加し、X_a-X_b=dを満たすroot間差を設定してsizeの小さいrootを大きいrootへmergeする。最後にaccepted indexを順に出力する。 |
| [abc328-g](../../src/content/technique-inventory/shard-03/abc328-g.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: — | dp[0]=0、他INFとする。各mask Sについて全original interval [l,r] whose bitmask I is disjoint from Sを列挙し、pos=popcount(S)としてadd=Σ_{t=0}^{r-l}\|A_{l+t}-B_{pos+1+t}\|を求める。dp[S\|I]=min(dp[S\|I],dp[S]+add+(S≠0?C:0))と更新する。intervalとtarget開始位置ごとのaddは前計算または延長時の累積でO(1)取得し、dp[(1<<N)-1]を出力する。 |

### ABC329

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc329-e](../../src/content/technique-inventory/shard-02/abc329-e.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `bound-monotone-total-work` | current=Sとし、全start 0..N-Mでgoodならqueueへ入れる。queueからiをpopし未使用ならusedにしてwindow内の文字を#へ変える。各変更位置pについてstart∈[p-M+1,p]を範囲clipしてgoodか再検査し、成立windowをenqueueする。終了後currentが全#ならYes、そうでなければNo。 |
| [abc329-f](../../src/content/technique-inventory/shard-05/abc329-f.json) | 維持 | なし | 維持 | P: `merge-small-into-large` / C: — / S: — | 初期box iのsetへC_iを1つ入れる。query(a,b)でsize(set[a])>size(set[b])なら2つのset handleをswapする。その後set[a]の全colorをset[b]へinsertし、set[a]をclearする。size(set[b])を出力する。 |
| [abc329-g](../../src/content/technique-inventory/shard-04/abc329-g.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: `answer-tree-ancestor-queries` | LCA/binary liftingを前計算する。各ballについてsource→goalの最初のportへpickup count、goalへ入るportへdrop countを加え、LCAが両端と異なるならsource childを先にするconstraintを設定し、逆constraintと衝突すれば0。dp[v][j]をload jでvへ初回到着したsubtree tour通り数とし、到着portのdrop、各許容child順について「vからchildへ出る直前pickup→child dp→戻った直後drop」を順に適用し、最後にparent向けpickupを加える。loadが0..K外なら棄却し、子通り数を掛けて順序間を加算する。rootのentry 0から最終load 0となるdpを答える。 |

### ABC330

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc330-e](../../src/content/technique-inventory/shard-05/abc330-e.json) | 維持 | なし | 維持 | P: `maintain-ordered-set-statistics` / C: — / S: — | cnt[0..N]を初期Aから作り、cnt[v]=0の全vをordered set missingへ入れる。query(i,x)で旧A_i≤Nならcntを減らし0になればinsertする。x≤Nなら更新前cnt[x]=0ならmissingからeraseし、その後増やす。A_i=xへ更新し、*missing.begin()を出力する。 |
| [abc330-f](../../src/content/technique-inventory/shard-05/abc330-f.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `linearize-static-range-information`、`optimize-univariate-convex-function` | X,Yを別々にsortしてprefix sumを作る。axisCost(V,d)ではlを[min V,max V]でdiscrete convex searchし、Σ_{v<l}(l-v)+Σ_{v>l+d}(v-l-d)の最小を返す。predicate(d)=axisCost(X,d)+axisCost(Y,d)≤Kとし、d=0..max(initial x-span,y-span)をinteger binary searchして最小trueを出力する。 |
| [abc330-g](../../src/content/technique-inventory/shard-03/abc330-g.json) · [指摘](#finding-abc330-g) | 維持 | なし | **変更** | P: `reorder-counting-contributions` / C: — / S: `linearize-static-range-information` | 確定位置同士のinversion aと、各未確定位置p・未使用値の順位vのw[p][v]をposition/value prefix countで作る。S_p=Σ_vw[p][v]、value列方向のsumも集計し、E[B]=(ΣS_p)/q、E[B²]=Σw²/q＋((ΣS)^2−ΣS_p²−Σ_v((Σ_pw)^2−Σ_pw²))/(q(q-1))を求める。q≥2なら条件付きU式を全p,vへ掛けてE[UB]=(1/q)Σw[p][v]E[U\|π_p=v]とする。E[I²]=a²+E[U²]+E[B²]+2a(E[U]+E[B])+2E[UB]をmod 998244353で組み、q!を掛ける。q=0,1は分母0の項を個別に省く。 |

### ABC331

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc331-e](../../src/content/technique-inventory/shard-02/abc331-e.json) | 維持 | なし | 維持 | P: `enumerate-frontier-best-first` / C: — / S: `enumerate-bounded-candidates-or-cases` | 副菜を価格降順にsortし、各主菜iについて先頭副菜との価格和・i・順位0をmax-heapへ入れる。最大候補をpopし、その元index対が禁止集合になければ価格和を答える。禁止なら同じ主菜の次順位をheapへ入れて続ける。 |
| [abc331-f](../../src/content/technique-inventory/shard-01/abc331-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: `compare-sequences-by-rolling-fingerprint` | 各文字をhash nodeとしてsegment treeを構築する。更新queryでは対応葉を置換し、判定queryでは[L,R]のnodeを取得してforward hashとbackward hashを全採用modulusで比較する。 |
| [abc331-g](../../src/content/technique-inventory/shard-02/abc331-g.json) · [指摘](#finding-abc331-g) | 維持 | 現順維持 | **変更** | P: `correct-overlap-by-inversion` / C: `encode-counting-by-generating-function` / S: `compute-convolution-or-correlation`、`divide-search-space-recursively` | 各iの疎多項式(1-X^{C_i})を用意し、次数Nで打ち切りながら小さい多項式同士を優先してconvolutionする。得た係数へ全体符号を掛け、Σ_{k=0}^{N-1} d_k×N/(N-k)をmod 998244353で計算する。 |

### ABC332

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc332-e](../../src/content/technique-inventory/shard-01/abc332-e.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: — | 全maskのsum[mask]とcost[mask]=(sum[mask]-μ)^2を前計算する。dp[1][S]=cost[S]から始め、k=2..DでSの全submask Tを列挙してdp[k-1][S\T]+cost[T]の最小を取る。答えはdp[D][all]/D。 |
| [abc332-f](../../src/content/technique-inventory/shard-00/abc332-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: `compute-in-modular-arithmetic` | 期待値配列をAで初期化し、各queryのλ=R-L+1と逆元を求め、区間[L,R]へf(x)=((λ-1)/λ)x+X/λをlazy適用する。全操作後に各点を取得しmod 998244353で出力する。 |
| [abc332-g](../../src/content/technique-inventory/shard-01/abc332-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: `design-resource-dp`、`linearize-events` | L=N(N+1)/2とし、dp[k]=min cutの色側寄与を0/1 knapsackで計算する。箱jの切替点⌊B_j/j⌋をbucket化し、k=0..Lを昇順に走査しながら未切替index和×k＋切替済B和でF(k)を出す。min_k(dp[k]+F(k))がmax-flow値、すなわち答え。 |

### ABC333

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc333-e](../../src/content/technique-inventory/shard-00/abc333-e.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `linearize-static-range-information`、`prove-greedy-order` | typeごとに発見event indexのstackを持つ。t=1ではindexをpushし、t=2では対応stackが空なら-1、そうでなければtopをpopしてその発見を採用とmarkする。最後まで成功したら採用markを時系列に走査し、採用時+1、monster時-1としてprefix最大Kと各t=1の0/1を出力する。 |
| [abc333-f](../../src/content/technique-inventory/shard-03/abc333-f.json) | 維持 | なし | 維持 | P: `propagate-probability-distribution` / C: — / S: `compute-in-modular-arithmetic`、`slide-transition-recurrence` | dp[1][0]=1から人数を一人ずつ増やす。m人のnew[0]はdp[m-1]を逆順にpの冪で重み付けしp/(1-p^m)を掛けてO(m)で求める。その後j=0,…,m-2についてnew[j+1]=p(new[j]+dp[m-1][j])でrowを埋め、dp[N]を出力する。 |
| [abc333-g](../../src/content/technique-inventory/shard-05/abc333-g.json) | 維持 | なし | 維持 | P: `approximate-rational-by-euclid` / C: — / S: — | 小数文字列から整数Rと10の冪Dを作りgcdで約分する。Euclid法で連分数係数を順に得つつconvergentの分子分母を更新し、次の完全convergentが分母Nを超える箇所では係数をfloor((N-q_prevprev)/q_prev)までに切って左右候補を構成する。\|R/D-p/q\|を整数cross積で比較し、tieは小さいp/qを選ぶ。 |

### ABC334

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc334-e](../../src/content/technique-inventory/shard-04/abc334-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `compute-in-modular-arithmetic` | 全# cellをBFS/DFSして成分IDを付け、元の成分数Cを得る。各. cellについて四近傍のIDを小配列またはsetで重複除去し、C+1-xを総和する。赤cell数Rで割るためRのmod逆元を掛ける。 |
| [abc334-f](../../src/content/technique-inventory/shard-02/abc334-f.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: `prune-dominated-candidates-once` | d_0=d_N=0としてdp[0]=0、dp[i]=d_i+min{dp[j] \| i-K≤j<i}をi=1,…,Nで計算する。dequeの先頭をwindow最小に保てばO(N)でdp[N]を得て、baselineへ加える。 |
| [abc334-g](../../src/content/technique-inventory/shard-01/abc334-g.json) · [指摘](#finding-abc334-g) | 維持 | なし | **変更** | P: `identify-bridges-and-articulations` / C: — / S: — | gridの#を無向graphとして各未訪問頂点からDFSし、ord・lowと初期成分数Cを求める。同時に各vの分離子数cを数え、rootならparts=c、非rootならparts=c+1とする。削除後全体はC-1+parts(v)なので全緑vで平均する。 |

### ABC335

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc335-e](../../src/content/technique-inventory/shard-05/abc335-e.json) | 維持 | 現順維持 | 維持 | P: `maintain-connectivity-components` / C: `process-dag-in-topological-order` / S: — | A_u=A_vの全辺をDSUでunionする。各元辺の異なる代表元間に小さいAから大きいAへの有向辺を作る。頂点1の成分dp=1、他を到達不能として、成分をA昇順に処理しdp[next]=max(dp[next],dp[cur]+1)を行い、頂点Nの成分値を出力する。 |
| [abc335-f](../../src/content/technique-inventory/shard-00/abc335-f.json) | 維持 | なし | 維持 | P: `balance-heavy-light-threshold` / C: — / S: — | dp[1]=1としindexを昇順に処理する。iでは全d≤Bのbucket[d][i mod d]をdp[i]へ加える。A_i≤Bならdp[i]をbucket[A_i][i mod A_i]へ蓄え、A_i>Bならj=i+A_iからNまでstep A_iでdp[j]へ加える。最後に全dp[i]を合計する。 |
| [abc335-g](../../src/content/technique-inventory/shard-00/abc335-g.json) | 維持 | 現順維持 | 維持 | P: `count-through-cyclic-exponents` / C: `find-period-by-multiplicative-order` / S: `compute-in-modular-arithmetic`、`decompose-by-prime-or-divisor`、`invert-divisor-lattice-by-mobius` | P-1をtrial divisionで素因数分解する。各A_iについてmodular exponentiationで位数を削減し、その素因数指数vectorの頻度を数える。mixed-radix配列上で各軸のprefix zeta変換を行って各dに対するΣ_{e\|d}freq[e]を得て、Σ_d freq[d]·divisorCount[d]を出力する。 |

### ABC336

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc336-e](../../src/content/technique-inventory/shard-05/abc336-e.json) | 維持 | なし | 維持 | P: `count-prefix-constrained-objects` / C: — / S: — | Nをdecimal digit列にし、s=1から9×桁数まで繰り返す。dp[pos][sum][rem][tight]を0初期化しdp[0][0][0][1]=1、許される次digitを配る。全桁後のdp[L][s][0][0/1]を加算する。 |
| [abc336-f](../../src/content/technique-inventory/shard-02/abc336-f.json) | 維持 | なし | 維持 | P: `split-enumeration-space` / C: — / S: `select-state-graph-search` | grid配列をcanonicalなstate keyへencodeし、初期と完成gridを始点にそれぞれ4回転を辺とするBFSをdepth 10まで行う。二つのdistance mapの小さい側を走査して共通keyを探し、距離和の最小が20以下なら出力、なければ-1とする。 |
| [abc336-g](../../src/content/technique-inventory/shard-05/abc336-g.json) | 維持 | なし | 維持 | P: `count-euler-circuits-by-best` / C: — / S: `compute-in-modular-arithmetic`、`construct-euler-trail-or-circuit`、`count-combinatorial-objects-by-determinant`、`formulate-combinatorial-coefficients` | 各始点s・終点tのdegree条件を調べ、辺を持つ頂点とs,tだけをVとする。元の辺と区別する補助辺e*:t→sをs=tでも一個加え、V上の連結性と入出次数一致を確認する。e*を最初の辺に固定した閉路からe*を切ると、sからtへの線形なtrailと一対一対応する。自己ループを除いたV上の有向Laplacianから根tの行・列を除き、その余因子の行列式を求める。一頂点なら空行列式は1。これに補助辺・自己ループを含む次数の∏(outdeg(v)-1)!を掛け、元の16種類のX_e!だけで割り、始終点について合計する。X0000=1だけなら答えは1であり、未使用の7頂点を行列へ残してはいけない。 |

### ABC337

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc337-e](../../src/content/technique-inventory/shard-04/abc337-e.json) | 維持 | なし | 維持 | P: `design-query-code-by-information-bound` / C: — / S: `maintain-interactive-query-protocol` | 最小のM with 2^M≥Nを出力する。各bit iについて、(j-1)のi bit目が1であるbottle jを昇順に列挙して人数と一覧を出しflushする。長さMのSを読み、S_iをbit iとして整数xを復号しx+1を出力する。 |
| [abc337-f](../../src/content/technique-inventory/shard-02/abc337-f.json) | 維持 | なし | 維持 | P: `maintain-monotone-window` / C: — / S: — | C'を作り、色別総数g、現在window count cnt、chance総数S、収納総数Vを持つ。各左端lで、長さN以内かつS<Mの間右端を進め、色cのceil(cnt/K)変化に応じSとmin(ceil(cnt/K)K,g_c)を差分更新する。Vを答えに記録後、左端ballを同様に削除する。 |
| [abc337-g](../../src/content/technique-inventory/shard-05/abc337-g.json) | 維持 | なし | 維持 | P: `flatten-tree-by-euler-order` / C: — / S: `linearize-events`、`maintain-weighted-prefix-statistics` | 任意rootでEuler tourして各subtreeを[tin,tout)にする。qを昇順に処理し、label<qの頂点tinへ1を入れたBITで必要なless(interval,q)を求める。各wのaをsubtree(w)へ加え、各child pのbを全体へ加えてsubtree(p)から引くrange-addをEuler差分または木imosで集約し、各頂点値を出す。 |

### ABC338

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc338-e](../../src/content/technique-inventory/shard-00/abc338-e.json) | 維持 | なし | 維持 | P: `detect-crossing-by-cyclic-order` / C: — / S: — | 各chordで端点をmin/maxにし、位置1,…,2Nにchord IDと左/右種別を記録する。左端ならIDをpush、右端ならpopしたIDと比較し、不一致ならYesを即出力する。最後まで一致すればNo。 |
| [abc338-f](../../src/content/technique-inventory/shard-00/abc338-f.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `compute-all-pairs-distance` | edge重みからFloyd–Warshallでdを求める。dp[mask][i]をmask内の頂点を代表順として訪ねiで終わる最小costとし、全iでdp[1<<i][i]=0、j∉maskへdp[mask\|1<<j][j]=min(...,dp[mask][i]+d[i][j])を行う。full mask最小がINFならNo。 |
| [abc338-g](../../src/content/technique-inventory/shard-03/abc338-g.json) | 維持 | なし | 維持 | P: `compress-dp-sufficient-aggregates` / C: — / S: — | 左から走査し、active start数cnt、Σpre、Σmul、Σtermをmodで保持する。digitでは既存の数を10倍してdを足す更新に加え、その位置から始まる新substring状態(pre=0,mul=1,term=d)を追加し、preSum+termSumを答えへ足す。+と*では上記の状態変換だけを行う。 |

### ABC339

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc339-e](../../src/content/technique-inventory/shard-00/abc339-e.json) | 維持 | なし | 維持 | P: `aggregate-subsequence-transitions-by-value` / C: — / S: `design-associative-range-summary` | 値域1…500000にmax segment treeを作る。A_iを左から読み、l=max(1,A_i-D), r=min(V,A_i+D)の区間maxをqueryしv+1を得る。位置A_iを現在値とのmaxでpoint updateし、tree全体のmaxを出力する。 |
| [abc339-f](../../src/content/technique-inventory/shard-00/abc339-f.json) | 維持 | なし | 維持 | P: `compare-algebraic-objects-by-random-fingerprint` / C: — / S: `design-and-bound-randomized-algorithm` | 10^9～2×10^9から独立に約20個のprimeを選び、各A_iをdecimal文字列から各mod residueへ変換してvector keyを作りfrequency mapへ入れる。全順序付きpair(i,j)についてcomponentwise residue積keyを作り、そのkeyの入力frequencyを答えへ加える。 |
| [abc339-g](../../src/content/technique-inventory/shard-00/abc339-g.json) | 維持 | なし | 維持 | P: `build-static-sorted-range-index` / C: — / S: — | segment treeをbottom-upに構築し、各nodeで子のsorted listをmergeして同長のprefix sumを作る。prev=0から各encrypted queryをL=α xor prev等で復号し、[L,R]を被覆するnodeごとにupper_bound(X)とprefix参照を行って合計し、それを出力してprevへ代入する。 |

### ABC340

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc340-e](../../src/content/technique-inventory/shard-03/abc340-e.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: — | range-add lazy segment treeへ初期Aを入れる。各B_iでpoint queryしてXを得て、その点へ-Xを加えて0にする。全区間へq=X/Nを加え、r=X mod Nについて[B+1,B+1+r)をmod Nで一つまたは二つのrangeへ分けて+1する。最後に各pointを出力する。 |
| [abc340-f](../../src/content/technique-inventory/shard-00/abc340-f.json) | 維持 | なし | 維持 | P: `characterize-integer-solvability` / C: — / S: — | g=gcd(abs(X),abs(Y))を求め、2 mod g≠0なら-1を出す。extended gcdでY·u+(-X)·v=gまたは-gとなる係数を得て、scale=2/gを掛けA=u·scale,B=v·scaleとする。必要なら符号を反転し出力する。 |
| [abc340-g](../../src/content/technique-inventory/shard-05/abc340-g.json) | 維持 | なし | 維持 | P: `build-virtual-tree` / C: — / S: `aggregate-rooted-tree` | 元treeをEuler tourしLCA前計算する。各色cの頂点をtin順に並べ隣接LCAを追加・再sortしてstackでvirtual treeを作る。postorderでP,Q,gを計算し、各vのclosed countを色cの答えへ加算する。全色分のsize≥2 subtree数を合計し、degree 0で条件を満たすN個のsingletonを一度だけ加える。 |

### ABC341

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc341-e](../../src/content/technique-inventory/shard-02/abc341-e.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: `maintain-weighted-prefix-statistics` | 長さN-1のAを構築し、sum segment treeまたはFenwick treeへ入れる。type 1ではL>1ならA_{L-1}、R<NならA_Rをtoggleしてpoint updateする。type 2ではsum(A_L…A_{R-1})=R-LならYes、そうでなければNo。 |
| [abc341-f](../../src/content/technique-inventory/shard-02/abc341-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: `process-dag-in-topological-order` | 頂点をW昇順に並べる。各vについて長さW_vのknapsack配列を0初期化し、W_u<W_vの全neighbor uをitemとしてcapacity降順にvalue dp[u]を更新する。dp[v]=1+max tableとし、全頂点後にΣdp[v]A_vを計算する。 |
| [abc341-g](../../src/content/technique-inventory/shard-04/abc341-g.json) | 維持 | なし | 維持 | P: `restrict-geometric-candidates-to-boundary` / C: — / S: — | prefix sumsを作り、i=Nから0へ点P_iをstack hullへ追加する。末尾二点と新点のcross productがupper-hullのconvexityを壊す間、中央点をpopする。P_{k-1}追加直後にその隣のhull点との(y差)/(x差)をans[k]として記録しdoubleで出力する。 |

### ABC342

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc342-e](../../src/content/technique-inventory/shard-01/abc342-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | 各Bに入るschedule情報をreverse adjacencyへ持つ。f[N]=十分大きい∞、他=-∞としてmax-heapにNを入れる。最大Tのstation Bを取り出し未確定なら確定し、各(A→B)について上式のjとcandidate departureを求めf[A]をchmaxしてheapへ入れる。1…N-1を値またはUnreachableで出す。 |
| [abc342-f](../../src/content/technique-inventory/shard-03/abc342-f.json) | 維持 | なし | 維持 | P: `optimize-stochastic-actions` / C: — / S: `factor-and-accelerate-transitions` | p[0]=1からdealerがL未満のstateだけを展開し、difference arrayまたはsliding sumで各p[y]を求める。terminal y≥Lのprefix sumから全q[i]を作る。r[j]=0 for j>Nとしてi=N,…,0を走査し、次D個のr平均をwindow sumで得てr[i]を更新し、r[0]を出力する。 |
| [abc342-g](../../src/content/technique-inventory/shard-04/abc342-g.json) | 維持 | なし | 維持 | P: `decompose-ranges-into-segment-tree-nodes` / C: — / S: `maintain-ordered-set-statistics` | 各segment nodeにmultiset、または追加heapと削除heapのlazy deletion pairを置く。type 1の(l,r,x)をcanonical nodesへ挿入しoperation IDに情報を保存する。type 2では同じ分解nodeからxを削除する。type 3ではA_iとleafからrootまでの各node現在maxの最大を出力する。 |

### ABC343

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc343-e](../../src/content/technique-inventory/shard-03/abc343-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: `correct-overlap-by-inversion`、`reduce-geometry-to-algebraic-predicates` | C1=(0,0,0)としa2,b2,c2,a3,b3,c3を-7…7でloopする。各axisのoverlap長max(0,min(right)-max(left))を掛けて三pair交差とtriple交差を求め、v3,v2,v1を式で計算する。一致した座標をYesと出し、なければNo。 |
| [abc343-f](../../src/content/technique-inventory/shard-04/abc343-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: — | leafを(A_i,1,-∞,0)で初期化する。merge関数で二nodeの4候補をvalue別に統合し最大二値とcountを返す。type 1はleaf置換、type 2は[l,r)をfoldして第二値のcountを出力し、第二distinct値がなければ0を返す。 |
| [abc343-g](../../src/content/technique-inventory/shard-00/abc343-g.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `build-prefix-match-state` | 同一文字列をdeduplicateし、他文字列のsubstringであるものをKMP/Z等で削除する。各ordered pair(i,j)の最大suffix-prefix一致長ov[i][j]を前計算する。dp[mask][j]をmaskを含むsuperstringで末尾がjの最小長として、未使用kへ+\|S_k\|-ov[j][k]を遷移しfull maskの最小を出す。 |

### ABC344

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc344-e](../../src/content/technique-inventory/shard-01/abc344-e.json) | 維持 | なし | 維持 | P: `maintain-local-sequence-links` / C: — / S: — | 各valueに(prev,next)を持つ連想配列を作り、head/tail sentinelも接続する。type 1はxとそのnextの間へy nodeを挿入し、type 2はxの両隣を直結してmapからxを消す。最後にhead.nextからtailまでnextを辿り出力する。 |
| [abc344-f](../../src/content/technique-inventory/shard-01/abc344-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | DP[cell][maxP-cell]に最良(action,money)を持ち、開始(1,1)を(0,0)とする。右/下move cost cごとにw=max(0,ceil((c-money)/p))を求め、(action+w+1,money+wp-c)を遷移先へ送る。遷移先のPが大きければmaxP出所を更新し、action小・tieでmoney大にchmaxする。終点の最小actionを出す。 |
| [abc344-g](../../src/content/technique-inventory/shard-05/abc344-g.json) | 維持 | なし | 維持 | P: `maintain-order-through-crossing-events` / C: — / S: `linearize-events` | 生成器からQ個の(A,B)を作りA昇順にsortする。点列はA→-∞での順序に対応する(X,Y)辞書順から始め、隣接crossing slopeをexact rational keyのheapへ入れる。各query A前にslope≤Aの有効eventを処理してswap・隣接event更新し、現在順のscore=-AX+Yへlower_boundしてscore≥Bの個数を加算する。 |

### ABC345

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc345-e](../../src/content/technique-inventory/shard-04/abc345-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `design-order-preserving-dp` | color 0,value 0のsentinelを削除数0の一位として初期化する。各ballを処理しjを範囲内で更新して、削除候補としてprev[j-1]の上位二、保持候補としてprev[j]のC以外の最良値+Vをcolor Cで生成する。候補をcolor別最大へ統合しvalue上位二をnext[j]へ置き、最後のj=Kの一位を出すか未到達なら-1。 |
| [abc345-f](../../src/content/technique-inventory/shard-05/abc345-f.json) | 維持 | なし | 維持 | P: `construct-degree-parity-subgraph` / C: — / S: `recover-valid-witness` | 全componentでDFS spanning treeとparent edgeを記録しY=Σ2floor(size/2)を計算する。Kが奇数またはK>YならNo。そうでなければ各treeをpostorder走査し、v≠rootがoffならparent edge IDを答えへ追加して両端stateをtoggleする。on countがKになった瞬間に停止してedge列を出す。 |
| [abc345-g](../../src/content/technique-inventory/shard-04/abc345-g.json) · [指摘](#finding-abc345-g) | 維持 | 現順維持 | **変更** | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `balance-heavy-light-threshold`、`divide-search-space-recursively`、`formulate-combinatorial-coefficients` | factorial・inverse factorialとKの逆冪を前計算する。大K側ではa_n=K^{-n}Σ_j(-1)^j C(n,j)C(N-1-jK,n)を有効jだけ加算する。小K側では区間[l,r)のa_n評価をFの冪とNTT convolutionで分割統治し、各nodeで必要degree windowだけ保持する。閾値を均衡させ、最後にa_{n-1}-a_nを出力する。 |

### ABC346

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc346-e](../../src/content/technique-inventory/shard-03/abc346-e.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: — | rowUsed・colUsedをfalse、fixedRows=fixedCols=0としてM-1から0へ走査する。未使用rowならcount[X]+=W-fixedColsとしてmark・fixedRows++、未使用columnならcount[X]+=H-fixedRowsとしてmark・fixedCols++する。残る(H-fixedRows)(W-fixedCols)をcolor0へ加え、正countだけ色昇順に出す。 |
| [abc346-f](../../src/content/technique-inventory/shard-04/abc346-f.json) | 維持 | なし | 維持 | P: `query-recursively-defined-string` / C: — / S: `prove-and-search-threshold` | S内の各文字の出現positionを前計算し、TにS不在文字があれば0を返す。feasible(k)ではpos=0から各c∈Tについて、pos mod \|S\|以降のc出現数、必要なfull cycle数、周期内indexを算術とbinary searchで求めてposをk個目の直後へ進め、pos≤N\|S\|か判定する。0…floor(N\|S\|/\|T\|)で最大kを二分探索する。 |
| [abc346-g](../../src/content/technique-inventory/shard-04/abc346-g.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `design-range-update-action` | 各iのprev/next same-valueを前後走査で求め、L=p_i+1でR区間[i,n_i-1]へ+1、L=iの回答後に-1するeventを作る。L=1…Nでadd events、positive R数をsegment rootの(min,countMin)から答えへ加算、remove eventsの順に処理する。range add lazy treeでminとcountを維持する。 |

### ABC347

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc347-e](../../src/content/technique-inventory/shard-04/abc347-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | inSet、start[x]、現在size、pref[0]=0を持つ。query tでxが未加入なら加入markとstart=t,size++、加入済みならans[x]+=pref[t-1]-pref[start-1]として削除しsize--する。そのtoggle後にpref[t]=pref[t-1]+sizeを置き、終了後のactive xへ残期間差を加える。 |
| [abc347-f](../../src/content/technique-inventory/shard-01/abc347-f.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: `design-grid-table-dp`、`linearize-static-range-information` | 2D prefix sumで各M×M top-leftのweight BをO(1)計算する。B上で上下左右および四隅方向のprefix/suffix maximum tableをO(N^2)前計算する。二本のcut位置、または一square側の境界と反対側の直交cutを列挙し、対応する三rectangle最大を定数時間で足す。6 orientationの最大を出力する。 |
| [abc347-g](../../src/content/technique-inventory/shard-04/abc347-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: — | cell xごとにnode x_{>1},…,x_{>4}を作り、x_{>k+1}→x_{>k}へINFを張る。固定A_x=aにはs→x_{>a-1}とx_{>a}→tの必要なINF arcでexact labelを強制する。各隣接cell pairの両方向に、同threshold capacity1とl<kのcross-threshold capacity2 arcを張る。max-flow後、source reachableなthreshold数+1をB_xとして出力する。 |

### ABC348

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc348-e](../../src/content/technique-inventory/shard-01/abc348-e.json) | 維持 | なし | 維持 | P: `reroot-tree-aggregation` / C: — / S: — | 頂点1をrootにDFSしdepthとsubtree weight sub[v]を求め、f(1)=ΣC_v·depth[v]を計算する。二度目のDFSで各parent-childにf[child]=f[parent]+T-2sub[child]を適用し、全fの最小を出力する。 |
| [abc348-f](../../src/content/technique-inventory/shard-03/abc348-f.json) | 維持 | なし | 維持 | P: `accelerate-set-operations-with-bitsets` / C: — / S: — | N個のdynamic bitset parityを0初期化する。各column kでA_{i,k}を値1…999ごとにrow bitmaskへまとめ、各groupの全row iについてparity[i]へgroup maskをXORする。最後に各iでj>iのset bit数をpopcountして合計する。 |
| [abc348-g](../../src/content/technique-inventory/shard-01/abc348-g.json) | 維持 | なし | 維持 | P: `optimize-monge-transitions` / C: — / S: `divide-search-space-recursively` | pair(A_i,B_i)をB昇順sortする。solve(l,r)は各選択数の最大値vectorを返し、左右を再帰する。merge時に左Aを降順sortしたprefix x、右answer yからmonotone max-plus convolution zをO(len log len)で計算し、left-only、right-only、cross zの最大を各kへ格納する。root vectorの1…Nを出力する。 |

### ABC349

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc349-e](../../src/content/technique-inventory/shard-02/abc349-e.json) | 維持 | なし | 維持 | P: `evaluate-adversarial-game-value` / C: — / S: — | redMask,blueMaskまたはternary codeをstate keyにする。8本のwinning maskを検査し、full boardならmask別weight sumを比較する。未終了ではmove数偶数ならTakahashi、奇数ならAokiとして各empty cellを自色へ追加し再帰し、自分勝ちchildを見つけたらtrueをmemoする。初期stateのwinnerを出力する。 |
| [abc349-f](../../src/content/technique-inventory/shard-02/abc349-f.json) | 維持 | なし | 維持 | P: `apply-subset-zeta-mobius-transform` / C: — / S: `compute-in-modular-arithmetic`、`decompose-by-prime-or-divisor` | Mをfactorizeし、各A_iでM%A_i≠0なら捨てる。残りについて各primeのmax powerで割り切れるbit maskを作りcntへ加える。cntをsubset zetaして各maskのeligible個数を得てh=2^countとし、subset Möbius transformを行ってg[full]を出す。M=1はA_i=1の個数cから2^c-1。 |
| [abc349-g](../../src/content/technique-inventory/shard-03/abc349-g.json) | 維持 | なし | 維持 | P: `characterize-palindrome-intervals` / C: — / S: `maintain-connectivity-components`、`recover-valid-witness` | modified Manacher走査で各center iの要求radius A_iまで、既知mirror範囲をskipしつつ新規対称位置をDSU unionする。境界内なら(i-A_i-1,i+A_i+1)をinequality edgeにする。自己loopがなければ元index昇順に未着色componentへ、既着色のinequality neighborが使わない最小正整数を割り当てる。生成Sを通常Manacherで検証し全radius=A_iなら出力、違えばNo。 |

### ABC350

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc350-e](../../src/content/technique-inventory/shard-02/abc350-e.json) | 維持 | なし | 維持 | P: `optimize-stochastic-actions` / C: — / S: `design-minimal-sufficient-state` | f(0)=0とし、n>0ではmemoを確認する。deterministic候補X+f(n/A)と、random候補6Y/5+(f(n/2)+…+f(n/6))/5を再帰的に求め小さい方をmemoする。doubleでf(N)を出力する。 |
| [abc350-f](../../src/content/technique-inventory/shard-00/abc350-f.json) | 維持 | なし | 維持 | P: `query-recursively-defined-string` / C: — / S: — | stackで全parenthesis pair matchを求める同時にdepthを走査し、letterはdepth oddならcase toggleして保存する。i=0,dir=+1から、letterなら出力、parenthesisならi=match[i],dir=-dirとし、その後i+=dirする。範囲外へ出るまで続ける。 |
| [abc350-g](../../src/content/technique-inventory/shard-04/abc350-g.json) | 維持 | なし | 維持 | P: `balance-heavy-light-threshold` / C: — / S: — | B件ごとに、それまでの全辺からforestをDFSしてparentとcomponentを再計算しpendingを空にする。辺追加は全体の隣接判定構造とpendingへ記録する。質問ではbase成分が同じなら二つのparent候補、異なるならuまたはvに接するpending辺の反対端を候補にし、現在辺集合で両隣接を確認して唯一のwまたは0を返す。 |

### ABC351

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc351-e](../../src/content/technique-inventory/shard-02/abc351-e.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `reorder-counting-contributions` | 各点を (x+y)%2 の二群に分け、それぞれ u=x+y 列と v=x−y 列を sort する。各列で prefix sum を持ち Σ_i(i z_i−prefix_i) を加算し、四列の合計を2で割る。 |
| [abc351-f](../../src/content/technique-inventory/shard-00/abc351-f.json) | 維持 | なし | 維持 | P: `maintain-weighted-prefix-statistics` / C: — / S: `compress-sparse-keys`、`linearize-events` | A の unique sorted 値で rank を作る。j=1..N で rank(A_j) 未満の count c と sum s を二本の Fenwick Tree から得て、答えへ cA_j−s を加える。その後 rank へ count+1,sum+A_j を更新する。 |
| [abc351-g](../../src/content/technique-inventory/shard-02/abc351-g.json) | 維持 | なし | 維持 | P: `compose-dynamic-tree-clusters` / C: — / S: `apply-heavy-light-decomposition` | 元木を heavy/light 分解し、path cluster の compress と point cluster の rake を頂点数 balance で組み上げた Static Top Tree を構築する。各 leaf vertex に A_v を持たせ、五種の cluster constructor/merge で hash 情報を計算する。query では leaf を更新し merge-tree 祖先だけ再計算し、root cluster の値を出力する。 |

### ABC352

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc352-e](../../src/content/technique-inventory/shard-00/abc352-e.json) | 維持 | なし | 維持 | P: `construct-optimal-spanning-tree` / C: — / S: `maintain-connectivity-components` | 各操作 i について A_{i,1} と A_{i,j}(j≥2) の辺 (C_i) だけを生成する。重み昇順に sort し、DSU で異 component を結ぶ辺の重みを加算する。採用辺が N−1 本なら総和、そうでなければ −1 を出す。 |
| [abc352-f](../../src/content/technique-inventory/shard-04/abc352-f.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `propagate-static-graph-potentials` | 無向差制約 graph を DFS し D_A=D_B+C を伝播して成分を作る。各成分について全 shift の occupancy mask と各頂点位置を列挙する。成分を順に配置する dp[mask] を行い、各対象成分を除いた配置可能 mask と候補 placement の disjoint/全被覆条件から人物ごとの可能順位集合を求め、一要素ならその順位、複数なら −1。 |
| [abc352-g](../../src/content/technique-inventory/shard-03/abc352-g.json) · [指摘](#finding-abc352-g) | 維持 | 現順維持 | **変更** | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `divide-search-space-recursively`、`reorder-counting-contributions` | S=ΣA_i を計算し、各色の polynomial 1+A_i x を次数 N で product tree により NTT multiplication する。得た f_0..f_N と C(S,i) の逐次更新または factorial 式から P_{i+1}=f_i/C(S,i) を作り、i=0..N を合計する。 |

### ABC353

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc353-e](../../src/content/technique-inventory/shard-01/abc353-e.json) | 維持 | なし | 維持 | P: `index-shared-prefixes-with-trie` / C: — / S: `reorder-counting-contributions` | 空 Trie を用意し、j=1..N の順に S_j の文字をたどる。各文字後の node で現在 count を答えへ加え、その後（または二段目の走査で）S_j が通る全 node の count を1増やす。 |
| [abc353-f](../../src/content/technique-inventory/shard-02/abc353-f.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `enumerate-bounded-candidates-or-cases` | K=1 は Manhattan 距離を返す。K≥2 では各点を含む block の parity から、その点が大 tile 内なら一候補、小 tile なら四方向で最初の大 tile と入口 toll を列挙する。始終候補全組について、公式の大 tile 間距離式（K=2 とその他を分岐）＋両端 toll を計算し、直行解との最小を取る。 |
| [abc353-g](../../src/content/technique-inventory/shard-01/abc353-g.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: `design-associative-range-summary` | 未到達 dp を −INF、dp[1]=0 とする。segPlus に dp[j]+Cj、segMinus に dp[j]−Cj を持つ。市場 (t,p) ごとに best=max(queryPlus[1,t]−Ct,queryMinus[t,N]+Ct)+p を求め、dp[t]=max(dp[t],best) として両 tree の t を更新する。最後に max_j dp[j] を答える。 |

### ABC354

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc354-e](../../src/content/technique-inventory/shard-02/abc354-e.json) | 維持 | なし | 維持 | P: `classify-game-states` / C: — / S: `enumerate-subset-state-space` | win[0]=false とし、mask を popcount 昇順または数値昇順に走査する。mask 内の i<j で A_i=A_j または B_i=B_j なら next=mask xor(1<<i)xor(1<<j) を調べ、win[next]=false が一つでもあれば win[mask]=true。full mask で勝者を出す。 |
| [abc354-f](../../src/content/technique-inventory/shard-01/abc354-f.json) | 維持 | なし | 維持 | P: `aggregate-subsequence-transitions-by-value` / C: — / S: `compress-sparse-keys`、`design-associative-range-summary` | 値を座標圧縮する。左から Fenwick/segment tree の prefix max で l_i=1+max(rank<A_i) を求める。右から suffix max で r_i=1+max(rank>A_i) を求める。L=max l_i とし、l_i+r_i−1=L の index を昇順出力する。 |
| [abc354-g](../../src/content/technique-inventory/shard-03/abc354-g.json) | 維持 | なし | 維持 | P: `optimize-poset-antichain-by-dilworth` / C: — / S: `model-max-flow-min-cut` | 同一 S を最大 A にまとめる。全 ordered pair で KMP/Z/標準検索により substring 関係を判定する。左右コピーを作り source→L_i capacity A_i、R_i→sink capacity A_i、S_i substring S_j なら L_i→R_j capacity INF を張る。answer=ΣA_i−maxflow。 |

### ABC355

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc355-e](../../src/content/technique-inventory/shard-03/abc355-e.json) | 維持 | 現順維持 | 維持 | P: `select-state-graph-search` / C: `maintain-interactive-query-protocol` / S: `build-shortest-path-certificate` | 頂点0..2^Nを用意し、全 i,j について u=2^ij,v=2^i(j+1) を辺で結ぶ。BFS で L から R+1 の parent edge を復元する。path 順に ? i j を出力・flushし、u→vなら応答を加え、v→uなら引く。法100へ正規化して ! ans を出力する。 |
| [abc355-f](../../src/content/technique-inventory/shard-05/abc355-f.json) | 維持 | なし | 維持 | P: `derive-mst-weight-from-threshold-components` / C: — / S: `maintain-connectivity-components` | 10個の DSU を初期化し、初期木の各辺 (a,b,c) を k=c..9 へ unite する。component 数から ans=Σ_{k=0}^9(c_k−1) を作る。query (u,v,w) では k=w..9 で unite が成功するたび ans-- し、更新後 ans を出力する。 |
| [abc355-g](../../src/content/technique-inventory/shard-00/abc355-g.json) | 維持 | 現順維持 | 維持 | P: `optimize-by-lagrangian-relaxation` / C: `optimize-monge-transitions` / S: — | P と yP の prefix sum から c(i,j) oracle を作る。整数 λ に対し dp[j]=min_{i<j}(dp[i]+c(i,j)+λ) と使用辺数を lexicographic に計算し、分割統治＋monotone minima（または簡易LARSCH/CHT）で評価する。辺数が K+1 を跨ぐ λ を凸探索し、dp[N+1]−λ(K+1) の最大を答える。 |

### ABC356

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc356-e](../../src/content/technique-inventory/shard-02/abc356-e.json) | 維持 | なし | 維持 | P: `partition-integer-parameter-ranges` / C: — / S: — | freq[1..M] と prefix count を作る。各 d で同値 pair C(freq[d],2) を加え、l=d+1,d+2d,… の quotient区間 [l,min(M,l+d−1)] にいる個数へ floor(l/d)·freq[d] を掛けて加える。 |
| [abc356-f](../../src/content/technique-inventory/shard-01/abc356-f.json) | 維持 | なし | 維持 | P: `maintain-ordered-set-statistics` / C: — / S: `compress-sparse-keys`、`design-associative-range-summary` | 全 x を圧縮し ordered set active を持つ。各 active point の存在Aと、その点からactive successorへのgap≤Kを表すBを segment tree に格納する。toggle時は前後点を求め B を張替えAを更新。query x ではBが連続して1の最大左右範囲をsegtreeのmax_right/min_leftで探し、その範囲のA合計を返す。 |
| [abc356-g](../../src/content/technique-inventory/shard-02/abc356-g.json) | 維持 | なし | 維持 | P: `restrict-geometric-candidates-to-boundary` / C: — / S: — | 重複Bでは最小Aなど支配点を除き、(B,A) の下側凸包を構築する。各query q=C/D の傾きについて、最小A/B点の判定、最大B点の判定後、chain上で A/B≤q から >q へ変わる隣接点を二分探索する。線分と A=qB の交点B_optを求め D/B_opt を出力する。 |

### ABC357

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc357-e](../../src/content/technique-inventory/shard-04/abc357-e.json) | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: — | 全indegreeとreverse adjacencyを作り、queueでindegree0頂点を削除し順序を保存する。残存未訪問頂点ごとにcycleを列挙して長さ c をansCountへ代入する。削除順を逆にたどり count[u]=count[a_u]+1 とし、全 count を64 bitで合計する。 |
| [abc357-f](../../src/content/technique-inventory/shard-03/abc357-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: `design-associative-range-summary` | leaf iを (1,A_i,B_i,A_iB_i) とする。opは各成分和。mapping(x,y,node)で sumAB+=y sumA+x sumB+len xy、sumA+=len x、sumB+=len y。lazy tagは加算合成する。type1/2をrange apply、type3でrange productのsumABを出す。 |
| [abc357-g](../../src/content/technique-inventory/shard-03/abc357-g.json) | 維持 | 現順維持 | 維持 | P: `correct-overlap-by-inversion` / C: `compute-online-relaxed-convolution` / S: `divide-search-space-recursively`、`formulate-combinatorial-coefficients` | 始点・終点、M個の実wall、階段境界を表す二系列の仮wallをtopological順に置く。combinationでg(a,b)を O(1) 評価し、実wallを含む遷移は直接加算する。仮wall系列間はCDQで左halfの確定dpと差kernelをNTT畳み込みし右halfへ反映する。終点dpの符号を直して答える。 |

### ABC358

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc358-e](../../src/content/technique-inventory/shard-05/abc358-e.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: — | factorial/inverse factorialでC(n,k)を前計算する。dp[0]=1とし各文字cについて next[j]=Σ_{k=0}^{min(C_c,j)}dp[j−k]C(j,k) を計算する。26種類後のdp[1..K]を合計する。 |
| [abc358-f](../../src/content/technique-inventory/shard-02/abc358-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: — | K<Nまたは(K−N)奇数ならNo。残りextra=(K−N)/2を、行pair/列snakeの定型構成でコの字迂回へ割り当て、(1,M)から(N,M)までK個のdistinct cells列を作る。水平・垂直の壁配列を全て閉じ、pathの連続cell間だけ対応壁を開け、入口・出口も開けて出力する。 |
| [abc358-g](../../src/content/technique-inventory/shard-01/abc358-g.json) | 維持 | なし | 維持 | P: `close-eventual-dp-tail` / C: — / S: `design-grid-table-dp` | T=min(K,HW) とし dp[0][start]=0。t=1..Tで各cellへ前layerの自分と四neighborの最大＋A_cellを計算する。各 t（0も含む）とcellで dp[t][cell]+(K−t)A_cell を答え候補にする。 |

### ABC359

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc359-e](../../src/content/technique-inventory/shard-05/abc359-e.json) | 維持 | なし | 維持 | P: `prune-dominated-candidates-once` / C: — / S: — | sum=0と空stackを用意する。各H_iについて、top.height≤H_iの間は組を取り出し、そのcountをまとめてsumからheight×countを引く。まとめた個数に新位置の1を加えた(H_i,count)を積み、sumへH_i×countを加えて、sum+1を出力する。 |
| [abc359-f](../../src/content/technique-inventory/shard-00/abc359-f.json) | 維持 | なし | 維持 | P: `allocate-by-convex-marginal-costs` / C: — / S: `enumerate-frontier-best-first`、`prove-greedy-order` | answer=ΣA_i、d_i=1で初期化し、各頂点の次の増分3A_iをheapへ入れる。N−2回、最小増分をanswerへ加えた頂点のd_iを1増やし、新しいA_i(2d_i+1)をheapへ戻す。 |
| [abc359-g](../../src/content/technique-inventory/shard-01/abc359-g.json) | 維持 | なし | 維持 | P: `build-balanced-separator-decomposition` / C: — / S: `reorder-counting-contributions` | 現在成分の重心cを求め、DFSで各頂点のラベル、深さ、所属するcの子部分木を集める。ラベル別全数・深さ和からcを端点とする寄与と異なる子部分木間の寄与を加え、子部分木内だけの寄与を差し引く。cを除いた各成分へ再帰する。 |

### ABC360

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc360-e](../../src/content/technique-inventory/shard-02/abc360-e.json) | 維持 | なし | 維持 | P: `propagate-probability-distribution` / C: — / S: `compute-in-modular-arithmetic`、`normalize-equivalent-states` | p=1からK回、leave=2(N−1)/N²、enter=2/N²としてp←p(1−leave)+(1−p)enterを法上で更新する。最後に先頭以外の位置番号平均を用いて期待値を計算する。 |
| [abc360-f](../../src/content/technique-inventory/shard-02/abc360-f.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `compress-sparse-keys`、`design-range-update-action` | 各区間から二つの有効な(l範囲,r範囲)長方形を作り、l開始時の+1と終了後の−1 eventへする。l候補を昇順に処理してr圧縮区間へrange addし、rootの最大値と最小argmaxで答えを辞書順更新する。最大値0なら(0,1)も候補に含める。 |
| [abc360-g](../../src/content/technique-inventory/shard-02/abc360-g.json) | 維持 | なし | 維持 | P: `aggregate-subsequence-transitions-by-value` / C: — / S: `compress-sparse-keys`、`design-associative-range-summary` | A_iと必要な隣接候補値を座標化し、値ごとの最良長を持つ構造を未変更・変更済み用に用意する。左から各iを処理し、通常採用のprefix最大+1と、ここで変更を使う遷移、既に変更済みからA_iを採る遷移を更新する。全状態の最大を答えとする。 |

### ABC361

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc361-e](../../src/content/technique-inventory/shard-04/abc361-e.json) | 維持 | なし | 維持 | P: `use-tree-diameter-extrema` / C: — / S: — | 辺重み総和Sを求める。任意頂点から最遠点uを探索し、uからの最遠距離Dをもう一度の木走査で求める。答えとして2S−Dを出力する。 |
| [abc361-f](../../src/content/technique-inventory/shard-05/abc361-f.json) | 維持 | なし | 維持 | P: `invert-divisor-lattice-by-mobius` / C: — / S: `partition-integer-parameter-ranges` | 答えをx=1の1で始める。b=2..59についてbがsquare-freeかと素因数個数の偶奇を調べ、二分探索で最大a≥2 satisfying a^b≤Nを得る。その個数a−1を包除符号に従って加減する。 |
| [abc361-g](../../src/content/technique-inventory/shard-03/abc361-g.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: `linearize-events` | 石を近傍探索可能な集合に入れ、Chebyshev距離2以内を辺とする成分を列挙する。各成分で石の周囲空点を集め、外側基準から四近傍BFSして周辺点の内外を分類する。各行へ外→石列→内を+1、内→石列→外を−1のeventとして置き、x順にnesting depthを更新し、depth>0の石でない格子点数を区間長で加える。 |

### ABC362

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc362-e](../../src/content/technique-inventory/shard-03/abc362-e.json) | 維持 | なし | 維持 | P: `design-order-preserving-dp` / C: — / S: — | ans[1]=Nとする。iをN−1から0へ、j>iを走査してd=A_j−A_iを得る。dp[i][2][d]へ1を足し、各l≥3でdp[j][l−1][d]をdp[i][l][d]へ加える。同時に各追加分をans[l]へ法上で加算し、全長の答えを出力する。 |
| [abc362-f](../../src/content/technique-inventory/shard-05/abc362-f.json) · [指摘](#finding-abc362-f) | 維持 | なし | **変更** | P: `reorder-counting-contributions` / C: — / S: `recover-valid-witness` | 部分木サイズから重心gを一つ選ぶ。gを除く各連結成分をDFS順で一つずつ配列Aへ連結し、Nが偶数なら末尾へgを加える。i=0..floor(N/2)−1についてA[i]とA[i+floor(N/2)]をpairとして出力する。 |
| [abc362-g](../../src/content/technique-inventory/shard-04/abc362-g.json) | 維持 | なし | 維持 | P: `build-suffix-lcp-index` / C: — / S: — | Sのsuffix arrayを構築する。各query Tで、suffixとTを比較するlower boundを求め、次にTへ仮想的な最大終端文字を付けた上側境界のlower boundを求める。二位置の差を出力する。 |

### ABC363

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc363-e](../../src/content/technique-inventory/shard-05/abc363-e.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: — | remaining=HWとし、外周の未登録cellを標高bucketへ入れる。k=1..Yでbucket[k]をqueueとして最後まで処理し、cellを沈めてremainingを減らす。未登録の四近傍はyear=max(k,A)がY以下ならそのbucketへ登録する。各年処理後のremainingを出力する。 |
| [abc363-f](../../src/content/technique-inventory/shard-02/abc363-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `decompose-by-prime-or-divisor` | 関数f(n)をmemo化する。nの十進表記が0なしの回文ならその文字列を返す。そうでなければ2≤x≤floor(sqrt(n))を試し、xが0なしでn%x=0、y=rev(x)でも割れるならf(n/x/y)を呼ぶ。成功時は左右をx,yで包み、全候補失敗なら不存在を返す。 |
| [abc363-g](../../src/content/technique-inventory/shard-05/abc363-g.json) | 維持 | なし | 維持 | P: `rollback-reversible-updates` / C: — / S: `characterize-bipartite-feasibility-by-hall`、`decompose-ranges-into-segment-tree-nodes`、`design-range-update-action` | 各仕事の初期値と更新後versionについて有効な時刻区間を求め、time segment treeへ登録する。DFSでnode内の仕事を順に追加し、Hall余裕fをrange add/minで管理する。invalidなら追加を可能にする選択済み仕事の最小報酬候補を補助set・segment treeで求め、利益が増す場合だけ交換する。葉で選択報酬和を出力し、退出時に全操作をrollbackする。 |

### ABC364

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc364-e](../../src/content/technique-inventory/shard-04/abc364-e.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | dp[0][0]=0、他を∞とする。各料理(A_i,B_i)についてkと甘さaを降順に走査し、dp[k+1][a+A_i]をdp[k][a]+B_iでmin更新する。a≤Xかつdp[k][a]≤Yとなる最大kを探し、min(k+1,N)を出力する。 |
| [abc364-f](../../src/content/technique-inventory/shard-04/abc364-f.json) · [指摘](#finding-abc364-f) | 維持 | なし | **変更** | P: `construct-optimal-spanning-tree` / C: — / S: `maintain-connectivity-components`、`maintain-ordered-set-statistics` | queryをC昇順にsortし、setへ境界1..N−1を入れる。各(L,R,C)でlower_bound(L)からR未満の境界を順に取り出して削除し、その個数kに対して(k+1)Cを答えへ加える。全query後にsetが空なら答え、残れば−1を出力する。 |
| [abc364-g](../../src/content/technique-inventory/shard-01/abc364-g.json) | 維持 | なし | 維持 | P: `solve-steiner-tree-by-subset-dp` / C: — / S: `model-and-compute-shortest-path` | 固定terminal i=1..K−1についてdp[1<<i][i]=0、他を∞とする。maskを昇順に処理し、全非空proper submaskとの和で各vをmin更新する。そのdp列を初期距離にmulti-source Dijkstraして全辺緩和する。full maskについてv=K..Nのdp[full][v]を出力する。 |

### ABC365

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc365-e](../../src/content/technique-inventory/shard-03/abc365-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | 必要な各bit bについてC=0からA_iのb bitを順にxorし、prefix parity 0/1の個数を数える。同bitが1の全非空区間数cnt0·cnt1からA_iの当該bitが1の個数を引き、2^b倍して答えへ加える。 |
| [abc365-f](../../src/content/technique-inventory/shard-04/abc365-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: — | 各行をsummary(f=[L_i,U_i],g=[L_i,U_i],C=1)としてsegment treeへ載せる。queryは必要なら始終点をswapし、中間の行summaryを左から合成する。開始yへsummaryのcost式を適用して横断costを得て、到達y=clamp(startY,f)からtargetYまでの差を足す。 |
| [abc365-g](../../src/content/technique-inventory/shard-04/abc365-g.json) | 維持 | なし | 維持 | P: `balance-heavy-light-threshold` / C: — / S: `maintain-monotone-window` | 記録(T_i,P_i)を人別の在室区間列へ変換する。threshold Cを入力規模とquery数に応じて選び、区間数>Cの人ごとに全eventを走査して全相手との同時時間を保存する。queryでheavyが含まれれば表を返し、両者lightなら二区間列をtwo pointersで交差集計する。 |

### ABC366

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc366-e](../../src/content/technique-inventory/shard-01/abc366-e.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `maintain-monotone-window` | R=max座標絶対値+Dとし、x座標列をsortしてf(−R)を直接求め、−R..Rを点数差分で更新してFを作る。yについてGも作る。両列をsortし、各F値に対してG≤D−Fの個数を単調pointerで数えて総和する。 |
| [abc366-f](../../src/content/technique-inventory/shard-00/abc366-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `design-resource-dp` | 関数を(A−1)/Bの非増加順にsortする。dp[k]をsorted順でk個選んだ合成の最大中間値として、適切な方向に走査し、不採用dp[k]と採用A_i·dp[k−1]+B_iを比較する。初期入力1からK個採用した値を出力する。 |
| [abc366-g](../../src/content/technique-inventory/shard-00/abc366-g.json) | 維持 | なし | 維持 | P: `solve-linear-system-and-rank` / C: — / S: `accelerate-set-operations-with-bitsets`、`recover-valid-witness` | 隣接行列の各rowをbit maskにしてGF(2) Gaussian eliminationを行う。各free変数を1としたkernel基底vectorを復元し、そのORが全N bitを覆わなければNo。覆うなら基底b_kごとに、b_kの頂点i成分が1ならanswer_iのk bitを立て、Yesと全answerを出力する。 |

### ABC367

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc367-e](../../src/content/technique-inventory/shard-01/abc367-e.json) | 維持 | なし | 維持 | P: `jump-deterministic-transition` / C: — / S: — | P[0]=Xとし、k=1..59でP[k][i]=P[k−1][P[k−1][i]]を作る。Q_i=iから始め、Kのk bitが1ならQ_i=P[k][Q_i]へ全位置を更新する。最後に各iへA[Q_i]を出力する。 |
| [abc367-f](../../src/content/technique-inventory/shard-04/abc367-f.json) | 維持 | なし | 維持 | P: `compare-algebraic-objects-by-random-fingerprint` / C: — / S: `design-and-bound-randomized-algorithm` | 値1..Nへ十分広いrandom hashを割り当て、AとBのhash prefix sumを構築する。各queryで区間長が異なればNo、同じなら二つの区間hashを差分で求め、一致時Yes、不一致時Noを返す。必要なら独立hashを複数併用する。 |
| [abc367-g](../../src/content/technique-inventory/shard-04/abc367-g.json) | 維持 | なし | 維持 | P: `factor-separable-linear-transform` / C: — / S: `encode-counting-by-generating-function` | 値頻度cntを長さ2^20で作りFWTして各tのB_tを得る。b=0..Nについて多項式(1+x)^b(1−x)^(N−b)をx^M−1で剰余した定数項F[b]を前計算し、transform領域の値Vhat[t]=F[B_t]とする。inverse FWTでC_zを復元し、ΣC_z·z^Kを法上で計算する。 |

### ABC368

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc368-e](../../src/content/technique-inventory/shard-01/abc368-e.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: — | 全列車の(S_i,departure,i)と(T_i,arrival,i)を作り、時刻昇順・同時刻はarrival優先でsortする。駅別lastArrivalを初期化し、departureで最小遅延X_iを決定し、arrivalでT_i+X_iを到着駅のmaxへ反映する。列車2..MのXを出力する。 |
| [abc368-f](../../src/content/technique-inventory/shard-02/abc368-f.json) | 維持 | なし | 維持 | P: `classify-game-states` / C: — / S: `decompose-by-prime-or-divisor` | 最大Aまでsmallest prime factorまたはΩ値をsieveで前計算し、各A_iを割りながら重複込み素因数数x_iを得る。全x_iのbitwise XORを取り、0ならBob、非0ならAnnaを出力する。 |
| [abc368-g](../../src/content/technique-inventory/shard-04/abc368-g.json) | 維持 | なし | 維持 | P: `bound-monotone-total-work` / C: — / S: `maintain-ordered-set-statistics`、`maintain-weighted-prefix-statistics` | type 1ではAのrange-sum構造を一点更新し、type 2ではB_i>1かに応じてordered setを挿入・削除する。type 3ではpos=lから次の特殊index jまでのA和をvへ足し、j≤rならv=max(v+A_j,vB_j)として先へ進む。残りA和を加えて出力する。 |

### ABC369

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc369-e](../../src/content/technique-inventory/shard-04/abc369-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: `compute-all-pairs-distance` | Floyd-Warshallでdist[u][v]を全pairについて求める。各queryのK橋indexをpermutationし、各bit maskで端点方向を決め、島1から各橋入口、橋出口から次入口、最後の出口から島Nまでのdistと橋重みを足す。全候補最小を出力する。 |
| [abc369-f](../../src/content/technique-inventory/shard-04/abc369-f.json) | 維持 | なし | 維持 | P: `design-lis-frontier` / C: — / S: `recover-valid-witness` | coinを(row,column)で昇順sortする。columnを順に見てdの最初の値>columnとなる位置jをupper_boundし、d[j],id[j]を更新、j>0ならpre[i]=id[j−1]とする。最長末尾からcoin列を復元し、(1,1)、各coin、(H,W)の間を必要なDとRで繋いだpathを出力する。 |
| [abc369-g](../../src/content/technique-inventory/shard-00/abc369-g.json) · [指摘](#finding-abc369-g) | 維持 | なし | **変更** | P: `allocate-by-convex-marginal-costs` / C: — / S: `aggregate-rooted-tree`、`merge-small-into-large` | 葉はbest=0を返す。内部uでは各子vからcandidate=best_v+2L_{uv}を得て最大一つをbest_uとして親へ返し、残りcandidateとu自身分の0をglobal配列へ追加する。rootのbestとglobal配列を合わせて降順限界利得列を作り、そのprefix sumをK=1..Nの答えとして出力する。 |

### ABC370

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc370-e](../../src/content/technique-inventory/shard-04/abc370-e.json) | 維持 | なし | 維持 | P: `subtract-exception-transitions` / C: — / S: — | B_0=0、dp[0]=1、all=1、bucket[0]=1で始める。n=1..Nでprefix B_nを更新し、dp[n]=(all−bucket[B_n−K]) mod 998244353とする。その後allへdp[n]を足し、bucket[B_n]へも足す。dp[N]を出力する。 |
| [abc370-f](../../src/content/technique-inventory/shard-03/abc370-f.json) | 維持 | なし | 維持 | P: `maintain-monotone-window` / C: — / S: `jump-deterministic-transition`、`prove-and-search-threshold` | Aを二回並べる。候補Xごとにtwo pointersでf(i)=和が初めてX以上となるexclusive終端を全iに作り、binary liftingでf^K(i+1)を求める。いずれかのiで一周内ならfeasibleとしてXを二分探索する。最大Xでもう一度全iを判定し、valid start数cとともにX,N−cを出力する。 |
| [abc370-g](../../src/content/technique-inventory/shard-05/abc370-g.json) | 維持 | なし | 維持 | P: `sum-multiplicative-function-by-min25-sieve` / C: — / S: `partition-integer-parameter-ranges` | 各eについてg(p^e)=C(e+M−1,M−1)、h(p^e)は幾何和1+p+…+p^eのmod3判定で0またはgとする。Lucy DPでq=floor(N/i)ごとのΣ_{p≤q}g(p),Σh(p)を、hでは素数のmod3 classも分けて得る。それぞれを初期値にprimeを逆順処理する簡略Min_25 DPでG(N)=Σg,H(N)=Σhを計算し、G−Hを法上で出力する。 |

### ABC371

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc371-e](../../src/content/technique-inventory/shard-03/abc371-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | 各値の出現位置列を作り、番兵を含む隣接位置差から非出現区間数を計算する。全区間数との差を全値について加算し、64 bit 整数で答えを得る。 |
| [abc371-f](../../src/content/technique-inventory/shard-00/abc371-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: — | X'_i=X_i-i を保持する。T の値と G-T のずれを同じ座標系へ直し、segment tree の max_right/min_left 等で値が G をまたぐ端を探し、区間和から費用を加算して区間全体を G に代入する。 |
| [abc371-g](../../src/content/technique-inventory/shard-01/abc371-g.json) | 維持 | 現順維持 | 維持 | P: `prove-greedy-order` / C: `solve-modular-constraints` / S: `decompose-functional-graph` | P を cycle 分解し、先頭から未確定位置を処理する。現在の操作回数合同類が各 cycle 上で到達する位置を走査して最小の A を選び、同じ制約で確定する cycle 要素をまとめて答えへ反映する。 |

### ABC372

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc372-e](../../src/content/technique-inventory/shard-00/abc372-e.json) | 維持 | なし | 維持 | P: `augment-components-with-metadata` / C: — / S: — | 各頂点を一要素の上位リストで初期化する。type 1 では DSU を併合し、root の二つのリストから大きい順に最大10個を作る。type 2 では root のリスト長を確認して k-1 番目を返す。 |
| [abc372-f](../../src/content/technique-inventory/shard-05/abc372-f.json) | 維持 | なし | 維持 | P: `normalize-common-dp-action` / C: — / S: — | K+N 程度の配列または循環 index で各時刻の dp を同じ領域に対応づける。各手で論理 offset を一つ進め、M 本の追加辺について遷移元の旧値を退避して遷移先へ加算する。 |
| [abc372-g](../../src/content/technique-inventory/shard-01/abc372-g.json) | 維持 | なし | 維持 | P: `optimize-by-line-envelope` / C: — / S: `sum-affine-floors-by-euclid` | A_i/B_i の比較を交差積で行い、同傾き処理後に下包絡線と交点の切上げ x を求める。x∈[1,Xmax) と各有効区間の共通部分に対し floor_sum を適用して総和を得る。 |

### ABC373

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc373-e](../../src/content/technique-inventory/shard-05/abc373-e.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: — | A を元 index 付きで昇順 sort し累積和を作る。各候補と x に対し、候補自身を除いた上位 M 人への最小妨害票を区間和で算出し、候補へ使った分を除く残票と比較する。単調境界を二分探索する。 |
| [abc373-f](../../src/content/technique-inventory/shard-03/abc373-f.json) | 維持 | なし | 維持 | P: `allocate-by-convex-marginal-costs` / C: — / S: `design-resource-dp`、`enumerate-frontier-best-first`、`prove-greedy-order` | 各 w について価値 v の初期限界利得 v-1 を heap に入れ、最大を取って2減らして戻し f_w を前計算する。旧 dp[j-kw]+f_w(k) の最大で容量 dp を更新する。 |
| [abc373-g](../../src/content/technique-inventory/shard-05/abc373-g.json) | 維持 | なし | 維持 | P: `solve-weighted-bipartite-matching` / C: — / S: — | 完全二部グラフの辺 (i,j) に点間距離を置き、Hungarian 法などで最小費用完全マッチングを求める。得られた Q 側の対応 index を各 P_i について出力する。 |

### ABC374

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc374-e](../../src/content/technique-inventory/shard-01/abc374-e.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `prove-greedy-order` | w の上下界を決め打ち二分探索する。各工程で二方向の小範囲全探索から min(P_i s+Q_i ceil(max(0,w-A_i s)/B_i)) を求め、総費用が X を超えた時点で不可とする。 |
| [abc374-f](../../src/content/technique-inventory/shard-03/abc374-f.json) | 維持 | なし | 維持 | P: `design-prefix-partition-dp` / C: — / S: `compress-sparse-keys`、`design-minimal-sufficient-state` | 全 T_i+kX (0≤k≤N) を sort unique する。dp[event][j] を j 件まで出した最小不満度とし、何もしない遷移と、その日に次の1..K件を出して X 日後以降の次 event へ進む遷移を行う。 |
| [abc374-g](../../src/content/technique-inventory/shard-00/abc374-g.json) | 維持 | なし | 維持 | P: `solve-bipartite-matching` / C: — / S: `compute-transitive-closure`、`condense-and-order-directed-graph` | 商品名頂点の遷移グラフを構築して SCC 分解する。縮約 DAG の推移閉包を求め、到達可能な成分対に二部辺を張って最大マッチングを計算し、成分数から引く。 |

### ABC375

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc375-e](../../src/content/technique-inventory/shard-01/abc375-e.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `design-resource-dp` | S%3 を確認し、INF で初期化した二次元 DP の dp[0][0]=0 から各人をチーム1,2,3へ割り当てる。x,y は S/3 以下だけを保持し、rolling array で更新する。 |
| [abc375-f](../../src/content/technique-inventory/shard-04/abc375-f.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `compute-all-pairs-distance` | 先に閉鎖される辺を除いたグラフで APSP を構築する。逆順に type 2 の答えを保存し、type 1 では対応辺を追加して旧距離行列を参照しながら全 x,y を更新する。最後に答えを反転する。 |
| [abc375-g](../../src/content/technique-inventory/shard-04/abc375-g.json) | 維持 | なし | 維持 | P: `identify-bridges-and-articulations` / C: — / S: `model-and-compute-shortest-path` | 両端からの距離を求め、等式を満たす辺で G' を作る。G' に lowlink を適用して橋を列挙し、元の辺が G' の橋なら Yes、それ以外は No とする。 |

### ABC376

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc376-e](../../src/content/technique-inventory/shard-04/abc376-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `maintain-ordered-set-statistics` | A 昇順に並べ、heap が r より前の B の最小 K-1 個を表す時だけ A_r×(B_r+sumHeap) で答えを更新する。その後 B_r を heap へ入れサイズを K-1 に戻す。 |
| [abc376-f](../../src/content/technique-inventory/shard-01/abc376-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | 円環距離と、指定方向の弧に障害位置が含まれるかを定数時間関数にする。各 query で全 j を走査し、二方向について移動費と終了後の他手位置を計算して次 dp を更新する。 |
| [abc376-g](../../src/content/technique-inventory/shard-02/abc376-g.json) · 所見あり | 維持 | なし | 維持 | P: `optimize-tree-order-by-cluster-contraction` / C: — / S: `enumerate-frontier-best-first`、`maintain-connectivity-components`、`prove-greedy-order` | 各頂点を cluster とし比を分数比較する max-heap に入れる。生存する最大 cluster v を取り、その現在の親 p へ DSU 的に縮約し、(C0,C1) と親関係を更新して再挿入する。最後の転倒数から期待値を作る。 |

### ABC377

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc377-e](../../src/content/technique-inventory/shard-00/abc377-e.json) | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: `compute-in-modular-arithmetic` | 未訪問位置から P を辿って cycle 配列を作る。shift=2^K mod length を高速冪で求め、cycle[j] の答えを cycle[(j+shift) mod length] とする。 |
| [abc377-f](../../src/content/technique-inventory/shard-02/abc377-f.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `correct-overlap-by-inversion` | 行 r、列 c、対角 r-c、反対角 r+c の集合を作る。各 unique line の長さを計算し、方向を一つずつ追加するとき既存方向との有効交点を列挙して、その線上で既出の交点数を差し引く。N^2 から攻撃和集合を引く。 |
| [abc377-g](../../src/content/technique-inventory/shard-01/abc377-g.json) | 維持 | なし | 維持 | P: `index-shared-prefixes-with-trie` / C: — / S: — | trie root を空文字列長0で初期化する。S_k を辿りながら node の minLen を使い \|S_k\|+minLen-2i を評価し、出力後に path 上の minLen を \|S_k\| で chmin する。 |

### ABC378

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc378-e](../../src/content/technique-inventory/shard-00/abc378-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `maintain-weighted-prefix-statistics` | S_0=0 を Fenwick tree と prefix総和へ入れる。r=1..N で S_r を更新し、過去値のうち S_r より大きい数を取得して寄与を加えた後、S_r を登録する。 |
| [abc378-f](../../src/content/technique-inventory/shard-05/abc378-f.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | 任意根でDFSし、a_vを「vが次数2ならその1頂点、次数3なら子方向から次数3だけを内部にして到達できる次数2端点数」とする。deg(v)=2では、最初の内部頂点を必ず1個含めるためdeg(child)=3のchildについてだけΣa_childを答えへ加え、a_v=1とする。deg(v)=3ではΣ_{i<j}a_i a_jを加えてa_v=Σa_iとし、それ以外はa_v=0とする。 |
| [abc378-g](../../src/content/technique-inventory/shard-00/abc378-g.json) | 維持 | なし | 維持 | P: `translate-sequences-by-rsk` / C: — / S: `design-minimal-sufficient-state` | 長方形欠損形の各行の充填長を状態にし、標準 tableau の行列増加条件と追加の右端不等式を壊さない外角へ次の数を置く DP を行う。得た tableau 数を RSK のもう一方の tableau 数と組み合わせる。 |

### ABC379

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc379-e](../../src/content/technique-inventory/shard-05/abc379-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | 文字 digit を整数化し prefixWeighted += i×digit として A_i を保存する。逆順に carry へ A_i を足して digit を出力用 buffer に積み、全 A を使った後も carry が0になるまで桁を伸ばし、反転して出力する。 |
| [abc379-f](../../src/content/technique-inventory/shard-05/abc379-f.json) | 維持 | なし | 維持 | P: `prune-dominated-candidates-once` / C: — / S: — | query を l ごとに bucket する。右から左へ高さ monotone stack を更新し、各 (l,r) で stack の index 列中 r より大きい位置の個数を lower_bound などで取得する。 |
| [abc379-g](../../src/content/technique-inventory/shard-03/abc379-g.json) | 維持 | なし | 維持 | P: `design-frontier-profile-dp` / C: — / S: `design-minimal-sufficient-state` | W が小さい向きへ転置し、最後の W 色を3進または有効状態IDで持つ DP をセル順に更新する。入力が固定色なら一色、?なら三色を試し、左端以外は左、2行目以降は上と異なる場合だけ遷移する。 |

### ABC380

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc380-e](../../src/content/technique-inventory/shard-03/abc380-e.json) | 維持 | なし | 維持 | P: `maintain-ordered-interval-partition` / C: — / S: — | 各位置を長さ1成分として境界set・左端色map・色別個数を初期化する。塗替えで旧色個数を R-L 減らし新色へ足し、右境界、次に左境界を同色なら削除する。count query は色別個数を返す。 |
| [abc380-f](../../src/content/technique-inventory/shard-02/abc380-f.json) | 維持 | なし | 維持 | P: `classify-game-states` / C: — / S: — | solve(mask,turn) を memoize し、手札から一枚出し、必要ならそれより小さい場札を一枚取る全合法手を生成する。子が一つでも losing なら winning、合法手がないか全子 winning なら losing とする。 |
| [abc380-g](../../src/content/technique-inventory/shard-00/abc380-g.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `compute-in-modular-arithmetic`、`maintain-monotone-window`、`maintain-weighted-prefix-statistics` | Fenwick tree で元 permutation の全転倒数と最初の窓の転倒数を求める。窓を一つずつずらして削除・追加の順位数を反映し、各窓の期待値を足して窓数で割る。 |

### ABC381

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc381-e](../../src/content/technique-inventory/shard-04/abc381-e.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: — | 各文字の位置 vector を作る。query [L,R] の feasible(m) を三回の lower_bound/index 加算で実装し、最大 m を二分探索する。存在すれば2m+1、/すらなければ0を返す。 |
| [abc381-f](../../src/content/technique-inventory/shard-00/abc381-f.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `design-minimal-sufficient-state` | 各位置と値の次出現 index を後ろから前計算する。dp[0]=0、他をINFとし、mask と未使用値 x について二回 next を適用して dp[mask\|1<<x] を chmin する。到達 mask の最大 popcount×2を返す。 |
| [abc381-g](../../src/content/technique-inventory/shard-01/abc381-g.json) | 維持 | なし | 維持 | P: `compute-in-finite-field-extension` / C: — / S: `compute-convolution-or-correlation`、`divide-search-space-recursively`、`evaluate-at-geometric-points` | 拡大体要素を pair で実装して一般項係数と周期を求める。周期商の積を高速冪し、残りを平方分割する。F_M(X) を doubling と NTT で構築し、chirp-z transform で等比点評価して全値を掛ける。 |

### ABC382

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc382-e](../../src/content/technique-inventory/shard-00/abc382-e.json) | 維持 | なし | 維持 | P: `solve-stochastic-recurrence` / C: — / S: `design-resource-dp` | 確率を double で持ち、カードごとに枚数分布を後ろ向き更新する。f_0=0 とし、各 i で 1+Σ_{j≥1}g_j f[max(i-j,0)] を計算して 1-g_0 で割り、f_X を出力する。 |
| [abc382-f](../../src/content/technique-inventory/shard-03/abc382-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: — | バーを R 降順に sort し、m_j=H+1 で初期化する。各 (R,C,L) で y=min m[C..C+L)-1 を答えにし、同区間を y へ range assign する。元 index 順に出力する。 |
| [abc382-g](../../src/content/technique-inventory/shard-01/abc382-g.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: — | 符号・軸・平行移動を使って 0≤Sx,Sy<K、Tx,Ty≥0 へ正規化し終点 tile (i,j,k) を特定する。min(i,j) などを再帰式で引き、残る i=0/j=0/(1,1) の基底ケースを K=2、parity、飽和 offset ごとの式で評価する。 |

### ABC383

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc383-e](../../src/content/technique-inventory/shard-05/abc383-e.json) | 維持 | なし | 維持 | P: `sweep-connectivity-by-kruskal-threshold` / C: — / S: `augment-components-with-metadata`、`prove-greedy-order` | 辺を昇順sortし、各頂点のA,B出現回数でDSU成分countを初期化する。異なる成分を辺wで結ぶたびcross方向のpair数だけwを答えへ加え、残countをmergeする。 |
| [abc383-f](../../src/content/technique-inventory/shard-04/abc383-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | 色別商品listを作る。dp[0]=0から色ごとにcur=dpを用意し、各商品を予算降順で「初購入」と「追加購入」の二経路から更新する。色終了後curを次のdpとする。 |
| [abc383-g](../../src/content/technique-inventory/shard-05/abc383-g.json) | 維持 | なし | 維持 | P: `allocate-by-convex-marginal-costs` / C: — / S: `divide-search-space-recursively` | Aの長さK window sum列Bを作る。区間を再帰分割し、各(x,y)境界状態についてj=0..K-1の左右DPを凹列としてmergeし最大を取る。rootの制約なし列から各bar本数の答えを得る。 |

### ABC384

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc384-e](../../src/content/technique-inventory/shard-01/abc384-e.json) | 維持 | なし | 維持 | P: `enumerate-frontier-best-first` / C: — / S: `prove-greedy-order` | 開始cellを吸収済みとして強さへ加え、隣接cellをmin-heapへ入れる。最小候補が現在強さに対する公式条件を満たす間だけpop・吸収し、その未訪問隣接を追加する。 |
| [abc384-f](../../src/content/technique-inventory/shard-04/abc384-f.json) · 所見あり | 維持 | なし | 維持 | P: `decompose-by-prime-or-divisor` / C: — / S: — | k=0..25ごとにmod=2^kとし、空mapからjを順に見る。key=(-A_j mod mod)のcount,sumでd_kへ加算してからA_j mod modへ自身を登録する。最後に層差分式を計算する。 |
| [abc384-g](../../src/content/technique-inventory/shard-05/abc384-g.json) | 維持 | なし | 維持 | P: `schedule-range-query-updates` / C: — / S: `compress-sparse-keys`、`maintain-weighted-prefix-statistics` | queryをX block、block内Y順（必要なら蛇行順）へsortする。current X,Yと答えを保ち、A/B prefix端を動かすたび反対側BITから絶対差和を計算して加減し、自側BITを更新する。 |

### ABC385

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc385-e](../../src/content/technique-inventory/shard-00/abc385-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: — | 全頂点uについて隣接頂点のdegを降順に並べる。x=1..deg(u)を走査し、y=sortedDeg[x-1]-1として1+x+xyの最大を更新し、Nから引く。 |
| [abc385-f](../../src/content/technique-inventory/shard-05/abc385-f.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: — | i=1..N-1について隣接pairの分子H_{i+1}X_i-H_iX_{i+1}と分母X_i-X_{i+1}を広い整数で作り、浮動小数へ変換して比を求める。全比と0の最大を出力する。 |
| [abc385-g](../../src/content/technique-inventory/shard-04/abc385-g.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `divide-search-space-recursively` | i=0..N-2の多項式1+ix+x^2を作り、priority queueによるsmall-to-largeまたは分割統治でconvolutionする。最終積の次数K+N-1の係数をmodで出力する。 |

### ABC386

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc386-e](../../src/content/technique-inventory/shard-00/abc386-e.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: — | allXorを計算する。r=min(K,N-K)個のindex組合せを列挙してxorを求め、K≤N-Kならそのxor、そうでなければallXor xor xorを候補として最大化する。 |
| [abc386-f](../../src/content/technique-inventory/shard-01/abc386-f.json) · 所見あり | 維持 | なし | 維持 | P: `compute-edit-distance` / C: — / S: `design-minimal-sufficient-state` | まず長さ差を判定する。rolling arrayでiを進め、jを[max(0,i-K),min(\|T\|,i+K)]だけ走査し、削除・挿入・一致/置換の標準三遷移をK+1でcapする。最後がK以下か答える。 |
| [abc386-g](../../src/content/technique-inventory/shard-02/abc386-g.json) · 所見あり | 維持 | 現順維持 | 維持 | P: `count-labeled-structures-by-components` / C: `reorder-counting-contributions` / S: `formulate-combinatorial-coefficients` | binomialと冪を前計算する。k=1..Mごとにf[1..N]を連結成分DPで求め、size sの成分を選ぶC(N,s)、外部とのedgeをk以上にする冪、残り内部edgeの自由度を掛けてΣ_G c(G_k)へ加える。threshold和とshift補正をmodで合成する。 |

### ABC387

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc387-e](../../src/content/technique-inventory/shard-04/abc387-e.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `enumerate-bounded-candidates-or-cases` | N<10^6ならa=N..2N-1を走査して二数を直接判定する。それ以外は桁数と上位2桁を読み、対応表からprefixを選んで適切な個数の0を付けたaを文字列で出力する。 |
| [abc387-f](../../src/content/technique-inventory/shard-02/abc387-f.json) | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: `aggregate-rooted-tree`、`factor-and-accelerate-transitions` | functional graphの各cycleを検出・縮約し、逆向き辺を持つforestを作る。postorderでdp[v][j]=∏child Σ_{k≤j}dp[child][k]を計算し、各component rootのΣ_j dp[root][j]を掛ける。 |
| [abc387-g](../../src/content/technique-inventory/shard-05/abc387-g.json) | 維持 | 現順維持 | 維持 | P: `compose-series-and-project-powers` / C: `apply-formal-power-series-operations`、`encode-counting-by-generating-function` / S: `compute-convolution-or-correlation` | prime indicatorからGをN次まで構成する。F=G(x exp F)に対し、compositionをKinoshita–Li法で評価してFPS Newton iterationする（またはH=exp Gからx/H(x)のcompositional inverseを求める）。最後にrooted EGF係数をfactorialで戻す。 |

### ABC388

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc388-e](../../src/content/technique-inventory/shard-04/abc388-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `prove-and-search-threshold` | lo=0,hi=N/2+1で最大Kを二分探索する。判定ではi=0..K-1について上A[i]と下A[N-K+i]が鏡餅条件を満たすか全て確認する。 |
| [abc388-f](../../src/content/technique-inventory/shard-00/abc388-f.json) | 維持 | なし | 維持 | P: `bound-reachability-in-numerical-semigroup` / C: — / S: `design-minimal-sufficient-state` | A=Bなら合同条件をO(M)検査する。A<Bなら小距離のstep和可否をDPし、各safe intervalのhead/tail B座標を作る。座標順に、直前B距離のedgeと同一区間head→tailの複数歩可否でreachableを伝播し、Nを判定する。 |
| [abc388-g](../../src/content/technique-inventory/shard-05/abc388-g.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `design-associative-range-summary`、`maintain-monotone-window` | two-pointerで各iの最小適合index B_iを求め、D_i=B_i-iのrange-max segment treeを作る。query(L,R)では可否式の左辺≤Rとなる最大Kをmonotonic searchする。 |

### ABC389

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc389-e](../../src/content/technique-inventory/shard-01/abc389-e.json) | 維持 | なし | 維持 | P: `allocate-by-convex-marginal-costs` / C: — / S: `prove-and-search-threshold` | xを限界価格としてtotalCost(x)=ΣP_i floor((x/P_i+1)/2)²≤Mの最大xを二分探索する。対応個数cntと残金を求め、価格x+1の限界単位を買えるだけ追加する。 |
| [abc389-f](../../src/content/technique-inventory/shard-04/abc389-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: — | D[x]=xで初期化する。各[L_i,R_i]についてD値がL_i以上になる最初lとR_iより大きくなる最初rをsegment treeのsearchで求め、初期index区間[l,r)へ+1する。最後にquery Xの点値を返す。 |
| [abc389-g](../../src/content/technique-inventory/shard-05/abc389-g.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `encode-counting-by-generating-function`、`formulate-combinatorial-coefficients` | binomialとf(s,x,z)をmod Pで前計算する。rootだけのlayer0から、残labelからx頂点を選ぶ係数を掛け、edge数z・even/odd累積・last sizeを更新する。全頂点使用かつ両parity=N/2の状態をedge数別に出力する。 |

### ABC390

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc390-e](../../src/content/technique-inventory/shard-00/abc390-e.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: `prove-greedy-order` | v=1,2,3ごとに該当foodだけで0/1 knapsackし、budget prefix max M_vを作る。s_v=0からX回、M_v[s_v]が最小のvを一つ選んでs_v++し、最後の三値のminを答える。 |
| [abc390-f](../../src/content/technique-inventory/shard-05/abc390-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: — | 各値のsorted出現位置を作る。c=1..Nについてavoid(pos[c-1])を計算し、二listをmergeしたpos[c-1]∪pos[c]のavoidを引いてg(c)とし、総和へ加える。c=1では値0のlistを空とする。 |
| [abc390-g](../../src/content/technique-inventory/shard-02/abc390-g.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `formulate-combinatorial-coefficients`、`reorder-counting-contributions` | 桁数別countから各(1+10^k x)^{C_k^0}を構築し、小次数順convolutionでF^0を得る。bごとに一次因子で割った係数q_rへr!(N-1-r)!を掛けた重みW_bを計算し、b桁のmの総和×W_bを答えへ足す。 |

### ABC391

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc391-e](../../src/content/technique-inventory/shard-00/abc391-e.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | 文字を(value,cost=1)のleafとし、3要素ずつまとめる。親valueをmajorityで求め、多数派childが2個ならcostのmin、3個ならcostの小さい2個の和を親costとする。N層後のcostを出す。 |
| [abc391-f](../../src/content/technique-inventory/shard-00/abc391-f.json) | 維持 | なし | 維持 | P: `enumerate-frontier-best-first` / C: — / S: — | 各列を降順sortし、(value,0,0,0)をmax-heapへ入れる。K回popし、範囲内の(i+1,j,k),(i,j+1,k),(i,j,k+1)を未訪問なら計算してpushする。K回目のvalueを出力する。 |
| [abc391-g](../../src/content/technique-inventory/shard-01/abc391-g.json) · 所見あり | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `run-dp-on-finite-automaton` | 全maskとc∈a..zについてLCS一行更新後のnext[mask][c]を前計算する。count[0]=1からM回、全state・文字へ遷移加算し、最後にpopcount(state)=kのcountをk別に集める。 |

### ABC392

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc392-e](../../src/content/technique-inventory/shard-02/abc392-e.json) | 維持 | なし | 維持 | P: `augment-components-with-metadata` / C: — / S: `recover-valid-witness` | 最初のDSU走査でforest edgeとredundant edgeを分類する。componentごとに余剰listを持ち、余剰の多いcomponentをhubとして未接続componentの代表へedge一端を付け替え、DSU/listをmergeしながらC-1操作を出力する。 |
| [abc392-f](../../src/content/technique-inventory/shard-02/abc392-f.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `maintain-weighted-prefix-statistics` | 長さNのFenwickを全て1で初期化する。i=N..1についてFenwickのlower_bound(P_i)でposを求め、ans[pos]=i、add(pos,-1)とする。ansを順に出力する。 |
| [abc392-g](../../src/content/technique-inventory/shard-01/abc392-g.json) · 所見あり | 維持 | 現順維持 | 維持 | P: `compute-convolution-or-correlation` / C: `encode-counting-by-generating-function` / S: `formulate-combinatorial-coefficients` | maxSまでの0/1係数配列fを作り、convolution(f,f)を求める。各B∈Sについて(conv[2B]-1)/2を整数で答えへ足す。 |

### ABC393

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc393-e](../../src/content/technique-inventory/shard-01/abc393-e.json) | 維持 | なし | 維持 | P: `decompose-by-prime-or-divisor` / C: — / S: — | freq[value]を数える。d=1..Vでmultipleを走査してt[d]を求める。t[d]≥Kのdについて全multipleへbest[multiple]=dを設定し、各A_iにbest[A_i]を出力する。 |
| [abc393-f](../../src/content/technique-inventory/shard-04/abc393-f.json) | 維持 | なし | 維持 | P: `design-lis-frontier` / C: — / S: `linearize-events` | queryをR別bucketへ入れる。i=1..NでtailsへA_iをlower_bound置換し、R=iの各queryについてtailsをXでupper_boundしたindexを答えとして保存する。 |
| [abc393-g](../../src/content/technique-inventory/shard-02/abc393-g.json) | 維持 | なし | 維持 | P: `optimize-by-lagrangian-relaxation` / C: — / S: `approximate-rational-by-euclid`、`detect-improving-cycles`、`model-min-cost-flow` | rational λごとに分母倍した整数容量でmin-cost circulationを解き、残余graphからpotential B(λ)、変更cost、f(λ)を得る。costがK以上/未満を判定にStern–Brocot探索し、両端のf+KλのminをU、両potentialの適切な凸結合をBとして高精度出力する。 |

### ABC394

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc394-e](../../src/content/technique-inventory/shard-03/abc394-e.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | dist[N][N]=INFとしdist[i][i]=0、全edge i→jに1を設定してmulti-source queueへ入れる。popした(i,j)について文字c別のpred[i][c]とsucc[j][c]を全組し、未訪問(k,l)へdist+2を設定する。 |
| [abc394-f](../../src/content/technique-inventory/shard-01/abc394-f.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | 任意rootでpostorderする。各vの正のchild dpを降順に取り、dp[v]=max(1,1+top3 sum)を計算する。同時にvを完成rootとする1+top4 sum等で最大を更新し、最大が5未満なら-1を出す。 |
| [abc394-g](../../src/content/technique-inventory/shard-02/abc394-g.json) | 維持 | なし | 維持 | P: `share-threshold-checks-by-parallel-binary-search` / C: — / S: `linearize-events`、`maintain-connectivity-components`、`prove-and-search-threshold` | 全grid隣接edgeをcapacity降順にsortする。各queryの[L,R) thresholdを持ち、mid別bucketを作るroundごとにDSUを初期化してedgeをthresholdまで追加し、endpoint連結ならL=mid、否ならR=midと更新する。確定Mから式を出力する。 |

### ABC395

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc395-e](../../src/content/technique-inventory/shard-05/abc395-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | 2N state graphを作り、(1,0)からDijkstraする。移動edgeはcost1、(v,0)↔(v,1)はcostXとし、min(dist[N,0],dist[N,1])を出力する。 |
| [abc395-f](../../src/content/technique-inventory/shard-00/abc395-f.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: — | H候補ごとにpossible=[max(0,H-D_1),min(U_1,H)]から始め、iを進めてpossibleを[possible.low-X,possible.high+X]と歯iの許容区間で交差する。空ならNo。最大Yes Hから総和-NHを出す。 |
| [abc395-g](../../src/content/technique-inventory/shard-04/abc395-g.json) | 維持 | なし | 維持 | P: `solve-steiner-tree-by-subset-dp` / C: — / S: `model-and-compute-shortest-path` | 固定terminal bitmaskについてsubset merge→dense Dijkstra closureを昇順maskで計算する。さらに各s>Kを一つ追加したterminal stateを同じ遷移で計算し、そのstateからtへclosureしたdp値をquery答えとして参照する。 |

### ABC396

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc396-e](../../src/content/technique-inventory/shard-00/abc396-e.json) | 維持 | なし | 維持 | P: `propagate-static-graph-potentials` / C: — / S: `recover-valid-witness` | 各未訪問rootをp=0としてDFS/BFSし、edge(u,v,z)でp_v=p_u xor zを割り当て矛盾検査する。componentごとに各bitのonesを数え、ones>size-onesならtのbitを1にし、A_v=p_v xor tを出す。 |
| [abc396-f](../../src/content/technique-inventory/shard-00/abc396-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `maintain-weighted-prefix-statistics` | Aの初期inversionをFenwickで計算しans[0]とする。c=1..M-1でvalue=M-cのsorted positionsを取り、wrap前寄与とwrap後寄与の差を現在値へ加えてans[c]を出す。 |
| [abc396-g](../../src/content/technique-inventory/shard-02/abc396-g.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: — | 各rowをmask化してfreqを数える。dp[X][0][0]=freq[X]からbit jを増やし、dp[X][j+1][c]+=dp[X][j][c]、dp[X][j+1][c+1]+=dp[X xor 2^j][j][c]とする。全XでΣ_c dp[X][W][c]min(c,W-c)の最小を取る。 |

### ABC397

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc397-e](../../src/content/technique-inventory/shard-03/abc397-e.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | 任意rootでpostorderし、vの未削除childのsizeを足してs=1+Σs_childとする。s<Kならactive child≤1、s=Kならactive child≤2を要求して0へ、s>KならNo。root処理後0ならYes。 |
| [abc397-f](../../src/content/technique-inventory/shard-00/abc397-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: — | prefix/suffix distinct L,Rを前計算する。jを増やしながらcut=1..j-1のscoreをsegment treeに保持し、last[value]以降へ+1、新cutをL_j+1でsetする。X_{j+1}=全体maxを取り、X_i+R_{i+1}を最大化する。 |
| [abc397-g](../../src/content/technique-inventory/shard-00/abc397-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: `prove-and-search-threshold` | d候補ごとにNd threshold nodeを作り、vertex内単調INF edge、元edge由来cost1/INF edge、x_1=0,x_N=dのsource/sink固定を張る。max-flow=min-cutがK以下か判定し、最大dをbinary searchする。 |

### ABC398

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc398-e](../../src/content/technique-inventory/shard-01/abc398-e.json) | 維持 | 現順維持 | 維持 | P: `solve-game-by-parity-invariant` / C: `color-and-classify-bipartite-components` / S: `maintain-interactive-query-protocol` | DFS/BFSでcolorとpart sizeを求め、未edgecross pairをsetへ列挙する。size parityでFirst/Secondを宣言し、自手番ではsetから一辺を出し、相手入力edgeをsetから削除する。 |
| [abc398-f](../../src/content/technique-inventory/shard-05/abc398-f.json) | 維持 | なし | 維持 | P: `characterize-palindrome-intervals` / C: — / S: — | S（またはseparator込み列）へManacher法を適用する。各centerの半径から右端がNに達するpalindromeの最小start kを求め、Sへprefix[0,k)のreverseを連結する。 |
| [abc398-g](../../src/content/technique-inventory/shard-02/abc398-g.json) | 維持 | 現順維持 | 維持 | P: `solve-game-by-parity-invariant` / C: `color-and-classify-bipartite-components` / S: — | 全componentをBFS二色塗りしpart sizes(a,b)、size、edge数を集計してx,ee,oo,eo,isoを求める。公式の四caseを適用し、奇数ならAoki、偶数ならTakahashiを出力する。 |

### ABC399

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc399-e](../../src/content/technique-inventory/shard-04/abc399-e.json) | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: — | Sを走査して各sourceのtargetを確定し矛盾なら-1。26頂点graphの非identity source数を数え、undirected componentごとにsize≥2かつ全頂点indegree=outdegree=1の純cycle数を数える。空きがない不可能caseを除き両者の和を出す。 |
| [abc399-f](../../src/content/technique-inventory/shard-01/abc399-f.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: — | combinationとA_i^pを前計算し、dp[stage][k]をrollingする。各箱でskip、stageを進める仕切り、stage1なら未貼付labelからp≥1枚をその箱へ貼る遷移を行い、全箱後のstage2,k=Kを答える。 |
| [abc399-g](../../src/content/technique-inventory/shard-01/abc399-g.json) | 維持 | なし | 維持 | P: `test-linear-matroid-intersection-rank` / C: — / S: `design-and-bound-randomized-algorithm`、`solve-linear-system-and-rank` | A_1のcolor別row blockとincidence A_2からrandomized Mを構成する。各Lについてrow S_L..をcolor順にbasisへ追加しrankが初めてN-1になるRを記録し、それ以降のRを加算する。必要ならoffline sliding-basis techniqueでO(N²ΣA)へ高速化する。 |

### ABC400

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc400-e](../../src/content/technique-inventory/shard-04/abc400-e.json) | 維持 | なし | 維持 | P: `decompose-by-prime-or-divisor` / C: — / S: — | spf/count配列を0初期化し、count[p]=0のpをprimeとしてp,2p,…へ+1する。count[k]=2ならk²を候補へ追加する。各Aにupper_bound(candidates,A)直前を答える。 |
| [abc400-f](../../src/content/technique-inventory/shard-05/abc400-f.json) | 維持 | なし | 維持 | P: `design-interval-split-dp` / C: — / S: — | Cを二周へ複製する。長さ昇順にdp[l][r]=min_m dp[l][m]+dp[m][r]を計算し、ep[l][r]を端色C_lを残す/部分消去する遷移で更新して全区間消去候補も取る。min_i dp[i][i+N]を出す。 |
| [abc400-g](../../src/content/technique-inventory/shard-04/abc400-g.json) | 維持 | なし | 維持 | P: `optimize-by-lagrangian-relaxation` / C: — / S: `enumerate-subset-state-space` | penaltyを2倍整数qで表し、各選択valueを2V-qとする。8 parity stateでcakeをskip/X/Y/Z選択し、valueと個数をlexicographic更新する。pair数とKの比較でqをbinary searchし、最終penalized optimumへ2Kcを戻して2で割る。 |

### ABC401

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc401-e](../../src/content/technique-inventory/shard-04/abc401-e.json) | 維持 | なし | 維持 | P: `augment-components-with-metadata` / C: — / S: `linearize-events` | adjacencyを使いk=1..Nでvertex kをactivateする。小さい隣接はunionし、大きい隣接をboundary set/countへ登録する。k自身が以前boundaryなら除去する。DSU component(1) size=kならboundary distinct数、否则-1を出す。 |
| [abc401-f](../../src/content/technique-inventory/shard-02/abc401-f.json) | 維持 | なし | 維持 | P: `use-tree-diameter-extrema` / C: — / S: `reorder-counting-contributions` | 各treeで二回BFS/DFSしてdiameter endpointsとdを得て、両端からdistanceを計算しeccentricity列A,Bを作る。Bをsortしprefix sumを作り、各aのlower_bound(D-a-1)でmaxの和を足す。 |
| [abc401-g](../../src/content/technique-inventory/shard-02/abc401-g.json) | 維持 | なし | 維持 | P: `solve-bipartite-matching` / C: — / S: `prove-and-search-threshold` | 全person-button距離をhypotで計算する。mid以下のpairへedgeを張ってmaximum bipartite matching size=Nか判定し、最小feasible thresholdをbinary searchして出力する。 |

### ABC402

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc402-e](../../src/content/technique-inventory/shard-01/abc402-e.json) | 維持 | なし | 維持 | P: `optimize-stochastic-actions` / C: — / S: `enumerate-subset-state-space` | d[mask][x]を0で初期化しx=0..Xを昇順に、全mask・未solve i with C_i≤xについてp_i(S_i+d[mask\|bit][x-C_i])+(1-p_i)d[mask][x-C_i]でmax更新する。d[0][X]を出す。 |
| [abc402-f](../../src/content/technique-inventory/shard-05/abc402-f.json) · [指摘](#finding-abc402-f) | 維持 | なし | **変更** | P: `split-enumeration-space` / C: — / S: `prove-and-search-threshold` | 10冪mod Mでcell weightを作る。DFS/DPでstartから各反対角cellまでのsum residue、goalから同cell直後までのsum residueを列挙する。後半listをsortし各前半xへlower_bound(M-x)直前または末尾を組み合わせてmaxを取る。 |
| [abc402-g](../../src/content/technique-inventory/shard-01/abc402-g.json) | 維持 | なし | 維持 | P: `sum-affine-floors-by-euclid` / C: — / S: — | 必要ならB1,B2をswapする。剰余積展開のpolynomial項を閉形式で求め、各mixed項を一般化floor sumへ渡す。floor1·floor2は差cの恒等式でq=1,2の単独floor和へ置換し、全項を64/128 bit整数で合成する。 |

### ABC403

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc403-e](../../src/content/technique-inventory/shard-00/abc403-e.json) | 維持 | なし | 維持 | P: `bound-monotone-total-work` / C: — / S: `index-shared-prefixes-with-trie` | Trie の根から文字列終端までを走査する。T=2 では経路上の X 終端を調べつつ各 Z_v に登録し、未除外なら有効数を増やす。T=1 では終端フラグを立て、Z_v の各 Y を未除外なら無効化して集合を空にし、現在の有効数を出力する。 |
| [abc403-f](../../src/content/technique-inventory/shard-04/abc403-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `decompose-by-prime-or-divisor`、`recover-valid-witness` | 各 i を昇順に処理し、repunit に一致すれば両状態を初期化する。j=1..i-1 の加算分割から expr と括弧付き term を、j\|i かつ j,i/j>1 の因数分解から term 同士の積を両状態へ緩和し、dpExpr[N] を出力する。 |
| [abc403-g](../../src/content/technique-inventory/shard-04/abc403-g.json) | 維持 | なし | 維持 | P: `maintain-sparse-domain-segment-tree` / C: — / S: — | 根区間を [1,10^9+1) として x_i の根から葉までだけ生成し、葉の個数を 1 増やす。帰りがけに parity 付き結合で三つ組を更新し、root.odd を z として出力して次の x_i を計算する。 |

### ABC404

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc404-e](../../src/content/technique-inventory/shard-02/abc404-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: — | A_i=1 の位置を昇順に見る。最初は目標を茶碗 0、各豆について [l,r]=[x,x] から l=min_{i∈[l,r]}(i-C_i) を繰り返し、区間が直前の統合位置へ届くまでの回数を答えへ加えて豆を合流させる。単純走査なら全体 O(N^2)、区間最小構造なら高速化もできる。 |
| [abc404-f](../../src/content/technique-inventory/shard-03/abc404-f.json) | 維持 | なし | 維持 | P: `optimize-stochastic-actions` / C: — / S: `normalize-equivalent-states` | 最終ターン後を k≥K なら 1、それ以外 0 で初期化する。各 t,k について h[n][s]=max_{c_1+…+c_n=s,c_i>0}ΣDP[t+1][min(K,k+c_i)] を正の c で更新し、max_n(h[n][M]+(N-n)DP[t+1][k])/N を DP[t][k] とする。 |
| [abc404-g](../../src/content/technique-inventory/shard-03/abc404-g.json) | 維持 | なし | 維持 | P: `solve-difference-constraints` / C: — / S: `linearize-static-range-information` | 頂点 0..N のグラフを作り、X_v≤X_u+c を辺 u→v, 重み c に変換する。B_N=0 を始点として Bellman-Ford で距離を緩和し、N 回後にも更新があれば -1、なければ -dist[0] を出力する。 |

### ABC405

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc405-e](../../src/content/technique-inventory/shard-00/abc405-e.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: `compute-in-modular-arithmetic` | mod 998244353 で 0..A+B+C+D の factorial と inverse factorial を用意する。i=0..C について comb(A+B+i,B)×comb(D-1+C-i,D-1) を加算する。 |
| [abc405-f](../../src/content/technique-inventory/shard-03/abc405-f.json) | 維持 | なし | 維持 | P: `build-laminar-interval-containment-tree` / C: — / S: `answer-tree-ancestor-queries`、`detect-crossing-by-cyclic-order` | 位置 1..2N を走査し、開閉端点を stack で処理して包含木と各奇数点の m(x) を O(N+M) で作る。深さと binary lifting を前計算し、各 (C,D) に対して m(C),m(D) の LCA から距離を出力する。 |
| [abc405-g](../../src/content/technique-inventory/shard-00/abc405-g.json) | 維持 | なし | 維持 | P: `schedule-range-query-updates` / C: — / S: `aggregate-value-prefix-by-buckets`、`formulate-combinatorial-coefficients`、`maintain-modular-product-under-factor-updates` | factとinvFactを前計算し、queryをMo順に処理する。現在区間へのadd/removeごとに値の頻度と所属bucketの頻度和・逆階乗積をO(1)更新し、各Xについて[1,X)の完全bucketと端数から(k,p)を集約してfact[k]×pを出力する。 |

### ABC406

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc406-e](../../src/content/technique-inventory/shard-01/abc406-e.json) | 維持 | なし | 維持 | P: `count-prefix-constrained-objects` / C: — / S: — | i,j≤60 の f,s を mod 998244353 で前計算する。N の set bit d を降順に見て、それ以前に確定した 1 の数を used、値を prefix とし、s(d,K-used)+prefix·f(d,K-used) を有効範囲なら加算する。最後に popcount(N)=K なら N を足す。 |
| [abc406-f](../../src/content/technique-inventory/shard-05/abc406-f.json) | 維持 | なし | 維持 | P: `flatten-tree-by-euler-order` / C: — / S: `maintain-weighted-prefix-statistics` | 頂点 1 を根に DFS し tin[v],tout[v],parent と各辺の child を求める。Fenwick tree を初期値 1 で構築し、type 1 は tin[x] へ w 加算して total も更新、type 2 は sub=sum(tin[child]..tout[child]) として abs(total-2sub) を出力する。 |
| [abc406-g](../../src/content/technique-inventory/shard-01/abc406-g.json) | 維持 | なし | 維持 | P: `maintain-piecewise-linear-convex-function` / C: — / S: `maintain-ordered-set-statistics`、`recover-valid-witness` | 初期位置 0 を表す凸関数から始める。各 i で現在関数の傾きを [-C,C] に clip して g_i を作り、D\|X_i-x\| を加える。最小値を出力し、保存した変化点更新を後ろから undo しながら最終 minimizer を各不変区間へ射影して A_N..A_1 を復元する。 |

### ABC407

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc407-e](../../src/content/technique-inventory/shard-00/abc407-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `enumerate-frontier-best-first` | max-heap に A_i を持つ。ans=A_1 として、k=2..N の各段階で A_{2k-2},A_{2k-1} を追加し、最大値を pop して ans に加える。残り位置を ')' とした括弧列が実行可能で、ans が最大得点である。 |
| [abc407-f](../../src/content/technique-inventory/shard-05/abc407-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `linearize-events`、`linearize-static-range-information`、`maintain-ordered-set-statistics` | sentinel 0,N+1 を持つ set を用意し、(A_i,i) を大きい順に処理する。挿入前の前後 set 要素から L_i,R_i を得て第二差分へ4点加算し、i を set に入れる。最後に配列を二度累積して ans[1..N] を出力する。 |
| [abc407-g](../../src/content/technique-inventory/shard-04/abc407-g.json) | 維持 | なし | 維持 | P: `model-min-cost-flow` / C: — / S: — | 各セルを parity で左右に分け、source→片側と他側→sink に容量1・費用0、隣接セル辺に容量1・費用 A_u+A_v+C を張る。min_cost_slope の各流量候補で shiftedCost-C·k を評価し、その最小を totalSum から引く。 |

### ABC408

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc408-e](../../src/content/technique-inventory/shard-03/abc408-e.json) | 維持 | なし | 維持 | P: `optimize-mask-by-bitwise-feasibility` / C: — / S: `maintain-connectivity-components`、`prove-greedy-order` | ans=(1<<30)-1 とする。b=29..0 について cand=ans without bit b を作り、(w_i\|cand)==cand の辺だけで DSU を再構築する。1,N が連結なら ans=cand とし、最後の ans を出力する。 |
| [abc408-f](../../src/content/technique-inventory/shard-04/abc408-f.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: `design-associative-range-summary`、`linearize-events` | p_{H_i}=i を作り、segment tree を -INF で初期化する。h=1..N で h>D なら位置 p_{h-D} に確定済み dp を挿入し、[max(1,p_h-R),min(N,p_h+R)] の最大値 best から、存在すれば dp[p_h]=best+1、なければ0とする。全 dp の最大を出力する。 |
| [abc408-g](../../src/content/technique-inventory/shard-04/abc408-g.json) | 維持 | なし | 維持 | P: `approximate-rational-by-euclid` / C: — / S: — | 各 testcase で n=floor(A/B) を取り両端から n を引く。正規化後の上端が1より大きければ pair=(1,1)、そうでなければ端点を逆数にして f(D/C,B/A) を再帰し pair をswapする。戻りながら p+=nq とし q を出力する。 |

### ABC409

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc409-e](../../src/content/technique-inventory/shard-02/abc409-e.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | 頂点1を根に DFS し、sub[v]=x_v+Σsub[child] を postorder で求める。子 v と親を結ぶ辺重み w について ans+=\|sub[v]\|w とし、sub[v] を親へ加える。最終 sub[root]=0 を確認して ans を出力する。 |
| [abc409-f](../../src/content/technique-inventory/shard-02/abc409-f.json) | 維持 | なし | 維持 | P: `enumerate-frontier-best-first` / C: — / S: `enumerate-bounded-candidates-or-cases`、`maintain-connectivity-components` | 初期 N 頂点の全 unordered pair を heap に入れる。type 1 では新頂点と既存全頂点の pair を追加する。type 2 は連結済み pair を pop し、heap が空なら -1、そうでなければ最小 key k を固定して key=k の pair を全て pop・unionして k を出力する。type 3 は DSU.same を返す。 |
| [abc409-g](../../src/content/technique-inventory/shard-05/abc409-g.json) · [指摘](#finding-abc409-g) | **変更** | **変更** | **変更** | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `formulate-combinatorial-coefficients`、`solve-stochastic-recurrence` | mod 998244353 上で p=P/100、factorial・inverse factorial・p の累乗と f を前計算する。F(x)=Σ_{j=0}^{N-2}f(j)(N-j-2)!x^j、G(x)=Σ_{i=0}^{N-2}(1-p)^i/i!x^i を convolution し、E_k=p^{k-1}/(k-2)!·coef[N-k] を k=2..N で得る。E_1=N-Σ_{k=2}^N E_k とする。 |

### ABC410

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc410-e](../../src/content/technique-inventory/shard-01/abc410-e.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | dp[M]=H、他を -1 で初期化する。各 (A_i,B_i) で next を -1 にし、dp[m]≥A_i なら next[m]をdp[m]-A_iで、m≥B_iならnext[m-B_i]をdp[m]で最大更新する。next が全 -1 なら直前の撃破数を出力し、最後まで到達すれば N。 |
| [abc410-f](../../src/content/technique-inventory/shard-03/abc410-f.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: `enumerate-bounded-candidates-or-cases` | 必要なら盤面を転置してH≤Wにする。各uについて列和Cを0初期化し、d=u..Hで新しい行の±1をCへ加える。Cのprefix sumを左から計算し、同じ値の過去出現回数を答えへ足してから頻度を増やし、全(u,d)の寄与を合計する。 |
| [abc410-g](../../src/content/technique-inventory/shard-03/abc410-g.json) | 維持 | なし | 維持 | P: `aggregate-subsequence-transitions-by-value` / C: — / S: `design-associative-range-summary`、`linearize-events`、`reduce-geometry-to-algebraic-predicates` | 各弦を L=min(A,B),R=max(A,B) として R 昇順に sort する。segment tree で dp[L]=1+max_{x>L}dp[x] を更新し、各 prefix の全体最大 pref[i] を保存する。完成した dp から suffix range max max_{x>R_i}dp[x] を取り、単一 chain 最大と max_i(pref[i]+suffix(R_i+1)) の最大を答える。 |

### ABC411

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc411-e](../../src/content/technique-inventory/shard-02/abc411-e.json) | 維持 | 現順維持 | 維持 | P: `reorder-counting-contributions` / C: `maintain-modular-product-under-factor-updates` / S: `compute-in-modular-arithmetic`、`linearize-events` | (faceValue,dieId) の6N組を sortし、同値groupごとに各 cnt[die] を増やす。積 product と cnt=0 の dice 数 zeros を更新し、CDF=zeros>0なら0、そうでなければ product·6^{-N} とする。隣のdistinct値との差×CDFを最大面値から引いて期待値を得る。 |
| [abc411-f](../../src/content/technique-inventory/shard-03/abc411-f.json) | 維持 | なし | 維持 | P: `merge-small-into-large` / C: — / S: — | 各現在頂点に駒一覧と順序付き隣接setを持ち、各駒から所属頂点への写像も持つ。query端点の所属が異なれば重みの小さい側を選び、その全駒の写像を更新し、全隣接先から旧辺を削除して必要な新辺だけ大側との間へ挿入する。辺数を各削除・挿入に同期させて出力する。 |
| [abc411-g](../../src/content/technique-inventory/shard-00/abc411-g.json) · [指摘](#finding-abc411-g) | 維持 | なし | **変更** | P: `enumerate-subset-state-space` / C: — / S: `normalize-equivalent-states` | 全 edge を C[u][v] に集計し、長さ2の寄与 Σ_{u<v}C_{u,v}(C_{u,v}-1)/2 を先に答えへ加える。s=3..Nごとに dp[{s}][s]=1 から、S⊆{1..s}、未訪問 j<s へ多重度付き遷移する。\|S\|≥3 の各末端 i から C_{i,s} で閉じる総和だけを inv2 倍し、長さ3以上の寄与として答えへ加える。 |

### ABC412

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc412-e](../../src/content/technique-inventory/shard-04/abc412-e.json) | 維持 | なし | 維持 | P: `decompose-by-prime-or-divisor` / C: — / S: — | B=L+1..R の各値を rem に初期化し distinctPrimeCount=0 とする。sieveで得た p≤sqrt(R) ごとにB内最初の倍数から走査し、割れればcountを1増やしてremからpを全て除く。終了後rem>1ならcountを1増やし、元の値が2以上かつcount=1を数え、答えを1から始める。 |
| [abc412-f](../../src/content/technique-inventory/shard-02/abc412-f.json) | 維持 | なし | 維持 | P: `solve-stochastic-recurrence` / C: — / S: `compute-in-modular-arithmetic`、`factor-and-accelerate-transitions`、`prove-greedy-order` | 元のA_Cを1増やし、(A_i,固定tie順,元id)をsortしてCの新indexを記録する。S=ΣA-1、prefix sumを作り、i=N..1で dp_i=(1+suffixWeighted/S)/(1-prefix[i-1]/S) を計算後 suffixWeighted+=A_i dp_i とする。初期色のdpを出力する。 |
| [abc412-g](../../src/content/technique-inventory/shard-01/abc412-g.json) | 維持 | なし | 維持 | P: `solve-min-weight-general-perfect-matching` / C: — / S: — | Xが奇数なら-1。X頂点のHを構築し、一般graph用minimum-weight perfect matching（blossom等）を実行する。matchingなしなら-1、あればweight0/1辺の総和を出力する。Tutte行列を使う場合はentryを乱数·y^{w}とし、detの最小非零次数の半分を同じ答えとして求める。 |

### ABC413

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc413-e](../../src/content/technique-inventory/shard-04/abc413-e.json) | 維持 | なし | 維持 | P: `divide-search-space-recursively` / C: — / S: — | 長さ1ならその要素を返す。区間を等分して左右を再帰的に最小化し、left[0]<right[0]ならleft+right、逆ならright+leftを返す。根の結果を出力し、各levelでのcopyを含め O(N·2^N) とする。 |
| [abc413-f](../../src/content/technique-inventory/shard-03/abc413-f.json) | 維持 | なし | 維持 | P: `solve-cyclic-minimax-game` / C: — / S: `select-state-graph-search` | distを∞、goalsを0でqueueへ入れる。distの小さい順にcell vをpopし、未確定の各grid neighbor uのfixedNeighborCountを増やす。2になった瞬間dist[u]=dist[v]+1としてpushする。最後に有限distを全て加え、∞cellは問題指定どおり0寄与とする。 |
| [abc413-g](../../src/content/technique-inventory/shard-03/abc413-g.json) · [指摘](#finding-abc413-g) | 維持 | なし | **変更** | P: `dualize-planar-cut-to-path` / C: — / S: `maintain-connectivity-components`、`model-max-flow-min-cut` | dual terminal U=top/right outer arc、D=left/bottom outer arcを作る。各obstacleと上下左右のgrid内neighborが作るprimal edgeを一度ずつ見て、horizontalなら上・下face、verticalなら左・右faceをDSUで結ぶ。boundary側faceはU/Dへ対応させる。最後にU,Dが同componentならNo、そうでなければYes。 |

### ABC414

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc414-e](../../src/content/technique-inventory/shard-03/abc414-e.json) · 所見あり | 維持 | なし | 維持 | P: `partition-integer-parameter-ranges` / C: — / S: — | S=0,l=1から、q=N/l、r=N/q、S+=q·(r-l+1)、l=r+1をNまで反復する。ans=N(N+1)/2-Sをmod 998244353で出力する。各項を適宜mod化し、O(sqrt N)区間を処理する。 |
| [abc414-f](../../src/content/technique-inventory/shard-00/abc414-f.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | 頂点1から出る各有向edge状態k=1を距離1で初期化する。state(u,v,k)をpopし、k<Kならw≠uへk+1、k=Kなら全wへ1として緩和する。ただし各(v,nextK)で展開するincomingは先着2個までに制限する。各vのk=K状態の最小距離/Kを答える。 |
| [abc414-g](../../src/content/technique-inventory/shard-05/abc414-g.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: `decompose-ranges-into-segment-tree-nodes` | station leafを共有／0-cost接続した東向きin/out treeと、左右対称な西向きtreeを構築する。東向き(r<L)trainはcover([l,r]) nodesからA、A→B、Bからcover([L,R]) nodesへ上記potential差weightで接続し、西向きも端点を反転して接続する。station1を始点にDijkstraし各station node距離を出力する。 |

### ABC415

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc415-e](../../src/content/technique-inventory/shard-02/abc415-e.json) | 維持 | なし | 維持 | P: `design-grid-table-dp` / C: — / S: — | 各cellのB=A-P_{i+j-1}を計算する。i=H..1,j=W..1の逆順で、goalはmax(0,-B)、他はmax(0,min(dp[i+1][j],dp[i][j+1])-B)とする。dp[1][1]を出力し、rolling rowでもO(W) memoryにできる。 |
| [abc415-f](../../src/content/technique-inventory/shard-03/abc415-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: — | 各文字をlen=1、prefix=suffix=その文字/1、all=true、best=1のnodeへ変換してbuildする。mergeでlen、all、prefix、suffix、bestを更新する。type1はleaf置換、type2はprod(l,r)のbestを出力する。 |
| [abc415-g](../../src/content/technique-inventory/shard-02/abc415-g.json) | 維持 | なし | 維持 | P: `stabilize-unbounded-knapsack-by-best-density` / C: — / S: `prove-greedy-order` | 同じAを最大Bだけにdeduplicateし、cross multiplicationでi*を選ぶ。limit=K(K+1)付近まで、開始xを自由に選べる基底0と条件x≥B_iを反映したunbounded DPで最大追加drink数を求める。各DP state xからi*をfloor((N-x)/D*)回追加する候補を評価し、初期N本を足す。 |

### ABC416

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc416-e](../../src/content/technique-inventory/shard-02/abc416-e.json) | 維持 | なし | 維持 | P: `compute-all-pairs-distance` / C: — / S: — | 頂点0..N-1にsky=Nを加え、road両向きと既存airportのa→sky(T),sky→a(0)を入れてFloyd-Warshallする。query1は二有向edge、query2はskyとの二edgeを各dist[i][j]=min(dist[i][j],dist[i][u]+w+dist[v][j])で全pair更新する。query3は都市間の有限distだけ合計する。 |
| [abc416-f](../../src/content/technique-inventory/shard-01/abc416-f.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: `design-resource-dp` | treeをroot化し、各vで未選択／vをendpointに含むopen／vを内部に含むclosedなどの配列dp[status][k]を初期化する。childの同配列と、edge不使用の並置または両endpoint接続を全k分割でmergeし、vの次数0..2を更新する。rootで全status・k≤Kの最大を取る。 |
| [abc416-g](../../src/content/technique-inventory/shard-00/abc416-g.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `prove-greedy-order` | 比較X+Y vs Y+XでS_minを求めm=\|S_min\|とする。各phase p=0..m-1、長さℓ=1..10についてT∞の対応substringと等しい入力文字列があるかavailable[p][ℓ]を作る。dp[0][0]=0からK回、availableなℓでphaseを進め総長を最小化し、min_p dp[K][p]文字のT∞prefixを出力する。 |

### ABC417

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc417-e](../../src/content/technique-inventory/shard-03/abc417-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `select-state-graph-search` | path=[X],used[X]=trueとする。current≠Yの間、usedを通らずYからDFSしてreachableを作り、currentの隣接頂点のうち未使用かつreachableな最小xを選ぶ。xをpathへ追加・usedにし、最後に列を出力する。 |
| [abc417-f](../../src/content/technique-inventory/shard-01/abc417-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: `compute-in-modular-arithmetic`、`reorder-counting-contributions` | leafをA_iでbuildする。各(L,R)でrange sum sを取得し、v=s·inv(R-L+1) mod 998244353を計算してrange assignする。全操作後に各point value、またはtreeを展開したleafを順に出力する。 |
| [abc417-g](../../src/content/technique-inventory/shard-01/abc417-g.json) | 維持 | なし | 維持 | P: `query-recursively-defined-string` / C: — / S: `bound-monotone-total-work`、`jump-deterministic-transition` | 各新nodeでc_left,c_right、親内offset、saturated length、included lengthからheavy/lightを決め、up[node][k]とoffset[node][k]を作る。回答は(A,B)=(i+1,X_i)から、large k順にBがheavy descendant区間内ならまとめて移り、baseでなければlight childへoffsetを引いて移る。A=0/1の文字を出力する。 |

### ABC418

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc418-e](../../src/content/technique-inventory/shard-03/abc418-e.json) · [指摘](#finding-abc418-e) | 維持 | なし | **変更** | P: `reorder-counting-contributions` / C: — / S: `reduce-integer-structure-by-gcd` | i<jの全pairについてcanonical(dx,dy)の頻度と(x_i+x_j,y_i+y_j)の頻度をmapへ加える。ans=Σ_direction c(c-1)/2-Σ_midpoint d(d-1)/2を64 bitで計算して出力する。 |
| [abc418-f](../../src/content/technique-inventory/shard-02/abc418-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: `maintain-ordered-set-statistics` | a_0=0をsentinelにactive index setを持つ。active iのF_iを predecessor p に対するf(i-p,a_i-a_p)、inactiveはidentityとして、非可換な左→右積をsegment treeで管理する。更新時はxの削除／挿入に伴いF_xとsuccessorのmatrixだけ再計算し、積Mの第0行とlast active以降のfibを掛けて答えを得る。 |
| [abc418-g](../../src/content/technique-inventory/shard-01/abc418-g.json) | 維持 | 現順維持 | 維持 | P: `build-finite-string-automaton` / C: `run-dp-on-finite-automaton` / S: `design-interval-split-dp`、`design-minimal-sufficient-state` | operation tableごとに短いwordのmembershipをinterval attainable-bit DPで判定し、uを増やしてsignature classesからDFAを構築・最小化し、連続二段が同値なら確定する。Tを左からscanし、cnt'[δ(q,c)]+=cnt[q]とstart=iの新規substringを加え、earliest startもmin遷移する。accepting statesから総数Mと最大長Lを更新する。 |

### ABC419

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc419-e](../../src/content/technique-inventory/shard-03/abc419-e.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | i=1..L,k=0..M-1についてf[i][k]=Σ_{p=i,i+L,...}((k-A_p+M)%M)を計算する。dp[0]=0から各class iを処理し、next[(r+k)%M]=min(next,dp[r]+f[i][k])と更新する。L class後のdp[0]を出力する。 |
| [abc419-f](../../src/content/technique-inventory/shard-01/abc419-f.json) | 維持 | 現順維持 | 維持 | P: `build-multi-pattern-automaton` / C: `run-dp-on-finite-automaton` / S: `enumerate-subset-state-space` | S_iをtrieへ挿入して終端nodeにbit iを立て、BFSでfailure link・全26遷移・累積output maskを構築する。dp[start][0]=1からL文字、各state/mask/charでnextStateへ進みmask\|output[nextState]へ加算し、最後にmask=(1<<N)-1を全stateで足す。 |
| [abc419-g](../../src/content/technique-inventory/shard-02/abc419-g.json) | 維持 | 現順維持 | 維持 | P: `kernelize-near-tree-graph` / C: `use-cycle-space-basis` / S: `enumerate-bounded-candidates-or-cases`、`enumerate-by-reversible-backtracking` | degree1非terminalをpeelingし、S={1,N}∪{deg≥3}を作る。各S頂点から未処理edgeを辿って次のS頂点までのdegree2 chainをweighted edge化する。Hでvisited vertexを持つDFSを1から行い、N到着時にans[weightSum]++し、ans[1..N-1]を出力する。 |

### ABC420

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc420-e](../../src/content/technique-inventory/shard-01/abc420-e.json) | 維持 | なし | 維持 | P: `augment-components-with-metadata` / C: — / S: — | parent,size,blackCount,colorを初期化する。type1(u,v)はrootsが異なればunionしてcount和を新rootへ置く。type2(v)はr=find(v)としてwhite→blackならcount[r]++、逆なら--しcolorを反転。type3(v)はblackCount[find(v)]>0ならYes。 |
| [abc420-f](../../src/content/technique-inventory/shard-02/abc420-f.json) | 維持 | なし | 維持 | P: `build-cartesian-tree-decomposition` / C: — / S: `linearize-static-range-information`、`prune-dominated-candidates-once` | 各bottom rowでh_jを更新し、(h_j,j)などの一意順序によるnearest smaller境界からa=i-l+1,b=r-i+1を得る。h_i=0はskipし、gの三rangeをd=K/h_iでも分割して、h_iΣ(αw+β)またはαΣwq_w+βΣq_wを足す。全rowの寄与を64 bitで合計する。 |
| [abc420-g](../../src/content/technique-inventory/shard-05/abc420-g.json) | 維持 | なし | 維持 | P: `decompose-by-prime-or-divisor` / C: — / S: — | D=4X-1、V=\|D\|とする。q=1..floor(sqrt V)でV%q=0ならq,V/qの各positive divisorを集め、それぞれ±をdとしてe=D/dを計算する。d+eとd-e-2が4の倍数でm=(d+e)/4≥0ならnをsetへ加え、昇順に出力する。 |

### ABC421

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc421-e](../../src/content/technique-inventory/shard-04/abc421-e.json) | 維持 | なし | 維持 | P: `optimize-stochastic-actions` / C: — / S: `normalize-equivalent-states` | held multisetをsort tupleでcanonical化し、f(1,S)は残diceを一回振ったscore平均、f(k,S)は各result tupleに対するkeep subset最大の平均としてmemoする。答えはf(3,empty)。 |
| [abc421-f](../../src/content/technique-inventory/shard-00/abc421-f.json) | 維持 | なし | 維持 | P: `maintain-local-sequence-links` / C: — / S: `bound-monotone-total-work` | next[0]=-1から始め、挿入は二本のnextを更新する。削除queryではcurX=x,curY=yと二つの一時和を持ち、両側を一歩ずつ進める。curXがyへ届けばx側の和を出してnext[x]=y、curYがxへ届けばy側の和を出してnext[y]=xとし、中間nodeを列から切り離す。 |
| [abc421-g](../../src/content/technique-inventory/shard-04/abc421-g.json) | 維持 | なし | 維持 | P: `model-min-cost-flow` / C: — / S: `linearize-static-range-information` | sourceから正d_iへcapacity d_i、負d_iからsinkへcapacity -d_i、sourceからNへINF、各rangeにR→L-1 capacity INF cost1を張る。需要Kのmin-cost flowが流れなければ-1、流れればcostを出す。 |

### ABC422

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc422-e](../../src/content/technique-inventory/shard-04/abc422-e.json) | 維持 | なし | 維持 | P: `design-and-bound-randomized-algorithm` / C: — / S: `reduce-geometry-to-algebraic-predicates` | 異なるindex p,qをrandom sampleしa=y_p-y_q,b=x_q-x_p,c=x_p y_q-x_q y_pを作る。全点でax+by+c=0をcountし2count>NならYesと係数を出す。100回失敗ならNo。 |
| [abc422-f](../../src/content/technique-inventory/shard-02/abc422-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `reorder-counting-contributions` | 全n=0..N-1のstate(1,n)をcost0にし、nを大から小へ処理する。元edgeu-vごとに(u,n)→(v,n-1) cost nW_uと逆向きをrelaxし、最終layer0の各vertex距離を出す。rolling layerでspaceを抑える。 |
| [abc422-g](../../src/content/technique-inventory/shard-04/abc422-g.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `compute-in-modular-arithmetic`、`formulate-combinatorial-coefficients` | 次数NまでのF_A,F_B,F_Cでmultiple位置を1、G_A,G_B,G_Cでmultiple位置をinverseFactorialにする。各三積を二回のNTTで畳み込み、Problem1はcoeff N、Problem2はcoeff N×N!を出す。 |

### ABC423

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc423-e](../../src/content/technique-inventory/shard-02/abc423-e.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `linearize-static-range-information` | P0=prefix A_j,P1=prefix jA_j,P2=prefix j²A_jを作る。各queryで区間和s0,s1,s2を取り、-s2+(L+R)s1+(-L+1)(R+1)s0を64bitで出す。 |
| [abc423-f](../../src/content/technique-inventory/shard-04/abc423-f.json) | 維持 | なし | 維持 | P: `apply-subset-zeta-mobius-transform` / C: — / S: — | subset DPでlcm[mask]を一bit追加から計算し、Y超ならY+1へcapする。F[mask]=Y/lcm[mask]を作り、各bitについてmaskにbitなし側からあり側を引くsuperset Möbius transformでGへ変換し、popcount Mを合計する。 |
| [abc423-g](../../src/content/technique-inventory/shard-03/abc423-g.json) · [指摘](#finding-abc423-g) | 維持 | なし | **変更** | P: `solve-modular-constraints` / C: — / S: `split-enumeration-space` | S mod Kと10冪を前計算する。各split(u,l)で小さい側を0…10^size-1列挙し合同式を解き、反対側が指定桁数内ならzero-padして候補文字列を作る。leading zeroを除いた(length,string)順で全d+1候補の最小を出す。 |

### ABC424

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc424-e](../../src/content/technique-inventory/shard-02/abc424-e.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `count-implicit-binary-tree-layers` | relative errorに十分な回数binary searchしてfinal maximum Lを得る。各A_iのminimal depth q_iと2^q_i pieces of A_i/2^q_iをcount mapへ足し、used=Σ(2^q_i-1)を求める。残K-used個のlength L pieceを一つずつsplitした集約差分を反映し、length降順count累積でX-thを出す。 |
| [abc424-f](../../src/content/technique-inventory/shard-05/abc424-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: `detect-crossing-by-cyclic-order` | segment tree leafを未使用0とし、nodeに(sum,minPrefix)を持つ。各[A_i,B_i]について内部rangeをfoldしsum=0かつminPrefix≥0ならYesとしてAへ+1、Bへ-1をpoint updateし、そうでなければNoとして何もしない。 |
| [abc424-g](../../src/content/technique-inventory/shard-05/abc424-g.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: `characterize-bipartite-feasibility-by-hall` | songsをB降順sortしR_kを前計算する。dp[k][s]を処理済みsongsからk曲選び全prefix条件を満たす最大C和とし、skipまたはchooseで(k+1,s+B_j)へ遷移する際s+B_j≤R_{k+1}を課す。全dp最大を出す。 |

### ABC425

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc425-e](../../src/content/technique-inventory/shard-02/abc425-e.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: — | 最大 S まで二項係数表をパスカルの三角形で構築する。s=0 から各 C_i を走査し、答えへ binom(s+C_i,C_i) を掛けて s+=C_i とする。 |
| [abc425-f](../../src/content/technique-inventory/shard-03/abc425-f.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `normalize-equivalent-states` | dp[mask] を mask の位置が残る文字列への到達方法数とし、全位置 mask から開始する。各 mask で残存位置を左から走査し、直前の残存位置と文字が同じでない位置だけを消した mask へ加算する。空 mask の値を答える。 |
| [abc425-g](../../src/content/technique-inventory/shard-00/abc425-g.json) | 維持 | なし | 維持 | P: `query-bitwise-order-with-trie` / C: — / S: `divide-search-space-recursively` | A の値を bit k-1 で B0,B1 に分ける。M が下半分以下、全区間、上下にまたがる場合を分岐し、各 x 側に対応する非空集合へ再帰する。一致側が空なら個数×2^(k-1) を加え、k=0 または M=0 で 0 を返す。 |

### ABC426

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc426-e](../../src/content/technique-inventory/shard-02/abc426-e.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: — | p<q なら人物を入れ替える。時刻 q の長い側の位置 E=A+(q/p)(B-A) を求め、相対位置の端点 A-C と E-D を結ぶ線分から原点への距離、および線分 EB から D への距離の小さい方を返す。 |
| [abc426-f](../../src/content/technique-inventory/shard-02/abc426-f.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: `bound-monotone-total-work` | 遅延セグメント木に各商品の在庫最小値と未枯渇個数を持つ。注文 [l,r],k ごとに未枯渇数·k を暫定答えとし、区間へ -k を加える。区間最小値が負の間、その位置 x を探索し、負の絶対値を答えから引いて x を INF に更新する。 |
| [abc426-g](../../src/content/technique-inventory/shard-02/abc426-g.json) | 維持 | なし | 維持 | P: `divide-search-space-recursively` / C: — / S: `design-resource-dp` | solve(l,r) で m を定め、i=m-1…l の suffix ナップサック dp_l[i][j] と i=m…r の prefix ナップサック dp_r[i][j] を容量 K まで作る。中央をまたぐ各クエリを max_j(dp_l[L][j]+dp_r[R][C-j]) で答え、残りを左右へ再帰する。 |

### ABC427

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc427-e](../../src/content/technique-inventory/shard-02/abc427-e.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: `design-minimal-sufficient-state`、`linearize-static-range-information` | 初期矩形全体と変位 0 を始点に、六変数を key として BFS する。四方向ごとに変位を一つ進め、盤外へ出る側の矩形端を必要なだけ縮める。矩形内の初期ごみが 0 になった最初の距離を返す。 |
| [abc427-f](../../src/content/technique-inventory/shard-04/abc427-f.json) | 維持 | なし | 維持 | P: `split-enumeration-space` / C: — / S: — | 前半・後半について、直前を選んだかを持つ DFS で非隣接部分列だけを列挙し、総和 mod M と境界選択フラグを記録する。剰余頻度を用いて全組を数え、左右の境界要素をともに選ぶ組を同様に差し引く。 |
| [abc427-g](../../src/content/technique-inventory/shard-03/abc427-g.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: `bound-monotone-total-work`、`prove-and-search-threshold` | 長さが互いに異なる 2 冪の良い列ブロックを保持する。追加を長さ 1 の良い列とし、同長ブロックがある間は順序を保って結合・正規化する。質問では古いブロックから順に、各良い列上の切替位置を二分探索してテンションを更新する。 |

### ABC428

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc428-e](../../src/content/technique-inventory/shard-02/abc428-e.json) | 維持 | なし | 維持 | P: `use-tree-diameter-extrema` / C: — / S: — | 頂点番号を tie-break とする距離比較で、任意頂点から最遠点 s、s から最遠点 t を求めて拡張木の直径端を得る。元の木で s,t から全距離を計算し、各 u について距離が大きい端、等しければ番号が大きい端を出力する。 |
| [abc428-f](../../src/content/technique-inventory/shard-01/abc428-f.json) · [指摘](#finding-abc428-f) | 維持 | なし | **変更** | P: `bound-monotone-total-work` / C: — / S: `prove-and-search-threshold` | deque/list に整列ブロックを順に保持する。左または右の整列クエリでは対象端から i_q を含むブロックまで除去し、必要なら残部を切り、新しい整列ブロックを追加する。点を含む区間数の質問はブロック終端を二分探索し、該当ブロック内でも端点式から境界番号を求める。 |
| [abc428-g](../../src/content/technique-inventory/shard-02/abc428-g.json) · [指摘](#finding-abc428-g) | 維持 | なし | **変更** | P: `count-orbits-by-fixed-points` / C: — / S: `decompose-by-prime-or-divisor`、`design-resource-dp` | A(n)[x] を『長さ n、総積 x の順序付き列数』として、宝石の頻度との積約数 DP で n≤V まで前計算する。各 L≤V、d\|L、各完全 d 乗 x=y^d≤U について φ(d)·A(L/d)[y]/L を答え[x]へ加える。 |

### ABC429

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc429-e](../../src/content/technique-inventory/shard-04/abc429-e.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | 全安全頂点 (u,u,0) をキューへ入れる。状態 (v,source,dist) を取り出し、v がその source を既受理なら無視し、未受理で二件未満なら登録して隣接頂点へ dist+1 を伝播する。各危険頂点の二件の距離を足す。 |
| [abc429-f](../../src/content/technique-inventory/shard-04/abc429-f.json) · 所見あり | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: `exponentiate-transition-over-semiring`、`relax-in-dependency-order` | 各列の障害配置から、前列各行から当列各行へ左戻りなしで移る 3×3 の min-plus 遷移行列を作る。セグメント木の積を min-plus 行列積で定義し、更新列の行列を差し替える。初期ベクトルへ全体積を作用させた第3成分を答える。 |
| [abc429-g](../../src/content/technique-inventory/shard-05/abc429-g.json) | 維持 | なし | 維持 | P: `evaluate-compressed-integer-blocks` / C: — / S: `accelerate-fixed-linear-transition` | gcdで(M,A,B,X)を縮約し、完全周期分を幾何級数として加えてN<Mにする。N≤Dなら残るN項を長さ1の列として直接加算する。N>Dなら最初のD≈√M個の剰余から最小差(h,d)を求め、indexをmod dで分割して各列をwrapごとの等差指数列へ切る。各列のΣX^{a+jt}を二分累乗で計算して総和し、縮約時のX^{B_2}を掛ける。 |

### ABC430

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc430-e](../../src/content/technique-inventory/shard-01/abc430-e.json) | 維持 | なし | 維持 | P: `build-prefix-match-state` / C: — / S: — | 衝突しない区切り文字を用いて S=B+'#'+A+A を作り Z 配列を計算する。k=0…N-1 の順に、A+A 側の位置 offset+k の Z 値が N 以上なら k を返し、なければ -1 を返す。 |
| [abc430-f](../../src/content/technique-inventory/shard-05/abc430-f.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: — | S の各位置から左・右へ続く L と R の run 長を四配列で前計算する。i ごとに l_i=leftR(i-1)+rightL(i)+1、r_i=N-leftL(i-1)-rightR(i) を求め、差分[l_i]++, 差分[r_i+1]-- として順位別個数を復元する。 |
| [abc430-g](../../src/content/technique-inventory/shard-01/abc430-g.json) | 維持 | なし | 維持 | P: `prune-range-actions-by-node-invariant` / C: — / S: `accelerate-set-operations-with-bitsets`、`bound-monotone-total-work` | 集合を 64-bit mask とし、各節点に OR、AND、最大 popcount、最大達成葉数、遅延写像 (remove,add) を保持する。完全被覆時に成功条件を満たせば写像と集約を更新し、失敗なら push して子へ再帰する。根の M,C を各質問後に取得する。 |

### ABC431

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc431-e](../../src/content/technique-inventory/shard-03/abc431-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | 四方向を符号化して dist[x][y][dir] を INF で初期化する。各状態から逆向き以外の ndir へ、鏡 A/B/C がその組を接続するなら 0、変更が必要なら 1 の辺で隣接マス状態へ進み、deque による 01-BFS で出口までの最小値を求める。 |
| [abc431-f](../../src/content/technique-inventory/shard-04/abc431-f.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: `maintain-monotone-window` | 値の頻度 cnt を作り、スライド窓で w=cnt[v-D]+…+cnt[v-1] を保つ。各 v で答えに binom(w+cnt[v],cnt[v]) を掛け、窓へ cnt[v] を追加して古い頻度を除く。 |
| [abc431-g](../../src/content/technique-inventory/shard-02/abc431-g.json) | 維持 | なし | 維持 | P: `maintain-ordered-set-statistics` / C: — / S: `compress-sparse-keys`、`linearize-events`、`maintain-weighted-prefix-statistics` | 転倒対数と昇順対数を Fenwick 木で数え、各質問 k を小・同一・大の区間へ分類する。同一なら A を返す。小側質問を k 昇順に処理し、所属 l、suffix 中 A_r<A_l の k' 番目の値、同値 r の降順を順序統計構造で求める。大側も左右の key を反転して対称処理し、選んだ一組だけ swap して出力する。 |

### ABC432

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc432-e](../../src/content/technique-inventory/shard-00/abc432-e.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: — | 各値 j の葉に (count,sum=j·count) を持つセグメント木を構築する。更新では旧値の葉から一つ減らし新値へ加える。照会 l≤r では三範囲の count/sum を取得して式を計算し、l>r は lN を返す。 |
| [abc432-f](../../src/content/technique-inventory/shard-02/abc432-f.json) | 維持 | なし | 維持 | P: `enumerate-subset-state-space` / C: — / S: `prove-greedy-order`、`recover-valid-witness` | 総和が N で割れなければ不可能を出す。全 mask の要素数と和を前計算し、和=X·popcount の mask を一成分として、被覆 mask の最大成分数と復元元を subset DP で求める。復元した各成分を A 降順に並べ、隣接者へ余剰を渡す操作を出力する。 |
| [abc432-g](../../src/content/technique-inventory/shard-04/abc432-g.json) · 所見あり | 維持 | 現順維持 | 維持 | P: `compute-convolution-or-correlation` / C: `encode-counting-by-generating-function` / S: `compute-in-modular-arithmetic`、`formulate-combinatorial-coefficients` | K まで factorial と inverse factorial を前計算する。f[j]=C_b(j)·invfact[j]、g[k]=invfact[k] を作り、NTT convolution h=f*g を求める。i=0…K について C_a(i)·fact[i]·h[i] を足す。 |

### ABC433

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc433-e](../../src/content/technique-inventory/shard-00/abc433-e.json) · [指摘](#finding-abc433-e) | 維持 | なし | **変更** | P: `prove-greedy-order` / C: — / S: `enumerate-frontier-best-first`、`linearize-events` | X,Y の重複を検査し、値から行・列への逆引きを作る。min(X_i,Y_j)=v となるマスを bucket[v] に入れ、v を降順走査する。必須交点を先に検証・使用し、片側必須または自由な値は現在利用可能になった条件適合マスから一つ選ぶ。失敗なら No、全て置ければ行列を出す。 |
| [abc433-f](../../src/content/technique-inventory/shard-03/abc433-f.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: `reorder-counting-contributions` | 各数字の prefix count または左右総数を用意する。i を左から走査し、p=左側の S_i 個数、q=右側の S_i+1 個数を求め、fact/invfact で binom(p+q,p+1) を答えへ足す。 |
| [abc433-g](../../src/content/technique-inventory/shard-02/abc433-g.json) | 維持 | なし | 維持 | P: `build-suffix-automaton` / C: — / S: `classify-game-states` | S を一文字ずつ追加して Suffix Automaton を構築する。状態を len の降順に処理し、出辺先に losing が一つでもあれば winning、なければ losing とする。空文字列を表す初期状態の勝敗から Alice/Bob を答える。 |

### ABC434

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc434-e](../../src/content/technique-inventory/shard-00/abc434-e.json) | 維持 | なし | 維持 | P: `augment-components-with-metadata` / C: — / S: `compress-sparse-keys` | 各端点座標を座標圧縮し、N 本の辺を張る。DSU または DFS で連結成分ごとの頂点数 n と辺数 m を集計し、m=n-1 なら n-1、m≥n なら n を答えへ加える。 |
| [abc434-f](../../src/content/technique-inventory/shard-00/abc434-f.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `build-prefix-match-state` | 各 S_i の Z 配列を前計算し、XY<YX comparator を O(min(\|X\|,\|Y\|)) で実装してソートする。隣接可換対があれば sorted 連結を返す。なければ末尾二要素を入れ替える列と、末尾三要素中の別の隣接入替え列を構成し、連結結果の小さい方を返す。N=2 は定義された一候補を処理する。 |
| [abc434-g](../../src/content/technique-inventory/shard-02/abc434-g.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: — | 葉を数字または B の Data にし、内部節点は左の末尾照会を使って正規化積を構築する。末尾 n 桁照会は右子から必要分を取り、足りなければ左子へ降る。点更新で祖先を再構築し、区間クエリでは canonical nodes を左から順に同じ積で合成して (l,x) を返す。 |

### ABC435

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc435-e](../../src/content/technique-inventory/shard-00/abc435-e.json) | 維持 | なし | 維持 | P: `maintain-ordered-interval-partition` / C: — / S: `bound-monotone-total-work` | set に [1,N] を入れ白マス総数 total=N とする。各 [L,R] で r≥L の最初の区間から l≤R の間だけ erase し、交差長を total から引く。l<L なら [l,L-1]、R<r なら [R+1,r] を insert し、total を出力する。 |
| [abc435-f](../../src/content/technique-inventory/shard-01/abc435-f.json) | 維持 | なし | 維持 | P: `build-cartesian-tree-decomposition` / C: — / S: `aggregate-rooted-tree`、`design-minimal-sufficient-state`、`prune-dominated-candidates-once` | 単調 stack で P の最大 Cartesian Tree を作り、全体最大値 N の位置を根とする。葉から dp[i]=max(dp[left]+\|i-left\|,dp[right]+\|i-right\|) を計算し、存在しない子の候補を除く。根の dp を答える。 |
| [abc435-g](../../src/content/technique-inventory/shard-00/abc435-g.json) | 維持 | なし | 維持 | P: `normalize-common-dp-action` / C: — / S: — | 偶数 k と奇数 k の二つの色 map を管理し、各 map に有効要素数・値和・全体 affine tag を持たせる。k ごとに前の同 parity map 全体へ x→S_{k-4}-x を適用し、C_k へ出入りする色だけ実値化して追加・削除する。sum T_k から S_k を更新する。 |

### ABC436

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc436-e](../../src/content/technique-inventory/shard-01/abc436-e.json) | 維持 | なし | 維持 | P: `decompose-functional-graph` / C: — / S: — | visited 配列で未訪問 i から P を辿りサイクル長 s を得るたび、答えへ s(s-1)/2 を加える。全サイクルを一度ずつ走査して答えを出力する。 |
| [abc436-f](../../src/content/technique-inventory/shard-05/abc436-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `linearize-events`、`maintain-weighted-prefix-statistics` | B_i=1…N の値順に対応位置 i を処理する。Fenwick 木で既処理位置の [1,i) 個数 left と (i,N] 個数 right を求め、(left+1)(right+1) を答えへ加えて位置 i を追加する。 |
| [abc436-g](../../src/content/technique-inventory/shard-05/abc436-g.json) | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `compute-convolution-or-correlation` / S: `factor-and-accelerate-transitions` | 小さな d を選び、各 i の R_i∈[0,d) による A_iR_i の分布を多項式積で作って S の頻度を得る。係数列 c を一点 M で初期化し、S との畳み込みと residue block 集約で c' を作る操作を最大添字が 0 になるまで繰り返し、c[0] を出力する。 |

### ABC437

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc437-e](../../src/content/technique-inventory/shard-02/abc437-e.json) | 維持 | なし | 維持 | P: `index-shared-prefixes-with-trie` / C: — / S: — | root から各 A_i の要素を辿り、map に子がなければ作り、終端節点へ i を追加する。DFS ではまず節点の終端添字を昇順に答えへ追加し、その後 map の key 昇順で子を再帰する。 |
| [abc437-f](../../src/content/technique-inventory/shard-05/abc437-f.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: `design-associative-range-summary` | 各点を (U_i,V_i) に変換し、葉に (minU,maxU,minV,maxV) を持つセグメント木を作る。点更新で四値を差し替える。照会 [L,R],(x,y) では区間四値を取得し、u=x+y,v=x-y との差四候補の最大を返す。 |
| [abc437-g](../../src/content/technique-inventory/shard-02/abc437-g.json) | 維持 | なし | 維持 | P: `model-max-flow-min-cut` / C: — / S: `color-and-classify-bipartite-components`、`recover-valid-witness` | 木を二部彩色し、3N+2 頂点のネットワークを作る。各元辺 u-v について左右の向きを揃え、異色9組中 k1≠k2 の6辺を容量1で張る。最大流が N-1 でなければ不可能。流れた色対を各木辺へ記録し、残存辺を走査して現在色と一致する削除可能辺を一つずつ選び、色更新しながら操作列を構成する。 |

### ABC438

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc438-e](../../src/content/technique-inventory/shard-05/abc438-e.json) | 維持 | なし | 維持 | P: `jump-deterministic-transition` / C: — / S: — | 一回遷移から P[0][i] と Q[0][i] を作る。d ごとに中間 j を介して遷移と和を倍化する。質問では current と water を初期化し、T の立っている bit d ごとに water+=Q[d][current]、current=P[d][current] と更新して答える。 |
| [abc438-f](../../src/content/technique-inventory/shard-02/abc438-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `aggregate-rooted-tree`、`answer-tree-ancestor-queries` | LCA、depth、subtree size を前計算し、距離等式で頂点がパス上か判定する。k を昇順に端点 (x,y) へ追加し、一本のパス性を更新する。成立中は x,y から互い方向の最初の辺を除いた外側成分サイズを求めて積を c_k とし、x=y の場合はその頂点を含む全 i≤j の組を隣接成分サイズから数え、答えへ足す。 |
| [abc438-g](../../src/content/technique-inventory/shard-02/abc438-g.json) | 維持 | なし | 維持 | P: `reduce-integer-structure-by-gcd` / C: — / S: `linearize-events`、`maintain-weighted-prefix-statistics` | まず gcd ごとに A,B の対応剰余類を抽出する。互いに素なクラスで B' を N ステップ順に並べる。各 A_k から出現回数と B' 上の開始・長さを計算し、全周回を分離して余りを1〜2区間質問にする。質問を x=A_k 昇順に並べ、B' の値昇順 sweep と二本の Fenwick 木で count/sum を答えて合計する。 |

### ABC439

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc439-e](../../src/content/technique-inventory/shard-02/abc439-e.json) | 維持 | なし | 維持 | P: `design-lis-frontier` / C: — / S: — | 全組を key (A asc,B desc) でソートする。tails[len] を長さ len+1 の増加部分列の最小末尾として持ち、各 B に lower_bound を行って置換し、tails の長さを答える。 |
| [abc439-f](../../src/content/technique-inventory/shard-05/abc439-f.json) | 維持 | なし | 維持 | P: `reorder-counting-contributions` / C: — / S: `compress-sparse-keys`、`compute-in-modular-arithmetic`、`maintain-weighted-prefix-statistics` | 各位置 l の左側で P_j<P_l の個数 p_l、各 r の右側で P_j<P_r の個数 q_r を Fenwick 木で求める。長さ3の Σp_iq_i を加え、l<r の Σp_l q_r 2^(r-l-1) は r を走査し、値条件に応じた p_l·2^{-l} の集約を Fenwick/segment tree に保持して 2^(r-1)q_r を掛ける。 |
| [abc439-g](../../src/content/technique-inventory/shard-05/abc439-g.json) · [指摘](#finding-abc439-g) | 維持 | 現順維持 | **変更** | P: `compose-series-and-project-powers` / C: `apply-formal-power-series-operations`、`encode-counting-by-generating-function` / S: `compute-convolution-or-correlation`、`divide-search-space-recursively` | D と G=1+…+x^{N-1} に power projection を適用して f_n=[x^{N-1}]D^nG を得て g を差分化する。各 k の (w_k,r_k) から分数 w_k/(1-r_kx) を作り、積木状に分子分母をマージする。総分母の FPS inverse と分子を掛け、係数0…L-2を人1…L-1の答えにし、人Lは Σg_k f_k^{L-1} を直接求める。 |

### ABC440

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc440-e](../../src/content/technique-inventory/shard-00/abc440-e.json) | 維持 | なし | 維持 | P: `enumerate-frontier-best-first` / C: — / S: — | 初期状態 (K,0,…,0) と和 K A_1 を最大ヒープへ入れる。最大状態を取り出して和を出力し、各 C_i>0 に対して C_iを1減らしC_{i+1}を1増やした未訪問状態を、和から A_i−A_{i+1} を引いて追加する。これを X 回繰り返す。 |
| [abc440-f](../../src/content/technique-inventory/shard-04/abc440-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: `prove-greedy-order` | 値 A を添字とするセグメント木に B=1 の個数 c_1、B=2 の個数 c_2、A の総和 s を保持する。更新前の馬を削除して更新後の馬を追加し、0<z<N なら累積個数が z 以上となる最小値 r を木上で探索する。A≤r の集計から余分な同値要素を引いた z 個分の和を求め、そこに B=2 がなければ値 r の一頭を最小の B=2 へ交換し、最後に 2ΣA_i からその和を引く。 |
| [abc440-g](../../src/content/technique-inventory/shard-03/abc440-g.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `augment-components-with-metadata` | 各階を BFS で連結成分分解し、成分重みと隣接階への重複なしの辺を作る。上層側の値が確定する順に dp_1、dp_0 と階境界状態 dv_0、dv_1 を計算する。dv_1[f+1][u][v] では v から上る先 w について、w=u なら dv_0 をそのまま、w≠u なら既訪問の u の重みを加えるため、接続先 ID 付き上位二件から u を除外して最大を取る。同じ上位二件の集約を次の dp 遷移にも用い、各開始成分の答えを前計算する。 |

### ABC441

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc441-e](../../src/content/technique-inventory/shard-03/abc441-e.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: `maintain-weighted-prefix-statistics` | A を +1、B を -1 として prefix 差を作る。各 D_j の処理前に過去頻度の D<D_j を答えへ加え、その後 D_j を登録する。値域を offset して累積頻度または Fenwick tree で管理する。 |
| [abc441-f](../../src/content/technique-inventory/shard-00/abc441-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: — | pre と suf に各側の商品だけで容量以下に得られる最大価値を保存する。X=pre[N][M] を求め、各 i について容量分割を走査して exclude と include の最大値を計算し、その X への一致から分類を出力する。 |
| [abc441-g](../../src/content/technique-inventory/shard-04/abc441-g.json) | 維持 | なし | 維持 | P: `design-range-update-action` / C: — / S: — | 各 node に最大たこ焼き数と両向きの皿数を保存する。追加を (0,b)、反転を (1,0) とし、node 要約への action と oldTag⊕newTag の合成を定義して range apply、全体 max query を処理する。 |

### ABC442

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc442-e](../../src/content/technique-inventory/shard-01/abc442-e.json) | 維持 | なし | 維持 | P: `reduce-geometry-to-algebraic-predicates` / C: — / S: — | 各点を元 index 付きで偏角降順に並べ、外積0かつ内積正の同一半直線を連続 block にする。元 index から L,R へ写し、各 query の円環区間長を二ケースで出力する。 |
| [abc442-f](../../src/content/technique-inventory/shard-04/abc442-f.json) | 維持 | なし | 維持 | P: `factor-and-accelerate-transitions` / C: — / S: — | 各行について j=0..N の塗替え費用を累積個数で求める。前行 dp の suffix minimum を作り、全 j を更新して rolling array へ格納し、最終行の最小値を答える。 |
| [abc442-g](../../src/content/technique-inventory/shard-00/abc442-g.json) | 維持 | なし | 維持 | P: `enumerate-bounded-candidates-or-cases` / C: — / S: — | 各重さの価値を降順に並べ prefix 和を作る。36通りの R を固定して先頭 R_i 個の価値と重量を取り、以後をサイズ6/iごとの group 和へ分割する。group を価値順に選べるだけ加えて最大を更新する。 |

### ABC443

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc443-e](../../src/content/technique-inventory/shard-03/abc443-e.json) | 維持 | なし | 維持 | P: `design-grid-table-dp` / C: — / S: — | 各列の最下壁を求め、最下段の開始列を初期到達にする。i=N-1..1 で三近傍到達を調べ、空きなら dp を立てる。破壊可能な壁なら列の上側を到達済みにして以後の遷移へ使う。 |
| [abc443-f](../../src/content/technique-inventory/shard-04/abc443-f.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: `recover-valid-witness` | 先頭0を除く初期一桁状態を昇順に queue へ入れる。各状態から c=last..9 の次状態を未訪問なら親と桁を記録して追加し、remainder=0 の初回到達から親を辿って文字列を反転する。 |
| [abc443-g](../../src/content/technique-inventory/shard-04/abc443-g.json) | 維持 | なし | 維持 | P: `sum-affine-floors-by-euclid` / C: — / S: — | S1=Σ_{k=0}^{N-1}floor((Ak+B)/M)、S2=Σfloor(((A-1)k+B-1)/M) を floor_sum の符号・係数正規化込みで求め、N-(S1-S2) を返す。 |

### ABC444

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc444-e](../../src/content/technique-inventory/shard-04/abc444-e.json) | 維持 | なし | 維持 | P: `maintain-monotone-window` / C: — / S: `maintain-ordered-set-statistics` | R を単調に進め、A_R の predecessor/successor が十分離れていれば set に挿入する。挿入不能になった位置で L 始まりの valid 区間数 R-L を加え、A_L を削除して次の L へ進む。 |
| [abc444-f](../../src/content/technique-inventory/shard-02/abc444-f.json) | 維持 | なし | 維持 | P: `prove-and-search-threshold` / C: — / S: `evaluate-compressed-integer-blocks` | X の判定ごとに各 A_i の分割木を個数付き長さへ圧縮し、2X-1以上を分割して X 以上の棒を列挙する。必要本数の短いものの和 S と全長-S を使って残り側を所要本数以下に分けられるか確認し、整数二分探索する。 |
| [abc444-g](../../src/content/technique-inventory/shard-02/abc444-g.json) | 維持 | なし | 維持 | P: `represent-integers-as-two-squares` / C: — / S: `decompose-functional-graph` | 2、1 mod4、3 mod4 の素因数を分類し、必要な p=x^2+y^2 を構成する。各因子で可能なガウス剰余の頻度を周期検出して作り、現在分布と C^2×C^2 の積剰余 convolution で merge し、単元 i^k も掛けて目標剰余を読む。 |

### ABC445

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc445-e](../../src/content/technique-inventory/shard-00/abc445-e.json) · [指摘](#finding-abc445-e) | 維持 | なし | **変更** | P: `decompose-by-prime-or-divisor` / C: — / S: — | 篩の最小素因数で全 A_i を分解し、p ごとの top2 指数を更新する。L=∏p^{e1} mod MOD を作り、各 k は L から A_k の指数が e1 である p について p^{e1-e2} の逆元を掛けて出力する。 |
| [abc445-f](../../src/content/technique-inventory/shard-05/abc445-f.json) | 維持 | なし | 維持 | P: `exponentiate-transition-over-semiring` / C: — / S: — | cost を base、min-plus 単位行列を acc とする。K の bit を下から見て、bit が1なら acc=acc⊗base、各段で base=base⊗base と更新し、要求された成分または行列を出力する。 |
| [abc445-g](../../src/content/technique-inventory/shard-02/abc445-g.json) | 維持 | なし | 維持 | P: `solve-bipartite-matching` / C: — / S: `color-and-classify-bipartite-components`、`reduce-integer-structure-by-gcd` | 障害物でないマスを頂点化し、公式の parity 規則で左右部へ分ける。左部から有効な knight 移動先へ容量1辺を張り、source/left と right/sink も容量1で Dinic 等を実行し、空き数-flow を答える。 |

### ABC446

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc446-e](../../src/content/technique-inventory/shard-05/abc446-e.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | 全 x,y∈[0,M) について successor を計算して reverse adjacency へ辺を加える。全 (0,t) を queue に入れて逆到達集合を求め、未訪問状態数を条件を満たさない初期値として数える。 |
| [abc446-f](../../src/content/technique-inventory/shard-05/abc446-f.json) | 維持 | なし | 維持 | P: `select-state-graph-search` / C: — / S: — | 頂点 i と内部辺を順に有効化し、到達済み頂点から i への入辺があれば i を queue に入れる。新規到達頂点から有効な出辺を探索して連鎖到達を広げ、全 graph 上の一歩隣接先を集合/最小前駆集計へ反映する。reachableCount=i なら境界数を返す。 |
| [abc446-g](../../src/content/technique-inventory/shard-02/abc446-g.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: `factor-and-accelerate-transitions` | 値ごとの出現位置列と各 p の C_p を前計算する。番兵 dp[0]=1 を置き、p 昇順に許容左開右開区間を出現位置から得て range sum を dp[p] とし、point add する。dp[1..N] の総和を返す。 |

### ABC447

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc447-e](../../src/content/technique-inventory/shard-01/abc447-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: `maintain-connectivity-components` | DSU を孤立頂点で初期化し、i=M..1 を処理する。端点が別成分で componentCount=2 なら辺 i を削除側へ、そうでなければ残して必要なら union する。powers of two の和を指定 modulus/表現で集計する。 |
| [abc447-f](../../src/content/technique-inventory/shard-00/abc447-f.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: — | 親を除いた子を postorder で処理し、その dp 上位二つを取る。次数3なら dp[v]=1、次数4以上なら dp[v]=1+max child dp とし、端点ケースと二本結合ケースで最大長を更新する。x=1の基底も扱う。 |
| [abc447-g](../../src/content/technique-inventory/shard-00/abc447-g.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: `linearize-events` | prefix/suffix top4 を小配列 merge で作る。c を順に動かし、各 x の M(x) が切り替わるイベントだけを segment tree に point update する。K_{i4}=c の各位置で左区間 top4 と R_{i4+1} を定数全探索して六件価値和を最大化する。 |

### ABC448

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc448-e](../../src/content/technique-inventory/shard-00/abc448-e.json) | 維持 | なし | 維持 | P: `exponentiate-associative-composition` / C: — / S: `compute-in-modular-arithmetic` | 2^k 桁について pow10[k] と rep[k] を doubling 前計算する。各 l_i の bit から R_{l_i} と10^{l_i}を組み、現在値を必要桁 shift して c_i R_{l_i} を加える。最終剰余を M で整数除算する。 |
| [abc448-f](../../src/content/technique-inventory/shard-05/abc448-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: — | 座標幅 W と N から整数 B を選び、key=(floor(x/B), parityに応じた ±y) で sort する。得た巡回列を点1が先頭になるよう rotate して全 index を出力し、末尾から先頭へ戻る。 |
| [abc448-g](../../src/content/technique-inventory/shard-05/abc448-g.json) | 維持 | なし | 維持 | P: `optimize-by-line-envelope` / C: — / S: `localize-change-impact-by-witness` | j=1..3 ごとに残る二列から各行の直線を作り、傾き順の上包絡線と最小点・support setを求める。support 行だけ除外版を個別計算し V_{i,j} を埋める。三成分 vector の重複を消し、定数列の3行零和 game を入れ子三分探索等で解く。 |

### ABC449

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc449-e](../../src/content/technique-inventory/shard-00/abc449-e.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `maintain-weighted-prefix-statistics` | 各値の頻度を数え、(頻度,初出安定順)で P,V を作って stage 累積長を128 bitで計算する。各 query を stage k と周期内 rank v に変換し、k 昇順で P_1..P_k を値 index Fenwickへ追加して kth order statisticを返す。 |
| [abc449-f](../../src/content/technique-inventory/shard-05/abc449-f.json) · [指摘](#finding-abc449-f) | 維持 | なし | **変更** | P: `linearize-events` / C: — / S: — | 各 rectangle を clip して (rL,+interval),(rR+1,-interval) を作る。r 昇順に走査し、前行との差×現在union長を加算してから event を multiset/map構造へ反映する。全合法窓数からunion面積を引く。 |
| [abc449-g](../../src/content/technique-inventory/shard-01/abc449-g.json) · 所見あり | 維持 | 現順維持 | 維持 | P: `encode-counting-by-generating-function` / C: `apply-formal-power-series-operations` / S: — | repunit問題を10冪和へ変換する。多項式 P=(1+x+…+x^9)^{M-1} を微分方程式 recurrence、FPS pow、または convolution二分累乗で次数Nまで求め、prefix和で /(1-x) を反映し、所定mod9の係数を合計して n<N の分を補正する。 |

### ABC450

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc450-e](../../src/content/technique-inventory/shard-05/abc450-e.json) | 維持 | なし | 維持 | P: `query-recursively-defined-string` / C: — / S: — | X,Y の文字別 prefix 頻度を作り、len[k] と total[k][c] を query 最大長で飽和させて K まで計算する。各 query の R,L-1 を prefixCount(K,n) で求めて成分差を出力する。 |
| [abc450-f](../../src/content/technique-inventory/shard-03/abc450-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: `design-range-update-action` | 辺を (X,Y) 方向に整理して X 昇順 sort する。dp 初期状態を segment tree に置き、各辺で必要区間の和を取得し、range multiply 2 と Y への point add/assign を公式遷移順に行う。最終 dp[N] を読む。 |
| [abc450-g](../../src/content/technique-inventory/shard-03/abc450-g.json) · [指摘](#finding-abc450-g) | 維持 | なし | **変更** | P: `solve-stochastic-recurrence` / C: — / S: `normalize-equivalent-states` | modulus 上で C_1=0 から N まで recurrence を回す。pair 一個当たり期待値 C_N/binom(N,2) を求め、sumSq と pairProduct を使って sumSq+2×expectPair×pairProduct を計算する。N=1は別処理する。 |

### ABC451

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc451-e](../../src/content/technique-inventory/shard-04/abc451-e.json) | 維持 | なし | 維持 | P: `reconstruct-tree-from-distance-matrix` / C: — / S: — | 対称化した A を使い、各 i の祖先候補を O(N) 走査して最短の j を選ぶ。候補なしなら No。辺を構築後、各始点から tree DFS で距離を求め、全 A_{i,j} と一致した場合だけ Yes と辺集合を出力する。 |
| [abc451-f](../../src/content/technique-inventory/shard-00/abc451-f.json) | 維持 | なし | 維持 | P: `color-and-classify-bipartite-components` / C: — / S: `augment-components-with-metadata`、`merge-small-into-large` | 各DSU成分に色0・1の頂点数とmember一覧を持ち、globalAns=Σmin(c_0,c_1)を管理する。別成分を結ぶときは両寄与を引き、小さい成分の端点色が大側端点と同じなら全memberの色を反転し、memberを大側へ移してDSUを併合し、新寄与を足す。同一成分の同色辺を見つけたら以後-1を出す。 |
| [abc451-g](../../src/content/technique-inventory/shard-02/abc451-g.json) | 維持 | なし | 維持 | P: `minimize-xor-coset-representative` / C: — / S: `map-graph-cycle-xor-to-span`、`query-bitwise-order-with-trie` | DFSで A_v を計算し、全辺の W'_e を30 bit xor basisへ挿入・reduced canonical formにする。各 A_v を貪欲に小さくして B_v を得る。値を順に binary trieへ追加し、xorがK以下となる既存値数を上位bitから数える。 |

### ABC452

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc452-e](../../src/content/technique-inventory/shard-03/abc452-e.json) | 維持 | なし | 維持 | P: `partition-integer-parameter-ranges` / C: — / S: `linearize-static-range-information` | PA[t]=Σ_{i≤t}A_i、PIA[t]=ΣiA_i を構築する。各 j と k=1..floor(N/j) で l=jk,r=min(j(k+1)-1,N) を取り、B_j((PIA[r]-PIA[l-1])-jk(PA[r]-PA[l-1])) を加算する。 |
| [abc452-f](../../src/content/technique-inventory/shard-01/abc452-f.json) | 維持 | なし | 維持 | P: `maintain-monotone-window` / C: — / S: `maintain-weighted-prefix-statistics` | solve(K) で空 window、inv=0 から R を可能な限り伸ばし、各 L に対して R-L 個を加える。Fenwick frequency で追加寄与と削除寄与を計算する。K<0なら0とし solve(k)-solve(k-1) を返す。 |
| [abc452-g](../../src/content/technique-inventory/shard-05/abc452-g.json) | 維持 | なし | 維持 | P: `build-suffix-lcp-index` / C: — / S: — | S を (v_i,m_i) に圧縮して規則により T を長さO(N)で生成する。T の suffix array・LCP を作り、後ろから各位置の次の0までの長さを求め、suffix順に正部分差を64 bitで合計する。 |

### ABC453

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc453-e](../../src/content/technique-inventory/shard-02/abc453-e.json) | 維持 | なし | 維持 | P: `linearize-events` / C: — / S: `formulate-combinatorial-coefficients` | 階乗・逆階乗を前計算し、各選手の A/B 可否が反転する i=L,R+1,N-R,N-L+1 に event を登録する。i を昇順に進め group count を更新し、valid 条件を満たす C(X_1,i-X_2) を答えへ加える。 |
| [abc453-f](../../src/content/technique-inventory/shard-01/abc453-f.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `find-weighted-balanced-separator`、`prove-greedy-order` | N=2を別処理し、DFSで部分木葉数から centroid X を求める。X削除成分ごとに葉 list を作り、残数最大 heapへ入れる。C_i≥2 の色を異group二葉から開始して容量分配し、最後の一葉はXと同色にする。残頂点を余剰色で埋める。 |
| [abc453-g](../../src/content/technique-inventory/shard-05/abc453-g.json) | 維持 | なし | 維持 | P: `persist-data-structure-versions` / C: — / S: `design-associative-range-summary` | 初期配列からrootを構築する。type1で roots[X]=roots[Y]、type2で persistent pointUpdate(roots[X],p,v) の新rootを代入、type3で rangeQuery(roots[X],l,r) を返す。node poolを配列で確保する。 |

### ABC454

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc454-e](../../src/content/technique-inventory/shard-03/abc454-e.json) | 維持 | なし | 維持 | P: `recover-valid-witness` / C: — / S: `color-and-classify-bipartite-components` | N偶数かつ A+B奇数でなければ No。H,Wを持つ矩形で欠損より上/下に二行余裕があれば対応する蛇行文字列を前後bufferへ追加してHを2減らす。列方向も同様に縮め、2×2の二ケースを接続して答える。 |
| [abc454-f](../../src/content/technique-inventory/shard-05/abc454-f.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: `prove-greedy-order` | N'=floor(N/2) の B を計算し、B_0=B_{N'+1}=0 として N''=N'+1 個の C を0..M-1に正規化する。C を昇順sortし、k=N''-ΣC/M 個のprefix sumを出力する。 |
| [abc454-g](../../src/content/technique-inventory/shard-00/abc454-g.json) | 維持 | なし | 維持 | P: `merge-small-into-large` / C: — / S: — | 最初のDFSでsubtree size、heavy child、Euler区間を求める。solve(v,keep) でlight childをkeep=false、heavyをtrueで処理し、light各Euler区間とvをaddする。答え(mx,num[mx])を保存し、keep=falseなら触れた範囲をresetする。 |

### ABC455

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc455-e](../../src/content/technique-inventory/shard-00/abc455-e.json) | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `linearize-static-range-information` | 空prefixを含め各位置の count差を更新する。三つのscalar keyと一つのpair keyについて、現在までの同key頻度を各 f へ加えてから頻度を増やす。全区間数から包除式で答える。 |
| [abc455-f](../../src/content/technique-inventory/shard-03/abc455-f.json) · [指摘](#finding-abc455-f) | 維持 | なし | **変更** | P: `design-range-update-action` / C: — / S: `reorder-counting-contributions` | leafを(len=1,sum=A_i,sumSq=A_i^2)で初期化する。lazy dのapplyで二momentを公式更新し、range addを処理する。query nodeの S,Q から (S^2-Q)/2 をmodulus上で返す。 |
| [abc455-g](../../src/content/technique-inventory/shard-01/abc455-g.json) | 維持 | なし | 維持 | P: `compare-algebraic-objects-by-random-fingerprint` / C: — / S: `design-and-bound-randomized-algorithm`、`maintain-monotone-window` | 二つの数え上げを別scanする。第一は値ごとに周期B_kで総和0となるrandom weightを割当てprefix hash一致をwindow mapで数える。第二はrightごとのちょうどB_k distinctとなるleft区間を更新し、集合Hが変わるsegmentごとに key=S_iB_k-Hi の頻度を追加して一致数を得る。 |

### ABC456

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc456-e](../../src/content/technique-inventory/shard-03/abc456-e.json) | 維持 | なし | 維持 | P: `peel-directed-graph-toward-cycles` / C: — / S: — | 各open状態を頂点化し、wからw mod W+1へstay辺と各道路両方向辺を条件付きで追加する。全頂点に三色DFSを行いback edgeを見つけるか、indegree削除後に残る頂点があるかでYes/Noを返す。 |
| [abc456-f](../../src/content/technique-inventory/shard-02/abc456-f.json) · 所見あり | 維持 | なし | 維持 | P: `maintain-queue-aggregate-with-swag` / C: — / S: `exponentiate-transition-over-semiring` | 各日の min-plus matrix [[INF,0],[A_i,A_i]] を作る。SWAGで順序付き長さK積をslideし、初期vector (0,A_{l-1}) へ作用させた休日終了stateの最小を答えへ反映する。端点ケースを番兵INFで処理する。 |
| [abc456-g](../../src/content/technique-inventory/shard-04/abc456-g.json) · 所見あり | 維持 | なし | 維持 | P: `correct-overlap-by-inversion` / C: — / S: `formulate-combinatorial-coefficients`、`maintain-modular-product-under-factor-updates` | Sをxでsplitしてrun長frequencyを作り、階乗・逆階乗・2冪を前計算する。k=0..Nで各distinct nの f(n,k) をmの交代和から求め、frequency乗してF_kを作る。F_k-F_{k-1}を所望の分布として出力する。 |

### ABC457

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc457-e](../../src/content/technique-inventory/shard-04/abc457-e.json) | 維持 | なし | 維持 | P: `prove-greedy-order` / C: — / S: — | interval pair頻度をset/mapに持ち、左端bucketに右端、右端bucketに左端をsortする。内部interval存在判定用に端点極値の累積配列を作る。各(S,T)で完全一致の有無を分岐し、定数個のcount/極値/binary search条件を評価する。 |
| [abc457-f](../../src/content/technique-inventory/shard-01/abc457-f.json) | 維持 | なし | 維持 | P: `normalize-common-dp-action` / C: — / S: `design-minimal-sufficient-state` | 末尾二要素の基底dpを置き、iを降順に進める。global multiplierで全stateの一括倍率をlazy保持し、必要なstate i+D_iを実値化して最大・第二最大遷移の二点を加算する。条件不一致なら下位順位遷移を0にする。 |
| [abc457-g](../../src/content/technique-inventory/shard-02/abc457-g.json) | 維持 | なし | 維持 | P: `optimize-poset-antichain-by-dilworth` / C: — / S: `design-lis-frontier`、`reduce-geometry-to-algebraic-predicates` | 各appleを(u_i,v_i)へ変換しpair昇順sortする。vを順に見て、狭義減少LIS相当として -v の狭義LISまたはlower_bound規約を使うpatience sortingを行い、その長さを出力する。 |

### ABC458

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc458-e](../../src/content/technique-inventory/shard-04/abc458-e.json) | 維持 | なし | 維持 | P: `formulate-combinatorial-coefficients` / C: — / S: — | 階乗・逆階乗を総長まで前計算し、part(n,k)=C(n-1,k-1)を範囲外0で実装する。四endpoint caseそれぞれで可能iを走査し、part(X1,r1)part(X3,r3)C(total-boundaries,X1+X3)を加算する。 |
| [abc458-f](../../src/content/technique-inventory/shard-05/abc458-f.json) | 維持 | 現順維持 | 維持 | P: `build-multi-pattern-automaton` / C: `run-dp-on-finite-automaton` / S: `accelerate-fixed-linear-transition` | 全patternをtrieへ入れfailure linkとcomplete gotoをBFS構築し、terminal伝播する。safe node間で26文字の遷移をcountしたmatrixを作り、root one-hot vectorをbinary exponentiationでN回遷移させ、safe state成分を総和する。 |
| [abc458-g](../../src/content/technique-inventory/shard-04/abc458-g.json) | 維持 | なし | 維持 | P: `maintain-piecewise-linear-convex-function` / C: — / S: `prove-and-search-threshold` | feasible(m)をdp[0][m]=0の一点折れ線で初期化する。各日、global切片・傾きへA_i,-B_iを加え、左右端を値0との交点までtrimし、C_iに基づき左側の傾きstackをpop/extendする。最後にx=0がdomain内ならtrueとし、mを整数二分探索する。 |

### ABC459

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc459-e](../../src/content/technique-inventory/shard-04/abc459-e.json) | 維持 | なし | 維持 | P: `aggregate-rooted-tree` / C: — / S: `formulate-combinatorial-coefficients` | rooted treeをpostorder DFSし、S_i=C_i+ΣS_child、T_i=D_i+ΣT_childを計算する。各iでS_i≥T_iを確認し、falling productまたは階乗前計算でbinom(S_i-T_i+D_i,D_i)を求めてmod積へ掛ける。 |
| [abc459-f](../../src/content/technique-inventory/shard-04/abc459-f.json) | 維持 | なし | 維持 | P: `solve-isotonic-regression-by-pav` / C: — / S: — | shift後Aを左から処理し、blockに(l,r,sum)を持つ。top二blockの均し列境界値が非単調ならsum・lengthを合併する。確定blockごとにquotient/remainderから最終Bを復元し、元AからBへの必要操作数を公式に集計する。 |
| [abc459-g](../../src/content/technique-inventory/shard-04/abc459-g.json) | 維持 | なし | 維持 | P: `characterize-integer-solvability` / C: — / S: `enumerate-bounded-candidates-or-cases`、`optimize-univariate-convex-function` | gcdでscaleを除き到達可否を確認する。c1,c2∈{0,1}ごとに二座標方程式をextgcdでparameter化し、目的f(n,m)を作る。折れ目直線pair全ての交点を有理数で求め、floor座標±2を評価して最小値を返す。 |

### ABC460

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc460-e](../../src/content/technique-inventory/shard-01/abc460-e.json) | 維持 | なし | 維持 | P: `solve-modular-constraints` / C: — / S: — | pow10を128 bitまたは飽和で順に更新する。各dでa=10^d-1、step=M/gcd(a,M) とし floor(Xmax/step) をx個数にする。d桁y範囲をclipした個数との積を加算する。 |
| [abc460-f](../../src/content/technique-inventory/shard-00/abc460-f.json) | 維持 | なし | 維持 | P: `design-associative-range-summary` / C: — / S: `answer-tree-ancestor-queries`、`use-tree-diameter-extrema` | Euler tour+RMQまたはbinary liftingでLCAとdist(u,v)を前計算する。segment tree leafは黒なら(v,v)、白ならempty。内部nodeは左右の端点候補最大pairを選び、各queryのleaf更新後root端点距離を出力する。 |
| [abc460-g](../../src/content/technique-inventory/shard-01/abc460-g.json) | 維持 | なし | 維持 | P: `compose-dynamic-tree-clusters` / C: — / S: `reroot-tree-aggregation` | compress/rake等でstatic top treeを構築し、問題のvertex stateに対するpath/point cluster DPと両方向merge式を定義する。flipでleaf値を反転してcluster祖先を更新し、query root v周囲をcoverするcluster要約を方向を揃えてmergeして答える。 |

### ABC461

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc461-e](../../src/content/technique-inventory/shard-04/abc461-e.json) | 維持 | なし | 維持 | P: `maintain-weighted-prefix-statistics` / C: — / S: — | 列latest type2を表すBITと行latest type1を表すBIT、rowLast・colLastを用意する。type1はrowLast=0ならN、そうでなければそれ以後の列latest数を加える。type2はcolLast以後の行latest数を引き、自typeのlatest markerを更新する。 |
| [abc461-f](../../src/content/technique-inventory/shard-04/abc461-f.json) | 維持 | なし | 維持 | P: `design-resource-dp` / C: — / S: `decompose-by-prime-or-divisor` | 全約数をsortし積値からindexへのmapを作る。各dについてbを降順、積cを走査し、c%d=0ならdp0[b][c]+=old0[b-1][c/d]、dp1+=old1+old0×d と更新する。Σ_b dp1[b][N]b!を返す。 |
| [abc461-g](../../src/content/technique-inventory/shard-04/abc461-g.json) | 維持 | なし | 維持 | P: `solve-bipartite-matching` / C: — / S: — | A_vを左部、B_vを右部として2N頂点を作り、各元辺に二本のcross edgeを追加する。Hopcroft-Karpまたはunit-capacity max-flowで最大matching μを求め、1013×(2N-μ)を出力する。 |

### ABC462

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc462-e](../../src/content/technique-inventory/shard-05/abc462-e.json) | 維持 | なし | 維持 | P: `normalize-equivalent-states` / C: — / S: `optimize-univariate-convex-function` | X,Yを絶対値化する。evenSolveでA,BとX,Yを必要に応じswapし、g((X+Y)/2),g(Y)を計算してminを返す。X+Y奇数なら有効な(X-1,Y)+Aと(X,Y-1)+BのevenSolveを比較する。 |
| [abc462-f](../../src/content/technique-inventory/shard-00/abc462-f.json) | 維持 | なし | 維持 | P: `design-minimal-sufficient-state` / C: — / S: — | 元Sの各位置でZ_i=(S_{i-2..i}=ABC)、X_i=Z_{i-2}+Z_{i-1}+Z_i、Y_i=Hamming(S_{i-2..i},ABC)を前計算する。j=0..Kで dp[i][j]=min(dp[i-3][j-1+X_i]+Y_i,dp[i-1][j+Z_i]) を範囲内だけ評価する。 |
| [abc462-g](../../src/content/technique-inventory/shard-00/abc462-g.json) · [指摘](#finding-abc462-g) | 維持 | なし | **変更** | P: `correct-overlap-by-inversion` / C: — / S: `compute-convolution-or-correlation`、`encode-counting-by-generating-function` | C,Gの値frequency X,Yとfactorialを前計算する。各kでj=0..min(X_k,Y_k)の係数を作り、size順にNTT convolutionしてfを得る。ans=invFact[N]×Σ_i f_i×fact[N-i]をmodulus上で計算する。 |

### ABC463

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc463-e](../../src/content/technique-inventory/shard-04/abc463-e.json) | 維持 | なし | 維持 | P: `model-and-compute-shortest-path` / C: — / S: — | N+2頂点graphを作り、M本道路と各iの二本の超頂点接続、中央辺を追加する。指定sourceからpriority queue Dijkstraを実行し、各元頂点のdistを出力する。 |
| [abc463-f](../../src/content/technique-inventory/shard-04/abc463-f.json) · [指摘](#finding-abc463-f) | 維持 | なし | **変更** | P: `normalize-equivalent-states` / C: — / S: `formulate-combinatorial-coefficients` | 各選手初期勝数と対戦pairから六mを集計し、factorial・inverse・2冪を前計算する。W+1caseとWcaseで公式のP,K,xを設定し、候補人数wについて各試合class由来選手の優勝確率/人数をbinomial項で加算する。 |
| [abc463-g](../../src/content/technique-inventory/shard-01/abc463-g.json) · [指摘](#finding-abc463-g) | 維持 | なし | **変更** | P: `formulate-combinatorial-coefficients` / C: — / S: `schedule-range-query-updates` | 階乗・逆階乗・2冪を最大Nまで用意し、内部queryを(N,M)に変換してMo block順にsortする。current N,M,f,gを四方向のO(1)式で移動し、-X+2((N+X)f-2g)/2^Nを各queryへ保存する。 |

### ABC464

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc464-e](../../src/content/technique-inventory/shard-04/abc464-e.json) | 維持 | なし | 維持 | P: `reverse-update-time` / C: — / S: `design-grid-table-dp` | H×W配列markを0で初期化し各query iでmark[R_i][C_i]=iへ更新する。r=H..1,c=W..1の順にdown/right最大を伝え、timestamp0なら初期値、正なら対応X_timestampを各cellへ出力する。 |
| [abc464-f](../../src/content/technique-inventory/shard-00/abc464-f.json) · [指摘](#finding-abc464-f) | 維持 | なし | **変更** | P: `split-enumeration-space` / C: — / S: `reorder-counting-contributions` | 左右subsetを(size,sum)で全列挙する。右をsize別vectorに分けsortしprefix sumを作る。各左subsetと右size kでlimit=X-sumL未満のprefix長を二分探索し、count×(A_all-sumL)-sumRtotalを共通係数 1/C(N,s)/(N-s) で加算する。 |
| [abc464-g](../../src/content/technique-inventory/shard-04/abc464-g.json) · 所見あり | 維持 | なし | 維持 | P: `optimize-path-matching-by-contraction` / C: — / S: `linearize-static-range-information`、`prove-greedy-order` | 固定端込み差分を作り0位置間距離Dを列挙する。各D_iをmin-heapへ入れ、alive linked listを持つ。最小iを選んで累積costを記録し、隣接edgeを削除して新edge D_left+D_right-D_iを挿入する。必要な1増加数/2回分のprefix costを答える。 |

### ABC465

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc465-e](../../src/content/technique-inventory/shard-00/abc465-e.json) | 維持 | なし | 維持 | P: `count-prefix-constrained-objects` / C: — / S: — | Nのdecimal文字列を左から走査し、各stateから上限digit以下を遷移する。mask=0でd=0ならmaskを増やさず、他はbit dを立てる。最終mask・mod3が問題条件を満たすstateを合計し、数0の扱いを調整する。 |
| [abc465-f](../../src/content/technique-inventory/shard-04/abc465-f.json) | 維持 | なし | 維持 | P: `linearize-static-range-information` / C: — / S: — | 10^6配列に各ID weightを加える。k=0..5で全indexを走査しdigit_k>0ならzeta[idx]+=zeta[idx-10^k]とする。queryはmask0..63で bound_k=(mask bit?x_k-1:y_k)、符号(-1)^{popcount}を付けzeta[bound]を合計する。 |
| [abc465-g](../../src/content/technique-inventory/shard-03/abc465-g.json) | 維持 | なし | 維持 | P: `maintain-ordered-interval-partition` / C: — / S: `compress-sparse-keys`、`linearize-static-range-information` | queryに現れる座標と必要境界でc_xおよびc_x×xのprefixを用意する。ordered setでAのrun端を円環上に保持し、toggle時に左右neighborを探して旧run寄与を引き新run寄与を足す。全M剰余が埋まるcaseと一欠けcaseを別前計算する。 |

### ABC466

| 問題 | P の判定 | C / home の判定 | S の判定 | 現分類 | Inventory の解法概要 |
|---|---|---|---|---|---|
| [abc466-e](../../src/content/technique-inventory/shard-05/abc466-e.json) | 維持 | なし | 維持 | P: `design-prefix-partition-dp` / C: — / S: `prove-greedy-order` | j=1..2K+1のdpを-∞で初期化し、cardを左から処理する。face(j)の値を加えたうえで old[j]から継続、old[j-1]から境界開始の最大を取る。空segment規約に応じprefix maxでskipを許し、最終全jの最大を返す。 |
| [abc466-f](../../src/content/technique-inventory/shard-03/abc466-f.json) | 維持 | なし | 維持 | P: `bound-monotone-total-work` / C: — / S: — | multisetをend→count mapとend順priority queueで持つ。mod Mを処理する際、各distinct xのcountを取り出し、full countをend Mへ加え、remainder>0ならend remainderへ加える。同一endをcombineし、最終multisetから要求統計を計算する。 |
| [abc466-g](../../src/content/technique-inventory/shard-05/abc466-g.json) | 維持 | 現順維持 | 維持 | P: `design-carry-or-mixed-radix-dp` / C: `maintain-potential-differences` / S: — | 各Sから区間長を引き非負問題へ変換する。weighted DSUでB_{L-1},B_Rを差Sでunionし矛盾を検出、成分内隣接prefixから独立区間式を抽出する。carry vector DPをbit0..29で回し、各bitのN-bit maskからnext carryを更新する。 |

## 参照した現 Outcome の定義

全件表の短い ID だけで意味を取り違えないため、使用中の Outcome statement を列挙する。ここは現 build の転記であり、修正案の新 Outcome ではない。

| Outcome（outcome- 省略） | 現 statement |
|---|---|
| `accelerate-fixed-linear-transition` | 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 |
| `accelerate-iteration-by-characteristic-p-frobenius` | 標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `accelerate-set-operations-with-bitsets` | 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 |
| `accelerate-tree-dp-by-heavy-path` | heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `add-conway-number-games` | 全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `aggregate-rooted-tree` | 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 |
| `aggregate-subsequence-transitions-by-value` | 末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `aggregate-value-prefix-by-buckets` | 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。 |
| `allocate-by-convex-marginal-costs` | 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。 |
| `answer-idempotent-range-query` | 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `answer-tree-ancestor-queries` | binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 |
| `apply-formal-power-series-operations` | 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。 |
| `apply-heavy-light-decomposition` | heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。 |
| `apply-subset-zeta-mobius-transform` | Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `approximate-rational-by-euclid` | Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。 |
| `augment-components-with-metadata` | 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 |
| `balance-heavy-light-threshold` | 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `bound-monotone-total-work` | 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。 |
| `bound-reachability-in-numerical-semigroup` | 正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。 |
| `build-balanced-separator-decomposition` | 各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。 |
| `build-cartesian-tree-decomposition` | 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。 |
| `build-component-merge-tree` | 成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `build-finite-string-automaton` | 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。 |
| `build-laminar-interval-containment-tree` | laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。 |
| `build-multi-pattern-automaton` | 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。 |
| `build-prefix-match-state` | 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。 |
| `build-shortest-path-certificate` | 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。 |
| `build-static-sorted-range-index` | 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `build-suffix-automaton` | endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。 |
| `build-suffix-lcp-index` | 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。 |
| `build-virtual-tree` | 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。 |
| `characterize-bipartite-feasibility-by-hall` | 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 |
| `characterize-integer-solvability` | 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。 |
| `characterize-palindrome-intervals` | 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。 |
| `classify-game-states` | 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。 |
| `classify-tree-by-distance-residue` | 木の一つの基準点から全頂点への距離を求め、距離の剰余類と局所構造から各頂点の役割や周期的な部品構造を分類できる。 |
| `close-eventual-dp-tail` | 余分な歩行を訪問済みの最良状態での反復へ移す交換論を示し、有限prefix DPと閉形式のtailへ分離できる。 |
| `color-and-classify-bipartite-components` | 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 |
| `compare-algebraic-objects-by-random-fingerprint` | multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compare-sequences-by-rolling-fingerprint` | 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compose-dynamic-tree-clusters` | 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。 |
| `compose-finite-functions` | 小さな有限集合上の関数を遷移表として表し、適用順を保ってprefix・区間の作用を合成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compose-series-and-project-powers` | 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compress-dp-sufficient-aggregates` | 遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。 |
| `compress-sparse-keys` | 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 |
| `compute-all-pairs-distance` | 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。 |
| `compute-binomial-by-lucas` | 素数pのもとでn,kをp進展開し、Lucasの定理 C(n,k)=∏C(n_i,k_i) mod pで、n≥pでも階乗の零除算を避けて計算できる。 |
| `compute-convolution-or-correlation` | 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 |
| `compute-directed-walk-period` | 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。 |
| `compute-edit-distance` | 二つの列prefixを状態にし、一致・挿入・削除・置換の編集費用を最小化できる。閾値Kの判定では長さ差の下界から\|i-j\|≤Kの対角帯だけを計算できる。 |
| `compute-in-finite-field-extension` | 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。 |
| `compute-in-modular-arithmetic` | 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 |
| `compute-online-relaxed-convolution` | 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compute-subset-convolution` | 互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `compute-transitive-closure` | 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。 |
| `condense-and-order-directed-graph` | 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。 |
| `construct-degree-parity-subgraph` | 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `construct-euler-trail-or-circuit` | 全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `construct-optimal-spanning-tree` | cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。 |
| `contract-monotone-paths-with-jump-pointers` | 一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `correct-overlap-by-inversion` | 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 |
| `count-combinatorial-objects-by-determinant` | 辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。 |
| `count-euler-circuits-by-best` | 有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `count-implicit-binary-tree-layers` | 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。 |
| `count-labeled-structures-by-components` | 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。 |
| `count-nonintersecting-paths-by-lgv` | DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。 |
| `count-orbits-by-fixed-points` | 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。 |
| `count-prefix-constrained-objects` | 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。 |
| `count-symmetric-strings-under-lex-bound` | 鏡映対称な文字列を自由な前半で一意に表し、辞書順上限以下の個数を前半prefixの基数値と、等号境界の完成文字列一候補との比較で求められる。 |
| `count-through-cyclic-exponents` | 巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。 |
| `decompose-by-prime-or-divisor` | 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。 |
| `decompose-expectation-by-additive-potential` | 対称な確率過程の期待費用を頻度別関数の和へ分離し、自己ループを含む一段方程式と終端の較正から吸収までの期待費用を求められる。 |
| `decompose-functional-graph` | 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 |
| `decompose-ranges-into-segment-tree-nodes` | 区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。 |
| `derive-coefficient-recurrence-by-differentiation` | 母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。 |
| `derive-mst-weight-from-threshold-components` | 重み閾値以下のグラフの成分数からMST重みを層別和として導き、辺追加時に各閾値の連結性を更新して最適重みを維持できる。 |
| `design-and-bound-randomized-algorithm` | 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 |
| `design-associative-range-summary` | 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 |
| `design-carry-or-mixed-radix-dp` | 整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。 |
| `design-frontier-profile-dp` | 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。 |
| `design-grid-table-dp` | グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。 |
| `design-interval-expansion-dp` | 訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `design-interval-split-dp` | 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 |
| `design-lis-frontier` | 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `design-minimal-sufficient-state` | 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 |
| `design-order-preserving-dp` | 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。 |
| `design-prefix-partition-dp` | 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `design-query-code-by-information-bound` | 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。 |
| `design-range-update-action` | 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。 |
| `design-resource-dp` | 資源軸の上限と更新順を選び、選択の重複を避けられる。 |
| `detect-crossing-by-cyclic-order` | 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。 |
| `detect-improving-cycles` | 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。 |
| `determinize-automaton-by-subsets` | 同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `divide-search-space-recursively` | pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 |
| `dualize-planar-cut-to-path` | 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `encode-counting-by-generating-function` | 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。 |
| `encode-labeled-trees-by-prufer-code` | Prüfer列とlabel付き木の全単射、および各labelの出現回数=次数-1を使って次数制約を係数条件へ変換できる。 |
| `encode-threshold-constraints-as-two-sat` | 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。 |
| `enumerate-bounded-candidates-or-cases` | 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 |
| `enumerate-by-reversible-backtracking` | 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。 |
| `enumerate-frontier-best-first` | 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `enumerate-subset-state-space` | bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 |
| `enumerate-subsets-by-mask` | 集合のbitmask表現から全部分集合と共通要素を列挙し、集合間のDP遷移を必要としない計数に利用できる。 |
| `evaluate-adversarial-game-value` | 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。 |
| `evaluate-at-geometric-points` | 評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。 |
| `evaluate-compressed-integer-blocks` | 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。 |
| `evaluate-polynomial-at-many-points` | 任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。 |
| `evolve-run-length-encoded-state` | 同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `expand-euler-product-sparsely` | Eulerの五角数定理により∏(1−x^i)を符号付きの疎な係数列へ展開し、必要次数までのO(√N)項で係数抽出できる。 |
| `exploit-modular-periodicity` | 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 |
| `exponentiate-associative-composition` | 反復対象を閉じた結合的要約へ持ち上げ、monoidの二分累乗で巨大な連結・合成を評価できる。 |
| `exponentiate-transition-over-semiring` | 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。 |
| `extract-rational-series-coefficient` | P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `factor-and-accelerate-transitions` | 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 |
| `factor-separable-linear-transform` | Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。 |
| `find-orbit-hit-by-bsgs` | 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる。 |
| `find-period-by-multiplicative-order` | 合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。 |
| `find-rooted-cycle-by-shortest-path-branches` | 根からの最短路木で第一枝の異なる頂点を結ぶ辺を列挙し、二本の木上経路と合わせて根を通る最小閉路を求められる。 |
| `find-weighted-balanced-separator` | 非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。 |
| `flatten-tree-by-euler-order` | Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。 |
| `formulate-combinatorial-coefficients` | 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 |
| `identify-bridges-and-articulations` | DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。 |
| `index-shared-prefixes-with-trie` | 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。 |
| `invert-divisor-lattice-by-mobius` | 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `invert-generating-function-equation` | F=xΦ(F)からLagrange反転 [x^n]F=[t^(n−1)]Φ(t)^n/nを導き、形式的条件と法上の除算可能性を確認して係数問題へ変換できる。 |
| `jump-deterministic-transition` | 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。 |
| `kernelize-near-tree-graph` | terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `linearize-events` | 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 |
| `linearize-static-range-information` | prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。 |
| `localize-change-impact-by-witness` | 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。 |
| `maintain-connectivity-components` | 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 |
| `maintain-interactive-query-protocol` | judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。 |
| `maintain-local-sequence-links` | 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。 |
| `maintain-modular-product-under-factor-updates` | 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。 |
| `maintain-monotone-window` | 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。 |
| `maintain-order-through-crossing-events` | 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。 |
| `maintain-ordered-interval-partition` | 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-ordered-set-statistics` | 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-piecewise-linear-convex-function` | 区分線形凸関数を左右breakpointのheapと定数項で表し、\|x-a\|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-potential-differences` | DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。 |
| `maintain-queue-aggregate-with-swag` | queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-sparse-domain-segment-tree` | 巨大または疎な座標域で訪れたnodeだけを生成し、区間要約と境界探索をO(log U)で保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `maintain-weighted-prefix-statistics` | 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 |
| `maintain-xor-linear-basis` | 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `map-graph-cycle-xor-to-span` | spanning treeのroot-to-vertex XOR potentialで辺ラベルをfundamental cycleのXORへ変換し、cycle spaceの線形像が非木辺ごとのcycle XORのspanと一致することを示して、walkへ挿入できるXOR値をbasisで表せる。 |
| `merge-small-into-large` | 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `minimize-maximum-xor-by-bit-partition` | 最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `minimize-xor-coset-representative` | XOR部分空間の基底をpivot bitごとにreduced formへ整え、高位bitから基底を加減してaffine cosetの最小整数代表を一意に得る。正規化写像の線形性を示し、二値のXOR最小化を各値の正規化へ分離できる。 |
| `model-and-compute-shortest-path` | 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。 |
| `model-max-flow-min-cut` | 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `model-min-cost-flow` | 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `normalize-common-dp-action` | 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。 |
| `normalize-equivalent-states` | 対称操作で同値な状態の標準形と不変量を選べる。 |
| `normalize-string-to-primitive-period` | prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-by-lagrangian-relaxation` | 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-by-line-envelope` | 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。 |
| `optimize-mask-by-bitwise-feasibility` | 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-monge-transitions` | quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-path-matching-by-contraction` | 重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。 |
| `optimize-poset-antichain-by-dilworth` | 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。 |
| `optimize-ratio-by-parametric-search` | 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。 |
| `optimize-stochastic-actions` | 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。 |
| `optimize-tree-order-by-cluster-contraction` | 親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。 |
| `optimize-univariate-convex-function` | 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `optimize-weighted-matroid-basis` | 独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `partition-at-critical-integer-boundaries` | 成立判定が変わり得る整数境界を全て列挙し、隣り合う境界の間で判定が一定であることを示して、代表点判定と区間長で整数解の個数を求められる。 |
| `partition-integer-parameter-ranges` | floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。 |
| `pass-resource-dp-through-heavy-recursion` | 外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `peel-directed-graph-toward-cycles` | 三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。 |
| `peel-graph-core` | 連結成分のE−V+1から独立な閉路数を判定し、E=Vなら唯一のcycleを持つことを示せる。必要なら次数1以下の頂点を反復削除し、残るcoreと削除順を求められる。 |
| `persist-data-structure-versions` | 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `precompute-directional-grid-effects` | 各行・各列でactiveな向きだけを更新し、blockerと通行禁止条件を混同せず、定数方向へ伸びる全効果領域をgrid全体の線形時間で印付けられる。 |
| `process-dag-in-topological-order` | 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `propagate-probability-distribution` | 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。 |
| `propagate-static-graph-potentials` | 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。 |
| `prove-and-search-threshold` | 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 |
| `prove-greedy-order` | 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 |
| `prune-dominated-candidates-once` | 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。 |
| `prune-range-actions-by-node-invariant` | nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `query-bitwise-order-with-trie` | 整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。 |
| `query-recursively-defined-string` | 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。 |
| `reconstruct-tree-from-distance-matrix` | 加法的距離行列から正重み木の候補を復元し、全点対距離の再計算で存在を完全検証できる。 |
| `recover-valid-witness` | 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 |
| `recur-by-edge-deletion-contraction` | 辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `reduce-geometry-to-algebraic-predicates` | 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。 |
| `reduce-integer-structure-by-gcd` | gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。 |
| `relax-in-dependency-order` | DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。 |
| `remove-boundaries-by-reflection` | 最初に境界を破るpathとの鏡像対応を構成し、壁付きwalkの数え上げを符号付きの無境界問題へ変換できる。 |
| `reorder-counting-contributions` | 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。 |
| `represent-convex-intersection-by-halfplanes` | 凸多角形を向き付き辺の線形半平面制約へ変換し、平行移動後も左辺が同じ制約を最強の右辺へ集約して共通部分への包含を判定できる。 |
| `represent-integers-as-two-squares` | Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `reroot-tree-aggregation` | 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。 |
| `restrict-geometric-candidates-to-boundary` | 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。 |
| `reverse-update-time` | 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。 |
| `rollback-reversible-updates` | 更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `run-dp-on-finite-automaton` | 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `schedule-range-query-updates` | 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。 |
| `select-state-graph-search` | 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。 |
| `share-threshold-checks-by-parallel-binary-search` | 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。 |
| `shift-polynomial-by-factorial-convolution` | 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。 |
| `slide-transition-recurrence` | 隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。 |
| `solve-bipartite-matching` | 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-cyclic-minimax-game` | 終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-difference-constraints` | 差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。 |
| `solve-flow-with-lower-bounds` | 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-game-by-parity-invariant` | 合法手が独立な固定候補の消費に限られる場合や、成分分類から残手数の偶奇を求められる場合に、勝敗を決める偶奇量と応答戦略を証明し、局面ごとのDPなしで勝者を判定できる。 |
| `solve-isotonic-regression-by-pav` | 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-linear-system-and-rank` | 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-min-weight-general-perfect-matching` | 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。 |
| `solve-modular-constraints` | 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。 |
| `solve-steiner-tree-by-subset-dp` | terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-stochastic-recurrence` | 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。 |
| `solve-weighted-bipartite-matching` | assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `solve-xor-threshold-matching` | 整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。 |
| `split-enumeration-space` | 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。 |
| `stabilize-unbounded-knapsack-by-best-density` | 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。 |
| `subtract-exception-transitions` | 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。 |
| `sum-affine-floors-by-euclid` | Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。 |
| `sum-multiplicative-function-by-min25-sieve` | floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `sum-piecewise-linear-integer-ranges` | 整数区間上の一次関数包絡を交点の前後で分け、各affine blockの値を等差数列和で合計できる。 |
| `sweep-connectivity-by-kruskal-threshold` | 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。 |
| `test-linear-matroid-intersection-rank` | 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。 |
| `translate-sequences-by-rsk` | 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `traverse-stern-brocot-ancestors` | 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 |
| `use-cycle-space-basis` | 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。 |
| `use-tree-diameter-extrema` | 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。 |

## 報告の限界

これは Inventory を前提にした意味的レビューであり、公式問題や実装の再検証ではない。特に Inventory が backend を明示しない技能では、必要な抽象操作までは指摘するが、特定の実装を採用したと補っていない。必須修正なしという判定も、教材上の別の home がすべて誤りという主張ではない。
