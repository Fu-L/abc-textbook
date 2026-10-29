---
title: "木DP・集約・rerooting"
description: "「木DP・集約・rerooting」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 131
---

# 木DP・集約・rerooting

導入対象の目安: **水色（1200–1599）**。部分木から親へ渡す要約を定め、根の移動やpath上の合成へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

木の一部を計算し終えたとき、残りの計算へ何を渡せばよいだろうか。辺を一本切ると二つの成分に分かれることを使い、片側の情報を短く要約する。一つの根の答えが欲しければ子から親へ集約し、すべての頂点を根にした答えが欲しければ逆向きの情報も共有する。

## 考え方

### 辺の片側から何を渡すか

独自の小例として、頂点が $$r,a,b,c$$、辺が $$r\text{–}a,a\text{–}b,r\text{–}c$$ の木を考える。各辺の長さは1とする。$$r$$ を根にすると、$$a$$ の子が $$b$$、$$r$$ のもう一つの子が $$c$$ である。[木の索引化](/learn/tree/tree-decomposition/)でも同じ木を使う。

各頂点から全頂点への距離の和を求めたい。辺 $$r\text{–}a$$ を切ると、$$a$$ 側は $$\{a,b\}$$、$$r$$ 側は $$\{r,c\}$$ に分かれる。$$r$$ から $$a$$ 側のどの頂点へ行くにも、最初にこの辺を通る。そこで $$a$$ 側の全頂点を毎回たどる代わりに、**頂点数と、受け手から測った距離の和**だけを渡す。

辺 $$u\text{–}v$$ を切った $$u$$ 側について、$$v$$ へ渡す要約を message（メッセージ）と呼び、$$m(u\to v)=(\mathrm{count},\mathrm{sumDist})$$ と書く。`count`はその側の頂点数、`sumDist`は受け手 $$v$$ からその各頂点への距離の和である。この小例では $$m(a\to r)=(2,1+2)=(2,3)$$。逆向きの $$m(r\to a)$$ が表す集合は $$\{r,c\}$$ であり、値が同じ $$(2,3)$$ でも別の側の情報である。

### 自身の追加と、辺を渡る変換を分ける

一つの頂点へ入るメッセージ同士は、成分ごとの和でまとめられる。空の集合の要約は $$(0,0)$$。葉 $$b$$ では、ここへ自身を加えて $$(1,0)$$ とし、辺を一歩渡すと $$m(b\to a)=(1,1)$$ になる。

$$a$$ では、$$b$$ から届いた $$(1,1)$$ へ自身を加えると $$(2,1)$$。さらに $$r$$ へ渡すと、二頂点への距離がそれぞれ1増えるので $$(2,3)$$ になる。一般に、自身を加える前の要約を $$(C,S)$$ とすると、

$$
(C,S)\xrightarrow{\text{自身を追加}}(C+1,S)
\xrightarrow{\text{長さ1の辺を渡る}}(C+1,S+C+1)
$$

となる。$$r$$ の答えを取り出すときは、$$a,c$$ から届いた $$(2,3),(1,1)$$ に自身を加え、$$(4,4)$$ の距離和4を読む。答えを取り出す頂点から、さらに辺を渡る変換は行わない。

隣接する各方向の成分は重ならず、そこへ現在の頂点を一度加えると対象全体になる。また、受け手から片側の各頂点への経路は送信側を必ず通るため、辺長だけ距離を増やせばよい。これが、この要約を合成できる理由である。重み付きの辺長が $$w$$ なら、辺を渡る際は頂点数を変えず、距離和へ「頂点数 $$\times w$$」を加える。

### 一つの根か、すべての根か

一つの根や各部分木の答えだけが必要なら、葉から子を先に処理して親へ渡す。$$r$$ を根にした小例では、$$b\to a$$ と $$c\to r$$ を作り、次に $$a\to r$$ を作ればよい。この流れで、距離和に限らず「親へ何を渡せば十分か」を学ぶのが[根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)である。

全頂点の答えが必要なら、根を変えて同じDFSを繰り返すと頂点数を $$N$$ として $$O(N^2)$$ かかる。既にある子側の要約を再利用し、今度は親から子へも渡したい。$$r\to a$$ を作る際は、$$a$$ から来た分を除き、$$c$$ からの $$(1,1)$$ と $$r$$ 自身だけをまとめて渡す。$$a$$ から来た分も含めると、$$\{a,b\}$$ の情報を $$a$$ 側へ送り返して重複させてしまう。

このように子から親、次いで親から子の二方向を計算すれば、各頂点で全方向の情報がそろう。小例の距離和は $$r,a,b,c$$ の順に $$4,4,6,6$$ となる。各送信先の方向だけを除く合成を効率よく共有する方法は、[rerooting・全方位木DP](/learn/tree/rerooting/)へ進む。距離和なら引き算も使えるが、一般の集約では元に戻す演算があるとは限らない。逆元を必要としないprefix・suffixによる除外は、そこで学ぶ。

## 成立条件と計算量

まず、片側の詳細を捨てても、受け手の計算に必要な情報が残るかを確かめる。上の距離和では距離の増分が頂点数に比例するため、距離和だけでなく頂点数も必要だった。閉路のあるグラフでは、辺を切った両側が独立するという説明をそのまま使えない。

根付き集約は、定数個の状態を一辺あたり定数時間で合成できれば、根と処理順を作る前処理も含めて時間 $$O(N)$$、隣接リスト・状態・探索用領域を含めて空間 $$O(N)$$。全方位でも、結合的な合成と空集合の単位元があり、一方向を除く合成を隣接方向数に比例する時間でまとめて作れるなら、同じ時間・空間で求められる。送信先ごとに他の全方向を走査し直すと、星形の木で二乗時間になる。

子の順に依存する演算では順序を保持する。状態が多項式や容量配列ならその長さと合成費用を含め、木だから線形と結論しない。葉では空集合から自身を加え、一頂点だけの木でも距離和は0となる。

概念上の親: [木構造](/learn/tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- heap番号で暗黙に表された完全二分木の区間算術、木上パスの連続区間分解、重心による再帰分解、および更新のためのTop Tree cluster化。

## 下位単元

- [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/) — 水色
- [rerooting・全方位木DP](/learn/tree/rerooting/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC246 G「Game on Tree 3」](https://atcoder.jp/contests/abc246/tasks/abc246_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h) — 主題: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)（heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC293 Ex「Optimal Path Decomposition」](https://atcoder.jp/contests/abc293/tasks/abc293_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC298 Ex「Sum of Min of Length」](https://atcoder.jp/contests/abc298/tasks/abc298_h) — 主題: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)（成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g) — 主題: [virtual tree・auxiliary tree](/learn/tree/virtual-tree/)（対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。

## 根拠

ABC220 Fの公式問題文・公式解説を2026-10-29に再照合した。公式解説は、全頂点からの距離和を、部分木サイズと根の移動による差分で線形時間に求める方針を示す。上のメッセージ表現と4頂点の小例は、その方針を一般の集約へつなぐための本書独自の説明である。

- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC223 G 公式解説](https://atcoder.jp/contests/abc223/editorial/2775)
- [ABC223 G 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_g)
- [ABC239 E 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_e)
- [ABC239 E 公式解説](https://atcoder.jp/contests/abc239/editorial/3385)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-tree-aggregation`
